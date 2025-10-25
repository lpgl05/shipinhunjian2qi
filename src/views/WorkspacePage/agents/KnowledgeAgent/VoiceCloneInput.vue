<template>
  <div class="voice-clone-input space-y-4">
    <!-- 录音或上传选择 -->
    <div class="grid grid-cols-2 gap-4">
      <!-- 录音方式 -->
      <button
        class="p-6 rounded-2xl border-2 transition-all duration-300"
        :class="[
          mode === 'record' 
            ? 'border-blue-500 bg-blue-500/10' 
            : 'border-gray-700 bg-gray-800/30 hover:border-gray-600'
        ]"
        @click="mode = 'record'"
      >
        <div class="flex flex-col items-center gap-3">
          <div class="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
            <Mic :size="24" class="text-blue-400" />
          </div>
          <div class="text-center">
            <p class="text-gray-300 font-medium">在线录音</p>
            <p class="text-xs text-gray-500 mt-1">朗读指定文本</p>
          </div>
        </div>
      </button>

      <!-- 上传方式 -->
      <button
        class="p-6 rounded-2xl border-2 transition-all duration-300"
        :class="[
          mode === 'upload' 
            ? 'border-blue-500 bg-blue-500/10' 
            : 'border-gray-700 bg-gray-800/30 hover:border-gray-600'
        ]"
        @click="mode = 'upload'"
      >
        <div class="flex flex-col items-center gap-3">
          <div class="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
            <Upload :size="24" class="text-purple-400" />
          </div>
          <div class="text-center">
            <p class="text-gray-300 font-medium">上传音频</p>
            <p class="text-xs text-gray-500 mt-1">支持 MP3, WAV</p>
          </div>
        </div>
      </button>
    </div>

    <!-- 录音模式 -->
    <div v-if="mode === 'record'" class="space-y-4">
      <!-- 朗读文本 -->
      <div class="p-4 bg-gray-800/50 rounded-xl border border-gray-700">
        <p class="text-sm text-gray-400 mb-2">请朗读以下文本：</p>
        <p class="text-gray-300 leading-relaxed">
          "人工智能正在改变我们的生活方式。通过深度学习和自然语言处理技术，AI能够理解和生成人类语言，为我们提供更智能的服务。"
        </p>
      </div>

      <!-- 录音控制 -->
      <div class="flex flex-col items-center gap-4 p-8 bg-gray-800/30 rounded-2xl">
        <div 
          class="w-20 h-20 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300"
          :class="[
            isRecording 
              ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
              : 'bg-blue-500 hover:bg-blue-600'
          ]"
          @click="toggleRecording"
        >
          <component 
            :is="isRecording ? Square : Mic" 
            :size="32" 
            class="text-white"
          />
        </div>
        
        <div class="text-center">
          <p class="text-gray-300 font-medium">
            {{ isRecording ? '录音中...' : '点击开始录音' }}
          </p>
          <p v-if="recordingTime > 0" class="text-sm text-gray-500 mt-1">
            {{ formatTime(recordingTime) }}
          </p>
        </div>
      </div>
    </div>

    <!-- 上传模式 -->
    <div v-if="mode === 'upload'" class="space-y-4">
      <div 
        class="upload-zone relative p-8 border-2 border-dashed rounded-2xl transition-all duration-300 cursor-pointer"
        :class="[
          isDragging 
            ? 'border-purple-500 bg-purple-500/10' 
            : 'border-gray-700 bg-gray-800/30 hover:border-gray-600'
        ]"
        @dragover.prevent="isDragging = true"
        @dragleave.prevent="isDragging = false"
        @drop.prevent="handleDrop"
        @click="triggerFileInput"
      >
        <input 
          ref="fileInputRef"
          type="file"
          accept="audio/*"
          class="hidden"
          @change="handleFileSelect"
        />

        <div class="text-center">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-gray-700 rounded-2xl mb-4">
            <Music :size="32" class="text-gray-400" />
          </div>
          <p class="text-gray-300 font-medium mb-1">
            拖拽音频文件至此或点击上传
          </p>
          <p class="text-sm text-gray-500">
            支持 MP3, WAV 格式，建议时长 30秒 以上
          </p>
        </div>
      </div>
    </div>

    <!-- 音频预览 -->
    <div v-if="audioUrl" class="p-4 bg-gray-800/50 rounded-xl border border-gray-700">
      <div class="flex items-center gap-3 mb-3">
        <div class="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
          <Check :size="20" class="text-green-400" />
        </div>
        <div class="flex-1">
          <p class="text-sm text-gray-300 font-medium">音频已准备就绪</p>
          <p class="text-xs text-gray-500">正在分析声纹特征...</p>
        </div>
      </div>
      <audio 
        :src="audioUrl" 
        controls 
        class="w-full"
        style="height: 40px;"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import { Mic, Upload, Music, Square, Check } from 'lucide-vue-next'

const emit = defineEmits<{
  'audio-ready': [url: string]
}>()

const mode = ref<'record' | 'upload'>('record')
const isRecording = ref(false)
const recordingTime = ref(0)
const audioUrl = ref('')
const isDragging = ref(false)
const fileInputRef = ref<HTMLInputElement>()

let recordingInterval: number | null = null

// 切换录音状态
const toggleRecording = () => {
  if (isRecording.value) {
    stopRecording()
  } else {
    startRecording()
  }
}

// 开始录音
const startRecording = () => {
  isRecording.value = true
  recordingTime.value = 0
  
  recordingInterval = window.setInterval(() => {
    recordingTime.value++
    
    // 模拟录音完成
    if (recordingTime.value >= 10) {
      stopRecording()
    }
  }, 1000)
}

// 停止录音
const stopRecording = () => {
  isRecording.value = false
  
  if (recordingInterval) {
    clearInterval(recordingInterval)
    recordingInterval = null
  }
  
  // 模拟生成音频URL
  if (recordingTime.value > 0) {
    audioUrl.value = 'mock-audio-url'
    emit('audio-ready', audioUrl.value)
  }
}

// 触发文件选择
const triggerFileInput = () => {
  fileInputRef.value?.click()
}

// 处理文件选择
const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    handleAudioFile(file)
  }
}

// 处理拖拽
const handleDrop = (event: DragEvent) => {
  isDragging.value = false
  const file = event.dataTransfer?.files?.[0]
  if (file) {
    handleAudioFile(file)
  }
}

// 处理音频文件
const handleAudioFile = (file: File) => {
  // 模拟上传和处理
  const url = URL.createObjectURL(file)
  audioUrl.value = url
  emit('audio-ready', url)
}

// 格式化时间
const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

// 清理
onUnmounted(() => {
  if (recordingInterval) {
    clearInterval(recordingInterval)
  }
})
</script>

