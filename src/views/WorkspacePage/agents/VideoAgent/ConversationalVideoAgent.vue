<template>
  <div class="conversational-video-agent h-full flex flex-col bg-gray-900">
    <!-- 头部标题栏 -->
    <div class="flex items-center justify-between p-4 border-b border-gray-700">
      <div class="flex items-center space-x-3">
        <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-violet-500 rounded-lg flex items-center justify-center">
          <MessageSquare class="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 class="text-lg font-semibold text-gray-50">对话式视频混剪</h1>
          <p class="text-sm text-gray-400">通过自然语言描述，智能生成视频配置</p>
        </div>
      </div>
      
      <div class="flex items-center space-x-2">
        <button
          v-if="hasActiveConversation"
          @click="handleNewConversation"
          class="px-3 py-1.5 text-sm bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors"
        >
          <Plus class="w-4 h-4 mr-1 inline" />
          新对话
        </button>
        
        <button
          v-if="hasActiveConversation"
          @click="handleClearConversation"
          class="px-3 py-1.5 text-sm bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors"
        >
          <Trash2 class="w-4 h-4 mr-1 inline" />
          清除
        </button>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="flex-1 flex overflow-hidden">
      <!-- 对话区域 -->
      <div class="flex-1 flex flex-col">
        <!-- 消息列表 -->
        <div 
          ref="messagesContainer"
          class="flex-1 overflow-y-auto p-4 space-y-4"
        >
          <!-- 欢迎界面 -->
          <div v-if="!hasActiveConversation" class="flex flex-col items-center justify-center h-full text-center">
            <div class="w-16 h-16 bg-gradient-to-r from-blue-500 to-violet-500 rounded-2xl flex items-center justify-center mb-4">
              <Sparkles class="w-8 h-8 text-white" />
            </div>
            <h2 class="text-xl font-semibold text-gray-50 mb-2">开始您的视频创作之旅</h2>
            <p class="text-gray-400 mb-6 max-w-md">
              告诉我您想要制作什么样的视频，我会为您智能配置所有参数，让创作变得简单高效。
            </p>
            
            <!-- 快速开始示例 -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl">
              <button
                v-for="example in quickStartExamples"
                :key="example.id"
                @click="handleQuickStart(example.prompt)"
                class="p-4 bg-gray-800 hover:bg-gray-700 rounded-lg text-left transition-colors group"
              >
                <div class="flex items-start space-x-3">
                  <component :is="example.icon" class="w-5 h-5 text-blue-400 mt-0.5 group-hover:text-blue-300" />
                  <div>
                    <h3 class="text-sm font-medium text-gray-50 mb-1">{{ example.title }}</h3>
                    <p class="text-xs text-gray-400">{{ example.description }}</p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          <!-- 消息列表 -->
          <div v-else>
            <MessageBubble
              v-for="message in messages"
              :key="message.id"
              :message="message"
              @select-suggestion="handleSelectSuggestion"
            />
            
            <!-- 处理中指示器 -->
            <div v-if="isProcessing" class="flex items-center space-x-2 text-gray-400">
              <div class="flex space-x-1">
                <div class="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style="animation-delay: 0ms"></div>
                <div class="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style="animation-delay: 150ms"></div>
                <div class="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style="animation-delay: 300ms"></div>
              </div>
              <span class="text-sm">AI正在分析您的需求...</span>
            </div>
          </div>
        </div>

        <!-- 输入区域 -->
        <div class="border-t border-gray-700 p-4">
          <div class="flex items-end space-x-3">
            <!-- 文件上传按钮 -->
            <button
              @click="handleFileUpload"
              class="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              title="上传参考文件"
            >
              <Paperclip class="w-5 h-5 text-gray-300" />
            </button>
            
            <!-- 输入框 -->
            <div class="flex-1 relative">
              <textarea
                v-model="inputMessage"
                ref="messageInput"
                @keydown="handleKeyDown"
                @input="handleInputResize"
                placeholder="描述您想要制作的视频，例如：制作一个60秒的美食短视频，竖版格式，需要字幕..."
                class="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-gray-50 placeholder-gray-400 resize-none focus:outline-none focus:border-blue-500 transition-colors"
                rows="1"
                :disabled="isProcessing"
              ></textarea>
              
              <!-- 字符计数 -->
              <div class="absolute bottom-2 right-2 text-xs text-gray-500">
                {{ inputMessage.length }}/500
              </div>
            </div>
            
            <!-- 发送按钮 -->
            <button
              @click="handleSendMessage"
              :disabled="!canSendMessage"
              class="p-2 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors"
            >
              <Send class="w-5 h-5 text-white" />
            </button>
          </div>
          
          <!-- 附件预览 -->
          <div v-if="attachedFiles.length > 0" class="mt-3 flex flex-wrap gap-2">
            <div
              v-for="(file, index) in attachedFiles"
              :key="index"
              class="flex items-center space-x-2 bg-gray-700 rounded-lg px-3 py-2"
            >
              <FileText class="w-4 h-4 text-gray-300" />
              <span class="text-sm text-gray-300">{{ file.name }}</span>
              <button
                @click="removeAttachment(index)"
                class="text-gray-400 hover:text-gray-200"
              >
                <X class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 配置预览侧边栏 -->
      <div 
        v-if="selectedSuggestion"
        class="w-80 border-l border-gray-700 bg-gray-800 flex flex-col"
      >
        <ConfigPreviewPanel
          :suggestion="selectedSuggestion"
          @apply-config="handleApplyConfig"
          @modify-config="handleModifyConfig"
          @close="handleClosePreview"
        />
      </div>
    </div>

    <!-- 文件上传输入 -->
    <input
      ref="fileInput"
      type="file"
      multiple
      accept=".txt,.doc,.docx,.pdf,image/*,video/*"
      class="hidden"
      @change="handleFileSelect"
    >

    <!-- 配置集成组件 -->
    <ConfigIntegration
      :target-config="videoConfig"
      @config-applied="handleConfigApplied"
      @config-error="handleConfigError"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted, watch } from 'vue'
