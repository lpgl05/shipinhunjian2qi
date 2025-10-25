<template>
  <div class="asset-uploader h-full overflow-y-auto scrollbar-thin p-6 bg-gray-900">
    <div class="max-w-4xl mx-auto space-y-6">
      <!-- 标题 -->
      <div class="mb-8">
        <h3 class="text-2xl font-bold text-gray-50 mb-2">上传创作素材</h3>
        <p class="text-gray-400">添加视频、图片、音乐等素材，开始你的创作</p>
      </div>

      <!-- Tab导航 -->
      <TabGroup>
        <TabList class="flex gap-2 p-1 bg-gray-800 rounded-xl">
          <Tab v-slot="{ selected }" class="flex-1">
            <button
              class="tab-button"
              :class="{ 'active': selected }"
            >
              <Video :size="18" />
              <span>视频/图片</span>
            </button>
          </Tab>
          <Tab v-slot="{ selected }" class="flex-1">
            <button
              class="tab-button"
              :class="{ 'active': selected }"
            >
              <Music :size="18" />
              <span>背景音乐</span>
            </button>
          </Tab>
          <Tab v-slot="{ selected }" class="flex-1">
            <button
              class="tab-button"
              :class="{ 'active': selected }"
            >
              <ImageIcon :size="18" />
              <span>封面海报</span>
            </button>
          </Tab>
        </TabList>

        <TabPanels class="mt-6">
          <!-- 视频/图片标签页 -->
          <TabPanel>
            <div class="space-y-6">
              <!-- 拖拽上传区 -->
              <div
                class="upload-area border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200"
                :class="[
                  isDragging 
                    ? 'border-blue-500 bg-blue-500/10' 
                    : 'border-gray-600 bg-gray-800/50 hover:border-gray-500 hover:bg-gray-800'
                ]"
                @dragover.prevent="isDragging = true"
                @dragleave.prevent="isDragging = false"
                @drop.prevent="handleDrop"
                @click="triggerFileInput"
              >
                <Upload :size="48" class="mx-auto mb-4 text-gray-500" />
                <p class="text-lg font-medium text-gray-300 mb-2">
                  拖拽文件到这里，或点击上传
                </p>
                <p class="text-sm text-gray-500">
                  支持 MP4, MOV, JPG, PNG 格式，单个文件不超过500MB
                </p>
                <input
                  ref="fileInputRef"
                  type="file"
                  multiple
                  accept="video/*,image/*"
                  class="hidden"
                  @change="handleFileSelect"
                />
              </div>

              <!-- 从云盘选择 -->
              <button 
                class="w-full py-3 bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600 transition-all flex items-center justify-center gap-2"
                @click="openAssetModal"
              >
                <Folder :size="20" />
                <span>从AI云盘选择</span>
              </button>

              <!-- 已上传文件列表 -->
              <div v-if="uploadedFiles.length > 0" class="space-y-3">
                <h4 class="text-sm font-semibold text-gray-300">已上传 ({{ uploadedFiles.length }})</h4>
                <div class="grid grid-cols-2 gap-4">
                  <div
                    v-for="file in uploadedFiles"
                    :key="file.id"
                    class="relative group bg-gray-800 rounded-lg p-3 border border-gray-700 hover:border-gray-600 transition-all"
                  >
                    <div class="aspect-video bg-gray-700 rounded-md mb-2 flex items-center justify-center">
                      <Video v-if="file.type === 'video'" :size="32" class="text-gray-500" />
                      <ImageIcon v-else :size="32" class="text-gray-500" />
                    </div>
                    <p class="text-sm text-gray-300 truncate">{{ file.name }}</p>
                    <p class="text-xs text-gray-500">{{ formatFileSize(file.size) }}</p>
                    
                    <!-- 删除按钮 -->
                    <button
                      class="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      @click="removeFile(file.id)"
                    >
                      <X :size="14" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </TabPanel>

          <!-- 背景音乐标签页 -->
          <TabPanel>
            <!-- 子Tab -->
            <TabGroup>
              <TabList class="flex gap-2 mb-4">
                <Tab v-slot="{ selected }" class="flex-1">
                  <button
                    class="w-full px-4 py-2 rounded-lg text-sm font-medium transition-all"
                    :class="selected 
                      ? 'bg-gray-700 text-gray-50' 
                      : 'bg-gray-800 text-gray-400 hover:text-gray-300'"
                  >
                    上传音频
                  </button>
                </Tab>
                <Tab v-slot="{ selected }" class="flex-1">
                  <button
                    class="w-full px-4 py-2 rounded-lg text-sm font-medium transition-all"
                    :class="selected 
                      ? 'bg-gray-700 text-gray-50' 
                      : 'bg-gray-800 text-gray-400 hover:text-gray-300'"
                  >
                    推荐音乐库
                  </button>
                </Tab>
              </TabList>

              <TabPanels>
                <!-- 上传音频子标签页 -->
                <TabPanel>
                  <div
                    class="upload-area border-2 border-dashed border-gray-600 bg-gray-800/50 rounded-xl p-12 text-center hover:border-gray-500 hover:bg-gray-800 transition-all cursor-pointer"
                    @click="triggerAudioInput"
                  >
                    <Music :size="48" class="mx-auto mb-4 text-gray-500" />
                    <p class="text-lg font-medium text-gray-300 mb-2">上传背景音乐</p>
                    <p class="text-sm text-gray-500">支持 MP3, WAV, AAC 格式</p>
                    <input
                      ref="audioInputRef"
                      type="file"
                      accept="audio/*"
                      class="hidden"
                      @change="handleAudioSelect"
                    />
                  </div>
                </TabPanel>

                <!-- 推荐音乐库子标签页 -->
                <TabPanel>
                  <div class="space-y-3">
                    <!-- 音乐资料库按钮 -->
                    <button
                      class="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:brightness-110 transition-all flex items-center justify-center gap-2 font-medium"
                      @click="showMusicLibraryModal = true"
                    >
                      <Music :size="20" />
                      <span>浏览音乐资料库</span>
                    </button>

                    <div
                      v-for="music in recommendedMusic"
                      :key="music.id"
                      class="music-item flex items-center gap-4 p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-all"
                      :class="{ 'ring-2 ring-blue-500': selectedMusic === music.id }"
                    >
                      <!-- 播放按钮 -->
                      <button 
                        class="w-12 h-12 bg-gradient-to-r from-blue-500 to-violet-500 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                        @click="togglePlay(music.id)"
                      >
                        <Play v-if="playingMusic !== music.id" :size="20" class="text-white ml-1" />
                        <Pause v-else :size="20" class="text-white" />
                      </button>

                      <!-- 音乐信息 -->
                      <div class="flex-1">
                        <h5 class="text-sm font-semibold text-gray-50">{{ music.name }}</h5>
                        <p class="text-xs text-gray-400">{{ music.artist }} • {{ music.duration }}</p>
                        <div class="flex gap-2 mt-2">
                          <span
                            v-for="tag in music.tags"
                            :key="tag"
                            class="px-2 py-0.5 bg-gray-700 text-gray-400 text-xs rounded"
                          >
                            {{ tag }}
                          </span>
                        </div>
                      </div>

                      <!-- 选用按钮 -->
                      <button
                        class="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                        :class="selectedMusic === music.id 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'"
                        @click="selectMusic(music.id)"
                      >
                        {{ selectedMusic === music.id ? '已选用' : '选用' }}
                      </button>
                    </div>
                  </div>
                </TabPanel>
              </TabPanels>
            </TabGroup>
          </TabPanel>

          <!-- 封面海报标签页 -->
          <TabPanel>
            <div
              class="upload-area border-2 border-dashed border-gray-600 bg-gray-800/50 rounded-xl p-12 text-center hover:border-gray-500 hover:bg-gray-800 transition-all cursor-pointer"
              @click="triggerPosterInput"
            >
              <ImageIcon :size="48" class="mx-auto mb-4 text-gray-500" />
              <p class="text-lg font-medium text-gray-300 mb-2">上传封面海报</p>
              <p class="text-sm text-gray-500">推荐尺寸 1920x1080，支持 JPG, PNG 格式</p>
              <input
                ref="posterInputRef"
                type="file"
                accept="image/*"
                class="hidden"
                @change="handlePosterSelect"
              />
            </div>
          </TabPanel>
        </TabPanels>
      </TabGroup>

      <!-- 素材预览展示区 -->
      <div v-if="hasUploadedAssets" class="preview-section bg-gray-800 rounded-xl p-6">
        <h4 class="text-lg font-semibold text-gray-200 mb-4 flex items-center gap-2">
          <Eye :size="20" class="text-blue-400" />
          素材预览
        </h4>
        
        <!-- 预览统计 -->
        <div class="grid grid-cols-3 gap-4 mb-6">
          <div class="stat-card">
            <div class="text-2xl font-bold text-blue-400">{{ totalVideoCount }}</div>
            <div class="text-sm text-gray-400">视频素材</div>
          </div>
          <div class="stat-card">
            <div class="text-2xl font-bold text-green-400">{{ totalImageCount }}</div>
            <div class="text-sm text-gray-400">图片素材</div>
          </div>
          <div class="stat-card">
            <div class="text-2xl font-bold text-purple-400">{{ totalAudioCount }}</div>
            <div class="text-sm text-gray-400">音频素材</div>
          </div>
        </div>

        <!-- 预览网格 -->
        <div class="preview-grid grid grid-cols-4 gap-4">
          <!-- 视频预览 -->
          <div 
            v-for="file in uploadedFiles.slice(0, 8)" 
            :key="file.id" 
            class="preview-item bg-gray-700 rounded-lg overflow-hidden group cursor-pointer"
            @click="previewAsset(file)"
          >
            <div class="aspect-video bg-gray-600 flex items-center justify-center">
              <img v-if="file.type === 'image'" :src="file.url" :alt="file.name" class="w-full h-full object-cover" />
              <video v-else-if="file.type === 'video'" :src="file.url" class="w-full h-full object-cover" muted>
                <div class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                  <Play :size="32" class="text-white" />
                </div>
              </video>
            </div>
            <div class="p-2">
              <p class="text-xs text-gray-300 truncate">{{ file.name }}</p>
              <p class="text-xs text-gray-500">{{ (file.size / 1024 / 1024).toFixed(1) }}MB</p>
            </div>
            <!-- 播放按钮 -->
            <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-50">
              <Play v-if="file.type === 'video'" :size="32" class="text-white" />
              <Eye v-else :size="32" class="text-white" />
            </div>
          </div>
          
          <!-- 显示更多按钮 -->
          <div 
            v-if="uploadedFiles.length > 8"
            class="preview-item bg-gray-700 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-600 transition-colors"
            @click="showAllAssets = !showAllAssets"
          >
            <div class="text-center">
              <Plus :size="24" class="text-gray-400 mx-auto mb-2" />
              <p class="text-sm text-gray-400">查看全部</p>
              <p class="text-xs text-gray-500">+{{ uploadedFiles.length - 8 }}</p>
            </div>
          </div>
        </div>

        <!-- 全部素材展示 -->
        <div v-if="showAllAssets" class="mt-6">
          <h5 class="text-md font-medium text-gray-200 mb-3">全部素材 ({{ uploadedFiles.length }})</h5>
          <div class="grid grid-cols-6 gap-3">
            <div 
              v-for="file in uploadedFiles" 
              :key="file.id" 
              class="preview-item-sm bg-gray-700 rounded-lg overflow-hidden cursor-pointer"
              @click="previewAsset(file)"
            >
              <div class="aspect-square bg-gray-600 flex items-center justify-center">
                <img v-if="file.type === 'image'" :src="file.url" :alt="file.name" class="w-full h-full object-cover" />
                <video v-else-if="file.type === 'video'" :src="file.url" class="w-full h-full object-cover" muted></video>
              </div>
              <p class="text-xs text-gray-300 truncate p-1">{{ file.name }}</p>
            </div>
          </div>
        </div>

        <!-- 预览操作按钮 -->
        <div class="flex gap-3 mt-6">
          <button class="btn-primary flex items-center gap-2">
            <Shuffle :size="16" />
            <span>智能排序</span>
          </button>
          <button class="btn-secondary flex items-center gap-2">
            <Download :size="16" />
            <span>批量下载</span>
          </button>
          <button class="btn-secondary flex items-center gap-2">
            <Trash2 :size="16" />
            <span>清空素材</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 音乐资料库模态框 -->
    <MusicLibraryModal
      v-if="showMusicLibraryModal"
      @close="showMusicLibraryModal = false"
      @select="handleMusicSelect"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@headlessui/vue'
