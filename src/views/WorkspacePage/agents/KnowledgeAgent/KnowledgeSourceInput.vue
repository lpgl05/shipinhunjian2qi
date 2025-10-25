<template>
  <div class="knowledge-source-input space-y-4">
    <!-- 拖拽上传区域 -->
    <div 
      class="upload-zone relative p-8 border-2 border-dashed rounded-2xl transition-all duration-300 cursor-pointer"
      :class="[
        isDragging 
          ? 'border-blue-500 bg-blue-500/10' 
          : 'border-gray-700 bg-gray-800/30 hover:border-gray-600 hover:bg-gray-800/50'
      ]"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="handleDrop"
      @click="triggerFileInput"
    >
      <input 
        ref="fileInputRef"
        type="file"
        multiple
        accept=".pdf,.doc,.docx,.txt"
        class="hidden"
        @change="handleFileSelect"
      />

      <div class="text-center">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-gray-700 rounded-2xl mb-4">
          <Upload :size="32" class="text-gray-400" />
        </div>
        <p class="text-gray-300 font-medium mb-1">
          拖拽文件至此或点击上传
        </p>
        <p class="text-sm text-gray-500">
          支持 PDF, DOCX, TXT 格式
        </p>
      </div>
    </div>

    <!-- 链接输入 -->
    <div class="flex gap-2">
      <div class="flex-1 relative">
        <div class="absolute left-3 top-1/2 -translate-y-1/2">
          <Link :size="18" class="text-gray-500" />
        </div>
        <input
          v-model="linkInput"
          type="url"
          placeholder="输入网页链接..."
          class="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-gray-300 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
          @keydown.enter="handleAddLink"
        />
      </div>
      <button
        class="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="!linkInput.trim()"
        @click="handleAddLink"
      >
        添加链接
      </button>
    </div>

    <!-- 已添加的知识源列表 -->
    <div v-if="sources.length > 0" class="space-y-2">
      <div class="text-sm text-gray-400 font-medium mb-2">
        已添加 {{ sources.length }} 个知识源
      </div>
      <div 
        v-for="source in sources"
        :key="source.id"
        class="flex items-center gap-3 p-3 bg-gray-800/50 rounded-xl border border-gray-700"
      >
        <!-- 图标 -->
        <div class="flex-shrink-0">
          <div 
            class="w-10 h-10 rounded-lg flex items-center justify-center"
            :class="source.type === 'file' ? 'bg-blue-500/20' : 'bg-green-500/20'"
          >
            <component 
              :is="source.type === 'file' ? FileText : Link" 
              :size="20" 
              :class="source.type === 'file' ? 'text-blue-400' : 'text-green-400'"
            />
          </div>
        </div>

        <!-- 信息 -->
        <div class="flex-1 min-w-0">
          <p class="text-sm text-gray-300 truncate">
            {{ source.value }}
          </p>
          <div class="flex items-center gap-2 mt-1">
            <span 
              class="text-xs px-2 py-0.5 rounded"
              :class="getStatusClass(source.status)"
            >
              {{ getStatusText(source.status) }}
            </span>
          </div>
        </div>

        <!-- 删除按钮 -->
        <button
          class="flex-shrink-0 p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
          @click="$emit('remove-source', source.id)"
        >
          <X :size="18" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Upload, FileText, Link, X } from 'lucide-vue-next'

interface KnowledgeSource {
  id: string
  type: 'file' | 'link'
  value: string
  status: 'uploading' | 'processing' | 'success' | 'error'
}

interface Props {
  sources: KnowledgeSource[]
}

defineProps<Props>()

const emit = defineEmits<{
  'add-source': [source: Omit<KnowledgeSource, 'id'>]
  'remove-source': [id: string]
}>()

const isDragging = ref(false)
const linkInput = ref('')
const fileInputRef = ref<HTMLInputElement>()

// 触发文件选择
const triggerFileInput = () => {
  fileInputRef.value?.click()
}

// 处理文件选择
const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target.files
  if (files) {
    handleFiles(Array.from(files))
  }
}

// 处理拖拽
const handleDrop = (event: DragEvent) => {
  isDragging.value = false
  const files = event.dataTransfer?.files
  if (files) {
    handleFiles(Array.from(files))
  }
}

// 处理文件
const handleFiles = (files: File[]) => {
  files.forEach(file => {
    emit('add-source', {
      type: 'file',
      value: file.name,
      status: 'uploading'
    })
  })
}

// 处理添加链接
const handleAddLink = () => {
  if (!linkInput.value.trim()) return
  
  emit('add-source', {
    type: 'link',
    value: linkInput.value.trim(),
    status: 'processing'
  })
  
  linkInput.value = ''
}

// 获取状态样式
const getStatusClass = (status: string) => {
  const classes = {
    uploading: 'bg-blue-500/20 text-blue-400',
    processing: 'bg-yellow-500/20 text-yellow-400',
    success: 'bg-green-500/20 text-green-400',
    error: 'bg-red-500/20 text-red-400'
  }
  return classes[status as keyof typeof classes] || ''
}

// 获取状态文本
const getStatusText = (status: string) => {
  const texts = {
    uploading: '上传中...',
    processing: '处理中...',
    success: '已完成',
    error: '失败'
  }
  return texts[status as keyof typeof texts] || ''
}
</script>

