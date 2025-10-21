<template>
  <div class="chat-canvas h-full flex flex-col bg-gray-950">
    <!-- 消息列表区域 -->
    <div ref="messagesContainer" class="flex-1 overflow-y-auto scrollbar-thin p-6">
      <div class="max-w-4xl mx-auto">
        <!-- 欢迎消息 (仅在无消息时显示) -->
        <div v-if="chatStore.messages.length === 0" class="text-center py-20">
          <div class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-violet-500 rounded-3xl mb-6 animate-pulse-slow">
            <Sparkles :size="40" class="text-white" />
          </div>
          <h2 class="text-3xl font-bold text-gray-50 mb-3">
            {{ workspaceStore.isCreationMode ? '开始创作' : '开始对话' }}
          </h2>
          <p class="text-lg text-gray-400 mb-8">
            {{ workspaceStore.isCreationMode 
              ? '在右侧画布中配置你的创作参数' 
              : '描述你的需求，AI将为你智能生成' 
            }}
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
import { ref, nextTick, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { 
  Sparkles, 
  Paperclip, 
  Send, 
  Bot, 
  Image as ImageIcon 
} from 'lucide-vue-next'
import ChatMessage from './components/ChatMessage.vue'
import { useChatStore } from '../../store/chat'
import { useWorkspaceStore } from '../../store/workspace'

const route = useRoute()
const chatStore = useChatStore()
const workspaceStore = useWorkspaceStore()

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

// 页面加载时处理URL参数
onMounted(() => {
  const prompt = route.query.prompt as string
  const agent = route.query.agent as string
  
  if (prompt) {
    inputText.value = prompt
    nextTick(() => {
      autoResize()
    })
  }
  
  if (agent) {
    // 激活智能体，进入创作模式
    workspaceStore.enterCreationMode(agent)
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

