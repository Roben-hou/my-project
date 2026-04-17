import { createRouter, createWebHistory } from 'vue-router';
import Dashboard from '../views/Dashboard.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      // 仪表盘作为首页
      path: '/',
      name: 'Dashboard',
      component: Dashboard
    },
    {
      // 自选行情
      path: '/watchlist',
      name: 'Watchlist',
      component: () => import('../views/Watchlist.vue')
    },
    {
      // 资产管理
      path: '/property',
      name: 'Property',
      component: () => import('../views/Property.vue')
    },
    {
      path: '/placeholder',
      name: 'Placeholder',
      component: () => import('../views/Placeholder.vue')
    },
    {
      path: '/analysis',
      name: 'Analysis',
      component: () => import('../views/Analysis.vue')
    },

    {
      path: '/export',
      name: 'Export',
      component: () => import('../views/Export.vue')
    },
    {
      path: '/settings',
      name: 'Settings',
      component: () => import('../views/Settings.vue')
    }
  ]
});

export default router;
