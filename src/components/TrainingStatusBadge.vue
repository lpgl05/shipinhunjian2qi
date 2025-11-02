<template>
  <div class="training-status-badge inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium" :class="statusClass">
    <div class="w-1.5 h-1.5 rounded-full" :class="dotClass"></div>
    <span>{{ statusText }}</span>
    <span v-if="showProgress && progress !== undefined" class="ml-1">
      {{ progress }}%
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { TrainingStatus } from '../store/documents'

interface Props {
  status: TrainingStatus
  progress?: number
  showProgress?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showProgress: true
})

const statusClass = computed(() => {
  const classes = {
    not_started: 'bg-gray-500/20 text-gray-400',
    training: 'bg-blue-500/20 text-blue-400',
    completed: 'bg-green-500/20 text-green-400',
    failed: 'bg-red-500/20 text-red-400'
  }
  return classes[props.status] || classes.not_started
})

const dotClass = computed(() => {
  const classes = {
    not_started: 'bg-gray-400',
    training: 'bg-blue-400 animate-pulse',
    completed: 'bg-green-400',
    failed: 'bg-red-400'
  }
  return classes[props.status] || classes.not_started
})

const statusText = computed(() => {
  const texts = {
    not_started: '未训练',
    training: '训练中',
    completed: '训练完成',
    failed: '训练失败'
  }
  return texts[props.status] || '未知'
})
</script>

<style scoped>
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>

