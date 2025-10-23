<template>
  <div class="voice-selector">
    <!-- 内置音色图标选择 -->
    <div class="grid grid-cols-3 gap-4 mb-4">
      <div
        v-for="voice in builtInVoices"
        :key="voice.id"
        @click="selectVoice(voice.id)"
        class="voice-avatar-card flex flex-col items-center p-3 rounded-lg cursor-pointer transition-all duration-300"
        :class="[
          selectedVoiceId === voice.id
            ? 'bg-blue-500/20 border-2 border-blue-500'
            : 'bg-gray-800 border-2 border-gray-600 hover:border-gray-500 hover:bg-gray-700'
        ]"
      >
        <!-- 音色图标 -->
        <div class="w-12 h-12 mb-2 flex items-center justify-center">
          <img 
            :src="getVoiceIcon(voice.id)"
            :alt="voice.name"
            class="w-10 h-10 object-contain"
            :class="selectedVoiceId === voice.id ? 'brightness-110' : 'brightness-90'"
          />
        </div>
        
        <!-- 音色名称 -->
        <span class="text-sm text-gray-300 text-center">{{ voice.name }}</span>
        
        <!-- 播放按钮 -->
        <button
          v-if="voice.audioUrl"
          @click.stop="playVoicePreview(voice)"
          class="mt-2 p-1 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors duration-200"
          :disabled="isPlaying && currentPlayingId === voice.id"
        >
          <Play
            v-if="!isPlaying || currentPlayingId !== voice.id"
            :size="12"
            class="text-gray-300"
          />
          <Pause
            v-else
            :size="12"
            class="text-blue-400"
          />
        </button>
      </div>
    </div>

    <!-- 定制声音按钮 -->
    <button
      @click="handleCustomVoiceClick"
      class="w-full py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2"
      :class="[
        isCustomVoiceSelected
          ? 'bg-blue-500/20 border-2 border-blue-500 text-blue-400'
          : 'bg-gradient-to-r from-blue-500 to-violet-500 text-white hover:from-blue-600 hover:to-violet-600 border-2 border-transparent'
      ]"
    >
      <Mic :size="16" />
      <span>定制声音</span>
    </button>

    <!-- 自定义音色列表（如果有的话） -->
    <div v-if="customVoices.length > 0" class="mt-4">
      <h4 class="text-sm font-medium text-gray-400 mb-2">我的音色</h4>
      <div class="grid grid-cols-3 gap-4">
        <div
          v-for="voice in customVoices"
          :key="voice.id"
          @click="selectVoice(voice.id)"
          class="voice-avatar-card flex flex-col items-center p-3 rounded-lg cursor-pointer transition-all duration-300"
          :class="[
            selectedVoiceId === voice.id
              ? 'bg-blue-500/20 border-2 border-blue-500'
              : 'bg-gray-800 border-2 border-gray-600 hover:border-gray-500 hover:bg-gray-700'
          ]"
        >
          <!-- 自定义音色头像 -->
          <div class="w-12 h-12 rounded-full mb-2 bg-purple-500 flex items-center justify-center text-white font-semibold text-lg">
            {{ voice.name.charAt(0) }}
          </div>
          
          <!-- 音色名称 -->
          <span class="text-sm text-gray-300 text-center truncate w-full">{{ voice.name }}</span>
          
          <!-- 播放按钮 -->
          <button
            v-if="voice.audioUrl"
            @click.stop="playVoicePreview(voice)"
            class="mt-2 p-1 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors duration-200"
            :disabled="isPlaying && currentPlayingId === voice.id"
          >
            <Play
              v-if="!isPlaying || currentPlayingId !== voice.id"
              :size="12"
              class="text-gray-300"
            />
            <Pause
              v-else
              :size="12"
              class="text-blue-400"
            />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Play, Pause, Mic } from 'lucide-vue-next'
import { useVideoStore, type VoiceConfig } from '../store/video'

// 导入音色图标
import sunnyIcon from '../assets/icons/voice/sunny.svg'
import energeticIcon from '../assets/icons/voice/energetic.svg'
import calmIcon from '../assets/icons/voice/calm.svg'
import authoritativeIcon from '../assets/icons/voice/authoritative.svg'
import mysteriousIcon from '../assets/icons/voice/mysterious.svg'
import dramaticIcon from '../assets/icons/voice/dramatic.svg'

// Props
interface Props {
  modelValue?: string | null
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: string | null]
  'openVoiceClone': []
  'select': [voiceId: string]
  'close': []
}>()

// Store
const videoStore = useVideoStore()

