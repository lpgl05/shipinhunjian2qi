&lt;template&gt;
  &lt;div class="config-preview-panel h-full flex flex-col"&gt;
    &lt;!-- 头部 --&gt;
    &lt;div class="flex items-center justify-between p-4 border-b border-gray-700"&gt;
      &lt;h2 class="text-lg font-semibold text-gray-50"&gt;配置预览&lt;/h2&gt;
      &lt;button
        @click="$emit('close')"
        class="p-1 hover:bg-gray-700 rounded-md transition-colors"
      &gt;
        &lt;X class="w-5 h-5 text-gray-400" /&gt;
      &lt;/button&gt;
    &lt;/div&gt;

    &lt;!-- 内容区域 --&gt;
    &lt;div class="flex-1 overflow-y-auto p-4 space-y-6"&gt;
      &lt;!-- 方案信息 --&gt;
      &lt;div class="bg-gray-750 rounded-lg p-4"&gt;
        &lt;div class="flex items-start space-x-3"&gt;
          &lt;div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-violet-500 rounded-lg flex items-center justify-center flex-shrink-0"&gt;
            &lt;Sparkles class="w-5 h-5 text-white" /&gt;
          &lt;/div&gt;
          &lt;div class="flex-1"&gt;
            &lt;h3 class="text-sm font-semibold text-gray-50 mb-1"&gt;{{ suggestion.title }}&lt;/h3&gt;
            &lt;p class="text-xs text-gray-400 mb-2"&gt;{{ suggestion.description }}&lt;/p&gt;
            &lt;div class="flex items-center space-x-2"&gt;
              &lt;Star class="w-3 h-3 text-yellow-400" /&gt;
              &lt;span class="text-xs text-gray-400"&gt;匹配度 {{ Math.round(suggestion.relevanceScore * 100) }}%&lt;/span&gt;
            &lt;/div&gt;
          &lt;/div&gt;
        &lt;/div&gt;
        
        &lt;div class="mt-3 p-3 bg-gray-800 rounded-md"&gt;
          &lt;p class="text-xs text-gray-400 leading-relaxed"&gt;
            &lt;Lightbulb class="w-3 h-3 inline mr-1 text-yellow-400" /&gt;
            {{ suggestion.reasoning }}
          &lt;/p&gt;
        &lt;/div&gt;
      &lt;/div&gt;

      &lt;!-- 视频参数 --&gt;
      &lt;div class="space-y-4"&gt;
        &lt;h4 class="text-sm font-medium text-gray-50 flex items-center"&gt;
          &lt;Video class="w-4 h-4 mr-2 text-blue-400" /&gt;
          视频参数
        &lt;/h4&gt;
        
        &lt;div class="grid grid-cols-2 gap-3"&gt;
          &lt;ConfigItem
            label="画面比例"
            :value="suggestion.parameters.aspectRatio"
            icon="Monitor"
            :editable="true"
            @change="updateParameter('aspectRatio', $event)"
          /&gt;
          
          &lt;ConfigItem
            label="视频时长"
            :value="`${suggestion.parameters.duration}秒`"
            icon="Clock"
            :editable="true"
            @change="updateParameter('duration', parseInt($event))"
          /&gt;
          
          &lt;ConfigItem
            label="分辨率"
            :value="suggestion.parameters.resolution"
            icon="Settings"
            :editable="true"
            @change="updateParameter('resolution', $event)"
          /&gt;
          
          &lt;ConfigItem
            label="帧率"
            :value="`${suggestion.parameters.fps}fps`"
            icon="Zap"
            :editable="true"
            @change="updateParameter('fps', parseInt($event))"
          /&gt;
        &lt;/div&gt;
        
        &lt;ConfigItem
          label="视频风格"
          :value="getStyleLabel(suggestion.parameters.style)"
          icon="Palette"
          :editable="true"
          @change="updateParameter('style', $event)"
          class="col-span-2"
        /&gt;
        
        &lt;ConfigItem
          label="转场效果"
          :value="getTransitionLabel(suggestion.parameters.transition)"
          icon="Shuffle"
          :editable="true"
          @change="updateParameter('transition', $event)"
          class="col-span-2"
        /&gt;
      &lt;/div&gt;

      &lt;!-- 字幕配置 --&gt;
      &lt;div class="space-y-4"&gt;
        &lt;h4 class="text-sm font-medium text-gray-50 flex items-center"&gt;
          &lt;Type class="w-4 h-4 mr-2 text-green-400" /&gt;
          字幕配置
        &lt;/h4&gt;
        
        &lt;div class="bg-gray-750 rounded-lg p-4"&gt;
          &lt;div class="flex items-center justify-between mb-3"&gt;
            &lt;span class="text-sm text-gray-300"&gt;启用字幕&lt;/span&gt;
            &lt;button
              @click="toggleSubtitles"
              class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
              :class="suggestion.subtitleConfig.enabled ? 'bg-blue-600' : 'bg-gray-600'"
            &gt;
              &lt;span
                class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                :class="suggestion.subtitleConfig.enabled ? 'translate-x-6' : 'translate-x-1'"
              &gt;&lt;/span&gt;
            &lt;/button&gt;
          &lt;/div&gt;
          
          &lt;div v-if="suggestion.subtitleConfig.enabled" class="space-y-3"&gt;
            &lt;ConfigItem
              label="字幕样式"
              :value="getSubtitleStyleLabel(suggestion.subtitleConfig.style)"
              icon="Type"
              :editable="true"
              @change="updateSubtitleConfig('style', $event)"
            /&gt;
            
            &lt;ConfigItem
              label="字幕位置"
              :value="getPositionLabel(suggestion.subtitleConfig.position)"
              icon="AlignCenter"
              :editable="true"
              @change="updateSubtitleConfig('position', $event)"
            /&gt;
            
            &lt;div class="grid grid-cols-2 gap-3"&gt;
              &lt;ConfigItem
                label="字体大小"
                :value="`${suggestion.subtitleConfig.fontSize}px`"
                icon="Type"
                :editable="true"
                @change="updateSubtitleConfig('fontSize', parseInt($event))"
              /&gt;
              
              &lt;ConfigItem
                label="字体颜色"
                :value="suggestion.subtitleConfig.color"
                icon="Palette"
                :editable="true"
                @change="updateSubtitleConfig('color', $event)"
              /&gt;
            &lt;/div&gt;
          &lt;/div&gt;
        &lt;/div&gt;
      &lt;/div&gt;

      &lt;!-- 音频配置 --&gt;
      &lt;div class="space-y-4"&gt;
        &lt;h4 class="text-sm font-medium text-gray-50 flex items-center"&gt;
          &lt;Volume2 class="w-4 h-4 mr-2 text-orange-400" /&gt;
          音频配置
        &lt;/h4&gt;
        
        &lt;div class="bg-gray-750 rounded-lg p-4 space-y-3"&gt;
          &lt;ConfigItem
            label="音色类型"
            :value="getVoiceLabel(suggestion.voiceConfig.type)"
            icon="Mic"
            :editable="true"
            @change="updateVoiceConfig('type', $event)"
          /&gt;
          
          &lt;div class="grid grid-cols-3 gap-3"&gt;
            &lt;ConfigSlider
              label="语速"
              :value="suggestion.voiceConfig.speed"
              :min="0.5"
              :max="2.0"
              :step="0.1"
              @change="updateVoiceConfig('speed', $event)"
            /&gt;
            
            &lt;ConfigSlider
              label="音调"
              :value="suggestion.voiceConfig.pitch"
              :min="0.5"
              :max="2.0"
              :step="0.1"
              @change="updateVoiceConfig('pitch', $event)"
            /&gt;
            
            &lt;ConfigSlider
              label="音量"
              :value="suggestion.voiceConfig.volume"
              :min="0.0"
              :max="1.0"
              :step="0.1"
              @change="updateVoiceConfig('volume', $event)"
            /&gt;
          &lt;/div&gt;
        &lt;/div&gt;
      &lt;/div&gt;
    &lt;/div&gt;

    &lt;!-- 底部操作按钮 --&gt;
    &lt;div class="border-t border-gray-700 p-4 space-y-3"&gt;
      &lt;button
        @click="$emit('apply-config')"
        class="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg font-medium transition-colors"
      &gt;
        &lt;Check class="w-4 h-4 mr-2 inline" /&gt;
        应用此配置
      &lt;/button&gt;
      
      &lt;button
        @click="$emit('modify-config')"
        class="w-full bg-gray-700 hover:bg-gray-600 text-gray-300 py-2 rounded-lg font-medium transition-colors"
      &gt;
        &lt;Edit class="w-4 h-4 mr-2 inline" /&gt;
        进入高级编辑
      &lt;/button&gt;
    &lt;/div&gt;
  &lt;/div&gt;
