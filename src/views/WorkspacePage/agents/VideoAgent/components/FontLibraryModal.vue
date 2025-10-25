<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div class="bg-gray-800 rounded-lg w-full max-w-5xl max-h-[90vh] flex flex-col">
      <div class="flex items-center justify-between p-4 border-b border-gray-700">
        <h3 class="text-xl font-semibold text-gray-50">花字字体库</h3>
        <button class="text-gray-400 hover:text-gray-50" @click="$emit('close')">×</button>
      </div>
      <div class="flex-1 overflow-y-auto p-4">
        <div class="grid grid-cols-3 gap-4">
          <div
            v-for="font in fonts"
            :key="font.id"
            class="font-item bg-gray-700 rounded-lg p-4 cursor-pointer hover:bg-gray-600 transition-all"
            @click="$emit('select', font.id)"
          >
            <!-- 花字预览 -->
            <div class="aspect-video bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-3" :class="font.previewClass">
              <div class="text-white text-2xl font-bold">{{ font.name }}</div>
            </div>
            <!-- 字体信息 -->
            <div>
              <h4 class="text-sm font-medium text-gray-50">{{ font.name }}</h4>
              <p class="text-xs text-gray-400 mt-1">{{ font.category }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{ close: [], select: [f: string] }>()

const fonts = [
  { id: 'decorative', name: '装饰体', category: '花体', previewClass: 'shadow-2xl' },
  { id: 'handwritten', name: '手写体', category: '个性', previewClass: 'font-handwritten' },
  { id: 'gradient', name: '渐变体', category: '时尚', previewClass: 'bg-gradient-to-r from-yellow-400 to-orange-500' },
  { id: 'outline', name: '描边体', category: '醒目', previewClass: 'drop-shadow-lg' },
  { id: '3d', name: '立体体', category: '立体', previewClass: 'shadow-inner' },
  { id: 'neon', name: '霓虹体', category: '炫酷', previewClass: 'glow' }
]
</script>

<style scoped>
.font-handwritten {
  font-family: 'Comic Sans MS', cursive;
}

.glow {
  text-shadow: 0 0 10px #ff00ff, 0 0 20px #ff00ff, 0 0 30px #ff00ff;
}
</style>
