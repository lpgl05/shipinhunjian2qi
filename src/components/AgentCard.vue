<template>
  <div
    class="agent-card group relative bg-gray-700 rounded-2xl border border-gray-600 p-6 cursor-pointer overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20 hover:border-blue-500/50"
    @click="handleClick"
  >
    <!-- 背景光效 -->
    <div class="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-violet-500/0 group-hover:from-blue-500/10 group-hover:to-violet-500/10 transition-all duration-300"></div>
    
    <!-- 内容 -->
    <div class="relative z-10">
      <!-- 图标 -->
      <div class="mb-4 inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-500/20 to-violet-500/20 rounded-xl group-hover:from-blue-500/30 group-hover:to-violet-500/30 transition-all duration-300">
        <component :is="iconComponent" :size="28" class="text-blue-400 group-hover:text-blue-300 transition-colors" />
      </div>

      <!-- 标题 -->
      <h3 class="text-lg font-bold text-gray-50 mb-2 group-hover:text-white transition-colors">
        {{ title }}
      </h3>

      <!-- 描述 -->
      <p class="text-sm text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
        {{ description }}
      </p>

      <!-- 悬停时显示的箭头 -->
      <div class="mt-4 flex items-center text-blue-400 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-0 group-hover:translate-x-2">
        <span class="text-sm font-medium mr-1">开始使用</span>
        <ArrowRight :size="16" />
      </div>
    </div>

    <!-- 角标（可选） -->
    <div v-if="badge" class="absolute top-4 right-4 px-2 py-1 bg-blue-500 text-white text-xs font-medium rounded-full">
      {{ badge }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ArrowRight } from 'lucide-vue-next'
import * as LucideIcons from 'lucide-vue-next'

interface Props {
  icon: string
  title: string
  description: string
  badge?: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  click: []
}>()

// 动态获取图标组件
const iconComponent = computed(() => {
  return (LucideIcons as any)[props.icon] || LucideIcons.Box
})

const handleClick = () => {
  emit('click')
}
</script>

