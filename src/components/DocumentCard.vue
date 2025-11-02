<template>
  <div class="document-card bg-gray-800/50 rounded-xl border border-gray-700 p-4 hover:border-gray-600 transition-all">
    <div class="flex items-start gap-3">
      <!-- 文档图标 -->
      <div class="flex-shrink-0">
        <div 
          class="w-12 h-12 rounded-lg flex items-center justify-center"
          :class="document.type === 'file' ? 'bg-blue-500/20' : 'bg-green-500/20'"
        >
          <FileText v-if="document.type === 'file'" :size="24" class="text-blue-400" />
          <Link v-else :size="24" class="text-green-400" />
        </div>
      </div>

      <!-- 文档信息 -->
      <div class="flex-1 min-w-0">
        <h3 class="text-sm font-medium text-gray-300 truncate mb-1">
          {{ document.name }}
        </h3>
        
        <div class="flex items-center gap-2 mb-2 flex-wrap">
          <!-- 上传状态 -->
          <span 
            class="text-xs px-2 py-0.5 rounded"
            :class="getStatusClass(document.status)"
          >
            {{ getStatusText(document.status) }}
          </span>
          
          <!-- 训练状态 -->
          <TrainingStatusBadge 
            :status="document.trainingStatus"
            :progress="document.trainingProgress"
          />
        </div>

        <!-- 文档详情 -->
        <div class="flex items-center gap-4 text-xs text-gray-500">
          <span>{{ formatTime(document.uploadTime) }}</span>
          <span v-if="document.size">{{ formatSize(document.size) }}</span>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="flex-shrink-0 flex items-center gap-1">
        <button
          class="p-2 text-gray-500 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
          @click="$emit('view', document)"
          title="查看"
        >
          <Eye :size="16" />
        </button>
        <button
          v-if="document.trainingStatus === 'not_started' || document.trainingStatus === 'failed'"
          class="p-2 text-gray-500 hover:text-green-400 hover:bg-green-500/10 rounded-lg transition-colors"
          @click="$emit('retrain', document)"
          title="重新训练"
        >
          <RefreshCw :size="16" />
        </button>
        <button
          class="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
          @click="$emit('delete', document)"
          title="删除"
        >
          <Trash2 :size="16" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FileText, Link, Eye, RefreshCw, Trash2 } from 'lucide-vue-next'
import type { Document } from '../store/documents'
import TrainingStatusBadge from './TrainingStatusBadge.vue'

interface Props {
  document: Document
}

defineProps<Props>()

defineEmits<{
  view: [document: Document]
  retrain: [document: Document]
  delete: [document: Document]
}>()

const getStatusClass = (status: string) => {
  const classes = {
    uploading: 'bg-blue-500/20 text-blue-400',
    processing: 'bg-yellow-500/20 text-yellow-400',
    training: 'bg-purple-500/20 text-purple-400',
    completed: 'bg-green-500/20 text-green-400',
    failed: 'bg-red-500/20 text-red-400'
  }
  return classes[status as keyof typeof classes] || 'bg-gray-500/20 text-gray-400'
}

const getStatusText = (status: string) => {
  const texts = {
    uploading: '上传中',
    processing: '处理中',
    training: '训练中',
    completed: '已完成',
    failed: '失败'
  }
  return texts[status as keyof typeof texts] || '未知'
}

const formatTime = (time: string) => {
  return time
}

const formatSize = (bytes: number) => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}
</script>

<style scoped>
.document-card {
  transition: all 0.2s ease;
}

.document-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}
</style>

