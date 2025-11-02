/**
 * 视频意图解析器
 * 负责解析用户的自然语言输入，提取视频制作相关的意图和参数
 */

export interface VideoIntent {
  intent: 'create_video' | 'modify_config' | 'ask_question' | 'upload_material' | 'preview_result'
  confidence: number
  entities: VideoEntities
  context: IntentContext
}

export interface VideoEntities {
  // 基础参数
  duration?: number // 视频时长（秒）
  aspectRatio?: string // 画面比例
  resolution?: string // 分辨率
  fps?: number // 帧率
  
  // 内容相关
  topic?: string // 主题类型
  style?: string // 视频风格
  mood?: string // 情绪基调
  target?: string // 目标受众
  
  // 功能特性
  hasSubtitles?: boolean // 是否需要字幕
  subtitleStyle?: string // 字幕样式
  voiceType?: string // 音色类型
  backgroundMusic?: boolean // 是否需要背景音乐
  musicStyle?: string // 音乐风格
  
  // 转场和效果
  transition?: string // 转场效果
  effects?: string[] // 特效列表
  
  // 平台相关
  platform?: string // 目标平台
  format?: string // 输出格式
  
  // 时间相关
  urgency?: 'low' | 'medium' | 'high' // 紧急程度
  deadline?: Date // 截止时间
}

export interface IntentContext {
  previousIntent?: string // 上一个意图
  conversationStage: 'initial' | 'configuring' | 'refining' | 'finalizing'
  userExperience: 'beginner' | 'intermediate' | 'expert'
  sessionHistory: string[] // 会话历史关键词
}

export class VideoIntentParser {
  private readonly durationPatterns = [
    /(\d+)\s*秒/g,
    /(\d+)\s*分钟/g,
    /时长\s*(\d+)/g,
    /长度\s*(\d+)/g,
    /(\d+)s/gi,
    /(\d+)min/gi
  ]

  private readonly aspectRatioPatterns = [
    { pattern: /竖版|竖屏|抖音|快手|短视频|9:16|9比16/i, value: '9:16' },
    { pattern: /横版|横屏|b站|bilibili|youtube|16:9|16比9/i, value: '16:9' },
    { pattern: /方形|正方形|1:1|1比1/i, value: '1:1' },
    { pattern: /4:3|4比3/i, value: '4:3' }
  ]

  private readonly stylePatterns = [
    { pattern: /现代|简约|极简|clean|modern/i, value: 'modern' },
    { pattern: /电影|大片|cinematic|电影感/i, value: 'cinematic' },
    { pattern: /活力|动感|energetic|vibrant|青春/i, value: 'vibrant' },
    { pattern: /专业|商务|professional|正式/i, value: 'professional' },
    { pattern: /温馨|温暖|cozy|家庭/i, value: 'warm' },
    { pattern: /科技|tech|未来|futuristic/i, value: 'tech' },
    { pattern: /复古|vintage|怀旧|retro/i, value: 'vintage' },
    { pattern: /艺术|artistic|创意|creative/i, value: 'artistic' }
  ]

  private readonly topicPatterns = [
    { pattern: /美食|食物|料理|cooking|food|餐厅|菜谱/i, value: 'food' },
    { pattern: /产品|商品|宣传|推广|marketing|product|广告/i, value: 'product' },
    { pattern: /教程|教学|tutorial|how-to|指南|学习/i, value: 'tutorial' },
    { pattern: /旅游|旅行|travel|景点|风景/i, value: 'travel' },
    { pattern: /健身|运动|fitness|workout|锻炼/i, value: 'fitness' },
    { pattern: /时尚|fashion|穿搭|美妆|化妆/i, value: 'fashion' },
    { pattern: /科技|technology|数码|电子产品/i, value: 'tech' },
    { pattern: /音乐|music|歌曲|演奏|乐器/i, value: 'music' },
    { pattern: /游戏|gaming|电竞|娱乐/i, value: 'gaming' },
    { pattern: /企业|公司|corporate|商业|business/i, value: 'corporate' }
  ]

  private readonly voicePatterns = [
    { pattern: /权威|专业|正式|authoritative|professional/i, value: 'authoritative' },
    { pattern: /平静|温和|calm|gentle|柔和/i, value: 'calm' },
    { pattern: /活力|激情|energetic|passionate|兴奋/i, value: 'energetic' },
    { pattern: /戏剧|dramatic|张力|情感/i, value: 'dramatic' },
    { pattern: /友好|亲切|friendly|warm|温暖/i, value: 'friendly' },
    { pattern: /神秘|mysterious|深沉|低沉/i, value: 'mysterious' }
  ]

