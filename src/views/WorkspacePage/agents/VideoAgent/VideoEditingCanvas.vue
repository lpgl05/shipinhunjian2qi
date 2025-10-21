<template>
  <div class="video-editing-canvas h-full flex flex-col bg-gray-800">
    <!-- 步骤指示器 -->
    <div class="step-indicator flex items-center justify-center gap-2 py-4 border-b border-gray-700 bg-gray-900">
      <div 
        v-for="step in 4" 
        :key="step"
        class="flex items-center"
      >
        <!-- 步骤圆点 -->
        <div 
          class="step-dot w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300"
          :class="[
            step === currentStep 
              ? 'bg-gradient-to-r from-blue-500 to-violet-500 text-white scale-110' 
              : step < currentStep
                ? 'bg-emerald-500 text-white'
                : 'bg-gray-700 text-gray-400'
          ]"
        >
          <Check v-if="step < currentStep" :size="16" />
          <span v-else>{{ step }}</span>
        </div>

        <!-- 连接线 -->
        <div 
          v-if="step < 4"
          class="w-16 h-1 mx-2 transition-all duration-300"
          :class="step < currentStep ? 'bg-emerald-500' : 'bg-gray-700'"
        ></div>
      </div>
    </div>

    <!-- 步骤内容区 -->
    <div class="flex-1 overflow-hidden">
      <Transition :name="transitionName" mode="out-in">
        <component :is="currentStepComponent" :key="currentStep" />
      </Transition>
    </div>

    <!-- 底部导航栏 -->
    <div class="bottom-nav flex items-center justify-between px-6 py-4 border-t border-gray-700 bg-gray-900">
      <!-- 左侧：步骤信息 -->
      <div class="text-sm text-gray-400">
        步骤 {{ currentStep }}/4: {{ stepTitles[currentStep - 1] }}
      </div>

      <!-- 右侧：导航按钮 -->
      <div class="flex items-center gap-3">
        <!-- 上一步 -->
        <button
          v-if="currentStep > 1"
          class="btn-secondary flex items-center gap-2"
          @click="previousStep"
        >
          <ChevronLeft :size="20" />
          <span>上一步</span>
        </button>

        <!-- 下一步/完成 -->
        <button
          v-if="currentStep < 4"
          class="btn-primary flex items-center gap-2"
          @click="nextStep"
        >
          <span>下一步</span>
          <ChevronRight :size="20} />
        </button>
        <button
          v-else
          class="btn-primary flex items-center gap-2"
          @click="handleComplete"
        >
          <Sparkles :size="20} />
          <span>完成创作</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Check, ChevronLeft, ChevronRight, Sparkles } from 'lucide-vue-next'
import VideoConfig from './VideoConfig.vue'
import AssetUploader from './AssetUploader.vue'
import SubtitleGenerator from './SubtitleGenerator.vue'
import VideoResult from './VideoResult.vue'

// 当前步骤
const currentStep = ref(1)

// 过渡方向
const transitionName = ref('slide-left')

// 步骤标题
const stepTitles = [
  '参数配置',
  '素材上传',
  '字幕生成',
  '结果预览'
]

// 步骤组件映射
const stepComponents = {
  1: VideoConfig,
  2: AssetUploader,
  3: SubtitleGenerator,
  4: VideoResult
}

// 当前步骤组件
const currentStepComponent = computed(() => {
  return stepComponents[currentStep.value as keyof typeof stepComponents]
})

// 下一步
const nextStep = () => {
  if (currentStep.value < 4) {
    transitionName.value = 'slide-left'
    currentStep.value++
  }
}

// 上一步
const previousStep = () => {
  if (currentStep.value > 1) {
    transitionName.value = 'slide-right'
    currentStep.value--
  }
}

// 完成创作
const handleComplete = () => {
  console.log('创作完成！')
  // TODO: 处理完成逻辑
}
</script>

<style scoped>
/* 步骤切换动画 - 左滑 */
.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 0.3s ease;
}

.slide-left-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.slide-left-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

/* 步骤切换动画 - 右滑 */
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.3s ease;
}

.slide-right-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.slide-right-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* 按钮样式 */
.btn-primary {
  @apply px-6 py-2.5 bg-gradient-to-r from-blue-500 to-violet-500 text-white rounded-lg font-medium hover:brightness-110 transform hover:scale-105 active:scale-95 transition-all duration-200;
}

.btn-secondary {
  @apply px-6 py-2.5 bg-gray-700 text-gray-200 rounded-lg font-medium hover:bg-gray-600 transition-all duration-200;
}
</style>

