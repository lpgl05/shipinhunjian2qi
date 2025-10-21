<template>
  <div class="subtitle-generator h-full flex bg-gray-900">
    <!-- 左侧：脚本输入区 -->
    <div class="w-1/2 p-6 border-r border-gray-700 flex flex-col">
      <div class="mb-4">
        <h3 class="text-xl font-bold text-gray-50 mb-2">视频脚本</h3>
        <p class="text-sm text-gray-400">输入你的视频脚本，AI将自动生成分镜和字幕</p>
      </div>

      <!-- 脚本输入框 -->
      <textarea
        v-model="scriptText"
        placeholder="请输入视频脚本内容...&#10;&#10;例如：&#10;开场：欢迎来到我的旅行vlog&#10;第一幕：清晨的海边，阳光洒在沙滩上&#10;第二幕：漫步在古镇小巷，感受历史的气息&#10;..."
        class="flex-1 p-4 bg-gray-800 border border-gray-700 rounded-lg text-gray-50 placeholder-gray-500 resize-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all scrollbar-thin"
      ></textarea>

      <!-- AI改写按钮 -->
      <div class="mt-4 flex gap-3">
        <button
          class="flex-1 btn-primary flex items-center justify-center gap-2"
          :disabled="!scriptText.trim() || isGenerating"
          @click="generateRewrite"
        >
          <Loader2 v-if="isGenerating" :size="20" class="animate-spin" />
          <Wand2 v-else :size="20" />
          <span>{{ isGenerating ? 'AI改写中...' : 'AI改写脚本' }}</span>
        </button>
        <button class="px-6 py-2.5 bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600 transition-all">
          清空
        </button>
      </div>
    </div>

    <!-- 右侧：文案改写条数显示 -->
    <div class="w-1/2 p-6 flex flex-col">
      <div class="mb-4">
        <h3 class="text-xl font-bold text-gray-50 mb-2">文案改写</h3>
        <p class="text-sm text-gray-400">{{ rewriteCount > 0 ? `共生成 ${rewriteCount} 条改写文案` : '等待生成...' }}</p>
      </div>

      <!-- 改写统计 -->
      <div class="grid grid-cols-2 gap-4 mb-6">
        <div class="stat-card">
          <div class="text-2xl font-bold text-blue-400">{{ rewriteCount }}</div>
          <div class="text-sm text-gray-400">改写条数</div>
        </div>
        <div class="stat-card">
          <div class="text-2xl font-bold text-green-400">{{ selectedCount }}</div>
          <div class="text-sm text-gray-400">已选择</div>
        </div>
      </div>

      <!-- 改写文案列表 -->
      <div class="flex-1 overflow-y-auto scrollbar-thin space-y-3">
        <!-- 骨架屏 (加载中) -->
        <div v-if="isGenerating" class="space-y-3">
          <div
            v-for="i in 5"
            :key="i"
            class="skeleton-card p-4 bg-gray-800 rounded-lg animate-pulse"
          >
            <div class="h-3 bg-gray-700 rounded w-3/4 mb-2"></div>
            <div class="h-3 bg-gray-700 rounded w-1/2"></div>
          </div>
        </div>

        <!-- 改写文案卡片 -->
        <div
          v-else-if="rewriteItems.length > 0"
          class="space-y-3"
        >
          <div
            v-for="(item, index) in rewriteItems"
            :key="item.id"
            class="rewrite-card"
            :class="{ 'selected': item.selected }"
          >
            <div class="flex items-start gap-3">
              <div class="flex-shrink-0">
                <button
                  class="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all"
                  :class="item.selected 
                    ? 'border-blue-500 bg-blue-500' 
                    : 'border-gray-600 hover:border-gray-400'"
                  @click="toggleSelect(item.id)"
                >
                  <Check v-if="item.selected" :size="14" class="text-white" />
                </button>
              </div>
              
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-xs font-medium text-gray-400">改写版本 {{ index + 1 }}</span>
                  <div class="flex items-center gap-2">
                    <button 
                      class="icon-btn-sm"
                      @click="copyText(item.content)"
                      title="复制"
                    >
                      <Copy :size="14" />
                    </button>
                    <button 
                      class="icon-btn-sm text-red-400"
                      @click="deleteItem(item.id)"
                      title="删除"
                    >
                      <Trash2 :size="14" />
                    </button>
                  </div>
                </div>
                
                <p class="text-sm text-gray-200 leading-relaxed">{{ item.content }}</p>
                
                <div class="flex items-center gap-4 mt-2 text-xs text-gray-500">
                  <span>{{ item.wordCount }} 字</span>
                  <span>{{ item.duration }}s</span>
                  <span class="px-2 py-0.5 bg-gray-700 rounded-full">{{ item.style }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-else class="flex flex-col items-center justify-center h-64 text-gray-500">
          <FileText :size="48" class="mb-4" />
          <p class="text-lg">暂无改写文案</p>
          <p class="text-sm">在左侧输入脚本后点击"AI改写脚本"生成</p>
        </div>
      </div>

      <!-- 底部操作按钮 -->
      <div v-if="rewriteItems.length > 0" class="flex gap-3 mt-6 pt-4 border-t border-gray-700">
        <button 
          class="btn-secondary flex-1 flex items-center justify-center gap-2"
          @click="selectAll"
          :disabled="selectedCount === rewriteCount"
        >
          <CheckSquare :size="16" />
          <span>全选</span>
        </button>
        <button 
          class="btn-primary flex-1 flex items-center justify-center gap-2"
          @click="useSelected"
          :disabled="selectedCount === 0"
        >
          <ArrowRight :size="16" />
          <span>使用选中文案 ({{ selectedCount }})</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { 
  Loader2, 
  Wand2, 
  FileText, 
  Check, 
  Copy, 
  Trash2, 
  CheckSquare, 
  ArrowRight 
} from 'lucide-vue-next'

interface RewriteItem {
  id: string
  content: string
  wordCount: number
  duration: number
  style: string
  selected: boolean
}

const scriptText = ref('')
const isGenerating = ref(false)
const rewriteItems = ref<RewriteItem[]>([])

// 计算属性
const rewriteCount = computed(() => rewriteItems.value.length)
const selectedCount = computed(() => rewriteItems.value.filter(item => item.selected).length)

// 生成改写文案
const generateRewrite = async () => {
  if (!scriptText.value.trim()) return
  
  isGenerating.value = true
  
  // 模拟AI改写过程
  setTimeout(() => {
    const newItems: RewriteItem[] = [
      {
        id: '1',
        content: '欢迎来到我的精彩旅行vlog！今天我们将一起探索美丽的海滨小镇，感受不一样的风景和人文魅力。',
        wordCount: 42,
        duration: 15,
        style: '活泼',
        selected: false
      },
      {
        id: '2',
        content: '在这个阳光明媚的早晨，我们来到了风景如画的海边。金色的阳光洒在细腻的沙滩上，海浪轻抚着海岸线。',
        wordCount: 45,
        duration: 18,
        style: '文艺',
        selected: false
      },
      {
        id: '3',
        content: '漫步在古镇的石板路上，每一块石头都诉说着历史的故事。古老的建筑与现代生活完美融合，让人流连忘返。',
        wordCount: 48,
        duration: 20,
        style: '古典',
        selected: false
      },
      {
        id: '4',
        content: '这里不仅有美丽的风景，还有丰富的美食文化。每一道菜都承载着当地人的热情和智慧。',
        wordCount: 38,
        duration: 16,
        style: '温馨',
        selected: false
      },
      {
        id: '5',
        content: '今天的旅程让我收获满满，不仅看到了美丽的风景，更感受到了不同文化的魅力。期待下一次的探索！',
        wordCount: 46,
        duration: 19,
        style: '总结',
        selected: false
      }
    ]
    
    rewriteItems.value = newItems
    isGenerating.value = false
  }, 2000)
}

// 切换选择状态
const toggleSelect = (id: string) => {
  const item = rewriteItems.value.find(item => item.id === id)
  if (item) {
    item.selected = !item.selected
  }
}

// 全选
const selectAll = () => {
  rewriteItems.value.forEach(item => {
    item.selected = true
  })
}

// 使用选中的文案
const useSelected = () => {
  const selectedItems = rewriteItems.value.filter(item => item.selected)
  console.log('使用选中的文案:', selectedItems)
  // 这里可以实现使用选中文案的逻辑
}

// 复制文案
const copyText = (text: string) => {
  navigator.clipboard.writeText(text)
  // 可以添加复制成功的提示
}

// 删除文案
const deleteItem = (id: string) => {
  rewriteItems.value = rewriteItems.value.filter(item => item.id !== id)
}
</script>

<style scoped>
.stat-card {
  @apply bg-gray-800 rounded-lg p-4 text-center;
}

.rewrite-card {
  @apply bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-all cursor-pointer;
}

.rewrite-card.selected {
  @apply border-blue-500 bg-blue-500/10;
}

.skeleton-card {
  @apply bg-gray-800 rounded-lg p-4;
}

.icon-btn-sm {
  @apply p-1.5 text-gray-400 hover:text-gray-50 hover:bg-gray-700 rounded-lg transition-all;
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