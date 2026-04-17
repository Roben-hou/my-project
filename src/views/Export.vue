<script setup lang="ts">
import { ref } from 'vue';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const exportFormat = ref('pdf');
const isExporting = ref(false);
// 通过 ref 获取隐藏的 PDF DOM 模板印记
const pdfTemplateRef = ref<HTMLElement | null>(null);

// 一份供审计的极端逼真虚拟交易流水单
const mockTransactions = [
  { date: '2024-03-01', type: '基金派息', orderId: 'TRX_84812', amount: '+¥ 840.00', balance: '¥ 85,500.00' },
  { date: '2024-03-05', type: '活期转入', orderId: 'TRX_84815', amount: '+¥ 2,000.00', balance: '¥ 87,500.00' },
  { date: '2024-03-12', type: '市场剧烈回撤', orderId: 'TRX_84820', amount: '-¥ 1,200.00', balance: '¥ 86,300.00' },
  { date: '2024-04-02', type: '活期利息结算', orderId: 'TRX_84901', amount: '+¥ 54.20', balance: '¥ 86,354.20' },
  { date: '2024-04-08', type: '分红提现', orderId: 'TRX_84910', amount: '-¥ 300.00', balance: '¥ 86,054.20' },
  { date: '2024-04-10', type: '手动加仓买入', orderId: 'TRX_84922', amount: '-¥ 5,000.00', balance: '¥ 81,054.20' },
];

/**
 * 原生拼接大字符组，强制附加 BOM 头 \uFEFF 防止系统自带的古老 Excel 打开中文乱码
 */
const generateCSV = () => {
  let csvContent = '账务日期,发生业务摘要,核心系统流水号,收付变动金额,当期最终余额\n';
  mockTransactions.forEach(t => {
    // 处理带逗号的金额，必须用双引号包覆，避开 CSV 的逗号解析限制
    csvContent += `${t.date},${t.type},${t.orderId},"${t.amount}","${t.balance}"\n`;
  });
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = '系统底层原始表.csv';
  link.click();
};

/**
 * 动用 XLSX 工业级库组建标准的 Excel 表单，完全还原表头映射架构
 */
const generateExcel = () => {
  const wsData = mockTransactions.map(t => ({
    '账务产生日期': t.date,
    '业务运作摘要': t.type,
    '核心识别系统流水号': t.orderId,
    '收支发生额': t.amount,
    '账户总结余': t.balance
  }));
  const ws = XLSX.utils.json_to_sheet(wsData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, '历史财务对账单明细');
  XLSX.writeFile(wb, '分析平台高级数据导出.xlsx');
};

/**
 * 采用 截图渲染+印迹组合 策略
 * 瞬间将离屏藏的账单 HTML DOM 印成高清图片，封装入标准 A4 PDF 卡中
 */
