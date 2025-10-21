<template>
  <div class="video-config h-full overflow-y-auto scrollbar-thin p-6 bg-gray-900">
    <div class="max-w-4xl mx-auto space-y-6">
      <!-- 标题 -->
      <div class="mb-8">
        <h3 class="text-2xl font-bold text-gray-50 mb-2">视频参数配置</h3>
        <p class="text-gray-400">选择模板或自定义配置，开始你的创作之旅</p>
      </div>

      <!-- 模板选择区 -->
      <div class="templates-section">
        <h4 class="text-sm font-semibold text-gray-300 mb-4">选择模板</h4>
        <div class="grid grid-cols-2 gap-4">
          <!-- 竖版模板 -->
          <div
            class="template-card p-6 bg-gray-800 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:border-gray-600"
            :class="selectedTemplate === 'vertical' ? 'border-blue-500 ring-2 ring-blue-500/50' : 'border-gray-700'"
            @click="selectTemplate('vertical')"
          >
            <div class="aspect-[9/16] bg-gray-700 rounded-lg mb-4 flex items-center justify-center">
              <Smartphone :size="48" class="text-gray-500" />
            </div>
            <h5 class="text-lg font-semibold text-gray-50 mb-2">竖版模板</h5>
            <p class="text-sm text-gray-400">9:16 适合抖音、快手等短视频平台</p>
          </div>

          <!-- 横版模板 -->
          <div
            class="template-card p-6 bg-gray-800 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:border-gray-600"
            :class="selectedTemplate === 'horizontal' ? 'border-blue-500 ring-2 ring-blue-500/50' : 'border-gray-700'"
            @click="selectTemplate('horizontal')"
          >
            <div class="aspect-video bg-gray-700 rounded-lg mb-4 flex items-center justify-center">
              <Monitor :size="48" class="text-gray-500" />
            </div>
            <h5 class="text-lg font-semibold text-gray-50 mb-2">横版模板</h5>
            <p class="text-sm text-gray-400">16:9 适合B站、YouTube等平台</p>
          </div>
        </div>
      </div>

      <!-- 折叠面板 - 基本信息 -->
      <Disclosure v-slot="{ open }" defaultOpen>
        <DisclosureButton class="accordion-header">
          <div class="flex items-center gap-2">
            <Settings :size="18" class="text-blue-400" />
            <span>基本信息</span>
          </div>
          <ChevronDown 
            :size="20" 
            class="transition-transform duration-200"
            :class="{ 'rotate-180': open }"
          />
        </DisclosureButton>
        <DisclosurePanel class="accordion-panel">
          <div class="space-y-4">
            <!-- 视频标题 -->
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">视频标题</label>
              <input
                v-model="config.title"
                type="text"
                placeholder="请输入视频标题"
                class="input-primary w-full"
              />
            </div>

            <!-- 视频时长 -->
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">
                目标时长: {{ config.duration }}秒
              </label>
              <input
                v-model.number="config.duration"
                type="range"
                min="15"
                max="300"
                step="5"
                class="slider w-full"
              />
              <div class="flex justify-between text-xs text-gray-500 mt-1">
                <span>15秒</span>
                <span>300秒</span>
              </div>
            </div>

            <!-- 视频分辨率 -->
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">分辨率</label>
              <select v-model="config.resolution" class="input-primary w-full">
                <option value="1080p">1080p (1920x1080)</option>
                <option value="720p">720p (1280x720)</option>
                <option value="4k">4K (3840x2160)</option>
              </select>
            </div>

            <!-- 帧率 -->
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">帧率</label>
              <div class="grid grid-cols-3 gap-3">
                <button
                  v-for="fps in [24, 30, 60]"
                  :key="fps"
                  class="px-4 py-2 rounded-lg border transition-all"
                  :class="config.fps === fps 
                    ? 'bg-blue-500 border-blue-500 text-white' 
                    : 'bg-gray-700 border-gray-600 text-gray-300 hover:border-gray-500'"
                  @click="config.fps = fps"
                >
                  {{ fps }} FPS
                </button>
              </div>
            </div>
          </div>
        </DisclosurePanel>
      </Disclosure>

      <!-- 折叠面板 - 音视频风格 -->
      <Disclosure v-slot="{ open }">
        <DisclosureButton class="accordion-header">
          <div class="flex items-center gap-2">
            <Palette :size="18" class="text-purple-400" />
            <span>音视频风格</span>
          </div>
          <ChevronDown 
            :size="20" 
            class="transition-transform duration-200"
            :class="{ 'rotate-180': open }"
          />
        </DisclosureButton>
        <DisclosurePanel class="accordion-panel">
          <div class="space-y-4">
            <!-- 视频风格 -->
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">视频风格</label>
              <select v-model="config.style" class="input-primary w-full">
                <option value="modern">现代简约</option>
                <option value="vintage">复古怀旧</option>
                <option value="cinematic">电影感</option>
                <option value="energetic">活力动感</option>
              </select>
            </div>

            <!-- 转场效果 -->
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">转场效果</label>
              <select v-model="config.transition" class="input-primary w-full">
                <option value="fade">淡入淡出</option>
                <option value="slide">滑动</option>
                <option value="zoom">缩放</option>
                <option value="dissolve">溶解</option>
              </select>
            </div>

            <!-- 配乐情绪 -->
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">配乐情绪</label>
              <div class="grid grid-cols-2 gap-3">
                <button
                  v-for="mood in ['轻快', '抒情', '激昂', '舒缓']"
                  :key="mood"
                  class="px-4 py-2 rounded-lg border transition-all"
                  :class="config.musicMood === mood 
                    ? 'bg-purple-500 border-purple-500 text-white' 
                    : 'bg-gray-700 border-gray-600 text-gray-300 hover:border-gray-500'"
                  @click="config.musicMood = mood"
                >
                  {{ mood }}
                </button>
              </div>
            </div>
          </div>
        </DisclosurePanel>
      </Disclosure>

      <!-- 折叠面板 - 字幕与标题 -->
      <Disclosure v-slot="{ open }">
        <DisclosureButton class="accordion-header">
          <div class="flex items-center gap-2">
            <Type :size="18" class="text-green-400" />
            <span>字幕与标题</span>
          </div>
          <ChevronDown 
            :size="20" 
            class="transition-transform duration-200"
            :class="{ 'rotate-180': open }"
          />
        </DisclosureButton>
        <DisclosurePanel class="accordion-panel">
          <div class="space-y-4">
            <!-- 是否添加字幕 -->
            <div class="flex items-center justify-between">
              <label class="text-sm font-medium text-gray-300">添加字幕</label>
              <button
                class="toggle-switch"
                :class="{ 'active': config.enableSubtitles }"
                @click="config.enableSubtitles = !config.enableSubtitles"
              >
                <div class="toggle-thumb"></div>
              </button>
            </div>

            <!-- 字幕样式 -->
            <div v-if="config.enableSubtitles">
              <label class="block text-sm font-medium text-gray-300 mb-2">字幕样式</label>
              <select v-model="config.subtitleStyle" class="input-primary w-full">
                <option value="modern">现代风格</option>
                <option value="classic">经典风格</option>
                <option value="bold">粗体醒目</option>
                <option value="minimal">极简风格</option>
              </select>
            </div>

            <!-- 字幕位置 -->
            <div v-if="config.enableSubtitles">
              <label class="block text-sm font-medium text-gray-300 mb-2">字幕位置</label>
              <div class="grid grid-cols-3 gap-3">
                <button
                  v-for="pos in ['顶部', '中间', '底部']"
                  :key="pos"
                  class="px-4 py-2 rounded-lg border transition-all"
                  :class="config.subtitlePosition === pos 
                    ? 'bg-green-500 border-green-500 text-white' 
                    : 'bg-gray-700 border-gray-600 text-gray-300 hover:border-gray-500'"
                  @click="config.subtitlePosition = pos"
                >
                  {{ pos }}
                </button>
              </div>
            </div>
          </div>
        </DisclosurePanel>
      </Disclosure>

      <!-- 保存配置按钮 -->
      <div class="flex justify-end pt-4">
        <button class="btn-secondary flex items-center gap-2">
          <Save :size="18" />
          <span>保存为默认配置</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue'
