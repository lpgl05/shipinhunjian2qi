<template>
  <div
    class="chat-message flex gap-3 animate-fade-in"
    :class="[
      message.sender === 'user' ? 'justify-end' : 'justify-start'
    ]"
  >
    <!-- AI头像 -->
    <div v-if="message.sender === 'ai'" class="flex-shrink-0">
      <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-violet-500 rounded-full flex items-center justify-center">
        <Bot :size="20" class="text-white" />
      </div>
    </div>

    <!-- 消息内容 -->
    <div
      class="message-content max-w-2xl"
      :class="[
        message.sender === 'user' 
          ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-2xl rounded-tr-sm' 
          : 'bg-gray-800 text-gray-50 rounded-2xl rounded-tl-sm'
      ]"
    >
      <!-- 文本消息 -->
      <div v-if="message.text" class="px-5 py-3">
        <p class="text-sm leading-relaxed whitespace-pre-wrap">{{ message.text }}</p>
        
        <!-- 时间戳 -->
        <div 
          class="mt-2 text-xs opacity-70"
          :class="message.sender === 'user' ? 'text-blue-100' : 'text-gray-400'"
        >
          {{ formatTime(message.timestamp) }}
        </div>
      </div>

      <!-- 生成式UI组件 -->
      <div v-if="message.ugiComponent" class="p-4">
        <component 
          :is="getUgiComponent(message.ugiComponent)" 
          v-bind="message.ugiProps"
          @select="handleUgiEvent('select', $event)"
          @reorder="handleUgiEvent('reorder', $event)"
          @replace="handleUgiEvent('replace', $event)"
          @delete="handleUgiEvent('delete', $event)"
        />
      </div>

      <!-- 加载状态 -->
      <div v-if="message.isLoading" class="px-5 py-3 flex items-center gap-2">
        <div class="flex gap-1">
          <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0ms"></div>
          <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 150ms"></div>
          <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 300ms"></div>
        </div>
        <span class="text-xs text-gray-400">AI正在思考...</span>
      </div>
    </div>

    <!-- 用户头像 -->
    <div v-if="message.sender === 'user'" class="flex-shrink-0">
      <div class="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
        <User :size="20" class="text-gray-400" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import { Bot, User } from 'lucide-vue-next'
import type { Message } from '../../../store/chat'

interface Props {
  message: Message
}

defineProps<Props>()
const emit = defineEmits<{
  ugiEvent: [type: string, data: any]
}>()

// 动态加载UGI组件
const getUgiComponent = (componentName: string) => {
  return defineAsyncComponent(() => 
    import(`./UGI/${componentName}.vue`)
  )
}

// 格式化时间
const formatTime = (timestamp: number) => {
  const date = new Date(timestamp)
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${hours}:${minutes}`
}

// 处理UGI组件事件
const handleUgiEvent = (type: string, data: any) => {
  emit('ugiEvent', type, data)
}
</script>

<style scoped>
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
</style>