import { 
  Video, 
  Music, 
  Image as ImageIcon,
  Upload,
  Folder,
  Play,
  Pause,
  X,
  Eye,
  Plus,
  Shuffle,
  Download,
  Trash2
} from 'lucide-vue-next'
import { useWorkspaceStore } from '../../../../store/workspace'
import MusicLibraryModal from './components/MusicLibraryModal.vue'

const workspaceStore = useWorkspaceStore()

// 拖拽状态
const isDragging = ref(false)

// 文件输入引用
const fileInputRef = ref<HTMLInputElement>()
const audioInputRef = ref<HTMLInputElement>()
const posterInputRef = ref<HTMLInputElement>()

// 已上传文件
const uploadedFiles = ref<any[]>([])
const uploadedAudio = ref<any[]>([])
const uploadedPoster = ref<any | null>(null)

// 推荐音乐
const recommendedMusic = [
  { id: '1', name: '夏日阳光', artist: 'AI Music', duration: '3:24', tags: ['轻快', '活力'] },
  { id: '2', name: '温柔时光', artist: 'AI Music', duration: '2:58', tags: ['抒情', '温馨'] },
  { id: '3', name: '极速前进', artist: 'AI Music', duration: '3:15', tags: ['激昂', '动感'] },
  { id: '4', name: '静谧夜晚', artist: 'AI Music', duration: '4:02', tags: ['舒缓', '放松'] }
]

