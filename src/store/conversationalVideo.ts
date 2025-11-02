import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { VideoIntentParser } from '@/utils/nlp/videoIntentParser'
import { configGenerator } from '@/utils/config/configGenerator'
import type { GenerationOptions } from '@/utils/config/configGenerator'

// 类型定义
export interface Message {
  id: string
  type: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  attachments?: File[]
  suggestions?: ConfigSuggestion[]
}

export interface Conversation {
  id: string
  userId: string
  title: string
  status: 'active' | 'completed' | 'archived'
  createdAt: Date
  updatedAt: Date
}

export interface ConfigSuggestion {
  id: string
  title: string
  description: string
  videoTemplate: VideoTemplate
  parameters: VideoParameters
  subtitleConfig: SubtitleConfig
  voiceConfig: VoiceConfig
  relevanceScore: number
  reasoning: string
}

export interface VideoTemplate {
  id: string
  name: string
  aspectRatio: string
  style: string
  transition: string
}

export interface VideoParameters {
  duration: number
  aspectRatio: string
  resolution: string
  fps: number
  style: string
  transition: string
  topic: string
  title: string
}

export interface SubtitleConfig {
  enabled: boolean
  style: string
  position: string
  fontSize: number
  color: string
}

export interface VoiceConfig {
  type: string
  speed: number
  pitch: number
  volume: number
}



