<template>
  <div class="video-config h-full overflow-y-auto scrollbar-thin p-6 bg-gray-900">
    <div class="max-w-4xl mx-auto space-y-6">
      <!-- 标题 -->
      <div class="mb-6">
        <h3 class="text-2xl font-bold text-gray-50 mb-2">视频参数配置</h3>
        <p class="text-gray-400">配置视频参数，开始你的创作之旅</p>
      </div>

      <!-- 模板选择区 - 简化版 -->
      <div class="templates-section bg-gray-800 rounded-xl p-6">
        <h4 class="text-lg font-semibold text-gray-200 mb-4">视频模板</h4>
        
        <!-- 基础模板选择 -->
        <div class="flex gap-3 mb-4">
          <button
            class="template-option"
            :class="{ 'active': config.aspectRatio === '9:16' }"
            @click="config.aspectRatio = '9:16'"
          >
            <Smartphone :size="18" class="text-blue-400" />
            <span class="text-sm">竖版 (9:16)</span>
          </button>
          <button
            class="template-option"
            :class="{ 'active': config.aspectRatio === '16:9' }"
            @click="config.aspectRatio = '16:9'"
          >
            <Monitor :size="18" class="text-blue-400" />
            <span class="text-sm">横版 (16:9)</span>
          </button>
        </div>
        
        <!-- 默认模板 -->
        <div v-if="defaultTemplates.length > 0" class="mb-4">
          <h5 class="text-sm font-medium text-gray-300 mb-2">我的模板</h5>
          <div class="flex gap-2 flex-wrap">
            <button
              v-for="template in defaultTemplates"
              :key="template.id"
              class="template-preset"
              @click="loadTemplate(template)"
            >
              {{ template.name }}
            </button>
          </div>
        </div>
      </div>

      <!-- 参数配置区 -->
      <div class="config-section bg-gray-800 rounded-xl p-6">
        <h4 class="text-lg font-semibold text-gray-200 mb-4">参数配置</h4>
        
        <div class="grid grid-cols-2 gap-6">
          <!-- 左侧配置 -->
          <div class="space-y-4">
            <div class="form-group">
              <label for="title">视频标题</label>
              <input type="text" id="title" v-model="config.title" placeholder="输入视频标题" class="input-primary" />
            </div>
            
            <div class="form-group">
              <label for="duration">视频时长 (秒)</label>
              <input type="range" id="duration" v-model="config.duration" min="15" max="180" step="5" class="range-slider" />
              <span class="text-sm text-gray-400">{{ config.duration }} 秒</span>
            </div>
            
            <div class="form-group">
              <label>分辨率</label>
              <div class="flex gap-2">
                <button 
                  class="btn-option" 
                  :class="{ 'active': config.resolution === '1080p' }"
                  @click="config.resolution = '1080p'"
                >
                  1080p
                </button>
                <button 
                  class="btn-option" 
                  :class="{ 'active': config.resolution === '720p' }"
                  @click="config.resolution = '720p'"
                >
                  720p
                </button>
              </div>
            </div>
          </div>
          
          <!-- 右侧配置 -->
          <div class="space-y-4">
            <div class="form-group">
              <label>帧率 (FPS)</label>
              <div class="flex gap-2">
                <button 
                  class="btn-option" 
                  :class="{ 'active': config.fps === 30 }"
                  @click="config.fps = 30"
                >
                  30 FPS
                </button>
                <button 
                  class="btn-option" 
                  :class="{ 'active': config.fps === 60 }"
                  @click="config.fps = 60"
                >
                  60 FPS
                </button>
              </div>
            </div>
            
            <div class="form-group">
              <label>视频风格</label>
              <div class="flex flex-wrap gap-2">
                <button 
                  class="btn-option" 
                  :class="{ 'active': config.style === 'modern' }"
                  @click="config.style = 'modern'"
                >
                  现代
                </button>
                <button 
                  class="btn-option" 
                  :class="{ 'active': config.style === 'cinematic' }"
                  @click="config.style = 'cinematic'"
                >
                  电影感
                </button>
                <button 
                  class="btn-option" 
                  :class="{ 'active': config.style === 'vibrant' }"
                  @click="config.style = 'vibrant'"
                >
                  活力
                </button>
              </div>
            </div>
            
            <div class="form-group">
              <label>转场效果</label>
              <div class="flex flex-wrap gap-2">
                <button 
                  class="btn-option" 
                  :class="{ 'active': config.transition === 'fade' }"
                  @click="config.transition = 'fade'"
                >
                  淡入淡出
                </button>
                <button 
                  class="btn-option" 
                  :class="{ 'active': config.transition === 'cut' }"
                  @click="config.transition = 'cut'"
                >
                  硬切
                </button>
                <button 
                  class="btn-option" 
                  :class="{ 'active': config.transition === 'slide' }"
                  @click="config.transition = 'slide'"
                >
                  推拉
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 字幕配置区 -->
      <div class="subtitle-section bg-gray-800 rounded-xl p-6">
        <div class="flex items-center justify-between mb-4">
          <h4 class="text-lg font-semibold text-gray-200">字幕配置</h4>
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
        
        <div v-if="config.enableSubtitles" class="grid grid-cols-2 gap-4">
          <div class="form-group">
            <label>字幕样式</label>
            <div class="flex gap-2">
              <button 
                class="btn-option" 
                :class="{ 'active': config.subtitleStyle === 'modern' }"
                @click="config.subtitleStyle = 'modern'"
              >
                现代
              </button>
              <button 
                class="btn-option" 
                :class="{ 'active': config.subtitleStyle === 'classic' }"
                @click="config.subtitleStyle = 'classic'"
              >
                经典
              </button>
            </div>
          </div>
          
          <div class="form-group">
            <label>字幕位置</label>
            <div class="flex gap-2">
              <button 
                class="btn-option" 
                :class="{ 'active': config.subtitlePosition === '顶部' }"
                @click="config.subtitlePosition = '顶部'"
              >
                顶部
              </button>
              <button 
                class="btn-option" 
                :class="{ 'active': config.subtitlePosition === '底部' }"
                @click="config.subtitlePosition = '底部'"
              >
                底部
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 音色配置区 -->
      <div class="voice-section bg-gray-800 rounded-xl p-6">
        <div class="flex items-center justify-between mb-4">
          <h4 class="text-lg font-semibold text-gray-200">音色配置</h4>
          <Switch
            v-model="config.enableVoice"
            :class="config.enableVoice ? 'bg-blue-600' : 'bg-gray-700'"
            class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
          >
            <span class="sr-only">启用AI配音</span>
            <span
              :class="config.enableVoice ? 'translate-x-6' : 'translate-x-1'"
              class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
            />
          </Switch>
        </div>

        <div v-if="config.enableVoice" class="space-y-4">
          <!-- 音色选择区域 - 简化版 -->
          <div class="voice-selection">
            <h5 class="text-sm font-medium text-gray-300 mb-3">选择音色</h5>
            <div class="grid grid-cols-3 gap-3 mb-4">
              <button
                v-for="voice in videoStore.builtInVoices"
                :key="voice.id"
                @click.stop="handleVoiceSelect(voice)"
                :class="[
                  'voice-avatar p-3 rounded-lg border-2 transition-all duration-200',
                  selectedVoice?.id === voice.id 
                    ? 'border-blue-500 bg-blue-500/20' 
                    : 'border-gray-600 bg-gray-700 hover:border-gray-500'
                ]"
              >
                <div class="text-center">
                  <div class="w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                    <img 
                      :src="getVoiceIcon(voice.id)"
                      :alt="voice.name"
                      class="w-10 h-10 object-contain"
                      :class="selectedVoice?.id === voice.id ? 'brightness-110' : 'brightness-90'"
                    />
                  </div>
                  <p class="text-sm font-medium text-gray-200">{{ voice.name }}</p>
                  <p class="text-xs text-gray-400">{{ voice.type }}</p>
                </div>
              </button>
            </div>
            
            <!-- 定制声音按钮 -->
            <button
              @click="videoStore.toggleVoiceModal()"
              class="w-full p-3 border-2 border-dashed border-gray-600 rounded-lg hover:border-gray-500 transition-colors duration-200"
            >
              <div class="text-center">
                <div class="w-12 h-12 mx-auto mb-2 bg-gray-600 rounded-full flex items-center justify-center">
                  <Mic :size="20" class="text-gray-400" />
                </div>
                <p class="text-sm font-medium text-gray-300">定制声音</p>
                <p class="text-xs text-gray-500">录制20句话生成专属音色</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      <!-- 保存模板区 -->
      <div class="save-section bg-gray-800 rounded-xl p-6">
        <h4 class="text-lg font-semibold text-gray-200 mb-4">保存为模板</h4>
        <div class="flex gap-4">
          <input 
            type="text" 
            v-model="templateName" 
            placeholder="输入模板名称" 
            class="input-primary flex-1"
          />
          <button 
            class="btn-primary flex items-center gap-2"
            @click="saveTemplate"
            :disabled="!templateName.trim()"
          >
            <Save :size="20" />
            <span>保存模板</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 音色选择器模态框 -->
    <VoiceSelector 
      v-if="videoStore.isVoiceModalOpen"
      @close="videoStore.toggleVoiceModal"
      @select="handleVoiceSelect"
    />

    <!-- 音色克隆模态框 -->
    <VoiceCloneModal />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { Switch } from '@headlessui/vue'
