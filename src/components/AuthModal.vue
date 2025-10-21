<template>
  <TransitionRoot :show="authStore.showAuthModal" as="template">
    <Dialog as="div" class="relative z-50" @close="authStore.closeAuthModal">
      <!-- 背景遮罩 -->
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/80 backdrop-blur-sm" />
      </TransitionChild>

      <!-- 模态框容器 -->
      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4">
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel class="w-full max-w-sm transform overflow-hidden rounded-xl bg-gray-700 border border-gray-600 p-6 shadow-2xl transition-all">
              <!-- 关闭按钮 -->
              <button
                class="absolute top-3 right-3 text-gray-400 hover:text-gray-200 transition-colors"
                @click="authStore.closeAuthModal"
              >
                <X :size="20" />
              </button>

              <!-- Logo和标题 -->
              <div class="text-center mb-6">
                <div class="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-violet-500 rounded-xl mb-3">
                  <Video :size="24" class="text-white" />
                </div>
                <DialogTitle class="text-xl font-bold text-gray-50 mb-2">
                  欢迎来到智策营销
                </DialogTitle>
                <p class="text-xs text-gray-400">
                  登录以解锁所有功能
                </p>
              </div>

              <!-- Tab切换 -->
              <div class="mb-4">
                <div class="flex gap-2 p-1 bg-gray-800 rounded-lg">
                  <button
                    class="flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200"
                    :class="[
                      activeTab === 'login'
                        ? 'bg-gray-600 text-gray-50 shadow-lg'
                        : 'text-gray-400 hover:text-gray-300'
                    ]"
                    @click="activeTab = 'login'"
                  >
                    登录
                  </button>
                  <button
                    class="flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200"
                    :class="[
                      activeTab === 'signup'
                        ? 'bg-gray-600 text-gray-50 shadow-lg'
                        : 'text-gray-400 hover:text-gray-300'
                    ]"
                    @click="activeTab = 'signup'"
                  >
                    注册
                  </button>
                </div>
              </div>

              <!-- 登录表单 -->
              <form v-if="activeTab === 'login'" @submit.prevent="handleLogin" class="space-y-3">
                <!-- 手机号输入 -->
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">
                    手机号
                  </label>
                  <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone :size="20" class="text-gray-400" />
                    </div>
                    <input
                      v-model="loginForm.phone"
                      type="tel"
                      placeholder="请输入手机号"
                      class="input-primary w-full pl-10"
                      maxlength="11"
                      required
                    />
                  </div>
                </div>

                <!-- 验证码输入 -->
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">
                    验证码
                  </label>
                  <div class="flex gap-2">
                    <div class="relative flex-1">
                      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Shield :size="20" class="text-gray-400" />
                      </div>
                      <input
                        v-model="loginForm.code"
                        type="text"
                        placeholder="请输入验证码"
                        class="input-primary w-full pl-10"
                        maxlength="6"
                        required
                      />
                    </div>
                    <button
                      type="button"
                      class="btn-secondary whitespace-nowrap"
                      :disabled="countdown > 0 || !isPhoneValid"
                      @click="handleGetCode"
                    >
                      {{ countdown > 0 ? `${countdown}秒` : '获取验证码' }}
                    </button>
                  </div>
                </div>

                <!-- 登录按钮 -->
                <button
                  type="submit"
                  class="btn-primary w-full mt-4"
                  :disabled="isLoading || !isLoginFormValid"
                >
                  <Loader2 v-if="isLoading" :size="18" class="animate-spin" />
                  <span v-else>登录</span>
                </button>

                <!-- 其他登录方式 -->
                <div class="mt-4">
                  <div class="relative">
                    <div class="absolute inset-0 flex items-center">
                      <div class="w-full border-t border-gray-600"></div>
                    </div>
                    <div class="relative flex justify-center text-sm">
                      <span class="px-2 bg-gray-700 text-gray-400">其他登录方式</span>
                    </div>
                  </div>

                  <div class="mt-4 grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      class="flex items-center justify-center gap-2 px-4 py-2 bg-gray-800 text-gray-300 rounded-lg border border-gray-600 hover:border-gray-500 hover:bg-gray-700 transition-all"
                    >
                      <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z"/>
                      </svg>
                      <span class="text-sm">GitHub</span>
                    </button>

                    <button
                      type="button"
                      class="flex items-center justify-center gap-2 px-4 py-2 bg-gray-800 text-gray-300 rounded-lg border border-gray-600 hover:border-gray-500 hover:bg-gray-700 transition-all"
                    >
                      <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M22.46 6c-.85.38-1.78.64-2.75.76 1-.6 1.76-1.55 2.12-2.68-.93.55-1.96.96-3.06 1.18-.88-.94-2.13-1.53-3.51-1.53-2.66 0-4.81 2.16-4.81 4.81 0 .38.04.75.13 1.1-4-.2-7.54-2.12-9.91-5.04-.42.72-.66 1.55-.66 2.44 0 1.67.85 3.14 2.14 4-.79-.03-1.53-.24-2.18-.6v.06c0 2.33 1.66 4.28 3.86 4.72-.4.11-.83.17-1.27.17-.31 0-.62-.03-.92-.08.62 1.94 2.42 3.35 4.55 3.39-1.67 1.31-3.77 2.09-6.05 2.09-.39 0-.78-.02-1.17-.07 2.18 1.4 4.77 2.21 7.55 2.21 9.06 0 14.01-7.5 14.01-14.01 0-.21 0-.42-.02-.63.96-.69 1.8-1.56 2.46-2.55z"/>
                      </svg>
                      <span class="text-sm">Twitter</span>
                    </button>
                  </div>
                </div>
              </form>

              <!-- 注册表单 -->
              <form v-else @submit.prevent="handleSignup" class="space-y-3">
                <!-- 手机号输入 -->
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">
                    手机号
                  </label>
                  <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone :size="20" class="text-gray-400" />
                    </div>
                    <input
                      v-model="signupForm.phone"
                      type="tel"
                      placeholder="请输入手机号"
                      class="input-primary w-full pl-10"
                      maxlength="11"
                      required
                    />
                  </div>
                </div>

                <!-- 验证码输入 -->
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">
                    验证码
                  </label>
                  <div class="flex gap-2">
                    <div class="relative flex-1">
                      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Shield :size="20" class="text-gray-400" />
                      </div>
                      <input
                        v-model="signupForm.code"
                        type="text"
                        placeholder="请输入验证码"
                        class="input-primary w-full pl-10"
                        maxlength="6"
                        required
                      />
                    </div>
                    <button
                      type="button"
                      class="btn-secondary whitespace-nowrap"
                      :disabled="countdown > 0 || !isPhoneValidSignup"
                      @click="handleGetCodeSignup"
                    >
                      {{ countdown > 0 ? `${countdown}秒` : '获取验证码' }}
                    </button>
                  </div>
                </div>

                <!-- 用户名输入 -->
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">
                    用户名
                  </label>
                  <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User :size="20" class="text-gray-400" />
                    </div>
                    <input
                      v-model="signupForm.username"
                      type="text"
                      placeholder="请输入用户名"
                      class="input-primary w-full pl-10"
                      required
                    />
                  </div>
                </div>

                <!-- 注册按钮 -->
                <button
                  type="submit"
                  class="btn-primary w-full mt-4"
                  :disabled="isLoading || !isSignupFormValid"
                >
                  <Loader2 v-if="isLoading" :size="18" class="animate-spin" />
                  <span v-else>注册</span>
                </button>

                <!-- 服务条款 -->
                <p class="mt-3 text-xs text-gray-400 text-center">
                  注册即表示同意
                  <a href="#" class="text-blue-400 hover:text-blue-300">用户协议</a>
                  和
                  <a href="#" class="text-blue-400 hover:text-blue-300">隐私政策</a>
                </p>
              </form>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle,
} from '@headlessui/vue'
import { Video, X, Phone, Shield, User, Loader2 } from 'lucide-vue-next'
import { useAuthStore } from '../store/auth'

