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
          <h2 class="text-3xl font-bold text-gray-50 mb-3">开始创作你的视频</h2>
          <p class="text-lg text-gray-400 mb-8">告诉我你想要什么样的视频，AI将为你智能生成</p>
          
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
              placeholder="描述你想要的视频效果...  (按 Enter 发送，Shift + Enter 换行)"
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
import { Sparkles, Paperclip, Send, Bot, Image as ImageIcon } from 'lucide-vue-next'
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
  '制作一个1分钟的产品展示视频',
  '生成旅行vlog混剪',
  '创建美食短视频',
  '制作节日祝福视频'
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
