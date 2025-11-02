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
            <h1 class="text-2xl font-bold text-gray-50">我的创作</h1>
            <p class="text-sm text-gray-400 mt-1">查看和管理AI生成的内容</p>
          </div>
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
              placeholder="搜索标题、内容或风格..."
              class="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
            />
          </div>

          <!-- 筛选器 -->
          <div class="flex items-center gap-3 flex-wrap">
            <span class="text-sm text-gray-400">筛选：</span>
            <button
              v-for="filter in styleFilters"
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

        <!-- 创作列表 -->
        <div v-if="filteredCreations.length > 0" class="space-y-4">
          <div
            v-for="creation in filteredCreations"
            :key="creation.id"
            class="bg-gray-800/50 rounded-xl border border-gray-700 p-6 hover:border-gray-600 transition-all cursor-pointer"
            @click="handleViewCreation(creation)"
          >
            <div class="flex items-start justify-between gap-4">
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-3 mb-2">
                  <h3 class="text-lg font-semibold text-gray-50 truncate">
                    {{ creation.title }}
                  </h3>
                  <span class="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded">
                    {{ creation.style }}
                  </span>
                  <span v-if="creation.template" class="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded">
                    {{ creation.template }}
                  </span>
                </div>
                
                <p class="text-sm text-gray-400 mb-3 line-clamp-2">
                  {{ creation.content }}
                </p>
                
                <div class="flex items-center gap-4 text-xs text-gray-500">
                  <span>{{ creation.wordCount }} 字</span>
                  <span>{{ creation.createdAt }}</span>
                </div>
              </div>
              
              <div class="flex-shrink-0 flex items-center gap-2">
                <button
                  class="p-2 text-gray-500 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                  @click.stop="handleEditCreation(creation)"
                  title="编辑"
                >
                  <Edit3 :size="18" />
                </button>
                <button
                  class="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  @click.stop="handleDeleteCreation(creation)"
                  title="删除"
                >
                  <Trash2 :size="18" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-else class="text-center py-20">
          <div class="inline-flex items-center justify-center w-20 h-20 bg-gray-800 rounded-3xl mb-6">
            <FileText :size="40" class="text-gray-600" />
          </div>
          <h3 class="text-xl font-bold text-gray-50 mb-2">暂无创作</h3>
          <p class="text-gray-400 mb-6">使用AI生成内容后，将在这里显示</p>
          <button
            class="px-6 py-3 bg-gradient-to-r from-blue-500 to-violet-500 hover:brightness-110 text-white font-medium rounded-xl transition-all"
            @click="$router.push('/knowledge-agent')"
          >
            开始创作
          </button>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Search, FileText, Edit3, Trash2 } from 'lucide-vue-next'
import { useDocumentsStore } from '../store/documents'
import AppSidebar from './WorkspacePage/AppSidebar.vue'
import type { Creation } from '../store/documents'

const router = useRouter()
const documentsStore = useDocumentsStore()

const searchKeyword = ref('')
const activeFilter = ref<string>('all')

const styleFilters = [
  { label: '全部', value: 'all' },
  { label: '老板-正式风格', value: '老板-正式风格' },
  { label: 'CEO-创新风格', value: 'CEO-创新风格' },
  { label: '营销总监', value: '营销总监' }
]

// 搜索和筛选创作
const filteredCreations = computed(() => {
  let creations = documentsStore.searchCreations(searchKeyword.value)
  
  if (activeFilter.value !== 'all') {
    creations = creations.filter(c => c.style === activeFilter.value)
  }
  
  return creations
})

const handleViewCreation = (creation: Creation) => {
  // TODO: 实现创作详情查看
  console.log('查看创作:', creation)
}

const handleEditCreation = (creation: Creation) => {
  // TODO: 跳转到编辑页面
  router.push(`/knowledge-agent?edit=${creation.id}`)
}

const handleDeleteCreation = (creation: Creation) => {
  if (confirm(`确定要删除创作 "${creation.title}" 吗？`)) {
    documentsStore.deleteCreation(creation.id)
  }
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

