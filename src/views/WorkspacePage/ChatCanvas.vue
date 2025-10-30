<template>
  <div class="chat-canvas h-full flex flex-col bg-gray-950">
    <!-- 消息列表区域 -->
    <div ref="messagesContainer" class="flex-1 overflow-y-auto scrollbar-thin p-6">
      <div class="max-w-4xl mx-auto">
        <!-- 欢迎消息 (仅在无消息时显示) -->
        <div v-if="chatStore.messages.length === 0" class="text-center py-20">
          <div class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-violet-500 rounded-3xl mb-6 animate-pulse-slow">
            <Sparkles :size="40" class="text-white" />
          </div>
          <h2 class="text-3xl font-bold text-gray-50 mb-3">
            {{ getWelcomeTitle() }}
          </h2>
          <p class="text-lg text-gray-400 mb-8">
            {{ getWelcomeSubtitle() }}
          </p>

          <!-- 快捷提示词 -->
          <div class="flex flex-wrap items-center justify-center gap-3 max-w-2xl mx-auto">
            <button
              v-for="prompt in quickPrompts"
              :key="prompt"
              class="px-5 py-2.5 bg-gray-800 text-gray-300 text-sm rounded-xl border border-gray-700 hover:border-blue-500 hover:text-blue-400 hover:bg-gray-700 transition-all duration-200"
              @click="handleQuickPrompt(prompt)"
            >
              {{ prompt }}
            </button>
          </div>
        </div>

            <!-- 消息列表 -->
            <div v-else class="space-y-6">
              <ChatMessage
                v-for="message in chatStore.messages"
                :key="message.id"
                :message="message"
                @ugi-event="handleUgiEvent"
              />

          <!-- AI思考中 -->
          <div v-if="chatStore.isAiTyping" class="flex gap-3 justify-start animate-fade-in">
            <div class="flex-shrink-0">
              <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-violet-500 rounded-full flex items-center justify-center">
                <Bot :size="20" class="text-white" />
              </div>
            </div>
            <div class="bg-gray-800 rounded-2xl rounded-tl-sm px-5 py-3">
              <div class="flex gap-1">
                <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0ms"></div>
                <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 150ms"></div>
                <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 300ms"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部输入区 -->
    <div class="border-t border-gray-800 bg-gray-900/80 backdrop-blur-xl">
      <div class="max-w-4xl mx-auto p-4">
        <div class="relative">
          <!-- 输入框容器 -->
          <div
            class="flex items-end gap-3 bg-gray-800/60 backdrop-blur-sm rounded-2xl border transition-all duration-200"
            :class="[
              isInputFocused
                ? 'border-blue-500 ring-2 ring-blue-500/50 shadow-lg shadow-blue-500/20'
                : 'border-gray-700'
            ]"
          >
            <!-- 左侧工具按钮 -->
            <div class="flex items-center gap-1 pl-3">
              <button class="icon-btn" title="上传文件" @click="handleUpload">
                <Paperclip :size="16" />
              </button>
              <button class="icon-btn" title="插入图片" @click="handleInsertImage">
                <ImageIcon :size="16" />
              </button>
            </div>

            <!-- 文本输入区 -->
            <textarea
              ref="textareaRef"
              v-model="inputText"
              placeholder="描述你的需求... (Enter发送，Shift+Enter换行)"
              rows="1"
              class="flex-1 bg-transparent border-none outline-none resize-none text-gray-50 placeholder-gray-500 py-3 max-h-40 scrollbar-thin text-sm"
              @input="autoResize"
              @focus="isInputFocused = true"
              @blur="isInputFocused = false"
              @keydown.enter.exact.prevent="handleSend"
              @keydown.enter.shift.exact="handleNewLine"
            ></textarea>

            <!-- 发送按钮 -->
            <div class="pr-3 flex items-center">
              <button
                class="flex-shrink-0 bg-gradient-to-r from-blue-500 to-violet-500 p-2 rounded-lg hover:brightness-110 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                :disabled="!inputText.trim() || chatStore.isAiTyping"
                @click="handleSend"
              >
                <Send :size="16" class="text-white" />
              </button>
            </div>
          </div>

          <!-- 提示文本 -->
          <div class="mt-2 flex items-center justify-between text-xs text-gray-500">
            <div class="flex items-center gap-4">
              <span>Enter 发送</span>
              <span class="text-gray-600">•</span>
              <span>Shift + Enter 换行</span>
            </div>
            <div v-if="inputText.length > 0">
              {{ inputText.length }} / 2000
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { 
  Sparkles, 
  Paperclip, 
  Send, 
  Bot, 
  Image as ImageIcon 
} from 'lucide-vue-next'
import ChatMessage from './components/ChatMessage.vue'
import { useChatStore } from '../../store/chat'
import { useWorkspaceStore } from '../../store/workspace'

