import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

/**
 * 历史记录类型
 */
export type HistoryType = 'video-mixer' | 'style-imitation' | 'document' | 'chat'

/**
 * 历史记录项
 */
export interface HistoryRecord {
  id: string
  type: HistoryType
  title: string
  timestamp: Date
  agentType: 'video-mixer' | 'style-imitation' | string
  thumbnail?: string
  status?: 'completed' | 'processing' | 'failed'
  metadata?: Record<string, any>
}

export const useHistoryStore = defineStore('history', () => {
  // ========== 状态 ==========
  
  /**
   * 所有历史记录
   */
  const records = ref<HistoryRecord[]>([])
  
  /**
   * 当前查看的智能体类型
   */
  const activeAgentType = ref<'video-mixer' | 'style-imitation'>('video-mixer')

  // ========== 计算属性 ==========
  
  /**
   * 按日期分组的历史记录
   */
  const groupedRecords = computed(() => {
    const filtered = records.value.filter(r => r.agentType === activeAgentType.value)
    
    // 按日期分组
    const grouped: Record<string, HistoryRecord[]> = {}
    
    filtered.forEach(record => {
      const dateKey = formatDate(record.timestamp)
      if (!grouped[dateKey]) {
        grouped[dateKey] = []
      }
      grouped[dateKey].push(record)
    })
    
    // 转换为数组并按日期排序（最新的在前）
    return Object.entries(grouped)
      .map(([date, items]) => ({ date, items }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  })

  // ========== Actions ==========
  
  /**
   * 添加历史记录
   */
  const addRecord = (record: Omit<HistoryRecord, 'id' | 'timestamp'>) => {
    const newRecord: HistoryRecord = {
      id: `history_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      ...record
    }
    records.value.unshift(newRecord)
    
    // 持久化到 localStorage
    saveToLocalStorage()
  }
  
  /**
   * 删除历史记录
   */
  const deleteRecord = (id: string) => {
    const index = records.value.findIndex(r => r.id === id)
    if (index > -1) {
      records.value.splice(index, 1)
      saveToLocalStorage()
    }
  }
  
  /**
   * 切换智能体类型
   */
  const setActiveAgentType = (type: 'video-mixer' | 'style-imitation') => {
    activeAgentType.value = type
  }
  
  /**
   * 保存到 localStorage
   */
  const saveToLocalStorage = () => {
    localStorage.setItem('history_records', JSON.stringify(records.value))
  }
  
  /**
   * 从 localStorage 恢复
   */
  const loadFromLocalStorage = () => {
    const saved = localStorage.getItem('history_records')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        records.value = parsed.map((record: any) => ({
          ...record,
          timestamp: new Date(record.timestamp)
        }))
      } catch (e) {
        console.error('Failed to load history from localStorage:', e)
      }
    }
  }
  
  // 注意：暂时注释掉自动加载，避免缓存问题
  // loadFromLocalStorage()
  
  /**
   * 初始化模拟数据（仅用于演示）
   */
  const initMockData = () => {
    if (records.value.length === 0) {
      // 添加一些模拟的历史记录
      const videoRecords: Omit<HistoryRecord, 'id' | 'timestamp'>[] = [
        { type: 'video-mixer', agentType: 'video-mixer', title: '产品展示视频 - 商务版', status: 'completed', thumbnail: '/placeholder-video.jpg' },
        { type: 'video-mixer', agentType: 'video-mixer', title: '社交媒体视频 - 年轻化', status: 'completed', thumbnail: '/placeholder-video.jpg' },
        { type: 'video-mixer', agentType: 'video-mixer', title: '批量视频 3 - 默认风格', status: 'completed', thumbnail: '/placeholder-video.jpg' },
        { type: 'video-mixer', agentType: 'video-mixer', title: '品牌宣传视频', status: 'completed', thumbnail: '/placeholder-video.jpg' },
        { type: 'video-mixer', agentType: 'video-mixer', title: '活动推广视频', status: 'completed', thumbnail: '/placeholder-video.jpg' }
      ]
      
      const styleRecords: Omit<HistoryRecord, 'id' | 'timestamp'>[] = [
        { type: 'style-imitation', agentType: 'style-imitation', title: '企业季度战略规划PPT', status: 'completed' },
        { type: 'style-imitation', agentType: 'style-imitation', title: '2025 AI智能体发展报告', status: 'completed' },
        { type: 'style-imitation', agentType: 'style-imitation', title: '瑞尔电气数字化转型项目进度汇报', status: 'completed' },
        { type: 'style-imitation', agentType: 'style-imitation', title: '2025 AI智能体:智能经济新纪元', status: 'completed' },
        { type: 'style-imitation', agentType: 'style-imitation', title: '学术研究演示文稿设计与制作方案', status: 'completed' }
      ]
      
      // 生成不同日期的记录
      const now = new Date()
      const allMockRecords = [...videoRecords, ...styleRecords]
      
      allMockRecords.forEach((record, index) => {
        const date = new Date(now)
        // 生成不同的日期，模拟真实的历史记录
        const daysAgo = index < 3 ? index : Math.floor(index / 2) + 3
        date.setDate(date.getDate() - daysAgo)
        
        // 设置不同的时间
        date.setHours(16 - index % 6, index % 60, 0, 0)
        
        const fullRecord: HistoryRecord = {
          ...record,
          id: `mock_${index}`,
          timestamp: date
        }
        records.value.push(fullRecord)
      })
      
      // 按时间倒序排序
      records.value.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      
      saveToLocalStorage()
    }
  }

  return {
    // 状态
    records,
    activeAgentType,
    
    // 计算属性
    groupedRecords,
    
    // Actions
    addRecord,
    deleteRecord,
    setActiveAgentType,
    initMockData
  }
})

/**
 * 格式化日期为 YYYY-MM-DD
 */
function formatDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