import { 
  MessageSquare, 
  Plus, 
  Trash2, 
  Sparkles, 
  Send, 
  Paperclip, 
  FileText, 
  X,
  Video,
  Utensils,
  GraduationCap,
  ShoppingBag
} from 'lucide-vue-next'
// import { useConversationalVideoStore } from '@/store/conversationalVideo'
// import type { ConfigSuggestion } from '@/store/conversationalVideo'
import MessageBubble from './components/MessageBubble.vue'
import ConfigPreviewPanel from './components/ConfigPreviewPanel.vue'
import ConfigIntegration from '../ConversationalVideoAgent/components/ConfigIntegration.vue'
import { defaultVideoConfig } from '../ConversationalVideoAgent/utils/configApplicator'

// Store
// const conversationalStore = useConversationalVideoStore()

// 响应式数据
const inputMessage = ref('')
const attachedFiles = ref<File[]>([])
const messagesContainer = ref<HTMLElement>()
const messageInput = ref<HTMLTextAreaElement>()
const fileInput = ref<HTMLInputElement>()

// 视频配置对象
const videoConfig = ref(defaultVideoConfig)

// 计算属性
// const {
//   hasActiveConversation,
//   messages,
//   isProcessing,
//   selectedSuggestion
// } = conversationalStore

const hasActiveConversation = ref(false)
const messages = ref([])
const isProcessing = ref(false)
const selectedSuggestion = ref(null)

const canSendMessage = computed(() => {
  return inputMessage.value.trim().length > 0 && 
         inputMessage.value.length <= 500 && 
         !isProcessing.value
})

// 快速开始示例
const quickStartExamples = ref([
  {
    id: 'food',
    title: '美食短视频',
    description: '制作吸引人的美食内容',
    prompt: '制作一个60秒的美食短视频，竖版格式，需要字幕和背景音乐',
    icon: Utensils
  },
  {
    id: 'product',
    title: '产品宣传',
    description: '展示产品特色和优势',
    prompt: '制作一个产品宣传视频，横版格式，专业风格，时长30秒',
    icon: ShoppingBag
  },
  {
    id: 'tutorial',
    title: '教程视频',
    description: '清晰的教学内容',
    prompt: '制作一个教程视频，需要清晰的字幕和平静的配音',
    icon: GraduationCap
  },
  {
    id: 'general',
    title: '通用视频',
    description: '自定义您的需求',
    prompt: '我想制作一个视频',
    icon: Video
  }
])

