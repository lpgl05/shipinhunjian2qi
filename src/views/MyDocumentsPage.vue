<template>
  <div class="h-screen flex bg-gray-900">
    <!-- 左侧边栏 -->
    <AppSidebar />

    <!-- 主内容区域 -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Header -->
      <header class="border-b border-gray-800 bg-gray-900 px-6 py-4">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-50">我的文档</h1>
            <p class="text-sm text-gray-400 mt-1">管理您上传的知识库文档</p>
          </div>
          <button
            class="px-4 py-2 bg-gradient-to-r from-blue-500 to-violet-500 hover:brightness-110 text-white font-medium rounded-lg transition-all flex items-center gap-2"
            @click="showUploadModal = true"
          >
            <Upload :size="18" />
            上传文档
          </button>
        </div>
      </header>

      <!-- Main Content -->
      <main class="flex-1 overflow-y-auto px-6 py-6">
        <!-- 搜索和筛选 -->
        <div class="mb-6 space-y-4">
          <!-- 搜索框 -->
          <div class="relative">
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" :size="18" />
            <input
              v-model="searchKeyword"
              type="text"
              placeholder="搜索文档名称..."
              class="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
            />
          </div>

          <!-- 筛选器 -->
          <div class="flex items-center gap-3 flex-wrap">
            <span class="text-sm text-gray-400">筛选：</span>
            <button
              v-for="filter in statusFilters"
              :key="filter.value"
              class="px-3 py-1.5 text-sm rounded-lg transition-all"
              :class="[
                activeFilter === filter.value
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              ]"
              @click="activeFilter = filter.value"
            >
              {{ filter.label }}
            </button>
          </div>
        </div>

        <!-- 文档列表 -->
        <div v-if="filteredDocuments.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <DocumentCard
            v-for="doc in filteredDocuments"
            :key="doc.id"
            :document="doc"
            @view="handleViewDocument"
            @retrain="handleRetrainDocument"
            @delete="handleDeleteDocument"
          />
        </div>

        <!-- 空状态 -->
        <div v-else class="text-center py-20">
          <div class="inline-flex items-center justify-center w-20 h-20 bg-gray-800 rounded-3xl mb-6">
            <FileText :size="40" class="text-gray-600" />
          </div>
          <h3 class="text-xl font-bold text-gray-50 mb-2">暂无文档</h3>
          <p class="text-gray-400 mb-6">上传文档后，AI将学习您的写作风格</p>
          <button
            class="px-6 py-3 bg-gradient-to-r from-blue-500 to-violet-500 hover:brightness-110 text-white font-medium rounded-xl transition-all"
            @click="showUploadModal = true"
          >
            上传第一个文档
          </button>
        </div>
      </main>
    </div>

    <!-- 上传文档模态框 -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="showUploadModal"
          class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          @click.self="showUploadModal = false"
        >
          <div class="w-full max-w-2xl bg-gray-900 rounded-2xl border border-gray-700 shadow-2xl p-6">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-bold text-gray-50">上传文档</h2>
              <button
                class="p-2 text-gray-400 hover:text-gray-300 hover:bg-gray-800 rounded-lg transition-colors"
                @click="showUploadModal = false"
              >
                <X :size="24" />
              </button>
            </div>
            <KnowledgeSourceInput
              :sources="uploadSources"
              @add-source="handleAddSource"
              @remove-source="handleRemoveSource"
            />
            <div class="mt-6 flex justify-end gap-3">
              <button
                class="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors"
                @click="showUploadModal = false"
              >
                取消
              </button>
              <button
                class="px-4 py-2 bg-gradient-to-r from-blue-500 to-violet-500 hover:brightness-110 text-white rounded-lg transition-all"
                @click="handleConfirmUpload"
              >
                确认上传
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Search, Upload, FileText, X } from 'lucide-vue-next'
import { useDocumentsStore } from '../store/documents'
import AppSidebar from './WorkspacePage/AppSidebar.vue'
import DocumentCard from '../components/DocumentCard.vue'
import KnowledgeSourceInput from './WorkspacePage/agents/KnowledgeAgent/KnowledgeSourceInput.vue'
import type { Document } from '../store/documents'

const documentsStore = useDocumentsStore()

const searchKeyword = ref('')
const activeFilter = ref<string>('all')
const showUploadModal = ref(false)
const uploadSources = ref<any[]>([])

const statusFilters = [
  { label: '全部', value: 'all' },
  { label: '已完成', value: 'completed' },
  { label: '训练中', value: 'training' },
  { label: '未训练', value: 'not_started' },
  { label: '失败', value: 'failed' }
]

// 搜索和筛选文档
const filteredDocuments = computed(() => {
  let docs = documentsStore.searchDocuments(searchKeyword.value)
  
  if (activeFilter.value !== 'all') {
    if (activeFilter.value === 'training') {
      docs = docs.filter(doc => doc.trainingStatus === 'training')
    } else if (activeFilter.value === 'not_started') {
      docs = docs.filter(doc => doc.trainingStatus === 'not_started')
    } else if (activeFilter.value === 'failed') {
      docs = docs.filter(doc => doc.status === 'failed' || doc.trainingStatus === 'failed')
    } else {
      docs = docs.filter(doc => doc.status === activeFilter.value)
    }
  }
  
  return docs
})

const handleAddSource = (source: any) => {
  uploadSources.value.push({
    ...source,
    id: Date.now().toString()
  })
}

const handleRemoveSource = (id: string) => {
  const index = uploadSources.value.findIndex(s => s.id === id)
  if (index > -1) {
    uploadSources.value.splice(index, 1)
  }
}

const handleConfirmUpload = () => {
  uploadSources.value.forEach(source => {
    documentsStore.addDocument({
      name: source.value,
      type: source.type,
      fileName: source.type === 'file' ? source.value : undefined,
      url: source.type === 'link' ? source.value : undefined,
      size: source.type === 'file' ? Math.floor(Math.random() * 5000000) : undefined,
      status: 'uploading',
      trainingStatus: 'not_started'
    })
    
    // 模拟上传和训练过程
    setTimeout(() => {
      const doc = documentsStore.getDocuments()[0]
      if (doc) {
        documentsStore.updateDocumentStatus(doc.id, 'completed', 'training', 0)
        
        // 模拟训练进度
        let progress = 0
        const interval = setInterval(() => {
          progress += 10
          if (progress <= 100) {
            documentsStore.updateDocumentStatus(doc.id, 'completed', 'training', progress)
          } else {
            clearInterval(interval)
            documentsStore.updateDocumentStatus(doc.id, 'completed', 'completed', 100)
          }
        }, 500)
      }
    }, 1000)
  })
  
  uploadSources.value = []
  showUploadModal.value = false
}

const handleViewDocument = (doc: Document) => {
  console.log('查看文档:', doc)
  // TODO: 实现文档详情查看
}

const handleRetrainDocument = (doc: Document) => {
  documentsStore.updateDocumentStatus(doc.id, 'completed', 'training', 0)
  
  // 模拟重新训练
  let progress = 0
  const interval = setInterval(() => {
    progress += 10
    if (progress <= 100) {
      documentsStore.updateDocumentStatus(doc.id, 'completed', 'training', progress)
    } else {
      clearInterval(interval)
      documentsStore.updateDocumentStatus(doc.id, 'completed', 'completed', 100)
    }
  }, 500)
}

const handleDeleteDocument = (doc: Document) => {
  if (confirm(`确定要删除文档 "${doc.name}" 吗？`)) {
    documentsStore.deleteDocument(doc.id)
  }
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>