import { 
  Settings, 
  Palette, 
  Type, 
  ChevronDown,
  Smartphone,
  Monitor,
  Save
} from 'lucide-vue-next'

// 配置数据
const config = reactive({
  title: '',
  duration: 60,
  resolution: '1080p',
  fps: 30,
  style: 'modern',
  transition: 'fade',
  musicMood: '轻快',
  enableSubtitles: true,
  subtitleStyle: 'modern',
  subtitlePosition: '底部'
})

// 选中的模板
const selectedTemplate = ref('')

// 选择模板
const selectTemplate = (template: 'vertical' | 'horizontal') => {
  selectedTemplate.value = template
  
  // 自动填充配置
  if (template === 'vertical') {
    config.resolution = '1080p'
    config.fps = 30
    config.style = 'modern'
  } else {
    config.resolution = '1080p'
    config.fps = 60
    config.style = 'cinematic'
  }
}
</script>

<style scoped>
/* 折叠面板样式 */
.accordion-header {
  @apply w-full flex items-center justify-between px-5 py-4 bg-gray-800 rounded-lg text-gray-50 font-medium hover:bg-gray-700 transition-all cursor-pointer;
}

.accordion-panel {
  @apply px-5 py-4 bg-gray-800/50 rounded-lg mt-2;
}

/* 输入框样式 */
.input-primary {
  @apply px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-gray-50 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all;
}

/* 滑块样式 */
.slider {
  @apply appearance-none h-2 bg-gray-700 rounded-full outline-none;
}

.slider::-webkit-slider-thumb {
  @apply appearance-none w-5 h-5 bg-gradient-to-r from-blue-500 to-violet-500 rounded-full cursor-pointer hover:scale-110 transition-transform;
}

.slider::-moz-range-thumb {
  @apply w-5 h-5 bg-gradient-to-r from-blue-500 to-violet-500 rounded-full cursor-pointer hover:scale-110 transition-transform border-0;
}

/* 切换开关样式 */
.toggle-switch {
  @apply relative w-12 h-6 bg-gray-700 rounded-full transition-all cursor-pointer;
}

.toggle-switch.active {
  @apply bg-gradient-to-r from-blue-500 to-violet-500;
}

.toggle-thumb {
  @apply absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200;
}

.toggle-switch.active .toggle-thumb {
  @apply translate-x-6;
}

/* 按钮样式 */
.btn-secondary {
  @apply px-6 py-2.5 bg-gray-700 text-gray-200 rounded-lg font-medium hover:bg-gray-600 transition-all duration-200;
}

/* 滚动条 */
.scrollbar-thin::-webkit-scrollbar {
  width: 6px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background: #4B5563;
  border-radius: 3px;
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: #6B7280;
}
</style>

