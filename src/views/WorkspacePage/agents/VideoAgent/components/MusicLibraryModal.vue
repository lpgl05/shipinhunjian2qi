<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div class="bg-gray-800 rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
      <!-- 头部 -->
      <div class="flex items-center justify-between p-4 border-b border-gray-700">
        <div class="flex items-center gap-3">
          <Music :size="24" class="text-purple-400" />
          <h3 class="text-xl font-semibold text-gray-50">音乐资料库</h3>
        </div>
        <button class="text-gray-400 hover:text-gray-50 transition-colors" @click="$emit('close')">
          <X :size="24" />
        </button>
      </div>

      <!-- 搜索栏 -->
      <div class="p-4 border-b border-gray-700">
        <div class="flex gap-3">
          <div class="flex-1 relative">
            <Search :size="20" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="搜索音乐..."
              class="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
      </div>

      <!-- 分类筛选 -->
      <div class="p-4 border-b border-gray-700 bg-gray-900">
        <div class="flex gap-2 flex-wrap">
          <button
            v-for="category in musicCategories"
            :key="category"
            class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            :class="selectedCategory === category ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'"
            @click="selectedCategory = category"
          >
            {{ category }}
          </button>
        </div>
      </div>

      <!-- 音乐列表 -->
      <div class="flex-1 overflow-y-auto p-4 space-y-3">
        <div
          v-for="music in filteredMusic"
          :key="music.id"
          class="flex items-center gap-4 p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors cursor-pointer"
          @click="$emit('select', music)"
        >
          <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Music :size="24" class="text-white" />
          </div>
          <div class="flex-1 min-w-0">
            <h4 class="font-medium text-gray-50 truncate">{{ music.name }}</h4>
            <p class="text-sm text-gray-400">{{ music.artist }}</p>
            <div class="flex items-center gap-4 mt-1">
              <span class="text-xs text-gray-500">{{ music.duration }}</span>
              <span class="text-xs text-gray-500">{{ music.category }}</span>
              <span class="text-xs text-gray-500">{{ music.tempo }} BPM</span>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <Play :size="20" class="text-gray-400 hover:text-purple-400 transition-colors" />
            <button class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm">
              使用
            </button>
          </div>
        </div>
      </div>

      <!-- 分页 -->
      <div class="flex items-center justify-between p-4 border-t border-gray-700">
        <div class="text-sm text-gray-400">
          共 {{ filteredMusic.length }} 首音乐
        </div>
        <div class="flex gap-2">
          <button class="px-3 py-1 bg-gray-700 text-gray-300 rounded hover:bg-gray-600">上一页</button>
          <button class="px-3 py-1 bg-gray-700 text-gray-300 rounded hover:bg-gray-600">下一页</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Music, Search, X, Play } from 'lucide-vue-next'

interface MusicItem {
  id: string
  name: string
  artist: string
  duration: string
  category: string
  tempo: number
}

const emit = defineEmits<{
  close: []
  select: [music: MusicItem]
}>()

const searchQuery = ref('')
const selectedCategory = ref('全部')

const musicCategories = ['全部', '激情', '舒缓', '时尚', '电子', '流行', '古典', '摇滚', '民谣', '爵士', '嘻哈']

const allMusic: MusicItem[] = [
  { id: '1', name: '活力电子', artist: 'AI Music', duration: '3:24', category: '电子', tempo: 128 },
  { id: '2', name: '轻柔钢琴', artist: 'AI Music', duration: '2:45', category: '舒缓', tempo: 60 },
  { id: '3', name: '动感摇滚', artist: 'AI Music', duration: '4:12', category: '摇滚', tempo: 140 },
  { id: '4', name: '时尚流行', artist: 'AI Music', duration: '3:50', category: '流行', tempo: 115 },
  { id: '5', name: '激情电音', artist: 'AI Music', duration: '3:15', category: '电子', tempo: 132 },
  { id: '6', name: '平静氛围', artist: 'AI Music', duration: '2:58', category: '舒缓', tempo: 58 },
  { id: '7', name: '复古爵士', artist: 'AI Music', duration: '3:42', category: '爵士', tempo: 90 },
  { id: '8', name: '都市嘻哈', artist: 'AI Music', duration: '3:08', category: '嘻哈', tempo: 95 },
  { id: '9', name: '优雅古典', artist: 'AI Music', duration: '4:30', category: '古典', tempo: 72 },
  { id: '10', name: '清新民谣', artist: 'AI Music', duration: '3:25', category: '民谣', tempo: 85 },
  { id: '11', name: '极限重拍', artist: 'AI Music', duration: '3:50', category: '电子', tempo: 145 },
  { id: '12', name: '梦幻氛围', artist: 'AI Music', duration: '3:05', category: '舒缓', tempo: 55 }
]

const filteredMusic = computed(() => {
  let result = allMusic

  // 分类筛选
  if (selectedCategory.value !== '全部') {
    result = result.filter(m => m.category === selectedCategory.value)
  }

  // 搜索筛选
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(m => 
      m.name.toLowerCase().includes(query) ||
      m.artist.toLowerCase().includes(query) ||
      m.category.toLowerCase().includes(query)
    )
  }

  return result
})
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
