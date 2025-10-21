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
            <div class="space-y-4">
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@headlessui/vue'
import { 
  Video, 
  Music, 
  Image as ImageIcon,
  Upload,
  Folder,
  Play,
  Pause,
  X
} from 'lucide-vue-next'
import { useWorkspaceStore } from '../../../../store/workspace'

const workspaceStore = useWorkspaceStore()

// 拖拽状态
const isDragging = ref(false)

// 文件输入引用
const fileInputRef = ref<HTMLInputElement>()
const audioInputRef = ref<HTMLInputElement>()
const posterInputRef = ref<HTMLInputElement>()

// 已上传文件
const uploadedFiles = ref<any[]>([])

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
      type: file.type.startsWith('video') ? 'video' : 'image'
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

// 切换播放
const togglePlay = (id: string) => {
  if (playingMusic.value === id) {
    playingMusic.value = null
  } else {
    playingMusic.value = id
  }
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
</style>

