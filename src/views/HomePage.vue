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
          <span class="text-xl font-bold">智策营销</span>
        </div>

        <!-- Navigation -->
        <nav class="hidden md:flex items-center gap-8">
          <a href="#product" class="text-gray-400 hover:text-gray-50 transition-colors">产品</a>
          <a href="#pricing" class="text-gray-400 hover:text-gray-50 transition-colors">定价</a>
          <a href="#blog" class="text-gray-400 hover:text-gray-50 transition-colors">博客</a>
        </nav>

        <!-- Auth Buttons -->
        <div class="flex items-center gap-3">
          <button 
            class="px-4 py-2 text-gray-300 hover:text-gray-50 transition-colors"
            @click="handleLogin"
          >
            登录
          </button>
          <button 
            class="px-6 py-2 bg-gradient-to-r from-blue-500 to-violet-500 text-white rounded-lg hover:brightness-110 transform hover:scale-105 active:scale-95 transition-all duration-200"
            @click="handleLogin"
          >
            免费注册
          </button>
        </div>
      </div>
    </header>

    <!-- Hero Section -->
    <section class="relative py-20 px-6">
      <div class="max-w-5xl mx-auto">
        <!-- Main Title -->
        <h1 class="text-6xl md:text-7xl font-extrabold text-center mb-6 bg-gradient-to-r from-blue-400 via-violet-400 to-purple-400 text-transparent bg-clip-text">
          全球首个视频创作智能体
        </h1>
        
        <p class="text-xl text-gray-400 text-center mb-12 max-w-2xl mx-auto">
          一句话，帮你完成视频混剪。AI驱动的全链路创作平台，让灵感即刻成真
        </p>

        <!-- Large Input Area -->
        <div class="relative max-w-4xl mx-auto">
          <div 
            class="relative bg-gray-800/60 backdrop-blur-xl rounded-3xl border-2 transition-all duration-300"
            :class="[
              isInputFocused 
                ? 'border-blue-500 ring-4 ring-blue-500/20 shadow-2xl shadow-blue-500/20' 
                : 'border-gray-700 hover:border-gray-600'
            ]"
          >
            <!-- Gradient Border Effect -->
            <div class="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-violet-500 to-purple-500 rounded-3xl opacity-0 group-hover:opacity-20 blur transition duration-300"></div>
            
            <div class="relative p-8">
              <textarea
                v-model="inputText"
                placeholder="一句话，帮你完成视频混剪..."
                rows="4"
                class="w-full bg-transparent border-none outline-none text-xl text-gray-50 placeholder-gray-500 resize-none"
                @focus="isInputFocused = true"
                @blur="isInputFocused = false"
                @keydown.meta.enter="handleSubmit"
              ></textarea>

              <!-- Action Bar -->
              <div class="flex items-center justify-between mt-6 pt-6 border-t border-gray-700/50">
                <!-- Quick Actions -->
                <div class="flex items-center gap-2">
                  <button 
                    class="p-2 text-gray-400 hover:text-gray-50 hover:bg-gray-700 rounded-lg transition-all"
                    title="上传素材"
                  >
                    <Upload :size="20" />
                  </button>
                  <button 
                    class="p-2 text-gray-400 hover:text-gray-50 hover:bg-gray-700 rounded-lg transition-all"
                    title="添加图片"
                  >
                    <ImageIcon :size="20" />
                  </button>
                  <button 
                    class="p-2 text-gray-400 hover:text-gray-50 hover:bg-gray-700 rounded-lg transition-all"
                    title="添加音频"
                  >
                    <Music :size="20" />
                  </button>
                </div>

                <!-- Submit Button -->
                <button 
                  class="px-8 py-3 bg-gradient-to-r from-blue-500 to-violet-500 text-white rounded-xl font-semibold hover:brightness-110 transform hover:scale-105 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
                  :disabled="!inputText.trim()"
                  @click="handleGenerate"
                >
                  <Sparkles :size="20" />
                  <span>开始创作</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Agent Showcase -->
    <section class="py-16 px-6 bg-gray-950">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-12">
          <h2 class="text-4xl font-bold mb-4">探索AI智能体</h2>
          <p class="text-xl text-gray-400">选择专业的AI助手，快速开始你的创作之旅</p>
        </div>

        <!-- Agent Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AgentCard
            v-for="agent in agents"
            :key="agent.id"
            :icon="agent.icon"
            :title="agent.title"
            :description="agent.description"
            :badge="agent.badge"
            :gradient="agent.gradient"
            @click="handleAgentClick(agent)"
          />
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-20 px-6">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold mb-4">为什么选择我们</h2>
          <p class="text-xl text-gray-400">专业的AI技术，简单的操作体验</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Feature 1 -->
          <div class="p-8 bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 hover:border-gray-600 transition-all">
            <div class="w-14 h-14 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-6">
              <Zap :size="28" class="text-white" />
            </div>
            <h3 class="text-xl font-bold mb-3">极速生成</h3>
            <p class="text-gray-400">AI驱动的智能剪辑，3分钟完成一部作品</p>
          </div>

          <!-- Feature 2 -->
          <div class="p-8 bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 hover:border-gray-600 transition-all">
            <div class="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-6">
              <Brain :size="28" class="text-white" />
            </div>
            <h3 class="text-xl font-bold mb-3">智能理解</h3>
            <p class="text-gray-400">理解你的意图，自动匹配最佳创作方案</p>
          </div>

          <!-- Feature 3 -->
          <div class="p-8 bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 hover:border-gray-600 transition-all">
            <div class="w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-6">
              <Workflow :size="28" class="text-white" />
            </div>
            <h3 class="text-xl font-bold mb-3">全链路支持</h3>
            <p class="text-gray-400">从脚本到成片，一站式解决所有创作需求</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="border-t border-gray-800 py-8 px-6 text-center text-gray-500 text-sm">
      <p>© 2024 智策营销. All rights reserved.</p>
    </footer>

    <!-- Auth Modal -->
    <AuthModal />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { 
  Sparkles, 
  Upload, 
  Image as ImageIcon, 
  Music,
  Zap,
  Brain,
  Workflow
} from 'lucide-vue-next'
import AgentCard from '../components/AgentCard.vue'
import AuthModal from '../components/AuthModal.vue'
import { useAuthStore } from '../store/auth'

