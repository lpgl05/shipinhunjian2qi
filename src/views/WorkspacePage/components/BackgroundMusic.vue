<template>
  <div class="background-music">
    <!-- 工具栏 -->
    <div class="flex items-center justify-between mb-4">
      <div class="text-sm text-gray-400">
        音乐库
      </div>
      <button class="btn-primary text-sm flex items-center gap-2" @click="handleUploadMusic">
        <Upload :size="16" />
        上传音乐
      </button>
    </div>

    <!-- 当前选择的音乐 -->
    <div v-if="selectedMusic" class="bg-gray-700 rounded-lg p-4 border-2 border-blue-500 mb-4">
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-violet-500 rounded-lg flex items-center justify-center flex-shrink-0">
          <Music :size="24" class="text-white" />
        </div>
        <div class="flex-1 min-w-0">
          <h4 class="text-sm font-semibold text-gray-200 truncate">{{ selectedMusic.title }}</h4>
          <p class="text-xs text-gray-400">{{ selectedMusic.artist }} • {{ selectedMusic.duration }}</p>
        </div>
        <button
          class="icon-btn text-gray-400 hover:text-red-400"
          title="取消选择"
          @click="selectedMusic = null"
        >
          <X :size="18" />
        </button>
      </div>

      <!-- 音量混合控制 -->
      <div class="mt-4 space-y-4">
        <div>
          <div class="flex items-center justify-between mb-2">
            <label class="text-xs text-gray-400">背景音乐音量</label>
            <span class="text-xs text-blue-400">{{ bgmVolume }}%</span>
          </div>
          <div class="flex items-center gap-3">
            <VolumeX :size="16" class="text-gray-500" />
            <input
              v-model.number="bgmVolume"
              type="range"
              min="0"
              max="100"
              step="5"
              class="flex-1 h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
            />
            <Volume2 :size="16" class="text-gray-500" />
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between mb-2">
            <label class="text-xs text-gray-400">原声音量</label>
            <span class="text-xs text-gray-300">{{ originalVolume }}%</span>
          </div>
          <div class="flex items-center gap-3">
            <VolumeX :size="16" class="text-gray-500" />
            <input
              v-model.number="originalVolume"
              type="range"
              min="0"
              max="100"
              step="5"
              class="flex-1 h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
            />
            <Volume2 :size="16" class="text-gray-500" />
          </div>
        </div>

        <!-- 淡入淡出 -->
        <div class="flex items-center justify-between pt-3 border-t border-gray-600">
          <label class="text-xs text-gray-400">淡入淡出效果</label>
          <div class="flex items-center gap-2">
            <input
              v-model="enableFade"
              type="checkbox"
              class="w-4 h-4 rounded border-gray-600 text-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 音乐列表 -->
    <div class="space-y-2 max-h-64 overflow-y-auto scrollbar-thin">
      <div
        v-for="music in musicLibrary"
        :key="music.id"
        class="music-item group flex items-center gap-3 p-3 bg-gray-700 rounded-lg border cursor-pointer transition-all"
        :class="[
          selectedMusic?.id === music.id
            ? 'border-blue-500 bg-blue-500/10'
            : 'border-gray-600 hover:border-gray-500 hover:bg-gray-650'
        ]"
        @click="handleSelectMusic(music)"
      >
        <div class="w-10 h-10 bg-gray-800 rounded flex items-center justify-center flex-shrink-0">
          <Music :size="20" class="text-gray-400" />
        </div>

        <div class="flex-1 min-w-0">
          <h4 class="text-sm font-medium text-gray-200 truncate">{{ music.title }}</h4>
          <p class="text-xs text-gray-400">{{ music.artist }} • {{ music.duration }}</p>
        </div>

        <!-- 播放按钮 -->
        <button
          class="opacity-0 group-hover:opacity-100 icon-btn"
          title="试听"
          @click.stop="handlePreviewMusic(music)"
        >
          <Play :size="16" />
        </button>

        <!-- 选中标记 -->
        <div v-if="selectedMusic?.id === music.id" class="text-blue-400">
          <Check :size="18" />
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="musicLibrary.length === 0" class="text-center py-12">
        <Music :size="48" class="mx-auto mb-3 text-gray-600" />
        <p class="text-sm text-gray-400 mb-4">暂无音乐</p>
        <button class="btn-primary" @click="handleUploadMusic">
          <Upload :size="18" class="mr-2" />
          上传第一首音乐
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Music, Upload, VolumeX, Volume2, Play, Check, X } from 'lucide-vue-next'

interface MusicTrack {
  id: string
  title: string
  artist: string
  duration: string
  url?: string
}

const musicLibrary = ref<MusicTrack[]>([
  {
    id: '1',
    title: '轻快节奏',
    artist: '配乐库',
    duration: '03:45'
  },
  {
    id: '2',
    title: '温馨氛围',
    artist: '配乐库',
    duration: '04:20'
  },
  {
    id: '3',
    title: '动感电子',
    artist: '配乐库',
    duration: '03:15'
  },
  {
    id: '4',
    title: '轻松爵士',
    artist: '配乐库',
    duration: '05:00'
  }
])

const selectedMusic = ref<MusicTrack | null>(null)
const bgmVolume = ref(70)
const originalVolume = ref(50)
const enableFade = ref(true)

const handleSelectMusic = (music: MusicTrack) => {
  selectedMusic.value = music
}

const handlePreviewMusic = (music: MusicTrack) => {
  console.log('试听音乐:', music)
  // TODO: 实现音乐试听
}

const handleUploadMusic = () => {
  console.log('上传音乐')
  // TODO: 实现音乐上传
}
</script>

<style scoped>
/* 自定义滑块样式 */
.slider::-webkit-slider-thumb {
  appearance: none;
  width: 14px;
  height: 14px;
  background: linear-gradient(to right, #3B82F6, #8B5CF6);
  border-radius: 50%;
  cursor: pointer;
}

.slider::-moz-range-thumb {
  width: 14px;
  height: 14px;
  background: linear-gradient(to right, #3B82F6, #8B5CF6);
  border-radius: 50%;
  cursor: pointer;
  border: none;
}
</style>