const generatePDF = async () => {
  if (!pdfTemplateRef.value) return;
  // 短暂让其显示出来让照相机截图，但强制绝对定位在屏幕极深处不干扰用户界面
  pdfTemplateRef.value.style.display = 'block';
  try {
    const canvas = await html2canvas(pdfTemplateRef.value, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    // 指定纸张 A4 尺寸
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    // 依比例计算渲染图片的纵观高度
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('官方电子签章对账单留存.pdf');
  } finally {
    pdfTemplateRef.value.style.display = 'none'; // 印发完毕后收回隐身
  }
};

const handleExport = async () => {
  isExporting.value = true;
  try {
    if (exportFormat.value === 'csv') generateCSV();
    else if (exportFormat.value === 'excel') generateExcel();
    else if (exportFormat.value === 'pdf') await generatePDF();
  } catch (error) {
    alert('引擎故障：导出组件生成彻底失败，请按 F12 查重重试');
    console.error(error);
  } finally {
    isExporting.value = false;
  }
};
</script>

<template>
  <div class="view-wrapper">
    <div class="top-bar" style="margin-bottom: 20px;">
      <h2>导出报表</h2>
      <div style="color: #666; font-size: 14px;">内置三擎驱动，随时拉取任何历史维度的纸质级与数据级金融流水</div>
    </div>

    <!-- 核心仪表控制台 -->
    <div class="content-card" style="max-width: 600px; margin: 0 auto; margin-top: 40px;">
      <div class="content-card-header">
        <h3 class="content-card-title">调度出报配置</h3>
      </div>
      <div class="content-card-body">
        
        <div style="margin-bottom: 20px;">
          <label style="display: block; font-weight: 600; margin-bottom: 8px;">报表时间范围</label>
          <div style="display: flex; gap: 10px;">
            <input type="date" class="searchname" style="width: 200px;" value="2024-01-01">
            <span style="line-height: 40px; color: #666;">至</span>
            <input type="date" class="searchname" style="width: 200px;" value="2024-12-31">
          </div>
        </div>

        <div style="margin-bottom: 30px;">
          <label style="display: block; font-weight: 600; margin-bottom: 8px;">导出基建格式限定</label>
          <select v-model="exportFormat" class="searchname" style="width: 100%;">
            <option value="pdf">📄 PDF 权威电子水单（带隐形签章栏板）</option>
            <option value="excel">📊 Excel 高级工业详参数据表</option>
            <option value="csv">📝 CSV 底层逗号制原生源文件</option>
          </select>
        </div>

        <button 
          class="btn btn-primary" 
          style="width: 100%; padding: 12px; font-size: 16px; display: flex; justify-content: center; gap: 10px;" 
          @click="handleExport"
          :disabled="isExporting"
        >
           <span v-if="isExporting">打印机预热与系统组装演算中...</span>
           <span v-else>立即生成并将文件直传至本机</span>
        </button>
      </div>
    </div>

    <!-- 这一块只在背后默默奉献：隐形的 PDF 底纹排版槽位 -->
    <div ref="pdfTemplateRef" class="pdf-container" style="display: none;">
      <div class="pdf-header">
         <h2>个人综合理财大盘管理平台</h2>
         <p>电子对账单及流水鉴证文书 (效力验证版)</p>
      </div>
      <div class="pdf-meta">
        <div><strong>提取账户持有人:</strong> 罗先生</div>
        <div><strong>印发系统日期:</strong> 2024-04-17</div>
        <div><strong>资金追踪跨度:</strong> 2024-01-01 至 当期</div>
      </div>
      <table class="pdf-table">
         <thead>
           <tr>
             <th>账单落实日期</th>
             <th>发生业务系统名称</th>
             <th>加密追踪识别号</th>
             <th style="text-align: right;">红字或绿字发生额</th>
             <th style="text-align: right;">当时结转总余额</th>
           </tr>
         </thead>
         <tbody>
           <!-- 此处提取并填装上面的 mockTransactions 高级流水假数据 -->
           <tr v-for="(t, idx) in mockTransactions" :key="idx">
             <td>{{ t.date }}</td>
             <td>{{ t.type }}</td>
             <td style="font-family: monospace; color: #666;">{{ t.orderId }}</td>
             <td style="text-align: right; color: #d32f2f;" v-if="t.amount.includes('+')">{{ t.amount }}</td>
             <td style="text-align: right; color: #388e3c;" v-else>{{ t.amount }}</td>
             <td style="text-align: right; font-weight: bold; background-color: #fafafa;">{{ t.balance }}</td>
           </tr>
         </tbody>
      </table>
      <div class="pdf-footer">
          警告与说明：此纸质对账单由分析底层引擎基于快照逻辑自动合成，仅供用户本人在本地脱机查验个人资金调配历程。<br/>
          特许加密追溯号: DOC-8488219491002 | 本平台拒绝任何外泄行为负责。
      </div>
    </div>

  </div>
</template>

<style scoped>
/* 针对离线生成 PDF 排版的严苛控制级样式 
   这些配置不会破坏浏览器的任何 CSS，因为它将永远隐藏在屏幕之外 */
.pdf-container {
    width: 794px; /* 精确锁定 A4 纸宽度 210mm 对应的 px */
    padding: 60px;
    background: #fff;
    color: #111;
    font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Microsoft YaHei', sans-serif;
    position: absolute;
    top: -9999px; /* 让它死死卡在视界之外去进行重磅计算与拍照 */
    left: 0;
}
.pdf-header {
    text-align: center;
    border-bottom: 2px solid #000;
    padding-bottom: 20px;
    margin-bottom: 30px;
}
.pdf-header h2 {
    font-size: 28px;
    letter-spacing: 2px;
    margin: 0 0 10px 0;
}
.pdf-header p {
    color: #666;
    margin: 0;
    font-size: 14px;
}
.pdf-meta {
    display: flex;
    justify-content: space-between;
    margin-bottom: 30px;
    font-size: 14px;
    background-color: #f6f6f6;
    padding: 15px;
    border-radius: 4px;
}
.pdf-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 50px;
}
.pdf-table th, .pdf-table td {
    border: 1px solid #e0e0e0;
    padding: 14px;
    font-size: 14px;
}
.pdf-table th {
    background-color: #f1f2f5;
    font-weight: bold;
    color: #333;
}
.pdf-footer {
    text-align: center;
    font-size: 12px;
    color: #999;
    line-height: 1.8;
    margin-top: 50px;
    padding-top: 20px;
    border-top: 1px dashed #ccc;
}
</style>
