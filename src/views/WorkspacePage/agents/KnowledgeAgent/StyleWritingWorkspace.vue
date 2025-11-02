<template>
  <div class="style-writing-workspace h-screen flex bg-gray-900">
    <!-- 侧边栏 -->
    <AppSidebar />
    
    <!-- 主内容区域 -->
    <div class="flex-1 flex">
      <!-- 左侧对话区域 -->
    <div class="chat-panel w-1/2 flex flex-col border-r border-gray-800">
      <!-- 对话头部 -->
      <div class="chat-header px-6 py-4 border-b border-gray-800 bg-gray-900/50">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <Type :size="20" class="text-white" />
          </div>
          <div>
            <h1 class="text-lg font-semibold text-gray-50">风格模仿写作大师</h1>
            <p class="text-sm text-gray-400">基于知识库智能仿写营销文案</p>
          </div>
        </div>
      </div>

      <!-- 消息列表 -->
      <div ref="messagesContainer" class="flex-1 overflow-y-auto scrollbar-thin p-6">
        <div class="max-w-2xl mx-auto space-y-6">
          <!-- 欢迎消息 -->
          <div v-if="chatStore.messages.length === 0" class="text-center py-16">
            <div class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl mb-6 shadow-2xl shadow-purple-500/30">
              <Type :size="36" class="text-white" />
            </div>
            <h2 class="text-3xl font-bold text-gray-50 mb-3">欢迎使用风格模仿写作大师</h2>
            <p class="text-base text-gray-400 max-w-md mx-auto">告诉我您想要创作的内容，或使用下方的模板快速开始</p>
          </div>

          <!-- 消息列表 -->
          <div v-else class="space-y-4">
            <ChatMessage
              v-for="message in chatStore.messages"
              :key="message.id"
              :message="message"
              @style-select="handleStyleSelect"
              @config-update="handleConfigUpdate"
            />
          </div>

          <!-- AI思考中 -->
          <div v-if="chatStore.isAiTyping" class="flex gap-3 justify-start">
            <div class="flex-shrink-0">
              <div class="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Bot :size="20" class="text-white" />
              </div>
            </div>
            <div class="bg-gray-800 rounded-2xl rounded-tl-sm px-4 py-3">
              <div class="flex items-center gap-2">
                <div class="flex gap-1">
                  <div class="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                  <div class="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
                  <div class="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                </div>
                <span class="text-sm text-gray-400">AI正在思考...</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 输入区域 -->
      <div class="input-area p-6 bg-gray-900/50">
        <div class="max-w-3xl mx-auto space-y-4">
          <!-- 📝 写作模板区域 - 全新设计 -->
          <div v-if="writingTemplates.length > 0" class="template-section">
            <!-- 智能推荐 + 分类标签 -->
            <div class="flex items-center justify-between mb-3">
              <!-- 智能推荐提示 -->
              <div class="flex items-center gap-2">
                <span class="text-sm font-medium text-gray-300">✨ 快速开始</span>
                <span v-if="selectedStyle" class="text-xs text-purple-400 bg-purple-500/10 px-2 py-1 rounded-full">
                  基于「{{ selectedStyle.name }}」推荐
                </span>
              </div>
              
              <!-- 分类标签 -->
              <div class="flex items-center gap-2">
                <button
                  v-for="category in templateCategories"
                  :key="category.id"
                  class="text-xs px-2.5 py-1 rounded-full transition-colors"
                  :class="selectedCategory === category.id 
                    ? 'bg-purple-500 text-white' 
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-300'"
                  @click="selectedCategory = category.id"
                >
                  {{ category.name }}
                </button>
              </div>
            </div>
            
            <!-- 模板列表 - 横向滚动 -->
            <div class="template-grid overflow-x-auto pb-2 scrollbar-thin">
              <div class="flex gap-2 min-w-max">
                <button
                  v-for="template in filteredTemplates"
                  :key="template.id"
                  class="flex-shrink-0 px-4 py-2.5 bg-gray-800/80 hover:bg-gray-700 text-gray-300 hover:text-white text-sm rounded-lg border border-gray-700 hover:border-purple-500 transition-all flex items-center gap-2 group"
                  @click="handleTemplateSelect(template)"
                >
                  <FileText :size="16" class="text-gray-500 group-hover:text-purple-400 transition-colors" />
                  <span class="font-medium">{{ template.name }}</span>
                </button>
              </div>
            </div>
          </div>

          <!-- 输入框 - 更大更明显 -->
          <div class="relative">
            <textarea
              ref="textareaRef"
              v-model="inputText"
              rows="6"
              placeholder="描述您想要创作的内容，或点击上方模板快速开始..."
              class="w-full px-5 py-4 pr-14 bg-gray-800 border border-gray-700 rounded-xl text-base text-gray-300 placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 outline-none transition-all resize-none shadow-lg"
              @keydown="handleKeydown"
              @input="autoResize"
            ></textarea>
            <button
              class="absolute right-4 bottom-4 p-2.5 bg-gradient-to-r from-purple-500 to-pink-500 hover:brightness-110 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/30"
              :disabled="!inputText.trim() || chatStore.isAiTyping"
              @click="sendMessage"
            >
              <Send :size="18" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 右侧配置和输出区域 -->
    <div class="config-panel w-1/2 flex flex-col">
      <!-- 配置头部 - 居中步骤指示器 -->
      <div class="config-header px-6 py-4 border-b border-gray-800 bg-gray-900/50">
        <div class="flex items-center justify-center">
          <div class="flex items-center gap-4">
            <!-- 第一步 -->
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all"
                :class="currentStep === 1 ? 'bg-purple-500 text-white' : 'bg-gray-700 text-gray-400'">
                1
              </div>
              <span class="text-sm font-medium" :class="currentStep === 1 ? 'text-gray-200' : 'text-gray-500'">
                配置参数
              </span>
            </div>
            
            <!-- 分隔线 -->
            <div class="w-12 h-0.5 bg-gray-700"></div>
            
            <!-- 第二步 -->
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all"
                :class="currentStep === 2 ? 'bg-purple-500 text-white' : 'bg-gray-700 text-gray-400'">
                2
              </div>
              <span class="text-sm font-medium" :class="currentStep === 2 ? 'text-gray-200' : 'text-gray-500'">
                生成结果
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 配置内容 -->
      <div class="flex-1 overflow-y-auto scrollbar-thin">
        <!-- 第一步：配置参数 -->
        <div v-if="currentStep === 1" class="p-6 space-y-6">
          <!-- 风格管理 -->
          <StyleManager
            :selected-style="selectedStyle"
            :available-styles="allStyles"
            :my-styles="myStyles"
            @style-select="handleStyleSelect"
            @style-create="handleStyleCreate"
            @style-update="handleStyleUpdate"
            @style-delete="handleStyleDelete"
          />

          <!-- 配置表单 -->
          <div v-if="showConfigForm && !isGenerating && currentStep === 1" class="space-y-4">
            <!-- 创作配置区域 - 悬浮显示边框 -->
            <div class="config-form-area p-4 rounded-lg border border-transparent hover:border-gray-700 transition-colors space-y-4">
              <!-- 主题和字数要求 - 同一行 -->
              <div class="grid grid-cols-2 gap-4">
                <!-- 主题 -->
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">
                    主题 <span class="text-red-400">*</span>
                  </label>
                  <input
                    v-model="configForm.topic"
                    type="text"
                    placeholder="输入文章主题"
                    class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 outline-none"
                  />
                </div>

                <!-- 字数要求 -->
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">
                    字数要求 <span class="text-red-400">*</span>
                  </label>
                  <select
                    v-model="configForm.wordCount"
                    class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 outline-none"
                  >
                    <option value="500">500字</option>
                    <option value="800">800字</option>
                    <option value="1000">1000字</option>
                    <option value="1500">1500字</option>
                    <option value="2000">2000字</option>
                    <option value="custom">自定义</option>
                  </select>
                </div>
              </div>

              <!-- 自定义字数 -->
              <div v-if="configForm.wordCount === 'custom'">
                <input
                  v-model="configForm.customWordCount"
                  type="number"
                  placeholder="输入具体字数"
                  class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 outline-none"
                />
              </div>

              <!-- 是否引用知识库 -->
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">
                  是否引用知识库 <span class="text-gray-500">(选填)</span>
                </label>
                <div class="flex gap-2 mb-3">
                  <button
                    type="button"
                    class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    :class="configForm.useKnowledgeBase ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'"
                    @click="configForm.useKnowledgeBase = true"
                  >
                    引用知识库
                  </button>
                  <button
                    type="button"
                    class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    :class="!configForm.useKnowledgeBase ? 'bg-gray-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'"
                    @click="configForm.useKnowledgeBase = false; configForm.selectedKnowledgeBase = null"
                  >
                    不引用
                  </button>
                </div>
                
                <!-- 知识库选择 -->
                <div v-if="configForm.useKnowledgeBase" class="grid grid-cols-2 gap-3 max-h-48 overflow-y-auto">
                  <div
                    v-for="kb in knowledgeBaseStore.knowledgeBases.filter(k => k.status === 'completed')"
                    :key="kb.id"
                    class="p-3 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-purple-500 transition-colors cursor-pointer"
                    :class="{ 'border-purple-500 bg-purple-500/10': configForm.selectedKnowledgeBase === kb.id }"
                    @click="configForm.selectedKnowledgeBase = kb.id"
                  >
                    <div class="flex items-center gap-2 mb-1">
                      <BookOpen :size="16" class="text-purple-400" />
                      <span class="text-sm font-medium text-gray-200 truncate">{{ kb.name }}</span>
                    </div>
                    <p class="text-xs text-gray-400 truncate">{{ kb.documentCount }} 个文档</p>
                  </div>
                  <div v-if="knowledgeBaseStore.knowledgeBases.filter(k => k.status === 'completed').length === 0" class="col-span-2 text-center py-4">
                    <p class="text-sm text-gray-400">暂无可用知识库</p>
                    <button
                      type="button"
                      class="mt-2 text-xs text-purple-400 hover:text-purple-300 transition-colors"
                      @click="handleGoToKnowledgeBase"
                    >
                      去创建知识库 →
                    </button>
                  </div>
                </div>
              </div>

              <!-- 备注 -->
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">备注 <span class="text-gray-500">(选填)</span></label>
                <textarea
                  v-model="configForm.notes"
                  rows="2"
                  placeholder="其他要求或备注..."
                  class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 outline-none resize-none"
                ></textarea>
              </div>
            </div>

            <!-- 生成按钮 -->
            <button
              class="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:brightness-110 text-white font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              :disabled="!configForm.topic.trim()"
              @click="generateContent"
            >
              <FileText :size="20" />
              开始生成内容
            </button>
          </div>
        </div>

        <!-- 第二步：生成结果或生成中状态 -->
        <div v-if="currentStep === 2" class="h-full flex flex-col">
          <!-- 生成中状态 -->
          <div v-if="isGenerating" class="h-full flex items-center justify-center">
            <div class="text-center">
              <div class="relative w-24 h-24 mx-auto mb-6">
                <div class="absolute inset-0 rounded-full border-4 border-gray-700"></div>
                <div class="absolute inset-0 rounded-full border-4 border-purple-500 border-t-transparent animate-spin"></div>
                <div class="absolute inset-0 flex items-center justify-center">
                  <FileText :size="32" class="text-purple-400" />
                </div>
              </div>
              <h3 class="text-xl font-semibold text-gray-200 mb-2">AI正在生成中<span class="loading-dots"></span></h3>
              <p class="text-sm text-gray-400">预计需要 3-5 分钟，请稍候...</p>
            </div>
          </div>

          <!-- 生成结果 -->
          <template v-else>
          <!-- 内容展示区域 -->
          <div class="flex-1 p-6 relative">
            <div class="h-full flex flex-col">
              <!-- 内容标题和操作按钮 -->
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-medium text-gray-300">生成的文章</h3>
                
                <!-- 操作按钮组 -->
                <div class="flex items-center gap-2">
                  <!-- 编辑/保存按钮 -->
                  <button
                    v-if="!isEditing"
                    class="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors flex items-center gap-2 text-sm"
                    @click="toggleEdit"
                  >
                    <Edit3 :size="16" />
                    编辑
                  </button>
                  <template v-else>
                    <button
                      class="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-2 text-sm"
                      @click="saveEdit"
                    >
                      <Check :size="16" />
                      保存
                    </button>
                    <button
                      class="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors flex items-center gap-2 text-sm"
                      @click="cancelEdit"
                    >
                      <X :size="16" />
                      取消
                    </button>
                  </template>
                  
                  <!-- 生成播客按钮 -->
                  <button
                    class="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors flex items-center gap-2 text-sm"
                    @click="scrollToAudioBlog"
                  >
                    <Volume2 :size="16" />
                    生成播客
                  </button>
                  
                  <!-- 更多操作 -->
                  <div class="relative">
                    <button
                      class="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors flex items-center gap-2 text-sm"
                      @click="showActionsMenu = !showActionsMenu"
                    >
                      <MoreVertical :size="16" />
                      更多
                    </button>
                    
                    <!-- 下拉菜单 -->
                    <div 
                      v-if="showActionsMenu"
                      class="absolute right-0 mt-2 w-44 bg-gray-800 rounded-lg shadow-xl border border-gray-700 py-2 z-50"
                    >
                      <button
                        class="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 transition-colors flex items-center gap-3"
                        @click="copyContent(); showActionsMenu = false"
                      >
                        <Copy :size="16" />
                        <span>复制内容</span>
                      </button>
                      <button
                        class="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 transition-colors flex items-center gap-3"
                        @click="downloadContent(); showActionsMenu = false"
                      >
                        <Download :size="16" />
                        <span>下载文档</span>
                      </button>
                      <div class="border-t border-gray-700 my-2"></div>
                      <button
                        class="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 transition-colors flex items-center gap-3"
                        @click="syncToFeishu(); showActionsMenu = false"
                      >
                        <FileText :size="16" />
                        <span>同步到飞书</span>
                      </button>
                      <div class="border-t border-gray-700 my-2"></div>
                      <button
                        class="w-full px-4 py-2 text-left text-sm text-gray-400 hover:bg-gray-700 transition-colors flex items-center gap-3"
                        @click="backToConfig(); showActionsMenu = false"
                      >
                        <RefreshCw :size="16" />
                        <span>重新配置</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 内容区域 -->
              <div class="flex-1 bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
                <!-- 编辑模式 -->
                <div v-if="isEditing" class="h-full flex flex-col">
                  <textarea
                    v-model="editedContent"
                    class="flex-1 p-4 bg-transparent text-gray-300 placeholder-gray-500 resize-none outline-none"
                    placeholder="在这里编辑文章内容..."
                  ></textarea>
                </div>
                
                <!-- 预览模式 -->
                <div v-else class="h-full overflow-y-auto p-4">
                  <div class="prose prose-invert max-w-none">
                    <div v-html="isEditing ? markdownToHtml(editedContent) : generatedContent" class="text-gray-300 leading-relaxed"></div>
                  </div>
                </div>
              </div>
              
              <!-- 提示文字 -->
              <div class="mt-3 px-2">
                <p class="text-xs text-gray-500 flex items-center gap-2">
                  <span class="text-purple-400">💡</span>
                  提示：您也可以在左侧对话窗口中输入指令，对文章进行进一步的调整和优化
                </p>
              </div>
            </div>
          </div>

          <!-- 音频博客生成器 - 初始隐藏 -->
          <div v-if="showAudioBlog" class="audio-blog-section border-t border-gray-800 p-6 bg-gray-900/50">
            <AudioBlogGenerator
              ref="audioBlogRef"
              :content="editedContent || generatedContent"
              @audio-generated="handleAudioGenerated"
              @config-cancelled="handleAudioConfigCancelled"
            />
          </div>
          </template>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { 
  Type, 
  Send, 
  Bot, 
  FileText, 
  Copy, 
  Download,
  Edit3,
  BookOpen,
  MoreVertical,
  Check,
  RefreshCw,
  X,
  Volume2
} from 'lucide-vue-next'
import { marked } from 'marked'
import ChatMessage from './ChatMessage.vue'
import StyleManager from './StyleManager.vue'
import AudioBlogGenerator from './AudioBlogGenerator.vue'
import AppSidebar from '../../AppSidebar.vue'
import { useChatStore } from '../../../../store/chat'
import { useFrontendConfigStore } from '../../../../store/frontend-config'
import { useDocumentsStore } from '../../../../store/documents'
import { useKnowledgeBaseStore } from '../../../../store/knowledge-base'

