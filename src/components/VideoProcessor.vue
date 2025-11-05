<template>
  <div class="video-processor bg-gray-800 rounded-lg border border-gray-700">
    <!-- 上传区域 -->
    <div 
      class="upload-area p-8 text-center border-2 border-dashed border-gray-600 rounded-lg transition-colors"
      :class="{ 'border-blue-500 bg-blue-500/10': isDragging }"
      @drop="handleDrop"
      @dragover.prevent="isDragging = true"
      @dragleave="isDragging = false"
      @click="triggerFileInput"
    >
      <input
        ref="fileInput"
        type="file"
        accept="video/*"
        class="hidden"
        @change="handleFileSelect"
      />
      
      <div v-if="!currentFile && !processingStatus">
        <Video :size="48" class="mx-auto mb-4 text-gray-400" />
        <h3 class="text-lg font-semibold text-gray-200 mb-2">上传视频进行AI处理</h3>
        <p class="text-gray-400 mb-4">支持 MP4, MOV, AVI 等格式</p>
        <button class="btn-primary px-6 py-2">
          选择视频文件
        </button>
      </div>

      <!-- 文件预览 -->
      <div v-if="currentFile && !processingStatus" class="text-left">
        <div class="flex items-center gap-4">
          <div class="w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center">
            <Video :size="32" class="text-blue-400" />
          </div>
          <div class="flex-1">
            <h4 class="font-semibold text-gray-200">{{ currentFile.name }}</h4>
            <p class="text-sm text-gray-400">{{ formatFileSize(currentFile.size) }}</p>
          </div>
          <button 
            @click.stop="startProcessing"
            class="btn-primary px-4 py-2 flex items-center gap-2"
          >
            <Sparkles :size="16" />
            开始AI处理
          </button>
        </div>
      </div>
    </div>

    <!-- 处理状态 -->
    <div v-if="processingStatus" class="p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-200">AI处理中</h3>
        <span class="text-sm text-gray-400">{{ processingProgress }}%</span>
      </div>
      
      <!-- 进度条 -->
      <div class="w-full bg-gray-700 rounded-full h-2 mb-4">
        <div 
          class="bg-blue-500 h-2 rounded-full transition-all duration-300"
          :style="{ width: `${processingProgress}%` }"
        ></div>
      </div>

      <!-- 当前处理步骤 -->
      <div class="text-sm text-gray-300 mb-4">
        {{ processingStep }}
      </div>

      <!-- 处理结果 -->
      <div v-if="processingStatus === 'completed'" class="space-y-4">
        <div class="flex items-center gap-2 text-green-400">
          <CheckCircle :size="20" />
          <span class="font-semibold">处理完成</span>
        </div>
        
        <!-- 识别结果 -->
        <div class="bg-gray-700 rounded-lg p-4">
          <h4 class="font-semibold text-gray-200 mb-3">AI识别结果</h4>
          <div class="space-y-3">
            <div v-for="(result, index) in aiResults" :key="index" class="flex items-start gap-3">
              <div class="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                  <span class="text-sm font-medium text-gray-200">{{ result.time }}</span>
                  <span 
                    class="px-2 py-1 text-xs rounded-full"
                    :class="getTagColor(result.type)"
                  >
                    {{ result.type }}
                  </span>
                </div>
                <p class="text-sm text-gray-300">{{ result.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 错误状态 -->
      <div v-if="processingStatus === 'failed'" class="text-center py-4">
        <div class="flex items-center justify-center gap-2 text-red-400 mb-4">
          <XCircle :size="24" />
          <span class="font-semibold">处理失败</span>
        </div>
        <p class="text-gray-300 mb-4">{{ errorMessage }}</p>
        <button 
          @click="resetProcessor"
          class="btn-secondary px-4 py-2"
        >
          重新上传
        </button>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div v-if="processingStatus === 'completed'" class="p-4 border-t border-gray-700">
      <div class="flex gap-3">
        <button 
          @click="saveToCloudDrive"
          class="btn-primary flex-1 px-4 py-2"
        >
          保存到云盘
        </button>
        <button 
          @click="resetProcessor"
          class="btn-secondary flex-1 px-4 py-2"
        >
          处理新视频
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { Video, Sparkles, CheckCircle, XCircle } from 'lucide-vue-next'

interface AIResult {
  time: string
  type: 'scene' | 'motion' | 'audio' | 'face'
  description: string
  confidence: number
}

const fileInput = ref<HTMLInputElement>()
const isDragging = ref(false)
const currentFile = ref<File | null>(null)
const processingStatus = ref<'uploading' | 'processing' | 'completed' | 'failed' | null>(null)
const processingProgress = ref(0)
const processingStep = ref('')
const errorMessage = ref('')
const aiResults = ref<AIResult[]>([])

const emit = defineEmits<{
  'save': [payload: { file?: File | null, assetId?: string | null, assetName?: string | null, results: AIResult[] }]
}>()

const props = defineProps<{ 
  initialAsset?: { id: string; name: string; url: string; size: number; thumbnail?: string } | null,
  autoStart?: boolean
}>()

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const getTagColor = (type: string) => {
  const colors = {
    scene: 'bg-purple-500/20 text-purple-300',
    motion: 'bg-orange-500/20 text-orange-300', 
    audio: 'bg-green-500/20 text-green-300',
    face: 'bg-blue-500/20 text-blue-300'
  }
  return colors[type as keyof typeof colors] || 'bg-gray-500/20 text-gray-300'
}

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    currentFile.value = target.files[0]
  }
}

