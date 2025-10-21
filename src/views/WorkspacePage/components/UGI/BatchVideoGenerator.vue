<template>
  <div class="batch-video-generator bg-gray-800 rounded-xl p-6 border border-gray-700">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-50 flex items-center gap-2">
        <Film :size="20" class="text-blue-400" />
        批量视频生成
      </h3>
      <span class="text-sm text-gray-400">共3个素材, 将生成3个视频</span>
    </div>

    <!-- 视频项目列表 -->
    <div class="space-y-4 mb-6">
      <div 
        v-for="(project, index) in videoProjects" 
        :key="project.id"
        class="video-project bg-gray-750 rounded-lg p-4 border border-gray-600"
      >
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-violet-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
              {{ index + 1 }}
            </div>
            <div>
              <h4 class="text-md font-medium text-gray-50">{{ project.title }}</h4>
              <p class="text-xs text-gray-400">{{ project.materialCount }}个素材</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <button class="icon-btn-sm" title="编辑">
              <Edit :size="16" />
            </button>
            <button class="icon-btn-sm text-red-400" title="删除">
              <Trash2 :size="16" />
            </button>
          </div>
        </div>

        <!-- 素材卡片 -->
        <div class="grid grid-cols-3 gap-2 mb-3">
          <div 
            v-for="material in project.materials" 
            :key="material.id"
            class="material-card bg-gray-700 rounded-lg p-2 flex flex-col items-center text-center"
          >
            <Grid3X3 :size="20" class="text-gray-400 mb-1" />
            <span class="text-xs text-gray-300">{{ material.title }}</span>
            <span class="text-xs text-gray-500">{{ material.duration }}s</span>
          </div>
          <!-- 添加素材按钮 -->
          <div class="material-card bg-gray-700/50 border-2 border-dashed border-gray-600 rounded-lg p-2 flex flex-col items-center justify-center text-center hover:border-blue-500 hover:bg-blue-500/10 transition-colors cursor-pointer">
            <Plus :size="20" class="text-gray-400 mb-1" />
            <span class="text-xs text-gray-400">添加素材</span>
          </div>
        </div>

        <!-- 项目信息 -->
        <div class="flex items-center justify-between text-sm">
          <span class="text-gray-400">总时长: {{ project.totalDuration }}秒</span>
          <span class="px-2 py-1 bg-gray-600 text-gray-300 text-xs rounded-full">{{ project.style }}</span>
        </div>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="flex items-center gap-3">
      <button 
        class="btn-primary flex items-center gap-2"
        @click="handleStartGeneration"
      >
        <Zap :size="16" />
        <span>生成所有视频</span>
      </button>
      <button 
        class="btn-secondary flex items-center gap-2"
        @click="handleAddProject"
      >
        <Plus :size="16" />
        <span>新建批量视频</span>
      </button>
      <button class="btn-secondary flex items-center gap-2">
        <Settings :size="16" />
        <span>批量设置</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { 
  Film, 
  Edit, 
  Trash2, 
  Grid3X3, 
  Plus, 
  Zap, 
  Settings 
} from 'lucide-vue-next'

interface Material {
  id: string
  title: string
  duration: number
}

interface VideoProject {
  id: string
  title: string
  materialCount: number
  materials: Material[]
  totalDuration: number
  style: string
}

// 模拟视频项目数据
const videoProjects = ref<VideoProject[]>([
  {
    id: '1',
    title: '产品展示视频',
    materialCount: 3,
    materials: [
      { id: '1', title: '开场片段', duration: 5 },
      { id: '2', title: '主要内容', duration: 15 },
      { id: '3', title: '结尾片段', duration: 5 }
    ],
    totalDuration: 25,
    style: '商务风格'
  },
  {
    id: '2',
    title: '社交媒体视频',
    materialCount: 0,
    materials: [],
    totalDuration: 0,
    style: '年轻化风格'
  },
  {
    id: '3',
    title: '批量视频 3',
    materialCount: 0,
    materials: [],
    totalDuration: 0,
    style: '默认风格'
  }
])

// 开始生成视频
const handleStartGeneration = () => {
  // 触发UGI事件，激活视频混剪智能体
  emit('select', { agentId: 'video-mixer', action: 'batch-generate' })
}

// 添加新项目
const handleAddProject = () => {
  const newProject: VideoProject = {
    id: Date.now().toString(),
    title: `批量视频 ${videoProjects.value.length + 1}`,
    materialCount: 0,
    materials: [],
    totalDuration: 0,
    style: '默认风格'
  }
  videoProjects.value.push(newProject)
}

// 定义事件
const emit = defineEmits<{
  select: [data: any]
}>()
</script>

<style scoped>
.material-card {
  min-height: 60px;
}

.icon-btn-sm {
  @apply p-1.5 text-gray-400 hover:text-gray-50 hover:bg-gray-600 rounded-lg transition-all;
}
</style>