import { 
  Smartphone,
  Monitor,
  Save,
  Mic
} from 'lucide-vue-next'

// 导入音色图标
import sunnyIcon from '@/assets/icons/voice/sunny.svg'
import energeticIcon from '@/assets/icons/voice/energetic.svg'
import calmIcon from '@/assets/icons/voice/calm.svg'
import authoritativeIcon from '@/assets/icons/voice/authoritative.svg'
import mysteriousIcon from '@/assets/icons/voice/mysterious.svg'
import dramaticIcon from '@/assets/icons/voice/dramatic.svg'
import { useVideoStore } from '../../../../store/video'
import VoiceSelector from '../../../../components/VoiceSelector.vue'
import VoiceCloneModal from '../../../../components/VoiceCloneModal.vue'

interface DefaultTemplate {
  id: string
  name: string
  config: any
}

// 使用video store
const videoStore = useVideoStore()

// 配置数据
const config = reactive({
  title: '',
  duration: 60,
  aspectRatio: '16:9',
  resolution: '1080p',
  fps: 30,
  style: 'modern',
  transition: 'fade',
  enableSubtitles: true,
  subtitleStyle: 'modern',
  subtitlePosition: '底部',
  enableVoice: false,
  voiceSpeed: 1.0,
  voicePitch: 0,
  voiceVolume: 80,
  voiceEmotion: 'neutral'
})