// 响应式数据
const isPlaying = ref(false)
const currentPlayingId = ref<string | null>(null)
const audioElement = ref<HTMLAudioElement | null>(null)

// 计算属性
const selectedVoiceId = computed({
  get: () => props.modelValue || videoStore.selectedVoiceId,
  set: (value) => {
    emit('update:modelValue', value)
    videoStore.selectVoice(value || '')
  }
})

const allVoices = computed(() => videoStore.getAllVoices())

const builtInVoices = computed(() => 
  videoStore.getAllVoices().filter(voice => voice.type === 'built-in')
)

const customVoices = computed(() => videoStore.customVoices)

// 检查是否选中了定制声音
const isCustomVoiceSelected = computed(() => {
  const selectedVoice = allVoices.value.find(voice => voice.id === selectedVoiceId.value)
  return selectedVoice?.type === 'custom'
})

// 方法
const selectVoice = (voiceId: string) => {
  selectedVoiceId.value = voiceId
  emit('select', voiceId)
}

// 获取音色图标
const getVoiceIcon = (voiceId: string) => {
  const iconMap: { [key: string]: string } = {
    'voice-sunny': sunnyIcon,
    'voice-energetic': energeticIcon,
    'voice-calm': calmIcon,
    'voice-authoritative': authoritativeIcon,
    'voice-mysterious': mysteriousIcon,
    'voice-dramatic': dramaticIcon
  }
  
  return iconMap[voiceId] || sunnyIcon // 默认使用阳光图标
}

// 处理定制声音按钮点击
const handleCustomVoiceClick = () => {
  emit('openVoiceClone')
}

const playVoicePreview = async (voice: VoiceConfig) => {
  if (!voice.audioUrl) return

  // 停止当前播放
  if (audioElement.value) {
    audioElement.value.pause()
    audioElement.value = null
  }

  if (isPlaying.value && currentPlayingId.value === voice.id) {
    // 如果正在播放同一个音色，则停止
    isPlaying.value = false
    currentPlayingId.value = null
    return
  }

  try {
    // 创建新的音频元素
    audioElement.value = new Audio(voice.audioUrl)
    currentPlayingId.value = voice.id
    isPlaying.value = true

    // 监听播放结束
    audioElement.value.addEventListener('ended', () => {
      isPlaying.value = false
      currentPlayingId.value = null
      audioElement.value = null
    })

    // 监听播放错误
    audioElement.value.addEventListener('error', () => {
      isPlaying.value = false
      currentPlayingId.value = null
      audioElement.value = null
      console.error('音色预览播放失败')
    })

    await audioElement.value.play()
  } catch (error) {
    console.error('音色预览播放失败:', error)
    isPlaying.value = false
    currentPlayingId.value = null
    audioElement.value = null
  }
}

// 头像相关方法
const getAvatarText = (name: string) => {
  // 提取音色名称的第一个字符作为头像文字
  return name.charAt(0)
}

const getAvatarClass = (name: string) => {
  // 根据音色名称返回不同的背景色
  const colorMap: { [key: string]: string } = {
    '阳光': 'bg-yellow-500',
    '活力': 'bg-orange-500', 
    '沉稳': 'bg-blue-500',
    '权威': 'bg-gray-600',
    '神秘': 'bg-purple-500',
    '戏剧': 'bg-red-500'
  }
  
  return colorMap[name] || 'bg-gray-500'
}

const getVoiceTypeClass = (type: VoiceConfig['type']) => {
  switch (type) {
    case 'built-in':
      return 'bg-green-500/20 text-green-400'
    case 'custom':
      return 'bg-blue-500/20 text-blue-400'
    case 'cloned':
      return 'bg-purple-500/20 text-purple-400'
    default:
      return 'bg-gray-500/20 text-gray-400'
  }
}

const getVoiceTypeLabel = (type: VoiceConfig['type']) => {
  switch (type) {
    case 'built-in':
      return '内置'
    case 'custom':
      return '自定义'
    case 'cloned':
      return '克隆'
    default:
      return '未知'
  }
}

const getGenderLabel = (gender: VoiceConfig['gender']) => {
  switch (gender) {
    case 'male':
      return '男声'
    case 'female':
      return '女声'
    case 'neutral':
      return '中性'
    default:
      return '未知'
  }
}

// 组件卸载时清理音频
import { onUnmounted } from 'vue'

onUnmounted(() => {
  if (audioElement.value) {
    audioElement.value.pause()
    audioElement.value = null
  }
})
</script>

<style scoped>
.voice-avatar-card {
  transition: all 0.3s ease;
}

.voice-avatar-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
</style>