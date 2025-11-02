import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface KnowledgeSource {
  id: string
  type: 'cloud' | 'local' | 'url'
  value: string // 文件名或URL
  name?: string // 显示名称
}

export interface KnowledgeBase {
  id: string
  name: string
  description?: string
  sources: KnowledgeSource[]
  status: 'building' | 'completed' | 'failed'
  progress?: number
  createdAt: string
  updatedAt?: string
  documentCount: number
}

export const useKnowledgeBaseStore = defineStore('knowledge-base', () => {
  const knowledgeBases = ref<KnowledgeBase[]>([
    {
      id: 'kb1',
      name: '产品营销知识库',
      description: '包含产品介绍、营销策略等相关文档',
      sources: [
        { id: 's1', type: 'cloud', value: '产品说明书.pdf', name: '产品说明书.pdf' },
        { id: 's2', type: 'url', value: 'https://example.com/product', name: 'https://example.com/product' }
      ],
      status: 'completed',
      createdAt: '2023-11-10',
      documentCount: 2
    },
    {
      id: 'kb2',
      name: '技术文档库',
      description: '技术规范和API文档',
      sources: [
        { id: 's3', type: 'cloud', value: 'API文档.pdf', name: 'API文档.pdf' }
      ],
      status: 'completed',
      createdAt: '2023-11-12',
      documentCount: 1
    }
  ])

  const createKnowledgeBase = (kb: Omit<KnowledgeBase, 'id' | 'createdAt' | 'documentCount'>) => {
    const newKb: KnowledgeBase = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0],
      documentCount: kb.sources.length,
      ...kb
    }
    knowledgeBases.value.unshift(newKb)
    return newKb
  }

  const updateKnowledgeBase = (id: string, updates: Partial<KnowledgeBase>) => {
    const index = knowledgeBases.value.findIndex(kb => kb.id === id)
    if (index !== -1) {
      knowledgeBases.value[index] = {
        ...knowledgeBases.value[index],
        ...updates,
        updatedAt: new Date().toISOString().split('T')[0]
      }
    }
  }

  const deleteKnowledgeBase = (id: string) => {
    knowledgeBases.value = knowledgeBases.value.filter(kb => kb.id !== id)
  }

  const getKnowledgeBase = (id: string) => {
    return knowledgeBases.value.find(kb => kb.id === id)
  }

  return {
    knowledgeBases,
    createKnowledgeBase,
    updateKnowledgeBase,
    deleteKnowledgeBase,
    getKnowledgeBase
  }
})

