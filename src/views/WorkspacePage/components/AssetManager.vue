<template>
  <TransitionRoot :show="workspaceStore.isAssetModalOpen" as="template">
    <Dialog as="div" class="relative z-50" @close="workspaceStore.closeAssetModal">
      <!-- 背景遮罩 -->
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/90 backdrop-blur-sm" />
      </TransitionChild>

      <!-- 全屏容器 -->
      <div class="fixed inset-0 overflow-hidden">
        <div class="flex min-h-full items-center justify-center p-4">
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel class="w-full max-w-7xl h-[85vh] transform overflow-hidden rounded-2xl bg-gray-800 border border-gray-700 shadow-2xl transition-all flex flex-col">
              <!-- 顶部工具栏 -->
              <div class="flex items-center justify-between px-6 py-4 border-b border-gray-700">
                <DialogTitle class="text-xl font-bold text-gray-50 flex items-center gap-3">
                  <Cloud :size="24" class="text-blue-400" />
                  <span>AI云盘</span>
                </DialogTitle>

                <div class="flex items-center gap-3">
                  <!-- 搜索框 -->
                  <div class="relative">
                    <Search :size="18" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      v-model="assetStore.searchQuery"
                      type="text"
                      placeholder="搜索素材..."
                      class="input-primary pl-10 pr-4 py-2 w-64"
                    />
                  </div>

                  <!-- 视图切换 -->
                  <div class="flex gap-1 p-1 bg-gray-700 rounded-lg">
                    <button
                      class="p-2 rounded transition-colors"
                      :class="assetStore.viewMode === 'grid' ? 'bg-gray-600 text-gray-50' : 'text-gray-400 hover:text-gray-300'"
                      @click="assetStore.viewMode = 'grid'"
                      title="网格视图"
                    >
                      <Grid3x3 :size="18" />
                    </button>
                    <button
                      class="p-2 rounded transition-colors"
                      :class="assetStore.viewMode === 'list' ? 'bg-gray-600 text-gray-50' : 'text-gray-400 hover:text-gray-300'"
                      @click="assetStore.viewMode = 'list'"
                      title="列表视图"
                    >
                      <List :size="18" />
                    </button>
                  </div>

                  <!-- 上传按钮 -->
                  <button class="btn-primary flex items-center gap-2" @click="handleUpload">
                    <Upload :size="18" />
                    <span>上传</span>
                  </button>

                  <!-- 新建文件夹按钮 -->
                  <button class="btn-secondary flex items-center gap-2" @click="handleNewFolder">
                    <FolderPlus :size="18" />
                    <span>新建文件夹</span>
                  </button>

                  <!-- 关闭按钮 -->
                  <button class="icon-btn" @click="workspaceStore.closeAssetModal">
                    <X :size="24" />
                  </button>
                </div>
              </div>

              <!-- 主要内容区 -->
              <div class="flex-1 flex overflow-hidden">
                <!-- 左侧文件夹树和分类 -->
                <div class="w-64 border-r border-gray-700 bg-gray-850 overflow-y-auto scrollbar-thin">
                  <!-- 分类导航 -->
                  <div class="p-4 border-b border-gray-700">
                    <h3 class="text-sm font-semibold text-gray-300 mb-3">分类浏览</h3>
                    <div class="space-y-1">
                      <button
                        v-for="category in categories"
                        :key="category.id"
                        class="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors"
                        :class="selectedCategory === category.id 
                          ? 'bg-blue-500/20 text-blue-400' 
                          : 'text-gray-400 hover:bg-gray-700 hover:text-gray-200'"
                        @click="selectCategory(category.id)"
                      >
                        <component :is="category.icon" :size="18" />
                        <span>{{ category.name }}</span>
                        <span class="ml-auto text-xs opacity-60">{{ getCategoryCount(category.type) }}</span>
                      </button>
                    </div>
                  </div>

                  <!-- 文件夹树 -->
                  <div class="p-4">
                    <h3 class="text-sm font-semibold text-gray-300 mb-3">文件夹</h3>
                    <FolderTree
                      v-for="folder in assetStore.folders"
                      :key="folder.id"
                      :folder="folder"
                      :selected-id="assetStore.selectedFolderId || ''"
                      @select="assetStore.selectFolder"
                    />
                  </div>
                </div>

                <!-- 右侧资源网格/列表 -->
                <div class="flex-1 flex flex-col overflow-hidden">
                  <!-- 操作栏 -->
                  <div v-if="assetStore.selectedAssetIds.length > 0" class="px-6 py-3 bg-blue-500/10 border-b border-blue-500/30 flex items-center justify-between">
                    <div class="flex items-center gap-3">
                      <span class="text-sm text-blue-400">
                        已选择 {{ assetStore.selectedAssetIds.length }} 项
                      </span>
                      <button
                        class="text-sm text-gray-400 hover:text-gray-200 transition-colors"
                        @click="assetStore.toggleSelectAll"
                      >
                        {{ assetStore.selectedAssetIds.length === assetStore.currentAssets.length ? '取消全选' : '全选' }}
                      </button>
                    </div>
                    <div class="flex items-center gap-2">
                      <button class="btn-secondary text-sm" @click="handleBatchDownload">
                        <Download :size="16" class="mr-1" />
                        下载
                      </button>
                      <button class="btn-secondary text-sm text-red-400 hover:text-red-300" @click="handleBatchDelete">
                        <Trash2 :size="16" class="mr-1" />
                        删除
                      </button>
                    </div>
                  </div>

                  <!-- 资源显示区 -->
                  <div 
                    class="flex-1 overflow-y-auto scrollbar-thin p-6 relative"
                    :class="{ 'border-2 border-dashed border-blue-500 bg-blue-500/10': isDragging }"
                    @dragover="handleDragOver"
                    @dragleave="handleDragLeave"
                    @drop="handleDrop"
                  >
                    <!-- 拖拽上传提示 -->
                    <div v-if="isDragging" class="absolute inset-0 flex items-center justify-center bg-blue-500/20 z-10">
                      <div class="text-center">
                        <Upload :size="64" class="mx-auto mb-4 text-blue-400" />
                        <p class="text-lg text-blue-400 font-medium">释放文件以上传</p>
                      </div>
                    </div>

                    <!-- 网格视图 -->
                    <div v-if="assetStore.viewMode === 'grid'" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                      <AssetCard
                        v-for="asset in assetStore.currentAssets"
                        :key="asset.id"
                        :asset="asset"
                        :selected="assetStore.selectedAssetIds.includes(asset.id)"
                        @select="assetStore.toggleAssetSelection(asset.id)"
                        @delete="handleDeleteAsset(asset.id)"
                      />
                    </div>

                    <!-- 列表视图 -->
                    <div v-else class="space-y-2">
                      <AssetListItem
                        v-for="asset in assetStore.currentAssets"
                        :key="asset.id"
                        :asset="asset"
                        :selected="assetStore.selectedAssetIds.includes(asset.id)"
                        @select="assetStore.toggleAssetSelection(asset.id)"
                        @delete="handleDeleteAsset(asset.id)"
                      />
                    </div>

                    <!-- 空状态 -->
                    <div v-if="assetStore.currentAssets.length === 0" class="text-center py-20">
                      <FolderOpen :size="64" class="mx-auto mb-4 text-gray-600" />
                      <p class="text-gray-400">暂无素材</p>
                      <p class="text-sm text-gray-500 mb-4">点击上传按钮或拖拽文件到此处添加素材</p>
                      <button class="btn-primary mt-4" @click="handleUpload">
                        <Upload :size="18" class="mr-2" />
                        上传素材
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>

  <!-- 新建文件夹模态框 -->
  <TransitionRoot appear :show="showNewFolderModal" as="template">
    <Dialog as="div" @close="cancelCreateFolder" class="relative z-50">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black bg-opacity-25" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel
              class="w-full max-w-md transform overflow-hidden rounded-2xl bg-gray-800 p-6 text-left align-middle shadow-xl transition-all border border-gray-700"
            >
              <DialogTitle
                as="h3"
                class="text-lg font-medium leading-6 text-gray-50 mb-4"
              >
                新建文件夹
              </DialogTitle>
              
              <div class="mt-2">
                <input
                  ref="newFolderNameInput"
                  v-model="newFolderName"
                  type="text"
                  placeholder="请输入文件夹名称"
                  class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  @keyup.enter="createFolder"
                  @keyup.escape="cancelCreateFolder"
                />
              </div>

              <div class="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  class="inline-flex justify-center rounded-md border border-gray-600 bg-gray-700 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                  @click="cancelCreateFolder"
                >
                  取消
                </button>
                <button
                  type="button"
                  class="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                  @click="createFolder"
                  :disabled="!newFolderName.trim()"
                >
                  创建
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>

  <!-- 隐藏的文件上传input -->
  <input
    ref="fileInput"
    type="file"
    multiple
    accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
    class="hidden"
    @change="handleFileSelect"
  />
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle,
} from '@headlessui/vue'
import { 
  Search, 
  Grid3x3, 
  List, 
  Upload, 
  FolderPlus, 
  X,
  Download,
  Trash2,
  FolderOpen,
  Cloud,
  FileText,
  Image,
  Video,
  Music,
  Folder
} from 'lucide-vue-next'
import { useAssetStore } from '../../../store/asset'
import { useWorkspaceStore } from '../../../store/workspace'
import FolderTree from './AssetManager/FolderTree.vue'
import AssetCard from './AssetManager/AssetCard.vue'
import AssetListItem from './AssetManager/AssetListItem.vue'