// 选中的音乐
const selectedMusic = ref<string | null>(null)
const playingMusic = ref<string | null>(null)

// 模态框状态
const showMusicLibraryModal = ref(false)

// 触发文件选择
const triggerFileInput = () => {
  fileInputRef.value?.click()
}

const triggerAudioInput = () => {
  audioInputRef.value?.click()
}

const triggerPosterInput = () => {
  posterInputRef.value?.click()
}

// 处理文件选择
const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target.files
  if (files) {
    handleFiles(Array.from(files))
  }
}

// 处理拖拽放置
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
    const fileData = {
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type.startsWith('video') ? 'video' : 'image',
      url: URL.createObjectURL(file) // 创建预览URL
    }
    uploadedFiles.value.push(fileData)
  })
}

// 处理音频选择
const handleAudioSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target.files
  if (files && files[0]) {
    console.log('选择音频:', files[0].name)
  }
}

// 处理海报选择
const handlePosterSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target.files
  if (files && files[0]) {
    console.log('选择海报:', files[0].name)
  }
}

// 移除文件
const removeFile = (id: number) => {
  const index = uploadedFiles.value.findIndex(f => f.id === id)
  if (index > -1) {
    uploadedFiles.value.splice(index, 1)
  }
}

// 格式化文件大小
const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

