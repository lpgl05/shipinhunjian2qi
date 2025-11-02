import type { VideoIntent } from './videoIntentParser'
import type { ConfigSuggestion } from '@/store/conversationalVideo'
import { aspectRatioMap, styleMap, voiceTypeMap } from './configApplicator'

/**
 * 配置生成器
 * 基于解析的用户意图生成多个配置建议
 */
export class ConfigGenerator {
  /**
   * 根据意图生成配置建议
   */
  static generateSuggestions(intent: VideoIntent): ConfigSuggestion[] {
    if (intent.type !== 'create_video') {
      return []
    }
    
    const suggestions: ConfigSuggestion[] = []
    const entities = intent.entities
    
    // 生成主要推荐方案
    suggestions.push(this.generatePrimarySuggestion(entities))
    
    // 生成替代方案
    suggestions.push(...this.generateAlternativeSuggestions(entities))
    
    // 按相关性分数排序
    return suggestions.sort((a, b) => b.relevanceScore - a.relevanceScore)
  }
  
  /**
   * 生成主要推荐方案
   */
  private static generatePrimarySuggestion(entities: VideoIntent['entities']): ConfigSuggestion {
    const baseConfig = this.createBaseConfig(entities)
    
    return {
      id: `suggestion-${Date.now()}-1`,
      title: '智能推荐方案',
      description: this.generateDescription(entities, 'primary'),
      videoTemplate: {
        title: entities.topic ? `${entities.topic}视频` : '新视频项目',
        ...baseConfig
      },
      parameters: baseConfig,
      subtitleConfig: {
        enabled: entities.hasSubtitles ?? true,
        style: this.getSubtitleStyle(entities.style),
        position: 'bottom',
        fontSize: 16,
        color: '#FFFFFF',
        backgroundColor: 'rgba(0,0,0,0.7)'
      },
      voiceConfig: {
        type: entities.voiceType || 'female',
        speed: 1.0,
        volume: 0.8,
        pitch: 1.0
      },
      relevanceScore: this.calculateRelevanceScore(entities, 'primary')
    }
  }
  
  /**
   * 生成替代方案
   */
  private static generateAlternativeSuggestions(entities: VideoIntent['entities']): ConfigSuggestion[] {
    const alternatives: ConfigSuggestion[] = []
    
    // 创意风格方案
    if (entities.style !== 'creative') {
      alternatives.push(this.generateCreativeVariant(entities))
    }
    
    // 专业风格方案
    if (entities.style !== 'professional') {
      alternatives.push(this.generateProfessionalVariant(entities))
    }
    
    // 如果没有指定格式，提供不同格式的方案
    if (!entities.aspectRatio) {
      alternatives.push(this.generateVerticalVariant(entities))
    }
    
    return alternatives.slice(0, 2) // 最多返回2个替代方案
  }
  
  /**
   * 创建基础配置
   */
  private static createBaseConfig(entities: VideoIntent['entities']) {
    return {
      duration: entities.duration || this.getDefaultDuration(entities.topic),
      aspectRatio: entities.aspectRatio || this.getDefaultAspectRatio(entities.topic),
      style: entities.style || this.getDefaultStyle(entities.topic),
      resolution: entities.resolution || '1080p',
      fps: entities.fps || 30,
      transition: this.getDefaultTransition(entities.style),
      hasMusic: entities.hasMusic ?? true
    }
  }
  
  /**
   * 生成创意风格变体
   */
  private static generateCreativeVariant(entities: VideoIntent['entities']): ConfigSuggestion {
    const baseConfig = this.createBaseConfig(entities)
    const creativeConfig = {
      ...baseConfig,
      style: 'creative',
      transition: 'zoom',
      fps: 60 // 更高帧率用于创意效果
    }
    
    return {
      id: `suggestion-${Date.now()}-creative`,
      title: '创意风格方案',
      description: '富有创意和艺术感的视频风格，适合展示个性化内容',
      videoTemplate: {
        title: entities.topic ? `创意${entities.topic}视频` : '创意视频项目',
        ...creativeConfig
      },
      parameters: creativeConfig,
      subtitleConfig: {
        enabled: entities.hasSubtitles ?? true,
        style: 'creative',
        position: 'center',
        fontSize: 18,
        color: '#FFD700',
        backgroundColor: 'transparent'
      },
      voiceConfig: {
        type: 'male',
        speed: 1.1,
        volume: 0.9,
        pitch: 1.1
      },
      relevanceScore: this.calculateRelevanceScore(entities, 'creative')
    }
  }
  
  /**
   * 生成专业风格变体
   */
  private static generateProfessionalVariant(entities: VideoIntent['entities']): ConfigSuggestion {
    const baseConfig = this.createBaseConfig(entities)
    const professionalConfig = {
      ...baseConfig,
      style: 'professional',
      transition: 'fade',
      resolution: '1440p' // 更高分辨率用于专业用途
    }
    
    return {
      id: `suggestion-${Date.now()}-professional`,
      title: '商务专业方案',
      description: '正式的商务风格，适合企业宣传和专业展示',
      videoTemplate: {
        title: entities.topic ? `专业${entities.topic}视频` : '专业视频项目',
        ...professionalConfig
      },
      parameters: professionalConfig,
      subtitleConfig: {
        enabled: entities.hasSubtitles ?? true,
        style: 'professional',
        position: 'bottom',
        fontSize: 14,
        color: '#FFFFFF',
        backgroundColor: 'rgba(0,0,0,0.8)'
      },
      voiceConfig: {
        type: 'male',
        speed: 0.9,
        volume: 0.8,
        pitch: 0.9
      },
      relevanceScore: this.calculateRelevanceScore(entities, 'professional')
    }
  }
  
