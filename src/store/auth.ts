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

  return {
    isAuthenticated,
    user,
    showAuthModal,
    login,
    logout,
    toggleAuthModal,
    openAuthModal,
    closeAuthModal
  }
})