&lt;/template&gt;

&lt;script setup lang="ts"&gt;
import { ref } from 'vue'
import { 
  X, 
  Sparkles, 
  Star, 
  Lightbulb, 
  Video, 
  Monitor, 
  Clock, 
  Settings, 
  Zap, 
  Palette, 
  Shuffle, 
  Type, 
  AlignCenter, 
  Volume2, 
  Mic, 
  Check, 
  Edit 
} from 'lucide-vue-next'
import type { ConfigSuggestion } from '@/store/conversationalVideo'
import ConfigItem from './ConfigItem.vue'
import ConfigSlider from './ConfigSlider.vue'

interface Props {
  suggestion: ConfigSuggestion
}

const props = defineProps&lt;Props&gt;()

const emit = defineEmits&lt;{
  'apply-config': []
  'modify-config': []
  'close': []
}&gt;()

// 创建可编辑的配置副本
const editableSuggestion = ref&lt;ConfigSuggestion&gt;(JSON.parse(JSON.stringify(props.suggestion)))

const updateParameter = (key: string, value: any) =&gt; {
  editableSuggestion.value.parameters[key as keyof typeof editableSuggestion.value.parameters] = value
}

const updateSubtitleConfig = (key: string, value: any) =&gt; {
  editableSuggestion.value.subtitleConfig[key as keyof typeof editableSuggestion.value.subtitleConfig] = value
}

