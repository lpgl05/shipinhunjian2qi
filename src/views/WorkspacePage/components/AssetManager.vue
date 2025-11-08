<template>
  <TransitionRoot :show="workspaceStore.isAssetModalOpen" as="template">
    <Dialog as="div" class="relative z-50">
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
        <div class="fixed inset-0 bg-black/90 backdrop-blur-sm" @click="workspaceStore.closeAssetModal" />
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
            <DialogPanel class="w-full max-w-7xl h-[85vh] transform overflow-hidden rounded-2xl bg-gray-800 border border-gray-700 shadow-2xl transition-all flex flex-col" @click.stop>
              <!-- 顶部工具栏 -->
              <div class="flex items-center justify-between px-4 py-3 border-b border-gray-700">
                <DialogTitle class="text-lg font-bold text-gray-50 flex items-center gap-2 whitespace-nowrap">
                  <Cloud :size="20" class="text-blue-400" />
                  <span>AI云盘</span>
                </DialogTitle>

                <div class="flex items-center gap-2 flex-wrap">
                  <!-- 搜索框 -->
                  <div class="relative">
                    <Search :size="16" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      v-model="assetStore.searchQuery"
                      type="text"
                      placeholder="搜索素材..."
                      class="input-primary pl-9 pr-3 py-1.5 w-56 text-sm"
                    />
                  </div>

                  <!-- 标签筛选 -->
                  <div class="relative">
                    <select
                      v-model="assetStore.selectedTag"
                      class="bg-gray-700 border border-gray-600 text-gray-300 text-xs rounded-lg pl-2.5 pr-7 py-1.5 appearance-none cursor-pointer hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 whitespace-nowrap"
                    >
                      <option value="">所有标签</option>
                      <option v-for="tag in assetStore.availableTags" :key="tag" :value="tag">
                        {{ tag }}
                      </option>
                    </select>
                  </div>

                  <!-- 视图切换 -->
                  <div class="flex gap-0.5 p-0.5 bg-gray-700 rounded-lg">
                    <button
                      class="p-1.5 rounded transition-colors"
                      :class="assetStore.viewMode === 'grid' ? 'bg-gray-600 text-gray-50' : 'text-gray-400 hover:text-gray-300'"
                      @click="assetStore.viewMode = 'grid'"
                      title="网格视图"
                    >
                      <Grid3x3 :size="16" />
                    </button>
                    <button
                      class="p-1.5 rounded transition-colors"
                      :class="assetStore.viewMode === 'list' ? 'bg-gray-600 text-gray-50' : 'text-gray-400 hover:text-gray-300'"
                      @click="assetStore.viewMode = 'list'"
                      title="列表视图"
                    >
                      <List :size="16" />
                    </button>
                  </div>

                  <!-- 上传按钮 -->
                  <button class="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-500 to-violet-500 text-white text-xs font-medium rounded-lg hover:brightness-110 transition-all whitespace-nowrap" @click="handleUpload">
                    <Upload :size="14" />
                    <span>上传</span>
                  </button>

                  <!-- 新建文件夹按钮 -->
                  <button class="flex items-center gap-1.5 px-3 py-1.5 bg-gray-700 text-gray-200 text-xs font-medium rounded-lg border border-gray-600 hover:bg-gray-600 transition-all whitespace-nowrap" @click="handleNewFolder">
                    <FolderPlus :size="14" />
                    <span>新建文件夹</span>
                  </button>

                  <!-- AI打标按钮 -->
                  <button 
                    class="flex items-center gap-1.5 px-3 py-1.5 bg-gray-700 text-gray-200 text-xs font-medium rounded-lg border border-gray-600 hover:bg-gray-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap" 
                    @click="handleAITagging"
                    :disabled="assetStore.selectedAssetIds.length === 0"
                  >
                    <Sparkles :size="14" />
                    <span>AI打标</span>
                  </button>

                  <!-- 生成高光时刻按钮 -->
                  <button 
                    class="flex items-center gap-1.5 px-3 py-1.5 bg-orange-600 text-white text-xs font-medium rounded-lg hover:bg-orange-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap" 
                    @click="handleGenerateHighlights"
                    :disabled="!hasSelectedVideos"
                  >
                    <Video :size="14" />
                    <span>生成高光时刻</span>
                  </button>

                  <!-- AI视频处理按钮 -->
                  <button 
                    class="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 text-white text-xs font-medium rounded-lg hover:bg-purple-700 transition-all whitespace-nowrap" 
                    @click="handleVideoProcessing"
                  >
                    <Video :size="14" />
                    <span>AI视频处理</span>
                  </button>

                  <!-- 关闭按钮 -->
                  <button class="text-gray-400 p-1.5 rounded-lg hover:text-gray-50 hover:bg-gray-700 transition-all" @click="workspaceStore.closeAssetModal">
                    <X :size="18" />
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
                      <button class="flex items-center gap-1.5 px-3 py-1.5 bg-gray-700 text-gray-200 text-xs font-medium rounded-lg border border-gray-600 hover:bg-gray-600 transition-all whitespace-nowrap" @click="handleBatchDownload">
                        <Download :size="14" />
                        <span>下载</span>
                      </button>
                      <button class="flex items-center gap-1.5 px-3 py-1.5 bg-gray-700 text-red-400 text-xs font-medium rounded-lg border border-gray-600 hover:bg-gray-600 hover:text-red-300 transition-all whitespace-nowrap" @click="handleBatchDelete">
                        <Trash2 :size="14" />
                        <span>删除</span>
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
                        <Upload :size="48" class="mx-auto mb-4 text-blue-400" />
                        <p class="text-base text-blue-400 font-medium">释放文件以上传</p>
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
                      <FolderOpen :size="48" class="mx-auto mb-4 text-gray-600" />
                      <p class="text-gray-400 mb-2">暂无素材</p>
                      <p class="text-sm text-gray-500 mb-6">点击上传按钮或拖拽文件到此处添加素材</p>
                      <button 
                        class="mx-auto inline-flex flex-col items-center justify-center gap-2 px-8 py-4 bg-gradient-to-br from-blue-600 to-violet-600 text-white rounded-lg hover:from-blue-700 hover:to-violet-700 transition-all shadow-lg hover:shadow-xl"
                        @click="handleUpload"
                      >
                        <Upload :size="24" />
                        <span class="text-sm font-medium">上传素材</span>
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
    <Dialog as="div" class="relative z-50">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black bg-opacity-25" @click="cancelCreateFolder" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto" @click.stop>
        <div class="flex min-h-full items-center justify-center p-4 text-center" @click.stop>
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
              @click.stop
              @mousedown.stop
              @mouseup.stop
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
                  @click.stop
                  @mousedown.stop
                  @mouseup.stop
                  @focus.stop
                  @blur.stop
                />
              </div>

              <div class="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  class="inline-flex justify-center rounded-md border border-gray-600 bg-gray-700 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                  @click.stop="cancelCreateFolder"
                  @mousedown.stop
                  @mouseup.stop
                >
                  取消
                </button>
                <button
                  type="button"
                  class="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                  @click.stop="createFolder"
                  @mousedown.stop
                  @mouseup.stop
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

  <!-- AI打标成功提示模态框 -->
  <TransitionRoot appear :show="showAITaggingSuccess" as="template">
    <Dialog as="div" class="relative z-50">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black bg-opacity-25" @click="handleCloseAITagging" />
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
              <div class="text-center">
                <div class="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full mb-4">
                  <Sparkles :size="32" class="text-green-500" />
                </div>
                <DialogTitle as="h3" class="text-lg font-semibold leading-6 text-gray-50 mb-2">
                  AI打标成功
                </DialogTitle>
                <p class="text-sm text-gray-400 mb-4">
                  已为 {{ aitaggingResult.count }} 个视频成功添加标签
                </p>
                
                <!-- AI生成标签区域 -->
                <div v-if="aitaggingResult.tags && aitaggingResult.tags.length > 0" class="bg-gray-700/50 rounded-lg p-4 mb-4">
                  <p class="text-xs font-semibold text-gray-300 mb-3 text-left" style="font-size: 13px; font-weight: 600;">
                    🤖 AI生成标签：
                  </p>
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="tag in aitaggingResult.tags"
                      :key="tag.name"
                      class="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs"
                    >
                      {{ tag.name }}
                    </span>
                  </div>
                </div>

                <!-- 手工打标签区域 -->
                <div class="mt-4 pt-4 border-t border-gray-600/50">
                  <p class="text-xs font-semibold text-gray-300 mb-3 text-left" style="font-size: 13px; font-weight: 600;">
                    ✏️ 手工打标签：
                  </p>
                  
                  <!-- 显示手动添加的标签 -->
                  <div v-if="manualTags.length > 0" class="flex flex-wrap gap-2 mb-3">
                    <span
                      v-for="tag in manualTags"
                      :key="tag"
                      class="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs cursor-pointer hover:opacity-80"
                      @click="removeManualTag(tag)"
                    >
                      {{ tag }} ×
                    </span>
                  </div>

                  <!-- 输入框区域 -->
                  <div class="flex gap-2 mb-2">
                    <input
                      v-model="manualTagInput"
                      type="text"
                      placeholder="输入标签，多个标签用逗号分隔"
                      class="flex-1 px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                      style="height: 36px;"
                      @keyup.enter="addManualTag"
                    />
                    <button
                      type="button"
                      @click="addManualTag"
                      class="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700 transition-colors"
                      style="height: 36px; min-width: 70px;"
                    >
                      + 添加
                    </button>
                  </div>
                  
                  <p class="text-xs text-gray-500 text-left">
                    💡 提示：多个标签可以用逗号（,）、顿号（、）或中文逗号（，）分隔
                  </p>
                </div>

                <!-- 底部按钮 -->
                <div class="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    class="inline-flex justify-center rounded-lg border border-gray-600 bg-gray-700 px-6 py-2.5 text-sm font-medium text-white hover:bg-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 transition-colors"
                    @click="handleCloseAITagging"
                  >
                    取消
                  </button>
                  <button
                    type="button"
                    class="inline-flex justify-center rounded-lg border border-transparent bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 transition-colors"
                    @click="handleConfirmAITagging"
                  >
                    确定
                  </button>
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>

  <!-- 高光时刻结果展示模态框 -->
  <TransitionRoot appear :show="showHighlightModal" as="template">
    <Dialog as="div" class="relative z-50">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black bg-opacity-25" @click="showHighlightModal = false" />
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
              class="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-gray-800 p-6 text-left align-middle shadow-xl transition-all border border-gray-700"
            >
              <DialogTitle
                as="h3"
                class="text-lg font-medium leading-6 text-gray-50 mb-4 flex items-center justify-between"
              >
                <div class="flex items-center gap-2">
                  <Zap :size="24" class="text-orange-500" />
                  <span>高光时刻分析结果</span>
                </div>
                <button
                  class="text-gray-400 hover:text-gray-200 transition-colors"
                  @click="showHighlightModal = false"
                >
                  <X :size="24" />
                </button>
              </DialogTitle>

              <!-- 分析中状态 -->
              <div v-if="isAnalyzing" class="py-12 text-center">
                <div class="inline-flex items-center justify-center w-16 h-16 bg-orange-500/20 rounded-full mb-4 animate-pulse">
                  <Zap :size="32" class="text-orange-500" />
                </div>
                <p class="text-gray-300 mb-2">正在分析视频中的高光时刻...</p>
                <div class="space-y-2 mt-4">
                  <div 
                    v-for="[videoId, progress] in Array.from(analysisProgress.entries())" 
                    :key="videoId"
                    class="text-sm text-gray-400"
                  >
                    {{ assetStore.assets.find(a => a.id === videoId)?.name }}: {{ Math.floor(progress) }}%
                  </div>
                </div>
              </div>

              <!-- 视频生成成功状态 -->
              <div v-if="generatedVideo && !isAnalyzing" class="space-y-3">
                <div class="text-center py-4">
                  <div class="inline-flex items-center justify-center w-12 h-12 bg-green-500/20 rounded-full mb-3">
                    <CheckCircle2 :size="24" class="text-green-500" />
                  </div>
                  <h3 class="text-lg font-semibold text-green-400 mb-1">视频生成成功！</h3>
                  <p class="text-xs text-gray-400 mb-4">您的视频已保存到历史记录</p>
                  
                  <!-- 视频标题 -->
                  <div class="mb-3 text-left">
                    <p class="text-xs text-gray-400 mb-1">视频标题</p>
                    <p class="text-sm font-medium text-gray-50 truncate">{{ generatedVideo.title }}</p>
                  </div>

                  <!-- 视频预览 -->
                  <div class="bg-black rounded-lg overflow-hidden mb-3 flex justify-center">
                    <video
                      :src="generatedVideo.videoUrl"
                      controls
                      class="w-full"
                      style="max-width: 480px; max-height: 270px;"
                      preload="metadata"
                    >
                      您的浏览器不支持视频播放
                    </video>
                  </div>

                  <!-- 视频信息 -->
                  <div class="flex items-center justify-center gap-4 text-xs text-gray-400 mb-4">
                    <span>时长: {{ formatTime(generatedVideo.duration) }}</span>
                    <span>已保存到历史记录</span>
                  </div>

                  <!-- 操作按钮 -->
                  <div class="flex items-center justify-center gap-3 pt-3 border-t border-gray-700">
                    <button
                      class="px-3 py-1.5 text-sm bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
                      @click="showHighlightModal = false; generatedVideo = null"
                    >
                      关闭
                    </button>
                    <button
                      class="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                      @click="handleViewInHistory"
                    >
                      <Clock :size="14" />
                      <span>查看历史记录</span>
                    </button>
                  </div>
                </div>
              </div>

              <!-- 分析结果 -->
              <div v-else-if="allMoments.length > 0 && !generatedVideo" class="space-y-4">
                <!-- 统计信息 -->
                <div class="bg-gray-700/50 rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <p class="text-sm text-gray-400">共识别到</p>
                    <p class="text-2xl font-bold text-orange-400">{{ allMoments.length }}</p>
                    <p class="text-sm text-gray-400">个高光片段</p>
                  </div>
                  <div class="text-right">
                    <p class="text-sm text-gray-400">已选择</p>
                    <p class="text-2xl font-bold text-blue-400">{{ selectedMoments.size }}</p>
                    <p class="text-sm text-gray-400">个片段</p>
                  </div>
                </div>

                <!-- 片段列表 -->
                <div class="max-h-96 overflow-y-auto scrollbar-thin space-y-2">
                  <div
                    v-for="moment in allMoments"
                    :key="moment.id"
                    class="bg-gray-700/50 rounded-lg p-4 hover:bg-gray-700 transition-colors cursor-pointer"
                    :class="{ 'ring-2 ring-orange-500': selectedMoments.has(moment.id) }"
                    @click="toggleMomentSelection(moment.id)"
                  >
                    <div class="flex items-start gap-4">
                      <!-- 缩略图 -->
                      <div class="relative w-32 h-20 bg-gray-600 rounded overflow-hidden flex-shrink-0">
                        <img 
                          v-if="moment.thumbnail" 
                          :src="moment.thumbnail" 
                          :alt="moment.description"
                          class="w-full h-full object-cover"
                        />
                        <div v-else class="w-full h-full flex items-center justify-center">
                          <Play :size="24" class="text-gray-400" />
                        </div>
                        <div class="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1 rounded">
                          {{ formatTime(moment.duration) }}
                        </div>
                      </div>

                      <!-- 信息 -->
                      <div class="flex-1 min-w-0">
                        <div class="flex items-center justify-between mb-2">
                          <div class="flex items-center gap-2">
                            <span class="text-sm font-semibold text-gray-200">{{ moment.description }}</span>
                            <span class="text-xs px-2 py-0.5 bg-orange-500/20 text-orange-400 rounded">
                              {{ formatTime(moment.startTime) }} - {{ formatTime(moment.endTime) }}
                            </span>
                          </div>
                          <div class="flex items-center gap-2">
                            <span class="text-xs text-gray-400">置信度: {{ Math.floor(moment.confidence * 100) }}%</span>
                            <CheckCircle2 
                              v-if="selectedMoments.has(moment.id)"
                              :size="20" 
                              class="text-orange-500"
                            />
                          </div>
                        </div>
                        <p class="text-xs text-gray-400 truncate">{{ moment.videoName }}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 操作按钮 -->
                <div class="flex items-center justify-between pt-4 border-t border-gray-700">
                  <button
                    class="text-sm text-gray-400 hover:text-gray-200 transition-colors"
                    @click="selectedMoments = new Set(allMoments.map(m => m.id))"
                  >
                    全选
                  </button>
                  <div class="flex gap-3">
                    <button
                      class="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
                      @click="showHighlightModal = false"
                    >
                      取消
                    </button>
                    <button
                      class="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      :disabled="selectedMoments.size === 0 || isMerging"
                      @click="handleMergeHighlights"
                    >
                      <Zap v-if="!isMerging" :size="18" />
                      <span v-if="isMerging">合成中...</span>
                      <span v-else>生成新短视频 ({{ selectedMoments.size }})</span>
                    </button>
                  </div>
                </div>
              </div>

              <!-- 无结果 -->
              <div v-else class="py-12 text-center">
                <p class="text-gray-400">未识别到高光片段</p>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>

  <!-- 视频预览模态框 -->
  <TransitionRoot appear :show="showVideoPreview && generatedVideo" as="template">
    <Dialog as="div" class="relative z-[100]">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black bg-opacity-25" @click="showVideoPreview = false" />
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
              class="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-gray-800 p-6 text-left align-middle shadow-xl transition-all border border-gray-700"
            >
              <DialogTitle
                as="h3"
                class="text-lg font-medium leading-6 text-gray-50 mb-4 flex items-center justify-between"
              >
                <div class="flex items-center gap-2">
                  <div class="inline-flex items-center justify-center w-10 h-10 bg-green-500/20 rounded-full">
                    <CheckCircle2 :size="24" class="text-green-500" />
                  </div>
                  <div>
                    <div class="text-lg font-semibold text-green-400">视频生成成功！</div>
                    <div class="text-xs text-gray-400 mt-0.5">您的视频已保存到历史记录</div>
                  </div>
                </div>
                <button
                  class="text-gray-400 hover:text-gray-200 transition-colors"
                  @click="showVideoPreview = false"
                >
                  <X :size="24" />
                </button>
              </DialogTitle>

              <div v-if="generatedVideo" class="space-y-4">
                <!-- 视频标题 -->
                <div>
                  <p class="text-sm text-gray-400 mb-1">视频标题</p>
                  <p class="text-base font-medium text-gray-50">{{ generatedVideo.title }}</p>
                </div>

                <!-- 视频预览 -->
                <div class="bg-black rounded-lg overflow-hidden">
                  <video
                    :src="generatedVideo.videoUrl"
                    controls
                    class="w-full aspect-video"
                    preload="metadata"
                  >
                    您的浏览器不支持视频播放
                  </video>
                </div>

                <!-- 视频信息 -->
                <div class="flex items-center justify-between text-sm text-gray-400">
                  <div class="flex items-center gap-4">
                    <span>时长: {{ formatTime(generatedVideo.duration) }}</span>
                    <span>已保存到历史记录</span>
                  </div>
                </div>

                <!-- 操作按钮 -->
                <div class="flex items-center justify-end gap-3 pt-4 border-t border-gray-700">
                  <button
                    class="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
                    @click="showVideoPreview = false"
                  >
                    关闭
                  </button>
                  <button
                    class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                    @click="handleViewInHistory"
                  >
                    <Clock :size="16" />
                    <span>查看历史记录</span>
                  </button>
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>

  <!-- 错误提示模态框 -->
  <TransitionRoot appear :show="showErrorModal" as="template">
    <Dialog as="div" class="relative z-50">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black bg-opacity-25" @click="showErrorModal = false" />
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
              <div class="text-center">
                <div class="inline-flex items-center justify-center w-16 h-16 bg-red-500/20 rounded-full mb-4">
                  <AlertCircle :size="32" class="text-red-500" />
                </div>
                <DialogTitle as="h3" class="text-lg font-semibold leading-6 text-gray-50 mb-2">
                  视频合成失败
                </DialogTitle>
                <div class="mt-2">
                  <p class="text-sm text-gray-400 mb-4">错误原因：</p>
                  <p class="text-base text-gray-200 bg-gray-700/50 rounded-lg p-4 text-left">
                    {{ errorMessage }}
                  </p>
                </div>

                <div class="mt-6 flex justify-center">
                  <button
                    type="button"
                    class="inline-flex justify-center rounded-lg border border-transparent bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 transition-colors"
                    @click="showErrorModal = false"
                  >
                    确定
                  </button>
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
import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue'
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
  Folder,
  Sparkles,
  Zap,
  CheckCircle2,
  Play,
  Clock,
  AlertCircle
} from 'lucide-vue-next'
import { useAssetStore } from '../../../store/asset'
import { useWorkspaceStore } from '../../../store/workspace'
import { useHistoryStore } from '../../../store/history'
import { useRouter } from 'vue-router'
import FolderTree from './AssetManager/FolderTree.vue'
import AssetCard from './AssetManager/AssetCard.vue'
import AssetListItem from './AssetManager/AssetListItem.vue'
import { processVideoSmartTag } from '../../../utils/aiTagging'
import { 
  analyzeMultipleVideos, 
  mergeHighlightMoments, 
  formatTime,
  type HighlightMoment,
  type HighlightAnalysisResult
} from '../../../utils/highlightMoments'

