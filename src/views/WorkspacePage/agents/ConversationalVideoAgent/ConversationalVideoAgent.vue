<template>
  <div class="conversational-video-agent h-full flex">
    <!-- 主对话区域 -->
    <div class="flex-1 flex flex-col">
      <!-- 头部 -->
      <div class="bg-gray-800 border-b border-gray-700 p-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-violet-500 rounded-lg flex items-center justify-center">
              <MessageSquare class="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 class="text-lg font-semibold text-gray-50">对话式视频混剪</h2>
              <p class="text-sm text-gray-400">通过自然语言描述，智能生成视频配置</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <button
              @click="startNewConversation"
              class="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
            >
              新对话
            </button>
            <button
              @click="clearConversation"
              class="px-3 py-1.5 bg-gray-600 hover:bg-gray-700 text-gray-300 text-sm rounded-lg transition-colors"
            >
              清空
            </button>
          </div>
        </div>
      </div>

      <!-- 消息区域 -->
      <div class="flex-1 overflow-hidden flex flex-col">
        <div 
          ref="messagesContainer"
          class="flex-1 overflow-y-auto p-4 space-y-4"
        >
          <!-- 欢迎界面 -->
          <div v-if="messages.length === 0" class="text-center py-12">
            <div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-violet-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles class="w-8 h-8 text-white" />
            </div>
            <h3 class="text-xl font-semibold text-gray-50 mb-2">开始创作您的视频</h3>
            <p class="text-gray-400 mb-6">描述您想要制作的视频，我会为您智能配置参数</p>
            
            <!-- 快速开始示例 -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
              <button
                v-for="example in quickStartExamples"
                :key="example.id"
                @click="sendExampleMessage(example.text)"
                class="p-4 bg-gray-700 hover:bg-gray-600 rounded-lg text-left transition-colors group"
              >
                <div class="flex items-center gap-3 mb-2">
                  <component :is="example.icon" class="w-5 h-5 text-blue-400" />
                  <span class="font-medium text-gray-50">{{ example.title }}</span>
                </div>
                <p class="text-sm text-gray-400 group-hover:text-gray-300">{{ example.description }}</p>
              </button>
            </div>
          </div>

          <!-- 消息列表 -->
          <MessageBubble
            v-for="message in messages"
            :key="message.id"
            :message="message"
            @suggestion-selected="handleSuggestionSelected"
          />

          <!-- 加载状态 -->
          <div v-if="isProcessing" class="flex items-center gap-3 p-4 bg-gray-700 rounded-lg">
            <div class="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span class="text-gray-300">正在分析您的需求...</span>
          </div>
        </div>

        <!-- 输入区域 -->
        <div class="border-t border-gray-700 p-4">
          <div class="flex items-end gap-3">
            <!-- 文件附件按钮 -->
            <button
              @click="triggerFileInput"
              class="p-2 text-gray-400 hover:text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
              title="添加附件"
            >
              <Paperclip class="w-5 h-5" />
            </button>
            
            <!-- 隐藏的文件输入 -->
            <input
              ref="fileInput"
              type="file"
              multiple
              accept="image/*,video/*"
              @change="handleFileSelect"
              class="hidden"
            />

            <!-- 消息输入框 -->
            <div class="flex-1 relative">
              <textarea
                v-model="inputMessage"
                @keydown="handleKeyDown"
                placeholder="描述您想要制作的视频..."
                class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-50 placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                rows="1"
                :style="{ height: textareaHeight }"
              />
              
              <!-- 附件预览 -->
              <div v-if="selectedFiles.length > 0" class="mt-2 flex flex-wrap gap-2">
                <div
                  v-for="(file, index) in selectedFiles"
                  :key="index"
                  class="flex items-center gap-2 px-3 py-1 bg-gray-600 rounded-lg text-sm"
                >
                  <FileText class="w-4 h-4 text-gray-400" />
                  <span class="text-gray-300">{{ file.name }}</span>
                  <button
                    @click="removeFile(index)"
                    class="text-gray-400 hover:text-red-400 transition-colors"
                  >
                    <X class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <!-- 发送按钮 -->
            <button
              @click="sendMessage"
              :disabled="!canSendMessage"
              class="p-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
            >
              <Send class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 配置预览侧边栏 -->
    <div 
      v-if="selectedSuggestion"
      class="w-80 border-l border-gray-700 bg-gray-800"
    >
      <ConfigPreviewPanel
        :suggestion="selectedSuggestion"
        @apply-config="handleApplyConfig"
        @close="handleClosePreview"
      />
    </div>

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
  Sparkles, 
  Paperclip, 
  Send, 
  FileText, 
  X,
  Video,
  Palette,
  Zap,
  Target
} from 'lucide-vue-next'
import { useConversationalVideoStore } from '@/store/conversationalVideo'
import type { ConfigSuggestion } from '@/store/conversationalVideo'
import MessageBubble from './components/MessageBubble.vue'
import ConfigPreviewPanel from './components/ConfigPreviewPanel.vue'
import ConfigIntegration from './components/ConfigIntegration.vue'
import type { VideoConfigData } from '@/utils/config/configApplicator'

