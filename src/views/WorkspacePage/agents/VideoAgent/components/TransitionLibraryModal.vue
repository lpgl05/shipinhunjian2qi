<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div class="bg-gray-800 rounded-lg w-full max-w-5xl max-h-[90vh] flex flex-col">
      <div class="flex items-center justify-between p-4 border-b border-gray-700">
        <h3 class="text-xl font-semibold text-gray-50">转场效果库</h3>
        <button class="text-gray-400 hover:text-gray-50" @click="$emit('close')">×</button>
      </div>
      <div class="flex-1 overflow-y-auto p-4">
        <div class="grid grid-cols-3 gap-4">
          <div
            v-for="transition in transitions"
            :key="transition.id"
            class="transition-item bg-gray-700 rounded-lg overflow-hidden cursor-pointer hover:bg-gray-600 transition-all"
            @click="handleSelect(transition)"
          >
            <!-- GIF预览图 -->
            <div class="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center relative overflow-hidden">
              <!-- 模拟GIF效果 -->
              <div class="absolute inset-0 flex items-center justify-center text-white text-4xl">
                {{ transition.preview }}
              </div>
              <!-- 播放指示 -->
              <div class="absolute bottom-2 right-2 px-2 py-1 bg-black/50 rounded text-white text-xs">
                GIF
              </div>
            </div>
            <!-- 转场名称 -->
            <div class="p-3">
              <h4 class="text-sm font-medium text-gray-50">{{ transition.name }}</h4>
              <p class="text-xs text-gray-400 mt-1">{{ transition.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{ close: [], select: [t: string] }>()

const transitions = [
  { id: 'fade', name: '淡入淡出', description: '平滑过渡', preview: '◐◑' },
  { id: 'cut', name: '硬切', description: '快速切换', preview: '◪◩' },
  { id: 'slide', name: '推拉', description: '横向滑动', preview: '← →' },
  { id: 'zoom', name: '缩放', description: '放大缩小', preview: '⊕⊖' },
  { id: 'rotate', name: '旋转', description: '旋转切换', preview: '⟲⟳' },
  { id: 'blur', name: '模糊', description: '虚化过渡', preview: '○◌' },
  { id: 'fly', name: '飞入', description: '飞出飞入', preview: '↗↙' },
  { id: 'wipe', name: '划动', description: '擦除效果', preview: '⊲⊳' }
]

const handleSelect = (transition: any) => {
  emit('select', transition.id)
  emit('close')
}
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
</style>
