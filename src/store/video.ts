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

export const useVideoStore = defineStore('video', () => {
  const currentTimeline = ref<VideoClip[]>([])
  const selectedClipId = ref<string | null>(null)

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
    currentTimeline.value.splice(toIndex, 0, clip)
  }

  // 更新片段
  const updateClip = (clipId: string, updates: Partial<VideoClip>) => {
    const index = currentTimeline.value.findIndex(c => c.id === clipId)
    if (index !== -1) {
      currentTimeline.value[index] = { ...currentTimeline.value[index], ...updates }
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

  return {
    currentTimeline,
    selectedClipId,
    updateTimeline,
    addClip,
    deleteClip,
    replaceClip,
    moveClip,
    updateClip,
    selectClip,
    clearTimeline
  }
})

