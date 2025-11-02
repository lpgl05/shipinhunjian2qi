/**
 * 配置方案生成引擎
 * 基于用户意图分析结果，生成多套推荐的视频配置方案
 */

import type { VideoIntent, VideoEntities } from '../nlp/videoIntentParser'
import type { ConfigSuggestion, VideoTemplate, VideoParameters, SubtitleConfig, VoiceConfig } from '@/store/conversationalVideo'

export interface GenerationOptions {
  maxSuggestions?: number // 最大建议数量
  includeAlternatives?: boolean // 是否包含替代方案
  userExperience?: 'beginner' | 'intermediate' | 'expert' // 用户经验水平
  prioritizeSpeed?: boolean // 是否优先考虑制作速度
}

export class ConfigGenerator {
  private readonly defaultOptions: Required<GenerationOptions> = {
    maxSuggestions: 3,
    includeAlternatives: true,
    userExperience: 'intermediate',
    prioritizeSpeed: false
  }

  // 预定义的模板库
  private readonly templateLibrary: Record<string, VideoTemplate[]> = {
    food: [
      {
        id: 'food_modern',
        name: '现代美食模板',
        aspectRatio: '9:16',
        style: 'modern',
        transition: 'fade'
      },
      {
        id: 'food_cinematic',
        name: '电影级美食模板',
        aspectRatio: '16:9',
        style: 'cinematic',
        transition: 'dissolve'
      }
    ],
    product: [
      {
        id: 'product_professional',
        name: '专业产品展示',
        aspectRatio: '16:9',
        style: 'professional',
        transition: 'slide'
      },
      {
        id: 'product_modern',
        name: '现代产品宣传',
        aspectRatio: '9:16',
        style: 'modern',
        transition: 'fade'
      }
    ],
    tutorial: [
      {
        id: 'tutorial_clean',
        name: '清晰教程模板',
        aspectRatio: '16:9',
        style: 'professional',
        transition: 'cut'
      },
      {
        id: 'tutorial_friendly',
        name: '友好教学模板',
        aspectRatio: '9:16',
        style: 'warm',
        transition: 'fade'
      }
    ],
    general: [
      {
        id: 'general_modern',
        name: '通用现代模板',
        aspectRatio: '9:16',
        style: 'modern',
        transition: 'fade'
      },
      {
        id: 'general_vibrant',
        name: '活力通用模板',
        aspectRatio: '9:16',
        style: 'vibrant',
        transition: 'slide'
      }
    ]
  }

  // 风格配置映射
  private readonly styleConfigs: Record<string, Partial<VideoParameters>> = {
    modern: {
      fps: 30,
      resolution: '1080p',
      transition: 'fade'
    },
    cinematic: {
      fps: 24,
      resolution: '4K',
      transition: 'dissolve'
    },
    vibrant: {
      fps: 60,
      resolution: '1080p',
      transition: 'slide'
    },
    professional: {
      fps: 30,
      resolution: '1080p',
      transition: 'cut'
    },
    warm: {
      fps: 30,
      resolution: '1080p',
      transition: 'fade'
    },
    tech: {
      fps: 60,
      resolution: '4K',
      transition: 'zoom'
    }
  }

  // 平台优化配置
  private readonly platformConfigs: Record<string, Partial<VideoParameters>> = {
    tiktok: {
      aspectRatio: '9:16',
      duration: 60,
      resolution: '1080p',
      fps: 30
    },
    kuaishou: {
      aspectRatio: '9:16',
      duration: 60,
      resolution: '1080p',
      fps: 30
    },
    bilibili: {
      aspectRatio: '16:9',
      duration: 180,
      resolution: '1080p',
      fps: 60
    },
    youtube: {
      aspectRatio: '16:9',
      duration: 300,
      resolution: '4K',
      fps: 60
    },
    wechat: {
      aspectRatio: '1:1',
      duration: 30,
      resolution: '720p',
      fps: 30
    }
  }

