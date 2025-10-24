<template>
  <div class="min-h-screen bg-gray-950 flex">
    <!-- 左侧营销内容区域 -->
    <div class="hidden lg:flex lg:w-1/2 relative overflow-hidden">
      <!-- 背景装饰 -->
      <div class="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20"></div>
      <div class="absolute inset-0 opacity-30" style="background-image: url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%239C92AC%22 fill-opacity=%220.1%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"></div>
      
      <div class="relative z-10 flex flex-col justify-center px-12 py-16">
        <!-- Logo区域 -->
        <div class="mb-8">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
              <Video :size="24" class="text-white" />
            </div>
            <div class="text-2xl font-bold text-white">智策营销</div>
          </div>
        </div>

        <!-- 主标题 -->
        <div class="mb-8">
          <h1 class="text-4xl font-bold text-white mb-4 leading-tight">
            AI驱动的智能视频混剪创作平台
          </h1>
          <p class="text-xl text-gray-300 leading-relaxed">
            用AI重塑视频创作，让创意无限可能
          </p>
        </div>

        <!-- 特性标签 -->
        <div class="mb-8">
          <div class="flex flex-wrap gap-4 text-gray-300">
            <span class="px-4 py-2 bg-gray-800/50 rounded-full text-sm backdrop-blur-sm">低门槛</span>
            <span class="px-4 py-2 bg-gray-800/50 rounded-full text-sm backdrop-blur-sm">智能编排</span>
            <span class="px-4 py-2 bg-gray-800/50 rounded-full text-sm backdrop-blur-sm">实时预览</span>
            <span class="px-4 py-2 bg-gray-800/50 rounded-full text-sm backdrop-blur-sm">安全可信</span>
            <span class="px-4 py-2 bg-gray-800/50 rounded-full text-sm backdrop-blur-sm">开箱即用</span>
          </div>
        </div>

        <!-- 行动按钮 -->
        <div class="mb-12">
          <button class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium rounded-lg hover:brightness-110 hover:scale-105 transition-all duration-200">
            <Sparkles :size="20" />
            创建属于你的AI应用
          </button>
        </div>

        <!-- 产品展示区域 -->
        <div class="relative">
          <div class="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Plus :size="16" class="text-white" />
              </div>
              <h3 class="text-lg font-semibold text-white">智能体广场</h3>
            </div>
            
            <div class="grid grid-cols-2 gap-3">
              <div class="bg-gray-700/50 rounded-lg p-3 border border-gray-600/50">
                <div class="flex items-center gap-2 mb-2">
                  <div class="w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center">
                    <span class="text-xs text-white">🤖</span>
                  </div>
                  <span class="text-sm text-white font-medium">智能客服助手</span>
                </div>
                <p class="text-xs text-gray-400">智策官方 · 免费</p>
                <p class="text-xs text-gray-500">65.8K 复制</p>
              </div>
              
              <div class="bg-gray-700/50 rounded-lg p-3 border border-gray-600/50">
                <div class="flex items-center gap-2 mb-2">
                  <div class="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <span class="text-xs text-white">👩</span>
                  </div>
                  <span class="text-sm text-white font-medium">苏瑶</span>
                </div>
                <p class="text-xs text-gray-400">智策官方 · 免费</p>
                <p class="text-xs text-gray-500">21.3K 复制</p>
              </div>
              
              <div class="bg-gray-700/50 rounded-lg p-3 border border-gray-600/50">
                <div class="flex items-center gap-2 mb-2">
                  <div class="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <span class="text-xs text-white">📚</span>
                  </div>
                  <span class="text-sm text-white font-medium">智能助教</span>
                </div>
                <p class="text-xs text-gray-400">智策官方 · 免费</p>
                <p class="text-xs text-gray-500">13.7K 复制</p>
              </div>
              
              <div class="bg-gray-700/50 rounded-lg p-3 border border-gray-600/50">
                <div class="flex items-center gap-2 mb-2">
                  <div class="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                    <span class="text-xs text-white">🎵</span>
                  </div>
                  <span class="text-sm text-white font-medium">抖音电商客服</span>
                </div>
                <p class="text-xs text-gray-400">智策官方 · 免费</p>
                <p class="text-xs text-gray-500">8.2K 复制</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 右侧登录表单区域 -->
    <div class="w-full lg:w-1/2 flex flex-col justify-center px-8 py-16">
      <div class="max-w-md mx-auto w-full">
        <!-- 语言选择 -->
        <div class="flex justify-end mb-8">
          <div class="flex items-center gap-2 text-gray-400 text-sm">
            <span>简体中文</span>
            <ChevronDown :size="16" />
          </div>
        </div>

        <!-- 欢迎标题 -->
        <div class="mb-8">
          <h2 class="text-3xl font-bold text-white mb-2">欢迎使用智策营销</h2>
          <p class="text-gray-400">登录以解锁所有AI功能</p>
        </div>

        <!-- Tab切换 -->
        <div class="mb-6">
          <div class="flex gap-1 p-1 bg-gray-800 rounded-lg">
            <button
              class="flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200"
              :class="[
                activeTab === 'phone'
                  ? 'bg-gray-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-gray-300'
              ]"
              @click="activeTab = 'phone'"
            >
              手机号登录
            </button>
            <button
              class="flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200"
              :class="[
                activeTab === 'account'
                  ? 'bg-gray-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-gray-300'
              ]"
              @click="activeTab = 'account'"
            >
              账号登录
            </button>
          </div>
        </div>

        <!-- 手机号登录表单 -->
        <form v-if="activeTab === 'phone'" @submit.prevent="handlePhoneLogin" class="space-y-4">
          <!-- 手机号输入 -->
          <div>
            <div class="flex gap-2 mb-2">
              <select class="bg-gray-800 border border-gray-600 text-gray-50 px-3 py-2 rounded-lg text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 focus:outline-none">
                <option value="+86">+86</option>
                <option value="+1">+1</option>
                <option value="+44">+44</option>
              </select>
              <input
                v-model="phoneForm.phone"
                type="tel"
                placeholder="请输入手机号"
                class="flex-1 input-primary"
                :class="{ 'border-red-500 bg-red-500/10': phoneForm.phone && !isPhoneValid }"
                maxlength="11"
                required
              />
            </div>
            <p v-if="phoneForm.phone && !isPhoneValid" class="text-red-400 text-xs mt-1">请输入正确的手机号</p>
          </div>

          <!-- 验证码输入 -->
          <div>
            <div class="flex gap-2">
              <input
                v-model="phoneForm.code"
                type="text"
                placeholder="请输入验证码"
                class="flex-1 input-primary"
                maxlength="6"
                required
              />
              <button
                type="button"
                class="px-4 py-2 bg-gray-700 text-gray-200 rounded-lg border border-gray-600 hover:bg-gray-600 hover:border-gray-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="countdown > 0 || !isPhoneValid"
                @click="handleGetCode"
              >
                {{ countdown > 0 ? `${countdown}秒` : '获取验证码' }}
              </button>
            </div>
          </div>

          <!-- 服务条款 -->
          <div class="text-xs text-gray-400">
            <label class="flex items-start gap-2 cursor-pointer">
              <input type="checkbox" v-model="agreeTerms" class="mt-0.5" required />
              <span>已阅读并同意智策营销服务条款、隐私协议、用户协议和隐私政策</span>
            </label>
          </div>

          <!-- 登录按钮 -->
          <button
            type="submit"
            class="w-full btn-primary py-3"
            :disabled="isLoading || !isPhoneFormValid"
          >
            <Loader2 v-if="isLoading" :size="18" class="animate-spin" />
            <span v-else>登录/注册</span>
          </button>

          <!-- 企业登录 -->
          <div class="text-center">
            <button class="text-blue-400 hover:text-blue-300 text-sm transition-colors">
              切换企业成员登录
            </button>
          </div>
        </form>

        <!-- 账号登录表单 -->
        <form v-else @submit.prevent="handleAccountLogin" class="space-y-4">
          <!-- 用户名/邮箱输入 -->
          <div>
            <input
              v-model="accountForm.username"
              type="text"
              placeholder="请输入用户名或邮箱"
              class="w-full input-primary"
              required
            />
          </div>

          <!-- 密码输入 -->
          <div>
            <div class="relative">
              <input
                v-model="accountForm.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="请输入密码"
                class="w-full input-primary pr-10"
                required
                @input="handlePasswordInput"
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

          <!-- 记住密码和忘记密码 -->
          <div class="flex items-center justify-between">
            <label class="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
              <input type="checkbox" v-model="rememberMe" class="rounded" />
              <span>记住密码</span>
            </label>
            <button type="button" class="text-blue-400 hover:text-blue-300 text-sm transition-colors">
              忘记密码？
            </button>
          </div>

          <!-- 登录按钮 -->
          <button
            type="submit"
            class="w-full btn-primary py-3"
            :disabled="isLoading || !isAccountFormValid"
          >
            <Loader2 v-if="isLoading" :size="18" class="animate-spin" />
            <span v-else>登录</span>
          </button>
        </form>

        <!-- 其他登录方式 -->
        <div class="mt-8">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-600"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-gray-950 text-gray-400">其他登录方式</span>
            </div>
          </div>

          <div class="mt-4 flex justify-center">
            <button
              type="button"
              class="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg border border-green-500 hover:border-green-400 hover:bg-green-500 transition-all"
              @click="handleWeChatLogin"
            >
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8.5 12.5c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm7 0c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2z"/>
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
              </svg>
              <span class="text-sm font-medium">微信扫码登录</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Video, Sparkles, Plus, ChevronDown, Loader2, Eye, EyeOff } from 'lucide-vue-next'