// 默认模板
const defaultTemplates = ref<DefaultTemplate[]>([
  {
    id: '1',
    name: '抖音短视频',
    config: {
      aspectRatio: '9:16',
      duration: 30,
      style: 'vibrant',
      resolution: '1080p',
      fps: 30
    }
  },
  {
    id: '2',
    name: 'B站横版',
    config: {
      aspectRatio: '16:9',
      duration: 120,
      style: 'cinematic',
      resolution: '1080p',
      fps: 60
    }
  }
])

const templateName = ref('')

// 音色相关状态
const isVoiceSelectorOpen = ref(false)

// 计算属性
const selectedVoice = computed(() => {
  if (!videoStore.selectedVoiceId) return null
  return videoStore.getAllVoices().find(voice => voice.id === videoStore.selectedVoiceId)
})

// 加载模板
const loadTemplate = (template: DefaultTemplate) => {
  Object.assign(config, template.config)
}

// 保存模板
const saveTemplate = () => {
  if (!templateName.value.trim()) return
  
  const newTemplate: DefaultTemplate = {
    id: Date.now().toString(),
    name: templateName.value.trim(),
    config: { ...config }
  }
  
  defaultTemplates.value.push(newTemplate)
  templateName.value = ''
  
  // 这里可以调用API保存到后端
  console.log('保存模板:', newTemplate)
}

// 获取音色图标
const getVoiceIcon = (voiceId: string) => {
  const iconMap: { [key: string]: string } = {
    'voice-sunny': sunnyIcon,
    'voice-energetic': energeticIcon,
    'voice-calm': calmIcon,
    'voice-authoritative': authoritativeIcon,
    'voice-mysterious': mysteriousIcon,
    'voice-dramatic': dramaticIcon
  }
  
  return iconMap[voiceId] || sunnyIcon // 默认使用阳光图标
}

const handleVoiceSelect = (voice: any) => {
  videoStore.selectVoice(voice.id)
}
</script>

<style scoped>
.template-option {
  @apply flex items-center gap-2 px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors;
}

.template-option.active {
  @apply bg-blue-600 text-white;
}

.template-preset {
  @apply px-3 py-1.5 bg-gray-700 text-gray-300 text-sm rounded-lg hover:bg-gray-600 transition-colors;
}

.form-group {
  @apply space-y-2;
}

.form-group label {
  @apply block text-sm font-medium text-gray-300;
}

.form-group input,
.form-group select {
  @apply w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent;
}

.input-primary {
  @apply w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-50 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all;
}

.range-slider {
  @apply w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer;
}

.range-slider::-webkit-slider-thumb {
  @apply w-4 h-4 bg-blue-500 rounded-full appearance-none;
}

.range-slider::-moz-range-thumb {
  @apply w-4 h-4 bg-blue-500 rounded-full cursor-pointer border-none;
}

.btn-option {
  @apply px-3 py-1.5 bg-gray-700 text-gray-300 text-sm rounded-lg hover:bg-gray-600 transition-colors;
}

.btn-option.active {
  @apply bg-blue-600 text-white;
}

.template-card {
  @apply bg-gray-700 rounded-lg p-4 cursor-pointer transition-all duration-200 hover:bg-gray-600;
}

.template-card.selected {
  @apply ring-2 ring-blue-500 bg-gray-600;
}

.template-card img {
  @apply w-full h-24 object-cover rounded-lg mb-3;
}

.template-card h4 {
  @apply font-medium text-gray-50 mb-1;
}

.template-card p {
  @apply text-sm text-gray-400;
}

/* 音色配置相关样式 */
.voice-section .form-group {
  @apply space-y-3;
}

.voice-section .form-group label {
  @apply text-sm font-medium text-gray-300 mb-2;
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