import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface Message {
  id: string
  text: string
  sender: 'user' | 'ai'
  timestamp: number
  ugiComponent?: string
  ugiProps?: Record<string, any>
  isLoading?: boolean
}

export const useChatStore = defineStore('chat', () => {
  const messages = ref<Message[]>([])
  const isAiTyping = ref(false)

  // 添加用户消息
  const sendMessage = (text: string) => {
    const message: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: Date.now()
    }
    messages.value.push(message)
    
    // 模拟AI回复
    simulateAiResponse()
  }

  // 添加AI消息
  const addAiMessage = (text: string, ugiComponent?: string, ugiProps?: Record<string, any>) => {
    const message: Message = {
      id: Date.now().toString(),
      text,
      sender: 'ai',
      timestamp: Date.now(),
      ugiComponent,
      ugiProps
    }
    messages.value.push(message)
    isAiTyping.value = false
  }

  // 更新消息
  const updateMessage = (id: string, updates: Partial<Message>) => {
    const index = messages.value.findIndex(m => m.id === id)
    if (index !== -1) {
      const currentMessage = messages.value[index]
      if (currentMessage) {
        messages.value[index] = { ...currentMessage, ...updates }
      }
    }
  }

  // 删除消息
  const deleteMessage = (id: string) => {
    const index = messages.value.findIndex(m => m.id === id)
    if (index !== -1) {
      messages.value.splice(index, 1)
    }
  }

  // 清空消息
  const clearMessages = () => {
    messages.value = []
  }

  // 意图识别函数
  const detectIntentFromText = (text: string): string => {
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

  // 获取智能体回复内容
  const getAgentResponse = (agentId: string, _userText: string): { title: string; description: string; component: string } => {
    const responses: Record<string, { title: string; description: string; component: string }> = {
      'video-mixer': {
        title: '视频混剪智能体',
        description: '我已经为您准备了视频混剪方案，让我为您配置创作流程。',
        component: 'BatchVideoGenerator'
      },
      'content-rewrite': {
        title: '风格模仿写作大师',
        description: '我将为您提供专业的文案改写服务，保持品牌调性统一。',
        component: 'ContentRewriter'
      },
      'social-media': {
        title: '社媒运营智能体',
        description: '我来帮您制定社交媒体营销策略，提升传播效果。',
        component: 'SocialMediaPlanner'
      },
      'brand-design': {
        title: '品牌设计智能体',
        description: '我将为您创建专业的品牌视觉素材，提升品牌形象。',
        component: 'BrandDesigner'
      },
      'data-analysis': {
        title: '数据分析智能体',
        description: '让我为您分析营销数据，提供深度洞察和优化建议。',
        component: 'DataAnalyzer'
      },
      'campaign-manager': {
        title: '营销策划智能体',
        description: '我将为您制定全链路营销策划方案，从策略到执行。',
        component: 'CampaignManager'
      }
    }
    
    return responses[agentId] ?? responses['video-mixer']!
  }

  // 模拟AI回复
  const simulateAiResponse = () => {
    isAiTyping.value = true
    
    // 获取最后一条用户消息
    const lastUserMessage = messages.value[messages.value.length - 1]
    const userText = lastUserMessage?.text || ''
    
    // 识别意图
    const detectedAgent = detectIntentFromText(userText)
    const agentInfo = getAgentResponse(detectedAgent, userText)
    
    setTimeout(() => {
      // 第一轮回复：确认理解并介绍智能体
      addAiMessage(
        `我理解了您的需求！${agentInfo.description}`,
      )
      
      // 第二轮回复：显示对应的UGI组件
      setTimeout(() => {
        addAiMessage(
          `已为您激活${agentInfo.title}，点击下方按钮开始创作：`,
          agentInfo.component,
          {
            agentId: detectedAgent,
            userText: userText
          }
        )
      }, 1500)
    }, 1000)
  }

  return {
    messages,
    isAiTyping,
    sendMessage,
    addAiMessage,
    updateMessage,
    deleteMessage,
    clearMessages
  }
})

