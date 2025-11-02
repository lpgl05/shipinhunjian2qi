<template>
  <div class="config-preview-panel h-full flex flex-col">
    <!-- 头部 -->
    <div class="flex items-center justify-between p-4 border-b border-gray-700">
      <h2 class="text-lg font-semibold text-gray-50">配置预览</h2>
      <button
        @click="$emit('close')"
        class="p-1 hover:bg-gray-700 rounded-md transition-colors"
      >
        <X class="w-5 h-5 text-gray-400" />
      </button>
    </div>

    <!-- 内容区域 -->
    <div class="flex-1 p-4 overflow-y-auto">
      <div v-if="suggestion" class="space-y-4">
        <div class="bg-gray-800 rounded-lg p-4">
          <h3 class="text-lg font-medium text-gray-50 mb-2">{{ suggestion.title }}</h3>
          <p class="text-gray-400 text-sm">{{ suggestion.description }}</p>
        </div>
        
        <div class="bg-gray-800 rounded-lg p-4">
          <h4 class="text-md font-medium text-gray-50 mb-2">配置详情</h4>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-400">时长:</span>
              <span class="text-gray-50">{{ suggestion.parameters?.duration || 60 }}秒</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-400">宽高比:</span>
              <span class="text-gray-50">{{ suggestion.parameters?.aspectRatio || '16:9' }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-400">分辨率:</span>
              <span class="text-gray-50">{{ suggestion.parameters?.resolution || '1920x1080' }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-400">风格:</span>
              <span class="text-gray-50">{{ suggestion.parameters?.style || '现代' }}</span>
            </div>
          </div>
        </div>

        <div class="bg-gray-800 rounded-lg p-4">
          <h4 class="text-md font-medium text-gray-50 mb-2">字幕配置</h4>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-400">启用字幕:</span>
              <span class="text-gray-50">{{ suggestion.subtitleConfig?.enabled ? '是' : '否' }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-400">字幕样式:</span>
              <span class="text-gray-50">{{ suggestion.subtitleConfig?.style || '默认' }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-400">字幕位置:</span>
              <span class="text-gray-50">{{ suggestion.subtitleConfig?.position || '底部' }}</span>
            </div>
          </div>
        </div>

        <div class="bg-gray-800 rounded-lg p-4">
          <h4 class="text-md font-medium text-gray-50 mb-2">语音配置</h4>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-400">语音类型:</span>
              <span class="text-gray-50">{{ suggestion.voiceConfig?.type || '标准' }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-400">语速:</span>
              <span class="text-gray-50">{{ suggestion.voiceConfig?.speed || 1.0 }}x</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-400">音调:</span>
              <span class="text-gray-50">{{ suggestion.voiceConfig?.pitch || 1.0 }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div v-else class="text-center text-gray-400 mt-8">
        <p>请选择一个配置建议来预览</p>
      </div>
    </div>

    <!-- 底部操作按钮 -->
    <div v-if="suggestion" class="p-4 border-t border-gray-700">
      <div class="flex space-x-3">
        <button
          @click="$emit('apply', suggestion)"
          class="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
        >
          应用配置
        </button>
        <button
          @click="$emit('edit', suggestion)"
          class="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors"
        >
          编辑配置
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { X } from 'lucide-vue-next'

interface Props {
  suggestion: any
}

defineProps<Props>()

defineEmits<{
  close: []
  apply: [suggestion: any]
  edit: [suggestion: any]
}>()
</script>

<style scoped>
.config-preview-panel {
  background: #1f2937;
}
</style>