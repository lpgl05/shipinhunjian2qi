<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
    @click="closeModal"
  >
    <div
      class="bg-gray-800 rounded-xl p-6 w-full max-w-2xl mx-4 shadow-2xl max-h-[90vh] overflow-y-auto"
      @click.stop
    >
      <!-- 标题 -->
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-semibold text-gray-50">定制专属音色</h2>
        <button
          @click="closeModal"
          class="p-1 rounded-lg hover:bg-gray-700 transition-colors duration-200"
        >
          <X :size="20" class="text-gray-400" />
        </button>
      </div>

      <!-- 步骤指示器 -->
      <div class="flex items-center justify-center mb-6">
        <div class="flex items-center space-x-2">
          <div
            class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium"
            :class="currentStep >= 1 ? 'bg-blue-500 text-white' : 'bg-gray-600 text-gray-400'"
          >
            1
          </div>
          <div class="w-8 h-1 bg-gray-600" :class="currentStep >= 2 ? 'bg-blue-500' : ''"></div>
          <div
            class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium"
            :class="currentStep >= 2 ? 'bg-blue-500 text-white' : 'bg-gray-600 text-gray-400'"
          >
            2
          </div>
          <div class="w-8 h-1 bg-gray-600" :class="currentStep >= 3 ? 'bg-blue-500' : ''"></div>
          <div
            class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium"
            :class="currentStep >= 3 ? 'bg-blue-500 text-white' : 'bg-gray-600 text-gray-400'"
          >
            3
          </div>
        </div>
      </div>

      <!-- 步骤1: 音色信息 -->
      <div v-if="currentStep === 1" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">
            音色名称 <span class="text-red-400">*</span>
          </label>
          <input
            v-model="cloneConfig.name"
            type="text"
            placeholder="请输入音色名称"
            class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-50 placeholder-gray-400 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">
            音色描述
          </label>
          <textarea
            v-model="cloneConfig.description"
            placeholder="请描述这个音色的特点（可选）"
            rows="3"
            class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-50 placeholder-gray-400 focus:border-blue-500 focus:outline-none resize-none"
          ></textarea>
        </div>

        <div class="flex justify-end space-x-3 pt-4">
          <button
            @click="closeModal"
            class="px-4 py-2 text-gray-400 hover:text-gray-300 transition-colors duration-200"
          >
            取消
          </button>
          <button
            @click="nextStep"
            :disabled="!cloneConfig.name.trim()"
            class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            下一步
          </button>
        </div>
      </div>

      <!-- 步骤2: 自动录制音频 -->
      <div v-if="currentStep === 2" class="space-y-4">
        <div class="text-center mb-4">
          <h3 class="text-lg font-medium text-gray-200 mb-2">自动录制训练语音</h3>
          <p class="text-sm text-gray-400">
            点击开始录制后，系统将自动显示每句话，每句话录制2秒后自动切换到下一句
          </p>
        </div>

        <!-- 进度显示 -->
        <div class="bg-gray-700 rounded-lg p-4 mb-4">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm text-gray-300">录制进度</span>
            <span class="text-sm text-blue-400">{{ completedSentences }}/20</span>
          </div>
          <div class="w-full bg-gray-600 rounded-full h-2">
            <div 
              class="bg-blue-500 h-2 rounded-full transition-all duration-300"
              :style="{ width: `${(completedSentences / 20) * 100}%` }"
            ></div>
          </div>
        </div>

        <!-- 当前录制的句子 -->
        <div class="bg-gray-700 rounded-lg p-4">
          <div class="text-center">
            <p class="text-sm text-gray-400 mb-2">第 {{ currentSentenceIndex + 1 }} 句</p>
            <p class="text-lg text-gray-200 mb-4 leading-relaxed">
              {{ sentences[currentSentenceIndex] }}
            </p>
            
            <!-- 录制控制 -->
            <div class="flex items-center justify-center space-x-4">
              <!-- 开始自动录制按钮 -->
              <button
                v-if="!isAutoRecording"
                @click="startAutoRecording"
                class="flex items-center space-x-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200"
              >
                <Mic :size="20" />
                <span>开始自动录制</span>
              </button>
              
              <!-- 停止自动录制按钮 -->
              <button
                v-if="isAutoRecording"
                @click="stopAutoRecording"
                class="flex items-center space-x-2 px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200"
              >
                <Square :size="20" />
                <span>停止录制</span>
              </button>

              <!-- 录制状态指示器 -->
              <div v-if="isAutoRecording" class="flex items-center space-x-3">
                <div class="flex items-center space-x-2 text-red-400">
                  <div class="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <span class="text-sm">正在录制第 {{ currentSentenceIndex + 1 }} 句...</span>
                  <!-- 倒计时显示 -->
                  <span class="text-xs text-gray-400">({{ remainingTime }}s)</span>
                </div>
              </div>
            </div>

            <!-- 录制完成提示 -->
            <div v-if="isRecordingComplete" class="mt-4 p-3 bg-green-600 rounded-lg">
              <div class="flex items-center justify-center space-x-2 text-green-100">
                <CheckCircle :size="20" />
                <span class="text-sm">所有句子录制完成！</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 已录制的句子列表 -->
        <div v-if="recordedSentences.length > 0" class="bg-gray-700 rounded-lg p-4">
          <h4 class="text-sm font-medium text-gray-300 mb-3">已录制句子</h4>
          <div class="space-y-2 max-h-32 overflow-y-auto">
            <div
              v-for="(sentence, index) in recordedSentences"
              :key="index"
              class="flex items-center justify-between p-2 bg-gray-600 rounded text-sm"
            >
              <span class="text-gray-300 truncate">{{ sentence.text }}</span>
              <div class="flex items-center space-x-2">
                <span class="text-xs text-green-400">✓ 已录制</span>
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-between pt-4">
          <button
            @click="prevStep"
            class="px-4 py-2 text-gray-400 hover:text-gray-300 transition-colors duration-200"
          >
            上一步
          </button>
          <button
            @click="nextStep"
            :disabled="completedSentences < 20"
            class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            下一步
          </button>
        </div>
      </div>

      <!-- 步骤3: 生成音色 -->
      <div v-if="currentStep === 3" class="space-y-4">
        <div class="text-center">
          <div v-if="cloneStatus === 'processing'" class="space-y-4">
            <div class="w-16 h-16 mx-auto bg-blue-500 rounded-full flex items-center justify-center">
              <Loader2 :size="32" class="text-white animate-spin" />
            </div>
            <h3 class="text-lg font-medium text-gray-200">正在生成音色...</h3>
            <p class="text-sm text-gray-400">
              AI正在分析您的语音特征，预计需要2-3分钟
            </p>
            <div class="w-full bg-gray-600 rounded-full h-2">
              <div 
                class="bg-blue-500 h-2 rounded-full transition-all duration-1000"
                :style="{ width: `${processingProgress}%` }"
              ></div>
            </div>
          </div>

          <div v-else-if="cloneStatus === 'success'" class="space-y-4">
            <div class="w-16 h-16 mx-auto bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle :size="32" class="text-white" />
            </div>
            <h3 class="text-lg font-medium text-gray-200">音色生成成功！</h3>
            <p class="text-sm text-gray-400">
              您的专属音色"{{ cloneConfig.name }}"已生成完成
            </p>
            <button
              @click="testGeneratedVoice"
              class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200"
            >
              试听音色
            </button>
          </div>

          <div v-else-if="cloneStatus === 'error'" class="space-y-4">
            <div class="w-16 h-16 mx-auto bg-red-500 rounded-full flex items-center justify-center">
              <AlertCircle :size="32" class="text-white" />
            </div>
            <h3 class="text-lg font-medium text-gray-200">生成失败</h3>
            <p class="text-sm text-gray-400">
              音色生成过程中出现错误，请重试
            </p>
          </div>
        </div>

        <div class="flex justify-center space-x-3 pt-4">
          <button
            v-if="cloneStatus === 'error'"
            @click="retryCloning"
            class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
          >
            重试
          </button>
          <button
            v-if="cloneStatus === 'success'"
            @click="completeCloning"
            class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200"
          >
            完成
          </button>
          <button
            @click="closeModal"
            class="px-4 py-2 text-gray-400 hover:text-gray-300 transition-colors duration-200"
          >
            {{ cloneStatus === 'success' ? '关闭' : '取消' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'
import { 
  X, 
  Mic, 
  Square, 
  Loader2, 
  CheckCircle, 
  AlertCircle 
} from 'lucide-vue-next'
import { useVideoStore } from '../store/video'

// 使用video store
const videoStore = useVideoStore()

// 模态框状态
const isOpen = computed(() => videoStore.isVoiceModalOpen)

// 步骤控制
const currentStep = ref(1)

// 音色配置
const cloneConfig = ref({
  name: '',
  description: ''
})

// 自动录制相关状态
const isAutoRecording = ref(false)
const currentSentenceIndex = ref(0)
const completedSentences = ref(0)
const recordedSentences = ref<Array<{ text: string, timestamp: number }>>([])
const isRecordingComplete = ref(false)
const remainingTime = ref(2)

// 定时器引用
const recordingTimer = ref<number | null>(null)
const countdownTimer = ref<number | null>(null)

// 生成状态
const cloneStatus = ref<'processing' | 'success' | 'error' | null>(null)
const processingProgress = ref(0)

// 20句训练文本
const sentences = [
  "大家好，我是您的AI助手，很高兴为您服务。",
  "今天天气真不错，阳光明媚，适合外出活动。",
  "学习是一个持续的过程，需要我们保持耐心和毅力。",
  "科技的发展让我们的生活变得更加便利和高效。",
  "音乐是人类情感表达的重要方式之一。",
  "健康的生活方式包括合理饮食和适量运动。",
  "阅读可以开阔我们的视野，丰富我们的知识。",
  "团队合作是成功完成项目的关键因素。",
  "创新思维能够帮助我们解决复杂的问题。",
  "时间管理对于提高工作效率非常重要。",
  "环境保护是我们每个人的责任和义务。",
  "沟通技巧在人际交往中起着重要作用。",
  "持续学习能够让我们跟上时代的步伐。",
  "积极的心态有助于我们克服困难和挑战。",
  "艺术创作能够表达人类内心深处的情感。",
  "科学研究推动着人类文明的不断进步。",
  "友谊是人生中最珍贵的财富之一。",
  "梦想给我们前进的动力和方向。",
  "感恩的心让我们更加珍惜拥有的一切。",
  "未来充满无限可能，让我们一起努力创造。"
]

// 开始自动录制流程
const startAutoRecording = () => {
  isAutoRecording.value = true
  isRecordingComplete.value = false
  currentSentenceIndex.value = 0
  completedSentences.value = 0
  recordedSentences.value = []
  
  // 开始录制第一句
  recordCurrentSentence()
}

// 录制当前句子
const recordCurrentSentence = () => {
  if (currentSentenceIndex.value >= sentences.length) {
    // 所有句子录制完成
    completeRecording()
    return
  }

  remainingTime.value = 2
  
  // 开始倒计时
  countdownTimer.value = window.setInterval(() => {
    remainingTime.value--
    if (remainingTime.value <= 0) {
      if (countdownTimer.value) {
        clearInterval(countdownTimer.value)
        countdownTimer.value = null
      }
    }
  }, 1000)

  // 2秒后自动切换到下一句
  recordingTimer.value = window.setTimeout(() => {
    // 清理倒计时定时器
    if (countdownTimer.value) {
      clearInterval(countdownTimer.value)
      countdownTimer.value = null
    }
    
    // 记录当前句子为已录制
    recordedSentences.value.push({
      text: sentences[currentSentenceIndex.value],
      timestamp: Date.now()
    })
    
    completedSentences.value++
    currentSentenceIndex.value++
    
    // 继续录制下一句
    if (currentSentenceIndex.value < sentences.length && isAutoRecording.value) {
      recordCurrentSentence()
    } else {
      completeRecording()
    }
  }, 2000)
}

// 完成录制
const completeRecording = () => {
  isAutoRecording.value = false
  isRecordingComplete.value = true
  
  // 清理定时器
  if (recordingTimer.value) {
    clearTimeout(recordingTimer.value)
    recordingTimer.value = null
  }
  if (countdownTimer.value) {
    clearInterval(countdownTimer.value)
    countdownTimer.value = null
  }
}

// 停止自动录制
const stopAutoRecording = () => {
  isAutoRecording.value = false
  
  // 清理定时器
  if (recordingTimer.value) {
    clearTimeout(recordingTimer.value)
    recordingTimer.value = null
  }
  if (countdownTimer.value) {
    clearInterval(countdownTimer.value)
    countdownTimer.value = null
  }
}

// 方法
const closeModal = () => {
  videoStore.toggleVoiceModal()
  resetModal()
}

const resetModal = () => {
  currentStep.value = 1
  cloneConfig.value = { name: '', description: '' }
  currentSentenceIndex.value = 0
  completedSentences.value = 0
  recordedSentences.value = []
  isRecordingComplete.value = false
  cloneStatus.value = null
  processingProgress.value = 0
  
  // 清理录制状态
  if (isAutoRecording.value) {
    stopAutoRecording()
  }
}

const nextStep = () => {
  if (currentStep.value < 3) {
    currentStep.value++
    if (currentStep.value === 3) {
      startCloning()
    }
  }
}

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

const startCloning = () => {
  cloneStatus.value = 'processing'
  processingProgress.value = 0
  
  // 模拟处理进度
  const interval = setInterval(() => {
    processingProgress.value += Math.random() * 10
    if (processingProgress.value >= 100) {
      processingProgress.value = 100
      clearInterval(interval)
      
      // 模拟成功或失败
      setTimeout(() => {
        cloneStatus.value = Math.random() > 0.2 ? 'success' : 'error'
      }, 1000)
    }
  }, 500)
}

const retryCloning = () => {
  startCloning()
}

const testGeneratedVoice = () => {
  // 播放测试音频
  console.log('播放生成的音色测试')
}

const completeCloning = () => {
  // 添加到自定义音色列表
  const newVoice = {
    id: `custom-${Date.now()}`,
    name: cloneConfig.value.name,
    type: 'custom',
    gender: 'neutral' as const,
    language: 'zh-CN',
    description: cloneConfig.value.description || '用户定制音色',
    audioUrl: '',
    isDefault: false
  }
  
  videoStore.addCustomVoice(newVoice)
  // 自动选中新添加的音色
  videoStore.selectVoice(newVoice.id)
  closeModal()
}

// 清理资源
onUnmounted(() => {
  if (isAutoRecording.value) {
    stopAutoRecording()
  }
})
</script>

<style scoped>
.scrollbar-thin::-webkit-scrollbar {
  width: 4px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background: #374151;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background: #6b7280;
  border-radius: 2px;
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
</style>