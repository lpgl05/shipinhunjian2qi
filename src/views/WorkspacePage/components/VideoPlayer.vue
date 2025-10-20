<template>
  <div class="video-player relative bg-black rounded-lg overflow-hidden group">
    <!-- 视频元素 -->
    <video
      ref="videoRef"
      class="w-full aspect-video bg-black"
      @timeupdate="handleTimeUpdate"
      @loadedmetadata="handleLoadedMetadata"
      @ended="handleEnded"
      @click="togglePlay"
    >
      <source v-if="src" :src="src" type="video/mp4" />
    </video>

    <!-- 播放/暂停按钮（中心） -->
    <button
      v-if="!isPlaying"
      class="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity"
      @click="togglePlay"
    >
      <div class="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors">
        <Play :size="32" class="text-gray-900 ml-1" fill="currentColor" />
      </div>
    </button>

    <!-- 控制栏 -->
    <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
      <!-- 进度条 -->
      <div class="mb-3">
        <input
          v-model="currentTimeValue"
          type="range"
          min="0"
          :max="duration"
          step="0.1"
          class="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
          @input="handleSeek"
        />
      </div>

      <!-- 控制按钮 -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <!-- 播放/暂停 -->
          <button class="text-white hover:text-gray-300 transition-colors" @click="togglePlay">
            <Play v-if="!isPlaying" :size="20" fill="currentColor" />
            <Pause v-else :size="20" fill="currentColor" />
          </button>

          <!-- 音量 -->
          <div class="flex items-center gap-2">
            <button class="text-white hover:text-gray-300 transition-colors" @click="toggleMute">
              <Volume2 v-if="volume > 0.5 && !isMuted" :size="20" />
              <Volume1 v-else-if="volume > 0 && !isMuted" :size="20" />
              <VolumeX v-else :size="20" />
            </button>
            <input
              v-model="volume"
              type="range"
              min="0"
              max="1"
              step="0.1"
              class="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
              @input="handleVolumeChange"
            />
          </div>

          <!-- 时间 -->
          <div class="text-white text-sm font-medium">
            {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
          </div>
        </div>

        <div class="flex items-center gap-3">
          <!-- 播放速度 -->
          <select
            v-model="playbackRate"
            class="bg-gray-700 text-white text-sm px-2 py-1 rounded border border-gray-600 hover:border-gray-500 transition-colors cursor-pointer"
            @change="handlePlaybackRateChange"
          >
            <option :value="0.5">0.5x</option>
            <option :value="0.75">0.75x</option>
            <option :value="1">1x</option>
            <option :value="1.25">1.25x</option>
            <option :value="1.5">1.5x</option>
            <option :value="2">2x</option>
          </select>

          <!-- 全屏 -->
          <button class="text-white hover:text-gray-300 transition-colors" @click="toggleFullscreen">
            <Maximize v-if="!isFullscreen" :size="20" />
            <Minimize v-else :size="20" />
          </button>
        </div>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="isLoading" class="absolute inset-0 flex items-center justify-center bg-black/50">
      <Loader2 :size="48" class="text-white animate-spin" />
    </div>

    <!-- 空状态 -->
    <div v-if="!src" class="absolute inset-0 flex flex-col items-center justify-center bg-gray-900">
      <Film :size="64" class="text-gray-600 mb-4" />
      <p class="text-gray-400">暂无预览内容</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Play, Pause, Volume2, Volume1, VolumeX, Maximize, Minimize, Loader2, Film } from 'lucide-vue-next'

interface Props {
  src?: string
}

const props = defineProps<Props>()

const videoRef = ref<HTMLVideoElement>()
const isPlaying = ref(false)
const currentTime = ref(0)
const currentTimeValue = ref(0)
const duration = ref(0)
const volume = ref(1)
const isMuted = ref(false)
const playbackRate = ref(1)
const isFullscreen = ref(false)
const isLoading = ref(false)

// 播放/暂停
const togglePlay = () => {
  if (!videoRef.value) return
  
  if (isPlaying.value) {
    videoRef.value.pause()
  } else {
    videoRef.value.play()
  }
  isPlaying.value = !isPlaying.value
}

// 处理时间更新
const handleTimeUpdate = () => {
  if (!videoRef.value) return
  currentTime.value = videoRef.value.currentTime
  currentTimeValue.value = videoRef.value.currentTime
}

// 处理元数据加载
const handleLoadedMetadata = () => {
  if (!videoRef.value) return
  duration.value = videoRef.value.duration
}

// 处理播放结束
const handleEnded = () => {
  isPlaying.value = false
}

// 拖动进度条
const handleSeek = () => {
  if (!videoRef.value) return
  videoRef.value.currentTime = currentTimeValue.value
}

// 音量控制
const handleVolumeChange = () => {
  if (!videoRef.value) return
  videoRef.value.volume = volume.value
  isMuted.value = volume.value === 0
}

// 静音切换
const toggleMute = () => {
  if (!videoRef.value) return
  
  if (isMuted.value) {
    videoRef.value.volume = volume.value
    isMuted.value = false
  } else {
    videoRef.value.volume = 0
    isMuted.value = true
  }
}

// 播放速度
const handlePlaybackRateChange = () => {
  if (!videoRef.value) return
  videoRef.value.playbackRate = playbackRate.value
}

// 全屏切换
const toggleFullscreen = () => {
  if (!videoRef.value) return
  
  if (!isFullscreen.value) {
    if (videoRef.value.requestFullscreen) {
      videoRef.value.requestFullscreen()
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen()
    }
  }
  isFullscreen.value = !isFullscreen.value
}

// 格式化时间
const formatTime = (seconds: number) => {
  if (!seconds || isNaN(seconds)) return '00:00'
  
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

// 监听src变化
watch(() => props.src, (newSrc) => {
  if (newSrc && videoRef.value) {
    isLoading.value = true
    videoRef.value.load()
    videoRef.value.addEventListener('canplay', () => {
      isLoading.value = false
    }, { once: true })
  }
})
</script>

<style scoped>
/* 自定义滑块样式 */
.slider::-webkit-slider-thumb {
  appearance: none;
  width: 12px;
  height: 12px;
  background: white;
  border-radius: 50%;
  cursor: pointer;
}

.slider::-moz-range-thumb {
  width: 12px;
  height: 12px;
  background: white;
  border-radius: 50%;
  cursor: pointer;
  border: none;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>