const assetStore = useAssetStore()
const workspaceStore = useWorkspaceStore()
const historyStore = useHistoryStore()
const router = useRouter()

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

// AI打标成功提示
const showAITaggingSuccess = ref(false)
const aitaggingResult = ref<{ count: number; tags: Array<{ name: string; score: number; category: string }> }>({
  count: 0,
  tags: []
})

// 手工打标签相关状态
const manualTags = ref<string[]>([])
const manualTagInput = ref('')

// 高光时刻相关状态
const showHighlightModal = ref(false)
const highlightResults = ref<Map<string, HighlightAnalysisResult>>(new Map())
const selectedMoments = ref<Set<string>>(new Set())
const isAnalyzing = ref(false)
const analysisProgress = ref<Map<string, number>>(new Map())
const isMerging = ref(false)

// 视频预览相关状态
const showVideoPreview = ref(false)
const generatedVideo = ref<{
  videoUrl: string
  title: string
  duration: number
  recordId?: string
} | null>(null)

// 错误提示相关状态
const showErrorModal = ref(false)
const errorMessage = ref('')

// 检查是否有选中的视频
const hasSelectedVideos = computed(() => {
  const selectedAssets = assetStore.assets.filter(asset => 
    assetStore.selectedAssetIds.includes(asset.id)
  )
  return selectedAssets.some(asset => asset.type === 'video')
})