  private readonly platformPatterns = [
    { pattern: /抖音|tiktok|douyin/i, value: 'tiktok' },
    { pattern: /快手|kuaishou/i, value: 'kuaishou' },
    { pattern: /b站|bilibili|哔哩哔哩/i, value: 'bilibili' },
    { pattern: /youtube|油管/i, value: 'youtube' },
    { pattern: /微信|wechat|朋友圈/i, value: 'wechat' },
    { pattern: /微博|weibo/i, value: 'weibo' },
    { pattern: /小红书|xiaohongshu/i, value: 'xiaohongshu' }
  ]

  private readonly urgencyPatterns = [
    { pattern: /紧急|急需|马上|立即|urgent|asap/i, value: 'high' as const },
    { pattern: /尽快|较急|soon|快速/i, value: 'medium' as const },
    { pattern: /不急|慢慢来|有时间|no rush/i, value: 'low' as const }
  ]

  /**
   * 解析用户输入的自然语言
   */
  public parseIntent(input: string, context?: Partial<IntentContext>): VideoIntent {
    const normalizedInput = this.normalizeInput(input)
    
    // 确定主要意图
    const intent = this.detectMainIntent(normalizedInput)
    
    // 提取实体信息
    const entities = this.extractEntities(normalizedInput)
    
    // 构建上下文
    const intentContext: IntentContext = {
      conversationStage: 'initial',
      userExperience: 'intermediate',
      sessionHistory: [],
      ...context
    }
    
    // 计算置信度
    const confidence = this.calculateConfidence(intent, entities, normalizedInput)
    
    return {
      intent,
      confidence,
      entities,
      context: intentContext
    }
  }

