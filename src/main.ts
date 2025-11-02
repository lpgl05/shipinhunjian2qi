import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import './style.css'
import App from './App.vue'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// 初始化主题（必须在mount之前）
import { useThemeStore } from './store/theme'
useThemeStore()

app.mount('#app')