const handleDrop = (event: DragEvent) => {
  isDragging.value = false
  const files = event.dataTransfer?.files
  if (files && files[0] && files[0].type.startsWith('video/')) {
    currentFile.value = files[0]
  }
}

const startProcessing = async () => {
  if (!currentFile.value) return

  processingStatus.value = 'processing'
  processingProgress.value = 0
  processingStep.value = '正在上传视频...'

  // 模拟处理过程
  const steps = [
    { progress: 20, step: '正在上传视频...' },
    { progress: 40, step: 'AI正在分析视频内容...' },
    { progress: 60, step: '识别场景切换点...' },
    { progress: 80, step: '检测高光时刻...' },
    { progress: 100, step: '处理完成' }
  ]

  for (const step of steps) {
    await new Promise(resolve => setTimeout(resolve, 1500))
    processingProgress.value = step.progress
    processingStep.value = step.step
  }

  // 模拟AI结果
  aiResults.value = [
    { time: '00:05', type: 'scene', description: '检测到场景切换：室内转室外', confidence: 0.92 },
    { time: '00:12', type: 'motion', description: '识别到快速运动：人物奔跑', confidence: 0.87 },
    { time: '00:18', type: 'face', description: '检测到特写镜头：表情变化', confidence: 0.95 },
    { time: '00:25', type: 'audio', description: '音频峰值：背景音乐高潮', confidence: 0.83 }
  ]

  processingStatus.value = 'completed'
}

const resetProcessor = () => {
  currentFile.value = null
  processingStatus.value = null
  processingProgress.value = 0
  processingStep.value = ''
  aiResults.value = []
  errorMessage.value = ''
}

const saveToCloudDrive = () => {
  if (props.initialAsset) {
    emit('save', { assetId: props.initialAsset.id, assetName: props.initialAsset.name, results: aiResults.value })
    return
  }
  if (currentFile.value) {
    emit('save', { file: currentFile.value, results: aiResults.value })
  }
}

// 如果传入了云盘素材，初始化文件并根据 autoStart 自动开始处理
const initFromAsset = async () => {
  if (props.initialAsset) {
    try {
      // 通过fetch拉取，用于占位并填充大小等信息；实际预览使用已有url
      currentFile.value = new File([new Blob()], props.initialAsset.name, { type: 'video/mp4' })
      // 覆盖size展示（模拟）
      Object.defineProperty(currentFile.value, 'size', { value: props.initialAsset.size, writable: false })
      if (props.autoStart) {
        await startProcessing()
      }
    } catch (e) {
      console.error('初始化云盘素材失败', e)
    }
  }
}

onMounted(() => {
  initFromAsset()
})
</script>

<style scoped>
.btn-primary {
  @apply bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors;
}

.btn-secondary {
  @apply bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg transition-colors;
}

.upload-area {
  @apply cursor-pointer hover:bg-gray-700/50;
}
</style>