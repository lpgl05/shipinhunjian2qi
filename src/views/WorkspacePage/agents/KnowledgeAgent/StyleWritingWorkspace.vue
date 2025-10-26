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
          <div v-if="chatStore.messages.length === 0" class="text-center py-12">
            <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mb-4">
              <Type :size="32" class="text-white" />
            </div>
            <h2 class="text-2xl font-bold text-gray-50 mb-2">欢迎使用风格模仿写作大师</h2>
            <p class="text-gray-400 mb-6">告诉我您想要创作的内容，我将为您推荐最适合的写作风格</p>
            
            <!-- 快捷提示 -->
            <div class="flex flex-wrap gap-2 justify-center">
              <button
                v-for="prompt in quickPrompts"
                :key="prompt"
                class="px-4 py-2 bg-gray-800 text-gray-300 text-sm rounded-lg border border-gray-700 hover:border-purple-500 hover:text-purple-400 transition-colors"
                @click="handleQuickPrompt(prompt)"
              >
                {{ prompt }}
              </button>
            </div>
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
      <div class="input-area p-6 border-t border-gray-800 bg-gray-900/50">
        <div class="max-w-2xl mx-auto">
          <div class="relative">
            <textarea
              ref="textareaRef"
              v-model="inputText"
              rows="3"
              placeholder="描述您想要创作的内容..."
              class="w-full px-4 py-3 pr-12 bg-gray-800 border border-gray-700 rounded-xl text-gray-300 placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 outline-none transition-all resize-none"
              @keydown="handleKeydown"
              @input="autoResize"
            ></textarea>
            <button
              class="absolute right-3 top-3 p-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:brightness-110 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="!inputText.trim() || chatStore.isAiTyping"
              @click="sendMessage"
            >
              <Send :size="16" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 右侧配置和输出区域 -->
    <div class="config-panel w-1/2 flex flex-col">
      <!-- 配置头部 -->
      <div class="config-header px-6 py-4 border-b border-gray-800 bg-gray-900/50">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-lg font-semibold text-gray-50">
              {{ currentStep === 1 ? '配置参数' : '生成结果' }}
            </h2>
            <p class="text-sm text-gray-400">
              {{ currentStep === 1 ? '设置创作参数' : '查看和编辑生成内容' }}
            </p>
          </div>
          
          <!-- 步骤指示器 - 居中显示 -->
          <div class="flex items-center justify-center">
            <div class="flex items-center gap-6">
              <button 
                @click="currentStep = 1"
                :class="[
                  'flex items-center gap-2 px-4 py-2 rounded-lg transition-all',
                  currentStep === 1 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                ]"
              >
                <div class="w-6 h-6 rounded-full bg-white bg-opacity-20 flex items-center justify-center text-sm font-medium">1</div>
                <span class="text-sm font-medium">配置参数</span>
              </button>
              
              <div class="w-12 h-px bg-gray-700"></div>
              
              <button 
                @click="currentStep = 2"
                :class="[
                  'flex items-center gap-2 px-4 py-2 rounded-lg transition-all',
                  currentStep === 2 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                ]"
              >
                <div class="w-6 h-6 rounded-full bg-white bg-opacity-20 flex items-center justify-center text-sm font-medium">2</div>
                <span class="text-sm font-medium">生成结果</span>
              </button>
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
            :available-styles="availableStyles"
            @style-select="handleStyleSelect"
            @style-create="handleStyleCreate"
            @style-update="handleStyleUpdate"
            @style-delete="handleStyleDelete"
          />

          <!-- 配置表单 -->
          <div v-if="showConfigForm" class="space-y-4">
            <h3 class="text-md font-medium text-gray-300">创作配置</h3>
            <div class="space-y-4">
              <!-- 主题 -->
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">主题</label>
                <input
                  v-model="configForm.topic"
                  type="text"
                  placeholder="输入文章主题"
                  class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 outline-none"
                />
              </div>

              <!-- 字数要求 -->
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">字数要求</label>
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

              <!-- 自定义字数 -->
              <div v-if="configForm.wordCount === 'custom'">
                <input
                  v-model="configForm.customWordCount"
                  type="number"
                  placeholder="输入具体字数"
                  class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 outline-none"
                />
              </div>

              <!-- 备注 -->
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">备注</label>
                <textarea
                  v-model="configForm.notes"
                  rows="3"
                  placeholder="其他要求或备注..."
                  class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 outline-none resize-none"
                ></textarea>
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
        </div>

        <!-- 第二步：生成结果 -->
        <div v-if="currentStep === 2" class="h-full flex flex-col">
          <!-- 内容展示区域 -->
          <div class="flex-1 p-6">
            <div class="h-full flex flex-col">
              <!-- 内容标题 -->
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-medium text-gray-300">生成的文章</h3>
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
            </div>
          </div>

          <!-- 音频博客生成器 -->
          <div class="border-t border-gray-800 p-6 bg-gray-900/50">
            <AudioBlogGenerator
              :content="editedContent || generatedContent"
              @audio-generated="handleAudioGenerated"
            />
          </div>

          <!-- 底部操作栏 -->
          <div class="border-t border-gray-800 p-6 bg-gray-900/50">
            <div class="flex items-center justify-between">
              <!-- 左侧操作 -->
              <div class="flex gap-3">
                <button
                  class="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors flex items-center gap-2"
                  @click="copyContent"
                >
                  <Copy :size="16" />
                  复制内容
                </button>
                <button
                  class="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors flex items-center gap-2"
                  @click="toggleEdit"
                >
                  <Edit3 :size="16" />
                  {{ isEditing ? '预览' : '编辑' }}
                </button>
                <button
                  class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center gap-2"
                  @click="downloadContent"
                >
                  <Download :size="16" />
                  下载文档
                </button>
              </div>

              <!-- 右侧操作 -->
              <div class="flex gap-3">
                <button
                  class="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors"
                  @click="backToConfig"
                >
                  重新配置
                </button>
                <button
                  v-if="isEditing"
                  class="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                  @click="saveEdit"
                >
                  保存修改
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted } from 'vue'
import { 
  Type, 
  Send, 
  Bot, 
  FileText, 
  Copy, 
  Download,
  Edit3
} from 'lucide-vue-next'
import { marked } from 'marked'
import ChatMessage from './ChatMessage.vue'
import StyleManager from './StyleManager.vue'
import AudioBlogGenerator from './AudioBlogGenerator.vue'
import AppSidebar from '../../AppSidebar.vue'
import { useChatStore } from '../../../../store/chat'

