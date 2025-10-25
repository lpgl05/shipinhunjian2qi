<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div class="bg-gray-800 rounded-lg w-full max-w-5xl max-h-[90vh] flex flex-col">
      <div class="flex items-center justify-between p-4 border-b border-gray-700">
        <h3 class="text-xl font-semibold text-gray-50">贴纸库</h3>
        <button class="text-gray-400 hover:text-gray-50" @click="$emit('close')">×</button>
      </div>
      <div class="flex-1 overflow-y-auto p-4">
        <div class="grid grid-cols-4 gap-4">
          <div
            v-for="sticker in stickers"
            :key="sticker.id"
            class="sticker-item bg-gray-700 rounded-lg p-4 cursor-pointer hover:bg-gray-600 transition-all text-center"
            @click="handleSelect(sticker)"
          >
            <!-- 贴纸图标 -->
            <div class="aspect-square bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center mb-3">
              <div class="text-4xl">{{ sticker.emoji }}</div>
            </div>
            <!-- 贴纸名称 -->
            <div>
              <h4 class="text-sm font-medium text-gray-50">{{ sticker.name }}</h4>
              <p class="text-xs text-gray-400 mt-1">{{ sticker.category }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{ close: [], select: [s: string] }>()

const stickers = [
  { id: 'heart', name: '爱心', category: '情感', emoji: '❤️' },
  { id: 'star', name: '星星', category: '装饰', emoji: '✨' },
  { id: 'smile', name: '笑脸', category: '表情', emoji: '😊' },
  { id: 'fire', name: '火焰', category: '激情', emoji: '🔥' },
  { id: 'arrow', name: '箭头', category: '指示', emoji: '➡️' },
  { id: 'flag', name: '旗帜', category: '标识', emoji: '🚩' },
  { id: 'sparkles', name: '闪亮', category: '装饰', emoji: '💫' },
  { id: 'check', name: '对勾', category: '确认', emoji: '✅' }
]

const handleSelect = (sticker: any) => {
  emit('select', sticker.id)
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
