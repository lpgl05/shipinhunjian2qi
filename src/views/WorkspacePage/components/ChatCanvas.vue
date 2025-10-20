<template>
  <div class="chat-canvas h-full flex flex-col bg-gray-950">
    <!-- 消息列表区域 -->
    <div ref="messagesContainer" class="flex-1 overflow-y-auto scrollbar-thin p-6">
      <div class="max-w-5xl mx-auto">
        <!-- 欢迎消息 -->
        <div v-if="chatStore.messages.length === 0" class="text-center py-20">
          <div class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-violet-500 rounded-3xl mb-6 animate-pulse-slow">
            <Sparkles :size="40" class="text-white" />
          </div>
          <h2 class="text-3xl font-bold text-gray-50 mb-3">开始你的营销创作</h2>
          <p class="text-lg text-gray-400 mb-8">选择智能体，让AI为你的营销策略提供专业支持</p>
          
          <!-- 快捷提示词 -->
          <div class="flex flex-wrap items-center justify-center gap-3 max-w-2xl mx-auto">
            <button
              v-for="prompt in quickPrompts"
              :key="prompt"
              class="px-5 py-2.5 bg-gray-800 text-gray-300 text-sm rounded-xl border border-gray-700 hover:border-blue-500 hover:text-blue-400 hover:bg-gray-750 transition-all duration-200"
              @click="handleQuickPrompt(prompt)"
            >
              {{ prompt }}
            </button>
          </div>
          
          <!-- 智能体选项 -->
          <div class="mt-12">
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

    <!-- 底部输入区 - Tunee风格 -->
    <div class="border-t border-gray-800 bg-gray-900/80 backdrop-blur-xl">
      <div class="max-w-5xl mx-auto p-6">
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
              <button 
                class="icon-btn" 
                title="上传文件"
                @click="handleUpload"
              >
                <Paperclip :size="20" />
              </button>
              <button 
                class="icon-btn" 
                title="插入图片"
                @click="handleInsertImage"
              >
                <ImageIcon :size="20" />
              </button>
            </div>

            <!-- 文本输入区 -->
            <textarea
              ref="textareaRef"
              v-model="inputText"
              placeholder="描述你想要的营销效果...  (按 Enter 发送，Shift + Enter 换行)"
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
          <div class="mt-3 flex items-center justify-between text-xs text-gray-500">
            <div class="flex items-center gap-4">
              <span>按 Enter 发送</span>
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
import { ref, nextTick, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Sparkles, Paperclip, Send, Bot, Image as ImageIcon, Scissors, Type, Share2, Wand2, BarChart3, Target } from 'lucide-vue-next'
import ChatMessage from './ChatMessage.vue'
import { useChatStore } from '../../../store/chat'

const route = useRoute()
const chatStore = useChatStore()

const inputText = ref('')
const isInputFocused = ref(false)
const textareaRef = ref<HTMLTextAreaElement>()
const messagesContainer = ref<HTMLElement>()

// 快捷提示词
const quickPrompts = [
  '批量生成产品展示视频',
  '创建社媒营销内容',
  '设计品牌视觉素材',
  '分析营销数据报告'
]

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
    name: '知识库仿写智能体',
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
  inputText.value = prompt
  nextTick(() => {
    textareaRef.value?.focus()
  })
}

// 处理UGI组件事件
const handleUgiEvent = (type: string, data: any) => {
  console.log('UGI事件:', type, data)
  // TODO: 处理各种UGI事件
}

// 处理上传
const handleUpload = () => {
  console.log('打开文件选择器')
  // TODO: 实现文件上传
}

// 处理插入图片
const handleInsertImage = () => {
  console.log('打开图片选择器')
  // TODO: 实现图片插入
}

// 处理智能体选择
const handleAgentSelect = (agentId: string) => {
  const agent = agentOptions.find(a => a.id === agentId)
  if (agent) {
    // 根据选择的智能体设置不同的默认提示
    let defaultPrompt = ''
    switch (agentId) {
      case 'video-mixer':
        defaultPrompt = '请帮我批量处理这些视频素材，生成多个不同风格的营销视频'
        break
      case 'content-rewrite':
        defaultPrompt = '基于我的品牌知识库，帮我仿写一篇营销文案'
        break
      case 'social-media':
        defaultPrompt = '为我的产品创建一套社媒营销内容，包括文案和配图建议'
        break
      case 'brand-design':
        defaultPrompt = '根据我的品牌调性，帮我设计一套视觉素材'
        break
      case 'data-analysis':
        defaultPrompt = '分析我的营销数据，提供优化建议和用户画像洞察'
        break
      case 'campaign-manager':
        defaultPrompt = '帮我制定一个完整的营销策划方案'
        break
      default:
        defaultPrompt = '请帮我完成营销任务'
    }
    
    inputText.value = defaultPrompt
    nextTick(() => {
      textareaRef.value?.focus()
      autoResize()
    })
  }
}

// 监听消息变化，自动滚动
watch(() => chatStore.messages.length, () => {
  scrollToBottom()
})

// 页面加载时处理URL参数
onMounted(() => {
  const prompt = route.query.prompt as string
  if (prompt) {
    inputText.value = prompt
    nextTick(() => {
      autoResize()
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
</style>