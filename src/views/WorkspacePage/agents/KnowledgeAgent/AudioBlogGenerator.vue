<template>
  <div class="audio-blog-generator">
    <!-- 音频博客头部 -->
    <div class="audio-header mb-6">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-lg font-semibold text-gray-200">音频博客生成</h3>
          <p class="text-sm text-gray-400">将生成的内容转换为音频博客</p>
        </div>
        <button
          v-if="!showConfig"
          class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-2"
          @click="showConfig = true"
        >
          <Volume2 :size="16" />
          生成音频
        </button>
        <button
          v-else
          class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-2"
          @click="generateAudio"
          :disabled="!content || isGenerating"
        >
          <Volume2 :size="16" />
          {{ isGenerating ? '生成中...' : '开始生成' }}
        </button>
      </div>
    </div>

    <!-- 配置项区域 -->
    <div v-if="showConfig" class="config-area">
      <!-- 音色选择 -->
      <div class="voice-selection mb-6">
        <h4 class="text-md font-medium text-gray-300 mb-4">选择音色</h4>
        <div class="grid grid-cols-2 gap-3">
          <div
            v-for="voice in availableVoices"
            :key="voice.id"
            class="voice-card p-3 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-green-500 transition-colors cursor-pointer"
            :class="{ 'border-green-500 bg-green-500/10': selectedVoice?.id === voice.id }"
            @click="selectVoice(voice)"
          >
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full flex items-center justify-center" :class="voice.color">
                <Volume2 :size="16" class="text-white" />
              </div>
              <div>
                <h5 class="text-sm font-medium text-gray-200">{{ voice.name }}</h5>
                <p class="text-xs text-gray-400">{{ voice.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 音色克隆 -->
      <div class="voice-clone mb-6">
        <h4 class="text-md font-medium text-gray-300 mb-4">音色克隆</h4>
        <div class="space-y-3">
          <div class="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
            <div class="flex items-center gap-3 mb-3">
              <div class="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center">
                <Mic :size="14" class="text-white" />
              </div>
              <div>
                <h5 class="text-sm font-medium text-gray-200">上传音频样本</h5>
                <p class="text-xs text-gray-400">上传3-10秒的音频文件来克隆音色</p>
              </div>
            </div>
            <input
              type="file"
              accept="audio/*"
              @change="handleAudioUpload"
              class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-300 file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:bg-purple-600 file:text-white hover:file:bg-purple-700"
            />
          </div>
          
          <div v-if="uploadedAudio" class="p-3 bg-green-500/10 border border-green-500 rounded-lg">
            <div class="flex items-center gap-2">
              <CheckCircle :size="16" class="text-green-400" />
              <span class="text-sm text-green-400">音频样本已上传，可以开始克隆</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 音频设置 -->
      <div class="audio-settings mb-6">
        <h4 class="text-md font-medium text-gray-300 mb-4">音频设置</h4>
        <div class="space-y-4">
          <!-- 语速 -->
          <div>
            <label class="block text-sm text-gray-400 mb-2">语速</label>
            <div class="flex items-center gap-3">
              <span class="text-sm text-gray-400">慢</span>
              <input
                v-model="audioSettings.speed"
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                class="flex-1"
              />
              <span class="text-sm text-gray-400">快</span>
              <span class="text-sm text-gray-300 w-12">{{ audioSettings.speed }}x</span>
            </div>
          </div>

          <!-- 音调 -->
          <div>
            <label class="block text-sm text-gray-400 mb-2">音调</label>
            <div class="flex items-center gap-3">
              <span class="text-sm text-gray-400">低</span>
              <input
                v-model="audioSettings.pitch"
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                class="flex-1"
              />
              <span class="text-sm text-gray-400">高</span>
              <span class="text-sm text-gray-300 w-12">{{ audioSettings.pitch }}x</span>
            </div>
          </div>

          <!-- 音量 -->
          <div>
            <label class="block text-sm text-gray-400 mb-2">音量</label>
            <div class="flex items-center gap-3">
              <span class="text-sm text-gray-400">小</span>
              <input
                v-model="audioSettings.volume"
                type="range"
                min="0"
                max="1"
                step="0.1"
                class="flex-1"
              />
              <span class="text-sm text-gray-400">大</span>
              <span class="text-sm text-gray-300 w-12">{{ Math.round(audioSettings.volume * 100) }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 音频预览 -->
    <div v-if="generatedAudio" class="audio-preview">
      <h4 class="text-md font-medium text-gray-300 mb-4">音频预览</h4>
      <div class="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
        <div class="flex items-center gap-4">
          <button
            class="p-3 bg-green-600 hover:bg-green-700 text-white rounded-full transition-colors"
            @click="togglePlayback"
          >
            <Play v-if="!isPlaying" :size="16" />
            <Pause v-else :size="16" />
          </button>
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-2">
              <span class="text-sm text-gray-400">0:00</span>
              <div class="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                <div class="h-full bg-green-500 transition-all" :style="{ width: progress + '%' }"></div>
              </div>
              <span class="text-sm text-gray-400">{{ formatTime(duration) }}</span>
            </div>
            <p class="text-sm text-gray-400">使用音色: {{ selectedVoice?.name }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div v-if="generatedAudio" class="flex items-center gap-3 pt-4">
      <button
        class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
        @click="downloadAudio"
      >
        <Download :size="16" />
        下载音频
      </button>
      <button
        class="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors flex items-center gap-2"
        @click="regenerateAudio"
      >
        <RefreshCw :size="16" />
        重新生成
      </button>
      <button
        class="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center gap-2"
        @click="showConfig = true"
      >
        <Settings :size="16" />
        重新配置
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Volume2, Mic, CheckCircle, Play, Pause, Download, RefreshCw, Settings } from 'lucide-vue-next'

// Props
const props = defineProps<{
  content: string
}>()

// Emits
const emit = defineEmits<{
  'audio-generated': [audioUrl: string]
}>()

// 响应式数据
const showConfig = ref(false)
const selectedVoice = ref<any>(null)
const uploadedAudio = ref<File | null>(null)
const generatedAudio = ref<string | null>(null)
const isGenerating = ref(false)
const isPlaying = ref(false)
const progress = ref(0)
const duration = ref(0)

// 音频设置
const audioSettings = reactive({
  speed: 1.0,
  pitch: 1.0,
  volume: 0.8
})

// 可用音色
const availableVoices = ref([
  {
    id: 'voice-1',
    name: '专业男声',
    description: '沉稳专业，适合商务内容',
    color: 'bg-blue-500'
  },
  {
    id: 'voice-2',
    name: '温柔女声',
    description: '温和亲切，适合生活内容',
    color: 'bg-pink-500'
  },
  {
    id: 'voice-3',
    name: '活力男声',
    description: '充满活力，适合营销内容',
    color: 'bg-orange-500'
  },
  {
    id: 'voice-4',
    name: '知性女声',
    description: '知性优雅，适合教育内容',
    color: 'bg-purple-500'
  }
])

// 选择音色
const selectVoice = (voice: any) => {
  selectedVoice.value = voice
}

// 处理音频上传
const handleAudioUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    uploadedAudio.value = file
    // 这里可以添加音频处理逻辑
  }
}

// 生成音频
const generateAudio = async () => {
  if (!props.content || !selectedVoice.value) return
  
  isGenerating.value = true
  
  try {
    // 模拟音频生成过程
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    // 模拟生成的音频URL
    generatedAudio.value = 'mock-audio-url'
    duration.value = 120 // 2分钟
    
    emit('audio-generated', generatedAudio.value)
  } catch (error) {
    console.error('音频生成失败:', error)
  } finally {
    isGenerating.value = false
  }
}

// 切换播放
const togglePlayback = () => {
  isPlaying.value = !isPlaying.value
  // 这里可以添加实际的音频播放逻辑
}

// 下载音频
const downloadAudio = () => {
  if (generatedAudio.value) {
    // 这里可以添加实际的下载逻辑
    console.log('下载音频:', generatedAudio.value)
  }
}

// 重新生成音频
const regenerateAudio = () => {
  generatedAudio.value = null
  generateAudio()
}

// 格式化时间
const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

// 默认选择第一个音色
if (availableVoices.value.length > 0) {
  selectedVoice.value = availableVoices.value[0]
}
</script>

<style scoped>
.audio-blog-generator {
  /* 音频博客生成器样式 */
}

input[type="range"] {
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
  cursor: pointer;
}

input[type="range"]::-webkit-slider-track {
  background: #374151;
  height: 4px;
  border-radius: 2px;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  background: #10b981;
  height: 16px;
  width: 16px;
  border-radius: 50%;
  cursor: pointer;
}

input[type="range"]::-moz-range-track {
  background: #374151;
  height: 4px;
  border-radius: 2px;
  border: none;
}

input[type="range"]::-moz-range-thumb {
  background: #10b981;
  height: 16px;
  width: 16px;
  border-radius: 50%;
  cursor: pointer;
  border: none;
}
</style>
