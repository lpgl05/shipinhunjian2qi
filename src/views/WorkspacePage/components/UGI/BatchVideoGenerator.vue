<template>
  <div class="batch-video-generator bg-gray-800 rounded-xl p-6 border border-gray-700">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-lg font-semibold text-gray-50 flex items-center gap-2">
        <Film :size="20" class="text-blue-400" />
        批量视频生成
      </h3>
      <span class="text-sm text-gray-400">共3个素材, 将生成3个视频</span>
    </div>

    <!-- 视频混剪步骤说明 -->
    <div class="steps-section mb-6">
      <h4 class="text-md font-semibold text-gray-200 mb-4">视频混剪步骤</h4>
      <div class="grid grid-cols-2 gap-4">
        <div class="step-item bg-gray-750 rounded-lg p-4">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">1</div>
            <span class="text-sm font-medium text-gray-200">参数配置</span>
          </div>
          <p class="text-xs text-gray-400">设置视频尺寸、时长、风格等参数</p>
        </div>
        
        <div class="step-item bg-gray-750 rounded-lg p-4">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">2</div>
            <span class="text-sm font-medium text-gray-200">素材上传</span>
          </div>
          <p class="text-xs text-gray-400">上传视频、图片、音频等创作素材</p>
        </div>
        
        <div class="step-item bg-gray-750 rounded-lg p-4">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">3</div>
            <span class="text-sm font-medium text-gray-200">脚本生成</span>
          </div>
          <p class="text-xs text-gray-400">AI生成视频脚本和分镜设计</p>
        </div>
        
        <div class="step-item bg-gray-750 rounded-lg p-4">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">4</div>
            <span class="text-sm font-medium text-gray-200">视频生成</span>
          </div>
          <p class="text-xs text-gray-400">AI自动剪辑生成最终视频</p>
        </div>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="text-center">
      <div class="flex items-center justify-center gap-4">
        <button 
          class="btn-primary flex items-center justify-center gap-2 px-8 py-3 text-lg font-semibold whitespace-nowrap"
          @click="handleStartEditing"
        >
          <Play :size="20" />
          <span class="whitespace-nowrap">开始编辑</span>
        </button>
        <button 
          class="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:brightness-110 transition-all flex items-center justify-center gap-2 text-lg font-semibold whitespace-nowrap"
          @click="handleAutoConfig"
        >
          <Wand2 :size="20" />
          <span class="whitespace-nowrap">自动配置</span>
        </button>
      </div>
      <p class="text-xs text-gray-500 mt-2">点击开始进入视频创作工作台</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  Film, 
  Play,
  Wand2
} from 'lucide-vue-next'

// 开始编辑
const handleStartEditing = () => {
  // 触发UGI事件，激活视频混剪智能体
  emit('select', { agentId: 'video-mixer', action: 'start-editing' })
}

// 自动配置
const handleAutoConfig = () => {
  // 触发UGI事件，打开自动配置
  emit('select', { agentId: 'video-mixer', action: 'auto-config' })
}

// 定义事件
const emit = defineEmits<{
  select: [data: any]
}>()
</script>

<style scoped>
.step-item {
  transition: all 0.2s ease;
}

.step-item:hover {
  background-color: #374151;
}
</style>