  /**
   * 生成配置建议
   */
  public async generateSuggestions(
    intent: VideoIntent,
    options: GenerationOptions = {}
  ): Promise<ConfigSuggestion[]> {
    const opts = { ...this.defaultOptions, ...options }
    const { entities } = intent
    
    const suggestions: ConfigSuggestion[] = []
    
    // 生成主要推荐方案
    const primarySuggestion = this.generatePrimarySuggestion(entities, opts)
    suggestions.push(primarySuggestion)
    
    // 生成替代方案
    if (opts.includeAlternatives && opts.maxSuggestions > 1) {
      const alternatives = this.generateAlternativeSuggestions(entities, opts, opts.maxSuggestions - 1)
      suggestions.push(...alternatives)
    }
    
    // 按相关度排序
    suggestions.sort((a, b) => b.relevanceScore - a.relevanceScore)
    
    return suggestions.slice(0, opts.maxSuggestions)
  }

  /**
   * 生成主要推荐方案
   */
  private generatePrimarySuggestion(
    entities: VideoEntities,
    options: Required<GenerationOptions>
  ): ConfigSuggestion {
    // 选择最佳模板
    const template = this.selectBestTemplate(entities)
    
    // 构建视频参数
    const parameters = this.buildVideoParameters(entities, template)
    
    // 构建字幕配置
    const subtitleConfig = this.buildSubtitleConfig(entities)
    
    // 构建音频配置
    const voiceConfig = this.buildVoiceConfig(entities)
    
    // 计算相关度
    const relevanceScore = this.calculateRelevanceScore(entities, parameters, subtitleConfig, voiceConfig)
    
    // 生成推理说明
    const reasoning = this.generateReasoning(entities, parameters, 'primary')
    
    return {
      id: `suggestion_primary_${Date.now()}`,
      title: '智能推荐方案',
      description: '基于您的需求智能优化的最佳配置',
      videoTemplate: template,
      parameters,
      subtitleConfig,
      voiceConfig,
      relevanceScore,
      reasoning
    }
  }

  /**
   * 生成替代方案
   */
  private generateAlternativeSuggestions(
    entities: VideoEntities,
    options: Required<GenerationOptions>,
    count: number
  ): ConfigSuggestion[] {
    const alternatives: ConfigSuggestion[] = []
    
    // 快速方案
    if (count > 0) {
      alternatives.push(this.generateQuickSuggestion(entities))
    }
    
    // 专业方案
    if (count > 1) {
      alternatives.push(this.generateProfessionalSuggestion(entities))
    }
    
    // 创意方案
    if (count > 2) {
      alternatives.push(this.generateCreativeSuggestion(entities))
    }
    
    return alternatives.slice(0, count)
  }

  /**
   * 生成快速方案
   */
  private generateQuickSuggestion(entities: VideoEntities): ConfigSuggestion {
    const template = this.selectBestTemplate(entities, 'quick')
    const parameters = this.buildVideoParameters(entities, template, 'quick')
    const subtitleConfig = this.buildSubtitleConfig(entities, 'quick')
    const voiceConfig = this.buildVoiceConfig(entities, 'quick')
    
    return {
      id: `suggestion_quick_${Date.now()}`,
      title: '快速制作方案',
      description: '简化配置，快速生成，适合紧急需求',
      videoTemplate: template,
      parameters: {
        ...parameters,
        duration: Math.min(parameters.duration, 30),
        fps: 30,
        resolution: '720p'
      },
      subtitleConfig: {
        ...subtitleConfig,
        enabled: false
      },
      voiceConfig: {
        ...voiceConfig,
        speed: 1.2
      },
      relevanceScore: 0.75,
      reasoning: '优化制作速度，简化配置选项，适合快速出片需求'
    }
  }

  /**
   * 生成专业方案
   */
  private generateProfessionalSuggestion(entities: VideoEntities): ConfigSuggestion {
    const template = this.selectBestTemplate(entities, 'professional')
    const parameters = this.buildVideoParameters(entities, template, 'professional')
    const subtitleConfig = this.buildSubtitleConfig(entities, 'professional')
    const voiceConfig = this.buildVoiceConfig(entities, 'professional')
    
    return {
      id: `suggestion_professional_${Date.now()}`,
      title: '专业制作方案',
      description: '高质量配置，专业级效果，适合重要项目',
      videoTemplate: template,
      parameters: {
        ...parameters,
        fps: 60,
        resolution: '4K',
        style: 'professional'
      },
      subtitleConfig: {
        ...subtitleConfig,
        enabled: true,
        style: 'professional',
        fontSize: 28
      },
      voiceConfig: {
        ...voiceConfig,
        type: 'authoritative',
        speed: 0.9
      },
      relevanceScore: 0.85,
      reasoning: '专业级配置，高分辨率输出，适合商业用途和重要展示'
    }
  }

