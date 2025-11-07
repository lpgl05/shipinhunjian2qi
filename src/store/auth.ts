import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface User {
  id: string
  name: string
  phone: string
  avatar?: string
}

export const useAuthStore = defineStore('auth', () => {
  // 从 localStorage 恢复认证状态
  const savedAuth = localStorage.getItem('auth_state')
  const savedUser = localStorage.getItem('auth_user')
  
  const isAuthenticated = ref(savedAuth === 'true')
  const user = ref<User | null>(savedUser ? JSON.parse(savedUser) : null)
  const showAuthModal = ref(false)

  // 邀请码白名单（可配置，默认包含一个示例码）
  const invitationCodes = ref<string[]>(['DDPPXXJJ123456'])
  const savedCodes = localStorage.getItem('invitation_codes')
  if (savedCodes) {
    try {
      const arr = JSON.parse(savedCodes)
      if (Array.isArray(arr) && arr.every((c: any) => typeof c === 'string')) {
        invitationCodes.value = arr
      }
    } catch (e) {
      console.warn('加载邀请码配置失败:', e)
    }
  }

  const login = (userData: User) => {
    user.value = userData
    isAuthenticated.value = true
    showAuthModal.value = false
    
    // 持久化到 localStorage
    localStorage.setItem('auth_state', 'true')
    localStorage.setItem('auth_user', JSON.stringify(userData))
  }

  const logout = () => {
    user.value = null
    isAuthenticated.value = false
    
    // 清除 localStorage
    localStorage.removeItem('auth_state')
    localStorage.removeItem('auth_user')
  }

  const toggleAuthModal = () => {
    showAuthModal.value = !showAuthModal.value
  }

  const openAuthModal = () => {
    showAuthModal.value = true
  }

  const closeAuthModal = () => {
    showAuthModal.value = false
  }

  // 设置邀请码白名单
  const setInvitationCodes = (codes: string[]) => {
    invitationCodes.value = codes
    localStorage.setItem('invitation_codes', JSON.stringify(codes))
  }

  // 校验邀请码格式与白名单
  const validateInvitationCode = (code: string) => {
    const formatOk = /^[A-Za-z0-9]+$/.test(code)
    if (!formatOk) return false
    return invitationCodes.value.includes(code)
  }

  // 注册功能：输入手机号、验证码、邀请码、密码
  interface RegisterPayload {
    phone: string
    code: string
    invitationCode: string
    password: string
  }

  const register = (payload: RegisterPayload) => {
    const phoneValid = /^1[3-9]\d{9}$/.test(payload.phone)
    const codeValid = payload.code?.length === 6
    const invitationFormatValid = /^[A-Za-z0-9]+$/.test(payload.invitationCode)
    const invitationAllowed = invitationCodes.value.includes(payload.invitationCode)
    const passwordValid = (payload.password || '').length >= 6

    if (!phoneValid || !codeValid || !invitationFormatValid || !invitationAllowed || !passwordValid) {
      throw new Error('注册信息验证失败，请检查手机号/验证码/邀请码/密码')
    }

    // 模拟注册成功后自动登录
    const newUser: User = {
      id: Date.now().toString(),
      name: '用户' + payload.phone.slice(-4),
      phone: payload.phone
    }

    login(newUser)

    // 记录注册用户（演示用途）
    try {
      const registeredUsers = JSON.parse(localStorage.getItem('registered_users') || '[]')
      registeredUsers.push({ phone: payload.phone, createdAt: new Date().toISOString() })
      localStorage.setItem('registered_users', JSON.stringify(registeredUsers))
    } catch (e) {
      console.warn('记录注册用户失败:', e)
    }
  }

  return {
    isAuthenticated,
    user,
    showAuthModal,
    login,
    logout,
    toggleAuthModal,
    openAuthModal,
    closeAuthModal,
    // 邀请码相关
    invitationCodes,
    setInvitationCodes,
    validateInvitationCode,
    // 注册
    register
  }
})


