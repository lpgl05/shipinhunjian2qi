<template>
  <div
    class="asset-card group relative bg-gray-800 rounded-xl border overflow-hidden cursor-pointer transition-all duration-200"
    :class="[
      selected 
        ? 'border-blue-500 ring-2 ring-blue-500/50' 
        : 'border-gray-700 hover:border-gray-600'
    ]"
    @click="$emit('select')"
  >
    <!-- 选择复选框 -->
    <div class="absolute top-2 left-2 z-10">
      <div
        class="w-5 h-5 rounded border-2 flex items-center justify-center transition-all"
        :class="[
          selected 
            ? 'bg-blue-500 border-blue-500' 
            : 'bg-gray-800/80 border-gray-600 group-hover:border-gray-500'
        ]"
      >
        <Check v-if="selected" :size="14" class="text-white" />
      </div>
    </div>

    <!-- 删除按钮 -->
    <button
      class="absolute top-2 right-2 z-10 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-600 active:scale-95 transition-all"
      @click.stop="$emit('delete')"
    >
      <Trash2 :size="14" />
    </button>

    <!-- 缩略图区域 -->
    <div class="aspect-video bg-gray-800 flex items-center justify-center relative overflow-hidden">
      <!-- 视频预览 -->
      <video
        v-if="asset.type === 'video'"
        :src="asset.url"
        class="w-full h-full object-cover"
        muted
        preload="metadata"
        @mouseenter="playVideo"
        @mouseleave="pauseVideo"
      >
        <div class="absolute inset-0 flex items-center justify-center bg-gray-700">
          <component :is="getAssetIcon(asset.type)" :size="40" class="text-gray-400" />
        </div>
      </video>

      <!-- 图片预览 -->
      <img
        v-else-if="asset.type === 'image'"
        :src="asset.url"
        :alt="asset.name"
        class="w-full h-full object-cover"
        @error="handleImageError"
      />

      <!-- 音频预览 -->
      <div
        v-else-if="asset.type === 'audio'"
        class="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-600 to-blue-600"
      >
        <Music :size="40" class="text-white" />
      </div>

      <!-- 文档预览 -->
      <div
        v-else
        class="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-600 to-gray-700"
      >
        <component :is="getAssetIcon(asset.type)" :size="40" class="text-white" />
      </div>

      <!-- 播放按钮覆盖层（视频） -->
      <div
        v-if="asset.type === 'video'"
        class="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Play :size="32" class="text-white" />
      </div>

      <!-- 类型标签 -->
      <div class="absolute bottom-2 left-2 px-2 py-0.5 bg-black/70 text-white text-xs font-medium rounded capitalize">
        {{ getTypeLabel(asset.type) }}
      </div>

      <!-- 时长标签（视频/音频） -->
      <div v-if="asset.duration" class="absolute bottom-2 right-2 px-2 py-0.5 bg-black/70 text-white text-xs font-medium rounded">
        {{ asset.duration }}
      </div>
    </div>

    <!-- 信息区域 -->
    <div class="p-3">
      <p class="text-sm font-medium text-gray-200 truncate mb-1" :title="asset.name">
        {{ asset.name }}
      </p>
      <div class="flex items-center justify-between text-xs text-gray-500">
        <span>{{ asset.size }}</span>
        <span>{{ formatDate(asset.uploadTime) }}</span>
      </div>

      <!-- 标签 -->
      <div v-if="asset.tags.length > 0" class="flex flex-wrap gap-1 mt-2">
        <span
          v-for="tag in asset.tags.slice(0, 2)"
          :key="tag"
          class="px-2 py-0.5 bg-gray-700 text-gray-400 text-xs rounded"
        >
          {{ tag }}
        </span>
        <span v-if="asset.tags.length > 2" class="px-2 py-0.5 text-gray-500 text-xs">
          +{{ asset.tags.length - 2 }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Check, Trash2, Video, Image, Music, FileText, Play } from 'lucide-vue-next'
import type { Asset } from '../../../../store/asset'

interface Props {
  asset: Asset
  selected: boolean
}

defineProps<Props>()
defineEmits<{
  select: []
  delete: []
}>()

const getAssetIcon = (type: string) => {
  switch (type) {
    case 'video':
      return Video
    case 'image':
      return Image
    case 'audio':
      return Music
    default:
      return FileText
  }
}

const formatDate = (timestamp: string) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days === 0) return '今天'
  if (days === 1) return '昨天'
  if (days < 7) return `${days}天前`
  
  return date.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' })
}

const getTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    video: '视频',
    image: '图片',
    audio: '音频',
    document: '文档'
  }
  return labels[type] || type
}

const playVideo = (event: Event) => {
  const video = event.target as HTMLVideoElement
  video.play()
}

const pauseVideo = (event: Event) => {
  const video = event.target as HTMLVideoElement
  video.pause()
}

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.style.display = 'none'
  // 可以在这里显示默认图片或图标
}
</script>