// 方法
const handleQuickStart = async (prompt: string) => {
  inputMessage.value = prompt
  await handleSendMessage()
}

const handleSendMessage = async () => {
  if (!canSendMessage.value) return
  
  // 清空输入
  inputMessage.value = ''
  attachedFiles.value = []
  
  // 发送消息
  // await conversationalStore.sendMessage(message, files.length > 0 ? files : undefined)
  
  // 滚动到底部
  await nextTick()
  scrollToBottom()
}

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    handleSendMessage()
  }
}

const handleInputResize = () => {
  if (!messageInput.value) return
  
  messageInput.value.style.height = 'auto'
  const scrollHeight = messageInput.value.scrollHeight
  const maxHeight = 120 // 最大高度
  
  messageInput.value.style.height = Math.min(scrollHeight, maxHeight) + 'px'
}

const handleFileUpload = () => {
  fileInput.value?.click()
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files) {
    const newFiles = Array.from(target.files)
    attachedFiles.value.push(...newFiles)
  }
  // 清空input以允许重复选择同一文件
  target.value = ''
}

const removeAttachment = (index: number) => {
  attachedFiles.value.splice(index, 1)
}

const handleSelectSuggestion = (suggestion: any) => {
  // conversationalStore.selectSuggestion(suggestion)
  selectedSuggestion.value = suggestion
}

const handleApplyConfig = async () => {
  // const success = await conversationalStore.applySelectedConfig()
  const success = true
  if (success) {
    // TODO: 跳转到视频编辑界面
    console.log('配置已应用，准备跳转到编辑界面')
  }
}

const handleModifyConfig = () => {
  // TODO: 打开配置修改界面
  console.log('打开配置修改界面')
}

const handleClosePreview = () => {
  // conversationalStore.selectedSuggestion = null
  selectedSuggestion.value = null
}

const handleNewConversation = () => {
  // conversationalStore.createNewConversation()
  inputMessage.value = ''
  attachedFiles.value = []
}

const handleClearConversation = () => {
  // conversationalStore.clearCurrentConversation()
  inputMessage.value = ''
  attachedFiles.value = []
}

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

// 配置应用处理方法
const handleConfigApplied = (message: string) => {
  console.log('配置应用成功:', message)
  // 可以添加成功提示
}

const handleConfigError = (error: string) => {
  console.error('配置应用失败:', error)
  // 可以添加错误提示
}

// 监听消息变化，自动滚动到底部
watch(
  () => messages.value.length,
  () => {
    nextTick(() => {
      scrollToBottom()
    })
  }
)

// 组件挂载时创建新对话
onMounted(() => {
  if (!hasActiveConversation.value) {
    // conversationalStore.createNewConversation()
  }
})
</script>

<style scoped>
.conversational-video-agent {
  /* 确保组件占满空间 */
  position: relative;
}

/* 自定义滚动条 */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.3);
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: rgba(156, 163, 175, 0.5);
}

/* 动画效果 */
.animate-bounce {
  animation: bounce 1s infinite;
}

@keyframes bounce {
  0%, 20%, 53%, 80%, 100% {
    transform: translate3d(0,0,0);
  }
  40%, 43% {
    transform: translate3d(0,-8px,0);
  }
  70% {
    transform: translate3d(0,-4px,0);
  }
  90% {
    transform: translate3d(0,-2px,0);
  }
}

/* 输入框自适应高度 */
textarea {
  min-height: 44px;
  max-height: 120px;
}

/* 按钮悬停效果 */
button:hover {
  transform: translateY(-1px);
}

button:active {
  transform: translateY(0);
}

/* 卡片悬停效果 */
.group:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
</style>