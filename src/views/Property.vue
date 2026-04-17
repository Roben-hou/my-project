<script setup lang="ts">
import { ref } from 'vue';

interface Asset {
  id: number;
  name: string;
  type: string;
  badgeClass: string;
  amount: string; 
  cost: string; 
  currentValue: string; 
  percentage: string; 
}

const assets = ref<Asset[]>([
  {
    id: 1,
    name: '华夏成长混合',
    type: '基金',
    badgeClass: 'badge-success',
    amount: '10000 份',
    cost: '¥15,000.00',
    currentValue: '¥15,500.00',
    percentage: '18.1%'
  },
  {
    id: 2,
    name: '易方达蓝筹精选',
    type: '基金',
    badgeClass: 'badge-success',
    amount: '5000 份',
    cost: '¥10,500.00',
    currentValue: '¥10,000.00',
    percentage: '11.7%'
  },
  {
    id: 3,
    name: '招商银行储蓄卡',
    type: '活期/现金',
    badgeClass: 'badge-danger',
    amount: '-',
    cost: '-',
    currentValue: '¥60,000.00',
    percentage: '70.2%'
  }
]);

const handleDelete = (id: number) => {
  if (confirm('确定要删除该资产记录吗？')) {
    assets.value = assets.value.filter(item => item.id !== id);
  }
};

const showComingSoon = () => {
    alert('功能开发中...');
};
</script>

<template>
  <div>
    <!-- 顶部栏 -->
    <div class="top-bar" style="flex-direction: row; justify-content: space-between; margin-bottom: 30px;">
      <div class="topsearch" style="margin-bottom: 0;">
        <input class="searchname" type="text" placeholder="输入资产名称或分类...">
        <button class="btn btn-primary" style="margin-left: 10px;" @click="showComingSoon">
          添加资产
        </button>
      </div>
      <div class="user-info" style="position: static;">
        <div class="user-avatar">罗</div>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-card-header">
          <span class="stat-card-title">总资产 (估算)</span>
          <div class="stat-card-icon">
            <svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15.0002 14.3848C19.1256 16.0002 24.0085 16.0002 24.0085 16.0002C24.0085 16.0002 28.8802 16.0002 33.0002 14.3848C37.502 19.6386 40.6566 26.5646 42.7299 32.3977C44.8289 38.3029 40.2008 44.0002 33.9336 44.0002H14.0199C7.76837 44.0002 3.14607 38.329 5.23448 32.4366C7.29812 26.614 10.455 19.6856 15.0002 14.3848Z" fill="none" stroke="#333" stroke-width="4" stroke-linejoin="round"/><path d="M18 28H30" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M18 34H30" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M24.0088 28V38" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M30 22L24 28L18 22" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path fill-rule="evenodd" clip-rule="evenodd" d="M24 16C31.1797 16 37 13.3137 37 10C37 6.68629 31.1797 4 24 4C16.8203 4 11 6.68629 11 10C11 13.3137 16.8203 16 24 16Z" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
        </div>
        <div class="stat-card-value">¥85,500.00</div>
        <div class="stat-card-change positive">↑ +2.50% 本月新增</div>
      </div>

      <div class="stat-card">
        <div class="stat-card-header">
          <span class="stat-card-title">基金资产</span>
          <div class="stat-card-icon">
            <svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M42 4H6V14H42V4Z" fill="none" stroke="#333" stroke-width="4" stroke-linejoin="round"/><path d="M42 19H6V29H42V19Z" fill="none" stroke="#333" stroke-width="4" stroke-linejoin="round"/><path d="M42 34H6V44H42V34Z" fill="none" stroke="#333" stroke-width="4" stroke-linejoin="round"/><path d="M21 9H27" stroke="#333" stroke-width="4" stroke-linecap="round"/><path d="M21 24H27" stroke="#333" stroke-width="4" stroke-linecap="round"/><path d="M21 39H27" stroke="#333" stroke-width="4" stroke-linecap="round"/></svg>
          </div>
        </div>
        <div class="stat-card-value">¥25,500.00</div>
        <div class="stat-card-change">29.8% 占比</div>
      </div>

      <div class="stat-card">
        <div class="stat-card-header">
          <span class="stat-card-title">可用资金</span>
          <div class="stat-card-icon">
            <svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 44H44" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 26L12 28V38H4V26Z" fill="none" stroke="#333" stroke-width="4" stroke-linejoin="round"/><path d="M20 24L28 20V38H20V24Z" fill="none" stroke="#333" stroke-width="4" stroke-linejoin="round"/><path d="M36 16L44 12V38H36V16Z" fill="none" stroke="#333" stroke-width="4" stroke-linejoin="round"/><path d="M4 18L12 20L44 4H34" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
        </div>
        <div class="stat-card-value">¥60,000.00</div>
        <div class="stat-card-change">70.2% 占比</div>
      </div>
    </div>

    <!-- 资产明细表格 -->
    <div class="content-card">
      <div class="content-card-header">
        <h3 class="content-card-title">我的资产明细</h3>
        <div>
          <button class="btn btn-secondary" @click="showComingSoon">批量管理</button>
        </div>
      </div>
      <div class="content-card-body">
        <table class="data-table">
          <thead>
            <tr>
              <th>资产名称</th>
              <th>资产类型</th>
              <th>持仓数量/份额</th>
              <th>持有成本</th>
              <th>当前市值/余额</th>
              <th>占总资产比</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="asset in assets" :key="asset.id">
              <td>{{ asset.name }}</td>
              <td><span :class="['badge', asset.badgeClass]">{{ asset.type }}</span></td>
              <td>{{ asset.amount }}</td>
              <td>{{ asset.cost }}</td>
              <td>{{ asset.currentValue }}</td>
              <td>{{ asset.percentage }}</td>
              <td>
                <button class="btn btn-secondary" style="padding: 5px 12px; margin-right: 5px;" @click="showComingSoon">编辑</button>
                <button class="btn btn-danger" @click="handleDelete(asset.id)">删除</button>
              </td>
            </tr>
            <tr v-if="assets.length === 0">
              <td colspan="7" style="text-align: center; color: gray;">暂无资产记录</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
