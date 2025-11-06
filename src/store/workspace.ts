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
   * AI视频处理模态框是否打开
   */
  const isVideoProcessorOpen = ref(false)

  /**
   * 当前正在处理的云盘视频素材ID
   * 当从云盘选择素材并点击“AI视频处理”时，用于把该素材传递给处理弹窗
   */
  const videoProcessorAssetId = ref<string | null>(null)
  
  /**
   * 当前对话会话ID
   */
  const currentSessionId = ref<string | null>(null)
  
  /**
   * 创作模式下聊天面板是否收起
   * 当在创作模式下，可以通过此状态控制聊天面板的显示/隐藏
   */
  const chatPanelCollapsed = ref(false)

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
   * 打开AI视频处理模态框
   */
  const openVideoProcessor = () => {
    isVideoProcessorOpen.value = true
  }

  /**
   * 打开AI视频处理，并指定处理的素材ID
   */
  const openVideoProcessorWithAsset = (assetId: string) => {
    videoProcessorAssetId.value = assetId
    isVideoProcessorOpen.value = true
  }
  
  /**
   * 关闭AI视频处理模态框
   */
  const closeVideoProcessor = () => {
    isVideoProcessorOpen.value = false
    videoProcessorAssetId.value = null
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
  
  /**
   * 切换聊天面板显示/隐藏 (仅在创作模式下有效)
   */
  const toggleChatPanel = () => {
    chatPanelCollapsed.value = !chatPanelCollapsed.value
  }

  return {
    // 状态
    layoutMode,
    activeAgent,
    isAssetModalOpen,
    isVideoProcessorOpen,
    videoProcessorAssetId,
    currentSessionId,
    chatPanelCollapsed,
    
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
    startNewSession,
    toggleChatPanel,
    openVideoProcessor,
    openVideoProcessorWithAsset,
    closeVideoProcessor
  }
})
