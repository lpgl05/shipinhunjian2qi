<template>
  <div class="min-h-screen bg-gray-950 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <!-- Logo和标题 -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl mb-4">
          <Shield :size="32" class="text-white" />
        </div>
        <h1 class="text-2xl font-bold text-white mb-2">后台管理系统</h1>
        <p class="text-gray-400">请登录您的管理员账号</p>
      </div>

      <!-- 登录表单 -->
      <div class="bg-gray-900 rounded-2xl border border-gray-800 p-8">
        <form @submit.prevent="handleLogin" class="space-y-6">
          <!-- 用户名 -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              用户名
            </label>
            <input
              v-model="loginForm.username"
              type="text"
              placeholder="请输入管理员用户名"
              class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
              required
            />
          </div>

          <!-- 密码 -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              密码
            </label>
            <div class="relative">
              <input
                v-model="loginForm.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="请输入密码"
                class="w-full px-4 py-3 pr-12 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                required
              />
              <button
                type="button"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
                @click="showPassword = !showPassword"
              >
                <Eye v-if="!showPassword" :size="18" />
                <EyeOff v-else :size="18" />
              </button>
            </div>
          </div>

          <!-- 记住登录 -->
          <div class="flex items-center justify-between">
            <label class="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
              <input type="checkbox" v-model="rememberMe" class="rounded" />
              <span>记住登录状态</span>
            </label>
          </div>

          <!-- 登录按钮 -->
          <button
            type="submit"
            class="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-violet-500 hover:brightness-110 text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="isLoading"
          >
            <span v-if="!isLoading">登录</span>
            <span v-else>登录中...</span>
          </button>
        </form>

        <!-- 提示信息 -->
        <div class="mt-6 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <p class="text-xs text-blue-400">
            <strong>演示账号：</strong> admin / admin123
          </p>
        </div>
      </div>

      <!-- 返回主系统 -->
      <div class="text-center mt-6">
        <button
          class="text-gray-400 hover:text-gray-300 text-sm transition-colors"
          @click="backToMain"
        >
          ← 返回主系统
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Shield, Eye, EyeOff } from 'lucide-vue-next'

const router = useRouter()

const loginForm = ref({
  username: 'admin',
  password: 'admin123'
})

const showPassword = ref(false)
const rememberMe = ref(true)
const isLoading = ref(false)

const handleLogin = async () => {
  isLoading.value = true
  
  // 模拟登录验证
  setTimeout(() => {
    if (loginForm.value.username === 'admin' && loginForm.value.password === 'admin123') {
      // 保存登录状态
      localStorage.setItem('admin_token', 'mock_admin_token')
      localStorage.setItem('admin_user', JSON.stringify({
        username: loginForm.value.username,
        role: 'admin'
      }))
      
      // 跳转到后台首页
      router.push('/admin/dashboard')
    } else {
      alert('用户名或密码错误！')
    }
    
    isLoading.value = false
  }, 1000)
}

const backToMain = () => {
  window.close()
  if (!window.closed) {
    window.location.href = '/'
  }
}
</script>

