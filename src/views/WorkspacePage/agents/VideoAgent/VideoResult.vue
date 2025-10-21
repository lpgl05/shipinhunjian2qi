<template>
  <div class="video-result h-full flex flex-col bg-gray-900">
    <!-- 顶部操作栏 -->
    <div class="top-action-bar flex items-center justify-between px-6 py-4 border-b border-gray-700 bg-gray-800">
      <div class="flex items-center gap-2">
        <div class="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
          <Check :size="20" class="text-white" />
        </div>
        <div>
          <h3 class="text-lg font-semibold text-gray-50">创作完成</h3>
          <p class="text-xs text-gray-400">共生成 {{ videos.length }} 个视频</p>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <!-- 视图切换 -->
        <div class="flex bg-gray-700 rounded-lg p-1">
          <button
            class="px-3 py-1.5 rounded-md text-sm font-medium transition-all"
            :class="viewMode === 'grid' ? 'bg-gray-600 text-gray-50' : 'text-gray-400 hover:text-gray-300'"
            @click="viewMode = 'grid'"
          >
            <Grid3X3 :size="16" class="inline mr-1" />
            网格
          </button>
          <button
            class="px-3 py-1.5 rounded-md text-sm font-medium transition-all"
            :class="viewMode === 'list' ? 'bg-gray-600 text-gray-50' : 'text-gray-400 hover:text-gray-300'"
            @click="viewMode = 'list'"
          >
            <List :size="16" class="inline mr-1" />
            列表
          </button>
        </div>

        <!-- 返回修改 -->
        <button
          class="px-5 py-2 bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600 transition-all flex items-center gap-2"
          @click="$emit('backToEdit')"
        >
          <Edit :size="18" />
          <span>返回修改</span>
        </button>

        <!-- 一键下载全部 -->
        <button
          class="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-violet-500 text-white rounded-lg font-medium hover:brightness-110 transform hover:scale-105 active:scale-95 transition-all duration-200 flex items-center gap-2"
          @click="downloadAll"
        >
          <Download :size="18" />
          <span>下载全部</span>
        </button>
      </div>
    </div>

    <!-- 视频展示区域 -->
    <div class="flex-1 p-6 overflow-hidden">
      <!-- 网格视图 -->
      <div v-if="viewMode === 'grid'" class="h-full overflow-y-auto scrollbar-thin">
        <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          <div
            v-for="(video, index) in videos"
            :key="video.id"
            class="video-card bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-gray-600 transition-all cursor-pointer group"
            @click="selectVideo(video)"
          >
            <!-- 视频预览 -->
            <div class="aspect-video bg-black relative">
              <video
                :src="video.url"
                class="w-full h-full object-cover"
                muted
                @mouseenter="playVideo(video, $event)"
                @mouseleave="pauseVideo($event)"
              >
                您的浏览器不支持视频播放
              </video>
              
              <!-- 播放按钮 -->
              <div class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 group-hover:bg-opacity-50 transition-all">
                <Play :size="32" class="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              
              <!-- 视频编号 -->
              <div class="absolute top-3 left-3 px-2 py-1 bg-black bg-opacity-70 text-white text-xs rounded-full">
                视频 {{ index + 1 }}
              </div>
              
              <!-- 时长 -->
              <div class="absolute bottom-3 right-3 px-2 py-1 bg-black bg-opacity-70 text-white text-xs rounded-full">
                {{ video.duration }}
              </div>
            </div>

            <!-- 视频信息 -->
            <div class="p-4">
              <h4 class="text-md font-semibold text-gray-50 mb-2 truncate">{{ video.title }}</h4>
              <div class="flex items-center justify-between text-sm text-gray-400 mb-3">
                <span>{{ video.resolution }}</span>
                <span>{{ video.size }}</span>
              </div>
              
              <!-- 操作按钮 -->
              <div class="flex gap-2">
                <button
                  class="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-1"
                  @click.stop="downloadVideo(video)"
                >
                  <Download :size="14" />
                  <span>下载</span>
                </button>
                <button
                  class="px-3 py-2 bg-gray-700 text-gray-300 text-sm rounded-lg hover:bg-gray-600 transition-colors"
                  @click.stop="shareVideo(video)"
                >
                  <Share2 :size="14" />
                </button>
                <button
                  class="px-3 py-2 bg-gray-700 text-gray-300 text-sm rounded-lg hover:bg-gray-600 transition-colors"
                  @click.stop="deleteVideo(video.id)"
                >
                  <Trash2 :size="14" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 列表视图 -->
      <div v-else class="h-full overflow-y-auto scrollbar-thin">
        <div class="space-y-3">
          <div
            v-for="(video, index) in videos"
            :key="video.id"
            class="video-list-item bg-gray-800 rounded-lg border border-gray-700 hover:border-gray-600 transition-all cursor-pointer group"
            @click="selectVideo(video)"
          >
            <div class="flex items-center gap-4 p-4">
              <!-- 视频缩略图 -->
              <div class="w-24 h-16 bg-black rounded-lg overflow-hidden flex-shrink-0">
                <video
                  :src="video.url"
                  class="w-full h-full object-cover"
                  muted
                >
                  您的浏览器不支持视频播放
                </video>
              </div>

              <!-- 视频信息 -->
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-3 mb-1">
                  <h4 class="text-md font-semibold text-gray-50 truncate">{{ video.title }}</h4>
                  <span class="px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">视频 {{ index + 1 }}</span>
                </div>
                <div class="flex items-center gap-4 text-sm text-gray-400">
                  <span>{{ video.duration }}</span>
                  <span>{{ video.resolution }}</span>
                  <span>{{ video.size }}</span>
                  <span class="px-2 py-0.5 bg-gray-700 text-gray-300 text-xs rounded-full">{{ video.style }}</span>
                </div>
              </div>

              <!-- 操作按钮 -->
              <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  class="p-2 text-gray-400 hover:text-gray-50 hover:bg-gray-700 rounded-lg transition-all"
                  @click.stop="downloadVideo(video)"
                  title="下载"
                >
                  <Download :size="16" />
                </button>
                <button
                  class="p-2 text-gray-400 hover:text-gray-50 hover:bg-gray-700 rounded-lg transition-all"
                  @click.stop="shareVideo(video)"
                  title="分享"
                >
                  <Share2 :size="16" />
                </button>
                <button
                  class="p-2 text-red-400 hover:text-red-300 hover:bg-gray-700 rounded-lg transition-all"
                  @click.stop="deleteVideo(video.id)"
                  title="删除"
                >
                  <Trash2 :size="16" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 批量操作栏 -->
    <div v-if="selectedVideos.length > 0" class="batch-actions bg-gray-800 border-t border-gray-700 px-6 py-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <span class="text-sm text-gray-400">已选择 {{ selectedVideos.length }} 个视频</span>
          <button
            class="text-sm text-gray-500 hover:text-gray-300 transition-colors"
            @click="clearSelection"
          >
            取消选择
          </button>
        </div>
        <div class="flex gap-3">
          <button
            class="px-4 py-2 bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600 transition-all flex items-center gap-2"
            @click="downloadSelected"
          >
            <Download :size="16" />
            <span>下载选中</span>
          </button>
          <button
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all flex items-center gap-2"
            @click="deleteSelected"
          >
            <Trash2 :size="16" />
            <span>删除选中</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { 
  Check, 
  Edit, 
  Download, 
  Play, 
  Share2, 
  Trash2,
  Grid3X3,
  List
} from 'lucide-vue-next'