const route = useRoute()
const chatStore = useChatStore()
const workspaceStore = useWorkspaceStore()

const inputText = ref('')
const isInputFocused = ref(false)
const textareaRef = ref<HTMLTextAreaElement>()
const messagesContainer = ref<HTMLElement>()

// 快捷提示词
const quickPrompts = [
  '批量生成产品展示视频',
  '创建社媒营销内容',
  '设计品牌视觉素材',
  '分析营销数据报告'
]

// 智能体信息映射
const agentInfo: Record<string, { title: string; subtitle: string }> = {
  'video-mixer': {
    title: '视频混剪智能体',
    subtitle: '描述您的视频创作需求，我将为您智能生成视频方案'
  },
  'content-rewrite': {
    title: '知识库仿写智能体',
    subtitle: '告诉我您的文案需求，我将为您提供专业的改写服务'
  },
  'social-media': {
    title: '社媒运营智能体',
    subtitle: '分享您的营销目标，我将为您制定社交媒体策略'
  },
  'brand-design': {
    title: '品牌设计智能体',
    subtitle: '描述您的品牌需求，我将为您创建视觉素材'
  },
  'data-analysis': {
    title: '数据分析智能体',
    subtitle: '提供您的数据需求，我将为您分析营销数据'
  },
  'campaign-manager': {
    title: '营销策划智能体',
    subtitle: '告诉我您的营销目标，我将为您制定全链路方案'
  }
}

// 获取欢迎标题
const getWelcomeTitle = () => {
  if (workspaceStore.isCreationMode) {
    return '开始创作'
  }
  if (workspaceStore.activeAgent && agentInfo[workspaceStore.activeAgent]) {
    return agentInfo[workspaceStore.activeAgent].title
  }
  return '开始对话'
}

// 获取欢迎副标题
const getWelcomeSubtitle = () => {
  if (workspaceStore.isCreationMode) {
    return '在右侧画布中配置你的创作参数'
  }
  if (workspaceStore.activeAgent && agentInfo[workspaceStore.activeAgent]) {
    return agentInfo[workspaceStore.activeAgent].subtitle
  }
  return '描述你的需求，AI将为你智能生成'
}

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

// 处理发送
const handleSend = () => {
  if (!inputText.value.trim() || chatStore.isAiTyping) return

  const messageText = inputText.value.trim()
  chatStore.sendMessage(messageText)
  
  // 检查是否是自动配置流程
  if (isWaitingForAutoConfigInput.value) {
    // 等待AI回复后再触发自动配置处理
    setTimeout(() => {
      handleAutoConfigUserInput({ text: messageText })
    }, 1500)
  }
  
  inputText.value = ''

  // 重置textarea高度
  if (textareaRef.value) {
    textareaRef.value.style.height = 'auto'
  }

  scrollToBottom()
}

// 处理换行
const handleNewLine = (event: KeyboardEvent) => {
  const textarea = event.target as HTMLTextAreaElement
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  inputText.value = inputText.value.substring(0, start) + '\n' + inputText.value.substring(end)

  nextTick(() => {
    if (textarea) {
      textarea.selectionStart = textarea.selectionEnd = start + 1
      autoResize()
    }
  })
}

