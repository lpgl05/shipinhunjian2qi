/**
 * 视频意图解析器
 * 解析用户的自然语言输入，提取视频制作相关的参数
 */

export interface VideoIntent {
  type: 'create_video' | 'modify_config' | 'ask_question' | 'unknown'
  confidence: number
  entities: {
    duration?: number
    aspectRatio?: string
    style?: string
    topic?: string
    features?: string[]
    voiceType?: string
    hasSubtitles?: boolean
    hasMusic?: boolean
    resolution?: string
    fps?: number
  }
}

/**
 * 关键词映射表
 */
const KEYWORDS = {
  // 时长相关
  duration: {
    patterns: [
      /(\d+)\s*秒/g,
      /(\d+)\s*分钟/g,
      /时长\s*(\d+)/g,
      /长度\s*(\d+)/g,
      /(\d+)s/gi,
      /(\d+)\s*min/gi
    ],
    multipliers: { '秒': 1, '分钟': 60, 's': 1, 'min': 60 }
  },
  
  // 格式相关
  aspectRatio: {
    '竖版': '9:16',
    '横版': '16:9',
    '方形': '1:1',
    '抖音': '9:16',
    '快手': '9:16',
    '小红书': '9:16',
    'youtube': '16:9',
    'bilibili': '16:9',
    '微博': '1:1',
    '朋友圈': '1:1'
  },
  
  // 风格相关
  style: {
    '现代': 'modern',
    '简约': 'minimal',
    '复古': 'vintage',
    '商务': 'professional',
    '专业': 'professional',
    '创意': 'creative',
    '艺术': 'creative',
    '时尚': 'modern',
    '清新': 'minimal'
  },
  
  // 主题相关
  topics: [
    '美食', '旅游', '教程', '产品', '宣传', '介绍', '展示', '评测',
    '开箱', '化妆', '穿搭', '健身', '音乐', '舞蹈', '游戏', '科技',
    '生活', '日常', '分享', '故事', '新闻', '访谈', '演讲'
  ],
  
  // 功能特性
  features: {
    '字幕': 'subtitles',
    '配音': 'voiceover',
    '背景音乐': 'background_music',
    '音乐': 'background_music',
    '特效': 'effects',
    '转场': 'transitions',
    '滤镜': 'filters',
    '贴纸': 'stickers',
    '文字': 'text_overlay'
  },
  
  // 音色类型
  voiceType: {
    '女声': 'female',
    '男声': 'male',
    '童声': 'child',
    '机器人': 'robot',
    '温柔': 'female',
    '沉稳': 'male',
    '活泼': 'child'
  },
  
  // 分辨率
  resolution: {
    '高清': '1080p',
    '超清': '1440p',
    '4k': '4K',
    '720p': '720p',
    '1080p': '1080p',
    '1440p': '1440p'
  }
}

/**
 * 解析用户输入的自然语言
 */
export class VideoIntentParser {
  /**
   * 主要解析方法
   */
  static parseIntent(message: string): VideoIntent {
    const normalizedMessage = message.toLowerCase().trim()
    
    // 判断意图类型
    const intentType = this.detectIntentType(normalizedMessage)
    
    // 提取实体信息
    const entities = this.extractEntities(message)
    
    // 计算置信度
    const confidence = this.calculateConfidence(intentType, entities)
    
    return {
      type: intentType,
      confidence,
      entities
    }
  }
  
  /**
   * 检测意图类型
   */
  private static detectIntentType(message: string): VideoIntent['type'] {
    // 创建视频的关键词
    const createKeywords = ['制作', '生成', '创建', '做', '拍', '录制', '编辑', '剪辑']
    
    // 修改配置的关键词
    const modifyKeywords = ['修改', '调整', '改变', '更换', '替换', '优化']
    
    // 询问问题的关键词
    const questionKeywords = ['怎么', '如何', '什么', '为什么', '能否', '可以', '支持']
    
    if (createKeywords.some(keyword => message.includes(keyword))) {
      return 'create_video'
    }
    
    if (modifyKeywords.some(keyword => message.includes(keyword))) {
      return 'modify_config'
    }
    
    if (questionKeywords.some(keyword => message.includes(keyword))) {
      return 'ask_question'
    }
    
    return 'unknown'
  }
  
  /**
   * 提取实体信息
   */
  private static extractEntities(message: string): VideoIntent['entities'] {
    const entities: VideoIntent['entities'] = {}
    
    // 提取时长
    entities.duration = this.extractDuration(message)
    
    // 提取宽高比
    entities.aspectRatio = this.extractAspectRatio(message)
    
    // 提取风格
    entities.style = this.extractStyle(message)
    
    // 提取主题
    entities.topic = this.extractTopic(message)
    
    // 提取功能特性
    entities.features = this.extractFeatures(message)
    
    // 提取音色类型
    entities.voiceType = this.extractVoiceType(message)
    
    // 检测是否需要字幕
    entities.hasSubtitles = this.detectSubtitles(message)
    
    // 检测是否需要背景音乐
    entities.hasMusic = this.detectMusic(message)
    
    // 提取分辨率
    entities.resolution = this.extractResolution(message)
    
    return entities
  }
  
