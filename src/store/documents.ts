import { defineStore } from 'pinia'
import { ref } from 'vue'

export type DocumentStatus = 'uploading' | 'processing' | 'training' | 'completed' | 'failed'
export type TrainingStatus = 'not_started' | 'training' | 'completed' | 'failed'

export interface Document {
  id: string
  name: string
  type: 'file' | 'link'
  fileName?: string
  url?: string
  size?: number
  uploadTime: string
  status: DocumentStatus
  trainingStatus: TrainingStatus
  trainingProgress?: number
  errorMessage?: string
}

export interface Creation {
  id: string
  title: string
  content: string
  style: string
  template?: string
  wordCount: number
  createdAt: string
  updatedAt: string
}

export const useDocumentsStore = defineStore('documents', () => {
  // 模拟文档数据
  const documents = ref<Document[]>([
    {
      id: '1',
      name: '产品营销方案.pdf',
      type: 'file',
      fileName: '产品营销方案.pdf',
      size: 2048000,
      uploadTime: '2024-01-15 10:30:00',
      status: 'completed',
      trainingStatus: 'completed',
      trainingProgress: 100
    },
    {
      id: '2',
      name: '品牌宣传文案集.docx',
      type: 'file',
      fileName: '品牌宣传文案集.docx',
      size: 1536000,
      uploadTime: '2024-01-16 14:20:00',
      status: 'completed',
      trainingStatus: 'training',
      trainingProgress: 65
    },
    {
      id: '3',
      name: 'https://example.com/article',
      type: 'link',
      url: 'https://example.com/article',
      uploadTime: '2024-01-17 09:15:00',
      status: 'processing',
      trainingStatus: 'not_started'
    }
  ])

  // 模拟创作数据
  const creations = ref<Creation[]>([
    {
      id: '1',
      title: 'AI在营销行业的应用',
      content: '在当今快速发展的商业环境中，AI已经成为企业成功的关键因素之一...',
      style: '老板-正式风格',
      template: '技术博客',
      wordCount: 1520,
      createdAt: '2024-01-18 10:00:00',
      updatedAt: '2024-01-18 10:00:00'
    },
    {
      id: '2',
      title: '2024年第一季度工作总结',
      content: '本季度我们完成了以下重点工作...',
      style: 'CEO-创新风格',
      template: '周报',
      wordCount: 890,
      createdAt: '2024-01-19 15:30:00',
      updatedAt: '2024-01-19 15:30:00'
    }
  ])

  // 获取所有文档
  const getDocuments = () => {
    return documents.value
  }

  // 获取文档详情
  const getDocument = (id: string) => {
    return documents.value.find(doc => doc.id === id)
  }

  // 添加文档
  const addDocument = (doc: Omit<Document, 'id' | 'uploadTime'>) => {
    const newDoc: Document = {
      ...doc,
      id: Date.now().toString(),
      uploadTime: new Date().toLocaleString('zh-CN')
    }
    documents.value.unshift(newDoc)
    return newDoc
  }

  // 删除文档
  const deleteDocument = (id: string) => {
    const index = documents.value.findIndex(doc => doc.id === id)
    if (index > -1) {
      documents.value.splice(index, 1)
    }
  }

  // 更新文档状态
  const updateDocumentStatus = (id: string, status: DocumentStatus, trainingStatus?: TrainingStatus, progress?: number) => {
    const doc = documents.value.find(d => d.id === id)
    if (doc) {
      doc.status = status
      if (trainingStatus !== undefined) {
        doc.trainingStatus = trainingStatus
      }
      if (progress !== undefined) {
        doc.trainingProgress = progress
      }
    }
  }

  // 获取所有创作
  const getCreations = () => {
    return creations.value
  }

  // 获取创作详情
  const getCreation = (id: string) => {
    return creations.value.find(creation => creation.id === id)
  }

  // 添加创作
  const addCreation = (creation: Omit<Creation, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toLocaleString('zh-CN')
    const newCreation: Creation = {
      ...creation,
      id: Date.now().toString(),
      createdAt: now,
      updatedAt: now
    }
    creations.value.unshift(newCreation)
    return newCreation
  }

  // 更新创作
  const updateCreation = (id: string, updates: Partial<Creation>) => {
    const creation = creations.value.find(c => c.id === id)
    if (creation) {
      Object.assign(creation, updates)
      creation.updatedAt = new Date().toLocaleString('zh-CN')
    }
  }

  // 删除创作
  const deleteCreation = (id: string) => {
    const index = creations.value.findIndex(c => c.id === id)
    if (index > -1) {
      creations.value.splice(index, 1)
    }
  }

  // 搜索文档
  const searchDocuments = (keyword: string) => {
    if (!keyword.trim()) return documents.value
    const lowerKeyword = keyword.toLowerCase()
    return documents.value.filter(doc =>
      doc.name.toLowerCase().includes(lowerKeyword) ||
      (doc.fileName && doc.fileName.toLowerCase().includes(lowerKeyword))
    )
  }

  // 搜索创作
  const searchCreations = (keyword: string) => {
    if (!keyword.trim()) return creations.value
    const lowerKeyword = keyword.toLowerCase()
    return creations.value.filter(creation =>
      creation.title.toLowerCase().includes(lowerKeyword) ||
      creation.content.toLowerCase().includes(lowerKeyword) ||
      creation.style.toLowerCase().includes(lowerKeyword)
    )
  }

  return {
    documents,
    creations,
    getDocuments,
    getDocument,
    addDocument,
    deleteDocument,
    updateDocumentStatus,
    getCreations,
    getCreation,
    addCreation,
    updateCreation,
    deleteCreation,
    searchDocuments,
    searchCreations
  }
})

