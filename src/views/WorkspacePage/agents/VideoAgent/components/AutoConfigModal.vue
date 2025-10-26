<template>
  <TransitionRoot :show="true" as="template">
    <Dialog as="div" class="relative z-50" @close="$emit('close')">
      <!-- 背景遮罩 -->
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" />
      </TransitionChild>

      <!-- 模态框 -->
      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4">
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel class="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-gray-800 border border-gray-700 shadow-2xl transition-all">
              <!-- 头部 -->
              <div class="flex items-center justify-between p-6 border-b border-gray-700">
                <DialogTitle class="text-xl font-bold text-gray-50 flex items-center gap-3">
                  <Wand2 :size="24" class="text-purple-400" />
                  <span>AI智能配置</span>
                </DialogTitle>
                <button
                  class="p-2 text-gray-400 hover:text-gray-50 hover:bg-gray-700 rounded-lg transition-all"
                  @click="$emit('close')"
                >
                  <X :size="20" />
                </button>
              </div>

              <!-- 内容区 -->
              <div class="p-6">
                <!-- 步骤1：描述需求 -->
                <div v-if="step === 1" class="space-y-6">
                  <div class="text-center">
                    <div class="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MessageSquare :size="32" class="text-white" />
                    </div>
                    <h3 class="text-lg font-semibold text-gray-50 mb-2">描述您的视频需求</h3>
                    <p class="text-gray-400">请详细描述您想要制作的视频内容，AI将为您智能配置参数</p>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">需求描述</label>
                    <textarea
                      v-model="userDescription"
                      placeholder="例如：制作一个产品宣传视频，时长60秒，竖版格式，现代风格，需要字幕，使用权威音色..."
                      rows="4"
                      class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-50 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all resize-none"
                    ></textarea>
                  </div>

                  <div class="flex justify-end">
                    <button
                      class="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      :disabled="!userDescription.trim()"
                      @click="startAutoConfig"
                    >
                      开始智能配置
                    </button>
                  </div>
                </div>

                <!-- 步骤2：AI分析中 -->
                <div v-if="step === 2" class="space-y-6">
                  <div class="text-center">
                    <div class="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                      <Brain :size="32" class="text-white" />
                    </div>
                    <h3 class="text-lg font-semibold text-gray-50 mb-2">AI正在分析您的需求</h3>
                    <p class="text-gray-400">正在智能识别视频参数...</p>
                  </div>

                  <div class="space-y-3">
                    <div class="flex items-center gap-3 p-3 bg-gray-700 rounded-lg">
                      <div class="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                      <span class="text-gray-300">分析视频格式和尺寸...</span>
                    </div>
                    <div class="flex items-center gap-3 p-3 bg-gray-700 rounded-lg">
                      <div class="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style="animation-delay: 0.5s"></div>
                      <span class="text-gray-300">识别视频风格和转场...</span>
                    </div>
                    <div class="flex items-center gap-3 p-3 bg-gray-700 rounded-lg">
                      <div class="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style="animation-delay: 1s"></div>
                      <span class="text-gray-300">配置字幕和音色参数...</span>
                    </div>
                  </div>
                </div>

                <!-- 步骤3：配置完成 -->
                <div v-if="step === 3" class="space-y-6">
                  <div class="text-center">
                    <div class="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle :size="32" class="text-white" />
                    </div>
                    <h3 class="text-lg font-semibold text-gray-50 mb-2">配置完成！</h3>
                    <p class="text-gray-400">已根据您的需求完成基础配置</p>
                  </div>

                  <!-- 配置结果预览 -->
                  <div class="bg-gray-700 rounded-lg p-4 space-y-3">
                    <h4 class="font-medium text-gray-200">配置结果：</h4>
                    <div class="grid grid-cols-2 gap-3 text-sm">
                      <div class="flex justify-between">
                        <span class="text-gray-400">视频格式：</span>
                        <span class="text-gray-50">{{ autoConfigResult.aspectRatio === '9:16' ? '竖版 (9:16)' : '横版 (16:9)' }}</span>
                      </div>
                      <div class="flex justify-between">
                        <span class="text-gray-400">视频时长：</span>
                        <span class="text-gray-50">{{ autoConfigResult.duration }}秒</span>
                      </div>
                      <div class="flex justify-between">
                        <span class="text-gray-400">视频风格：</span>
                        <span class="text-gray-50">{{ getStyleLabel(autoConfigResult.style) }}</span>
                      </div>
                      <div class="flex justify-between">
                        <span class="text-gray-400">字幕配置：</span>
                        <span class="text-gray-50">{{ autoConfigResult.enableSubtitles ? '已启用' : '未启用' }}</span>
                      </div>
                      <div class="flex justify-between">
                        <span class="text-gray-400">音色类型：</span>
                        <span class="text-gray-50">{{ getVoiceLabel(autoConfigResult.voiceType) }}</span>
                      </div>
                      <div class="flex justify-between">
                        <span class="text-gray-400">分辨率：</span>
                        <span class="text-gray-50">{{ autoConfigResult.resolution }}</span>
                      </div>
                    </div>
                  </div>

                  <!-- 操作按钮 -->
                  <div class="flex gap-3">
                    <button
                      class="flex-1 px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-all"
                      @click="goToConfig"
                    >
                      配置调试
                    </button>
                    <button
                      class="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:brightness-110 transition-all"
                      @click="goToNextStep"
                    >
                      下一步上传素材
                    </button>
                  </div>
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import {
  Wand2,
  X,
  MessageSquare,
  Brain,
  CheckCircle
} from 'lucide-vue-next'