// 打开云盘
const openAssetModal = () => {
  workspaceStore.openAssetModal()
}

// 选择音乐
const selectMusic = (id: string) => {
  selectedMusic.value = id
}

// 处理音乐库选中
const handleMusicSelect = (music: any) => {
  // 添加到推荐音乐列表（如果不存在）
  const exists = recommendedMusic.find(m => m.id === music.id)
  if (!exists) {
    recommendedMusic.push({
      id: music.id,
      name: music.name,
      artist: music.artist,
      duration: music.duration,
      tags: [music.category]
    })
  }
  // 选中该音乐
  selectedMusic.value = music.id
  console.log('已选择音乐:', music.name)
}

// 切换播放
const togglePlay = (id: string) => {
  if (playingMusic.value === id) {
    playingMusic.value = null
  } else {
    playingMusic.value = id
  }
}

// 预览相关状态
const showAllAssets = ref(false)

// 计算属性：是否有上传的素材
const hasUploadedAssets = computed(() => {
  return uploadedFiles.value.length > 0 || uploadedAudio.value.length > 0 || uploadedPoster.value !== null
})

// 计算属性：素材统计
const totalVideoCount = computed(() => {
  return uploadedFiles.value.filter(file => file.type === 'video').length
})

const totalImageCount = computed(() => {
  return uploadedFiles.value.filter(file => file.type === 'image').length
})

const totalAudioCount = computed(() => {
  return uploadedAudio.value.length
})

// 预览素材
const previewAsset = (file: any) => {
  console.log('预览素材:', file)
  // 这里可以实现预览逻辑，比如打开预览模态框
}
</script>

<style scoped>
/* Tab按钮样式 */
.tab-button {
  @apply w-full px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-all duration-200;
  @apply text-gray-400 hover:text-gray-300;
}

.tab-button.active {
  @apply bg-gray-700 text-gray-50 shadow-lg;
}

/* 上传区域样式 */
.upload-area {
  cursor: pointer;
}

/* 音乐项样式 */
.music-item {
  position: relative;
}

/* 滚动条 */
.scrollbar-thin::-webkit-scrollbar {
  width: 6px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background: #4B5563;
  border-radius: 3px;
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: #6B7280;
}

/* 预览相关样式 */
.stat-card {
  @apply bg-gray-700 rounded-lg p-4 text-center;
}

.preview-item {
  @apply relative transition-all duration-200 hover:scale-105;
}

.preview-item-sm {
  @apply relative transition-all duration-200 hover:scale-105;
}

.preview-grid {
  @apply gap-4;
}
</style>