export const useConversationalVideoStore = defineStore('conversationalVideo', () => {
  // ========== 状态 ==========
  const currentConversation = ref<Conversation | null>(null)
  const messages = ref<Message[]>([])
  const isProcessing = ref(false)
  const suggestions = ref<ConfigSuggestion[]>([])
  const selectedSuggestion = ref<ConfigSuggestion | null>(null)
  const conversationHistory = ref<Conversation[]>([])

  // ========== 计算属性 ==========
  const hasActiveConversation = computed(() => currentConversation.value !== null)
  const lastMessage = computed(() => messages.value[messages.value.length - 1])
  const userMessages = computed(() => messages.value.filter(m => m.type === 'user'))
  const assistantMessages = computed(() => messages.value.filter(m => m.type === 'assistant'))

  // ========== Actions ==========
  
  /**
   * 创建新对话
   */
  const createNewConversation = (title?: string): Conversation => {
    const conversation: Conversation = {
      id: `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: 'current-user', // TODO: 从认证状态获取
      title: title || '新的视频项目',
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    currentConversation.value = conversation
    conversationHistory.value.unshift(conversation)
    messages.value = []
    suggestions.value = []
    selectedSuggestion.value = null
    
    // 添加欢迎消息
    addSystemMessage('您好！我是您的视频混剪助手。请描述您想要制作的视频，我会为您智能配置参数。')
    
    return conversation
  }

  /**
   * 加载现有对话
   */
  const loadConversation = (conversationId: string) => {
    const conversation = conversationHistory.value.find(c => c.id === conversationId)
    if (conversation) {
      currentConversation.value = conversation
      // TODO: 从存储加载消息历史
      messages.value = []
      suggestions.value = []
      selectedSuggestion.value = null
    }
  }

  /**
   * 发送用户消息
   */
  const sendMessage = async (content: string, attachments?: File[], options?: GenerationOptions) => {
    if (!hasActiveConversation.value) {
      createNewConversation()
    }

    // 添加用户消息
    const userMessage: Message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'user',
      content,
      timestamp: new Date(),
      attachments
    }
    
    messages.value.push(userMessage)
    isProcessing.value = true

    try {
      // 使用新的NLP解析器分析用户意图
      const parser = new VideoIntentParser()
      const intent = await parser.parseIntent(content)
      
      // 使用配置生成引擎生成建议
      const newSuggestions = await configGenerator.generateSuggestions(intent, options)
      suggestions.value = newSuggestions

      // 添加助手回复
      const assistantMessage: Message = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: 'assistant',
        content: generateResponseMessage(intent, newSuggestions),
        timestamp: new Date(),
        suggestions: newSuggestions
      }
      
      messages.value.push(assistantMessage)
      
      // 更新对话标题（如果是第一条消息）
      if (userMessages.value.length === 1 && currentConversation.value) {
        currentConversation.value.title = extractTitleFromMessage(content)
        currentConversation.value.updatedAt = new Date()
      }
      
    } catch (error) {
      console.error('处理消息时出错:', error)
      addSystemMessage('抱歉，处理您的请求时出现了错误，请重试。')
    } finally {
      isProcessing.value = false
    }
  }

  /**
   * 添加系统消息
   */
  const addSystemMessage = (content: string) => {
    const systemMessage: Message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'system',
      content,
      timestamp: new Date()
    }
    messages.value.push(systemMessage)
  }

  /**
   * 选择配置建议
   */
  const selectSuggestion = (suggestion: ConfigSuggestion) => {
    selectedSuggestion.value = suggestion
    addSystemMessage(`已选择配置方案："${suggestion.title}"。您可以进行微调或直接应用此配置。`)
  }

  /**
   * 应用选中的配置
   */
  const applySelectedConfig = async () => {
    if (!selectedSuggestion.value) {
      throw new Error('没有选中的配置方案')
    }

    try {
      // TODO: 集成现有的VideoConfig Store
      // const videoStore = useVideoStore()
      // await videoStore.applyAutoConfig(selectedSuggestion.value)
      
      addSystemMessage('配置已成功应用！您现在可以继续下一步操作。')
      
      if (currentConversation.value) {
        currentConversation.value.status = 'completed'
        currentConversation.value.updatedAt = new Date()
      }
      
      return true
    } catch (error) {
      console.error('应用配置时出错:', error)
      addSystemMessage('应用配置时出现错误，请重试。')
      return false
    }
  }

  /**
   * 清除当前对话
   */
  const clearCurrentConversation = () => {
    currentConversation.value = null
    messages.value = []
    suggestions.value = []
    selectedSuggestion.value = null
    isProcessing.value = false
  }

  /**
   * 清除选中的建议
   */
  const clearSelectedSuggestion = () => {
    selectedSuggestion.value = null
  }



  /**
   * 生成回复消息
   */
  const generateResponseMessage = (intent: any, suggestions: ConfigSuggestion[]): string => {
    const { mainIntent, entities, confidence } = intent
    
    let message = ''
    
    if (mainIntent === 'create_video') {
      message = `我理解您想要制作一个`
      
      if (entities.duration) {
        message += `${entities.duration}秒的`
      }
      
      if (entities.aspectRatio === '9:16') {
        message += `竖版`
      } else if (entities.aspectRatio === '16:9') {
        message += `横版`
      } else if (entities.aspectRatio === '1:1') {
        message += `方形`
      }
      
      if (entities.topic) {
        const topicMap: Record<string, string> = {
          food: '美食',
          product: '产品宣传',
          tutorial: '教程',
          travel: '旅游',
          fitness: '健身'
        }
        message += `${topicMap[entities.topic] || entities.topic}`
      }
      
      message += `视频。`
      
      if (entities.subtitles) {
        message += `包含字幕功能。`
      }
      
      if (entities.platform) {
        const platformMap: Record<string, string> = {
          tiktok: '抖音',
          kuaishou: '快手',
          bilibili: 'B站',
          youtube: 'YouTube'
        }
        message += `适配${platformMap[entities.platform] || entities.platform}平台。`
      }
      
      message += `\n\n我为您准备了${suggestions.length}个配置方案，请选择最适合的一个：`
    } else if (mainIntent === 'modify_config') {
      message = '我理解您想要修改配置。请告诉我具体需要调整哪些参数。'
    } else if (mainIntent === 'ask_question') {
      message = '我会尽力回答您的问题。请提供更多详细信息。'
    } else {
      message = '我理解了您的需求，让我为您分析并生成合适的配置方案。'
    }
    
    return message
  }

  /**
   * 从消息中提取标题
   */
  const extractTitleFromMessage = (message: string): string => {
    const content = message.toLowerCase()
    
    if (content.includes('美食')) {
      return '美食视频制作'
    } else if (content.includes('产品')) {
      return '产品宣传视频'
    } else if (content.includes('教程')) {
      return '教程视频制作'
    } else if (content.includes('营销')) {
      return '营销推广视频'
    } else {
      return '视频制作项目'
    }
  }

  return {
    // 状态
    currentConversation,
    messages,
    isProcessing,
    suggestions,
    selectedSuggestion,
    conversationHistory,
    
    // 计算属性
    hasActiveConversation,
    lastMessage,
    userMessages,
    assistantMessages,
    
    // 方法
    createNewConversation,
    loadConversation,
    sendMessage,
    addSystemMessage,
    selectSuggestion,
    applySelectedConfig,
    clearCurrentConversation,
    clearSelectedSuggestion
  }
})