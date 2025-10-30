<template>
  <div 
    class="persona-card group relative p-6 bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 cursor-pointer transition-all duration-300 hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/20"
    :class="{ 'ring-2 ring-blue-500 border-blue-500': selected }"
    @click="$emit('click')"
  >
    <!-- 头像和基本信息 -->
    <div class="flex items-start gap-4">
      <!-- 头像 -->
      <div class="flex-shrink-0">
        <div 
          class="w-16 h-16 rounded-full bg-gradient-to-r flex items-center justify-center text-2xl font-bold text-white ring-2 ring-gray-700 group-hover:ring-blue-500 transition-all"
          :class="avatarGradient"
        >
          {{ avatarText }}
        </div>
      </div>

      <!-- 信息 -->
      <div class="flex-1 min-w-0">
        <h3 class="text-lg font-bold text-gray-50 mb-1 group-hover:text-blue-400 transition-colors">
          {{ persona.name }}
        </h3>
        <p class="text-sm text-gray-400 line-clamp-2 mb-3">
          {{ persona.description }}
        </p>

        <!-- 知识库统计 -->
        <div class="flex items-center gap-4 text-xs text-gray-500">
          <div class="flex items-center gap-1">
            <FileText :size="14" />
            <span>{{ persona.knowledgeStats.docs }} 份文档</span>
          </div>
          <div class="flex items-center gap-1">
            <Link :size="14" />
            <span>{{ persona.knowledgeStats.links }} 个链接</span>
          </div>
        </div>
      </div>

      <!-- 选中标记 -->
      <div v-if="selected" class="flex-shrink-0">
        <div class="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
          <Check :size="16" class="text-white" />
        </div>
      </div>
    </div>

    <!-- Hover效果 -->
    <div class="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 to-violet-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none"></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { FileText, Link, Check } from 'lucide-vue-next'

interface Persona {
  id: string
  name: string
  avatarUrl?: string
  description: string
  knowledgeStats: {
    docs: number
    links: number
  }
}

interface Props {
  persona: Persona
  selected?: boolean
}

const props = defineProps<Props>()

defineEmits<{
  click: []
}>()

// 头像文字（取名字首字母）
const avatarText = computed(() => {
  return props.persona.name.substring(0, 2).toUpperCase()
})

// 头像渐变色
const avatarGradient = computed(() => {
  const gradients = [
    'from-blue-500 to-cyan-500',
    'from-purple-500 to-pink-500',
    'from-green-500 to-emerald-500',
    'from-orange-500 to-red-500',
    'from-indigo-500 to-blue-500',
    'from-violet-500 to-purple-500'
  ]
  // 根据ID生成固定的渐变色
  const index = props.persona.id.charCodeAt(0) % gradients.length
  return gradients[index]
})
</script>

<style scoped>
.persona-card {
  position: relative;
  overflow: hidden;
}
</style>

