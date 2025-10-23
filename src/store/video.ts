import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface VideoClip {
  id: string
  thumbnail?: string
  title: string
  duration: string
  startTime?: number
  endTime?: number
  volume?: number
}

// 音色配置接口
export interface VoiceConfig {
  id: string
  name: string
  type: 'built-in' | 'custom' | 'cloned'
  gender: 'male' | 'female' | 'neutral'
  language: string
  description?: string
  audioUrl?: string
  isDefault?: boolean
}

// 音色克隆配置
export interface VoiceCloneConfig {
  id: string
  name: string
  originalAudioUrl: string
  clonedVoiceId?: string
  status: 'uploading' | 'processing' | 'completed' | 'failed'
  progress?: number
  createdAt: Date
}

export const useVideoStore = defineStore('video', () => {
  const currentTimeline = ref<VideoClip[]>([])
  const selectedClipId = ref<string | null>(null)
  
  // 音色配置相关状态
  const selectedVoiceId = ref<string | null>(null)
  const customVoices = ref<VoiceConfig[]>([
    {
      id: 'custom-test-voice',
      name: '测试音色',
      type: 'custom',
      gender: 'neutral',
      language: 'zh-CN',
      description: '这是一个测试用的定制音色',
      audioUrl: '',
      isDefault: false
    }
  ])
  const voiceClones = ref<VoiceCloneConfig[]>([])
  const isVoiceModalOpen = ref(false)
  
  // 内置音色列表
  const builtInVoices = ref<VoiceConfig[]>([
    {
      id: 'voice-sunny',
      name: '阳光',
      type: 'built-in',
      gender: 'neutral',
      language: 'zh-CN',
      description: '温暖明亮的声音，充满正能量',
      audioUrl: '/voices/sunny.mp3',
      isDefault: true
    },
    {
      id: 'voice-energetic',
      name: '活力',
      type: 'built-in',
      gender: 'neutral',
      language: 'zh-CN',
      description: '充满活力的声音，适合运动和激励内容',
      audioUrl: '/voices/energetic.mp3'
    },
    {
      id: 'voice-calm',
      name: '沉稳',
      type: 'built-in',
      gender: 'neutral',
      language: 'zh-CN',
      description: '沉稳内敛的声音，适合专业和教育内容',
      audioUrl: '/voices/calm.mp3'
    },
    {
      id: 'voice-authoritative',
      name: '权威',
      type: 'built-in',
      gender: 'neutral',
      language: 'zh-CN',
      description: '权威专业的声音，适合新闻和商务内容',
      audioUrl: '/voices/authoritative.mp3'
    },
    {
      id: 'voice-mysterious',
      name: '神秘',
      type: 'built-in',
      gender: 'neutral',
      language: 'zh-CN',
      description: '神秘深邃的声音，适合悬疑和故事内容',
      audioUrl: '/voices/mysterious.mp3'
    },
    {
      id: 'voice-dramatic',
      name: '戏剧',
      type: 'built-in',
      gender: 'neutral',
      language: 'zh-CN',
      description: '富有戏剧张力的声音，适合表演和艺术内容',
      audioUrl: '/voices/dramatic.mp3'
    }
  ])

  // 更新时间线
  const updateTimeline = (clips: VideoClip[]) => {
    currentTimeline.value = clips
  }

  // 添加片段
  const addClip = (clip: VideoClip) => {
    currentTimeline.value.push(clip)
  }

  // 删除片段
  const deleteClip = (clipId: string) => {
    const index = currentTimeline.value.findIndex(c => c.id === clipId)
    if (index !== -1) {
      currentTimeline.value.splice(index, 1)
    }
  }

  // 替换片段
  const replaceClip = (clipId: string, newClip: VideoClip) => {
    const index = currentTimeline.value.findIndex(c => c.id === clipId)
    if (index !== -1) {
      currentTimeline.value[index] = newClip
    }
  }

  // 移动片段
  const moveClip = (fromIndex: number, toIndex: number) => {
    const clip = currentTimeline.value.splice(fromIndex, 1)[0]
    if (clip) {
      currentTimeline.value.splice(toIndex, 0, clip)
    }
  }

  // 更新片段
  const updateClip = (clipId: string, updates: Partial<VideoClip>) => {
    const index = currentTimeline.value.findIndex(c => c.id === clipId)
    if (index !== -1) {
      const currentClip = currentTimeline.value[index]
      if (currentClip) {
        currentTimeline.value[index] = { ...currentClip, ...updates }
      }
    }
  }

  // 选择片段
  const selectClip = (clipId: string | null) => {
    selectedClipId.value = clipId
  }

  // 清空时间线
  const clearTimeline = () => {
    currentTimeline.value = []
    selectedClipId.value = null
  }

  // 音色配置相关方法
  const selectVoice = (voiceId: string) => {
    selectedVoiceId.value = voiceId
  }

  const addCustomVoice = (voice: VoiceConfig) => {
    customVoices.value.push(voice)
  }

  const deleteCustomVoice = (voiceId: string) => {
    const index = customVoices.value.findIndex(v => v.id === voiceId)
    if (index !== -1) {
      customVoices.value.splice(index, 1)
    }
  }

  const addVoiceClone = (clone: VoiceCloneConfig) => {
    voiceClones.value.push(clone)
  }

  const updateVoiceClone = (cloneId: string, updates: Partial<VoiceCloneConfig>) => {
    const index = voiceClones.value.findIndex(c => c.id === cloneId)
    if (index !== -1) {
      voiceClones.value[index] = { ...voiceClones.value[index], ...updates }
    }
  }

  const deleteVoiceClone = (cloneId: string) => {
    const index = voiceClones.value.findIndex(c => c.id === cloneId)
    if (index !== -1) {
      voiceClones.value.splice(index, 1)
    }
  }

  const toggleVoiceModal = () => {
    isVoiceModalOpen.value = !isVoiceModalOpen.value
  }

  // 获取所有可用音色
  const getAllVoices = () => {
    return [
      ...builtInVoices.value,
      ...customVoices.value,
      ...voiceClones.value
        .filter(clone => clone.status === 'completed')
        .map(clone => ({
          id: clone.clonedVoiceId || clone.id,
          name: clone.name,
          type: 'cloned' as const,
          gender: 'neutral' as const,
          language: 'zh-CN',
          description: `克隆音色：${clone.name}`
        }))
    ]
  }

  return {
    // 原有状态和方法
    currentTimeline,
    selectedClipId,
    updateTimeline,
    addClip,
    deleteClip,
    replaceClip,
    moveClip,
    updateClip,
    selectClip,
    clearTimeline,
    
    // 音色配置相关
    selectedVoiceId,
    customVoices,
    voiceClones,
    builtInVoices,
    isVoiceModalOpen,
    selectVoice,
    addCustomVoice,
    deleteCustomVoice,
    addVoiceClone,
    updateVoiceClone,
    deleteVoiceClone,
    toggleVoiceModal,
    getAllVoices
  }
})

