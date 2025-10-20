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
    
    setTimeout(() => {
      addAiMessage(
        '我理解了您的需求！让我为您生成一个视频方案。',
      )
      
      // 延迟显示生成式UI组件
      setTimeout(() => {
        addAiMessage(
          '这是为您生成的视频时间线，您可以拖拽调整顺序：',
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