  /**
   * 提取时长信息
   */
  private static extractDuration(message: string): number | undefined {
    const patterns = KEYWORDS.duration.patterns
    
    for (const pattern of patterns) {
      const matches = Array.from(message.matchAll(pattern))
      if (matches.length > 0) {
        const match = matches[0]
        const value = parseInt(match[1])
        
        // 根据单位转换为秒
        if (message.includes('分钟') || message.includes('min')) {
          return value * 60
        }
        return value
      }
    }
    
    return undefined
  }
  
  /**
   * 提取宽高比
   */
  private static extractAspectRatio(message: string): string | undefined {
    const ratioMap = KEYWORDS.aspectRatio
    
    for (const [keyword, ratio] of Object.entries(ratioMap)) {
      if (message.includes(keyword)) {
        return ratio
      }
    }
    
    return undefined
  }
  
  /**
   * 提取风格
   */
  private static extractStyle(message: string): string | undefined {
    const styleMap = KEYWORDS.style
    
    for (const [keyword, style] of Object.entries(styleMap)) {
      if (message.includes(keyword)) {
        return style
      }
    }
    
    return undefined
  }
  
  /**
   * 提取主题
   */
  private static extractTopic(message: string): string | undefined {
    const topics = KEYWORDS.topics
    
    for (const topic of topics) {
      if (message.includes(topic)) {
        return topic
      }
    }
    
    return undefined
  }
  
  /**
   * 提取功能特性
   */
  private static extractFeatures(message: string): string[] {
    const features: string[] = []
    const featureMap = KEYWORDS.features
    
    for (const [keyword, feature] of Object.entries(featureMap)) {
      if (message.includes(keyword)) {
        features.push(feature)
      }
    }
    
    return features
  }
  
  /**
   * 提取音色类型
   */
  private static extractVoiceType(message: string): string | undefined {
    const voiceMap = KEYWORDS.voiceType
    
    for (const [keyword, voice] of Object.entries(voiceMap)) {
      if (message.includes(keyword)) {
        return voice
      }
    }
    
    return undefined
  }
  
  /**
   * 检测是否需要字幕
   */
  private static detectSubtitles(message: string): boolean {
    const subtitleKeywords = ['字幕', '文字', '标题', '说明文字']
    return subtitleKeywords.some(keyword => message.includes(keyword))
  }
  
  /**
   * 检测是否需要背景音乐
   */
  private static detectMusic(message: string): boolean {
    const musicKeywords = ['音乐', '背景音乐', 'bgm', '配乐', '伴奏']
    return musicKeywords.some(keyword => message.includes(keyword))
  }
  
  /**
   * 提取分辨率
   */
  private static extractResolution(message: string): string | undefined {
    const resolutionMap = KEYWORDS.resolution
    
    for (const [keyword, resolution] of Object.entries(resolutionMap)) {
      if (message.includes(keyword)) {
        return resolution
      }
    }
    
    return undefined
  }
  
  /**
   * 计算置信度
   */
  private static calculateConfidence(intentType: VideoIntent['type'], entities: VideoIntent['entities']): number {
    let confidence = 0.5 // 基础置信度
    
    // 根据意图类型调整
    if (intentType !== 'unknown') {
      confidence += 0.2
    }
    
    // 根据提取到的实体数量调整
    const entityCount = Object.values(entities).filter(value => 
      value !== undefined && value !== null && 
      (Array.isArray(value) ? value.length > 0 : true)
    ).length
    
    confidence += Math.min(entityCount * 0.1, 0.3)
    
    return Math.min(confidence, 1.0)
  }
}

/**
 * 生成配置建议的示例数据
 */
export function generateMockSuggestions(intent: VideoIntent) {
  const suggestions = []
  
  // 基于解析的意图生成建议
  if (intent.type === 'create_video') {
    const baseConfig = {
      duration: intent.entities.duration || 30,
      aspectRatio: intent.entities.aspectRatio || '16:9',
      style: intent.entities.style || 'modern',
      resolution: intent.entities.resolution || '1080p',
      fps: 30
    }
    
    // 生成3个不同的建议
    suggestions.push({
      id: '1',
      title: '推荐方案一',
      description: '基于您的需求定制的标准配置',
      videoTemplate: baseConfig,
      parameters: baseConfig,
      subtitleConfig: {
        enabled: intent.entities.hasSubtitles || false,
        style: 'default',
        position: 'bottom'
      },
      voiceConfig: {
        type: intent.entities.voiceType || 'female',
        speed: 1.0,
        volume: 0.8
      },
      relevanceScore: 0.9
    })
    
    // 变体方案
    suggestions.push({
      id: '2',
      title: '推荐方案二',
      description: '更具创意的配置方案',
      videoTemplate: { ...baseConfig, style: 'creative' },
      parameters: { ...baseConfig, style: 'creative' },
      subtitleConfig: {
        enabled: true,
        style: 'creative',
        position: 'center'
      },
      voiceConfig: {
        type: 'male',
        speed: 1.1,
        volume: 0.9
      },
      relevanceScore: 0.8
    })
    
    suggestions.push({
      id: '3',
      title: '推荐方案三',
      description: '简约风格的配置方案',
      videoTemplate: { ...baseConfig, style: 'minimal' },
      parameters: { ...baseConfig, style: 'minimal' },
      subtitleConfig: {
        enabled: intent.entities.hasSubtitles || false,
        style: 'minimal',
        position: 'bottom'
      },
      voiceConfig: {
        type: intent.entities.voiceType || 'female',
        speed: 0.9,
        volume: 0.7
      },
      relevanceScore: 0.7
    })
  }
  
  return suggestions
}