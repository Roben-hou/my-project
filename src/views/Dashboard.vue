<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import * as echarts from 'echarts';
import axios from 'axios';

const router = useRouter();

const pieChartRef = ref<HTMLElement | null>(null);
const lineChartRef = ref<HTMLElement | null>(null);
let pieChartInstance: echarts.ECharts | null = null;
let lineChartInstance: echarts.ECharts | null = null;

const indexes = ref<any[]>([]);

const fetchRealtimeIndexes = async () => {
    try {
        const res = await axios.get('/api/market/indexes');
        if (res.data && res.data.success) {
            indexes.value = res.data.data;
            nextTick(() => { updateCarouselEffects(); });
        }
    } catch (err) {
        console.error('获取实时大盘数据失败:', err);
    }
};

const carouselRef = ref<HTMLElement | null>(null);
const cardRefs = ref<HTMLElement[]>([]);

const setCardRef = (el: any, index: number) => {
    if (el) cardRefs.value[index] = el as HTMLElement;
};

const updateCarouselEffects = () => {
  if (!carouselRef.value) return;
  const container = carouselRef.value;
  const containerRect = container.getBoundingClientRect();
  const containerLeft = containerRect.left;
  
  cardRefs.value.forEach((cardEl) => {
    if (!cardEl) return;
    const cardRect = cardEl.getBoundingClientRect();
    
    // 计算卡片左边缘与视窗左侧的距离
    let distance = cardRect.left - containerLeft;
    if (distance < 0) distance = 0; // “左边不用模糊了”
    
    const maxDist = containerRect.width; 
    let ratio = Math.min(distance / maxDist, 1);
    
    const blur = ratio * 0.1; // “右边的模糊调整到0.8”
    const scale = 1; // 移除之前的凹凸缩放行为，回归整齐
    const opacity = 1; 
    
    cardEl.style.filter = `blur(${blur}px)`;
    cardEl.style.transform = `scale(${scale})`;
    cardEl.style.opacity = `${opacity}`;
  });
};

const handleWheel = (e: WheelEvent) => {
  if (carouselRef.value) {
    e.preventDefault();
    // 将普通鼠标的上下乱动，强制映射为横向精确拨卡（卡宽约150 + 间隙20 = 170）
    const scrollAmount = e.deltaY > 0 ? 170 : -170;
    carouselRef.value.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  }
};

let pollTimer: any = null;

onMounted(() => {
  // 初次获取真实行情，并每隔 15 秒轮询一次保持跳动
  fetchRealtimeIndexes();
  pollTimer = setInterval(fetchRealtimeIndexes, 15000);
  // 初始化饼图
  if (pieChartRef.value) {
    pieChartInstance = echarts.init(pieChartRef.value);
    const pieOption = {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: ¥{c} ({d}%)'
      },
      legend: {
        bottom: '0%',
        left: 'center'
      },
      series: [
        {
          name: '资产占比',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 5,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '18',
              fontWeight: 'bold'
            }
          },
          data: [
            { value: 60000, name: '可用资金', itemStyle: { color: '#00c853' } },
            { value: 25500, name: '基金资产', itemStyle: { color: '#3b82f6' } }
          ]
        }
      ]
    };
    pieChartInstance.setOption(pieOption);
  }

  // 初始化折线图
  if (lineChartRef.value) {
    lineChartInstance = echarts.init(lineChartRef.value);
    const lineOption = {
      tooltip: {
        trigger: 'axis'
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['1月', '2月', '3月', '4月', '5月', '6月', '本月']
      },
      yAxis: {
        type: 'value',
        min: 80000
      },
      series: [
        {
          name: '总资产(元)',
          type: 'line',
          data: [81200, 82500, 83100, 82800, 84000, 85100, 85500],
          smooth: true,
          areaStyle: {
            opacity: 0.2,
            color: '#3b82f6'
          },
          itemStyle: { color: '#3b82f6' },
          lineStyle: { width: 3 }
        }
      ]
    };
    lineChartInstance.setOption(lineOption);
  }

  window.addEventListener('resize', handleResize);
  
  if (carouselRef.value) {
    carouselRef.value.addEventListener('scroll', updateCarouselEffects);
    // { passive: false } 用以允许阻止默认垂直滚动并接管转换为横向
    carouselRef.value.addEventListener('wheel', handleWheel, { passive: false });
  }
});

