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
        <!-- 返回修改 -->
        <button
          class="px-5 py-2 bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600 transition-all flex items-center gap-2"
          @click="$emit('backToEdit')"
        >
          <Edit :size="18} />
          <span>返回修改</span>
        </button>

        <!-- 一键下载全部 -->
        <button
          class="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-violet-500 text-white rounded-lg font-medium hover:brightness-110 transform hover:scale-105 active:scale-95 transition-all duration-200 flex items-center gap-2"
          @click="downloadAll"
        >
          <Download :size="18} />
          <span>下载全部</span>
        </button>
      </div>
    </div>

    <!-- 主视频播放器 -->
    <div class="flex-1 p-8 flex items-center justify-center bg-black/20">
      <div class="max-w-5xl w-full">
        <div class="aspect-video bg-black rounded-xl overflow-hidden shadow-2xl">
          <video
            ref="videoPlayerRef"
            :src="currentVideo.url"
            controls
            class="w-full h-full"
            @loadedmetadata="handleVideoLoaded"
          >
            您的浏览器不支持视频播放
          </video>
        </div>

        <!-- 视频信息 -->
        <div class="mt-4 flex items-center justify-between">
          <div>
            <h4 class="text-lg font-semibold text-gray-50">{{ currentVideo.title }}</h4>
            <p class="text-sm text-gray-400">{{ currentVideo.duration }} • {{ currentVideo.resolution }}</p>
          </div>
          <div class="flex items-center gap-2">
            <button class="icon-btn" title="分享">
              <Share2 :size="20} />
            </button>
            <button class="icon-btn" title="编辑">
              <Edit :size="20" />
            </button>
            <button class="icon-btn" title="下载">
              <Download :size="20" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部缩略图列表 -->
    <div class="bottom-thumbnails px-6 py-4 border-t border-gray-700 bg-gray-800">
      <div class="flex items-center gap-2 mb-3">
        <Film :size="18" class="text-blue-400" />
        <h4 class="text-sm font-semibold text-gray-300">生成的视频</h4>
      </div>

      <!-- 缩略图滚动区 -->
      <div class="flex gap-4 overflow-x-auto scrollbar-custom pb-2">
        <div
          v-for="(video, index) in videos"
          :key="video.id"
          class="thumbnail-item group flex-shrink-0 w-48 cursor-pointer transition-all"
          :class="{ 'ring-2 ring-blue-500': currentVideoIndex === index }"
          @click="selectVideo(index)"
        >
          <!-- 缩略图 -->
          <div class="aspect-video bg-gray-700 rounded-lg overflow-hidden mb-2 relative">
            <img
              v-if="video.thumbnail"
              :src="video.thumbnail"
              :alt="video.title"
              class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full flex items-center justify-center">
              <Video :size="32" class="text-gray-500" />
            </div>

            <!-- 播放图标叠加 -->
            <div 
              v-if="currentVideoIndex !== index"
              class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <div class="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <Play :size="24" class="text-white ml-1" />
              </div>
            </div>

            <!-- 时长标签 -->
            <div class="absolute bottom-2 right-2 px-2 py-0.5 bg-black/70 text-white text-xs rounded">
              {{ video.duration }}
            </div>
          </div>

          <!-- 视频信息 -->
          <div class="flex items-center justify-between">
            <p class="text-sm text-gray-300 truncate flex-1">{{ video.title }}</p>
            <button
              class="p-1.5 text-gray-400 hover:text-blue-400 transition-colors opacity-0 group-hover:opacity-100"
              title="下载"
              @click.stop="downloadVideo(video)"
            >
              <Download :size="16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import draggable from 'vuedraggable'
import { 
  Check,
  Edit,
  Download,
  Share2,
  Film,
  Video,
  Play
} from 'lucide-vue-next'

defineEmits<{
  backToEdit: []
}>()

// 当前视频索引
const currentVideoIndex = ref(0)

// 视频播放器引用
const videoPlayerRef = ref<HTMLVideoElement>()

// 模拟生成的视频列表
const videos = [
  {
    id: 1,
    title: '我的旅行vlog - 最终版',
    url: '/demo/video-1.mp4',
    thumbnail: '/demo/thumb-1.jpg',
    duration: '2:35',
    resolution: '1080p'
  },
  {
    id: 2,
    title: '我的旅行vlog - 版本2',
    url: '/demo/video-2.mp4',
    thumbnail: '/demo/thumb-2.jpg',
    duration: '2:28',
    resolution: '1080p'
  },
  {
    id: 3,
    title: '我的旅行vlog - 版本3',
    url: '/demo/video-3.mp4',
    thumbnail: '/demo/thumb-3.jpg',
    duration: '2:42',
    resolution: '1080p'
  }
]

// 当前视频
const currentVideo = computed(() => videos[currentVideoIndex.value])

// 选择视频
const selectVideo = (index: number) => {
  currentVideoIndex.value = index
  // 重置播放器
  if (videoPlayerRef.value) {
    videoPlayerRef.value.load()
  }
}

// 下载单个视频
const downloadVideo = (video: any) => {
  console.log('下载视频:', video.title)
  // TODO: 实现下载逻辑
}

// 下载全部
const downloadAll = () => {
  console.log('下载全部视频')
  // TODO: 实现批量下载
}

// 视频加载完成
const handleVideoLoaded = () => {
  console.log('视频已加载')
}
</script>

<style scoped>
.icon-btn {
  @apply p-2 text-gray-400 hover:text-gray-50 hover:bg-gray-700 rounded-lg transition-all;
}

/* 自定义横向滚动条 */
.scrollbar-custom::-webkit-scrollbar {
  height: 8px;
}

.scrollbar-custom::-webkit-scrollbar-track {
  background: #1F2937;
  border-radius: 4px;
}

.scrollbar-custom::-webkit-scrollbar-thumb {
  background: #4B5563;
  border-radius: 4px;
}

.scrollbar-custom::-webkit-scrollbar-thumb:hover {
  background: #6B7280;
}

/* 缩略图动画 */
.thumbnail-item {
  transition: all 0.2s ease;
}

.thumbnail-item:hover {
  transform: translateY(-4px);
}
</style>