  /**
   * 生成创意方案
   */
  private generateCreativeSuggestion(entities: VideoEntities): ConfigSuggestion {
    const template = this.selectBestTemplate(entities, 'creative')
    const parameters = this.buildVideoParameters(entities, template, 'creative')
    const subtitleConfig = this.buildSubtitleConfig(entities, 'creative')
    const voiceConfig = this.buildVoiceConfig(entities, 'creative')
    
    return {
      id: `suggestion_creative_${Date.now()}`,
      title: '创意表达方案',
      description: '独特风格，创意效果，让您的视频脱颖而出',
      videoTemplate: template,
      parameters: {
        ...parameters,
        style: 'artistic',
        transition: 'zoom'
      },
      subtitleConfig: {
        ...subtitleConfig,
        enabled: true,
        style: 'artistic',
        position: 'center'
      },
      voiceConfig: {
        ...voiceConfig,
        type: 'dramatic',
        pitch: 1.1
      },
      relevanceScore: 0.70,
      reasoning: '创意导向的配置，独特的视觉效果，适合艺术表达和个性化需求'
    }
  }

  /**
   * 选择最佳模板
   */
  private selectBestTemplate(
    entities: VideoEntities,
    variant: 'primary' | 'quick' | 'professional' | 'creative' = 'primary'
  ): VideoTemplate {
    const topic = entities.topic || 'general'
    const templates = this.templateLibrary[topic] || this.templateLibrary.general
    
    // 根据变体选择不同的模板
    let selectedTemplate = templates[0]
    
    if (variant === 'professional' && templates.length > 1) {
      selectedTemplate = templates.find(t => t.style === 'professional') || templates[1] || templates[0]
    } else if (variant === 'creative' && templates.length > 1) {
      selectedTemplate = templates.find(t => t.style === 'artistic') || templates[templates.length - 1]
    }
    
    // 根据用户指定的画面比例调整
    if (entities.aspectRatio) {
      selectedTemplate = {
        ...selectedTemplate,
        aspectRatio: entities.aspectRatio
      }
    }
    
    return selectedTemplate
  }

  /**
   * 构建视频参数
   */
  private buildVideoParameters(
    entities: VideoEntities,
    template: VideoTemplate,
    variant: 'primary' | 'quick' | 'professional' | 'creative' = 'primary'
  ): VideoParameters {
    // 基础参数
    const baseParams: VideoParameters = {
      duration: entities.duration || 60,
      aspectRatio: entities.aspectRatio || template.aspectRatio,
      resolution: entities.resolution || '1080p',
      fps: 30,
      style: entities.style || template.style,
      transition: entities.transition || template.transition,
      topic: entities.topic || 'general',
      title: '智能生成视频'
    }
    
    // 应用风格配置
    if (baseParams.style && this.styleConfigs[baseParams.style]) {
      Object.assign(baseParams, this.styleConfigs[baseParams.style])
    }
    
    // 应用平台优化
    if (entities.platform && this.platformConfigs[entities.platform]) {
      Object.assign(baseParams, this.platformConfigs[entities.platform])
    }
    
    // 根据变体调整参数
    if (variant === 'quick') {
      baseParams.fps = 30
      baseParams.resolution = '720p'
    } else if (variant === 'professional') {
      baseParams.fps = 60
      baseParams.resolution = '4K'
    }
    
    return baseParams
  }