const authStore = useAuthStore()

const activeTab = ref<'login' | 'signup'>('login')
const isLoading = ref(false)
const countdown = ref(0)

// 登录表单
const loginForm = ref({
  phone: '',
  code: ''
})

// 注册表单
const signupForm = ref({
  phone: '',
  code: '',
  username: ''
})

// 验证手机号
const isPhoneValid = computed(() => {
  return /^1[3-9]\d{9}$/.test(loginForm.value.phone)
})

const isPhoneValidSignup = computed(() => {
  return /^1[3-9]\d{9}$/.test(signupForm.value.phone)
})

// 验证登录表单
const isLoginFormValid = computed(() => {
  return isPhoneValid.value && loginForm.value.code.length === 6
})

// 验证注册表单
const isSignupFormValid = computed(() => {
  return isPhoneValidSignup.value && 
         signupForm.value.code.length === 6 && 
         signupForm.value.username.trim().length > 0
})

// 获取验证码
const handleGetCode = () => {
  console.log('获取验证码:', loginForm.value.phone)
  startCountdown()
  // TODO: 调用API获取验证码
}

const handleGetCodeSignup = () => {
  console.log('获取验证码:', signupForm.value.phone)
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

// 处理登录
const handleLogin = async () => {
  isLoading.value = true
  
  // 模拟API调用
  setTimeout(() => {
    authStore.login({
      id: '1',
      name: '用户' + loginForm.value.phone.slice(-4),
      phone: loginForm.value.phone
    })
    isLoading.value = false
    
    // 重置表单
    loginForm.value = { phone: '', code: '' }
  }, 1000)
}

// 处理注册
const handleSignup = async () => {
  isLoading.value = true
  
  // 模拟API调用
  setTimeout(() => {
    authStore.login({
      id: '1',
      name: signupForm.value.username,
      phone: signupForm.value.phone
    })
    isLoading.value = false
    
    // 重置表单
    signupForm.value = { phone: '', code: '', username: '' }
  }, 1000)
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