// Store
const conversationalStore = useConversationalVideoStore()

// 响应式数据
const inputMessage = ref('')
const selectedFiles = ref<File[]>([])
const messagesContainer = ref<HTMLElement>()
const fileInput = ref<HTMLInputElement>()
const textareaHeight = ref('auto')

// 模拟的视频配置对象（实际应该从VideoConfig组件传入）
const videoConfig = ref({
  aspectRatio: '9:16',
  title: '',
  duration: 60,
  resolution: '1080p',
  fps: 30,
  style: 'modern',
  transition: 'fade',
  enableSubtitles: true,
  subtitleStyle: 'modern',
  subtitlePosition: 'bottom',
  subtitleFont: '',
  subtitleSticker: '',
  voiceType: 'authoritative',
  voiceSpeed: 1.0
})

// 计算属性
const messages = computed(() => conversationalStore.messages)
const isProcessing = computed(() => conversationalStore.isProcessing)
const selectedSuggestion = computed(() => conversationalStore.selectedSuggestion)

const canSendMessage = computed(() => {
  return inputMessage.value.trim().length > 0 && !isProcessing.value
})

// 快速开始示例
const quickStartExamples = [
  {
    id: 1,
    icon: Video,
    title: '产品宣传视频',
    description: '制作一个60秒的竖版产品展示视频',
    text: '我想制作一个60秒的竖版产品宣传视频，风格要现代简洁，需要字幕'
  },
  {
    id: 2,
    icon: Palette,
    title: '美食短视频',
    description: '制作抖音风格的美食制作视频',
    text: '帮我制作一个抖音风格的美食制作视频，时长30秒，要有活力感'
  },
  {
    id: 3,
    icon: Zap,
    title: '教程视频',
    description: '制作横版的教程讲解视频',
    text: '我需要制作一个横版的教程视频，时长90秒，适合B站平台'
  },
  {
    id: 4,
    icon: Target,
    title: '营销推广',
    description: '制作多平台适配的营销视频',
    text: '制作一个营销推广视频，需要适配多个平台，包含字幕和背景音乐'
  }
]

// 方法
const startNewConversation = () => {
  conversationalStore.createNewConversation()
  inputMessage.value = ''
  selectedFiles.value = []
}

const clearConversation = () => {
  conversationalStore.clearCurrentConversation()
  inputMessage.value = ''
  selectedFiles.value = []
}

const sendMessage = async () => {
  if (!canSendMessage.value) return

  const message = inputMessage.value.trim()
  const files = selectedFiles.value.length > 0 ? [...selectedFiles.value] : undefined

  // 清空输入
  inputMessage.value = ''
  selectedFiles.value = []
  textareaHeight.value = 'auto'

  // 发送消息
  await conversationalStore.sendMessage(message, files)

  // 滚动到底部
  await nextTick()
  scrollToBottom()
}

const sendExampleMessage = async (message: string) => {
  inputMessage.value = message
  await sendMessage()
}

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    sendMessage()
  }
  
  // 自动调整高度
  nextTick(() => {
    const textarea = event.target as HTMLTextAreaElement
    textarea.style.height = 'auto'
    const newHeight = Math.min(textarea.scrollHeight, 120) // 最大120px
    textarea.style.height = newHeight + 'px'
    textareaHeight.value = newHeight + 'px'
  })
}

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files) {
    selectedFiles.value = Array.from(target.files)
  }
}

const removeFile = (index: number) => {
  selectedFiles.value.splice(index, 1)
}

const handleSuggestionSelected = (suggestion: ConfigSuggestion) => {
  conversationalStore.selectSuggestion(suggestion)
}

const handleApplyConfig = (suggestion: ConfigSuggestion) => {
  // 配置将通过ConfigIntegration组件自动应用
  console.log('应用配置:', suggestion)
}

const handleClosePreview = () => {
  conversationalStore.clearSelectedSuggestion()
}

const handleConfigApplied = (config: VideoConfigData) => {
  console.log('配置已应用:', config)
  // 可以在这里添加额外的处理逻辑
}

const handleConfigError = (error: string) => {
  console.error('配置应用错误:', error)
  // 可以在这里显示错误提示
}

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

// 监听消息变化，自动滚动到底部
watch(messages, () => {
  nextTick(() => {
    scrollToBottom()
  })
}, { deep: true })

// 组件挂载时创建新对话
onMounted(() => {
  if (!conversationalStore.hasActiveConversation) {
    conversationalStore.createNewConversation()
  }
})
</script>

<style scoped>
/* 自定义滚动条 */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #4B5563;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #6B7280;
}

/* 文本域样式 */
textarea {
  min-height: 44px;
  max-height: 120px;
  resize: none;
  overflow-y: auto;
}

/* 动画效果 */
.conversational-video-agent {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 按钮悬停效果 */
button:not(:disabled):hover {
  transform: translateY(-1px);
}

button:not(:disabled):active {
  transform: translateY(0);
}

/* 加载动画 */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>