  /**
   * 构建字幕配置
   */
  private buildSubtitleConfig(
    entities: VideoEntities,
    variant: 'primary' | 'quick' | 'professional' | 'creative' = 'primary'
  ): SubtitleConfig {
    const config: SubtitleConfig = {
      enabled: entities.hasSubtitles ?? true,
      style: entities.subtitleStyle || 'modern',
      position: 'bottom',
      fontSize: 24,
      color: '#ffffff'
    }
    
    // 根据变体调整
    if (variant === 'quick') {
      config.enabled = false
    } else if (variant === 'professional') {
      config.fontSize = 28
      config.style = 'professional'
    } else if (variant === 'creative') {
      config.position = 'center'
      config.style = 'artistic'
    }
    
    return config
  }

  /**
   * 构建音频配置
   */
  private buildVoiceConfig(
    entities: VideoEntities,
    variant: 'primary' | 'quick' | 'professional' | 'creative' = 'primary'
  ): VoiceConfig {
    const config: VoiceConfig = {
      type: entities.voiceType || 'authoritative',
      speed: 1.0,
      pitch: 1.0,
      volume: 0.8
    }
    
    // 根据变体调整
    if (variant === 'quick') {
      config.speed = 1.2
    } else if (variant === 'professional') {
      config.type = 'authoritative'
      config.speed = 0.9
    } else if (variant === 'creative') {
      config.type = 'dramatic'
      config.pitch = 1.1
    }
    
    return config
  }

  /**
   * 计算相关度评分
   */
  private calculateRelevanceScore(
    entities: VideoEntities,
    parameters: VideoParameters,
    subtitleConfig: SubtitleConfig,
    voiceConfig: VoiceConfig
  ): number {
    let score = 0.5 // 基础分数
    
    // 根据匹配的实体增加分数
    if (entities.duration && parameters.duration === entities.duration) score += 0.1
    if (entities.aspectRatio && parameters.aspectRatio === entities.aspectRatio) score += 0.1
    if (entities.style && parameters.style === entities.style) score += 0.1
    if (entities.topic && parameters.topic === entities.topic) score += 0.1
    if (entities.hasSubtitles !== undefined && subtitleConfig.enabled === entities.hasSubtitles) score += 0.1
    if (entities.voiceType && voiceConfig.type === entities.voiceType) score += 0.1
    
    // 根据配置完整性调整
    const configCompleteness = [
      parameters.duration,
      parameters.aspectRatio,
      parameters.style,
      subtitleConfig.enabled,
      voiceConfig.type
    ].filter(Boolean).length / 5
    
    score += configCompleteness * 0.2
    
    return Math.min(0.95, Math.max(0.1, score))
  }

  /**
   * 生成推理说明
   */
  private generateReasoning(
    entities: VideoEntities,
    parameters: VideoParameters,
    variant: 'primary' | 'quick' | 'professional' | 'creative'
  ): string {
    const reasons: string[] = []
    
    // 基于用户需求的推理
    if (entities.topic) {
      const topicMap: Record<string, string> = {
        food: '美食内容',
        product: '产品展示',
        tutorial: '教程教学',
        travel: '旅游风景',
        fitness: '健身运动'
      }
      reasons.push(`针对${topicMap[entities.topic] || entities.topic}优化`)
    }
    
    if (entities.platform) {
      const platformMap: Record<string, string> = {
        tiktok: '抖音平台',
        bilibili: 'B站平台',
        youtube: 'YouTube平台'
      }
      reasons.push(`适配${platformMap[entities.platform] || entities.platform}`)
    }
    
    if (entities.aspectRatio) {
      const ratioMap: Record<string, string> = {
        '9:16': '竖版格式，适合移动端观看',
        '16:9': '横版格式，适合桌面端观看',
        '1:1': '方形格式，适合社交媒体'
      }
      reasons.push(ratioMap[entities.aspectRatio] || `${entities.aspectRatio}比例`)
    }
    
    // 基于变体的推理
    if (variant === 'quick') {
      reasons.push('简化配置以提高制作效率')
    } else if (variant === 'professional') {
      reasons.push('高质量配置确保专业效果')
    } else if (variant === 'creative') {
      reasons.push('创意配置突出个性表达')
    }
    
    return reasons.join('，') || '基于智能分析的推荐配置'
  }
}

// 导出单例实例
export const configGenerator = new ConfigGenerator()