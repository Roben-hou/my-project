<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import * as echarts from 'echarts';

const mode = ref('day'); // 'day', 'week', 'month', 'year'

// 根据不同周期尺度生成相应量级的合理假数据
const generateFakeData = (count: number, labelFormatter: (i: number) => string, multiplier: number) => {
  return Array.from({ length: count }, (_, i) => {
    // 亏赚分明，随机范围涵盖大额亏赚
    const val = (Math.random() - 0.4) * multiplier; 
    return {
      label: labelFormatter(i),
      value: val,
      isProfit: val >= 0
    };
  });
};

// 日是每一天的数据，周是一周的收益，月是一年每个月，年是往年
const dayData = generateFakeData(31, (i) => `${i + 1}日`, 1000);
const weekData = generateFakeData(4, (i) => `第${i + 1}周`, 5000);
const monthData = generateFakeData(12, (i) => `${i + 1}月`, 15000);
const yearData = generateFakeData(5, (i) => `${2020 + i}年`, 80000);

const currentData = computed(() => {
  if (mode.value === 'day') return dayData;
  if (mode.value === 'week') return weekData;
  if (mode.value === 'month') return monthData;
  return yearData;
});

const selectedLabel = ref('');
const selectedDetails = ref<{name: string, value: number}[]>([]);

const handleCellClick = (item: {label: string, value: number, isProfit: boolean}) => {
  selectedLabel.value = item.label;
  const funds = ['东方红产业升级混合', '招商中证白酒指数', '易方达蓝筹精选', '广发纳斯达克100 ETF', '富国天惠成长'];
  let details = funds.map(name => {
    // 根据当前格子的盈亏造出一些合理的子基金波动
    const val = (Math.random() - 0.5) * Math.abs(item.value) * 1.5;
    return { name, value: val };
  });
  // 必须按收益由高到低排序
  details.sort((a, b) => b.value - a.value);
  selectedDetails.value = details;
};

const formatCurrency = (val: number) => {
  if (val > 0) return '+' + val.toFixed(0);
  if (val < 0) return '-' + Math.abs(val).toFixed(0); // 必须明确带上负号
  return '0';
};

const lineChartRef = ref<HTMLElement | null>(null);
let lineChartInstance: echarts.ECharts | null = null;

onMounted(() => {
  if (lineChartRef.value) {
    lineChartInstance = echarts.init(lineChartRef.value);
    const option = {
      tooltip: { trigger: 'axis' },
      grid: { left: '4%', right: '5%', bottom: '3%', containLabel: true },
      xAxis: { type: 'category', boundaryGap: false, data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '本月'] },
      yAxis: { type: 'value' },
      series: [
        {
          name: '累计盈亏',
          type: 'line',
          data: [-500, 800, 1500, 2100, 1800, 3200, 4500, 4100, 5600, 6800, 8400, 18500],
          smooth: true,
          itemStyle: { color: '#d32f2f' },
          areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{offset:0, color: 'rgba(211,47,47,0.3)'},{offset:1, color: 'rgba(211,47,47,0)'}]) },
          lineStyle: { width: 3 }
        }
      ]
    };
    lineChartInstance.setOption(option);
  }
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  lineChartInstance?.dispose();
});

const handleResize = () => {
  lineChartInstance?.resize();
};
</script>