onUnmounted(() => {
  if (pollTimer) clearInterval(pollTimer);
  window.removeEventListener('resize', handleResize);
  if (carouselRef.value) {
    carouselRef.value.removeEventListener('scroll', updateCarouselEffects);
    carouselRef.value.removeEventListener('wheel', handleWheel as EventListener);
  }
  pieChartInstance?.dispose();
  lineChartInstance?.dispose();
});

const handleResize = () => {
  pieChartInstance?.resize();
  lineChartInstance?.resize();
  updateCarouselEffects();
};

const handleGenerateReport = () => {
    router.push('/export');
};
</script>

<template>
  <div>
    <!-- 顶部栏 -->
    <div class="top-bar">
      <div class="topsearch">
        <input class="searchname" type="text" placeholder="输入相关信息搜索...">
      </div>
      <div class="user-info">
        <div class="user-avatar">罗</div>
      </div>
      <div style="width: 100%;">
        <!-- 指数卡片动效层 -->
        <div class="index-carousel-wrapper">
          <div class="index-cards" ref="carouselRef">
              <div 
                v-for="(item, idx) in indexes" 
                :key="item.name" 
                class="index-card"
                :ref="(el) => setCardRef(el, idx)"
              >
                  <div class="index-name">{{ item.name }}</div>
                  <div class="index-value">{{ item.value }}</div>
                  <div class="index-change" :class="item.up ? 'up' : 'down'">
                      {{ item.change }} {{ item.up ? '↑' : '↓' }}
                  </div>
              </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-grid">
      <div class="stat-card" style="cursor: pointer;" title="点击前往资产管理" @click="router.push('/property')">
        <div class="stat-card-header">
            <span class="stat-card-title">总资产</span>
            <div class="stat-card-icon"><svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15.0002 14.3848C19.1256 16.0002 24.0085 16.0002 24.0085 16.0002C24.0085 16.0002 28.8802 16.0002 33.0002 14.3848C37.502 19.6386 40.6566 26.5646 42.7299 32.3977C44.8289 38.3029 40.2008 44.0002 33.9336 44.0002H14.0199C7.76837 44.0002 3.14607 38.329 5.23448 32.4366C7.29812 26.614 10.455 19.6856 15.0002 14.3848Z" fill="none" stroke="#333" stroke-width="4" stroke-linejoin="round"/><path d="M18 28H30" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M18 34H30" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M24.0088 28V38" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M30 22L24 28L18 22" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path fill-rule="evenodd" clip-rule="evenodd" d="M24 16C31.1797 16 37 13.3137 37 10C37 6.68629 31.1797 4 24 4C16.8203 4 11 6.68629 11 10C11 13.3137 16.8203 16 24 16Z" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
        </div>
        <div class="stat-card-value">¥85,500.00</div>
        <div class="stat-card-change positive">↑ +2.50% 较上月</div>
      </div>

      <div class="stat-card" style="cursor: pointer;" title="点击前往盈亏分析" @click="router.push('/analysis')">
        <div class="stat-card-header">
            <span class="stat-card-title">总盈亏</span>
            <div class="stat-card-icon"><svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 18V9C6 7.34315 7.34315 6 9 6H39C40.6569 6 42 7.34315 42 9V18" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M32 24V31" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M24 15V31" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 19V31" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M6 30V39C6 40.6569 7.34315 42 9 42H39C40.6569 42 42 40.6569 42 39V30" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
        </div>
        <div class="stat-card-value">+¥500.00</div>
        <div class="stat-card-change positive">↑ +3.33% 收益率</div>
      </div>

      <div class="stat-card">
        <div class="stat-card-header">
            <span class="stat-card-title">持仓数量</span>
            <div class="stat-card-icon"><svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M42 4H6V14H42V4Z" fill="none" stroke="#333" stroke-width="4" stroke-linejoin="round"/><path d="M42 19H6V29H42V19Z" fill="none" stroke="#333" stroke-width="4" stroke-linejoin="round"/><path d="M42 34H6V44H42V34Z" fill="none" stroke="#333" stroke-width="4" stroke-linejoin="round"/><path d="M21 9H27" stroke="#333" stroke-width="4" stroke-linecap="round"/><path d="M21 24H27" stroke="#333" stroke-width="4" stroke-linecap="round"/><path d="M21 39H27" stroke="#333" stroke-width="4" stroke-linecap="round"/></svg></div>
        </div>
        <div class="stat-card-value">1</div>
        <div class="stat-card-change">当前持有 1 只基金</div>
      </div>

      <div class="stat-card" style="cursor: pointer;" title="点击前往日内盈亏分析" @click="router.push('/analysis')">
        <div class="stat-card-header">
            <span class="stat-card-title">今日盈亏</span>
            <div class="stat-card-icon"><svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 44H44" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 26L12 28V38H4V26Z" fill="none" stroke="#333" stroke-width="4" stroke-linejoin="round"/><path d="M20 24L28 20V38H20V24Z" fill="none" stroke="#333" stroke-width="4" stroke-linejoin="round"/><path d="M36 16L44 12V38H36V16Z" fill="none" stroke="#333" stroke-width="4" stroke-linejoin="round"/><path d="M4 18L12 20L44 4H34" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
        </div>
        <div class="stat-card-value">+¥100.00</div>
        <div class="stat-card-change positive">↑ +0.65% 今日收益</div>
      </div>
    </div>

    <!-- 资产图表 -->
    <div class="content-card">
        <div class="content-card-header">
            <h3 class="content-card-title">资产配置与走势概览</h3>
            <button class="btn btn-primary" @click="handleGenerateReport">生成报告</button>
        </div>
        <div class="content-card-body" style="display: flex; gap: 20px;">
            <div ref="pieChartRef" class="chart-placeholder" style="flex: 1; background-color: transparent;"></div>
            <div ref="lineChartRef" class="chart-placeholder" style="flex: 2; background-color: transparent;"></div>
        </div>
    </div>
  </div>
