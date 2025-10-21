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
          @click="generateStoryboard"
        >
          <Loader2 v-if="isGenerating" :size="20" class="animate-spin" />
          <Wand2 v-else :size="20" />
          <span>{{ isGenerating ? 'AI生成中...' : 'AI改写并生成分镜' }}</span>
        </button>
        <button class="px-6 py-2.5 bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600 transition-all">
          清空
        </button>
      </div>
    </div>

    <!-- 右侧：分镜列表区 -->
    <div class="w-1/2 p-6 flex flex-col">
      <div class="mb-4">
        <h3 class="text-xl font-bold text-gray-50 mb-2">AI生成分镜</h3>
        <p class="text-sm text-gray-400">{{ scenes.length > 0 ? `共 ${scenes.length} 个分镜` : '等待生成...' }}</p>
      </div>

      <!-- 分镜列表 -->
      <div class="flex-1 overflow-y-auto scrollbar-thin space-y-4">
        <!-- 骨架屏 (加载中) -->
        <div v-if="isGenerating" class="space-y-4">
          <div
            v-for="i in 3"
            :key="i"
            class="skeleton-card p-4 bg-gray-800 rounded-lg animate-pulse"
          >
            <div class="h-4 bg-gray-700 rounded w-1/4 mb-3"></div>
            <div class="h-3 bg-gray-700 rounded w-full mb-2"></div>
            <div class="h-3 bg-gray-700 rounded w-5/6"></div>
          </div>
        </div>

        <!-- 分镜卡片列表 -->
        <draggable
          v-else-if="scenes.length > 0"
          v-model="scenes"
          item-key="id"
          class="space-y-4"
          :animation="200"
          ghost-class="ghost"
        >
          <template #item="{ element: scene, index }">
            <div class="scene-card group p-4 bg-gray-800 rounded-lg border border-gray-700 hover:border-gray-600 transition-all">
              <!-- 卡片头部 -->
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                    {{ index + 1 }}
                  </div>
                  <input
                    v-model="scene.title"
                    class="bg-transparent border-none outline-none text-gray-50 font-semibold flex-1"
                    placeholder="场景标题"
                  />
                </div>
                <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button class="p-1 text-gray-400 hover:text-gray-50 transition-colors">
                    <GripVertical :size="16" />
                  </button>
                  <button 
                    class="p-1 text-gray-400 hover:text-red-400 transition-colors"
                    @click="removeScene(scene.id)"
                  >
                    <Trash2 :size="16" />
                  </button>
                </div>
              </div>

              <!-- 场景描述 -->
              <textarea
                v-model="scene.description"
                rows="3"
                class="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-50 text-sm placeholder-gray-500 resize-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                placeholder="场景描述..."
              ></textarea>

              <!-- 场景时长 -->
              <div class="mt-3 flex items-center gap-2">
                <Clock :size="16" class="text-gray-400" />
                <input
                  v-model.number="scene.duration"
                  type="number"
                  min="1"
                  max="60"
                  class="w-20 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-gray-50 text-sm outline-none"
                />
                <span class="text-sm text-gray-400">秒</span>
              </div>
            </div>
          </template>
        </draggable>

        <!-- 空状态 -->
        <div v-else class="text-center py-20">
          <FileText :size="48" class="mx-auto mb-4 text-gray-600" />
          <p class="text-gray-500">暂无分镜，请输入脚本并点击生成</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import draggable from 'vuedraggable'
import { 
  Wand2, 
  Loader2,
  Clock,
  GripVertical,
  Trash2,
  FileText
} from 'lucide-vue-next'

// 脚本文本
const scriptText = ref('')

// 是否正在生成
const isGenerating = ref(false)

// 分镜场景列表
const scenes = ref<any[]>([])

// 生成分镜
const generateStoryboard = async () => {
  if (!scriptText.value.trim()) return

  isGenerating.value = true

  // 模拟AI生成
  setTimeout(() => {
    scenes.value = [
      {
        id: Date.now() + 1,
        title: '开场',
        description: '欢迎来到我的旅行vlog，今天带大家探索这座美丽的城市',
        duration: 5
      },
      {
        id: Date.now() + 2,
        title: '第一幕：海边清晨',
        description: '清晨的海边，阳光洒在沙滩上，海浪轻轻拍打着岸边',
        duration: 8
      },
      {
        id: Date.now() + 3,
        title: '第二幕：古镇漫步',
        description: '漫步在古镇小巷，感受历史的气息，品味传统文化',
        duration: 10
      }
    ]
    isGenerating.value = false
  }, 2000)
}

// 移除场景
const removeScene = (id: number) => {
  const index = scenes.value.findIndex(s => s.id === id)
  if (index > -1) {
    scenes.value.splice(index, 1)
  }
}
</script>

<style scoped>
/* 按钮样式 */
.btn-primary {
  @apply px-6 py-2.5 bg-gradient-to-r from-blue-500 to-violet-500 text-white rounded-lg font-medium hover:brightness-110 transform hover:scale-105 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none;
}

/* 拖拽幽灵样式 */
.ghost {
  opacity: 0.5;
  background: #3B82F6;
}

/* 加载动画 */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* 脉冲动画 */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
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

