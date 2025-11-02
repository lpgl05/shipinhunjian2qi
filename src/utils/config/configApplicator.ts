/**
 * 配置应用器
 * 负责将对话式智能体生成的配置应用到现有的VideoConfig组件
 */

import type { ConfigSuggestion } from '@/store/conversationalVideo'

export interface VideoConfigData {
  aspectRatio: string
  title: string
  duration: number
  resolution: string
  fps: number
  style: string
  transition: string
  enableSubtitles: boolean
  subtitleStyle: string
  subtitlePosition: string
  subtitleFont: string
  subtitleSticker: string
  voiceType: string
  voiceSpeed: number
}

export class ConfigApplicator {
  /**
   * 将ConfigSuggestion转换为VideoConfig格式
   */
  public static convertSuggestionToConfig(suggestion: ConfigSuggestion): VideoConfigData {
    const { parameters, subtitleConfig, voiceConfig } = suggestion
    
    return {
      // 视频参数
      aspectRatio: parameters.aspectRatio,
      title: parameters.title,
      duration: parameters.duration,
      resolution: parameters.resolution,
      fps: parameters.fps,
      style: parameters.style,
      transition: parameters.transition,
      
      // 字幕配置
      enableSubtitles: subtitleConfig.enabled,
      subtitleStyle: subtitleConfig.style,
      subtitlePosition: subtitleConfig.position,
      subtitleFont: '', // 默认字体
      subtitleSticker: '', // 默认贴纸
      
      // 音频配置
      voiceType: voiceConfig.type,
      voiceSpeed: voiceConfig.speed
    }
  }

  /**
   * 应用配置到目标对象
   */
  public static applyConfigToTarget(config: VideoConfigData, target: any): void {
    Object.keys(config).forEach(key => {
      if (target.hasOwnProperty(key)) {
        target[key] = config[key as keyof VideoConfigData]
      }
    })
  }

  /**
   * 验证配置的有效性
   */
  public static validateConfig(config: VideoConfigData): { valid: boolean; errors: string[] } {
    const errors: string[] = []

    // 验证必填字段
    if (!config.title || config.title.trim() === '') {
      errors.push('视频标题不能为空')
    }

    // 验证数值范围
    if (config.duration < 15 || config.duration > 180) {
      errors.push('视频时长必须在15-180秒之间')
    }

    if (config.voiceSpeed < 0.5 || config.voiceSpeed > 2.0) {
      errors.push('语速必须在0.5-2.0倍之间')
    }

    // 验证枚举值
    const validAspectRatios = ['9:16', '16:9', '1:1']
    if (!validAspectRatios.includes(config.aspectRatio)) {
      errors.push('无效的画面比例')
    }

    const validResolutions = ['480p', '720p', '1080p', '4K']
    if (!validResolutions.includes(config.resolution)) {
      errors.push('无效的分辨率')
    }

    const validFps = [24, 30, 60]
    if (!validFps.includes(config.fps)) {
      errors.push('无效的帧率')
    }

    const validVoiceTypes = ['authoritative', 'calm', 'energetic', 'dramatic']
    if (!validVoiceTypes.includes(config.voiceType)) {
      errors.push('无效的音色类型')
    }

    return {
      valid: errors.length === 0,
      errors
    }
  }

  /**
   * 生成配置摘要
   */
  public static generateConfigSummary(config: VideoConfigData): string {
    const aspectRatioMap: Record<string, string> = {
      '9:16': '竖版',
      '16:9': '横版',
      '1:1': '方形'
    }

    const voiceTypeMap: Record<string, string> = {
      'authoritative': '权威',
      'calm': '平静',
      'energetic': '活力',
      'dramatic': '戏剧'
    }

    const styleMap: Record<string, string> = {
      'modern': '现代',
      'cinematic': '电影',
      'vibrant': '活力',
      'professional': '专业',
      'warm': '温暖',
      'tech': '科技'
    }

    const parts = [
      `${aspectRatioMap[config.aspectRatio] || config.aspectRatio}格式`,
      `${config.duration}秒`,
      `${config.resolution}`,
      `${config.fps}fps`,
      `${styleMap[config.style] || config.style}风格`
    ]

    if (config.enableSubtitles) {
      parts.push('含字幕')
    }

    parts.push(`${voiceTypeMap[config.voiceType] || config.voiceType}音色`)

    return parts.join(' · ')
  }

  /**
   * 比较两个配置的差异
   */
  public static compareConfigs(config1: VideoConfigData, config2: VideoConfigData): string[] {
    const differences: string[] = []

    const fieldLabels: Record<keyof VideoConfigData, string> = {
      aspectRatio: '画面比例',
      title: '视频标题',
      duration: '视频时长',
      resolution: '分辨率',
      fps: '帧率',
      style: '视频风格',
      transition: '转场效果',
      enableSubtitles: '字幕开关',
      subtitleStyle: '字幕样式',
      subtitlePosition: '字幕位置',
      subtitleFont: '字幕字体',
      subtitleSticker: '字幕贴纸',
      voiceType: '音色类型',
      voiceSpeed: '语速'
    }

    Object.keys(fieldLabels).forEach(key => {
      const typedKey = key as keyof VideoConfigData
      if (config1[typedKey] !== config2[typedKey]) {
        differences.push(`${fieldLabels[typedKey]}: ${config1[typedKey]} → ${config2[typedKey]}`)
      }
    })

    return differences
  }

  /**
   * 创建配置的深拷贝
   */
  public static cloneConfig(config: VideoConfigData): VideoConfigData {
    return JSON.parse(JSON.stringify(config))
  }

  /**
   * 合并配置（第二个配置覆盖第一个）
   */
  public static mergeConfigs(baseConfig: VideoConfigData, overrideConfig: Partial<VideoConfigData>): VideoConfigData {
    return {
      ...baseConfig,
      ...overrideConfig
    }
  }
}

// 导出默认配置
export const defaultVideoConfig: VideoConfigData = {
  aspectRatio: '9:16',
  title: '智能生成视频',
  duration: 60,
  resolution: '1080p',
  fps: 30,
  style: 'modern',
  transition: 'fade',
  enableSubtitles: true,
  subtitleStyle: 'modern',
  subtitlePosition: 'bottom',
  subtitleFont: '',
  subtitleSticker: '',
  voiceType: 'authoritative',
  voiceSpeed: 1.0
}