const updateVoiceConfig = (key: string, value: any) =&gt; {
  editableSuggestion.value.voiceConfig[key as keyof typeof editableSuggestion.value.voiceConfig] = value
}

const toggleSubtitles = () =&gt; {
  editableSuggestion.value.subtitleConfig.enabled = !editableSuggestion.value.subtitleConfig.enabled
}

// 标签映射函数
const getStyleLabel = (style: string): string =&gt; {
  const styleMap: Record&lt;string, string&gt; = {
    modern: '现代简约',
    cinematic: '电影风格',
    vibrant: '活力动感',
    minimal: '极简风格',
    dramatic: '戏剧效果',
    professional: '专业商务'
  }
  return styleMap[style] || style
}

const getTransitionLabel = (transition: string): string =&gt; {
  const transitionMap: Record&lt;string, string&gt; = {
    fade: '淡入淡出',
    cut: '直接切换',
    dissolve: '溶解',
    slide: '滑动',
    zoom: '缩放'
  }
  return transitionMap[transition] || transition
}

const getSubtitleStyleLabel = (style: string): string =&gt; {
  const styleMap: Record&lt;string, string&gt; = {
    modern: '现代风格',
    cinematic: '电影字幕',
    simple: '简洁样式',
    elegant: '优雅风格'
  }
  return styleMap[style] || style
}

const getPositionLabel = (position: string): string =&gt; {
  const positionMap: Record&lt;string, string&gt; = {
    bottom: '底部',
    center: '居中',
    top: '顶部'
  }
  return positionMap[position] || position
}

const getVoiceLabel = (voiceType: string): string =&gt; {
  const voiceMap: Record&lt;string, string&gt; = {
    authoritative: '权威专业',
    calm: '平静温和',
    energetic: '活力激情',
    dramatic: '戏剧张力',
    friendly: '友好亲切',
    professional: '专业播报'
  }
  return voiceMap[voiceType] || voiceType
}
&lt;/script&gt;

&lt;style scoped&gt;
.config-preview-panel {
  background: #1f2937;
}

/* 自定义滚动条 */
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
&lt;/style&gt;