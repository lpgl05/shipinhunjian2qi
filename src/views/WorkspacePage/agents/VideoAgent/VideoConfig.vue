<template>
  <div class="video-config h-full flex bg-gray-900">
    <!-- 左侧配置面板 -->
    <div class="w-1/2 flex flex-col border-r border-gray-700">
      <!-- 顶部操作栏 -->
      <div class="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-800">
        <div class="flex items-center gap-3">
          <h3 class="text-lg font-semibold text-gray-50">视频参数配置</h3>
          <span class="px-2 py-1 bg-blue-600 text-white text-xs rounded-full">步骤 1/4</span>
        </div>
        <div class="flex items-center gap-2">
          <!-- 保存模板按钮 -->
          <button
            class="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-all flex items-center gap-2"
            @click="showSaveTemplateModal = true"
          >
            <Save :size="16" />
            <span>保存模板</span>
          </button>
        </div>
      </div>

      <!-- Sheet切换导航 -->
      <div class="flex border-b border-gray-700 bg-gray-800">
        <button
          v-for="sheet in sheets"
          :key="sheet.id"
          class="sheet-tab"
          :class="{ 'active': activeSheet === sheet.id }"
          @click="activeSheet = sheet.id"
        >
          <component :is="sheet.icon" :size="16" />
          <span>{{ sheet.name }}</span>
        </button>
      </div>

      <!-- Sheet内容区 -->
      <div class="flex-1 overflow-y-auto scrollbar-thin">
        <!-- 模板选择 -->
        <div v-if="activeSheet === 'template'" class="p-6 space-y-6">
          <!-- 基础模板 -->
          <div class="space-y-4">
            <h5 class="text-sm font-medium text-gray-300">基础模板</h5>
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">视频格式</label>
              <select v-model="config.aspectRatio" class="input-primary">
                <option value="9:16">竖版 (9:16) - 适合抖音、快手</option>
                <option value="16:9">横版 (16:9) - 适合B站、YouTube</option>
              </select>
            </div>
          </div>

          <!-- 我的模板 -->
          <div v-if="savedTemplates.length > 0" class="space-y-4">
            <h5 class="text-sm font-medium text-gray-300">我的模板</h5>
            <div class="space-y-2">
              <div
                v-for="template in savedTemplates"
                :key="template.id"
                class="template-item"
                :class="{ 'selected': selectedTemplate === template.id }"
                @click="loadTemplate(template)"
              >
                <div class="flex items-center justify-between">
                  <div>
                    <h6 class="font-medium text-gray-50">{{ template.name }}</h6>
                    <p class="text-sm text-gray-400">{{ template.description }}</p>
                  </div>
                  <button class="text-red-400 hover:text-red-300" @click.stop="deleteTemplate(template.id)">
                    <Trash2 :size="16" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- 模板库 -->
          <div class="space-y-4">
            <h5 class="text-sm font-medium text-gray-300">模板库</h5>
            <button
              class="w-full px-4 py-3 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-all flex items-center justify-between"
              @click="showTemplateLibraryModal = true"
            >
              <div class="flex items-center gap-3">
                <Database :size="20" class="text-blue-400" />
                <span>浏览系统模板库</span>
              </div>
              <Layers :size="16" />
            </button>
          </div>
        </div>

        <!-- 参数配置 -->
        <div v-if="activeSheet === 'params'" class="p-6 space-y-6">
          <!-- 基本信息 -->
          <div class="space-y-4">
            <h5 class="text-sm font-medium text-gray-300">基本信息</h5>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">视频标题</label>
                <input
                  v-model="config.title"
                  type="text"
                  placeholder="输入视频标题"
                  class="input-primary"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">视频时长 ({{ config.duration }}秒)</label>
                <input
                  v-model="config.duration"
                  type="range"
                  min="15"
                  max="180"
                  step="5"
                  class="range-slider"
                />
              </div>
            </div>
          </div>

          <!-- 视频质量 -->
          <div class="space-y-4">
            <h5 class="text-sm font-medium text-gray-300">视频质量</h5>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">分辨率</label>
                <select v-model="config.resolution" class="input-primary">
                  <option value="1080p">1080p</option>
                  <option value="720p">720p</option>
                  <option value="480p">480p</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">帧率</label>
                <select v-model="config.fps" class="input-primary">
                  <option :value="30">30 FPS</option>
                  <option :value="60">60 FPS</option>
                </select>
              </div>
            </div>
          </div>

          <!-- 转场效果 -->
          <div class="space-y-4">
            <h5 class="text-sm font-medium text-gray-300">转场效果</h5>
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">转场效果</label>
              <div class="flex gap-2 flex-wrap mb-3">
                <button
                  v-for="transition in transitions"
                  :key="transition.value"
                  class="btn-option"
                  :class="{ 'active': config.transition === transition.value }"
                  @click="config.transition = transition.value"
                >
                  {{ transition.label }}
                </button>
              </div>
              <button
                class="w-full px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-all flex items-center justify-center gap-2 text-sm"
                @click="showTransitionLibraryModal = true"
              >
                <Layers :size="16" />
                <span>转场效果库</span>
              </button>
            </div>
          </div>
        </div>

        <!-- 字幕配置 -->
        <div v-if="activeSheet === 'subtitle'" class="p-6 space-y-6">
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <label class="text-sm font-medium text-gray-300">启用AI字幕</label>
              <Switch
                v-model="config.enableSubtitles"
                :class="config.enableSubtitles ? 'bg-blue-600' : 'bg-gray-700'"
                class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
              >
                <span class="sr-only">启用AI字幕</span>
                <span
                  :class="config.enableSubtitles ? 'translate-x-6' : 'translate-x-1'"
                  class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                />
              </Switch>
            </div>

            <div v-if="config.enableSubtitles" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">字幕样式</label>
                <div class="flex gap-2 flex-wrap">
                  <button
                    v-for="style in subtitleStyles"
                    :key="style.value"
                    class="btn-option"
                    :class="{ 'active': config.subtitleStyle === style.value }"
                    @click="config.subtitleStyle = style.value"
                  >
                    {{ style.label }}
                  </button>
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">字幕位置</label>
                <div class="flex gap-2 flex-wrap mb-3">
                  <button
                    v-for="position in subtitlePositions"
                    :key="position.value"
                    class="btn-option"
                    :class="{ 'active': config.subtitlePosition === position.value }"
                    @click="config.subtitlePosition = position.value"
                  >
                    {{ position.label }}
                  </button>
                </div>
                <button
                  class="w-full px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-all flex items-center justify-center gap-2 text-sm mb-3"
                  @click="showFontLibraryModal = true"
                >
                  <Type :size="16" />
                  <span>花字字体库</span>
                </button>
                <button
                  class="w-full px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-all flex items-center justify-center gap-2 text-sm"
                  @click="showStickerLibraryModal = true"
                >
                  <Layers :size="16" />
                  <span>贴纸选择</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 音色配置 -->
        <div v-if="activeSheet === 'voice'" class="p-6 space-y-6">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">音色类型</label>
              <div class="grid grid-cols-2 gap-3">
                <div
                  v-for="voice in voiceTypes"
                  :key="voice.id"
                  class="voice-card"
                  :class="{ 'selected': config.voiceType === voice.id }"
                  @click="config.voiceType = voice.id"
                >
                  <img :src="voice.icon" :alt="voice.name" class="w-8 h-8 rounded-full" />
                  <div>
                    <h6 class="font-medium text-gray-50">{{ voice.name }}</h6>
                    <p class="text-xs text-gray-400">{{ voice.description }}</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">语速</label>
              <input
                v-model="config.voiceSpeed"
                type="range"
                min="0.5"
                max="2.0"
                step="0.1"
                class="range-slider"
              />
              <div class="flex justify-between text-xs text-gray-400 mt-1">
                <span>慢</span>
                <span>{{ config.voiceSpeed }}x</span>
                <span>快</span>
              </div>
            </div>
            
            <!-- 定制音色按钮 -->
            <div>
              <button
                class="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:brightness-110 transition-all flex items-center justify-center gap-2"
                @click="handleVoiceCloneClick"
              >
                <Mic :size="20" />
                <span>定制专属音色</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 右侧预览面板 -->
    <div class="w-1/2 flex flex-col bg-gray-800">
      <!-- 预览标题 -->
      <div class="p-4 border-b border-gray-700">
        <h4 class="text-lg font-semibold text-gray-200">实时预览</h4>
      </div>

      <!-- 预览内容 -->
      <div class="flex-1 p-6 flex items-center justify-center">
        <div 
          class="preview-container"
          :class="config.aspectRatio === '9:16' ? 'preview-vertical' : 'preview-horizontal'"
        >
          <div
            class="preview-frame"
            :class="config.aspectRatio === '9:16' ? 'aspect-[9/16]' : 'aspect-video'"
          >
            <!-- 预览内容 -->
            <div class="w-full h-full bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex flex-col items-center justify-center text-white">
              <div class="text-center">
                <h3 class="text-2xl font-bold mb-2">{{ config.title || '视频标题' }}</h3>
                <p class="text-lg opacity-80">{{ config.aspectRatio === '9:16' ? '竖版视频' : '横版视频' }}</p>
                <p class="text-sm opacity-60 mt-2">{{ config.duration }}秒 • {{ config.resolution }} • {{ config.fps }}fps</p>
              </div>
              
              <!-- 字幕预览 -->
              <div
                v-if="config.enableSubtitles"
                class="absolute"
                :class="config.subtitlePosition === 'top' ? 'top-4' : 'bottom-4'"
              >
                <div
                  class="px-4 py-2 rounded-lg"
                  :class="config.subtitleStyle === 'modern' ? 'bg-black/70' : 'bg-white/90 text-black'"
                >
                  字幕预览文本
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 保存模板模态框 -->
    <SaveTemplateModal
      v-if="showSaveTemplateModal"
      :config="config"
      @close="showSaveTemplateModal = false"
      @save="handleSaveTemplate"
    />

    <!-- 模板库模态框 -->
    <TemplateLibraryModal
      v-if="showTemplateLibraryModal"
      @close="showTemplateLibraryModal = false"
      @select="loadTemplate"
    />

    <!-- 转场效果库模态框 -->
    <TransitionLibraryModal
      v-if="showTransitionLibraryModal"
      @close="showTransitionLibraryModal = false"
      @select="(t: string) => config.transition = t"
    />

    <!-- 花字字体库模态框 -->
    <FontLibraryModal
      v-if="showFontLibraryModal"
      @close="showFontLibraryModal = false"
      @select="(fontId: string) => config.subtitleFont = fontId"
    />

    <!-- 贴纸库模态框 -->
    <StickerLibraryModal
      v-if="showStickerLibraryModal"
      @close="showStickerLibraryModal = false"
      @select="(stickerId: string) => config.subtitleSticker = stickerId"
    />

    <!-- 音色克隆模态框 -->
    <VoiceCloneModal />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Switch } from '@headlessui/vue'