</template>

<style scoped>
/* 限定五幅视窗范围、计算首尾内边距(Padding)并允许吸附动画 (Snap) */
.index-carousel-wrapper {
    width: 100%;
    display: flex;
    justify-content: center;
    position: relative;
    /* 移除之前的 overflow: hidden，防止它把底部的物理滚动条给遮挡裁剪掉 */
}

.index-cards {
    /* 150px * 5 + 20px gaps * 4 = 830px (roughly 5 cards window size) */
    width: 830px; 
    max-width: 100%;
    position: relative;
    justify-content: flex-start;
    display: flex;
    gap: 20px;
    margin-bottom: 5px;
    overflow-x: auto;
    padding-bottom: 10px;
    
    /* 移除之前的超大首尾边距，让第一张直接出现在最左侧 */
    padding-left: 0;
    padding-right: 0;
    
    scroll-snap-type: x mandatory;
    scroll-behavior: smooth;
    
    scrollbar-width: auto; /* Firefox 下恢复经典条 */
}

/* 恢复底层滚动条（滚轮）以便拖动可视 */
.index-cards::-webkit-scrollbar {
    height: 14px; /* 要求加粗 */
    display: block;
}
.index-cards::-webkit-scrollbar-thumb {
    background: #bbb;
    border-radius: 7px;
    /* 原生无法给手柄设宽，利用隐形边框挤压，达成变短饱满的效果 */
    border: 3px solid #fff; 
    background-clip: padding-box;
}
.index-cards::-webkit-scrollbar-track {
    background: transparent;
    border-radius: 7px;
    /* 给轨道两边硬留空隙，达成整个下侧滑动条物理“调短”的效果 */
    margin: 0 100px;
}

.index-card {
    scroll-snap-align: center;
    background-color: #f9f9f9;
    padding: 12px 15px;
    border-radius: 8px;
    min-width: 150px;
    height: 75px;
    flex-shrink: 0;
    text-align: center;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    transition: filter 0.05s linear, transform 0.05s linear, opacity 0.05s linear;
}

/* 移除 :hover 位移，动效现在全交由 scroll 中心点算法绝对控制了 */
.index-card:hover { }

.index-name {
    font-size: 13px;
    font-weight: 500;
    color: #666;
    margin-bottom: 2px;
}

.index-value {
    font-size: 16px;
    font-weight: 700;
    color: #000;
    margin-bottom: 2px;
}

.index-change {
    font-size: 12px;
    font-weight: 500;
}

.index-change.up {
    color: #00c853;
}

.index-change.down {
    color: #ff5252;
}
</style>
