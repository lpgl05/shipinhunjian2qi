<template>
  <div class="chat-canvas h-full flex flex-col bg-gray-950">
    <!-- 消息列表区域 -->
    <div ref="messagesContainer" class="flex-1 overflow-y-auto scrollbar-thin p-6">
      <div class="max-w-4xl mx-auto">
        <!-- 欢迎消息 (仅在无消息时显示) -->
        <div v-if="chatStore.messages.length === 0" class="text-center py-20">
          <div class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r rounded-3xl mb-6 animate-pulse-slow" :class="getAgentIconClass()">
            <component :is="getAgentIcon()" :size="40" class="text-white" />
          </div>
          <h2 class="text-3xl font-bold text-gray-50 mb-3">
            {{ getAgentTitle() }}
          </h2>
          <p class="text-lg text-gray-400 mb-8">
            {{ getAgentDescription() }}
          </p>

          <!-- 快捷提示词 -->
          <div class="flex flex-wrap items-center justify-center gap-3 max-w-2xl mx-auto">
            <button
              v-for="prompt in quickPrompts"
              :key="prompt"
              class="px-5 py-2.5 bg-gray-800 text-gray-300 text-sm rounded-xl border border-gray-700 hover:border-blue-500 hover:text-blue-400 hover:bg-gray-700 transition-all duration-200"
              @click="handleQuickPrompt(prompt)"
            >
              {{ prompt }}
            </button>
          </div>
          
          <!-- 智能体选项 - 只在非特定路由下显示 -->
          <div v-if="!isSpecialAgentRoute" class="mt-12">
            <h3 class="text-xl font-semibold text-gray-300 mb-6 text-center">选择智能体开始创作</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
              <button
                v-for="agent in agentOptions"
                :key="agent.id"
                @click="handleAgentSelect(agent.id)"
                class="group p-6 bg-gray-800/50 rounded-2xl border border-gray-700 hover:border-gray-600 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/10"
              >
                <div class="flex items-start gap-4">
                  <div class="flex-shrink-0">
                    <div class="w-12 h-12 bg-gradient-to-r rounded-xl flex items-center justify-center" :class="agent.color">
                      <component :is="agent.icon" :size="24" class="text-white" />
                    </div>
                  </div>
                  <div class="flex-1 text-left">
                    <h4 class="text-lg font-semibold text-gray-50 mb-2 group-hover:text-blue-400 transition-colors">
                      {{ agent.name }}
                    </h4>
                    <p class="text-sm text-gray-400 leading-relaxed">
                      {{ agent.description }}
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>

            <!-- 消息列表 -->
            <div v-else class="space-y-6">
              <ChatMessage
                v-for="message in chatStore.messages"
                :key="message.id"
                :message="message"
                @ugi-event="handleUgiEvent"
              />

          <!-- AI思考中 -->
          <div v-if="chatStore.isAiTyping" class="flex gap-3 justify-start animate-fade-in">
            <div class="flex-shrink-0">
              <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-violet-500 rounded-full flex items-center justify-center">
                <Bot :size="20" class="text-white" />
              </div>
            </div>
            <div class="bg-gray-800 rounded-2xl rounded-tl-sm px-5 py-3">
              <div class="flex gap-1">
                <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0ms"></div>
                <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 150ms"></div>
                <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 300ms"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部输入区 -->
    <div class="border-t border-gray-800 bg-gray-900/80 backdrop-blur-xl">
      <div class="max-w-4xl mx-auto p-4">
        <div class="relative">
          <!-- 输入框容器 -->
          <div
            class="flex items-end gap-3 bg-gray-800/60 backdrop-blur-sm rounded-2xl border transition-all duration-200"
            :class="[
              isInputFocused
                ? 'border-blue-500 ring-2 ring-blue-500/50 shadow-lg shadow-blue-500/20'
                : 'border-gray-700'
            ]"
          >
            <!-- 左侧工具按钮 -->
            <div class="flex items-center gap-1 pl-3 pb-3">
              <button class="icon-btn" title="上传文件" @click="handleUpload">
                <Paperclip :size="20" />
              </button>
              <button class="icon-btn" title="插入图片" @click="handleInsertImage">
                <ImageIcon :size="20" />
              </button>
            </div>

            <!-- 文本输入区 -->
            <textarea
              ref="textareaRef"
              v-model="inputText"
              placeholder="描述你的需求... (Enter发送，Shift+Enter换行)"
              rows="1"
              class="flex-1 bg-transparent border-none outline-none resize-none text-gray-50 placeholder-gray-500 py-3 max-h-40 scrollbar-thin"
              @input="autoResize"
              @focus="isInputFocused = true"
              @blur="isInputFocused = false"
              @keydown.enter.exact.prevent="handleSend"
              @keydown.enter.shift.exact="handleNewLine"
            ></textarea>

            <!-- 发送按钮 -->
            <div class="pr-3 pb-3">
              <button
                class="flex-shrink-0 bg-gradient-to-r from-blue-500 to-violet-500 p-3 rounded-xl hover:brightness-110 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                :disabled="!inputText.trim() || chatStore.isAiTyping"
                @click="handleSend"
              >
                <Send :size="20" class="text-white" />
              </button>
            </div>
          </div>

          <!-- 提示文本 -->
          <div class="mt-2 flex items-center justify-between text-xs text-gray-500">
            <div class="flex items-center gap-4">
              <span>Enter 发送</span>
              <span class="text-gray-600">•</span>
              <span>Shift + Enter 换行</span>
            </div>
            <div v-if="inputText.length > 0">
              {{ inputText.length }} / 2000
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, watch, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { 
  Sparkles, 
  Paperclip, 
  Send, 
  Bot, 
  Image as ImageIcon,
  Scissors,
  Type,
  Share2,
  Wand2,
  BarChart3,
  Target
} from 'lucide-vue-next'
import ChatMessage from './components/ChatMessage.vue'
import { useChatStore } from '../../store/chat'
import { useWorkspaceStore } from '../../store/workspace'