// 处理快捷提示词
const handleQuickPrompt = (prompt: string) => {
  // 根据提示词类型自动激活对应的智能体
  if (prompt.includes('视频') || prompt.includes('混剪')) {
    // 发送消息并激活视频混剪智能体
    chatStore.sendMessage(prompt)
    setTimeout(() => {
      workspaceStore.enterCreationMode('video-mixer')
    }, 500) // 延迟500ms让消息先发送
  } else {
    // 普通提示词，只填入输入框
    inputText.value = prompt
    nextTick(() => {
      textareaRef.value?.focus()
    })
  }
}

// 处理上传
const handleUpload = () => {
  workspaceStore.openAssetModal()
}

// 处理插入图片
const handleInsertImage = () => {
  console.log('插入图片')
}

// 开始自动配置流程（在对话框中）
const startAutoConfigFlow = async () => {
  // 1. 先询问用户需求
  chatStore.addAiMessage('好的，我来帮您自动配置视频参数。\n\n请描述您想要制作的视频内容，包括：\n\n1. 视频类型（产品宣传/社媒营销/活动推广等）\n2. 视频时长（15秒/30秒/60秒等）\n3. 视频风格（现代/电影感/活力/简约等）\n4. 是否需要字幕\n5. 其他特殊要求\n\n请详细描述，我将为您智能生成配置方案。')
  
  // 设置自动配置状态，等待用户回复
  isWaitingForAutoConfigInput.value = true
}

// 自动配置状态
const isWaitingForAutoConfigInput = ref(false)

// 处理用户消息，如果是自动配置流程
const handleAutoConfigUserInput = (message: any) => {
  if (isWaitingForAutoConfigInput.value) {
    // 用户已回复，开始配置流程
    isWaitingForAutoConfigInput.value = false
    
    // 添加第一个消息：确认理解
    const userText = typeof message === 'string' ? message : message.text
    chatStore.addAiMessage(`好的，我已经理解了您的需求：${userText}`)
    
    // 添加等待动画消息（只出现一次）
    setTimeout(() => {
      chatStore.addAiMessage(
        '',
        'WaitingTransition',
        {
          message: '正在为您智能配置视频参数，请稍候...'
        }
      )
    }, 500)
    
    // 模拟AI分析过程（等待5秒）
    setTimeout(() => {
      // 生成自动配置结果
      const config = generateAutoConfig()
      
      // 发送配置完成消息（显示结果页）
      chatStore.addAiMessage(
        `✅ 配置完成！我已根据您的需求完成了以下配置：\n\n` +
        `📹 **视频格式**: ${config.aspectRatio === '9:16' ? '竖版 (9:16)' : '横版 (16:9)'}\n` +
        `⏱️ **视频时长**: ${config.duration}秒\n` +
        `🎨 **视频风格**: ${getStyleLabel(config.style)}\n` +
        `📝 **字幕配置**: ${config.enableSubtitles ? '已启用' : '未启用'}\n` +
        `🎤 **音色类型**: ${getVoiceLabel(config.voiceType)}\n` +
        `📊 **分辨率**: ${config.resolution}\n\n` +
        `所有配置已应用到右侧画布，您可以继续调整参数。`
      )
    }, 5500) // 5秒 + 500ms延迟
  }
}

// 生成自动配置参数（模拟AI智能配置）
const generateAutoConfig = () => {
  return {
    aspectRatio: '9:16',
    title: '智能生成视频',
    duration: 60,
    resolution: '1080p',
    fps: 30,
    style: 'modern',
    transition: 'fade',
    enableSubtitles: true,
    subtitleStyle: 'modern',
    subtitlePosition: 'bottom',
    voiceType: 'authoritative',
    voiceSpeed: 1.0
  }
}

// 获取样式标签
const getStyleLabel = (style: string) => {
  const styles: Record<string, string> = {
    modern: '现代',
    cinematic: '电影感',
    vibrant: '活力',
    minimal: '简约'
  }
  return styles[style] || style
}

// 获取音色标签
const getVoiceLabel = (voice: string) => {
  const voices: Record<string, string> = {
    authoritative: '权威',
    calm: '平静',
    energetic: '活力',
    dramatic: '戏剧'
  }
  return voices[voice] || voice
}