const router = useRouter()
const authStore = useAuthStore()

const inputText = ref('')
const isInputFocused = ref(false)

// 智能体列表
const agents = [
  {
    id: 'video-mixer',
    icon: 'Scissors',
    title: '视频混剪智能体',
    description: '批量素材生成批量视频，智能识别亮点，自动剪辑成片',
    badge: '热门',
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'content-rewrite',
    icon: 'Type',
    title: '知识库仿写智能体',
    description: '基于知识库智能仿写营销文案，保持品牌调性统一',
    gradient: 'from-purple-500 to-pink-500'
  },
  {
    id: 'social-media',
    icon: 'Share2',
    title: '社媒运营智能体',
    description: '全平台内容分发，智能配图配乐，提升社媒传播效果',
    badge: '新功能',
    gradient: 'from-green-500 to-emerald-500'
  },
  {
    id: 'brand-design',
    icon: 'Wand2',
    title: '品牌设计智能体',
    description: '一键生成品牌视觉素材，LOGO、海报、包装设计全覆盖',
    gradient: 'from-orange-500 to-red-500'
  },
  {
    id: 'data-analysis',
    icon: 'BarChart3',
    title: '数据分析智能体',
    description: '营销数据深度分析，用户画像洞察，ROI优化建议',
    gradient: 'from-indigo-500 to-blue-500'
  },
  {
    id: 'campaign-manager',
    icon: 'Target',
    title: '营销策划智能体',
    description: '全链路营销策划，从策略制定到执行落地一站式服务',
    gradient: 'from-violet-500 to-purple-500'
  }
]

// 处理提交
const handleSubmit = () => {
  if (!inputText.value.trim()) return
  
  // 直接跳转到工作台，带上输入内容
  router.push({
    path: '/workspace',
    query: { prompt: inputText.value }
  })
}

// 处理生成按钮
const handleGenerate = () => {
  if (inputText.value.trim()) {
    // 跳转到工作台并带上提示词
    router.push({
      path: '/workspace',
      query: { prompt: inputText.value }
    })
  } else {
    // 没有输入内容时直接跳转到工作台
    router.push('/workspace')
  }
}

// 处理智能体点击
const handleAgentClick = (agent: any) => {
  // 直接跳转到工作台，激活对应智能体
  router.push({
    path: '/workspace',
    query: { agent: agent.id }
  })
}

// 处理登录
const handleLogin = () => {
  authStore.toggleAuthModal()
}
</script>

<style scoped>
/* Smooth animations */
@keyframes gradient-shift {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

h1 {
  background-size: 200% 200%;
  animation: gradient-shift 5s ease infinite;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #1F2937;
}

::-webkit-scrollbar-thumb {
  background: #4B5563;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #6B7280;
}
</style>
