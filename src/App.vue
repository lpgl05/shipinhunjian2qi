<template>
  <div id="app" class="min-h-screen bg-gray-950">
    <RouterView />
    
    <!-- 全局认证模态框 -->
    <AuthModal />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import AuthModal from './components/AuthModal.vue'
</script>