const router = useRouter()
const chatStore = useChatStore()
const frontendConfigStore = useFrontendConfigStore()
const documentsStore = useDocumentsStore()
const knowledgeBaseStore = useKnowledgeBaseStore()

// 响应式数据
const inputText = ref('')
const textareaRef = ref<HTMLTextAreaElement>()
const messagesContainer = ref<HTMLElement>()
const selectedStyle = ref<any>(null)
const showConfigForm = ref(false)
const generatedContent = ref('')
const currentStep = ref(1) // 1: 配置步骤, 2: 生成步骤, 2.5: 生成中
const isEditing = ref(false)
const editedContent = ref('')
const showActionsMenu = ref(false)
const isGenerating = ref(false)
const showAudioBlog = ref(false) // 控制音频博客区域显示
const audioBlogRef = ref<any>(null) // 音频博客组件引用

// 配置表单
const configForm = ref({
  topic: '',
  wordCount: '1000',
  customWordCount: '',
  useKnowledgeBase: false,
  selectedKnowledgeBase: null as string | null,
  notes: ''
})

// 模板分类
const templateCategories = ref([
  { id: 'all', name: '全部' },
  { id: 'marketing', name: '营销类' },
  { id: 'technical', name: '技术类' },
  { id: 'business', name: '商务类' }
])