import { useAuthStore } from '../store/auth'

const router = useRouter()
const authStore = useAuthStore()

const activeTab = ref<'phone' | 'account'>('phone')
const isLoading = ref(false)
const countdown = ref(0)
const showPassword = ref(false)
const agreeTerms = ref(true)
const rememberMe = ref(false)
const actualPassword = ref('123456')

// 手机号登录表单
const phoneForm = ref({
  phone: '18612345678',
  code: '123456'
})

// 账号登录表单
const accountForm = ref({
  username: '18612345678',
  password: '123456'
})

// 验证手机号
const isPhoneValid = computed(() => {
  return /^1[3-9]\d{9}$/.test(phoneForm.value.phone)
})

// 验证手机号表单
const isPhoneFormValid = computed(() => {
  return isPhoneValid.value && 
         phoneForm.value.code.length === 6 && 
         agreeTerms.value
})

// 验证账号表单
const isAccountFormValid = computed(() => {
  return accountForm.value.username.trim().length > 0 && 
         accountForm.value.password.length >= 6
})

// 获取验证码
const handleGetCode = () => {
  if (!isPhoneValid.value) return
  
  console.log('获取验证码:', phoneForm.value.phone)
  startCountdown()
  // TODO: 调用API获取验证码
}

// 倒计时
const startCountdown = () => {
  countdown.value = 60
  const timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)
}

