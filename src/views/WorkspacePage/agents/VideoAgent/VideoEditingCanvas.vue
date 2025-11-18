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
    <div class="flex-1 overflow-hidden relative">
      <Transition :name="transitionName" mode="out-in">
        <component :is="currentStepComponent" :key="currentStep" />
      </Transition>

      <!-- 重新生成加载遮罩 -->
      <Transition name="fade">
        <div v-if="isRegenerating" class="absolute inset-0 bg-gray-900/95 backdrop-blur-sm flex items-center justify-center z-50">
          <div class="text-center">
            <!-- 加载动画 -->
            <div class="mb-6">
              <div class="relative w-24 h-24 mx-auto">
                <!-- 外圈旋转 -->
                <div class="absolute inset-0 border-4 border-blue-500/30 rounded-full"></div>
                <div class="absolute inset-0 border-4 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
                <!-- 内圈反向旋转 -->
                <div class="absolute inset-3 border-4 border-violet-500/30 rounded-full"></div>
                <div class="absolute inset-3 border-4 border-transparent border-t-violet-500 rounded-full animate-spin-reverse"></div>
                <!-- 中心图标 -->
                <div class="absolute inset-0 flex items-center justify-center">
                  <Sparkles :size="32" class="text-blue-400 animate-pulse" />
                </div>
              </div>
            </div>

            <!-- 文字提示 -->
            <h3 class="text-xl font-semibold text-white mb-2">正在重新生成视频</h3>
            <p class="text-gray-400 text-sm mb-6">AI 正在为您创作精彩内容...</p>

            <!-- 进度条 -->
            <div class="w-64 mx-auto">
              <div class="h-2 bg-gray-700 rounded-full overflow-hidden">
                <div class="h-full bg-gradient-to-r from-blue-500 to-violet-500 rounded-full animate-progress"></div>
              </div>
              <p class="text-xs text-gray-500 mt-2">预计需要 2-5 秒</p>
            </div>
          </div>
        </div>
      </Transition>
    </div>

    <!-- 底部导航栏 -->
    <div class="bottom-nav flex items-center justify-center px-6 py-4 border-t border-gray-700 bg-gray-900">
      <!-- 导航按钮 - 居中 -->
      <div class="flex items-center gap-3">
        <!-- 上一步 -->
        <button
          v-if="currentStep > 1 && currentStep < 4"
          class="btn-secondary flex items-center gap-2"
          @click="previousStep"
        >
          <ChevronLeft :size="20" />
          <span>上一步</span>
        </button>

        <!-- 第4步的按钮组 -->
        <template v-if="currentStep === 4">
          <!-- 上一步 -->
          <button
            class="btn-secondary flex items-center gap-2"
            @click="previousStep"
          >
            <ChevronLeft :size="20" />
            <span>上一步</span>
          </button>

          <!-- 重新生成 -->
          <button
            class="btn-primary flex items-center gap-2"
            @click="handleRegenerate"
          >
            <RefreshCw :size="20" />
            <span>重新生成</span>
          </button>

          <!-- 完成创作 -->
          <button
            class="btn-primary flex items-center gap-2"
            @click="handleComplete"
          >
            <Sparkles :size="20" />
            <span>完成创作</span>
          </button>
        </template>

        <!-- 下一步 -->
        <button
          v-if="currentStep < 4"
          class="btn-primary flex items-center gap-2"
          @click="nextStep"
        >
          <span>下一步</span>
          <ChevronRight :size="20" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Check, ChevronLeft, ChevronRight, Sparkles, RefreshCw } from 'lucide-vue-next'
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

// 重新生成（显示加载动画，然后刷新第4步结果）
const isRegenerating = ref(false)

const handleRegenerate = () => {
  console.log('重新生成视频...')
  isRegenerating.value = true
  
  // 模拟视频生成过程（实际应该调用API）
  setTimeout(() => {
    // 生成完成，刷新结果
    isRegenerating.value = false
    // 强制刷新第4步组件
    currentStep.value = 3
    setTimeout(() => {
      currentStep.value = 4
    }, 50)
  }, 3000) // 3秒模拟生成时间
}

// 完成创作（带动画过渡）
const handleComplete = () => {
  console.log('创作完成！关闭预览窗口')
  // 添加完成动画效果
  const canvas = document.querySelector('.video-editing-canvas')
  if (canvas) {
    canvas.classList.add('completing')
    setTimeout(() => {
      // 重置到第1步，相当于开始新的创作
      currentStep.value = 1
      transitionName.value = 'slide-right'
      // 移除动画类
      setTimeout(() => {
        canvas.classList.remove('completing')
      }, 300)
    }, 400)
  } else {
    // 降级处理
    currentStep.value = 1
    transitionName.value = 'slide-right'
  }
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

/* 淡入淡出动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 反向旋转动画 */
@keyframes spin-reverse {
  from {
    transform: rotate(360deg);
  }
  to {
    transform: rotate(0deg);
  }
}

.animate-spin-reverse {
  animation: spin-reverse 1s linear infinite;
}

/* 进度条动画 */
@keyframes progress {
  0% {
    width: 0%;
  }
  100% {
    width: 100%;
  }
}

.animate-progress {
  animation: progress 3s ease-in-out infinite;
}

/* 完成创作动画 */
.video-editing-canvas.completing {
  animation: complete 0.7s ease-in-out;
}

@keyframes complete {
  0% {
    opacity: 1;
    transform: scale(1);
  }
  30% {
    opacity: 0.8;
    transform: scale(1.02);
  }
  50% {
    opacity: 0;
    transform: scale(0.9) translateY(-10px);
  }
  70% {
    opacity: 0;
    transform: scale(0.9) translateY(10px);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
</style>