// 当前选中的分类
const selectedCategory = ref('all')

// 写作模板
const writingTemplates = computed(() => {
  return frontendConfigStore.getWritingTemplates()
})

// 过滤后的模板（根据分类和选中的风格智能推荐）
const filteredTemplates = computed(() => {
  let templates = writingTemplates.value
  
  // 根据分类过滤
  if (selectedCategory.value !== 'all') {
    templates = templates.filter(t => t.category === selectedCategory.value)
  }
  
  // 如果选中了风格，优先推荐相关模板
  if (selectedStyle.value) {
    // 这里可以根据风格智能排序模板
    // 例如：雷军风格优先推荐产品发布会、年度总结等
    // 华与华风格优先推荐品牌营销、战略规划等
  }
  
  return templates
})

// 我的风格（包含基于文档训练的 + 手动创建的）
const myStyles = computed(() => {
  // 基于文档训练的风格
  const trainedDocs = documentsStore.documents.filter(doc => doc.trainingStatus === 'completed')
  const docStyles = trainedDocs.map(doc => ({
    id: `my-style-${doc.id}`,
    name: `我的风格-${doc.name}`,
    description: `基于文档"${doc.name}"训练的专属风格`,
    color: 'bg-blue-500',
    source: '个人知识库',
    isMine: true
  }))
  
  // 手动创建的风格
  const createdStyles = availableStyles.value.filter(style => style.isMine)
  
  // 合并两种类型的风格
  return [...createdStyles, ...docStyles]
})

