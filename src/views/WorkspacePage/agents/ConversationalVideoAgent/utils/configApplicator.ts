import type { ConfigSuggestion } from '@/store/conversationalVideo'

/**
 * 默认视频配置
 */
export const defaultVideoConfig = {
  title: '新视频项目',
  duration: 30,
  resolution: '1080p',
  fps: 30,
  aspectRatio: '16:9',
  style: 'modern',
  transition: 'fade',
  subtitles: {
    enabled: false,
    style: 'default',
    position: 'bottom'
  },
  voice: {
    type: 'female',
    speed: 1.0,
    volume: 0.8
  }
}

/**
 * 视频格式映射
 */
export const aspectRatioMap = {
  '16:9': { width: 1920, height: 1080, label: '横版视频' },
  '9:16': { width: 1080, height: 1920, label: '竖版视频' },
  '1:1': { width: 1080, height: 1080, label: '方形视频' },
  '4:3': { width: 1440, height: 1080, label: '传统比例' }
}

/**
 * 视频风格映射
 */
export const styleMap = {
  'modern': { label: '现代简约', description: '简洁明快的现代风格' },
  'vintage': { label: '复古怀旧', description: '温暖的复古色调' },
  'professional': { label: '商务专业', description: '正式的商务风格' },
  'creative': { label: '创意艺术', description: '富有创意的艺术风格' },
  'minimal': { label: '极简主义', description: '简约的极简设计' }
}

/**
 * 转场效果映射
 */
export const transitionMap = {
  'fade': { label: '淡入淡出', description: '平滑的淡入淡出效果' },
  'slide': { label: '滑动切换', description: '左右滑动切换效果' },
  'zoom': { label: '缩放切换', description: '缩放进出切换效果' },
  'dissolve': { label: '溶解效果', description: '画面溶解切换效果' },
  'wipe': { label: '擦除效果', description: '擦除式切换效果' }
}

/**
 * 音色类型映射
 */
export const voiceTypeMap = {
  'female': { label: '女声', description: '温柔的女性声音' },
  'male': { label: '男声', description: '沉稳的男性声音' },
  'child': { label: '童声', description: '活泼的儿童声音' },
  'elderly': { label: '老年', description: '慈祥的老年声音' },
  'robot': { label: '机器人', description: '科技感的机器声音' }
}

/**
 * 应用配置建议到视频配置
 */
export function applyConfigSuggestion(suggestion: ConfigSuggestion) {
  const config = { ...defaultVideoConfig }
  
  // 应用视频参数
  if (suggestion.videoTemplate) {
    Object.assign(config, suggestion.videoTemplate)
  }
  
  // 应用基础参数
  if (suggestion.parameters) {
    Object.assign(config, suggestion.parameters)
  }
  
  // 应用字幕配置
  if (suggestion.subtitleConfig) {
    config.subtitles = { ...config.subtitles, ...suggestion.subtitleConfig }
  }
  
  // 应用音色配置
  if (suggestion.voiceConfig) {
    config.voice = { ...config.voice, ...suggestion.voiceConfig }
  }
  
  return config
}

/**
 * 验证配置的有效性
 */
export function validateConfig(config: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = []
  
  // 验证时长
  if (!config.duration || config.duration < 5 || config.duration > 300) {
    errors.push('视频时长必须在5-300秒之间')
  }
  
  // 验证分辨率
  const validResolutions = ['720p', '1080p', '1440p', '4K']
  if (!validResolutions.includes(config.resolution)) {
    errors.push('无效的分辨率设置')
  }
  
  // 验证宽高比
  if (!aspectRatioMap[config.aspectRatio as keyof typeof aspectRatioMap]) {
    errors.push('无效的宽高比设置')
  }
  
  // 验证帧率
  const validFps = [24, 25, 30, 50, 60]
  if (!validFps.includes(config.fps)) {
    errors.push('无效的帧率设置')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * 格式化配置为显示文本
 */
export function formatConfigForDisplay(config: any): string {
  const parts = []
  
  if (config.duration) {
    parts.push(`时长: ${config.duration}秒`)
  }
  
  if (config.aspectRatio && aspectRatioMap[config.aspectRatio as keyof typeof aspectRatioMap]) {
    parts.push(`格式: ${aspectRatioMap[config.aspectRatio as keyof typeof aspectRatioMap].label}`)
  }
  
  if (config.resolution) {
    parts.push(`分辨率: ${config.resolution}`)
  }
  
  if (config.style && styleMap[config.style as keyof typeof styleMap]) {
    parts.push(`风格: ${styleMap[config.style as keyof typeof styleMap].label}`)
  }
  
  if (config.subtitles?.enabled) {
    parts.push('包含字幕')
  }
  
  if (config.voice?.type && voiceTypeMap[config.voice.type as keyof typeof voiceTypeMap]) {
    parts.push(`配音: ${voiceTypeMap[config.voice.type as keyof typeof voiceTypeMap].label}`)
  }
  
  return parts.join(' | ')
}