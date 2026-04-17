<script setup lang="ts">
import { useRoute } from 'vue-router';

const route = useRoute();
const isActive = (path: string) => {
  return route.path === path;
}
</script>

<template>
  <div class="container">
    <!-- 侧边栏导航 -->
    <aside class="sidebar">
      <div class="sidebar-header">
        <h1>理财管理平台</h1>
      </div>
      <ul class="sidebar-menu">
        <li>
          <router-link to="/" :class="{ active: isActive('/') }">
            <i><svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.44365 41.5564C4.46243 37.5751 2 32.0751 2 26C2 13.8497 11.8497 4 24 4C36.1503 4 46 13.8497 46 26C46 32.0751 43.5376 37.5751 39.5564 41.5564" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M14.1005 35.8995C11.567 33.366 10 29.866 10 26C10 18.268 16.268 12 24 12" stroke="#333" stroke-width="4" stroke-linecap="round"/><path d="M24 26V18" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg></i>
            仪表盘
          </router-link>
        </li>
        <li>
          <router-link to="/watchlist" :class="{ active: isActive('/watchlist') }">
            <i><svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M44 11C44 9.34315 42.6569 8 41 8H7C5.34315 8 4 9.34315 4 11V20H44V11Z" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M4.1123 39.0301L16.2879 26.7293L22.8672 33.0301L30.9105 26L35.391 30.368" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M44 18V37C44 38.6569 42.6569 40 41 40H12" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M19.1118 14H37.1118" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M11.1108 14H13.1108" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 18V27" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg></i>
            自选行情
          </router-link>
        </li>
        <li>
          <router-link to="/property" :class="{ active: isActive('/property') }">
            <i><svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M17.982 11.9689L31.7846 4L36.397 11.9889L17.982 11.9689Z" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 14C4 12.8954 4.89543 12 6 12H42C43.1046 12 44 12.8954 44 14V42C44 43.1046 43.1046 44 42 44H6C4.89543 44 4 43.1046 4 42V14Z" stroke="#333" stroke-width="4" stroke-linejoin="round"/><path d="M35.25 33H44V23H35.25C32.3505 23 30 25.2386 30 28C30 30.7614 32.3505 33 35.25 33Z" stroke="#333" stroke-width="4" stroke-linejoin="round"/><path d="M44 16.5V40.5" stroke="#333" stroke-width="4" stroke-linecap="round"/></svg></i>
            资产管理
          </router-link>
        </li>
        <li>
          <router-link to="/analysis" :class="{ active: isActive('/analysis') }">
            <i><svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M44 11C44 9.34315 42.6569 8 41 8H7C5.34315 8 4 9.34315 4 11V20H44V11Z" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M4.1123 39.0301L16.2879 26.7293L22.8672 33.0301L30.9105 26L35.391 30.368" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M44 18V37C44 38.6569 42.6569 40 41 40H12" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M19.1118 14H37.1118" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M11.1108 14H13.1108" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 18V27" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg></i>
            盈亏分析
          </router-link>
        </li>
        <li>
          <router-link to="/export" :class="{ active: isActive('/export') }">
            <i><svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 7C5 5.34315 6.34315 4 8 4H32C33.6569 4 35 5.34315 35 7V44H8C6.34315 44 5 42.6569 5 41V7Z" stroke="#333" stroke-width="4" stroke-linejoin="round"/><path d="M35 24C35 22.8954 35.8954 22 37 22H41C42.1046 22 43 22.8954 43 24V41C43 42.6569 41.6569 44 40 44H35V24Z" stroke="#333" stroke-width="4" stroke-linejoin="round"/><path d="M11 12H19" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M11 19H23" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg></i>
            导出报表
          </router-link>
        </li>
        <li>
          <router-link to="/settings" :class="{ active: isActive('/settings') }">
            <i><svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18.2838 43.1713C14.9327 42.1736 11.9498 40.3213 9.58787 37.867C10.469 36.8227 11 35.4734 11 34.0001C11 30.6864 8.31371 28.0001 5 28.0001C4.79955 28.0001 4.60139 28.01 4.40599 28.0292C4.13979 26.7277 4 25.3803 4 24.0001C4 21.9095 4.32077 19.8938 4.91579 17.9995C4.94381 17.9999 4.97188 18.0001 5 18.0001C8.31371 18.0001 11 15.3138 11 12.0001C11 11.0488 10.7786 10.1493 10.3846 9.35011C12.6975 7.1995 15.5205 5.59002 18.6521 4.72314C19.6444 6.66819 21.6667 8.00013 24 8.00013C26.3333 8.00013 28.3556 6.66819 29.3479 4.72314C32.4795 5.59002 35.3025 7.1995 37.6154 9.35011C37.2214 10.1493 37 11.0488 37 12.0001C37 15.3138 39.6863 18.0001 43 18.0001C43.0281 18.0001 43.0562 17.9999 43.0842 17.9995C43.6792 19.8938 44 21.9095 44 24.0001C44 25.3803 43.8602 26.7277 43.594 28.0292C43.3986 28.01 43.2005 28.0001 43 28.0001C39.6863 28.0001 37 30.6864 37 34.0001C37 35.4734 37.531 36.8227 38.4121 37.867C36.0502 40.3213 33.0673 42.1736 29.7162 43.1713C28.9428 40.752 26.676 39.0001 24 39.0001C21.324 39.0001 19.0572 40.752 18.2838 43.1713Z" stroke="#333" stroke-width="4" stroke-linejoin="round"/><path d="M24 31C27.866 31 31 27.866 31 24C31 20.134 27.866 17 24 17C20.134 17 17 20.134 17 24C17 27.866 20.134 31 24 31Z" stroke="#333" stroke-width="4" stroke-linejoin="round"/></svg></i>
            系统设置
          </router-link>
        </li>
      </ul>
    </aside>

    <!-- 主内容区 -->
    <main class="main-content">
      <router-view></router-view>
    </main>
  </div>
</template>

<style scoped>
/* 仅 Layout 适用的专属样式 */
.container {
    display: flex;
    min-height: 100vh;
}

.sidebar {
    width: 220px;
    background-color: #ffffff;
    border-right: 1px solid #e0e0e0;
    padding: 20px 0;
    position: fixed;
    height: 100vh;
    overflow-y: auto;
}

.sidebar-header {
    padding: 10px 50px 30px;
    border-bottom: 1px solid #e0e0e0;
    margin-bottom: 20px;
}

.sidebar-header h1 {
    font-size: 18px;
    font-weight: 600;
    color: #000;
    display: flex;
    align-items: center;
    justify-content: center;
}

.sidebar-menu {
    list-style: none;
}

.sidebar-menu li {
    margin-bottom: 5px;
}

.sidebar-menu a {
    display: block;
    padding: 12px 20px;
    color: #666;
    text-decoration: none;
    transition: all 0.3s ease;
    border-left: 3px solid transparent;
}

.sidebar-menu a:hover,
.sidebar-menu a.active,
.sidebar-menu a.router-link-active {
    background-color: #f5f5f5;
    color: #000;
    border-left-color: #000;
}

.sidebar-menu a i {
    margin-bottom: 3px;
    margin-right: 20px;
    width: 20px;
    height: 20px;
    display: inline-flex;
    vertical-align: middle;
}

.sidebar-menu a i svg {
    width: 100%;
    height: 100%;
    display: block;
}

.main-content {
    flex: 1;
    margin-left: 220px;
    padding: 30px;
}

@media (max-width: 768px) {
    .sidebar {
        width: 100%;
        height: auto;
        position: relative;
    }

    .main-content {
        margin-left: 0;
    }
}
</style>