import {
  Save,
  Trash2,
  Settings,
  Type,
  Mic,
  Palette,
  Layers,
  Database
} from 'lucide-vue-next'
import SaveTemplateModal from './components/SaveTemplateModal.vue'
import TemplateLibraryModal from './components/TemplateLibraryModal.vue'
import TransitionLibraryModal from './components/TransitionLibraryModal.vue'
import FontLibraryModal from './components/FontLibraryModal.vue'
import StickerLibraryModal from './components/StickerLibraryModal.vue'
import VoiceCloneModal from '../../../../components/VoiceCloneModal.vue'
import { useVideoStore } from '../../../../store/video'

// Sheet配置
const sheets = [
  { id: 'template', name: '模板选择', icon: Palette },
  { id: 'params', name: '参数配置', icon: Settings },
  { id: 'subtitle', name: '字幕配置', icon: Type },
  { id: 'voice', name: '音色配置', icon: Mic }
]

const activeSheet = ref('template')
const selectedTemplate = ref<string | null>(null)

// 初始化 videoStore
const videoStore = useVideoStore()

// 配置数据
const config = reactive({
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
  subtitleFont: '',
  subtitleSticker: '',
  voiceType: 'authoritative',
  voiceSpeed: 1.0
})

// 选项数据
const transitions = [
  { value: 'fade', label: '淡入淡出' },
  { value: 'cut', label: '硬切' },
  { value: 'slide', label: '推拉' },
  { value: 'zoom', label: '缩放' }
]