// 预设风格
const availableStyles = ref([
  {
    id: 'leijun-style',
    name: '雷军风格',
    description: '小米创始人雷军的演讲和写作风格，简洁有力、务实创新',
    color: 'bg-orange-500',
    source: '系统预设'
  },
  {
    id: 'huayuhua-style',
    name: '华与华风格',
    description: '华与华战略营销咨询公司的品牌营销理念和方法论风格',
    color: 'bg-red-500',
    source: '系统预设'
  },
  {
    id: 'marketing-director',
    name: '营销总监',
    description: '营销导向的写作风格，注重用户体验和转化',
    color: 'bg-purple-500',
    source: '系统预设'
  }
])

// 所有风格（我的风格 + 系统预设风格，避免重复）
const allStyles = computed(() => {
  const systemStyles = availableStyles.value.filter(style => !style.isMine)
  return [...myStyles.value, ...systemStyles]
})

// 自动调整textarea高度
const autoResize = () => {
  if (textareaRef.value) {
    textareaRef.value.style.height = 'auto'
    textareaRef.value.style.height = textareaRef.value.scrollHeight + 'px'
  }
}

// 滚动到底部
const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

// 处理键盘事件
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    sendMessage()
  }
}

// 发送消息
const sendMessage = () => {
  if (!inputText.value.trim() || chatStore.isAiTyping) return
  
  const message = inputText.value.trim()
  inputText.value = ''
  autoResize()
  
  // 发送用户消息
  chatStore.sendMessage(message)
  
  // 模拟AI回复
  setTimeout(() => {
    handleAiResponse(message)
  }, 1000)
  
  scrollToBottom()
}

