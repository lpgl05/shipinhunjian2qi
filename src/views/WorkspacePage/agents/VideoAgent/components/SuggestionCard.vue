&lt;template&gt;
  &lt;div class="suggestion-card bg-gray-750 border border-gray-600 rounded-lg p-4 hover:border-blue-500 transition-colors cursor-pointer group"
       @click="handleSelect"&gt;
    &lt;!-- 卡片头部 --&gt;
    &lt;div class="flex items-start justify-between mb-3"&gt;
      &lt;div class="flex-1"&gt;
        &lt;h3 class="text-sm font-semibold text-gray-50 group-hover:text-blue-300 transition-colors"&gt;
          {{ suggestion.title }}
        &lt;/h3&gt;
        &lt;p class="text-xs text-gray-400 mt-1"&gt;{{ suggestion.description }}&lt;/p&gt;
      &lt;/div&gt;
      
      &lt;div class="flex items-center space-x-2 ml-3"&gt;
        &lt;!-- 相关度评分 --&gt;
        &lt;div class="flex items-center space-x-1"&gt;
          &lt;Star class="w-3 h-3 text-yellow-400" /&gt;
          &lt;span class="text-xs text-gray-400"&gt;{{ Math.round(suggestion.relevanceScore * 100) }}%&lt;/span&gt;
        &lt;/div&gt;
        
        &lt;ChevronRight class="w-4 h-4 text-gray-400 group-hover:text-blue-400 transition-colors" /&gt;
      &lt;/div&gt;
    &lt;/div&gt;

    &lt;!-- 配置预览 --&gt;
    &lt;div class="grid grid-cols-2 gap-3 mb-3"&gt;
      &lt;!-- 视频参数 --&gt;
      &lt;div class="space-y-2"&gt;
        &lt;div class="flex items-center space-x-2"&gt;
          &lt;Monitor class="w-3 h-3 text-blue-400" /&gt;
          &lt;span class="text-xs text-gray-300"&gt;{{ suggestion.parameters.aspectRatio }}&lt;/span&gt;
        &lt;/div&gt;
        
        &lt;div class="flex items-center space-x-2"&gt;
          &lt;Clock class="w-3 h-3 text-green-400" /&gt;
          &lt;span class="text-xs text-gray-300"&gt;{{ suggestion.parameters.duration }}秒&lt;/span&gt;
        &lt;/div&gt;
        
        &lt;div class="flex items-center space-x-2"&gt;
          &lt;Palette class="w-3 h-3 text-purple-400" /&gt;
          &lt;span class="text-xs text-gray-300"&gt;{{ getStyleLabel(suggestion.parameters.style) }}&lt;/span&gt;
        &lt;/div&gt;
      &lt;/div&gt;
      
      &lt;!-- 功能配置 --&gt;
      &lt;div class="space-y-2"&gt;
        &lt;div class="flex items-center space-x-2"&gt;
          &lt;Type class="w-3 h-3" :class="suggestion.subtitleConfig.enabled ? 'text-green-400' : 'text-gray-500'" /&gt;
          &lt;span class="text-xs text-gray-300"&gt;
            {{ suggestion.subtitleConfig.enabled ? '启用字幕' : '无字幕' }}
          &lt;/span&gt;
        &lt;/div&gt;
        
        &lt;div class="flex items-center space-x-2"&gt;
          &lt;Volume2 class="w-3 h-3 text-orange-400" /&gt;
          &lt;span class="text-xs text-gray-300"&gt;{{ getVoiceLabel(suggestion.voiceConfig.type) }}&lt;/span&gt;
        &lt;/div&gt;
        
        &lt;div class="flex items-center space-x-2"&gt;
          &lt;Settings class="w-3 h-3 text-gray-400" /&gt;
          &lt;span class="text-xs text-gray-300"&gt;{{ suggestion.parameters.resolution }}&lt;/span&gt;
        &lt;/div&gt;
      &lt;/div&gt;
    &lt;/div&gt;

    &lt;!-- 推理说明 --&gt;
    &lt;div class="bg-gray-800 rounded-md p-2 mb-3"&gt;
      &lt;p class="text-xs text-gray-400 leading-relaxed"&gt;
        &lt;Lightbulb class="w-3 h-3 inline mr-1 text-yellow-400" /&gt;
        {{ suggestion.reasoning }}
      &lt;/p&gt;
    &lt;/div&gt;

    &lt;!-- 操作按钮 --&gt;
    &lt;div class="flex items-center justify-between"&gt;
      &lt;button
        @click.stop="handlePreview"
        class="text-xs text-blue-400 hover:text-blue-300 transition-colors"
      &gt;
        预览详情
      &lt;/button&gt;
      
      &lt;button
        @click.stop="handleSelect"
        class="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white text-xs rounded-md transition-colors"
      &gt;
        选择此方案
      &lt;/button&gt;
    &lt;/div&gt;
  &lt;/div&gt;
&lt;/template&gt;

&lt;script setup lang="ts"&gt;
import { 
  Star, 
  ChevronRight, 
  Monitor, 
  Clock, 
  Palette, 
  Type, 
  Volume2, 
  Settings, 
  Lightbulb 
} from 'lucide-vue-next'
import type { ConfigSuggestion } from '@/store/conversationalVideo'

interface Props {
  suggestion: ConfigSuggestion
}

const props = defineProps&lt;Props&gt;()

const emit = defineEmits&lt;{
  select: [suggestion: ConfigSuggestion]
}&gt;()

const handleSelect = () =&gt; {
  emit('select', props.suggestion)
}

const handlePreview = () =&gt; {
  // 触发预览事件
  emit('select', props.suggestion)
}

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
.suggestion-card {
  background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
}

.suggestion-card:hover {
  background: linear-gradient(135deg, #374151 0%, #1f2937 100%);
}
&lt;/style&gt;