<template>
  <div class="config-integration">
    <!-- 配置应用确认对话框 -->
    <div 
      v-if="showConfirmDialog" 
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
        <div class="flex items-center gap-3 mb-4">
          <CheckCircle class="w-6 h-6 text-green-400" />
          <h3 class="text-lg font-semibold text-gray-50">应用配置</h3>
        </div>
        
        <div class="mb-4">
          <p class="text-gray-300 mb-3">即将应用以下配置到视频编辑器：</p>
          <div class="bg-gray-700 rounded-lg p-3">
            <p class="text-sm text-gray-200">{{ configSummary }}</p>
          </div>
        </div>

        <!-- 配置差异显示 -->
        <div v-if="configDifferences.length > 0" class="mb-4">
          <p class="text-sm text-gray-400 mb-2">将要修改的项目：</p>
          <div class="bg-gray-700 rounded-lg p-3 max-h-32 overflow-y-auto">
            <div 
              v-for="diff in configDifferences" 
              :key="diff"
              class="text-xs text-gray-300 mb-1"
            >
              {{ diff }}
            </div>
          </div>
        </div>

        <div class="flex gap-3">
          <button
            @click="confirmApplyConfig"
            class="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            确认应用
          </button>
          <button
            @click="cancelApplyConfig"
            class="flex-1 bg-gray-600 hover:bg-gray-700 text-gray-300 px-4 py-2 rounded-lg transition-colors"
          >
            取消
          </button>
        </div>
      </div>
    </div>

    <!-- 配置应用成功提示 -->
    <div 
      v-if="showSuccessMessage"
      class="fixed top-4 right-4 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2"
    >
      <CheckCircle class="w-5 h-5" />
      <span>配置已成功应用到视频编辑器</span>
    </div>

    <!-- 配置应用错误提示 -->
    <div 
      v-if="showErrorMessage"
      class="fixed top-4 right-4 bg-red-600 text-white px-4 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2"
    >
      <AlertCircle class="w-5 h-5" />
      <span>{{ errorMessage }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { CheckCircle, AlertCircle } from 'lucide-vue-next'
import { useConversationalVideoStore } from '@/store/conversationalVideo'
import { ConfigApplicator, type VideoConfigData, defaultVideoConfig } from '@/utils/config/configApplicator'

interface Props {
  targetConfig?: any // VideoConfig组件的配置对象
  onConfigApplied?: (config: VideoConfigData) => void
}

const props = defineProps<Props>()
const emit = defineEmits<{
  configApplied: [config: VideoConfigData]
  configError: [error: string]
}>()

const conversationalStore = useConversationalVideoStore()

// 状态管理
const showConfirmDialog = ref(false)
const showSuccessMessage = ref(false)
const showErrorMessage = ref(false)
const errorMessage = ref('')
const pendingConfig = ref<VideoConfigData | null>(null)
const currentConfig = ref<VideoConfigData>(defaultVideoConfig)

// 计算属性
const configSummary = computed(() => {
  if (!pendingConfig.value) return ''
  return ConfigApplicator.generateConfigSummary(pendingConfig.value)
})

const configDifferences = computed(() => {
  if (!pendingConfig.value) return []
  return ConfigApplicator.compareConfigs(currentConfig.value, pendingConfig.value)
})

// 监听选中的配置建议
watch(
  () => conversationalStore.selectedSuggestion,
  (newSuggestion) => {
    if (newSuggestion) {
      handleConfigSuggestionSelected(newSuggestion)
    }
  }
)

// 监听目标配置变化
watch(
  () => props.targetConfig,
  (newConfig) => {
    if (newConfig) {
      updateCurrentConfig(newConfig)
    }
  },
  { immediate: true, deep: true }
)

/**
 * 处理配置建议被选中
 */
const handleConfigSuggestionSelected = (suggestion: any) => {
  try {
    const newConfig = ConfigApplicator.convertSuggestionToConfig(suggestion)
    
    // 验证配置
    const validation = ConfigApplicator.validateConfig(newConfig)
    if (!validation.valid) {
      showError(`配置验证失败：${validation.errors.join(', ')}`)
      return
    }

    pendingConfig.value = newConfig
    showConfirmDialog.value = true
  } catch (error) {
    console.error('配置转换失败:', error)
    showError('配置转换失败，请重试')
  }
}

/**
 * 更新当前配置
 */
const updateCurrentConfig = (config: any) => {
  try {
    // 从目标配置对象提取配置数据
    const extractedConfig: VideoConfigData = {
      aspectRatio: config.aspectRatio || defaultVideoConfig.aspectRatio,
      title: config.title || defaultVideoConfig.title,
      duration: config.duration || defaultVideoConfig.duration,
      resolution: config.resolution || defaultVideoConfig.resolution,
      fps: config.fps || defaultVideoConfig.fps,
      style: config.style || defaultVideoConfig.style,
      transition: config.transition || defaultVideoConfig.transition,
      enableSubtitles: config.enableSubtitles ?? defaultVideoConfig.enableSubtitles,
      subtitleStyle: config.subtitleStyle || defaultVideoConfig.subtitleStyle,
      subtitlePosition: config.subtitlePosition || defaultVideoConfig.subtitlePosition,
      subtitleFont: config.subtitleFont || defaultVideoConfig.subtitleFont,
      subtitleSticker: config.subtitleSticker || defaultVideoConfig.subtitleSticker,
      voiceType: config.voiceType || defaultVideoConfig.voiceType,
      voiceSpeed: config.voiceSpeed || defaultVideoConfig.voiceSpeed
    }
    
    currentConfig.value = extractedConfig
  } catch (error) {
    console.error('更新当前配置失败:', error)
  }
}

/**
 * 确认应用配置
 */
const confirmApplyConfig = () => {
  if (!pendingConfig.value) return

  try {
    // 应用配置到目标对象
    if (props.targetConfig) {
      ConfigApplicator.applyConfigToTarget(pendingConfig.value, props.targetConfig)
    }

    // 触发事件
    emit('configApplied', pendingConfig.value)
    if (props.onConfigApplied) {
      props.onConfigApplied(pendingConfig.value)
    }

    // 更新当前配置
    currentConfig.value = ConfigApplicator.cloneConfig(pendingConfig.value)

    // 清除选中的建议
    conversationalStore.clearSelectedSuggestion()

    // 显示成功消息
    showConfirmDialog.value = false
    pendingConfig.value = null
    showSuccessMessage.value = true
    
    setTimeout(() => {
      showSuccessMessage.value = false
    }, 3000)

  } catch (error) {
    console.error('应用配置失败:', error)
    showError('应用配置失败，请重试')
  }
}

/**
 * 取消应用配置
 */
const cancelApplyConfig = () => {
  showConfirmDialog.value = false
  pendingConfig.value = null
  
  // 清除选中的建议
  conversationalStore.clearSelectedSuggestion()
}

/**
 * 显示错误消息
 */
const showError = (message: string) => {
  errorMessage.value = message
  showErrorMessage.value = true
  emit('configError', message)
  
  setTimeout(() => {
    showErrorMessage.value = false
    errorMessage.value = ''
  }, 5000)
}

/**
 * 手动应用配置（供外部调用）
 */
const applyConfig = (config: VideoConfigData) => {
  pendingConfig.value = config
  showConfirmDialog.value = true
}

/**
 * 获取当前配置
 */
const getCurrentConfig = (): VideoConfigData => {
  return ConfigApplicator.cloneConfig(currentConfig.value)
}

// 暴露方法给父组件
defineExpose({
  applyConfig,
  getCurrentConfig
})
</script>

<style scoped>
.config-integration {
  position: relative;
}

/* 动画效果 */
.fixed {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 滚动条样式 */
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #4B5563;
  border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #6B7280;
}
</style>