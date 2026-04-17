<script setup lang="ts">
import { ref } from 'vue';

const showMessage = () => {
  alert('设置已保存');
};
</script>

<template>
  <div class="view-wrapper">
    <div class="top-bar" style="margin-bottom: 20px;">
      <h2>系统设置</h2>
      <div style="color: #666; font-size: 14px;">管理您的个人偏好、安全设定与API接口密钥</div>
    </div>

    <div class="content-card" style="max-width: 800px;">
      <div class="content-card-header">
        <h3 class="content-card-title">基本信息与偏好设置</h3>
      </div>
      <div class="content-card-body">
        
        <!-- 表单区域 -->
        <table style="width: 100%; border-spacing: 0 15px;">
          <tr>
            <td style="width: 150px; font-weight: 500; color: #555;">显示昵称</td>
            <td><input class="searchname" type="text" value="罗" style="width: 300px;"></td>
          </tr>
          <tr>
            <td style="font-weight: 500; color: #555;">账号密码</td>
            <td>
               <button class="btn btn-secondary">修改密码</button>
               <span style="color: #00c853; font-size: 12px; margin-left: 10px;">✓ 已开启强密码保护</span>
            </td>
          </tr>
          <tr>
            <td style="font-weight: 500; color: #555;">界面主题模式</td>
            <td>
              <select class="searchname" style="width: 200px;">
                <option value="light">☀️ 浅色明亮模式 (默认)</option>
                <option value="dark">🌙 暗黑极简模式</option>
                <option value="auto">💻 跟随操作系统</option>
              </select>
            </td>
          </tr>
          <tr>
            <td style="font-weight: 500; color: #555;">隐私模式保护</td>
            <td>
              <label style="display: flex; align-items: center; gap: 8px;">
                 <input type="checkbox"> 在非活动情况下隐藏总资产金额 (***)
              </label>
            </td>
          </tr>
        </table>
        
        <hr style="border: 0; border-top: 1px solid #e0e0e0; margin: 30px 0;">
        
        <div style="display: flex; justify-content: flex-end;">
            <button class="btn btn-secondary" style="margin-right: 15px;">重置默认</button>
            <button class="btn btn-primary" @click="showMessage">保存设置</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 继承基础样式 */
</style>
