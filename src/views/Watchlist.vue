<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';

interface WatchItem {
  id: string;
  name: string;
  netValue: string;
  dailyChange: string;
  weekChange: string;
  monthChange: string;
  estValue: string;
  isUp: boolean;
  isEstUp: boolean;
}

const watchList = ref<WatchItem[]>([]);
const myFunds = ref<string[]>([]);

// 搜索栏状态
const searchKeyword = ref('');
const searchResults = ref<any[]>([]);
const isSearching = ref(false);
let searchTimeout: any = null;

// 从浏览器本地空间提取个人的自选配置
const loadLocalFunds = () => {
    const saved = localStorage.getItem('my_funds');
    if (saved) {
        myFunds.value = JSON.parse(saved);
    } else {
        // 如果是新用户，初始带几只热门名基
        myFunds.value = ['161725', '005827', '003095', '000001'];
        saveLocalFunds();
    }
};

const saveLocalFunds = () => {
    localStorage.setItem('my_funds', JSON.stringify(myFunds.value));
};

// 触发真正的公网抓取
const fetchFundsData = async () => {
    if (myFunds.value.length === 0) {
        watchList.value = [];
        return;
    }
    try {
        const res = await axios.get(`/api/fund/realtime?codes=${myFunds.value.join(',')}`);
        if(res.data.success) {
            watchList.value = res.data.data.map((d: any) => ({
                id: d.fundcode,
                name: d.name,
                netValue: d.dwjz, // 昨日确认单位净值
                dailyChange: (Number(d.gszzl) >= 0 ? '+' : '') + d.gszzl + '%', // 今日盘中实时估算涨跌幅
                weekChange: '--', // 接口不提供，留白
                monthChange: '--', 
                estValue: d.gsz, // 今日盘中实时估值
                isUp: Number(d.gszzl) >= 0,
                isEstUp: Number(d.gszzl) >= 0,
            }));
        }
    } catch(err) {
        console.error("并发刷新真实基金数据失败", err);
    }
};

// 防抖实时搜索网络请求
const onSearchInput = () => {
    if (searchTimeout) clearTimeout(searchTimeout);
    if (!searchKeyword.value.trim()) {
        searchResults.value = [];
        isSearching.value = false;
        return;
    }
    
    isSearching.value = true;
    searchTimeout = setTimeout(async () => {
        try {
            const res = await axios.get(`/api/fund/search?keyword=${searchKeyword.value}`);
            if (res.data.success) {
                searchResults.value = res.data.data;
            }
        } catch(e) {
            console.error(e);
        } finally {
            isSearching.value = false;
        }
    }, 400); // 400ms 后才向服务端发起请求，避免按键极速狂飙
};

// 将选中的基金代码插入本地存储并重新拉盘
const handleAddFund = (fund: any) => {
    if (!myFunds.value.includes(fund.id)) {
        myFunds.value.push(fund.id);
        saveLocalFunds();
        fetchFundsData(); // 秒刷数据
    } else {
        alert("该基金已存在于您的自选列表中！");
    }
    // 隐藏气泡
    searchKeyword.value = '';
    searchResults.value = [];
};

const handleUnwatch = (id: string) => {
  if (confirm('确定要取消自选基金吗？')) {
    myFunds.value = myFunds.value.filter(code => code !== id);
    saveLocalFunds(); // 物理删除
    fetchFundsData(); // 刷新表格
  }
};

const showComingSoon = () => {
    alert('批量导出管理功能开发中...');
};

onMounted(() => {
    loadLocalFunds();
    fetchFundsData();
});
</script>