// 添加手动标签
const addManualTag = () => {
  if (!manualTagInput.value.trim()) {
    return
  }

  // 按分隔符分割标签
  const tags = manualTagInput.value
    .split(/[,，、]/)
    .map(tag => tag.trim())
    .filter(tag => tag.length > 0)

  // 添加到手动标签列表，去重
  tags.forEach(tag => {
    if (!manualTags.value.includes(tag)) {
      manualTags.value.push(tag)
    }
  })

  manualTagInput.value = ''
}

// 删除手动标签
const removeManualTag = (tag: string) => {
  manualTags.value = manualTags.value.filter(t => t !== tag)
}

// 关闭AI打标弹窗
const handleCloseAITagging = () => {
  manualTags.value = []
  manualTagInput.value = ''
  showAITaggingSuccess.value = false
}

// 确认AI打标，应用标签到视频
const handleConfirmAITagging = () => {
  // 合并AI生成的标签和手动添加的标签
  const allManualTagNames = manualTags.value
  
  // 如果有手动标签，添加到视频的标签中
  if (allManualTagNames.length > 0) {
    const selectedAssets = assetStore.assets.filter(asset => 
      assetStore.selectedAssetIds.includes(asset.id)
    )
    const videoAssets = selectedAssets.filter(asset => asset.type === 'video')
    
    // 为每个视频添加手动标签
    videoAssets.forEach(asset => {
      allManualTagNames.forEach(tagName => {
        if (!asset.tags.includes(tagName)) {
          asset.tags.push(tagName)
        }
      })
    })
  }

  // 重置状态
  manualTags.value = []
  manualTagInput.value = ''
  showAITaggingSuccess.value = false
}

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

