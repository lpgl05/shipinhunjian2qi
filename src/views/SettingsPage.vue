<template>
  <div class="min-h-screen bg-gray-900 text-gray-50">
    <!-- Header -->
    <header class="border-b border-gray-800 bg-gray-900">
      <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <!-- Logo -->
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-violet-500 rounded-lg flex items-center justify-center">
            <Sparkles :size="24" class="text-white" />
          </div>
          <span class="text-xl font-bold">AI社会化营销大师</span>
        </div>

        <!-- Navigation -->
        <nav class="flex items-center gap-6">
          <router-link to="/" class="text-gray-400 hover:text-gray-50 transition-colors">首页</router-link>
          <router-link to="/workspace" class="text-gray-400 hover:text-gray-50 transition-colors">工作台</router-link>
          <router-link to="/profile" class="text-gray-400 hover:text-gray-50 transition-colors">个人中心</router-link>
          <router-link to="/settings" class="text-blue-400 font-medium">设置</router-link>
        </nav>

        <!-- User Info -->
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-violet-500 rounded-full flex items-center justify-center">
            <span class="text-sm font-medium text-white">{{ authStore.user?.name?.charAt(0) || 'U' }}</span>
          </div>
          <span class="text-gray-300">{{ authStore.user?.name }}</span>
          <button 
            class="px-4 py-2 text-gray-300 hover:text-gray-50 transition-colors"
            @click="handleLogout"
          >
            退出登录
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-6xl mx-auto px-6 py-8">
      <div class="flex gap-8">
        <!-- Settings Sidebar -->
        <aside class="w-64 flex-shrink-0">
          <div class="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-4">
            <h2 class="text-lg font-bold mb-4">设置</h2>
            <nav class="space-y-2">
              <button
                v-for="section in settingsSections"
                :key="section.id"
                class="w-full text-left px-4 py-3 rounded-lg transition-all duration-200"
                :class="[
                  activeSection === section.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-gray-50 hover:bg-gray-700'
                ]"
                @click="activeSection = section.id"
              >
                <div class="flex items-center gap-3">
                  <component :is="section.icon" :size="20" />
                  <span>{{ section.name }}</span>
                </div>
              </button>
            </nav>
          </div>
        </aside>

        <!-- Settings Content -->
        <div class="flex-1">
          <!-- 通用设置 -->
          <div v-if="activeSection === 'general'" class="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6">
            <h2 class="text-xl font-bold mb-6">通用设置</h2>
            
            <div class="space-y-6">
              <!-- 语言设置 -->
              <div class="p-4 bg-gray-700/50 rounded-lg">
                <h3 class="text-lg font-semibold mb-4">语言设置</h3>
                <div class="flex items-center gap-4">
                  <label class="text-sm font-medium text-gray-300">界面语言</label>
                  <select v-model="settings.language" class="px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg text-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 focus:outline-none">
                    <option value="zh-CN">简体中文</option>
                    <option value="en-US">English</option>
                    <option value="ja-JP">日本語</option>
                  </select>
                </div>
              </div>

              <!-- 主题设置 -->
              <div class="p-4 bg-gray-700/50 rounded-lg">
                <h3 class="text-lg font-semibold mb-4">主题设置</h3>
                <div class="space-y-4">
                  <div class="flex items-center justify-between">
                    <div>
                      <div class="font-medium">深色模式</div>
                      <div class="text-sm text-gray-400">使用深色主题界面</div>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input v-model="settings.darkMode" type="checkbox" class="sr-only peer">
                      <div class="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <div class="flex items-center justify-between">
                    <div>
                      <div class="font-medium">自动切换</div>
                      <div class="text-sm text-gray-400">根据系统时间自动切换主题</div>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input v-model="settings.autoTheme" type="checkbox" class="sr-only peer">
                      <div class="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              <!-- 通知设置 -->
              <div class="p-4 bg-gray-700/50 rounded-lg">
                <h3 class="text-lg font-semibold mb-4">通知设置</h3>
                <div class="space-y-4">
                  <div class="flex items-center justify-between">
                    <div>
                      <div class="font-medium">邮件通知</div>
                      <div class="text-sm text-gray-400">接收重要更新和活动通知</div>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input v-model="settings.emailNotifications" type="checkbox" class="sr-only peer">
                      <div class="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <div class="flex items-center justify-between">
                    <div>
                      <div class="font-medium">浏览器通知</div>
                      <div class="text-sm text-gray-400">在浏览器中显示通知</div>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input v-model="settings.browserNotifications" type="checkbox" class="sr-only peer">
                      <div class="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- AI设置 -->
          <div v-if="activeSection === 'ai'" class="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6">
            <h2 class="text-xl font-bold mb-6">AI设置</h2>
            
            <div class="space-y-6">
              <!-- 默认AI模型 -->
              <div class="p-4 bg-gray-700/50 rounded-lg">
                <h3 class="text-lg font-semibold mb-4">默认AI模型</h3>
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">文本生成模型</label>
                    <select v-model="aiSettings.textModel" class="w-full px-4 py-3 bg-gray-600 border border-gray-500 rounded-lg text-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 focus:outline-none">
                      <option value="gpt-4">GPT-4</option>
                      <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                      <option value="claude-3">Claude 3</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">图像生成模型</label>
                    <select v-model="aiSettings.imageModel" class="w-full px-4 py-3 bg-gray-600 border border-gray-500 rounded-lg text-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 focus:outline-none">
                      <option value="dall-e-3">DALL-E 3</option>
                      <option value="midjourney">Midjourney</option>
                      <option value="stable-diffusion">Stable Diffusion</option>
                    </select>
                  </div>
                </div>
              </div>

              <!-- 创作偏好 -->
              <div class="p-4 bg-gray-700/50 rounded-lg">
                <h3 class="text-lg font-semibold mb-4">创作偏好</h3>
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">创作风格</label>
                    <div class="flex flex-wrap gap-2">
                      <button
                        v-for="style in creativeStyles"
                        :key="style"
                        class="px-4 py-2 rounded-lg transition-all"
                        :class="[
                          aiSettings.creativeStyle === style
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                        ]"
                        @click="aiSettings.creativeStyle = style"
                      >
                        {{ style }}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">内容长度</label>
                    <div class="flex items-center gap-4">
                      <span class="text-sm text-gray-400">简洁</span>
                      <input
                        v-model="aiSettings.contentLength"
                        type="range"
                        min="1"
                        max="5"
                        class="flex-1 h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                      />
                      <span class="text-sm text-gray-400">详细</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 工作台设置 -->
          <div v-if="activeSection === 'workspace'" class="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6">
            <h2 class="text-xl font-bold mb-6">工作台设置</h2>
            
            <div class="space-y-6">
              <!-- 界面设置 -->
              <div class="p-4 bg-gray-700/50 rounded-lg">
                <h3 class="text-lg font-semibold mb-4">界面设置</h3>
                <div class="space-y-4">
                  <div class="flex items-center justify-between">
                    <div>
                      <div class="font-medium">侧边栏自动收起</div>
                      <div class="text-sm text-gray-400">在小屏幕上自动收起侧边栏</div>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input v-model="workspaceSettings.autoCollapse" type="checkbox" class="sr-only peer">
                      <div class="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <div class="flex items-center justify-between">
                    <div>
                      <div class="font-medium">显示网格线</div>
                      <div class="text-sm text-gray-400">在画布中显示辅助网格线</div>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input v-model="workspaceSettings.showGrid" type="checkbox" class="sr-only peer">
                      <div class="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              <!-- 自动保存 -->
              <div class="p-4 bg-gray-700/50 rounded-lg">
                <h3 class="text-lg font-semibold mb-4">自动保存</h3>
                <div class="space-y-4">
                  <div class="flex items-center justify-between">
                    <div>
                      <div class="font-medium">启用自动保存</div>
                      <div class="text-sm text-gray-400">定期自动保存工作内容</div>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input v-model="workspaceSettings.autoSave" type="checkbox" class="sr-only peer">
                      <div class="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <div v-if="workspaceSettings.autoSave">
                    <label class="block text-sm font-medium text-gray-300 mb-2">保存间隔</label>
                    <select v-model="workspaceSettings.saveInterval" class="w-full px-4 py-3 bg-gray-600 border border-gray-500 rounded-lg text-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 focus:outline-none">
                      <option value="30">30秒</option>
                      <option value="60">1分钟</option>
                      <option value="300">5分钟</option>
                      <option value="600">10分钟</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 数据管理 -->
          <div v-if="activeSection === 'data'" class="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6">
            <h2 class="text-xl font-bold mb-6">数据管理</h2>
            
            <div class="space-y-6">
              <!-- 数据导出 -->
              <div class="p-4 bg-gray-700/50 rounded-lg">
                <h3 class="text-lg font-semibold mb-4">数据导出</h3>
                <div class="space-y-4">
                  <div class="flex items-center justify-between">
                    <div>
                      <div class="font-medium">导出项目数据</div>
                      <div class="text-sm text-gray-400">导出所有项目和相关文件</div>
                    </div>
                    <button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      导出
                    </button>
                  </div>
                  <div class="flex items-center justify-between">
                    <div>
                      <div class="font-medium">导出使用统计</div>
                      <div class="text-sm text-gray-400">导出详细的使用统计报告</div>
                    </div>
                    <button class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                      导出
                    </button>
                  </div>
                </div>
              </div>

              <!-- 数据清理 -->
              <div class="p-4 bg-gray-700/50 rounded-lg">
                <h3 class="text-lg font-semibold mb-4">数据清理</h3>
                <div class="space-y-4">
                  <div class="flex items-center justify-between">
                    <div>
                      <div class="font-medium">清理临时文件</div>
                      <div class="text-sm text-gray-400">删除所有临时和缓存文件</div>
                    </div>
                    <button class="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                      清理
                    </button>
                  </div>
                  <div class="flex items-center justify-between">
                    <div>
                      <div class="font-medium">重置所有设置</div>
                      <div class="text-sm text-gray-400">将所有设置恢复为默认值</div>
                    </div>
                    <button class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                      重置
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 保存按钮 -->
          <div class="mt-8 flex justify-end">
            <button class="px-6 py-3 bg-gradient-to-r from-blue-500 to-violet-500 text-white rounded-lg hover:brightness-110 transition-all">
              保存设置
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { 
  Sparkles, 
  Settings, 
  Bot, 
  Monitor, 
  Database,
  Globe,
  Palette,
  Save
} from 'lucide-vue-next'
import { useAuthStore } from '../store/auth'

const router = useRouter()
const authStore = useAuthStore()

const activeSection = ref('general')

const settingsSections = [
  { id: 'general', name: '通用设置', icon: Settings },
  { id: 'ai', name: 'AI设置', icon: Bot },
  { id: 'workspace', name: '工作台设置', icon: Monitor },
  { id: 'data', name: '数据管理', icon: Database }
]

// 通用设置
const settings = reactive({
  language: 'zh-CN',
  darkMode: true,
  autoTheme: false,
  emailNotifications: true,
  browserNotifications: false
})

// AI设置
const aiSettings = reactive({
  textModel: 'gpt-4',
  imageModel: 'dall-e-3',
  creativeStyle: '专业',
  contentLength: 3
})

const creativeStyles = ['专业', '创意', '简洁', '详细', '幽默', '正式']

// 工作台设置
const workspaceSettings = reactive({
  autoCollapse: true,
  showGrid: false,
  autoSave: true,
  saveInterval: 60
})

// 处理登出
const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
/* 自定义样式 */
</style>
