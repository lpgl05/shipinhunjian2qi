<template>
  <div class="knowledge-agent-workspace h-full flex bg-gray-950">
    <!-- 左侧边栏 - 人格中心 -->
    <div class="w-80 border-r border-gray-800 bg-gray-900/50 flex flex-col">
      <!-- 头部 -->
      <div class="p-6 border-b border-gray-800">
        <h2 class="text-xl font-bold text-gray-50 mb-2">人格中心</h2>
        <p class="text-sm text-gray-400">管理您的AI人格</p>
      </div>

      <!-- 人格列表 -->
      <div class="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-3">
        <PersonaCard
          v-for="persona in personas"
          :key="persona.id"
          :persona="persona"
          :selected="selectedPersona?.id === persona.id"
          @click="selectPersona(persona)"
        />

        <!-- 空状态 -->
        <div v-if="personas.length === 0" class="text-center py-12">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-gray-800 rounded-2xl mb-4">
            <User :size="32" class="text-gray-600" />
          </div>
          <p class="text-gray-400 text-sm">
            还没有创建人格
          </p>
        </div>
      </div>

      <!-- 创建按钮 -->
      <div class="p-4 border-t border-gray-800">
        <button
          class="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-violet-500 hover:brightness-110 text-white font-medium rounded-xl transition-all flex items-center justify-center gap-2"
          @click="showCreateModal = true"
        >
          <Plus :size="20" />
          创建新人格
        </button>
      </div>
    </div>

    <!-- 主内容区 - 内容工作室 -->
    <div class="flex-1 flex flex-col">
      <!-- 工作室头部 -->
      <div class="px-8 py-6 border-b border-gray-800 bg-gray-900/30">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-50 mb-1">内容工作室</h1>
            <p class="text-sm text-gray-400">使用AI人格创作高质量内容</p>
          </div>

          <!-- 人格选择器 -->
          <div v-if="selectedPersona" class="flex items-center gap-3 px-4 py-2 bg-gray-800/50 rounded-xl border border-gray-700">
            <div class="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-violet-500 flex items-center justify-center text-sm font-bold text-white">
              {{ selectedPersona.name.substring(0, 2).toUpperCase() }}
            </div>
            <div>
              <p class="text-sm font-medium text-gray-300">当前人格</p>
              <p class="text-xs text-gray-500">{{ selectedPersona.name }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 工作区内容 -->
      <div class="flex-1 overflow-y-auto scrollbar-thin">
        <div class="max-w-6xl mx-auto p-8 space-y-6">
          <!-- 未选择人格提示 -->
          <div v-if="!selectedPersona" class="text-center py-20">
            <div class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-violet-500 rounded-3xl mb-6">
              <User :size="40" class="text-white" />
            </div>
            <h3 class="text-2xl font-bold text-gray-50 mb-3">选择或创建一个人格</h3>
            <p class="text-gray-400 mb-8">
              人格是AI的数字身份，包含知识库、写作风格和声纹
            </p>
            <button
              class="px-6 py-3 bg-gradient-to-r from-blue-500 to-violet-500 hover:brightness-110 text-white font-medium rounded-xl transition-all"
              @click="showCreateModal = true"
            >
              创建第一个人格
            </button>
          </div>

          <!-- 工作区 -->
          <template v-else>
            <!-- 任务输入区 -->
            <div class="space-y-4">
              <label class="block text-sm font-medium text-gray-300">
                任务描述
              </label>
              <textarea
                v-model="taskPrompt"
                rows="4"
                placeholder="描述您想要创作的内容，例如：撰写一篇1500字关于AI在营销行业应用的文章，并生成一个5分钟的播客..."
                class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-gray-300 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all resize-none"
                :disabled="isGenerating"
              ></textarea>
            </div>

            <!-- 操作按钮 -->
            <div class="flex gap-3">
              <button
                class="flex-1 px-6 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                :disabled="!taskPrompt.trim() || isGenerating"
                @click="handleGenerateText"
              >
                <FileText :size="20" />
                生成文本
              </button>
              <button
                class="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-violet-500 hover:brightness-110 text-white font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                :disabled="!taskPrompt.trim() || isGenerating"
                @click="handleGeneratePodcast"
              >
                <Music :size="20" />
                一键生成播客
              </button>
            </div>

            <!-- 生成状态 -->
            <GenerationStatusIndicator
              :status="generationStatus.status"
              :message="generationStatus.message"
              :progress="generationStatus.progress"
              @close="resetGenerationStatus"
            />

            <!-- 输出区域 -->
            <div v-if="outputContent" class="space-y-6">
              <!-- 文本输出 -->
              <MarkdownOutput
                v-if="outputContent.type === 'text'"
                :content="outputContent.content"
                @update:content="updateOutputContent"
              />

              <!-- 播客内容包输出 -->
              <PodcastPackageView
                v-if="outputContent.type === 'podcast'"
                :package-data="outputContent.data"
                @save-to-cloud="handleSaveToCloud"
                @download-all="handleDownloadAll"
              />
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- 创建人格模态框 -->
    <CreatePersonaModal
      v-model="showCreateModal"
      @create="handleCreatePersona"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { User, Plus, FileText, Music } from 'lucide-vue-next'
import PersonaCard from './PersonaCard.vue'
import CreatePersonaModal from './CreatePersonaModal.vue'
import GenerationStatusIndicator from './GenerationStatusIndicator.vue'
import MarkdownOutput from './MarkdownOutput.vue'
import PodcastPackageView from './PodcastPackageView.vue'
import { mockPersonas, mockGeneratedArticle, mockPodcastPackage } from './mockData'

interface Persona {
  id: string
  name: string
  avatarUrl?: string
  description: string
  knowledgeStats: {
    docs: number
    links: number
  }
}

interface GenerationStatus {
  status: 'idle' | 'processing' | 'success' | 'error'
  message: string
  progress?: number
}

interface OutputContent {
  type: 'text' | 'podcast'
  content?: string
  data?: any
}

const personas = ref<Persona[]>(mockPersonas)
// 默认选中第一个人格
const selectedPersona = ref<Persona | null>(mockPersonas.length > 0 ? mockPersonas[0] : null)
const showCreateModal = ref(false)
const taskPrompt = ref('')
const isGenerating = ref(false)
const generationStatus = ref<GenerationStatus>({
  status: 'idle',
  message: ''
})
const outputContent = ref<OutputContent | null>(null)

// 选择人格
const selectPersona = (persona: Persona) => {
  selectedPersona.value = persona
  // 重置输出
  outputContent.value = null
  resetGenerationStatus()
}

// 创建人格
const handleCreatePersona = (data: any) => {
  const newPersona: Persona = {
    id: Date.now().toString(),
    name: data.name,
    description: data.description,
    knowledgeStats: {
      docs: data.knowledgeSources.filter((s: any) => s.type === 'file').length,
      links: data.knowledgeSources.filter((s: any) => s.type === 'link').length
    }
  }
  
  personas.value.push(newPersona)
  selectedPersona.value = newPersona
}

// 生成文本
const handleGenerateText = async () => {
  isGenerating.value = true
  outputContent.value = null
  
  // 模拟生成过程
  generationStatus.value = { status: 'processing', message: '分析请求中...', progress: 0 }
  await sleep(1000)
  
  generationStatus.value = { status: 'processing', message: '学习知识库内容...', progress: 30 }
  await sleep(1500)
  
  generationStatus.value = { status: 'processing', message: '生成文章中...', progress: 60 }
  await sleep(2000)
  
  generationStatus.value = { status: 'processing', message: '优化文本风格...', progress: 90 }
  await sleep(1000)
  
  // 完成
  generationStatus.value = { status: 'success', message: '文章生成完成！', progress: 100 }
  outputContent.value = {
    type: 'text',
    content: mockGeneratedArticle
  }
  
  isGenerating.value = false
}

// 生成播客
const handleGeneratePodcast = async () => {
  isGenerating.value = true
  outputContent.value = null
  
  // 模拟生成过程
  generationStatus.value = { status: 'processing', message: '分析请求中...', progress: 0 }
  await sleep(1000)
  
  generationStatus.value = { status: 'processing', message: '生成文章内容...', progress: 20 }
  await sleep(2000)
  
  generationStatus.value = { status: 'processing', message: '提炼播客脚本...', progress: 40 }
  await sleep(1500)
  
  generationStatus.value = { status: 'processing', message: '克隆声音特征...', progress: 60 }
  await sleep(2000)
  
  generationStatus.value = { status: 'processing', message: '生成音频文件...', progress: 80 }
  await sleep(2500)
  
  generationStatus.value = { status: 'processing', message: '生成配套内容...', progress: 95 }
  await sleep(1000)
  
  // 完成
  generationStatus.value = { status: 'success', message: '播客内容包已就绪！', progress: 100 }
  outputContent.value = {
    type: 'podcast',
    data: mockPodcastPackage
  }
  
  isGenerating.value = false
}

// 重置生成状态
const resetGenerationStatus = () => {
  generationStatus.value = {
    status: 'idle',
    message: ''
  }
}

// 更新输出内容
const updateOutputContent = (content: string) => {
  if (outputContent.value && outputContent.value.type === 'text') {
    outputContent.value.content = content
  }
}

// 保存到云盘
const handleSaveToCloud = () => {
  console.log('保存到云盘')
  // TODO: 实现保存功能
}

// 下载全部
const handleDownloadAll = () => {
  console.log('下载全部')
  // TODO: 实现下载功能
}

// 工具函数
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
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