  /**
   * 标准化输入文本
   */
  private normalizeInput(input: string): string {
    return input
      .toLowerCase()
      .replace(/[，。！？；：""''（）【】]/g, ' ') // 替换中文标点
      .replace(/[,.!?;:"'()\[\]]/g, ' ') // 替换英文标点
      .replace(/\s+/g, ' ') // 合并多个空格
      .trim()
  }

  /**
   * 检测主要意图
   */
  private detectMainIntent(input: string): VideoIntent['intent'] {
    // 修改配置相关
    if (/修改|调整|改变|更改|换成|变成|modify|change|adjust/i.test(input)) {
      return 'modify_config'
    }
    
    // 问题咨询相关
    if (/什么|如何|怎么|为什么|能否|可以|how|what|why|can|could/i.test(input)) {
      return 'ask_question'
    }
    
    // 上传素材相关
    if (/上传|添加|导入|素材|文件|图片|视频|upload|add|import/i.test(input)) {
      return 'upload_material'
    }
    
    // 预览结果相关
    if (/预览|查看|看看|效果|结果|preview|show|display/i.test(input)) {
      return 'preview_result'
    }
    
    // 默认为创建视频
    return 'create_video'
  }

  /**
   * 提取实体信息
   */
  private extractEntities(input: string): VideoEntities {
    const entities: VideoEntities = {}
    
    // 提取时长
    entities.duration = this.extractDuration(input)
    
    // 提取画面比例
    entities.aspectRatio = this.extractAspectRatio(input)
    
    // 提取风格
    entities.style = this.extractStyle(input)
    
    // 提取主题
    entities.topic = this.extractTopic(input)
    
    // 提取音色
    entities.voiceType = this.extractVoiceType(input)
    
    // 提取平台
    entities.platform = this.extractPlatform(input)
    
    // 提取紧急程度
    entities.urgency = this.extractUrgency(input)
    
    // 检测字幕需求
    entities.hasSubtitles = this.detectSubtitleNeed(input)
    
    // 检测背景音乐需求
    entities.backgroundMusic = this.detectBackgroundMusicNeed(input)
    
    // 提取分辨率
    entities.resolution = this.extractResolution(input)
    
    // 提取转场效果
    entities.transition = this.extractTransition(input)
    
    return entities
  }

  /**
   * 提取时长信息
   */
  private extractDuration(input: string): number | undefined {
    for (const pattern of this.durationPatterns) {
      const match = pattern.exec(input)
      if (match) {
        const value = parseInt(match[1])
        // 如果是分钟，转换为秒
        if (pattern.source.includes('分钟') || pattern.source.includes('min')) {
          return value * 60
        }
        return value
      }
    }
    return undefined
  }

  /**
   * 提取画面比例
   */
  private extractAspectRatio(input: string): string | undefined {
    for (const { pattern, value } of this.aspectRatioPatterns) {
      if (pattern.test(input)) {
        return value
      }
    }
    return undefined
  }

  /**
   * 提取风格
   */
  private extractStyle(input: string): string | undefined {
    for (const { pattern, value } of this.stylePatterns) {
      if (pattern.test(input)) {
        return value
      }
    }
    return undefined
  }

  /**
   * 提取主题
   */
  private extractTopic(input: string): string | undefined {
    for (const { pattern, value } of this.topicPatterns) {
      if (pattern.test(input)) {
        return value
      }
    }
    return undefined
  }

  /**
   * 提取音色类型
   */
  private extractVoiceType(input: string): string | undefined {
    for (const { pattern, value } of this.voicePatterns) {
      if (pattern.test(input)) {
        return value
      }
    }
    return undefined
  }

  /**
   * 提取目标平台
   */
  private extractPlatform(input: string): string | undefined {
    for (const { pattern, value } of this.platformPatterns) {
      if (pattern.test(input)) {
        return value
      }
    }
    return undefined
  }

  /**
   * 提取紧急程度
   */
  private extractUrgency(input: string): 'low' | 'medium' | 'high' | undefined {
    for (const { pattern, value } of this.urgencyPatterns) {
      if (pattern.test(input)) {
        return value
      }
    }
    return undefined
  }

  /**
   * 检测字幕需求
   */
  private detectSubtitleNeed(input: string): boolean {
    return /字幕|subtitle|caption|文字|文本/i.test(input)
  }

  /**
   * 检测背景音乐需求
   */
  private detectBackgroundMusicNeed(input: string): boolean {
    return /音乐|背景音|bgm|music|soundtrack|配乐/i.test(input)
  }

  /**
   * 提取分辨率
   */
  private extractResolution(input: string): string | undefined {
    if (/4k|2160p/i.test(input)) return '4K'
    if (/1080p|高清|hd/i.test(input)) return '1080p'
    if (/720p/i.test(input)) return '720p'
    if (/480p/i.test(input)) return '480p'
    return undefined
  }

  /**
   * 提取转场效果
   */
  private extractTransition(input: string): string | undefined {
    if (/淡入淡出|fade/i.test(input)) return 'fade'
    if (/溶解|dissolve/i.test(input)) return 'dissolve'
    if (/滑动|slide/i.test(input)) return 'slide'
    if (/缩放|zoom/i.test(input)) return 'zoom'
    if (/直接|cut|硬切/i.test(input)) return 'cut'
    return undefined
  }

  /**
   * 计算置信度
   */
  private calculateConfidence(
    intent: VideoIntent['intent'], 
    entities: VideoEntities, 
    input: string
  ): number {
    let confidence = 0.5 // 基础置信度
    
    // 根据提取到的实体数量增加置信度
    const entityCount = Object.keys(entities).filter(key => entities[key as keyof VideoEntities] !== undefined).length
    confidence += entityCount * 0.05
    
    // 根据输入长度调整置信度
    const wordCount = input.split(' ').length
    if (wordCount > 5) confidence += 0.1
    if (wordCount > 10) confidence += 0.1
    
    // 根据意图类型调整置信度
    if (intent === 'create_video' && entityCount > 3) confidence += 0.2
    
    // 确保置信度在合理范围内
    return Math.min(0.95, Math.max(0.1, confidence))
  }

  /**
   * 获取建议的后续问题
   */
  public getSuggestedQuestions(entities: VideoEntities): string[] {
    const questions: string[] = []
    
    if (!entities.duration) {
      questions.push('您希望视频时长是多少秒？')
    }
    
    if (!entities.aspectRatio) {
      questions.push('您需要竖版（9:16）还是横版（16:9）格式？')
    }
    
    if (!entities.style) {
      questions.push('您偏好什么风格？（现代简约、电影风格、活力动感等）')
    }
    
    if (entities.hasSubtitles === undefined) {
      questions.push('是否需要添加字幕？')
    }
    
    if (!entities.voiceType) {
      questions.push('您希望使用什么类型的配音？（权威专业、平静温和、活力激情等）')
    }
    
    return questions.slice(0, 3) // 最多返回3个问题
  }
}

// 导出单例实例
export const videoIntentParser = new VideoIntentParser()