const subtitleStyles = [
  { value: 'modern', label: '现代' },
  { value: 'classic', label: '经典' },
  { value: 'bold', label: '粗体' }
]

const subtitlePositions = [
  { value: 'top', label: '顶部' },
  { value: 'bottom', label: '底部' }
]

const voiceTypes = [
  { id: 'authoritative', name: '权威', description: '专业稳重', icon: '/assets/voice/authoritative.svg' },
  { id: 'calm', name: '平静', description: '温和舒缓', icon: '/assets/voice/calm.svg' },
  { id: 'energetic', name: '活力', description: '充满激情', icon: '/assets/voice/energetic.svg' },
  { id: 'dramatic', name: '戏剧', description: '富有表现力', icon: '/assets/voice/dramatic.svg' }
]

// 模板数据
const savedTemplates = ref([
  { id: '1', name: '产品宣传模板', description: '适合产品展示的竖版模板' },
  { id: '2', name: '社媒营销模板', description: '适合社交媒体的横版模板' }
])

// 模态框状态
const showSaveTemplateModal = ref(false)
const showTemplateLibraryModal = ref(false)
const showTransitionLibraryModal = ref(false)
const showFontLibraryModal = ref(false)
const showStickerLibraryModal = ref(false)

// 方法
const loadTemplate = (template: any) => {
  console.log('加载模板:', template)
  selectedTemplate.value = template.id
  // 应用模板配置到实际配置中
  if (template.config) {
    Object.assign(config, template.config)
  }
}

