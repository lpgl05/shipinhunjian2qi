<template>
  <div 
    v-if="status !== 'idle'"
    class="generation-status p-4 rounded-xl border transition-all duration-300"
    :class="getStatusClass()"
  >
    <div class="flex items-center gap-3">
      <!-- 图标 -->
      <div class="flex-shrink-0">
        <div 
          class="w-10 h-10 rounded-lg flex items-center justify-center"
          :class="getIconBgClass()"
        >
          <component 
            :is="getIcon()" 
            :size="20" 
            :class="[getIconClass(), { 'animate-spin': status === 'processing' }]"
          />
        </div>
      </div>

      <!-- 消息 -->
      <div class="flex-1">
        <p class="text-sm font-medium" :class="getTextClass()">
          {{ message }}
        </p>
        
        <!-- 进度条 -->
        <div v-if="status === 'processing' && progress !== undefined" class="mt-2">
          <div class="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
            <div 
              class="h-full bg-gradient-to-r from-blue-500 to-violet-500 transition-all duration-300"
              :style="{ width: `${progress}%` }"
            ></div>
          </div>
        </div>
      </div>

      <!-- 关闭按钮 -->
      <button
        v-if="status === 'success' || status === 'error'"
        class="flex-shrink-0 p-1 text-gray-500 hover:text-gray-300 transition-colors"
        @click="$emit('close')"
      >
        <X :size="18" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Loader2, CheckCircle2, AlertCircle, X } from 'lucide-vue-next'

interface Props {
  status: 'idle' | 'processing' | 'success' | 'error'
  message: string
  progress?: number
}

const props = defineProps<Props>()

defineEmits<{
  close: []
}>()

// 获取图标
const getIcon = () => {
  const icons = {
    processing: Loader2,
    success: CheckCircle2,
    error: AlertCircle,
    idle: Loader2
  }
  return icons[props.status]
}

// 获取状态样式
const getStatusClass = () => {
  const classes = {
    processing: 'bg-blue-500/10 border-blue-500/30',
    success: 'bg-green-500/10 border-green-500/30',
    error: 'bg-red-500/10 border-red-500/30',
    idle: ''
  }
  return classes[props.status]
}

// 获取图标背景样式
const getIconBgClass = () => {
  const classes = {
    processing: 'bg-blue-500/20',
    success: 'bg-green-500/20',
    error: 'bg-red-500/20',
    idle: ''
  }
  return classes[props.status]
}

// 获取图标颜色
const getIconClass = () => {
  const classes = {
    processing: 'text-blue-400',
    success: 'text-green-400',
    error: 'text-red-400',
    idle: ''
  }
  return classes[props.status]
}

// 获取文本颜色
const getTextClass = () => {
  const classes = {
    processing: 'text-blue-300',
    success: 'text-green-300',
    error: 'text-red-300',
    idle: ''
  }
  return classes[props.status]
}
</script>

