<template>
  <div class="chat-message" :class="message.sender === 'user' ? 'user-message' : 'ai-message'">
    <!-- 用户消息 -->
    <div v-if="message.sender === 'user'" class="flex gap-3 justify-end">
      <div class="max-w-[80%]">
        <div class="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl rounded-tr-sm px-4 py-3">
          <p class="text-sm leading-relaxed">{{ message.text }}</p>
        </div>
        <div class="text-xs text-gray-500 mt-1 text-right">
          {{ formatTime(message.timestamp) }}
        </div>
      </div>
      <div class="flex-shrink-0">
        <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-violet-500 rounded-full flex items-center justify-center">
          <span class="text-sm font-medium text-white">U</span>
        </div>
      </div>
    </div>

    <!-- AI消息 -->
    <div v-else class="flex gap-3 justify-start">
      <div class="flex-shrink-0">
        <div class="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
          <Bot :size="16" class="text-white" />
        </div>
      </div>
      <div class="max-w-[80%]">
        <div class="bg-gray-800 text-gray-300 rounded-2xl rounded-tl-sm px-4 py-3">
          <p class="text-sm leading-relaxed whitespace-pre-wrap">{{ message.text }}</p>
          
          <!-- 风格推荐组件 -->
          <div v-if="message.ugiComponent === 'style-recommendation'" class="mt-4">
            <div class="space-y-3">
              <h4 class="text-sm font-medium text-gray-200">推荐风格：</h4>
              <div class="grid gap-2">
                <button
                  v-for="style in message.ugiProps?.availableStyles"
                  :key="style.id"
                  class="p-3 bg-gray-700 hover:bg-gray-600 rounded-lg border border-gray-600 hover:border-purple-500 transition-all text-left"
                  :class="{ 'border-purple-500 bg-purple-500/10': style.id === message.ugiProps?.recommendedStyle?.id }"
                  @click="$emit('style-select', style)"
                >
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white" :class="style.color">
                      {{ style.name.substring(0, 2) }}
                    </div>
                    <div>
                      <p class="text-sm font-medium text-gray-200">{{ style.name }}</p>
                      <p class="text-xs text-gray-400">{{ style.description }}</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          <!-- 内容生成完成组件 -->
          <div v-if="message.ugiComponent === 'content-generated'" class="mt-4">
            <div class="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
              <div class="flex items-center gap-2">
                <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                <span class="text-sm text-green-400">内容生成完成</span>
              </div>
            </div>
          </div>
        </div>
        <div class="text-xs text-gray-500 mt-1">
          {{ formatTime(message.timestamp) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Bot } from 'lucide-vue-next'

interface Message {
  id: string
  text: string
  sender: 'user' | 'ai'
  timestamp: number
  ugiComponent?: string
  ugiProps?: Record<string, any>
}

defineProps<{
  message: Message
}>()

defineEmits<{
  'style-select': [style: any]
  'config-update': [config: any]
}>()

// 格式化时间
const formatTime = (timestamp: number) => {
  const date = new Date(timestamp)
  return date.toLocaleTimeString('zh-CN', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}
</script>

<style scoped>
.chat-message {
  animation: fadeIn 0.3s ease-in-out;
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
</style>