  /**
   * 生成竖版格式变体
   */
  private static generateVerticalVariant(entities: VideoIntent['entities']): ConfigSuggestion {
    const baseConfig = this.createBaseConfig(entities)
    const verticalConfig = {
      ...baseConfig,
      aspectRatio: '9:16',
      duration: Math.min(baseConfig.duration, 60) // 竖版视频通常较短
    }
    
    return {
      id: `suggestion-${Date.now()}-vertical`,
      title: '竖版短视频方案',
      description: '适合抖音、快手等短视频平台的竖版格式',
      videoTemplate: {
        title: entities.topic ? `${entities.topic}短视频` : '竖版短视频',
        ...verticalConfig
      },
      parameters: verticalConfig,
      subtitleConfig: {
        enabled: true, // 竖版视频通常需要字幕
        style: 'modern',
        position: 'center',
        fontSize: 20,
        color: '#FFFFFF',
        backgroundColor: 'rgba(0,0,0,0.6)'
      },
      voiceConfig: {
        type: entities.voiceType || 'female',
        speed: 1.2, // 短视频语速稍快
        volume: 0.9,
        pitch: 1.1
      },
      relevanceScore: this.calculateRelevanceScore(entities, 'vertical')
    }
  }
  
  /**
   * 获取默认时长
   */
  private static getDefaultDuration(topic?: string): number {
    const topicDurations: Record<string, number> = {
      '美食': 60,
      '教程': 120,
      '产品': 30,
      '宣传': 45,
      '开箱': 90,
      '评测': 180
    }
    
    return topic && topicDurations[topic] ? topicDurations[topic] : 30
  }
  
  /**
   * 获取默认宽高比
   */
  private static getDefaultAspectRatio(topic?: string): string {
    const topicRatios: Record<string, string> = {
      '美食': '9:16',
      '穿搭': '9:16',
      '化妆': '9:16',
      '产品': '16:9',
      '教程': '16:9',
      '宣传': '16:9'
    }
    
    return topic && topicRatios[topic] ? topicRatios[topic] : '16:9'
  }
  
  /**
   * 获取默认风格
   */
  private static getDefaultStyle(topic?: string): string {
    const topicStyles: Record<string, string> = {
      '美食': 'modern',
      '时尚': 'creative',
      '商务': 'professional',
      '教程': 'minimal',
      '艺术': 'creative'
    }
    
    return topic && topicStyles[topic] ? topicStyles[topic] : 'modern'
  }
  
  /**
   * 获取默认转场效果
   */
  private static getDefaultTransition(style?: string): string {
    const styleTransitions: Record<string, string> = {
      'modern': 'fade',
      'creative': 'zoom',
      'professional': 'fade',
      'minimal': 'dissolve',
      'vintage': 'wipe'
    }
    
    return style && styleTransitions[style] ? styleTransitions[style] : 'fade'
  }
  
  /**
   * 获取字幕样式
   */
  private static getSubtitleStyle(style?: string): string {
    const styleSubtitles: Record<string, string> = {
      'modern': 'modern',
      'creative': 'creative',
      'professional': 'professional',
      'minimal': 'minimal',
      'vintage': 'vintage'
    }
    
    return style && styleSubtitles[style] ? styleSubtitles[style] : 'default'
  }
  
  /**
   * 生成描述文本
   */
  private static generateDescription(entities: VideoIntent['entities'], variant: string): string {
    const parts: string[] = []
    
    if (entities.duration) {
      parts.push(`时长${entities.duration}秒`)
    }
    
    if (entities.aspectRatio && aspectRatioMap[entities.aspectRatio as keyof typeof aspectRatioMap]) {
      parts.push(aspectRatioMap[entities.aspectRatio as keyof typeof aspectRatioMap].label)
    }
    
    if (entities.style && styleMap[entities.style as keyof typeof styleMap]) {
      parts.push(styleMap[entities.style as keyof typeof styleMap].label)
    }
    
    if (entities.topic) {
      parts.push(`${entities.topic}主题`)
    }
    
    if (entities.hasSubtitles) {
      parts.push('包含字幕')
    }
    
    if (entities.hasMusic) {
      parts.push('背景音乐')
    }
    
    const baseDescription = parts.length > 0 ? parts.join('，') : '通用视频配置'
    
    const variantDescriptions: Record<string, string> = {
      'primary': `基于您的需求智能生成的最佳配置方案：${baseDescription}`,
      'creative': `创意风格的配置方案：${baseDescription}，增强视觉效果和艺术感`,
      'professional': `商务专业的配置方案：${baseDescription}，适合正式场合使用`,
      'vertical': `短视频平台优化的配置方案：${baseDescription}，适合移动端观看`
    }
    
    return variantDescriptions[variant] || baseDescription
  }
  
  /**
   * 计算相关性分数
   */
  private static calculateRelevanceScore(entities: VideoIntent['entities'], variant: string): number {
    let score = 0.5 // 基础分数
    
    // 根据提取到的实体数量增加分数
    const entityCount = Object.values(entities).filter(value => 
      value !== undefined && value !== null && 
      (Array.isArray(value) ? value.length > 0 : true)
    ).length
    
    score += Math.min(entityCount * 0.05, 0.3)
    
    // 根据变体类型调整分数
    const variantScores: Record<string, number> = {
      'primary': 0.2,
      'creative': 0.1,
      'professional': 0.1,
      'vertical': 0.05
    }
    
    score += variantScores[variant] || 0
    
    // 如果有明确的风格偏好，匹配的方案得分更高
    if (entities.style && variant === entities.style) {
      score += 0.15
    }
    
    // 如果有明确的格式偏好，匹配的方案得分更高
    if (entities.aspectRatio === '9:16' && variant === 'vertical') {
      score += 0.15
    }
    
    return Math.min(score, 1.0)
  }
}