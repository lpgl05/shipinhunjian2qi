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
                <!-- 左侧文件夹树 -->
                <div class="w-64 border-r border-gray-700 bg-gray-850 overflow-y-auto scrollbar-thin">
                  <div class="p-4">
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
                  <div class="flex-1 overflow-y-auto scrollbar-thin p-6">
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
</template>

<script setup lang="ts">
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
  Cloud
} from 'lucide-vue-next'
import { useAssetStore } from '../../../store/asset'
import { useWorkspaceStore } from '../../../store/workspace'
import FolderTree from './AssetManager/FolderTree.vue'
import AssetCard from './AssetManager/AssetCard.vue'
import AssetListItem from './AssetManager/AssetListItem.vue'

const assetStore = useAssetStore()
const workspaceStore = useWorkspaceStore()

const handleUpload = () => {
  console.log('打开上传对话框')
  // TODO: 实现文件上传
}

const handleNewFolder = () => {
  console.log('创建新文件夹')
  // TODO: 实现新建文件夹
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

