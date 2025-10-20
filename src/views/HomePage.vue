<template>
  <div class="home-page min-h-screen bg-gray-900">
    <!-- 顶部导航栏 -->
    <header class="sticky top-0 z-50 backdrop-blur-lg bg-gray-900/80 border-b border-gray-800">
      <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-violet-500 rounded-lg flex items-center justify-center">
            <Video :size="24" class="text-white" />
          </div>
          <span class="text-xl font-bold text-gray-50">智策营销</span>
        </div>
        <button class="btn-secondary" @click="handleLogin">
          登录 / 注册
        </button>
      </div>
    </header>

    <!-- 主要内容区 -->
    <main class="max-w-7xl mx-auto px-6">
      <!-- Hero区域 -->
      <section class="py-20 text-center">
        <!-- 标题动画 -->
        <div class="mb-8">
          <h1 class="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-violet-400 to-purple-400 mb-4 animate-pulse">
            智策营销 - 社会化营销智能体平台
          </h1>
          <p class="text-xl text-gray-400">
            AI智能体驱动的全链路营销解决方案，让创意与策略完美结合
          </p>
        </div>

        <!-- 中心输入区 - Genspark风格 -->
        <div class="max-w-4xl mx-auto mb-8">
          <div 
            class="relative bg-gray-800/50 backdrop-blur-xl rounded-3xl border border-gray-700 p-8 shadow-2xl hover:shadow-blue-500/20 transition-all duration-300"
            @click="handleInputClick"
          >
            <!-- 渐变边框效果 -->
            <div class="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-violet-500/20 to-purple-500/20 rounded-3xl opacity-0 hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl"></div>
            
            <div class="relative">
              <textarea
                v-model="promptText"
                placeholder="描述你想要的视频，例如：制作一个3分钟的旅行vlog，包含山川和日落场景，配上轻快的背景音乐..."
                class="w-full bg-transparent border-none outline-none text-gray-50 placeholder-gray-500 resize-none text-lg"
                rows="4"
                @focus="isInputFocused = true"
                @blur="isInputFocused = false"
              ></textarea>

              <!-- 底部工具栏 -->
              <div class="flex items-center justify-between mt-6 pt-6 border-t border-gray-700/50">
                <!-- 快捷操作 -->
                <div class="flex items-center gap-2">
                  <button class="icon-btn" title="上传参考视频">
                    <Upload :size="20" />
                  </button>
                  <button class="icon-btn" title="上传图片">
                    <ImageIcon :size="20" />
                  </button>
                  <button class="icon-btn" title="添加音频">
                    <Music :size="20" />
                  </button>
                </div>

                <!-- 生成按钮 -->
                <button 
                  class="btn-primary flex items-center gap-2 px-8 py-3"
                  :disabled="!promptText.trim()"
                  @click="handleGenerate"
                >
                  <Sparkles :size="20" />
                  <span class="font-semibold">开始生成</span>
                </button>
              </div>
            </div>
          </div>

          <!-- 示例提示词 -->
          <div class="mt-6 flex flex-wrap items-center justify-center gap-3">
            <span class="text-sm text-gray-500">试试这些：</span>
            <button
              v-for="example in examplePrompts"
              :key="example"
              class="px-4 py-2 bg-gray-800 text-gray-300 text-sm rounded-full border border-gray-700 hover:border-blue-500 hover:text-blue-400 transition-all duration-200"
              @click="promptText = example"
            >
              {{ example }}
            </button>
          </div>
        </div>
      </section>

      <!-- 智能体卡片网格 - Genspark风格 -->
      <section class="py-16">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-50 mb-3">
            探索AI智能体
          </h2>
          <p class="text-gray-400">
            选择专业的AI助手，快速开始你的创作之旅
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
          <AgentCard
            v-for="agent in agents"
            :key="agent.id"
            :icon="agent.icon"
            :title="agent.title"
            :description="agent.description"
            :badge="agent.badge"
            @click="handleAgentClick(agent)"
          />
        </div>
      </section>

      <!-- 特性展示 -->
      <section class="py-16 border-t border-gray-800">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-50 mb-3">
            为什么选择我们
          </h2>
          <p class="text-gray-400">
            专业的AI技术，简单的操作体验
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 pb-20">
          <div class="text-center">
            <div class="inline-flex items-center justify-center w-16 h-16 bg-blue-500/10 rounded-2xl mb-4">
              <Zap :size="32" class="text-blue-400" />
            </div>
            <h3 class="text-xl font-semibold text-gray-50 mb-2">极速生成</h3>
            <p class="text-gray-400">AI驱动，秒级响应，快速生成高质量视频</p>
          </div>

          <div class="text-center">
            <div class="inline-flex items-center justify-center w-16 h-16 bg-violet-500/10 rounded-2xl mb-4">
              <Brain :size="32" class="text-violet-400" />
            </div>
            <h3 class="text-xl font-semibold text-gray-50 mb-2">智能理解</h3>
            <p class="text-gray-400">深度学习模型，精准理解创作意图</p>
          </div>

          <div class="text-center">
            <div class="inline-flex items-center justify-center w-16 h-16 bg-purple-500/10 rounded-2xl mb-4">
              <Workflow :size="32" class="text-purple-400" />
            </div>
            <h3 class="text-xl font-semibold text-gray-50 mb-2">一站式服务</h3>
            <p class="text-gray-400">从创意到成品，全流程AI辅助</p>
          </div>
        </div>
      </section>
    </main>

    <!-- 页脚 -->
    <footer class="border-t border-gray-800 py-8">
      <div class="max-w-7xl mx-auto px-6 text-center text-gray-500 text-sm">
        <p>&copy; 2025 AI视频混剪. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { 
  Video, 
  Sparkles, 
  Upload, 
  Image as ImageIcon, 
  Music,
  Zap,
  Brain,
  Workflow
} from 'lucide-vue-next'
import AgentCard from '../components/AgentCard.vue'
import { useAuthStore } from '../store/auth'