const route = useRoute()
const router = useRouter()
const chatStore = useChatStore()
const workspaceStore = useWorkspaceStore()

const inputText = ref('')
const isInputFocused = ref(false)
const textareaRef = ref<HTMLTextAreaElement>()
const messagesContainer = ref<HTMLElement>()

// 判断是否在特殊智能体路由下（需要隐藏智能体卡片）
const isSpecialAgentRoute = computed(() => {
  return route.path === '/knowledge-agent' || 
         (route.path === '/workspace' && route.query.agent === 'video-mixer')
})

// 获取智能体标题
const getAgentTitle = () => {
  if (route.path === '/knowledge-agent') {
    return '风格模仿写作大师'
  } else if (route.path === '/workspace' && route.query.agent === 'video-mixer') {
    return '视频混剪智能体'
  }
  return workspaceStore.isCreationMode ? '开始创作' : '开始对话'
}

// 获取智能体描述
const getAgentDescription = () => {
  if (route.path === '/knowledge-agent') {
    return '基于知识库智能仿写营销文案，告诉我您想要创作的内容，我将为您推荐最适合的写作风格'
  } else if (route.path === '/workspace' && route.query.agent === 'video-mixer') {
    return '批量素材生成批量视频，智能剪辑生成专业视频内容'
  }
  return workspaceStore.isCreationMode 
    ? '在右侧画布中配置你的创作参数' 
    : '描述你的需求，AI将为你智能生成'
}

// 获取智能体图标
const getAgentIcon = () => {
  if (route.path === '/knowledge-agent') {
    return Type
  } else if (route.path === '/workspace' && route.query.agent === 'video-mixer') {
    return Scissors
  }
  return Sparkles
}

// 获取智能体图标样式
const getAgentIconClass = () => {
  if (route.path === '/knowledge-agent') {
    return 'from-purple-500 to-pink-500'
  } else if (route.path === '/workspace' && route.query.agent === 'video-mixer') {
    return 'from-blue-500 to-cyan-500'
  }
  return 'from-blue-500 to-violet-500'
}

