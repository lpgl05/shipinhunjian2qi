<template>
  <div class="podcast-package-view bg-gray-800/30 rounded-2xl border border-gray-700 overflow-hidden">
    <!-- 标签页导航 -->
    <div class="flex border-b border-gray-700 bg-gray-800/50">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="flex-1 px-6 py-4 text-sm font-medium transition-all duration-200 relative"
        :class="[
          activeTab === tab.id
            ? 'text-blue-400'
            : 'text-gray-400 hover:text-gray-300'
        ]"
        @click="activeTab = tab.id"
      >
        <div class="flex items-center justify-center gap-2">
          <component :is="tab.icon" :size="18" />
          <span>{{ tab.label }}</span>
        </div>
        
        <!-- 激活指示器 -->
        <div 
          v-if="activeTab === tab.id"
          class="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-violet-500"
        ></div>
      </button>
    </div>

    <!-- 标签页内容 -->
    <div class="p-6">
      <!-- 音频与简介 -->
      <div v-show="activeTab === 'audio'" class="space-y-6">
        <!-- 音频播放器 -->
        <div class="p-6 bg-gray-800/50 rounded-xl border border-gray-700">
          <div class="flex items-center gap-4 mb-4">
            <div class="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-violet-500 flex items-center justify-center">
              <Music :size="24" class="text-white" />
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-50">播客音频</h3>
              <p class="text-sm text-gray-400">{{ formatDuration(packageData.duration) }}</p>
            </div>
          </div>
          
          <audio 
            :src="packageData.audioUrl" 
            controls 
            class="w-full"
            style="height: 48px; background: #1f2937; border-radius: 8px;"
          />
        </div>

        <!-- 播客简介 -->
        <div class="space-y-4">
          <h4 class="text-base font-semibold text-gray-50 flex items-center gap-2">
            <FileText :size="18" />
            播客简介
          </h4>
          
          <div class="p-4 bg-gray-800/50 rounded-xl border border-gray-700">
            <p class="text-gray-300 leading-relaxed">
              {{ packageData.showNotes.summary }}
            </p>
          </div>

          <!-- 章节标记 -->
          <div class="space-y-2">
            <h5 class="text-sm font-medium text-gray-400">章节标记</h5>
            <div class="space-y-2">
              <div
                v-for="(chapter, index) in packageData.showNotes.chapters"
                :key="index"
                class="flex items-start gap-3 p-3 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors cursor-pointer"
              >
                <span class="text-xs text-blue-400 font-mono mt-0.5">
                  {{ chapter.ts }}
                </span>
                <span class="text-sm text-gray-300">
                  {{ chapter.title }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 完整文字稿 -->
      <div v-show="activeTab === 'transcript'" class="space-y-4">
        <div class="flex items-center justify-between mb-4">
          <h4 class="text-base font-semibold text-gray-50 flex items-center gap-2">
            <FileText :size="18" />
            完整文字稿
          </h4>
          <button
            class="px-4 py-2 text-sm bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors flex items-center gap-2"
            @click="copyTranscript"
          >
            <Copy :size="16" />
            复制文字稿
          </button>
        </div>

        <div class="max-h-96 overflow-y-auto scrollbar-thin space-y-3">
          <div
            v-for="(item, index) in packageData.transcript"
            :key="index"
            class="flex gap-3 p-3 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors"
          >
            <span class="text-xs text-blue-400 font-mono flex-shrink-0 mt-0.5">
              {{ item.ts }}
            </span>
            <p class="text-sm text-gray-300 leading-relaxed flex-1">
              {{ item.text }}
            </p>
          </div>
        </div>
      </div>

      <!-- 关键词 -->
      <div v-show="activeTab === 'keywords'" class="space-y-4">
        <h4 class="text-base font-semibold text-gray-50 flex items-center gap-2">
          <Tag :size="18" />
          内容关键词
        </h4>
        
        <div class="flex flex-wrap gap-2">
          <span
            v-for="keyword in packageData.keywords"
            :key="keyword"
            class="px-4 py-2 bg-gradient-to-r from-blue-500/20 to-violet-500/20 border border-blue-500/30 text-blue-300 rounded-lg text-sm font-medium"
          >
            {{ keyword }}
          </span>
        </div>

        <div class="p-4 bg-gray-800/30 rounded-xl border border-gray-700">
          <p class="text-sm text-gray-400">
            这些关键词可用于内容分发、SEO优化和搜索引擎索引
          </p>
        </div>
      </div>
    </div>

    <!-- 底部操作栏 -->
    <div class="border-t border-gray-700 bg-gray-800/50 p-4">
      <div class="flex items-center justify-between">
        <div class="text-sm text-gray-400">
          内容包已生成 • {{ new Date().toLocaleString('zh-CN') }}
        </div>
        
        <div class="flex gap-2">
          <button
            class="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors flex items-center gap-2"
            @click="$emit('save-to-cloud')"
          >
            <Cloud :size="16" />
            保存至云盘
          </button>
          <button
            class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center gap-2"
            @click="$emit('download-all')"
          >
            <Download :size="16" />
            下载全部
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Music, FileText, Tag, Copy, Cloud, Download } from 'lucide-vue-next'

interface PodcastPackage {
  audioUrl: string
  duration: number
  transcript: Array<{
    ts: string
    text: string
  }>
  showNotes: {
    summary: string
    chapters: Array<{
      ts: string
      title: string
    }>
  }
  keywords: string[]
}

interface Props {
  packageData: PodcastPackage
}

defineProps<Props>()

const emit = defineEmits<{
  'save-to-cloud': []
  'download-all': []
}>()

const activeTab = ref('audio')

const tabs = [
  { id: 'audio', label: '音频与简介', icon: Music },
  { id: 'transcript', label: '完整文字稿', icon: FileText },
  { id: 'keywords', label: '关键词', icon: Tag }
]

// 格式化时长
const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

// 复制文字稿
const copyTranscript = () => {
  // TODO: 实现复制功能
  console.log('复制文字稿')
}
</script>

<style scoped>
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