const assetStore = useAssetStore()
const workspaceStore = useWorkspaceStore()

// 分类数据
const categories = [
  { id: 'all', name: '我的素材', type: 'all', icon: Folder },
  { id: 'documents', name: '文档素材', type: 'document', icon: FileText },
  { id: 'images', name: '图片素材', type: 'image', icon: Image },
  { id: 'videos', name: '视频素材', type: 'video', icon: Video },
  { id: 'audio', name: '音频素材', type: 'audio', icon: Music }
]

// 当前选中的分类
const selectedCategory = ref('all')

// 新建文件夹模态框
const showNewFolderModal = ref(false)
const newFolderName = ref('')
const newFolderNameInput = ref<HTMLInputElement>()

// 文件上传
const fileInput = ref<HTMLInputElement>()
const isDragging = ref(false)

// 获取分类数量
const getCategoryCount = (type: string) => {
  if (type === 'all') {
    return assetStore.assets.length
  }
  return assetStore.assets.filter(asset => asset.type === type).length
}

// 根据分类过滤资源 (已移除未使用的computed)

// 选择分类
const selectCategory = (categoryId: string) => {
  selectedCategory.value = categoryId
  // 清除文件夹选择，显示分类内容
  assetStore.selectedFolderId = null
}

// 处理上传
const handleUpload = () => {
  fileInput.value?.click()
}