// 处理模板选择
const handleTemplateSelect = (template: any) => {
  inputText.value = template.prompt
  nextTick(() => {
    textareaRef.value?.focus()
    autoResize()
  })
}

// 处理AI回复
const handleAiResponse = (userMessage: string) => {
  // 根据用户输入推荐风格
  const recommendedStyle = allStyles.value[0] // 默认推荐第一个
  selectedStyle.value = recommendedStyle
  showConfigForm.value = true
  
  const aiResponse = `根据您的需求"${userMessage}"，我为您推荐使用"${recommendedStyle?.name || '默认'}"风格。这种风格${recommendedStyle?.description || '适合多种场景'}。

请填写以下配置信息，我将为您生成高质量的内容：`
  
  chatStore.addAiMessage(aiResponse, 'style-recommendation', {
    recommendedStyle,
    availableStyles: allStyles.value
  })
  
  scrollToBottom()
}

// 处理风格选择
const handleStyleSelect = (style: any) => {
  selectedStyle.value = style
  showConfigForm.value = true
}

// 跳转到知识库页面
const handleGoToKnowledgeBase = () => {
  router.push('/knowledge-base')
}

// 处理风格创建
const handleStyleCreate = (style: any) => {
  // 添加到可用风格列表
  availableStyles.value.push(style)
  
  // 自动选中新创建的风格
  selectedStyle.value = style
  
  // 显示配置表单
  showConfigForm.value = true
  
  // 滚动到配置表单区域
  nextTick(() => {
    const configElement = document.querySelector('.config-form')
    if (configElement) {
      configElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  })
}

// 处理风格更新
const handleStyleUpdate = (updatedStyle: any) => {
  const index = availableStyles.value.findIndex(s => s.id === updatedStyle.id)
  if (index !== -1) {
    availableStyles.value[index] = updatedStyle
    if (selectedStyle.value?.id === updatedStyle.id) {
      selectedStyle.value = updatedStyle
    }
  }
}

// 处理风格删除
const handleStyleDelete = (styleId: string) => {
  const index = availableStyles.value.findIndex(s => s.id === styleId)
  if (index !== -1) {
    availableStyles.value.splice(index, 1)
    if (selectedStyle.value?.id === styleId) {
      selectedStyle.value = null
      showConfigForm.value = false
    }
  }
}

// 处理配置更新
const handleConfigUpdate = (config: any) => {
  Object.assign(configForm.value, config)
}

// 生成内容
const generateContent = async () => {
  if (!configForm.value.topic.trim()) return
  
  // 先切换到第二步
  currentStep.value = 2
  
  // 显示生成中状态
  isGenerating.value = true
  
  try {
    // 模拟生成过程
    const wordCount = configForm.value.wordCount === 'custom' ? configForm.value.customWordCount : configForm.value.wordCount
    const mockContent = generateMockArticle(configForm.value.topic, wordCount, selectedStyle.value?.name)
    
    // 模拟生成延迟（3-5秒）
    await new Promise(resolve => setTimeout(resolve, 3500))
    
    generatedContent.value = mockContent
    editedContent.value = mockContent
    
    // 添加生成完成的消息
    chatStore.addAiMessage('内容生成完成！您可以在右侧查看和编辑生成的文章。', 'content-generated')
    
    scrollToBottom()
  } finally {
    isGenerating.value = false
  }
}

// 生成模拟文章
const generateMockArticle = (topic: string, _wordCount: string, _style: string) => {
  const baseContent = `
    <h2>${topic}</h2>
    <p>在当今快速发展的商业环境中，${topic}已经成为企业成功的关键因素之一。本文将从多个角度深入分析这一重要话题，为读者提供全面的见解和实践指导。</p>
    
    <h3>背景与现状</h3>
    <p>随着科技的不断进步和市场环境的日益复杂，${topic}的重要性日益凸显。许多企业已经开始意识到，只有深入理解和有效应用相关策略，才能在激烈的市场竞争中立于不败之地。</p>
    
    <p>根据最新的市场调研数据显示，在采用${topic}相关策略的企业中，有超过70%的企业在一年内实现了显著的业绩提升。这一数据充分说明了${topic}在现代商业中的核心价值。</p>
    
    <h3>核心要素分析</h3>
    <p>要成功实施${topic}，企业需要关注以下几个核心要素：</p>
    
    <p><strong>1. 战略规划</strong>：制定清晰、可执行的战略规划是成功的基础。企业需要根据自身实际情况，制定符合发展目标的长期和短期规划。</p>
    
    <p><strong>2. 资源配置</strong>：合理配置人力、物力和财力资源，确保各项措施能够有效实施。这需要企业具备良好的资源整合能力。</p>
    
    <p><strong>3. 团队建设</strong>：建立一支专业、高效的团队是成功的关键。团队成员需要具备相关的专业知识和实践经验。</p>
    
    <h3>实施策略</h3>
    <p>在具体实施过程中，企业可以采取以下策略：</p>
    
    <p>首先，建立完善的管理体系，确保各项措施能够有序推进。其次，加强与外部合作伙伴的沟通协作，形成良好的生态系统。最后，持续优化和改进，根据市场反馈及时调整策略。</p>
    
    <h3>未来展望</h3>
    <p>展望未来，${topic}将继续发挥重要作用。随着技术的不断发展和市场需求的不断变化，企业需要保持敏锐的洞察力，及时调整和完善相关策略。</p>
    
    <p>总的来说，${topic}不仅是当前的重要议题，更是未来发展的必然趋势。只有深入理解其本质，掌握实施方法，企业才能在激烈的市场竞争中脱颖而出，实现可持续发展。</p>
  `
  
  return baseContent
}

// 切换编辑模式
const toggleEdit = () => {
  isEditing.value = !isEditing.value
  if (isEditing.value && !editedContent.value) {
    // 将HTML转换为markdown格式
    editedContent.value = htmlToMarkdown(generatedContent.value)
  }
}

// HTML转Markdown的简单实现
const htmlToMarkdown = (html: string) => {
  return html
    .replace(/<h2>(.*?)<\/h2>/g, '## $1\n')
    .replace(/<h3>(.*?)<\/h3>/g, '### $1\n')
    .replace(/<p>(.*?)<\/p>/g, '$1\n\n')
    .replace(/<strong>(.*?)<\/strong>/g, '**$1**')
    .replace(/<[^>]*>/g, '')
    .replace(/\n\s*\n/g, '\n\n')
    .trim()
}

// Markdown转HTML
const markdownToHtml = (markdown: string) => {
  return marked(markdown)
}

// 保存编辑
const saveEdit = async () => {
  // 将markdown转换为HTML
  generatedContent.value = await markdownToHtml(editedContent.value)
  isEditing.value = false
  // 可以添加保存成功的提示
}

// 取消编辑
const cancelEdit = () => {
  editedContent.value = htmlToMarkdown(generatedContent.value)
  isEditing.value = false
}

// 滚动到音频博客区域
const scrollToAudioBlog = () => {
  // 先显示音频博客区域
  showAudioBlog.value = true
  
  // 使用 nextTick 确保DOM已更新后再滚动和展开配置
  nextTick(() => {
    // 自动展开配置项
    if (audioBlogRef.value) {
      audioBlogRef.value.showConfig = true
    }
    
    // 稍微延迟一下确保渲染完成
    setTimeout(() => {
      const audioBlogSection = document.querySelector('.audio-blog-section')
      if (audioBlogSection) {
        audioBlogSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 100)
  })
}

// 处理音频配置取消
const handleAudioConfigCancelled = () => {
  showAudioBlog.value = false
}

// 返回配置步骤
const backToConfig = () => {
  currentStep.value = 1
  isEditing.value = false
}

// 复制内容
const copyContent = () => {
  const content = editedContent.value || generatedContent.value
  navigator.clipboard.writeText(content.replace(/<[^>]*>/g, ''))
  // 可以添加复制成功的提示
}

// 下载内容
const downloadContent = () => {
  const content = editedContent.value || generatedContent.value
  const element = document.createElement('a')
  const file = new Blob([content.replace(/<[^>]*>/g, '')], { type: 'text/plain' })
  element.href = URL.createObjectURL(file)
  element.download = `${configForm.value.topic || '文章'}.txt`
  document.body.appendChild(element)
  element.click()
  document.body.removeChild(element)
}

// 同步到飞书
const syncToFeishu = async () => {
  try {
    const content = editedContent.value || generatedContent.value
    const title = configForm.value.topic || '未命名文档'
    
    // 这里应该调用飞书API进行同步
    // 目前先模拟
    console.log('同步到飞书:', { title, content })
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    alert('文档已成功同步到飞书！')
  } catch (error) {
    console.error('同步到飞书失败:', error)
    alert('同步失败，请重试')
  }
}

// 处理音频生成
const handleAudioGenerated = (audioUrl: string) => {
  console.log('音频生成完成:', audioUrl)
  // 可以添加音频生成成功的提示
  chatStore.addAiMessage('音频博客生成完成！您可以在下方预览和下载音频文件。', 'audio-generated')
}

// 组件挂载
onMounted(() => {
  autoResize()
})
</script>

<style scoped>
.scrollbar-thin {
  scrollbar-width: thin;
  scrollbar-color: #4a5568 #2d3748;
}

.scrollbar-thin::-webkit-scrollbar {
  width: 6px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background: #2d3748;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background: #4a5568;
  border-radius: 3px;
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: #718096;
}

.prose {
  color: #e2e8f0;
}

.prose h2 {
  color: #f7fafc;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.prose p {
  margin-bottom: 1rem;
  line-height: 1.6;
}

/* 加载动画 - 三个点跳动 */
.loading-dots::after {
  content: '';
  animation: dots 1.5s steps(4, end) infinite;
}

@keyframes dots {
  0%, 20% {
    content: '';
  }
  40% {
    content: '.';
  }
  60% {
    content: '..';
  }
  80%, 100% {
    content: '...';
  }
}
</style>
