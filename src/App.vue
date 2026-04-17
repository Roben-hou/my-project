<script setup lang="ts">
import Layout from './components/Layout.vue';
</script>

<template>
  <Layout />
</template>

<style>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Microsoft YaHei', sans-serif;
    background-color: #f5f5f5;
    color: #333;
    line-height: 1.6;
}

.container {
    display: flex;
    min-height: 100vh;
}

.main-content {
    flex: 1;
    margin-left: 220px;
    padding: 30px;
}

.top-bar {
    background-color: #ffffff;
    padding: 35px 40px 25px; /* 加大顶部和内边距，使头部变得更高 */
    border-radius: 12px;
    margin-bottom: 40px; /* 加大向下的整体间距 */
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    display: flex;
    flex-direction: column;
    align-items: center;
}

.topsearch {
    display: flex;
    margin-bottom: 35px; /* 拉大搜索框与下方元素的垂直间距 */
}

.searchname {
    width: 400px;
    height: 40px;
    border-radius: 15px;
    padding: 5px;
    border: 1.5px solid rgb(48, 45, 45);
    box-shadow: 2 2 8px 2 gray;
}

.user-info {
    position: absolute;
    right: 40px;
    top: 40px;
    display: flex;
    align-items: center;
    gap: 15px;
}

.user-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: #000;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    margin-bottom: 30px;
}

.stat-card {
    background-color: #ffffff;
    padding: 25px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.stat-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.stat-card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
}

.stat-card-title {
    font-size: 14px;
    color: #666;
    font-weight: 500;
}

.stat-card-icon {
    width: 40px;
    height: 40px;
    background-color: #f5f5f5;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
}

.stat-card-value {
    font-size: 28px;
    font-weight: 700;
    color: #000;
    margin-bottom: 5px;
}

.stat-card-change {
    font-size: 13px;
    color: #666;
}

.stat-card-change.positive {
    color: #00c853;
}

.stat-card-change.negative {
    color: #ff5252;
}

.content-card {
    background-color: #ffffff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    margin-bottom: 30px;
}

.content-card-header {
    padding: 20px 25px;
    border-bottom: 1px solid #e0e0e0;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.content-card-title {
    font-size: 18px;
    font-weight: 600;
    color: #000;
}

.content-card-body {
    padding: 25px;
}

.data-table {
    width: 100%;
    border-collapse: collapse;
}

.data-table thead {
    background-color: #f5f5f5;
}

.data-table th {
    padding: 12px 15px;
    text-align: left;
    font-weight: 600;
    font-size: 13px;
    color: #666;
    border-bottom: 2px solid #e0e0e0;
}

.data-table td {
    padding: 15px;
    border-bottom: 1px solid #e0e0e0;
    color: #333;
    font-size: 14px;
}

.data-table tbody tr:hover {
    background-color: #f9f9f9;
}

.badge {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
}

.badge-success {
    background-color: #e8f5e9;
    color: #2e7d32;
}

.badge-danger {
    background-color: #ffebee;
    color: #c62828;
}

.badge-warning {
    background-color: #fff3e0;
    color: #ef6c00;
}

.btn {
    padding: 10px 20px;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
}

.btn-primary {
    background-color: #000;
    color: #fff;
}

.btn-primary:hover {
    background-color: #333;
}

.btn-secondary {
    background-color: #f5f5f5;
    color: #333;
    border: 1px solid #ddd;
}

.btn-secondary:hover {
    background-color: #e0e0e0;
}

.btn-danger {
    background-color: transparent;
    color: #ff5252;
    padding: 5px 12px;
    border: 1px solid #ffebee;
    border-radius: 4px;
    margin-left: 5px;
}

.btn-danger:hover {
    background-color: #ffebee;
}

.chart-placeholder {
    width: 100%;
    height: 300px;
    background-color: #f9f9f9;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #999;
    font-size: 14px;
}

.up-color {
    color: #00c853;
    font-weight: 500;
}

.down-color {
    color: #ff5252;
    font-weight: 500;
}

@media (max-width: 768px) {
    .main-content {
        margin-left: 0;
    }

    .stats-grid {
        grid-template-columns: 1fr;
    }
}
</style>