interface Video {
  id: string
  title: string
  url: string
  duration: string
  resolution: string
  size: string
  style: string
}

// 视图模式
const viewMode = ref<'grid' | 'list'>('grid')

// 模拟生成的视频数据
const videos = ref<Video[]>([
  {
    id: '1',
    title: '产品展示视频 - 商务版',
    url: '/assets/videos/product-showcase-business.mp4',
    duration: '1:25',
    resolution: '1080p',
    size: '12.5MB',
    style: '商务风格'
  },
  {
    id: '2',
    title: '社交媒体视频 - 年轻化',
    url: '/assets/videos/social-media-youth.mp4',
    duration: '0:45',
    resolution: '1080p',
    size: '8.2MB',
    style: '年轻化风格'
  },
  {
    id: '3',
    title: '批量视频 3 - 默认风格',
    url: '/assets/videos/batch-video-3.mp4',
    duration: '1:10',
    resolution: '1080p',
    size: '10.8MB',
    style: '默认风格'
  }
])

// 选中的视频
const selectedVideos = ref<string[]>([])

// 选择视频
const selectVideo = (video: Video) => {
  const index = selectedVideos.value.indexOf(video.id)
  if (index > -1) {
    selectedVideos.value.splice(index, 1)
  } else {
    selectedVideos.value.push(video.id)
  }
}

// 清空选择
const clearSelection = () => {
  selectedVideos.value = []
}

// 播放视频（悬停时）
const playVideo = (_video: Video, event: Event) => {
  const videoElement = event.target as HTMLVideoElement
  videoElement.play()
}

// 暂停视频（离开时）
const pauseVideo = (event: Event) => {
  const videoElement = event.target as HTMLVideoElement
  videoElement.pause()
}

// 下载单个视频
const downloadVideo = (video: Video) => {
  console.log('下载视频:', video.title)
  // 这里实现下载逻辑
}

// 下载所有视频
const downloadAll = () => {
  console.log('下载所有视频')
  // 这里实现批量下载逻辑
}

// 下载选中的视频
const downloadSelected = () => {
  console.log('下载选中的视频:', selectedVideos.value)
  // 这里实现下载选中视频的逻辑
}

// 分享视频
const shareVideo = (video: Video) => {
  console.log('分享视频:', video.title)
  // 这里实现分享逻辑
}

// 删除单个视频
const deleteVideo = (videoId: string) => {
  videos.value = videos.value.filter(v => v.id !== videoId)
  selectedVideos.value = selectedVideos.value.filter(id => id !== videoId)
}

// 删除选中的视频
const deleteSelected = () => {
  videos.value = videos.value.filter(v => !selectedVideos.value.includes(v.id))
  selectedVideos.value = []
}
</script>

<style scoped>
.video-card {
  transition: all 0.3s ease;
}

.video-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
}

.video-list-item:hover {
  background-color: #374151;
}

/* 自定义滚动条 */
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