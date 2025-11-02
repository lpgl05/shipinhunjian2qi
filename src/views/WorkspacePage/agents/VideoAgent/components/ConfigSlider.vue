&lt;template&gt;
  &lt;div class="config-slider bg-gray-800 rounded-lg p-3"&gt;
    &lt;div class="flex items-center justify-between mb-2"&gt;
      &lt;span class="text-xs text-gray-300"&gt;{{ label }}&lt;/span&gt;
      &lt;span class="text-xs text-gray-50 font-medium"&gt;{{ displayValue }}&lt;/span&gt;
    &lt;/div&gt;
    
    &lt;div class="relative"&gt;
      &lt;input
        type="range"
        :min="min"
        :max="max"
        :step="step"
        :value="value"
        @input="handleChange"
        class="slider w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
      &gt;
      
      &lt;!-- 滑块轨道背景 --&gt;
      &lt;div class="slider-track absolute top-1 left-0 h-2 bg-gray-600 rounded-lg pointer-events-none"&gt;&lt;/div&gt;
      
      &lt;!-- 滑块进度 --&gt;
      &lt;div 
        class="slider-progress absolute top-1 left-0 h-2 bg-blue-500 rounded-lg pointer-events-none"
        :style="{ width: progressWidth }"
      &gt;&lt;/div&gt;
    &lt;/div&gt;
    
    &lt;!-- 范围标签 --&gt;
    &lt;div class="flex justify-between mt-1"&gt;
      &lt;span class="text-xs text-gray-500"&gt;{{ min }}&lt;/span&gt;
      &lt;span class="text-xs text-gray-500"&gt;{{ max }}&lt;/span&gt;
    &lt;/div&gt;
  &lt;/div&gt;
&lt;/template&gt;

&lt;script setup lang="ts"&gt;
import { computed } from 'vue'

interface Props {
  label: string
  value: number
  min: number
  max: number
  step: number
}

const props = defineProps&lt;Props&gt;()

const emit = defineEmits&lt;{
  change: [value: number]
}&gt;()

const displayValue = computed(() =&gt; {
  return props.value.toFixed(1)
})

const progressWidth = computed(() =&gt; {
  const percentage = ((props.value - props.min) / (props.max - props.min)) * 100
  return `${Math.max(0, Math.min(100, percentage))}%`
})

const handleChange = (event: Event) =&gt; {
  const target = event.target as HTMLInputElement
  const newValue = parseFloat(target.value)
  emit('change', newValue)
}
&lt;/script&gt;

&lt;style scoped&gt;
.config-slider {
  transition: all 0.2s ease;
}

.config-slider:hover {
  background-color: #374151;
}

/* 自定义滑块样式 */
.slider {
  background: transparent;
}

.slider::-webkit-slider-thumb {
  appearance: none;
  height: 16px;
  width: 16px;
  border-radius: 50%;
  background: #3B82F6;
  cursor: pointer;
  border: 2px solid #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.slider::-webkit-slider-thumb:hover {
  background: #2563EB;
  transform: scale(1.1);
}

.slider::-moz-range-thumb {
  height: 16px;
  width: 16px;
  border-radius: 50%;
  background: #3B82F6;
  cursor: pointer;
  border: 2px solid #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.slider::-moz-range-thumb:hover {
  background: #2563EB;
  transform: scale(1.1);
}

.slider:focus {
  outline: none;
}

.slider:focus::-webkit-slider-thumb {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
}

.slider:focus::-moz-range-thumb {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
}
&lt;/style&gt;