// 处理密码输入，显示星号但保持实际密码
const handlePasswordInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const inputValue = target.value
  
  // 如果用户输入了内容，保持实际密码为123456
  if (inputValue.length > 0) {
    actualPassword.value = '123456'
    // 显示星号
    target.value = '*'.repeat(inputValue.length)
  }
}

// 处理手机号登录
const handlePhoneLogin = async () => {
  if (!isPhoneFormValid.value) return
  
  isLoading.value = true
  
  // 模拟API调用
  setTimeout(() => {
    authStore.login({
      id: '1',
      name: '用户' + phoneForm.value.phone.slice(-4),
      phone: phoneForm.value.phone
    })
    isLoading.value = false
    
    // 跳转到首页
    router.push('/')
  }, 1000)
}

// 处理账号登录
const handleAccountLogin = async () => {
  if (!isAccountFormValid.value) return
  
  isLoading.value = true
  
  // 模拟API调用
  setTimeout(() => {
    authStore.login({
      id: '1',
      name: accountForm.value.username,
      phone: accountForm.value.username
    })
    isLoading.value = false
    
    // 跳转到首页
    router.push('/')
  }, 1000)
}

// 处理微信登录
const handleWeChatLogin = () => {
  // 模拟微信扫码登录
  console.log('微信扫码登录')
  // 这里可以添加微信登录的逻辑
  // 暂时直接登录
  authStore.login({
    id: '1',
    name: '微信用户',
    phone: '18612345678'
  })
  router.push('/')
}
</script>

<style scoped>
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