// 处理AI打标
const handleAITagging = async () => {
  const selectedAssets = assetStore.assets.filter(asset => 
    assetStore.selectedAssetIds.includes(asset.id)
  )
  
  // 只处理视频文件
  const videoAssets = selectedAssets.filter(asset => asset.type === 'video')
  
  if (videoAssets.length === 0) {
    alert('请选择至少一个视频文件')
    return
  }
  
  // 显示处理中状态
  videoAssets.forEach(asset => {
    assetStore.setAITaggingStatus(asset.id, 'processing')
  })
  
  // 批量处理视频
  let allTags: Array<{ name: string; score: number; category: string }> = []
  for (const asset of videoAssets) {
    try {
      const tags = await processVideoSmartTag(asset.url, asset.id)
      assetStore.addAITags(asset.id, tags)
      console.log('AI打标处理完成:', asset.name, tags)
      
      // 收集所有标签用于显示
      allTags.push(...tags.map(tag => ({
        name: tag.name,
        score: tag.score,
        category: tag.category
      })))
    } catch (error) {
      console.error('AI打标处理失败:', error)
      assetStore.setAITaggingStatus(asset.id, 'failed')
    }
  }
  
  // 显示成功提示
  aitaggingResult.value = {
    count: videoAssets.length,
    tags: [...new Map(allTags.map(tag => [tag.name, tag])).values()].slice(0, 10) // 去重并限制最多显示10个
  }
  showAITaggingSuccess.value = true
}