<template>
  <div class="view-wrapper">
    <!-- 盈亏总览 -->
    <div class="stats-grid" style="margin-bottom: 20px;">
      <div class="stat-card">
        <div class="stat-card-title" style="color: #666; font-size: 14px; margin-bottom: 5px;">累计总盈亏</div>
        <div class="stat-card-value" style="font-size: 28px; font-weight: bold; color: #d32f2f;">+¥ 18,500.00</div>
        <div style="font-size: 12px; color: #00c853;">↑ 跑赢 82% 的市场基准</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-title" style="color: #666; font-size: 14px; margin-bottom: 5px;">本年盈亏</div>
        <div class="stat-card-value" style="font-size: 28px; font-weight: bold; color: #d32f2f;">+¥ 3,420.00</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-title" style="color: #666; font-size: 14px; margin-bottom: 5px;">本月盈亏</div>
        <div class="stat-card-value" style="font-size: 28px; font-weight: bold; color: #d32f2f;">+¥ 840.00</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-title" style="color: #666; font-size: 14px; margin-bottom: 5px;">单日最大回撤</div>
        <div class="stat-card-value" style="font-size: 28px; font-weight: bold; color: #388e3c;">-¥ 1,200.00</div>
      </div>
    </div>

    <!-- 图表与日历分栏视图 -->
    <div style="display: flex; gap: 20px;">
      <!-- 左边用 Echart 实现折线 -->
      <div class="content-card" style="flex: 1.5;">
        <div class="content-card-header">
          <h3 class="content-card-title">累计盈亏走势</h3>
        </div>
        <div class="content-card-body">
          <div ref="lineChartRef" style="width: 100%; height: 420px;"></div>
        </div>
      </div>

      <!-- 右边是理财日历 -->
      <div class="content-card" style="flex: 1;">
        <div class="content-card-header">
          <h3 class="content-card-title">理财日历</h3>
          <div class="calendar-tabs">
            <button :class="['tab-btn', { active: mode === 'day' }]" @click="mode = 'day'">日</button>
            <button :class="['tab-btn', { active: mode === 'week' }]" @click="mode = 'week'">周</button>
            <button :class="['tab-btn', { active: mode === 'month' }]" @click="mode = 'month'">月</button>
            <button :class="['tab-btn', { active: mode === 'year' }]" @click="mode = 'year'">年</button>
          </div>
        </div>
        <div class="content-card-body" style="height: 420px; overflow-y: auto; padding-right: 15px;">
          <div :class="['calendar-grid', mode]">
              <div v-for="(item, idx) in currentData" :key="idx" 
                   :class="['cal-cell', item.isProfit ? 'profit' : 'loss', { 'cal-selected': selectedLabel === item.label }]"
                   @click="handleCellClick(item)">
                   <div class="cal-label">
                      {{ item.label }}
                   </div>
                   <div class="cal-value">{{ formatCurrency(item.value) }}</div>
              </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 选中日期的基金详情排行榜 -->
    <div class="content-card" style="margin-top: 20px; animation: fadeIn 0.3s ease;" v-if="selectedLabel">
      <div class="content-card-header">
        <h3 class="content-card-title">【{{ selectedLabel }}】各项基金收益明细 (由高到低)</h3>
      </div>
      <div class="content-card-body">
        <div style="display: flex; flex-direction: column; gap: 10px;">
           <div v-for="(fund, idx) in selectedDetails" :key="idx" style="display: flex; justify-content: space-between; align-items: center; padding: 15px; background: #fafafa; border: 1px solid #eee; border-radius: 8px;">
              <span style="font-weight: 500; font-size: 15px; color: #333;">{{ fund.name }}</span>
              <span :style="{ fontWeight: 'bold', fontSize: '16px', color: fund.value >= 0 ? '#d32f2f' : '#388e3c' }">
                {{ formatCurrency(fund.value) }}
              </span>
           </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 日历切换 Tab 样式 */
.calendar-tabs {
  display: flex;
  gap: 10px;
}
.tab-btn {
  border: 1px solid #ddd;
  background: #fff;
  padding: 6px 15px;
  border-radius: 20px;
  cursor: pointer;
  outline: none;
  font-size: 13px;
  color: #666;
  transition: all 0.3s ease;
}
.tab-btn:hover {
  background: #f0f0f0;
}
.tab-btn.active {
  background: #000;
  color: #fff;
  border-color: #000;
}

/* 核心日历网格样式 */
.calendar-grid {
  display: grid;
  gap: 12px;
  max-width: 100%;
}

/* 如果是日视图，细分为 7 列表现标准的日历 */
.calendar-grid.day {
  grid-template-columns: repeat(7, 1fr);
}

/* 周、月、年份切分为四列 */
.calendar-grid.week, .calendar-grid.month, .calendar-grid.year {
  grid-template-columns: repeat(4, 1fr); 
}

.cal-cell {
  border-radius: 6px;
  padding: 10px 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s;
  cursor: pointer;
}

.cal-cell:hover, .cal-cell.cal-selected {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}
.cal-cell.cal-selected {
  border-width: 2px;
  border-color: #000 !important;
}

.cal-label {
  font-size: 11px;
  color: #666;
  margin-bottom: 4px;
  font-weight: 500;
}

.cal-value {
  font-size: 13px;
  font-weight: 700;
}

/* A股特供配色：红赚绿亏 */
.cal-cell.profit {
  background-color: #ffebee;
  border: 1px solid #ffcdd2;
}
.cal-cell.profit .cal-value {
  color: #d32f2f;
}

.cal-cell.loss {
  background-color: #e8f5e9;
  border: 1px solid #c8e6c9;
}
.cal-cell.loss .cal-value {
  color: #388e3c;
}

/* 移动端强制压缩列数响应式 */
@media (max-width: 768px) {
  .calendar-grid.day {
    grid-template-columns: repeat(4, 1fr);
  }
  .calendar-grid.week, .calendar-grid.month, .calendar-grid.year {
    grid-template-columns: repeat(2, 1fr);
  }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
