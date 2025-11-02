&lt;template&gt;
  &lt;div class="message-bubble" :class="messageTypeClass"&gt;
    &lt;!-- 用户消息 --&gt;
    &lt;div v-if="message.type === 'user'" class="flex justify-end"&gt;
      &lt;div class="max-w-[80%] bg-blue-600 text-white rounded-2xl rounded-br-md px-4 py-3"&gt;
        &lt;p class="text-sm leading-relaxed whitespace-pre-wrap"&gt;{{ message.content }}&lt;/p&gt;
        
        &lt;!-- 附件显示 --&gt;
        &lt;div v-if="message.attachments &amp;&amp; message.attachments.length &gt; 0" class="mt-2 space-y-1"&gt;
          &lt;div
            v-for="(file, index) in message.attachments"
            :key="index"
            class="flex items-center space-x-2 bg-blue-700 rounded-lg px-2 py-1"
          &gt;
            &lt;FileText class="w-3 h-3" /&gt;
            &lt;span class="text-xs"&gt;{{ file.name }}&lt;/span&gt;
          &lt;/div&gt;
        &lt;/div&gt;
        
        &lt;div class="text-xs text-blue-100 mt-2 text-right"&gt;
          {{ formatTime(message.timestamp) }}
        &lt;/div&gt;
      &lt;/div&gt;
    &lt;/div&gt;

    &lt;!-- 助手消息 --&gt;
    &lt;div v-else-if="message.type === 'assistant'" class="flex justify-start"&gt;
      &lt;div class="flex space-x-3 max-w-[90%]"&gt;
        &lt;!-- 头像 --&gt;
        &lt;div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-violet-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1"&gt;
          &lt;Bot class="w-4 h-4 text-white" /&gt;
        &lt;/div&gt;
        
        &lt;div class="flex-1"&gt;
          &lt;div class="bg-gray-800 text-gray-50 rounded-2xl rounded-bl-md px-4 py-3"&gt;
            &lt;p class="text-sm leading-relaxed whitespace-pre-wrap"&gt;{{ message.content }}&lt;/p&gt;
            
            &lt;div class="text-xs text-gray-400 mt-2"&gt;
              {{ formatTime(message.timestamp) }}
            &lt;/div&gt;
          &lt;/div&gt;
          
          &lt;!-- 配置建议卡片 --&gt;
          &lt;div v-if="message.suggestions &amp;&amp; message.suggestions.length &gt; 0" class="mt-3 space-y-2"&gt;
            &lt;SuggestionCard
              v-for="suggestion in message.suggestions"
              :key="suggestion.id"
              :suggestion="suggestion"
              @select="$emit('select-suggestion', suggestion)"
            /&gt;
          &lt;/div&gt;
        &lt;/div&gt;
      &lt;/div&gt;
    &lt;/div&gt;

    &lt;!-- 系统消息 --&gt;
    &lt;div v-else-if="message.type === 'system'" class="flex justify-center"&gt;
      &lt;div class="bg-gray-700 text-gray-300 rounded-full px-4 py-2 text-sm max-w-[80%] text-center"&gt;
        {{ message.content }}
      &lt;/div&gt;
    &lt;/div&gt;
  &lt;/div&gt;
&lt;/template&gt;

&lt;script setup lang="ts"&gt;
import { computed } from 'vue'
import { Bot, FileText } from 'lucide-vue-next'
import type { Message } from '@/store/conversationalVideo'
import SuggestionCard from './SuggestionCard.vue'

interface Props {
  message: Message
}

const props = defineProps&lt;Props&gt;()

const emit = defineEmits&lt;{
  'select-suggestion': [suggestion: any]
}&gt;()

const messageTypeClass = computed(() =&gt; {
  return {
    'user-message': props.message.type === 'user',
    'assistant-message': props.message.type === 'assistant',
    'system-message': props.message.type === 'system'
  }
})

const formatTime = (timestamp: Date): string =&gt; {
  const now = new Date()
  const diff = now.getTime() - timestamp.getTime()
  
  // 小于1分钟
  if (diff &lt; 60000) {
    return '刚刚'
  }
  
  // 小于1小时
  if (diff &lt; 3600000) {
    const minutes = Math.floor(diff / 60000)
    return `${minutes}分钟前`
  }
  
  // 小于24小时
  if (diff &lt; 86400000) {
    const hours = Math.floor(diff / 3600000)
    return `${hours}小时前`
  }
  
  // 超过24小时，显示具体时间
  return timestamp.toLocaleString('zh-CN', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
&lt;/script&gt;

&lt;style scoped&gt;
.message-bubble {
  margin-bottom: 1rem;
}

.user-message {
  /* 用户消息样式 */
}

.assistant-message {
  /* 助手消息样式 */
}

.system-message {
  /* 系统消息样式 */
}
&lt;/style&gt;