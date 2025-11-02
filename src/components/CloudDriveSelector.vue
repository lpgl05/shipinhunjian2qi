<template>
  <div class="cloud-drive-selector">
    <div class="max-h-[400px] overflow-y-auto">
      <!-- 搜索框 -->
      <div class="sticky top-0 bg-gray-800 p-4 border-b border-gray-700 z-10">
        <div class="relative">
          <Search :size="18" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索文档..."
            class="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-300 placeholder-gray-500 focus:border-blue-500 outline-none"
          />
        </div>
      </div>

      <!-- 文件列表 -->
      <div class="p-4 space-y-2">
        <div v-if="filteredFiles.length === 0" class="text-center py-8 text-gray-400">
          <FileText :size="48" class="mx-auto mb-4 text-gray-600" />
          <p>云盘中暂无文档</p>
          <button
            class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            @click="$emit('upload')"
          >
            上传文档到云盘
          </button>
        </div>

        <div
          v-for="file in filteredFiles"
          :key="file.id"
          class="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors"
          :class="{ 'ring-2 ring-blue-500': isSelected(file.id) }"
          @click="toggleSelection(file.id)"
        >
          <input
            type="checkbox"
            :checked="isSelected(file.id)"
            class="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
            @click.stop="toggleSelection(file.id)"
          />
          <div class="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center" :class="getFileColorClass(file.type)">
            <component :is="getFileIcon(file.type)" :size="20" class="text-white" />
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm text-gray-200 truncate">{{ file.name }}</p>
            <div class="flex items-center gap-2 text-xs text-gray-400 mt-1">
              <span>{{ file.size }}</span>
              <span>•</span>
              <span>{{ file.uploadDate }}</span>
            </div>
          </div>
          <TrainingStatusBadge v-if="file.trainingStatus" :status="file.trainingStatus" />
        </div>
      </div>
    </div>

    <!-- 已选择文件统计 -->
    <div class="sticky bottom-0 bg-gray-800 border-t border-gray-700 p-4">
      <div class="flex items-center justify-between">
        <span class="text-sm text-gray-400">
          已选择 <span class="text-blue-400 font-semibold">{{ selectedFiles.length }}</span> 个文件
        </span>
        <div class="flex gap-2">
          <button
            v-if="selectedFiles.length > 0"
            class="px-3 py-1.5 text-gray-400 hover:text-gray-200 transition-colors text-sm"
            @click="clearSelection"
          >
            清空
          </button>
          <button
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="selectedFiles.length === 0"
            @click="confirmSelection"
          >
            确认选择
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Search, FileText, FileType, File as FileIcon } from 'lucide-vue-next'
import TrainingStatusBadge from './TrainingStatusBadge.vue'

interface CloudFile {
  id: string
  name: string
  type: string
  size: string
  uploadDate: string
  trainingStatus?: 'pending' | 'processing' | 'completed' | 'failed'
}

const props = defineProps<{
  files: CloudFile[]
  selectedIds?: string[]
}>()

const emit = defineEmits<{
  'confirm': [fileIds: string[]]
  'upload': []
}>()

const searchQuery = ref('')
const selectedFiles = ref<string[]>(props.selectedIds || [])

const filteredFiles = computed(() => {
  if (!searchQuery.value) return props.files
  const query = searchQuery.value.toLowerCase()
  return props.files.filter(file => file.name.toLowerCase().includes(query))
})

const isSelected = (id: string) => {
  return selectedFiles.value.includes(id)
}

const toggleSelection = (id: string) => {
  const index = selectedFiles.value.indexOf(id)
  if (index > -1) {
    selectedFiles.value.splice(index, 1)
  } else {
    selectedFiles.value.push(id)
  }
}

const clearSelection = () => {
  selectedFiles.value = []
}

const confirmSelection = () => {
  emit('confirm', selectedFiles.value)
}

const getFileIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'pdf':
      return FileType
    case 'doc':
    case 'docx':
      return FileType
    case 'txt':
      return FileText
    default:
      return FileIcon
  }
}

const getFileColorClass = (type: string) => {
  switch (type.toLowerCase()) {
    case 'pdf':
      return 'bg-red-500/20 text-red-400'
    case 'doc':
    case 'docx':
      return 'bg-blue-500/20 text-blue-400'
    case 'txt':
      return 'bg-gray-500/20 text-gray-400'
    default:
      return 'bg-purple-500/20 text-purple-400'
  }
}
</script>