// 处理UGI组件事件
const handleUgiEvent = (type: string, data: any) => {
  console.log('UGI事件:', type, data)
  
  // 根据事件类型处理不同的逻辑
  switch (type) {
    case 'select':
      // 处理不同的选择动作
      if (data.action === 'auto-config') {
        // 在对话框中开始自动配置流程
        startAutoConfigFlow()
      } else if (data.agentId) {
        // 选择智能体，进入创作模式
        workspaceStore.enterCreationMode(data.agentId)
      }
      break
    case 'reorder':
      // 重新排序
      console.log('重新排序:', data)
      break
    case 'replace':
      // 替换内容
      console.log('替换内容:', data)
      break
    case 'delete':
      // 删除内容
      console.log('删除内容:', data)
      break
    default:
      console.log('未知UGI事件:', type, data)
  }
}

// 监听消息变化
watch(() => chatStore.messages.length, () => {
  scrollToBottom()
})

// 意图识别函数
const detectIntent = (text: string): string => {
  const videoKeywords = ['视频', '混剪', '剪辑', '制作视频', '生成视频', '短视频', 'vlog', '宣传片']
  const contentKeywords = ['文案', '内容', '文章', '写作', '文案改写', '内容创作']
  const socialKeywords = ['社媒', '社交媒体', '微博', '抖音', '小红书', '营销']
  const designKeywords = ['设计', '海报', 'logo', '品牌', '视觉', '图片']
  const dataKeywords = ['数据', '分析', '报告', '统计', 'roi', '转化']
  const campaignKeywords = ['策划', '营销', '活动', '推广', 'campaign']
  
  const lowerText = text.toLowerCase()
  
  if (videoKeywords.some(keyword => lowerText.includes(keyword))) {
    return 'video-mixer'
  } else if (contentKeywords.some(keyword => lowerText.includes(keyword))) {
    return 'content-rewrite'
  } else if (socialKeywords.some(keyword => lowerText.includes(keyword))) {
    return 'social-media'
  } else if (designKeywords.some(keyword => lowerText.includes(keyword))) {
    return 'brand-design'
  } else if (dataKeywords.some(keyword => lowerText.includes(keyword))) {
    return 'data-analysis'
  } else if (campaignKeywords.some(keyword => lowerText.includes(keyword))) {
    return 'campaign-manager'
  }
  
  // 默认返回视频混剪智能体
  return 'video-mixer'
}

// 自动开始对话流程
const startAutoConversation = async (prompt: string) => {
  // 1. 自动发送用户消息
  chatStore.sendMessage(prompt)
  
  // 2. 识别意图并激活对应智能体
  const detectedAgent = detectIntent(prompt)
  
  // 3. 延迟激活智能体，让AI回复先完成
  setTimeout(() => {
    workspaceStore.enterCreationMode(detectedAgent)
  }, 3000) // 3秒后激活智能体
}

// 页面加载时处理URL参数
onMounted(() => {
  const prompt = route.query.prompt as string
  const agent = route.query.agent as string
  
  if (prompt) {
    inputText.value = prompt
    
    // 自动开始对话流程
    nextTick(() => {
      autoResize()
      // 延迟启动自动对话，确保页面完全加载
      setTimeout(() => {
        startAutoConversation(prompt)
      }, 500)
    })
  }
  
  if (agent) {
    // 直接进入创作模式，显示BatchVideoGenerator和右侧画布
    workspaceStore.enterCreationMode(agent)
    
    // 发送欢迎消息和BatchVideoGenerator组件
    setTimeout(() => {
      chatStore.addAiMessage(
        '已为您激活视频混剪智能体，点击下方按钮开始创作：',
        'BatchVideoGenerator',
        {
          agentId: agent,
          userText: ''
        }
      )
    }, 300)
  }
})
</script>

<style scoped>
@keyframes pulse-slow {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.05);
  }
}

.animate-pulse-slow {
  animation: pulse-slow 3s ease-in-out infinite;
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}

.animate-bounce {
  animation: bounce 0.6s ease-in-out infinite;
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

.icon-btn {
  @apply p-1.5 text-gray-400 hover:text-gray-50 hover:bg-gray-700 rounded-lg transition-all;
}
</style>

