&lt;template&gt;
  &lt;div class="config-item bg-gray-800 rounded-lg p-3"&gt;
    &lt;div class="flex items-center justify-between"&gt;
      &lt;div class="flex items-center space-x-2"&gt;
        &lt;component 
          :is="iconComponent" 
          class="w-4 h-4 text-gray-400" 
        /&gt;
        &lt;span class="text-sm text-gray-300"&gt;{{ label }}&lt;/span&gt;
      &lt;/div&gt;
      
      &lt;div class="flex items-center space-x-2"&gt;
        &lt;span v-if="!isEditing" class="text-sm text-gray-50"&gt;{{ displayValue }}&lt;/span&gt;
        
        &lt;input
          v-if="isEditing"
          v-model="editValue"
          @blur="handleSave"
          @keydown.enter="handleSave"
          @keydown.escape="handleCancel"
          class="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm text-gray-50 w-24 focus:outline-none focus:border-blue-500"
          ref="editInput"
        &gt;
        
        &lt;button
          v-if="editable &amp;&amp; !isEditing"
          @click="startEdit"
          class="p-1 hover:bg-gray-700 rounded transition-colors"
        &gt;
          &lt;Edit2 class="w-3 h-3 text-gray-400" /&gt;
        &lt;/button&gt;
        
        &lt;button
          v-if="isEditing"
          @click="handleSave"
          class="p-1 hover:bg-gray-700 rounded transition-colors"
        &gt;
          &lt;Check class="w-3 h-3 text-green-400" /&gt;
        &lt;/button&gt;
        
        &lt;button
          v-if="isEditing"
          @click="handleCancel"
          class="p-1 hover:bg-gray-700 rounded transition-colors"
        &gt;
          &lt;X class="w-3 h-3 text-red-400" /&gt;
        &lt;/button&gt;
      &lt;/div&gt;
    &lt;/div&gt;
  &lt;/div&gt;
&lt;/template&gt;

&lt;script setup lang="ts"&gt;
import { ref, computed, nextTick } from 'vue'
import { 
  Edit2, 
  Check, 
  X,
  Monitor,
  Clock,
  Settings,
  Zap,
  Palette,
  Shuffle,
  Type,
  AlignCenter,
  Mic
} from 'lucide-vue-next'

interface Props {
  label: string
  value: string | number
  icon: string
  editable?: boolean
}

const props = withDefaults(defineProps&lt;Props&gt;(), {
  editable: false
})

const emit = defineEmits&lt;{
  change: [value: string]
}&gt;()

const isEditing = ref(false)
const editValue = ref('')
const editInput = ref&lt;HTMLInputElement&gt;()

const iconComponent = computed(() =&gt; {
  const iconMap: Record&lt;string, any&gt; = {
    Monitor,
    Clock,
    Settings,
    Zap,
    Palette,
    Shuffle,
    Type,
    AlignCenter,
    Mic
  }
  return iconMap[props.icon] || Settings
})

const displayValue = computed(() =&gt; {
  return typeof props.value === 'string' ? props.value : props.value.toString()
})

const startEdit = async () =&gt; {
  if (!props.editable) return
  
  isEditing.value = true
  editValue.value = displayValue.value
  
  await nextTick()
  editInput.value?.focus()
  editInput.value?.select()
}

const handleSave = () =&gt; {
  if (editValue.value !== displayValue.value) {
    emit('change', editValue.value)
  }
  isEditing.value = false
}

const handleCancel = () =&gt; {
  editValue.value = displayValue.value
  isEditing.value = false
}
&lt;/script&gt;

&lt;style scoped&gt;
.config-item {
  transition: all 0.2s ease;
}

.config-item:hover {
  background-color: #374151;
}
&lt;/style&gt;