// 定义事件
const emit = defineEmits<{
  close: []
  'config-complete': [config: any]
}>()

// 状态
const step = ref(1)
const userDescription = ref('')

// 自动配置结果
const autoConfigResult = reactive({
  aspectRatio: '9:16',
  title: '',
  duration: 60,
  resolution: '1080p',
  fps: 30,
  style: 'modern',
  transition: 'fade',
  enableSubtitles: true,
  subtitleStyle: 'modern',
  subtitlePosition: 'bottom',
  voiceType: 'authoritative',
  voiceSpeed: 1.0
})

// 开始自动配置
const startAutoConfig = () => {
  step.value = 2
  
  // 模拟AI分析过程
  setTimeout(() => {
    // 模拟AI分析用户描述并生成配置
    analyzeUserDescription()
    step.value = 3
  }, 3000)
}

// 分析用户描述（模拟AI智能体）
const analyzeUserDescription = () => {
  const description = userDescription.value.toLowerCase()
  
  // 智能识别视频格式
  if (description.includes('竖版') || description.includes('抖音') || description.includes('快手')) {
    autoConfigResult.aspectRatio = '9:16'
  } else if (description.includes('横版') || description.includes('b站') || description.includes('youtube')) {
    autoConfigResult.aspectRatio = '16:9'
  }
  
  // 智能识别时长
  const durationMatch = description.match(/(\d+)\s*秒/)
  if (durationMatch && durationMatch[1]) {
    autoConfigResult.duration = parseInt(durationMatch[1])
  }
  
  // 智能识别风格
  if (description.includes('现代') || description.includes('简约')) {
    autoConfigResult.style = 'modern'
  } else if (description.includes('电影') || description.includes('大片')) {
    autoConfigResult.style = 'cinematic'
  } else if (description.includes('活力') || description.includes('动感')) {
    autoConfigResult.style = 'vibrant'
  }
  
  // 智能识别字幕需求
  if (description.includes('字幕') || description.includes('文字')) {
    autoConfigResult.enableSubtitles = true
  }
  
  // 智能识别音色
  if (description.includes('权威') || description.includes('专业')) {
    autoConfigResult.voiceType = 'authoritative'
  } else if (description.includes('平静') || description.includes('温和')) {
    autoConfigResult.voiceType = 'calm'
  } else if (description.includes('活力') || description.includes('激情')) {
    autoConfigResult.voiceType = 'energetic'
  }
  
  // 设置默认标题
  if (description.includes('产品')) {
    autoConfigResult.title = '产品宣传视频'
  } else if (description.includes('营销')) {
    autoConfigResult.title = '营销推广视频'
  } else {
    autoConfigResult.title = '智能生成视频'
  }
}

// 获取样式标签
const getStyleLabel = (style: string) => {
  const styles: Record<string, string> = {
    modern: '现代',
    cinematic: '电影感',
    vibrant: '活力',
    minimal: '简约'
  }
  return styles[style] || style
}

// 获取音色标签
const getVoiceLabel = (voice: string) => {
  const voices: Record<string, string> = {
    authoritative: '权威',
    calm: '平静',
    energetic: '活力',
    dramatic: '戏剧'
  }
  return voices[voice] || voice
}

// 配置调试
const goToConfig = () => {
  // 发送配置结果并关闭模态框
  emit('config-complete', autoConfigResult)
}

// 下一步
const goToNextStep = () => {
  // 发送配置结果并关闭模态框
  emit('config-complete', autoConfigResult)
  // 这里可以触发下一步的流程
  console.log('进入下一步：上传素材')
}
</script>

<style scoped>
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
