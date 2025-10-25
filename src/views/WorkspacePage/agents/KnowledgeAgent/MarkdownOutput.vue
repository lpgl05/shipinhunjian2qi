<template>
  <div class="markdown-output bg-gray-800/30 rounded-2xl border border-gray-700 overflow-hidden">
    <!-- 工具栏 -->
    <div class="flex items-center justify-between px-6 py-3 border-b border-gray-700 bg-gray-800/50">
      <div class="flex items-center gap-2 text-sm text-gray-400">
        <FileText :size="16" />
        <span>生成的文章</span>
        <span class="text-gray-600">•</span>
        <span>{{ wordCount }} 字</span>
      </div>
      
      <div class="flex gap-2">
        <button
          class="px-3 py-1.5 text-sm bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors flex items-center gap-2"
          @click="handleCopy"
        >
          <Copy :size="14" />
          复制
        </button>
        <button
          class="px-3 py-1.5 text-sm bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors flex items-center gap-2"
          @click="handleEdit"
        >
          <Edit :size="14" />
          编辑
        </button>
        <button
          class="px-3 py-1.5 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center gap-2"
          @click="handleDownload"
        >
          <Download :size="14" />
          下载
        </button>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="p-6">
      <div 
        v-if="!isEditing"
        class="prose prose-invert prose-blue max-w-none"
        v-html="renderedContent"
      ></div>
      
      <textarea
        v-else
        v-model="editableContent"
        class="w-full min-h-96 bg-gray-800/50 border border-gray-700 rounded-xl p-4 text-gray-300 font-mono text-sm resize-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 outline-none scrollbar-thin"
        @blur="saveEdit"
      ></textarea>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { FileText, Copy, Edit, Download } from 'lucide-vue-next'
import { marked } from 'marked'

interface Props {
  content: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:content': [content: string]
}>()

const isEditing = ref(false)
const editableContent = ref(props.content)

// 渲染Markdown
const renderedContent = computed(() => {
  return marked(props.content)
})

// 字数统计
const wordCount = computed(() => {
  return props.content.replace(/[^\u4e00-\u9fa5]/g, '').length
})

// 复制内容
const handleCopy = async () => {
  try {
    await navigator.clipboard.writeText(props.content)
    // TODO: 显示成功提示
    console.log('已复制到剪贴板')
  } catch (err) {
    console.error('复制失败:', err)
  }
}

// 编辑模式
const handleEdit = () => {
  isEditing.value = true
  editableContent.value = props.content
}

// 保存编辑
const saveEdit = () => {
  isEditing.value = false
  emit('update:content', editableContent.value)
}

// 下载文件
const handleDownload = () => {
  const blob = new Blob([props.content], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `article-${Date.now()}.md`
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<style scoped>
/* Prose样式 - 用于Markdown渲染 */
.prose {
  color: #d1d5db;
  line-height: 1.75;
}

.prose h1 {
  color: #f9fafb;
  font-size: 2em;
  font-weight: 700;
  margin-top: 0;
  margin-bottom: 0.8em;
}

.prose h2 {
  color: #f3f4f6;
  font-size: 1.5em;
  font-weight: 600;
  margin-top: 2em;
  margin-bottom: 1em;
}

.prose h3 {
  color: #e5e7eb;
  font-size: 1.25em;
  font-weight: 600;
  margin-top: 1.6em;
  margin-bottom: 0.6em;
}

.prose p {
  margin-top: 1.25em;
  margin-bottom: 1.25em;
}

.prose strong {
  color: #f9fafb;
  font-weight: 600;
}

.prose ul, .prose ol {
  margin-top: 1.25em;
  margin-bottom: 1.25em;
  padding-left: 1.625em;
}

.prose li {
  margin-top: 0.5em;
  margin-bottom: 0.5em;
}

.prose blockquote {
  border-left: 4px solid #3b82f6;
  padding-left: 1em;
  color: #9ca3af;
  font-style: italic;
  margin: 1.6em 0;
}

.prose code {
  background: #1f2937;
  padding: 0.2em 0.4em;
  border-radius: 0.25em;
  font-size: 0.875em;
  color: #60a5fa;
}

.prose pre {
  background: #1f2937;
  padding: 1em;
  border-radius: 0.5em;
  overflow-x: auto;
  margin: 1.6em 0;
}

.prose pre code {
  background: transparent;
  padding: 0;
  color: #d1d5db;
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