// 处理生成高光时刻
const handleGenerateHighlights = async () => {
  const selectedAssets = assetStore.assets.filter(asset => 
    assetStore.selectedAssetIds.includes(asset.id)
  )
  
  const videoAssets = selectedAssets.filter(asset => asset.type === 'video')
  
  if (videoAssets.length === 0) {
    alert('请选择至少一个视频文件')
    return
  }
  
  // 重置状态
  highlightResults.value = new Map()
  selectedMoments.value = new Set()
  analysisProgress.value = new Map()
  generatedVideo.value = null // 清空之前的生成结果
  isAnalyzing.value = true
  showHighlightModal.value = true
  
  // 准备视频数据
  const videos = videoAssets.map(asset => ({
    id: asset.id,
    url: asset.url,
    name: asset.name
  }))
  
  try {
    // 批量分析视频
    const results = await analyzeMultipleVideos(
      videos,
      (videoId, progress) => {
        analysisProgress.value.set(videoId, progress)
      }
    )
    
    highlightResults.value = results
  } catch (error) {
    console.error('高光时刻分析失败:', error)
    alert('高光时刻分析失败，请重试')
  } finally {
    isAnalyzing.value = false
  }
}

// 切换片段选择
const toggleMomentSelection = (momentId: string) => {
  if (selectedMoments.value.has(momentId)) {
    selectedMoments.value.delete(momentId)
  } else {
    selectedMoments.value.add(momentId)
  }
}