const router = useRouter()
const authStore = useAuthStore()

const promptText = ref('')
const isInputFocused = ref(false)

// 示例提示词
const examplePrompts = [
  '制作一个美食vlog混剪',
  '生成旅行回忆视频',
  '创建产品展示短视频',
  '制作节日祝福视频'
]

// 智能体列表
const agents = [
  {
    id: 'video-mixer',
    icon: 'Scissors',
    title: '视频混剪智能体',
    description: '批量素材生成批量视频，智能识别亮点，自动剪辑成片',
    badge: '热门'
  },
  {
    id: 'content-rewrite',
    icon: 'Type',
    title: '知识库仿写智能体',
    description: '基于知识库智能仿写营销文案，保持品牌调性统一',
  },
  {
    id: 'social-media',
    icon: 'Share2',
    title: '社媒运营智能体',
    description: '全平台内容分发，智能配图配乐，提升社媒传播效果',
    badge: '新功能'
  },
  {
    id: 'brand-design',
    icon: 'Wand2',
    title: '品牌设计智能体',
    description: '一键生成品牌视觉素材，LOGO、海报、包装设计全覆盖',
  },
  {
    id: 'data-analysis',
    icon: 'BarChart3',
    title: '数据分析智能体',
    description: '营销数据深度分析，用户画像洞察，ROI优化建议',
  },
  {
    id: 'campaign-manager',
    icon: 'Target',
    title: '营销策划智能体',
    description: '全链路营销策划，从策略制定到执行落地一站式服务',
  }
]

// 处理输入框点击
const handleInputClick = () => {
  if (!authStore.isAuthenticated) {
    authStore.openAuthModal()
  }
}

// 处理生成按钮点击
const handleGenerate = () => {
  if (!authStore.isAuthenticated) {
    authStore.openAuthModal()
    return
  }

  if (promptText.value.trim()) {
    // 跳转到工作台并带上提示词
    router.push({
      name: 'workspace',
      query: { prompt: promptText.value }
    })
  }
}

// 处理智能体卡片点击
const handleAgentClick = (agent: any) => {
  if (!authStore.isAuthenticated) {
    authStore.openAuthModal()
    return
  }

  // 跳转到工作台并激活对应功能
  router.push({
    name: 'workspace',
    query: { agent: agent.id }
  })
}

// 处理登录按钮点击
const handleLogin = () => {
  authStore.openAuthModal()
}
</script>

<style scoped>
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

.animate-pulse {
  animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