// 处理文件选择
const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target.files
  if (files) {
    handleFiles(Array.from(files))
  }
}

// 处理文件拖拽
const handleDragOver = (event: DragEvent) => {
  event.preventDefault()
  isDragging.value = true
}

const handleDragLeave = (event: DragEvent) => {
  event.preventDefault()
  isDragging.value = false
}

const handleDrop = (event: DragEvent) => {
  event.preventDefault()
  isDragging.value = false
  const files = event.dataTransfer?.files
  if (files) {
    handleFiles(Array.from(files))
  }
}

// 处理文件上传
const handleFiles = (files: File[]) => {
  files.forEach(file => {
    // 确定文件类型
    let type: 'image' | 'video' | 'audio' | 'document' = 'document'
    if (file.type.startsWith('image/')) {
      type = 'image'
    } else if (file.type.startsWith('video/')) {
      type = 'video'
    } else if (file.type.startsWith('audio/')) {
      type = 'audio'
    }

    // 创建新的资源对象
    const newAsset = {
      id: `asset-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: file.name,
      type,
      size: file.size,
      url: URL.createObjectURL(file),
      thumbnail: type === 'image' ? URL.createObjectURL(file) : undefined,
      uploadTime: new Date().toLocaleString(),
      folderId: assetStore.selectedFolderId || undefined,
      tags: []
    }

    // 添加到store
    assetStore.assets.push(newAsset)
  })

  console.log(`成功上传 ${files.length} 个文件`)
}

// 处理新建文件夹
const handleNewFolder = () => {
  showNewFolderModal.value = true
  nextTick(() => {
    newFolderNameInput.value?.focus()
  })
}

// 创建文件夹
const createFolder = () => {
  if (!newFolderName.value.trim()) return

  const newFolder = {
    id: `folder-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name: newFolderName.value.trim(),
    parentId: assetStore.selectedFolderId || '1', // 默认放在"我的素材"下
    children: [],
    assets: []
  }

  // 使用store方法添加文件夹
  assetStore.addFolder(newFolder)
  
  // 重置表单
  newFolderName.value = ''
  showNewFolderModal.value = false
  
  console.log('创建文件夹:', newFolder.name)
}

// 取消创建文件夹
const cancelCreateFolder = () => {
  newFolderName.value = ''
  showNewFolderModal.value = false
}

const handleDeleteAsset = (assetId: string) => {
  if (confirm('确定要删除这个素材吗？')) {
    assetStore.deleteAsset(assetId)
  }
}

const handleBatchDelete = () => {
  if (confirm(`确定要删除选中的 ${assetStore.selectedAssetIds.length} 个素材吗？`)) {
    assetStore.deleteAssets(assetStore.selectedAssetIds)
  }
}

const handleBatchDownload = () => {
  console.log('批量下载', assetStore.selectedAssetIds)
  // TODO: 实现批量下载
}
</script>

