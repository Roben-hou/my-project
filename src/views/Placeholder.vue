<script setup lang="ts">
const goBack = () => {
    window.location.href = '/';
};
</script>

<template>
  <div class="content-card" style="margin-top: 50px; text-align: center; padding: 50px;">
    <h2 style="margin-bottom: 20px;">功能建设中</h2>
    <p style="color: #666; margin-bottom: 30px;">这一模块正在开发过程中，将很快在下个版本上线。您可以先体验【仪表盘】和【资产管理】。</p>
    <button class="btn btn-primary" @click="goBack">回到仪表盘</button>
  </div>
</template>
