import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface QuickPrompt {
  id: string
  text: string
  order: number
}

export interface WritingTemplate {
  id: string
  name: string
  description: string
  prompt: string
  icon?: string
  category: 'common' | 'business' | 'marketing' | 'technical'
  order: number
}

export interface FrontendConfig {
  welcomeMessage: string
  quickPrompts: QuickPrompt[]
  writingTemplates: WritingTemplate[]
}

export const useFrontendConfigStore = defineStore('frontend-config', () => {
  // 模拟数据
  const config = ref<FrontendConfig>({
    welcomeMessage: '告诉我您想要创作的内容，我将为您推荐最适合的写作风格',
    quickPrompts: [
      { id: '1', text: '写一篇产品介绍文章', order: 1 },
      { id: '2', text: '创建营销推广文案', order: 2 },
      { id: '3', text: '撰写技术博客文章', order: 3 },
      { id: '4', text: '制作社交媒体内容', order: 4 }
    ],
    writingTemplates: [
      {
        id: 'weekly-report',
        name: '周报',
        description: '快速生成工作周报',
        prompt: '请帮我写一份本周工作总结，包括主要工作内容、完成情况、遇到的问题和下周计划',
        category: 'business',
        order: 1
      },
      {
        id: 'speech',
        name: '发言稿',
        description: '撰写正式发言稿',
        prompt: '请帮我写一份发言稿，主题是：{topic}，要求正式、专业、有感染力',
        category: 'business',
        order: 2
      },
      {
        id: 'product-intro',
        name: '产品介绍',
        description: '产品介绍文案',
        prompt: '请帮我写一份产品介绍文案，突出产品特点和优势',
        category: 'marketing',
        order: 3
      },
      {
        id: 'marketing-plan',
        name: '营销方案',
        description: '营销推广方案',
        prompt: '请帮我写一份营销推广方案，包括目标、策略和执行计划',
        category: 'marketing',
        order: 4
      },
      {
        id: 'tech-blog',
        name: '技术博客',
        description: '技术文章撰写',
        prompt: '请帮我写一篇技术博客文章，要求逻辑清晰、通俗易懂',
        category: 'technical',
        order: 5
      }
    ]
  })

  // 获取快捷提示
  const getQuickPrompts = () => {
    return config.value.quickPrompts.sort((a, b) => a.order - b.order)
  }

  // 获取写作模板
  const getWritingTemplates = (category?: string) => {
    const templates = category
      ? config.value.writingTemplates.filter(t => t.category === category)
      : config.value.writingTemplates
    return templates.sort((a, b) => a.order - b.order)
  }

  // 获取模板
  const getTemplate = (id: string) => {
    return config.value.writingTemplates.find(t => t.id === id)
  }

  // 更新配置（管理员使用）
  const updateConfig = (newConfig: Partial<FrontendConfig>) => {
    config.value = { ...config.value, ...newConfig }
    // 模拟保存到localStorage
    localStorage.setItem('frontend_config', JSON.stringify(config.value))
  }

  // 更新快捷提示
  const updateQuickPrompts = (prompts: QuickPrompt[]) => {
    config.value.quickPrompts = prompts
    localStorage.setItem('frontend_config', JSON.stringify(config.value))
  }

  // 更新写作模板
  const updateWritingTemplates = (templates: WritingTemplate[]) => {
    config.value.writingTemplates = templates
    localStorage.setItem('frontend_config', JSON.stringify(config.value))
  }

  // 添加模板
  const addTemplate = (template: Omit<WritingTemplate, 'id'>) => {
    const newTemplate: WritingTemplate = {
      ...template,
      id: Date.now().toString()
    }
    config.value.writingTemplates.push(newTemplate)
    localStorage.setItem('frontend_config', JSON.stringify(config.value))
    return newTemplate
  }

  // 删除模板
  const deleteTemplate = (id: string) => {
    const index = config.value.writingTemplates.findIndex(t => t.id === id)
    if (index > -1) {
      config.value.writingTemplates.splice(index, 1)
      localStorage.setItem('frontend_config', JSON.stringify(config.value))
    }
  }

  // 初始化：从localStorage加载
  const init = () => {
    const saved = localStorage.getItem('frontend_config')
    if (saved) {
      try {
        config.value = JSON.parse(saved)
      } catch (e) {
        console.error('Failed to load frontend config:', e)
      }
    }
  }

  // 初始化
  init()

  return {
    config,
    getQuickPrompts,
    getWritingTemplates,
    getTemplate,
    updateConfig,
    updateQuickPrompts,
    updateWritingTemplates,
    addTemplate,
    deleteTemplate
  }
})

