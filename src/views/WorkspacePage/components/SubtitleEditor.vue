<template>
  <div class="subtitle-editor">
    <!-- 工具栏 -->
    <div class="flex items-center justify-between mb-4">
      <div class="text-sm text-gray-400">
        共 {{ subtitles.length }} 条字幕
      </div>
      <div class="flex gap-2">
        <button class="btn-secondary text-sm flex items-center gap-2" @click="handleImportSRT">
          <Upload :size="16" />
          导入SRT
        </button>
        <button class="btn-secondary text-sm flex items-center gap-2" @click="handleExportSRT">
          <Download :size="16" />
          导出SRT
        </button>
        <button class="btn-primary text-sm flex items-center gap-2" @click="handleAddSubtitle">
          <Plus :size="16" />
          添加字幕
        </button>
      </div>
    </div>

    <!-- 字幕列表 -->
    <div class="space-y-3 max-h-96 overflow-y-auto scrollbar-thin">
      <div
        v-for="(subtitle, index) in subtitles"
        :key="subtitle.id"
        class="subtitle-item bg-gray-700 rounded-lg p-4 border border-gray-600 hover:border-gray-500 transition-colors"
      >
        <!-- 头部：时间码和操作 -->
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-3">
            <span class="text-xs font-bold text-gray-400 bg-gray-800 px-2 py-1 rounded">
              {{ index + 1 }}
            </span>
            <div class="flex items-center gap-2">
              <input
                v-model="subtitle.startTime"
                type="text"
                placeholder="00:00:00"
                class="input-primary text-xs w-24 px-2 py-1"
              />
              <ArrowRight :size="14" class="text-gray-500" />
              <input
                v-model="subtitle.endTime"
                type="text"
                placeholder="00:00:05"
                class="input-primary text-xs w-24 px-2 py-1"
              />
            </div>
          </div>

          <div class="flex items-center gap-2">
            <button
              class="icon-btn text-gray-400 hover:text-blue-400"
              title="跳转到此位置"
              @click="handleSeekToSubtitle(subtitle)"
            >
              <Play :size="16" />
            </button>
            <button
              class="icon-btn text-gray-400 hover:text-red-400"
              title="删除"
              @click="handleDeleteSubtitle(subtitle.id)"
            >
              <Trash2 :size="16" />
            </button>
          </div>
        </div>

        <!-- 字幕文本编辑器 -->
        <textarea
          v-model="subtitle.text"
          placeholder="输入字幕文本..."
          rows="2"
          class="w-full input-primary text-sm resize-none"
        ></textarea>

        <!-- 样式选项 -->
        <div class="flex items-center gap-3 mt-3">
          <select v-model="subtitle.position" class="input-primary text-xs px-2 py-1">
            <option value="bottom">底部</option>
            <option value="top">顶部</option>
            <option value="middle">中间</option>
          </select>

          <select v-model="subtitle.fontSize" class="input-primary text-xs px-2 py-1">
            <option value="small">小字体</option>
            <option value="medium">中字体</option>
            <option value="large">大字体</option>
          </select>

          <input
            v-model="subtitle.color"
            type="color"
            class="w-8 h-8 rounded cursor-pointer"
            title="字体颜色"
          />
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="subtitles.length === 0" class="text-center py-12">
        <AlignLeft :size="48" class="mx-auto mb-3 text-gray-600" />
        <p class="text-sm text-gray-400 mb-4">暂无字幕</p>
        <button class="btn-primary" @click="handleAddSubtitle">
          <Plus :size="18" class="mr-2" />
          添加第一条字幕
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Upload, Download, Plus, ArrowRight, Play, Trash2, AlignLeft } from 'lucide-vue-next'

interface Subtitle {
  id: string
  startTime: string
  endTime: string
  text: string
  position: 'top' | 'middle' | 'bottom'
  fontSize: 'small' | 'medium' | 'large'
  color: string
}

const subtitles = ref<Subtitle[]>([
  {
    id: '1',
    startTime: '00:00:00',
    endTime: '00:00:05',
    text: '欢迎来到AI视频混剪平台',
    position: 'bottom',
    fontSize: 'medium',
    color: '#FFFFFF'
  },
  {
    id: '2',
    startTime: '00:00:05',
    endTime: '00:00:10',
    text: '让创意触手可及',
    position: 'bottom',
    fontSize: 'medium',
    color: '#FFFFFF'
  }
])

const handleAddSubtitle = () => {
  const newSubtitle: Subtitle = {
    id: Date.now().toString(),
    startTime: '00:00:00',
    endTime: '00:00:05',
    text: '',
    position: 'bottom',
    fontSize: 'medium',
    color: '#FFFFFF'
  }
  subtitles.value.push(newSubtitle)
}

const handleDeleteSubtitle = (id: string) => {
  const index = subtitles.value.findIndex(s => s.id === id)
  if (index !== -1) {
    subtitles.value.splice(index, 1)
  }
}

const handleSeekToSubtitle = (subtitle: Subtitle) => {
  console.log('跳转到:', subtitle.startTime)
  // TODO: 实现视频跳转
}

const handleImportSRT = () => {
  console.log('导入SRT文件')
  // TODO: 实现SRT导入
}

const handleExportSRT = () => {
  console.log('导出SRT文件')
  // TODO: 实现SRT导出
}
</script>


