import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface User {
  id: string
  name: string
  phone: string
  avatar?: string
}

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(false)
  const user = ref<User | null>(null)
  const showAuthModal = ref(false)

  const login = (userData: User) => {
    user.value = userData
    isAuthenticated.value = true
    showAuthModal.value = false
  }

  const logout = () => {
    user.value = null
    isAuthenticated.value = false
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