const chatStore = useChatStore()

// 响应式数据
const inputText = ref('')
const textareaRef = ref<HTMLTextAreaElement>()
const messagesContainer = ref<HTMLElement>()
const selectedStyle = ref<any>(null)
const showConfigForm = ref(false)
const generatedContent = ref('')
const currentStep = ref(1) // 1: 配置步骤, 2: 生成步骤
const isEditing = ref(false)
const editedContent = ref('')

// 配置表单
const configForm = ref({
  topic: '',
  wordCount: '1000',
  customWordCount: '',
  notes: ''
})

// 快捷提示
const quickPrompts = [
  '写一篇产品介绍文章',
  '创建营销推广文案',
  '撰写技术博客文章',
  '制作社交媒体内容'
]

// 预设风格
const availableStyles = [
  {
    id: 'boss-formal',
    name: '老板-正式风格',
    description: '适用于正式商务场合的写作风格，专业、严谨、权威',
    color: 'bg-purple-500'
  },
  {
    id: 'ceo-innovative',
    name: 'CEO-创新风格',
    description: '富有远见和创新精神的领导者风格，适合战略规划',
    color: 'bg-green-500'
  },
  {
    id: 'marketing-director',
    name: '营销总监',
    description: '营销导向的写作风格，注重用户体验和转化',
    color: 'bg-orange-500'
  }
]

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

// 处理AI回复
const handleAiResponse = (userMessage: string) => {
  // 根据用户输入推荐风格
  const recommendedStyle = availableStyles[0] // 默认推荐第一个
  selectedStyle.value = recommendedStyle
  showConfigForm.value = true
  
  const aiResponse = `根据您的需求"${userMessage}"，我为您推荐使用"${recommendedStyle.name}"风格。这种风格${recommendedStyle.description}。

请填写以下配置信息，我将为您生成高质量的内容：`
  
  chatStore.addAiMessage(aiResponse, 'style-recommendation', {
    recommendedStyle,
    availableStyles
  })
  
  scrollToBottom()
}

// 处理快捷提示
const handleQuickPrompt = (prompt: string) => {
  inputText.value = prompt
  nextTick(() => {
    textareaRef.value?.focus()
  })
}

// 处理风格选择
const handleStyleSelect = (style: any) => {
  selectedStyle.value = style
  showConfigForm.value = true
}

// 处理风格创建
const handleStyleCreate = (style: any) => {
  availableStyles.push(style)
  selectedStyle.value = style
  showConfigForm.value = true
}

// 处理风格更新
const handleStyleUpdate = (updatedStyle: any) => {
  const index = availableStyles.findIndex(s => s.id === updatedStyle.id)
  if (index !== -1) {
    availableStyles[index] = updatedStyle
    if (selectedStyle.value?.id === updatedStyle.id) {
      selectedStyle.value = updatedStyle
    }
  }
}

// 处理风格删除
const handleStyleDelete = (styleId: string) => {
  const index = availableStyles.findIndex(s => s.id === styleId)
  if (index !== -1) {
    availableStyles.splice(index, 1)
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
  
  // 模拟生成过程
  const wordCount = configForm.value.wordCount === 'custom' ? configForm.value.customWordCount : configForm.value.wordCount
  const mockContent = generateMockArticle(configForm.value.topic, wordCount, selectedStyle.value?.name)
  
  // 模拟生成延迟
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  generatedContent.value = mockContent
  editedContent.value = mockContent
  
  // 切换到第二步
  currentStep.value = 2
  
  // 添加生成完成的消息
  chatStore.addAiMessage('内容生成完成！您可以在右侧查看和编辑生成的文章。', 'content-generated')
  
  scrollToBottom()
}

// 生成模拟文章
const generateMockArticle = (topic: string, wordCount: string, _style: string) => {
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
</style>
