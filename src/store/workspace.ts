import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

/**
 * 工作台核心状态管理
 * 控制布局模式、激活的智能体和模态框状态
 */
export const useWorkspaceStore = defineStore('workspace', () => {
  // ========== 状态 ==========
  
  /**
   * 布局模式
   * - 'chat': 纯对话模式，ChatCanvas占满全屏
   * - 'creation': 创作模式，ChatCanvas (w-1/3) + MainCanvas (w-2/3)
   */
  const layoutMode = ref<'chat' | 'creation'>('chat')
  
  /**
   * 当前激活的智能体
   * null表示纯对话模式，有值则表示进入某个智能体的创作模式
   */
  const activeAgent = ref<string | null>(null)
  
  /**
   * AI云盘模态框是否打开
   */
  const isAssetModalOpen = ref(false)
  
  /**
   * 当前对话会话ID
   */
  const currentSessionId = ref<string | null>(null)

  // ========== 计算属性 ==========
  
  /**
   * 是否处于创作模式
   */
  const isCreationMode = computed(() => layoutMode.value === 'creation')
  
  /**
   * 是否处于对话模式
   */
  const isChatMode = computed(() => layoutMode.value === 'chat')

  // ========== Actions ==========
  
  /**
   * 进入创作模式，激活指定智能体
   */
  const enterCreationMode = (agentId: string) => {
    activeAgent.value = agentId
    layoutMode.value = 'creation'
  }
  
  /**
   * 退出创作模式，返回纯对话模式
   */
  const exitCreationMode = () => {
    activeAgent.value = null
    layoutMode.value = 'chat'
  }
  
  /**
   * 切换布局模式
   */
  const toggleLayoutMode = () => {
    if (layoutMode.value === 'chat') {
      layoutMode.value = 'creation'
    } else {
      layoutMode.value = 'chat'
    }
  }
  
  /**
   * 打开AI云盘模态框
   */
  const openAssetModal = () => {
    isAssetModalOpen.value = true
  }
  
  /**
   * 关闭AI云盘模态框
   */
  const closeAssetModal = () => {
    isAssetModalOpen.value = false
  }
  
  /**
   * 切换AI云盘模态框
   */
  const toggleAssetModal = () => {
    isAssetModalOpen.value = !isAssetModalOpen.value
  }
  
  /**
   * 开始新的对话会话
   */
  const startNewSession = () => {
    currentSessionId.value = `session-${Date.now()}`
    exitCreationMode() // 返回对话模式
  }

  return {
    // 状态
    layoutMode,
    activeAgent,
    isAssetModalOpen,
    currentSessionId,
    
    // 计算属性
    isCreationMode,
    isChatMode,
    
    // Actions
    enterCreationMode,
    exitCreationMode,
    toggleLayoutMode,
    openAssetModal,
    closeAssetModal,
    toggleAssetModal,
    startNewSession
  }
})

