<template>
  <div
    class="asset-list-item group flex items-center gap-4 p-4 bg-gray-750 rounded-lg border cursor-pointer transition-all"
    :class="[
      selected 
        ? 'border-blue-500 bg-blue-500/10' 
        : 'border-gray-700 hover:border-gray-600 hover:bg-gray-700'
    ]"
    @click="$emit('select')"
  >
    <!-- 选择复选框 -->
    <div
      class="w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all"
      :class="[
        selected 
          ? 'bg-blue-500 border-blue-500' 
          : 'bg-gray-800 border-gray-600 group-hover:border-gray-500'
      ]"
    >
      <Check v-if="selected" :size="14" class="text-white" />
    </div>

    <!-- 缩略图 -->
    <div class="w-16 h-16 bg-gray-800 rounded flex items-center justify-center flex-shrink-0 overflow-hidden">
      <img
        v-if="asset.thumbnail"
        :src="asset.thumbnail"
        :alt="asset.name"
        class="w-full h-full object-cover"
      />
      <component v-else :is="getAssetIcon(asset.type)" :size="28" class="text-gray-600" />
    </div>

    <!-- 信息 -->
    <div class="flex-1 min-w-0">
      <h4 class="text-sm font-medium text-gray-200 truncate mb-1">{{ asset.name }}</h4>
      <div class="flex items-center gap-3 text-xs text-gray-500">
        <span class="capitalize">{{ asset.type }}</span>
        <span>•</span>
        <span>{{ asset.size }}</span>
        <span v-if="asset.duration">•</span>
        <span v-if="asset.duration">{{ asset.duration }}</span>
      </div>
      <!-- 标签 -->
      <div v-if="asset.tags.length > 0" class="flex flex-wrap gap-1 mt-2">
        <span
          v-for="tag in asset.tags"
          :key="tag"
          class="px-2 py-0.5 bg-gray-700 text-gray-400 text-xs rounded"
        >
          {{ tag }}
        </span>
      </div>
    </div>

    <!-- 上传时间 -->
    <div class="text-xs text-gray-500 flex-shrink-0">
      {{ formatDate(asset.uploadTime) }}
    </div>

    <!-- 操作按钮 -->
    <div class="flex items-center gap-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
      <button
        class="p-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 active:scale-95 transition-all"
        title="下载"
        @click.stop="handleDownload"
      >
        <Download :size="16" />
      </button>
      <button
        class="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 active:scale-95 transition-all"
        title="删除"
        @click.stop="$emit('delete')"
      >
        <Trash2 :size="16" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Check, Trash2, Download, Video, Image, Music, FileText } from 'lucide-vue-next'
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
  return date.toLocaleString('zh-CN', { 
    year: 'numeric',
    month: '2-digit', 
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const handleDownload = () => {
  console.log('下载文件')
  // TODO: 实现下载功能
}
</script>