<template>
  <div>
    <!-- 顶部栏 -->
    <div class="top-bar" style="flex-direction: row; justify-content: space-between; margin-bottom: 30px;">
      <div class="topsearch" style="margin-bottom: 0; position: relative;">
        <!-- 改装为双向绑定并附带监控事件的真实搜索框 -->
        <input 
            class="searchname" 
            type="text" 
            placeholder="输入全网任意基金代码、拼音或关键词回车..." 
            v-model="searchKeyword"
            @input="onSearchInput"
        >
        
        <!-- 下拉高能搜索结果悬浮面板 -->
        <div v-if="searchKeyword.trim() !== ''" class="search-dropdown">
            <div v-if="isSearching" class="search-status">正在全量基础库中进行模糊探明...</div>
            <div v-else-if="searchResults.length === 0" class="search-status">很抱歉，代码/名称未能匹对到公募库</div>
            <div v-else class="search-result-item" v-for="item in searchResults" :key="item.id" @click="handleAddFund(item)">
                <span class="search-code">{{ item.id }}</span>
                <span class="search-name">{{ item.name }}</span>
                <span class="search-type">{{ item.type }}</span>
            </div>
        </div>
      </div>
      <div class="user-info" style="position: static;">
        <div class="user-avatar">罗</div>
      </div>
    </div>

    <!-- 自选列表 -->
    <div class="content-card">
      <div class="content-card-header">
        <h3 class="content-card-title">我的自选基金池 (本周跳动)</h3>
        <div>
          <button class="btn btn-secondary" @click="showComingSoon">导出/备份</button>
        </div>
      </div>
      <div class="content-card-body">
        <table class="data-table">
          <thead>
            <tr>
              <th>基金代码</th>
              <th>全网公募名称</th>
              <th>前日单位确认净值</th>
              <th>今日盘中估算振幅</th>
              <th>近一周</th>
              <th>近一月</th>
              <th>此刻盘中估值</th>
              <th>操作区</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in watchList" :key="item.id">
               <!-- 添加一个炫酷的小动画表示数据是从真实网络冲回来的 -->
              <td style="font-family: monospace; font-weight: bold; color: #666;">{{ item.id }}</td>
              <td style="font-weight: 500;">{{ item.name }}</td>
              <td>¥{{ item.netValue }}</td>
              <!-- 根据网络上抛回的数值正负号决定使用原生的 class 着色 -->
              <td :class="item.dailyChange.includes('+') ? 'up-color' : 'down-color'">{{ item.dailyChange }}</td>
              <td style="color: #999;">{{ item.weekChange }}</td>
              <td style="color: #999;">{{ item.monthChange }}</td>
              <!-- 估算净值 -->
              <td :class="item.isEstUp ? 'up-color' : 'down-color'" style="font-weight: bold;">¥{{ item.estValue }}</td>
              <td>
                <button class="btn btn-danger" @click="handleUnwatch(item.id)">取消收录</button>
              </td>
            </tr>
            <tr v-if="watchList.length === 0">
               <td colspan="8" style="text-align: center; color: gray; padding: 40px;">
                    监控池没有任何标记代码，赶快在顶栏里搜索纳入您的星标名录吧！
               </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 悬浮强阻拦搜索框样式 */
.search-dropdown {
    position: absolute;
    top: 55px; /* 在搜索框正下方排布 */
    left: 0;
    width: 100%;
    background: #ffffff;
    border: 1px solid #e0e0e0;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    max-height: 380px;
    overflow-y: auto;
    z-index: 100; /* 以最高顺位压制在底层组件上方 */
}

/* 自走式平滑弹动 */
.search-dropdown {
    animation: slideDown 0.2s ease-out;
}

@keyframes slideDown {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
}

.search-status {
    padding: 20px;
    text-align: center;
    color: #999;
    font-size: 13px;
}

.search-result-item {
    display: flex;
    align-items: center;
    padding: 12px 20px;
    cursor: pointer;
    border-bottom: 1px solid #f5f5f5;
    transition: background-color 0.2s;
}

.search-result-item:last-child {
    border-bottom: none;
}

.search-result-item:hover {
    background-color: #fbeee6; /* 搜索选中触怒高亮 */
}

.search-code {
    font-weight: bold; 
    color: #d32f2f; 
    margin-right: 15px;
    width: 60px;
    font-family: monospace;
}

.search-name {
    flex: 1;
    color: #333;
    font-weight: 500;
}

.search-type {
    color: #999; 
    font-size: 12px;
    background: #f5f5f5;
    padding: 3px 8px;
    border-radius: 4px;
}
</style>
