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
          <router-link to="/profile" class="text-blue-400 font-medium">个人中心</router-link>
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
    <main class="max-w-4xl mx-auto px-6 py-8">
      <!-- Profile Header -->
      <div class="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-8 mb-8">
        <div class="flex items-center gap-6">
          <!-- Avatar -->
          <div class="relative">
            <div class="w-24 h-24 bg-gradient-to-r from-blue-500 to-violet-500 rounded-full flex items-center justify-center">
              <span class="text-2xl font-bold text-white">{{ authStore.user?.name?.charAt(0) || 'U' }}</span>
            </div>
            <button class="absolute -bottom-2 -right-2 w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors">
              <Camera :size="16" class="text-gray-300" />
            </button>
          </div>

          <!-- User Info -->
          <div class="flex-1">
            <h1 class="text-2xl font-bold mb-2">{{ authStore.user?.name || '用户' }}</h1>
            <p class="text-gray-400 mb-4">{{ authStore.user?.phone || '未绑定手机号' }}</p>
            
            <!-- Stats -->
            <div class="flex gap-8">
              <div class="text-center">
                <div class="text-2xl font-bold text-blue-400">{{ userStats.projects }}</div>
                <div class="text-sm text-gray-400">项目数</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-green-400">{{ userStats.videos }}</div>
                <div class="text-sm text-gray-400">视频数</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-purple-400">{{ userStats.usage }}</div>
                <div class="text-sm text-gray-400">使用次数</div>
              </div>
            </div>
          </div>

          <!-- Edit Button -->
          <button class="px-6 py-2 bg-gradient-to-r from-blue-500 to-violet-500 text-white rounded-lg hover:brightness-110 transition-all">
            编辑资料
          </button>
        </div>
      </div>

      <!-- Content Tabs -->
      <div class="mb-6">
        <div class="flex gap-1 p-1 bg-gray-800 rounded-lg w-fit">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            class="px-6 py-2 text-sm font-medium rounded-md transition-all duration-200"
            :class="[
              activeTab === tab.id
                ? 'bg-gray-600 text-white shadow-lg'
                : 'text-gray-400 hover:text-gray-300'
            ]"
            @click="activeTab = tab.id"
          >
            {{ tab.name }}
          </button>
        </div>
      </div>

      <!-- Tab Content -->
      <div class="space-y-6">
        <!-- 基本信息 -->
        <div v-if="activeTab === 'basic'" class="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6">
          <h2 class="text-xl font-bold mb-6">基本信息</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">用户名</label>
              <input
                v-model="profileForm.name"
                type="text"
                class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 focus:outline-none"
                placeholder="请输入用户名"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">手机号</label>
              <input
                v-model="profileForm.phone"
                type="tel"
                class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 focus:outline-none"
                placeholder="请输入手机号"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">邮箱</label>
              <input
                v-model="profileForm.email"
                type="email"
                class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 focus:outline-none"
                placeholder="请输入邮箱"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">公司/组织</label>
              <input
                v-model="profileForm.company"
                type="text"
                class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 focus:outline-none"
                placeholder="请输入公司或组织名称"
              />
            </div>
          </div>
          <div class="mt-6">
            <label class="block text-sm font-medium text-gray-300 mb-2">个人简介</label>
            <textarea
              v-model="profileForm.bio"
              rows="4"
              class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 focus:outline-none resize-none"
              placeholder="介绍一下自己..."
            ></textarea>
          </div>
          <div class="mt-6 flex justify-end">
            <button class="px-6 py-2 bg-gradient-to-r from-blue-500 to-violet-500 text-white rounded-lg hover:brightness-110 transition-all">
              保存修改
            </button>
          </div>
        </div>

        <!-- 使用统计 -->
        <div v-if="activeTab === 'stats'" class="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6">
          <h2 class="text-xl font-bold mb-6">使用统计</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="p-6 bg-gray-700/50 rounded-xl">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Video :size="20" class="text-white" />
                </div>
                <div>
                  <div class="text-2xl font-bold">{{ userStats.videos }}</div>
                  <div class="text-sm text-gray-400">视频创作</div>
                </div>
              </div>
              <div class="text-xs text-gray-500">本月新增 {{ userStats.videosThisMonth }} 个</div>
            </div>

            <div class="p-6 bg-gray-700/50 rounded-xl">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                  <Clock :size="20" class="text-white" />
                </div>
                <div>
                  <div class="text-2xl font-bold">{{ userStats.totalTime }}</div>
                  <div class="text-sm text-gray-400">使用时长</div>
                </div>
              </div>
              <div class="text-xs text-gray-500">本月 {{ userStats.timeThisMonth }} 小时</div>
            </div>

            <div class="p-6 bg-gray-700/50 rounded-xl">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                  <TrendingUp :size="20" class="text-white" />
                </div>
                <div>
                  <div class="text-2xl font-bold">{{ userStats.efficiency }}%</div>
                  <div class="text-sm text-gray-400">效率提升</div>
                </div>
              </div>
              <div class="text-xs text-gray-500">相比传统方式</div>
            </div>
          </div>
        </div>

        <!-- 账户设置 -->
        <div v-if="activeTab === 'account'" class="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6">
          <h2 class="text-xl font-bold mb-6">账户设置</h2>
          <div class="space-y-6">
            <!-- 密码修改 -->
            <div class="p-4 bg-gray-700/50 rounded-lg">
              <h3 class="text-lg font-semibold mb-4">修改密码</h3>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">当前密码</label>
                  <input
                    v-model="passwordForm.current"
                    type="password"
                    class="w-full px-4 py-3 bg-gray-600 border border-gray-500 rounded-lg text-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 focus:outline-none"
                    placeholder="请输入当前密码"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">新密码</label>
                  <input
                    v-model="passwordForm.new"
                    type="password"
                    class="w-full px-4 py-3 bg-gray-600 border border-gray-500 rounded-lg text-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 focus:outline-none"
                    placeholder="请输入新密码"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">确认密码</label>
                  <input
                    v-model="passwordForm.confirm"
                    type="password"
                    class="w-full px-4 py-3 bg-gray-600 border border-gray-500 rounded-lg text-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 focus:outline-none"
                    placeholder="请再次输入新密码"
                  />
                </div>
              </div>
              <div class="mt-4">
                <button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  修改密码
                </button>
              </div>
            </div>

            <!-- 账户安全 -->
            <div class="p-4 bg-gray-700/50 rounded-lg">
              <h3 class="text-lg font-semibold mb-4">账户安全</h3>
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <div>
                    <div class="font-medium">两步验证</div>
                    <div class="text-sm text-gray-400">为您的账户添加额外的安全保护</div>
                  </div>
                  <button class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    启用
                  </button>
                </div>
                <div class="flex items-center justify-between">
                  <div>
                    <div class="font-medium">登录通知</div>
                    <div class="text-sm text-gray-400">当有新设备登录时发送通知</div>
                  </div>
                  <button class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                    已启用
                  </button>
                </div>
              </div>
            </div>
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
  Camera, 
  Video, 
  Clock, 
  TrendingUp 
} from 'lucide-vue-next'
import { useAuthStore } from '../store/auth'

const router = useRouter()
const authStore = useAuthStore()

const activeTab = ref('basic')

const tabs = [
  { id: 'basic', name: '基本信息' },
  { id: 'stats', name: '使用统计' },
  { id: 'account', name: '账户设置' }
]

// 用户统计数据
const userStats = reactive({
  projects: 12,
  videos: 48,
  usage: 156,
  videosThisMonth: 8,
  totalTime: '24.5h',
  timeThisMonth: '6.2h',
  efficiency: 85
})

// 个人资料表单
const profileForm = reactive({
  name: authStore.user?.name || '',
  phone: authStore.user?.phone || '',
  email: '',
  company: '',
  bio: ''
})

// 密码修改表单
const passwordForm = reactive({
  current: '',
  new: '',
  confirm: ''
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
