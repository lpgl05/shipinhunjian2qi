<template>
  <div class="ai-cloud-drive h-full flex flex-col bg-gray-900">
    <!-- 顶部搜索栏 -->
    <div class="search-header bg-gray-800 border-b border-gray-700 px-6 py-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4 flex-1">
          <div class="relative flex-1 max-w-md">
            <Search :size="20" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="搜索文件和文件夹"
              v-model="searchQuery"
              class="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-50 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        
        <div class="flex items-center gap-4">
          <span class="text-sm text-gray-400">168.1 MB / 1.0 GB</span>
          <button class="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
            升级
          </button>
        </div>
      </div>
    </div>

    <!-- 主内容区 -->
    <div class="flex-1 flex overflow-hidden">
      <!-- 左侧导航 -->
      <div class="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
        <!-- 导航菜单 -->
        <div class="p-4">
          <h3 class="text-sm font-semibold text-gray-300 mb-3">分类浏览</h3>
          <nav class="space-y-1">
            <button
              v-for="category in categories"
              :key="category.id"
              @click="selectCategory(category.id)"
              class="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors"
              :class="selectedCategory === category.id 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'"
            >
              <component :is="category.icon" :size="16" />
              <span>{{ category.name }}</span>
              <span class="ml-auto text-xs">{{ category.count }}</span>
            </button>
          </nav>
        </div>

        <!-- 文件夹树 -->
        <div class="flex-1 p-4 border-t border-gray-700">
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-sm font-semibold text-gray-300">文件夹</h3>
            <button
              @click="showNewFolderModal = true"
              class="p-1 text-gray-400 hover:text-gray-200 hover:bg-gray-700 rounded transition-colors"
              title="新建文件夹"
            >
              <FolderPlus :size="14" />
            </button>
          </div>
          <div class="space-y-1">
            <button
              v-for="folder in folders"
              :key="folder.id"
              @click="selectFolder(folder.id)"
              class="w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded hover:bg-gray-700 transition-colors"
              :class="selectedFolder === folder.id ? 'text-blue-400' : 'text-gray-400 hover:text-gray-200'"
            >
              <Folder :size="14" />
              <span class="truncate">{{ folder.name }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- 右侧文件列表 -->
      <div class="flex-1 flex flex-col">
        <!-- 工具栏 -->
        <div class="toolbar bg-gray-800 border-b border-gray-700 px-6 py-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <h2 class="text-lg font-semibold text-gray-50">
                {{ getCurrentCategoryName() }}
              </h2>
              <div class="flex items-center gap-2">
                <button 
                  @click="showNewFolderModal = true"
                  class="px-3 py-1.5 bg-gray-700 text-gray-300 text-sm rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
                >
                  <FolderPlus :size="14" />
                  新建文件夹
                </button>
                <button 
                  @click="triggerFileUpload"
                  class="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Upload :size="14" />
                  上传文件
                </button>
                <button class="px-3 py-1.5 bg-gray-700 text-gray-300 text-sm rounded-lg hover:bg-gray-600 transition-colors">
                  回收站
                </button>
              </div>
            </div>
            
            <!-- 视图切换 -->
            <div class="flex items-center gap-2">
              <button
                class="p-2 rounded-lg transition-colors"
                :class="viewMode === 'grid' ? 'bg-gray-700 text-gray-50' : 'text-gray-400 hover:text-gray-200'"
                @click="viewMode = 'grid'"
              >
                <Grid3X3 :size="18" />
              </button>
              <button
                class="p-2 rounded-lg transition-colors"
                :class="viewMode === 'list' ? 'bg-gray-700 text-gray-50' : 'text-gray-400 hover:text-gray-200'"
                @click="viewMode = 'list'"
              >
                <List :size="18" />
              </button>
            </div>
          </div>
        </div>

        <!-- 拖拽上传区域 -->
        <div
          v-if="isDragging"
          class="absolute inset-0 bg-blue-500/20 border-2 border-dashed border-blue-500 flex items-center justify-center z-50"
          @dragover.prevent
          @drop.prevent="handleFileDrop"
          @dragleave.prevent="isDragging = false"
        >
          <div class="text-center">
            <Upload :size="48" class="mx-auto mb-4 text-blue-400" />
            <p class="text-lg font-medium text-blue-400">释放文件以上传</p>
            <p class="text-sm text-gray-300">支持文档、图片、视频、音频文件</p>
          </div>
        </div>

        <!-- 最近文件 -->
        <div v-if="selectedCategory === 'recent'" class="recent-files p-6">
          <div class="flex items-center gap-2 mb-4">
            <h3 class="text-md font-semibold text-gray-200">最近文件</h3>
            <ChevronUp :size="16" class="text-gray-400" />
          </div>
          
          <div class="flex gap-4 overflow-x-auto scrollbar-thin">
            <div
              v-for="file in recentFiles"
              :key="file.id"
              class="flex-shrink-0 w-32 cursor-pointer group"
            >
              <div class="aspect-video bg-gray-800 rounded-lg mb-2 overflow-hidden">
                <img v-if="file.type === 'image'" :src="file.thumbnail" :alt="file.name" class="w-full h-full object-cover" />
                <video v-else-if="file.type === 'video'" :src="file.thumbnail" class="w-full h-full object-cover" muted>
                  <div class="absolute inset-0 flex items-center justify-center">
                    <Play :size="24" class="text-white" />
                  </div>
                </video>
                <div v-else class="w-full h-full flex items-center justify-center">
                  <FileText :size="24" class="text-gray-500" />
                </div>
              </div>
              <p class="text-xs text-gray-400 truncate">{{ file.name }}</p>
            </div>
          </div>
        </div>

        <!-- 文件列表 -->
        <div class="flex-1 p-6 overflow-y-auto scrollbar-thin">
          <!-- 列表视图 -->
          <div v-if="viewMode === 'list'" class="space-y-1">
            <div class="grid grid-cols-12 gap-4 px-4 py-2 text-sm font-medium text-gray-400 border-b border-gray-700">
              <div class="col-span-6">名称</div>
              <div class="col-span-2">大小</div>
              <div class="col-span-3">修改时间</div>
              <div class="col-span-1"></div>
            </div>
            
            <div
              v-for="file in filteredFiles"
              :key="file.id"
              class="grid grid-cols-12 gap-4 px-4 py-3 hover:bg-gray-800 rounded-lg transition-colors cursor-pointer group"
              @click="selectFile(file)"
            >
              <div class="col-span-6 flex items-center gap-3">
                <div class="flex-shrink-0">
                  <Folder v-if="file.type === 'folder'" :size="20" class="text-blue-400" />
                  <Play v-else-if="file.type === 'video'" :size="20" class="text-red-400" />
                  <Image v-else-if="file.type === 'image'" :size="20" class="text-green-400" />
                  <Music v-else-if="file.type === 'audio'" :size="20" class="text-purple-400" />
                  <FileText v-else :size="20" class="text-gray-400" />
                </div>
                <span class="text-gray-200 truncate">{{ file.name }}</span>
              </div>
              <div class="col-span-2 text-gray-400">{{ file.size || '--' }}</div>
              <div class="col-span-3 text-gray-400">{{ file.modifiedTime }}</div>
              <div class="col-span-1 flex justify-end">
                <button class="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-gray-200 transition-all">
                  <MoreVertical :size="16" />
                </button>
              </div>
            </div>
          </div>

          <!-- 网格视图 -->
          <div v-else class="grid grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
            <div
              v-for="file in filteredFiles"
              :key="file.id"
              class="file-card bg-gray-800 rounded-lg p-3 hover:bg-gray-700 transition-colors cursor-pointer group"
              @click="selectFile(file)"
            >
              <div class="aspect-square bg-gray-700 rounded-lg mb-2 flex items-center justify-center">
                <Folder v-if="file.type === 'folder'" :size="32" class="text-blue-400" />
                <Play v-else-if="file.type === 'video'" :size="32" class="text-red-400" />
                <Image v-else-if="file.type === 'image'" :size="32" class="text-green-400" />
                <Music v-else-if="file.type === 'audio'" :size="32" class="text-purple-400" />
                <FileText v-else :size="32" class="text-gray-400" />
              </div>
              <p class="text-xs text-gray-300 truncate text-center">{{ file.name }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 隐藏的文件输入 -->
    <input
      ref="fileInputRef"
      type="file"
      multiple
      accept="*/*"
      class="hidden"
      @change="handleFileSelect"
    />

    <!-- 新建文件夹模态框 -->
    <div v-if="showNewFolderModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-gray-800 rounded-lg p-6 w-96">
        <h3 class="text-lg font-semibold text-gray-50 mb-4">新建文件夹</h3>
        <input
          v-model="newFolderName"
          type="text"
          placeholder="请输入文件夹名称"
          class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-50 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-4"
          @keyup.enter="createNewFolder"
        />
        <div class="flex justify-end gap-3">
          <button
            @click="showNewFolderModal = false"
            class="px-4 py-2 text-gray-400 hover:text-gray-200 transition-colors"
          >
            取消
          </button>
          <button
            @click="createNewFolder"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            :disabled="!newFolderName.trim()"
          >
            创建
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { 
  Search,
  Folder,
  FolderPlus,
  Play,
  Image,
  FileText,
  Music,
  Upload,
  Grid3X3,
  List,
  ChevronUp,
  MoreVertical
} from 'lucide-vue-next'

interface FileItem {
  id: string
  name: string
  type: 'folder' | 'video' | 'image' | 'document' | 'audio'
  size?: string
  modifiedTime: string
  thumbnail?: string
  category: string
  folderId?: string
}

interface Category {
  id: string
  name: string
  icon: any
  count: number
}

interface FolderItem {
  id: string
  name: string
  category?: string
}

// 搜索查询
const searchQuery = ref('')
const viewMode = ref<'grid' | 'list'>('list')
const selectedCategory = ref('all')
const selectedFolder = ref<string | null>(null)
const isDragging = ref(false)
const showNewFolderModal = ref(false)
const newFolderName = ref('')

// 文件输入引用
const fileInputRef = ref<HTMLInputElement>()

// 分类列表 - 添加音频分类
const categories = ref<Category[]>([
  { id: 'all', name: '所有文件', icon: Folder, count: 156 },
  { id: 'recent', name: '最近文件', icon: FileText, count: 12 },
  { id: 'document', name: '文档', icon: FileText, count: 34 },
  { id: 'image', name: '图片', icon: Image, count: 67 },
  { id: 'video', name: '视频', icon: Play, count: 45 },
  { id: 'audio', name: '音频', icon: Music, count: 23 }
])

// 文件夹列表
const folders = ref<FolderItem[]>([
  { id: '1', name: 'video_project', category: 'video' },
  { id: '2', name: 'presentations', category: 'document' },
  { id: '3', name: 'assets', category: 'image' },
  { id: '4', name: 'templates', category: 'document' },
  { id: '5', name: 'music_library', category: 'audio' }
])

// 最近文件
const recentFiles = ref<FileItem[]>([
  { id: '1', name: 'o(67).mp4', type: 'video', modifiedTime: '今天 14:30', thumbnail: '/assets/thumbnails/video1.jpg', category: 'video' },
  { id: '2', name: 'video_1752466...', type: 'video', modifiedTime: '今天 12:15', thumbnail: '/assets/thumbnails/video2.jpg', category: 'video' },
  { id: '3', name: '20250519_TZO...', type: 'document', modifiedTime: '昨天 16:20', category: 'document' },
  { id: '4', name: 'project_implem...', type: 'document', modifiedTime: '昨天 10:45', category: 'document' }
])

// 文件列表 - 添加音频文件示例
const files = ref<FileItem[]>([
  { id: '1', name: 'video_project', type: 'folder', modifiedTime: '9月21日 22:38', category: 'all', folderId: '1' },
  { id: '2', name: 'presentations', type: 'folder', modifiedTime: '9月3日 19:01', category: 'all', folderId: '2' },
  { id: '3', name: 'demo_video.mp4', type: 'video', size: '15.2 MB', modifiedTime: '今天 14:30', category: 'video', folderId: '1' },
  { id: '4', name: 'thumbnail.jpg', type: 'image', size: '2.1 MB', modifiedTime: '今天 12:15', category: 'image', folderId: '1' },
  { id: '5', name: 'script.docx', type: 'document', size: '156 KB', modifiedTime: '昨天 16:20', category: 'document', folderId: '2' },
  { id: '6', name: 'background_music.mp3', type: 'audio', size: '4.5 MB', modifiedTime: '今天 10:30', category: 'audio', folderId: '5' },
  { id: '7', name: 'voice_over.wav', type: 'audio', size: '8.2 MB', modifiedTime: '昨天 15:45', category: 'audio', folderId: '5' }
])

// 过滤后的文件列表
const filteredFiles = computed(() => {
  let result = files.value

  // 按分类过滤
  if (selectedCategory.value !== 'all' && selectedCategory.value !== 'recent') {
    result = result.filter(file => file.category === selectedCategory.value)
  }

  // 按文件夹过滤
  if (selectedFolder.value) {
    result = result.filter(file => file.folderId === selectedFolder.value)
  }

  // 按搜索查询过滤
  if (searchQuery.value) {
    result = result.filter(file => 
      file.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  return result
})

// 获取当前分类名称
const getCurrentCategoryName = () => {
  if (selectedFolder.value) {
    const folder = folders.value.find(f => f.id === selectedFolder.value)
    return folder ? folder.name : '所有文件'
  }
  const category = categories.value.find(c => c.id === selectedCategory.value)
  return category ? category.name : '所有文件'
}

// 选择分类
const selectCategory = (categoryId: string) => {
  selectedCategory.value = categoryId
  selectedFolder.value = null
}

// 选择文件夹
const selectFolder = (folderId: string) => {
  selectedFolder.value = folderId
  selectedCategory.value = 'all'
}

// 选择文件
const selectFile = (file: FileItem) => {
  console.log('选择文件:', file)
  // 这里可以实现文件选择逻辑
}

// 触发文件上传
const triggerFileUpload = () => {
  fileInputRef.value?.click()
}

// 处理文件选择
const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const selectedFiles = target.files
  if (selectedFiles) {
    handleFiles(Array.from(selectedFiles))
  }
}

// 处理拖拽上传
const handleFileDrop = (event: DragEvent) => {
  isDragging.value = false
  const droppedFiles = event.dataTransfer?.files
  if (droppedFiles) {
    handleFiles(Array.from(droppedFiles))
  }
}

// 处理文件上传
const handleFiles = (uploadedFiles: File[]) => {
  uploadedFiles.forEach(file => {
    const fileType = getFileType(file.type, file.name)
    const newFile: FileItem = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name: file.name,
      type: fileType,
      size: formatFileSize(file.size),
      modifiedTime: '刚刚',
      category: fileType as 'audio' | 'video' | 'image' | 'document',
      folderId: selectedCategory.value !== 'all' && selectedCategory.value !== 'recent' ? 
        folders.value.find(f => f.category === selectedCategory.value)?.id : undefined
    }
    
    files.value.unshift(newFile)
    
    // 更新分类计数
    const categoryIndex = categories.value.findIndex(c => c.id === fileType)
    if (categoryIndex !== -1) {
      const category = categories.value[categoryIndex]
      if (category) {
        category.count++
      }
    }
    const allIndex = categories.value.findIndex(c => c.id === 'all')
    if (allIndex !== -1) {
      const allCategory = categories.value[allIndex]
      if (allCategory) {
        allCategory.count++
      }
    }
  })
  
  console.log('上传文件:', uploadedFiles.map(f => f.name))
}

// 获取文件类型
const getFileType = (mimeType: string, fileName: string): 'video' | 'image' | 'document' | 'audio' => {
  if (mimeType.startsWith('video/')) return 'video'
  if (mimeType.startsWith('image/')) return 'image'
  if (mimeType.startsWith('audio/')) return 'audio'
  
  // 根据文件扩展名判断
  const extension = fileName.split('.').pop()?.toLowerCase()
  if (['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'].includes(extension || '')) return 'video'
  if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'].includes(extension || '')) return 'image'
  if (['mp3', 'wav', 'flac', 'aac', 'ogg', 'm4a'].includes(extension || '')) return 'audio'
  
  return 'document'
}

// 格式化文件大小
const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

// 创建新文件夹
const createNewFolder = () => {
  if (!newFolderName.value.trim()) return
  
  const newFolder: FolderItem = {
    id: Date.now().toString(),
    name: newFolderName.value.trim(),
    category: selectedCategory.value !== 'all' && selectedCategory.value !== 'recent' ? selectedCategory.value : undefined
  }
  
  folders.value.push(newFolder)
  
  // 同时添加到文件列表中
  const folderFile: FileItem = {
    id: newFolder.id,
    name: newFolder.name,
    type: 'folder',
    modifiedTime: '刚刚',
    category: 'all',
    folderId: newFolder.id
  }
  
  files.value.unshift(folderFile)
  
  // 重置模态框
  showNewFolderModal.value = false
  newFolderName.value = ''
  
  console.log('创建文件夹:', newFolder.name)
}

// 监听拖拽事件
document.addEventListener('dragover', (e) => {
  e.preventDefault()
  isDragging.value = true
})

document.addEventListener('dragleave', (e) => {
  if (!e.relatedTarget) {
    isDragging.value = false
  }
})
</script>

<style scoped>
/* 自定义滚动条 */
.scrollbar-thin::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background: #1F2937;
  border-radius: 3px;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background: #4B5563;
  border-radius: 3px;
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: #6B7280;
}

.file-card {
  transition: all 0.2s ease;
}

.file-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}
</style>
