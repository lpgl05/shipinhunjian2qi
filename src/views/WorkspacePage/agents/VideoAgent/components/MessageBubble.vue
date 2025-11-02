<template>
  <div class="message-bubble" :class="messageTypeClass">
    <!-- 用户消息 -->
    <div v-if="message.type === 'user'" class="flex justify-end">
      <div class="max-w-[80%] bg-blue-600 text-white rounded-2xl rounded-br-md px-4 py-3">
        <p class="text-sm leading-relaxed whitespace-pre-wrap">{{ message.content }}</p>
        
        <!-- 附件显示 -->
        <div v-if="message.attachments && message.attachments.length > 0" class="mt-2 space-y-1">
          <div
            v-for="(file, index) in message.attachments"
            :key="index"
            class="flex items-center space-x-2 bg-blue-700 rounded-lg px-2 py-1"
          >
            <FileText class="w-3 h-3" />
            <span class="text-xs">{{ file.name }}</span>
          </div>
        </div>
        
        <div class="text-xs text-blue-100 mt-2 text-right">
          {{ formatTime(message.timestamp) }}
        </div>
      </div>
    </div>

    <!-- 助手消息 -->
    <div v-else-if="message.type === 'assistant'" class="flex justify-start">
      <div class="flex space-x-3 max-w-[90%]">
        <!-- 头像 -->
        <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-violet-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
          <Bot class="w-4 h-4 text-white" />
        </div>
        
        <div class="flex-1">
          <div class="bg-gray-800 text-gray-50 rounded-2xl rounded-bl-md px-4 py-3">
            <p class="text-sm leading-relaxed whitespace-pre-wrap">{{ message.content }}</p>
            
            <div class="text-xs text-gray-400 mt-2">
              {{ formatTime(message.timestamp) }}
            </div>
          </div>
          
          <!-- 配置建议卡片 -->
           <div v-if="message.suggestions && message.suggestions.length > 0" class="mt-3 space-y-2">
             <div
               v-for="suggestion in message.suggestions"
               :key="suggestion.id"
               class="bg-gray-700 rounded-lg p-3 cursor-pointer hover:bg-gray-600 transition-colors"
               @click="$emit('select-suggestion', suggestion)"
             >
               <h4 class="text-sm font-medium text-gray-50">{{ suggestion.title }}</h4>
               <p class="text-xs text-gray-400 mt-1">{{ suggestion.description }}</p>
             </div>
           </div>
        </div>
      </div>
    </div>

    <!-- 系统消息 -->
    <div v-else-if="message.type === 'system'" class="flex justify-center">
      <div class="bg-gray-700 text-gray-300 rounded-full px-4 py-2 text-sm max-w-[80%] text-center">
        {{ message.content }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Bot, FileText } from 'lucide-vue-next'

interface Message {
  id: string
  type: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  attachments?: File[]
  suggestions?: any[]
}

interface Props {
  message: Message
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'select-suggestion': [suggestion: any]
}>()

const messageTypeClass = computed(() => {
  return {
    'user-message': props.message.type === 'user',
    'assistant-message': props.message.type === 'assistant',
    'system-message': props.message.type === 'system'
  }
})

const formatTime = (timestamp: Date): string => {
  const now = new Date()
  const diff = now.getTime() - timestamp.getTime()
  
  // 小于1分钟
  if (diff < 60000) {
    return '刚刚'
  }
  
  // 小于1小时
  if (diff < 3600000) {
    const minutes = Math.floor(diff / 60000)
    return `${minutes}分钟前`
  }
  
  // 小于24小时
  if (diff < 86400000) {
    const hours = Math.floor(diff / 3600000)
    return `${hours}小时前`
  }
  
  // 超过24小时，显示具体时间
  return timestamp.toLocaleString('zh-CN', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style scoped>
.message-bubble {
  margin-bottom: 1rem;
}

.user-message {
  /* 用户消息样式 */
}

.assistant-message {
  /* 助手消息样式 */
}

.system-message {
  /* 系统消息样式 */
}
</style>