// 快捷提示词
const quickPrompts = computed(() => {
  if (route.path === '/knowledge-agent') {
    return [
      '写一篇产品介绍文章',
      '创建营销推广文案',
      '撰写技术博客文章',
      '制作社交媒体内容'
    ]
  } else if (route.path === '/workspace' && route.query.agent === 'video-mixer') {
    return [
      '制作产品宣传视频',
      '创建抖音短视频',
      '生成B站横版视频',
      '批量制作营销视频'
    ]
  }
  return [
    '批量生成产品展示视频',
    '创建社媒营销内容',
    '设计品牌视觉素材',
    '分析营销数据报告'
  ]
})

// 智能体选项
const agentOptions = [
  {
    id: 'video-mixer',
    name: '视频混剪智能体',
    description: '批量素材生成批量视频',
    icon: Scissors,
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'content-rewrite',
    name: '风格模仿写作大师',
    description: '基于知识库智能仿写营销文案',
    icon: Type,
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'social-media',
    name: '社媒运营智能体',
    description: '全平台内容分发，智能配图配乐',
    icon: Share2,
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 'brand-design',
    name: '品牌设计智能体',
    description: '一键生成品牌视觉素材',
    icon: Wand2,
    color: 'from-orange-500 to-red-500'
  },
  {
    id: 'data-analysis',
    name: '数据分析智能体',
    description: '营销数据深度分析，用户画像洞察',
    icon: BarChart3,
    color: 'from-indigo-500 to-blue-500'
  },
  {
    id: 'campaign-manager',
    name: '营销策划智能体',
    description: '全链路营销策划，从策略制定到执行',
    icon: Target,
    color: 'from-violet-500 to-purple-500'
  }
]

// 自动调整textarea高度
const autoResize = () => {
  if (textareaRef.value) {
    textareaRef.value.style.height = 'auto'
    textareaRef.value.style.height = textareaRef.value.scrollHeight + 'px'
  }
}

// 滚动到底部
const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

// 处理发送
const handleSend = () => {
  if (!inputText.value.trim() || chatStore.isAiTyping) return

  chatStore.sendMessage(inputText.value.trim())
  inputText.value = ''

  // 重置textarea高度
  if (textareaRef.value) {
    textareaRef.value.style.height = 'auto'
  }

  scrollToBottom()
}

// 处理换行
const handleNewLine = (event: KeyboardEvent) => {
  const textarea = event.target as HTMLTextAreaElement
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  inputText.value = inputText.value.substring(0, start) + '\n' + inputText.value.substring(end)

  nextTick(() => {
    if (textarea) {
      textarea.selectionStart = textarea.selectionEnd = start + 1
      autoResize()
    }
  })
}

// 处理快捷提示词
const handleQuickPrompt = (prompt: string) => {
  // 根据提示词类型自动激活对应的智能体
  if (prompt.includes('视频') || prompt.includes('混剪')) {
    // 发送消息并激活视频混剪智能体
    chatStore.sendMessage(prompt)
    setTimeout(() => {
      workspaceStore.enterCreationMode('video-mixer')
    }, 500) // 延迟500ms让消息先发送
  } else {
    // 普通提示词，只填入输入框
    inputText.value = prompt
    nextTick(() => {
      textareaRef.value?.focus()
    })
  }
}

// 处理智能体选择
const handleAgentSelect = (agentId: string) => {
  console.log('智能体被点击:', agentId)
  const agent = agentOptions.find(a => a.id === agentId)
  if (agent) {
    // 知识库仿写智能体直接跳转到专属工作区
    if (agentId === 'content-rewrite') {
      console.log('跳转到知识库智能体工作区')
      router.push('/knowledge-agent')
      return
    }
    
    // 其他智能体的处理逻辑
    console.log('选择了智能体:', agent.name)
    // TODO: 实现其他智能体的逻辑
  }
}

// 处理上传
const handleUpload = () => {
  workspaceStore.openAssetModal()
}

// 处理插入图片
const handleInsertImage = () => {
  console.log('插入图片')
}

