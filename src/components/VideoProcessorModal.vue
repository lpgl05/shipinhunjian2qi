<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]" @click.self="$emit('close')">
    <div class="bg-gray-800 rounded-lg border border-gray-700 w-full max-w-2xl max-h-[80vh] overflow-hidden">
      <!-- 头部 -->
      <div class="flex items-center justify-between px-6 py-4 border-b border-gray-700">
        <h2 class="text-xl font-bold text-gray-50 flex items-center gap-3">
          <Sparkles class="text-blue-400" :size="24" />
          <span>AI视频智能处理</span>
        </h2>
        <button 
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-200 transition-colors"
        >
          <X :size="24" />
        </button>
      </div>

      <!-- 内容区域 -->
      <div class="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
        <VideoProcessor :initial-asset="initialAsset" :auto-start="Boolean(initialAsset)" @save="handleSave" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { X, Sparkles } from 'lucide-vue-next'
import { onMounted, onUnmounted, computed } from 'vue'
import VideoProcessor from './VideoProcessor.vue'
import { useAssetStore } from '../store/asset'

const emit = defineEmits<{
  'close': []
  'save': [payload: { file?: File | null, assetId?: string | null, assetName?: string | null, results: any[] }]
}>()

const props = defineProps<{ assetId?: string | null }>()

const assetStore = useAssetStore()
const initialAsset = computed(() => assetStore.assets.find(a => a.id === props.assetId) || null)

const handleSave = (payload: { file?: File | null, assetId?: string | null, assetName?: string | null, results: any[] }) => {
  // 如果来自云盘选择的素材，保存分割片段到“视频片段”文件夹
  if (payload.assetId) {
    assetStore.ensureClipsFolder()
    assetStore.addClipAssets(payload.assetId, payload.results)
    // 切换云盘视图至“视频片段”文件夹，方便用户查看
    const clipsId = assetStore.ensureClipsFolder()
    assetStore.selectFolder(clipsId)
    emit('close')
    return
  }
  // 未选择云盘素材的上传文件暂不支持保存，提示用户
  alert('请从云盘选择一个视频素材后，再进行AI处理并保存片段。')
}

// 监听 ESC 键关闭
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    emit('close')
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>