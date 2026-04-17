import express from 'express';
import cors from 'cors';
import axios from 'axios';
import iconv from 'iconv-lite';

const app = express();
// 开启跨域允许前端无缝接驳
app.use(cors());

// 全局内存级基金特征库缓存
let globalFundList = [];

// 启动时拉取全网基金基准数据库
const fetchFundDatabase = async () => {
    try {
        console.log("正在拉取天天基金全网基础数据库...");
        const response = await axios.get('http://fund.eastmoney.com/js/fundcode_search.js');
        // 返回格式为 var r = [["000001","HXCZHH","华夏成长混合"...]];
        const match = response.data.match(/var r = (\[.*\]);/);
        if (match) {
            const rawArray = JSON.parse(match[1]);
            globalFundList = rawArray.map(item => ({
                id: item[0],       // 代码
                pinyin: item[1],   // 缩写拼音
                name: item[2],     // 基金名称
                type: item[3],     // 基金类型
                fullPinyin: item[4]// 全拼
            }));
            console.log(`🎯 全网基金数据库命中，独立内存加载成功，共收纳 ${globalFundList.length} 只基金！`);
        }
    } catch (e) {
        console.error("拉取基金基础库彻底失败:", e);
    }
};

fetchFundDatabase();

/**
 * 【全网基金雷达模糊搜索接口】
 *  接受代码、拼音、汉字搜索，返回前20只补全联想
 */
app.get('/api/fund/search', (req, res) => {
    const keyword = (req.query.keyword || '').toLowerCase();
    if (!keyword) {
        return res.json({ success: true, data: [] });
    }
    
    const results = [];
    for (const fund of globalFundList) {
        if (fund.id.includes(keyword) || 
            fund.name.includes(keyword) || 
            fund.pinyin.toLowerCase().includes(keyword) || 
            fund.fullPinyin.toLowerCase().includes(keyword)) {
            
            results.push(fund);
            if (results.length >= 20) break; // 防止前端渲染卡顿，只取前20个
        }
    }
    
    res.json({ success: true, data: results });
});

/**
 * 【全球大盘行情网关接口】
 *  由该接口向新浪财经隐藏的原生底层服务器发送请求拉取大盘快照数据
 *  支持境内三大指数以及亚太、欧美核心指数
 */
app.get('/api/market/indexes', async (req, res) => {
    try {
        // 请求代号：上证，深证，创业板，科创50，纳斯达克，标普500，恒生指数，日经，台湾加权
        const codes = 's_sh000001,s_sz399001,s_sz399006,s_sh000688,int_nasdaq,int_sp500,int_hangseng,int_nikkei,b_TWII';
        
        const response = await axios.get(`http://hq.sinajs.cn/list=${codes}`, {
            responseType: 'arraybuffer', // 新浪接口为古老的 GBK 编码，需以流的形式接收
            headers: {
                'Referer': 'http://finance.sina.com.cn/' // 伪装成新浪的站内流量，避开防盗链
            }
        });
        
        // 使用 iconv-lite 对 GBK 进行中文强制转码清洗
        const data = iconv.decode(response.data, 'gbk');
        
        // 将凌乱的 JS 变量代码段切割并格式化为标准 JSON 数据阵列
        const lines = data.split('\n').filter(line => line.trim() !== '');
        const indexes = lines.map(line => {
            const match = line.match(/var hq_str_([^" \n]+)="([^"]*)";/);
            if (!match) return null;
            const [, code, infoStr] = match;
            const parts = infoStr.split(',');
            
            return {
                code,
                name: parts[0],
                // 强制将金额转化为带逗号的人类阅读模式，保留两位小数
                value: Number(parts[1]).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}),
                changeNum: Number(parts[2]),
                change: (Number(parts[3]) > 0 ? '+' : '') + Number(parts[3]).toFixed(2) + '%',
                up: Number(parts[3]) >= 0
            };
        }).filter(Boolean);

        res.json({ success: true, data: indexes });
    } catch (err) {
        console.error('抓取大盘数据崩溃:', err);
        res.status(500).json({ success: false, error: '大盘网络信道暂时中断' });
    }
});

/**
 * 【天天基金净值实时预估接口】
 *  专门接收基金代码抓取当天的实时变动跳跃波幅
 */
app.get('/api/fund/realtime', async (req, res) => {
    const codesParam = req.query.codes || '161725'; 
    const codes = codesParam.split(',');
    
    try {
        // 利用 Promise.all 瞬间打出高并发异步请求进行暴力爬取
        const promises = codes.map(async (code) => {
            try {
                // 加时间戳防止CDN强缓存
                const response = await axios.get(`http://fundgz.1234567.com.cn/js/${code}.js?rt=${Date.now()}`, {
                    headers: { 'Referer': 'http://fund.eastmoney.com/' },
                    timeout: 3000 // 防止死链挂起
                });
                
                const match = response.data.match(/jsonpgz\((.*)\);/);
                if (match) {
                    return JSON.parse(match[1]);
                }
                return null;
            } catch (err) {
                return null; // 单个挂了不影响全局
            }
        });
        
        const results = await Promise.all(promises);
        const validResults = results.filter(Boolean); // 剔除可能挂掉的数据
        
        res.json({ success: true, data: validResults });
    } catch (err) {
        console.error('批量抓取基金净值崩溃:', err);
        res.status(500).json({ success: false, error: '公募基金数据中枢连接中断' });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`[核心网关] 代理服务端已在端口 ${PORT} 启动，隐形火力全开！`);
});