// 处理UGI组件事件
const handleUgiEvent = (type: string, data: any) => {
  console.log('UGI事件:', type, data)
  
  // 根据事件类型处理不同的逻辑
  switch (type) {
    case 'select':
      // 选择智能体，进入创作模式
      if (data.agentId) {
        workspaceStore.enterCreationMode(data.agentId)
      }
      break
    case 'reorder':
      // 重新排序
      console.log('重新排序:', data)
      break
    case 'replace':
      // 替换内容
      console.log('替换内容:', data)
      break
    case 'delete':
      // 删除内容
      console.log('删除内容:', data)
      break
    default:
      console.log('未知UGI事件:', type, data)
  }
}

// 监听消息变化
watch(() => chatStore.messages.length, () => {
  scrollToBottom()
})

// 意图识别函数
const detectIntent = (text: string): string => {
  const videoKeywords = ['视频', '混剪', '剪辑', '制作视频', '生成视频', '短视频', 'vlog', '宣传片']
  const contentKeywords = ['文案', '内容', '文章', '写作', '文案改写', '内容创作']
  const socialKeywords = ['社媒', '社交媒体', '微博', '抖音', '小红书', '营销']
  const designKeywords = ['设计', '海报', 'logo', '品牌', '视觉', '图片']
  const dataKeywords = ['数据', '分析', '报告', '统计', 'roi', '转化']
  const campaignKeywords = ['策划', '营销', '活动', '推广', 'campaign']
  
  const lowerText = text.toLowerCase()
  
  if (videoKeywords.some(keyword => lowerText.includes(keyword))) {
    return 'video-mixer'
  } else if (contentKeywords.some(keyword => lowerText.includes(keyword))) {
    return 'content-rewrite'
  } else if (socialKeywords.some(keyword => lowerText.includes(keyword))) {
    return 'social-media'
  } else if (designKeywords.some(keyword => lowerText.includes(keyword))) {
    return 'brand-design'
  } else if (dataKeywords.some(keyword => lowerText.includes(keyword))) {
    return 'data-analysis'
  } else if (campaignKeywords.some(keyword => lowerText.includes(keyword))) {
    return 'campaign-manager'
  }
  
  // 默认返回视频混剪智能体
  return 'video-mixer'
}

// 自动开始对话流程
const startAutoConversation = async (prompt: string) => {
  // 1. 自动发送用户消息
  chatStore.sendMessage(prompt)
  
  // 2. 识别意图并激活对应智能体
  const detectedAgent = detectIntent(prompt)
  
  // 3. 延迟激活智能体，让AI回复先完成
  setTimeout(() => {
    workspaceStore.enterCreationMode(detectedAgent)
  }, 3000) // 3秒后激活智能体
}

// 页面加载时处理URL参数
onMounted(() => {
  const prompt = route.query.prompt as string
  const agent = route.query.agent as string
  
  console.log('ChatCanvas onMounted - 路由参数:', { prompt, agent })
  console.log('当前 workspace store 状态:', {
    layoutMode: workspaceStore.layoutMode,
    activeAgent: workspaceStore.activeAgent,
    isCreationMode: workspaceStore.isCreationMode
  })
  
  if (prompt) {
    inputText.value = prompt
    
    // 自动开始对话流程
    nextTick(() => {
      autoResize()
      // 延迟启动自动对话，确保页面完全加载
      setTimeout(() => {
        startAutoConversation(prompt)
      }, 500)
    })
  }
  
  if (agent) {
    console.log('激活智能体:', agent)
    // 直接激活智能体，进入创作模式
    workspaceStore.enterCreationMode(agent)
    console.log('激活后 workspace store 状态:', {
      layoutMode: workspaceStore.layoutMode,
      activeAgent: workspaceStore.activeAgent,
      isCreationMode: workspaceStore.isCreationMode
    })
  }
})
</script>

<style scoped>
@keyframes pulse-slow {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.05);
  }
}

.animate-pulse-slow {
  animation: pulse-slow 3s ease-in-out infinite;
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}

.animate-bounce {
  animation: bounce 0.6s ease-in-out infinite;
}

/* 自定义滚动条 */
.scrollbar-thin::-webkit-scrollbar {
  width: 6px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background: #4B5563;
  border-radius: 3px;
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: #6B7280;
}

.icon-btn {
  @apply p-2 text-gray-400 hover:text-gray-50 hover:bg-gray-700 rounded-lg transition-all;
}
</style>

