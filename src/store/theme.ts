import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

/**
 * 主题状态管理
 * 支持深色和浅色主题切换
 */
export const useThemeStore = defineStore('theme', () => {
  // ========== 状态 ==========
  
  /**
   * 当前主题
   * 'dark': 深色主题
   * 'light': 浅色主题
   */
  const theme = ref<'dark' | 'light'>('dark')
  
  // ========== 初始化 ==========
  
  // 从 localStorage 恢复主题设置
  const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' | null
  if (savedTheme) {
    theme.value = savedTheme
  }
  
  // 初始化时应用主题到 html 标签
  const applyTheme = (newTheme: 'dark' | 'light') => {
    const html = document.documentElement
    if (newTheme === 'dark') {
      html.classList.add('dark')
      html.classList.remove('light')
    } else {
      html.classList.add('light')
      html.classList.remove('dark')
    }
  }
  
  // 立即应用初始主题
  applyTheme(theme.value)
  
  // ========== Actions ==========
  
  /**
   * 切换到深色主题
   */
  const setDarkTheme = () => {
    theme.value = 'dark'
  }
  
  /**
   * 切换到浅色主题
   */
  const setLightTheme = () => {
    theme.value = 'light'
  }
  
  /**
   * 切换主题
   */
  const toggleTheme = () => {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
  }
  
  /**
   * 设置主题
   */
  const setTheme = (newTheme: 'dark' | 'light') => {
    theme.value = newTheme
  }
  
  // ========== Watchers ==========
  
  // 监听主题变化，自动应用主题和保存到 localStorage
  watch(theme, (newTheme) => {
    applyTheme(newTheme)
    localStorage.setItem('theme', newTheme)
  })
  
  return {
    theme,
    setDarkTheme,
    setLightTheme,
    toggleTheme,
    setTheme
  }
})