// 获取所有高光片段
const allMoments = computed(() => {
  const moments: Array<HighlightMoment & { videoId: string; videoName: string }> = []
  highlightResults.value.forEach((result, videoId) => {
    result.moments.forEach(moment => {
      moments.push({
        ...moment,
        videoId,
        videoName: result.videoName
      })
    })
  })
  return moments.sort((a, b) => a.startTime - b.startTime)
})

// 一键生成新视频
const handleMergeHighlights = async () => {
  if (selectedMoments.value.size === 0) {
    alert('请至少选择一个高光片段')
    return
  }
  
  const momentsToMerge = allMoments.value.filter(m => 
    selectedMoments.value.has(m.id)
  )
  
  if (momentsToMerge.length === 0) {
    alert('请至少选择一个高光片段')
    return
  }
  
  isMerging.value = true
  
  try {
    // 获取第一个视频的ID作为源视频ID
    const firstVideoId = momentsToMerge[0].videoId
    
    // 合成视频
    const result = await mergeHighlightMoments(momentsToMerge, firstVideoId)
    
    // 生成标题
    const videoTitle = `高光时刻合集 - ${new Date().toLocaleString()}`
    
    // 保存到历史记录
    const record = historyStore.addRecord({
      type: 'video-mixer',
      agentType: 'video-mixer',
      title: videoTitle,
      status: 'completed',
      thumbnail: momentsToMerge[0].thumbnail,
      metadata: {
        source: 'highlight-moments',
        moments: momentsToMerge.map(m => ({
          id: m.id,
          startTime: m.startTime,
          endTime: m.endTime,
          description: m.description
        })),
        videoUrl: result.videoUrl,
        duration: result.duration
      }
    })
    
    // 设置视频数据（在高光时刻模态框中直接显示）
    generatedVideo.value = {
      videoUrl: result.videoUrl,
      title: videoTitle,
      duration: result.duration,
      recordId: record.id
    }
    
    console.log('✅ 视频生成成功', {
      videoUrl: result.videoUrl,
      title: videoTitle,
      duration: result.duration,
      hasGeneratedVideo: !!generatedVideo.value
    })
    
    // 重置选择状态（但不重置 generatedVideo 和 highlightResults，因为预览需要它们）
    selectedMoments.value = new Set()
    
    // 保持高光时刻模态框打开，直接在其中显示成功提示和视频预览
  } catch (error) {
    console.error('视频合成失败:', error)
    
    // 显示具体错误信息
    errorMessage.value = error instanceof Error 
      ? error.message 
      : '视频合成失败，请重试'
    
    showErrorModal.value = true
  } finally {
    isMerging.value = false
  }
}

// 查看历史记录
const handleViewInHistory = () => {
  showVideoPreview.value = false
  workspaceStore.closeAssetModal()
  router.push('/history')
}

// 处理AI视频处理
const handleVideoProcessing = () => {
  const selectedAssetsList = assetStore.assets.filter(a => assetStore.selectedAssetIds.includes(a.id))
  const firstVideo = selectedAssetsList.find(a => a.type === 'video')
  if (!firstVideo) {
    alert('请在云盘中选择一个视频素材后再进行AI处理。')
    return
  }
  // 打开视频处理模态框并携带选中视频ID
  workspaceStore.openVideoProcessorWithAsset(firstVideo.id)
  // 为避免双层模态叠加影响交互，打开处理器时关闭云盘模态
  workspaceStore.closeAssetModal()
}

// 键盘事件处理
const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    if (showNewFolderModal.value) {
      cancelCreateFolder()
    } else if (workspaceStore.isAssetModalOpen) {
      workspaceStore.closeAssetModal()
    }
  }
}

// 添加和移除键盘事件监听器
onMounted(() => {
  document.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown)
})
</script>

