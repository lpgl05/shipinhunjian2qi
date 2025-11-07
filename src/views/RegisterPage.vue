<template>
  <div class="min-h-screen bg-gray-950 flex">
    <!-- 左侧宣传内容（与登录页保持风格一致） -->
    <div class="hidden lg:flex lg:w-1/2 relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20"></div>
      <div class="absolute inset-0 opacity-30" style="background-image: url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%239C92AC%22 fill-opacity=%220.1%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"></div>
      <div class="relative z-10 flex flex-col justify-center px-12 py-16">
        <div class="mb-8">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
              <Video :size="24" class="text-white" />
            </div>
            <div class="text-2xl font-bold text-white">社会化营销平台</div>
          </div>
        </div>
        <div class="mb-8">
          <h1 class="text-4xl font-bold text-white mb-4 leading-tight">创建你的账号，开启智能创作</h1>
          <p class="text-xl text-gray-300 leading-relaxed">手机号+验证码+邀请码+密码完成注册</p>
        </div>
      </div>
    </div>

    <!-- 右侧注册表单区域 -->
    <div class="w-full lg:w-1/2 flex flex-col justify-center px-8 py-16">
      <div class="max-w-md mx-auto w-full">
        <div class="mb-8">
          <h2 class="text-3xl font-bold text-white mb-2">免费注册</h2>
          <p class="text-gray-400">填写信息以创建你的平台账号</p>
        </div>

        <form @submit.prevent="handleRegister" class="space-y-4">
          <!-- 手机号输入 -->
          <div>
            <div class="flex gap-2 mb-2">
              <select class="bg-gray-800 border border-gray-600 text-gray-50 px-3 py-2 rounded-lg text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 focus:outline-none">
                <option value="+86">+86</option>
                <option value="+1">+1</option>
                <option value="+44">+44</option>
              </select>
              <input
                v-model="registerForm.phone"
                type="tel"
                placeholder="请输入手机号"
                class="flex-1 input-primary"
                :class="{ 'border-red-500 bg-red-500/10': registerForm.phone && !isPhoneValid }"
                maxlength="11"
                required
              />
            </div>
            <p v-if="registerForm.phone && !isPhoneValid" class="text-red-400 text-xs mt-1">请输入正确的手机号</p>
          </div>

          <!-- 验证码输入 -->
          <div>
            <div class="flex gap-2">
              <input
                v-model="registerForm.code"
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

          <!-- 邀请码输入 -->
          <div>
            <input
              v-model="registerForm.invitationCode"
              type="text"
              placeholder="请输入邀请码（字母+数字）"
              class="w-full input-primary"
              required
            />
            <p v-if="registerForm.invitationCode && !isInvitationFormatValid" class="text-red-400 text-xs mt-1">邀请码需由字母和数字组成</p>
            <p v-if="registerForm.invitationCode && isInvitationFormatValid && !isInvitationAllowed" class="text-red-400 text-xs mt-1">邀请码无效，请联系管理员</p>
            <p v-if="!registerForm.invitationCode" class="text-gray-500 text-xs mt-1">当前有效邀请码：DDPPXXJJ123456</p>
          </div>

          <!-- 设置密码 -->
          <div>
            <div class="relative">
              <input
                v-model="registerForm.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="请设置密码（不少于6位）"
                class="w-full input-primary pr-10"
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
            <p v-if="registerForm.password && registerForm.password.length < 6" class="text-red-400 text-xs mt-1">密码长度至少6位</p>
          </div>

          <!-- 确认密码 -->
          <div>
            <input
              v-model="registerForm.confirmPassword"
              type="password"
              placeholder="请再次输入密码"
              class="w-full input-primary"
              required
            />
            <p v-if="registerForm.confirmPassword && !passwordsMatch" class="text-red-400 text-xs mt-1">两次输入的密码不一致</p>
          </div>

          <!-- 服务条款 -->
          <div class="text-xs text-gray-400">
            <label class="flex items-start gap-2 cursor-pointer">
              <input type="checkbox" v-model="agreeTerms" class="mt-0.5" required />
              <span>已阅读并同意社会化营销平台服务条款、隐私协议、用户协议和隐私政策</span>
            </label>
          </div>

          <!-- 注册按钮 -->
          <button
            type="submit"
            class="w-full btn-primary py-3"
            :disabled="isLoading || !isFormValid"
          >
            <Loader2 v-if="isLoading" :size="18" class="animate-spin" />
            <span v-else>注册</span>
          </button>

          <!-- 已有账号，去登录 -->
          <div class="text-center mt-4">
            <button type="button" class="text-blue-400 hover:text-blue-300 text-sm transition-colors" @click="goLogin">已有账号？去登录</button>
          </div>

          <!-- 错误信息 -->
          <p v-if="errorMessage" class="mt-2 text-red-400 text-sm">{{ errorMessage }}</p>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Video, Loader2, Eye, EyeOff } from 'lucide-vue-next'
import { useAuthStore } from '../store/auth'

const router = useRouter()
const authStore = useAuthStore()

const isLoading = ref(false)
const countdown = ref(0)
const showPassword = ref(false)
const agreeTerms = ref(true)
const errorMessage = ref('')

const registerForm = ref({
  phone: '',
  code: '',
  invitationCode: '',
  password: '',
  confirmPassword: ''
})

const isPhoneValid = computed(() => /^1[3-9]\d{9}$/.test(registerForm.value.phone))
const isInvitationFormatValid = computed(() => /^[A-Za-z0-9]+$/.test(registerForm.value.invitationCode))
const isInvitationAllowed = computed(() => authStore.validateInvitationCode(registerForm.value.invitationCode))

const isFormValid = computed(() =>
  isPhoneValid.value &&
  registerForm.value.code.length === 6 &&
  isInvitationFormatValid.value &&
  isInvitationAllowed.value &&
  registerForm.value.password.length >= 6 &&
  passwordsMatch.value &&
  agreeTerms.value
)

const passwordsMatch = computed(() => registerForm.value.password === registerForm.value.confirmPassword)

const handleGetCode = () => {
  if (!isPhoneValid.value) return
  startCountdown()
  // TODO: 调用API获取验证码
}

const startCountdown = () => {
  countdown.value = 60
  const timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)
}

const handleRegister = async () => {
  errorMessage.value = ''
  if (!isFormValid.value) return
  isLoading.value = true

  setTimeout(() => {
    try {
      if (!passwordsMatch.value) {
        throw new Error('两次输入的密码不一致')
      }
      authStore.register({
        phone: registerForm.value.phone,
        code: registerForm.value.code,
        invitationCode: registerForm.value.invitationCode,
        password: registerForm.value.password
      })
      router.push('/')
    } catch (e: any) {
      errorMessage.value = e?.message || '注册失败，请稍后重试'
    } finally {
      isLoading.value = false
    }
  }, 600)
}

const goLogin = () => router.push('/login')
</script>

<style scoped>
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.animate-spin { animation: spin 1s linear infinite; }
</style>