const deleteTemplate = (id: string) => {
  savedTemplates.value = savedTemplates.value.filter(t => t.id !== id)
}


const handleSaveTemplate = (templateData: any) => {
  savedTemplates.value.push({
    id: Date.now().toString(),
    name: templateData.name,
    description: templateData.description
  })
  showSaveTemplateModal.value = false
}

// 处理音色克隆点击
const handleVoiceCloneClick = () => {
  videoStore.toggleVoiceModal()
}
</script>

<style scoped>
.sheet-tab {
  @apply flex items-center gap-2 px-4 py-3 text-sm font-medium text-gray-400 hover:text-gray-50 hover:bg-gray-700 transition-all;
}

.sheet-tab.active {
  @apply text-blue-400 bg-gray-700 border-b-2 border-blue-400;
}

.template-card {
  @apply bg-gray-700 rounded-lg p-4 cursor-pointer transition-all duration-200 hover:bg-gray-600;
}

.template-card.selected {
  @apply ring-2 ring-blue-500 bg-gray-600;
}

.template-item {
  @apply bg-gray-700 rounded-lg p-3 cursor-pointer transition-all duration-200 hover:bg-gray-600;
}

.template-item.selected {
  @apply ring-2 ring-blue-500 bg-gray-600;
}

.input-primary {
  @apply w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-50 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all;
}

.range-slider {
  @apply w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer;
}

.range-slider::-webkit-slider-thumb {
  @apply w-4 h-4 bg-blue-500 rounded-full appearance-none;
}

.btn-option {
  @apply px-3 py-1.5 bg-gray-700 text-gray-300 text-sm rounded-lg hover:bg-gray-600 transition-colors;
}

.btn-option.active {
  @apply bg-blue-600 text-white;
}

.voice-card {
  @apply flex items-center gap-3 p-3 bg-gray-700 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-600;
}

.voice-card.selected {
  @apply ring-2 ring-blue-500 bg-gray-600;
}

.preview-container {
  @apply w-full;
}

.preview-vertical {
  @apply max-w-xs;
}

.preview-horizontal {
  @apply max-w-md;
}

.preview-frame {
  @apply w-full bg-gray-700 rounded-lg overflow-hidden relative;
}

/* 自定义滚动条 */
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