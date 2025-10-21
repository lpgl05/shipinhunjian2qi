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

  // 模拟AI回复
  const simulateAiResponse = () => {
    isAiTyping.value = true
    
    // 获取最后一条用户消息
    const lastUserMessage = messages.value[messages.value.length - 1]
    const isVideoRelated = lastUserMessage?.text.includes('视频') || 
                          lastUserMessage?.text.includes('混剪') ||
                          lastUserMessage?.text.includes('批量')
    
    setTimeout(() => {
      if (isVideoRelated) {
        addAiMessage(
          '我理解了您的需求！让我为您设置批量视频生成方案。',
        )
        
        // 延迟显示批量视频生成器组件
        setTimeout(() => {
          addAiMessage(
            '已为您配置批量视频生成方案，点击"生成所有视频"开始创作：',
            'BatchVideoGenerator',
            {}
          )
        }, 1500)
      } else {
        addAiMessage(
          '我理解了您的需求！让我为您生成一个方案。',
        )
        
        // 延迟显示生成式UI组件
        setTimeout(() => {
          addAiMessage(
            '这是为您生成的内容方案：',
            'VideoTimeline',
            {
              clips: [
                { id: '1', thumbnail: '', title: '开场片段', duration: '5s' },
                { id: '2', thumbnail: '', title: '主要内容', duration: '15s' },
                { id: '3', thumbnail: '', title: '结尾片段', duration: '5s' }
              ]
            }
          )
        }, 1500)
      }
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

