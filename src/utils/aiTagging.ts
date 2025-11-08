/**
 * 阿里云智能标签服务集成
 */

import type { AITag } from '../store/asset'

/**
 * 阿里云智能标签配置
 */
interface AliYunConfig {
  region: string // 地域，目前仅支持 cn-beijing（华北2）和 cn-shanghai（华东2）
  accessKeyId: string
  accessKeySecret: string
  endpoint?: string
}

/**
 * 初始化阿里云配置（从环境变量或配置中读取）
 */
let aliYunConfig: AliYunConfig = {
  region: 'cn-shanghai',
  accessKeyId: '',
  accessKeySecret: ''
}

/**
 * 设置阿里云配置
 */
export const setAliYunConfig = (config: AliYunConfig) => {
  aliYunConfig = config
}

/**
 * 提交智能标签作业
 * @param videoUrl 视频URL（OSS或VOD地址）
 * @param videoId 视频ID
 * @returns 作业ID
 */
export const submitSmartTagJob = async (
  videoUrl: string,
  videoId: string
): Promise<string> => {
  // 这里是模拟的API调用，实际应该调用阿里云的SubmitSmarttagJob接口
  console.log('提交智能标签作业:', { videoUrl, videoId })
  
  // 模拟API调用
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // 返回模拟的作业ID
  return `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * 查询智能标签作业结果
 * @param jobId 作业ID
 * @returns 标签结果
 */
export const querySmartTagJob = async (
  jobId: string
): Promise<AITag[]> => {
  // 这里是模拟的API调用，实际应该调用阿里云的QuerySmarttagJob接口
  console.log('查询智能标签结果:', jobId)
  
  // 模拟API调用
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  // 返回模拟的标签结果
  const mockTags: AITag[] = [
    { name: '商务场景', score: 0.95, category: 'scene' },
    { name: '产品展示', score: 0.88, category: 'action' },
    { name: '室内', score: 0.82, category: 'scene' },
    { name: '演讲', score: 0.75, category: 'action' },
    { name: '会议', score: 0.70, category: 'scene' },
    { name: '演示文稿', score: 0.65, category: 'object' },
    { name: '团队', score: 0.60, category: 'person' }
  ]
  
  return mockTags
}

/**
 * 批量提交智能标签作业
 * @param videoList 视频列表
 */
export const submitBatchSmartTagJobs = async (
  videoList: Array<{ url: string; id: string }>
): Promise<string[]> => {
  const jobIds: string[] = []
  
  for (const video of videoList) {
    try {
      const jobId = await submitSmartTagJob(video.url, video.id)
      jobIds.push(jobId)
    } catch (error) {
      console.error('提交智能标签作业失败:', error)
    }
  }
  
  return jobIds
}

/**
 * 定期查询作业结果（轮询）
 * @param jobId 作业ID
 * @param interval 查询间隔（毫秒）
 * @param maxAttempts 最大尝试次数
 */
export const pollJobResult = async (
  jobId: string,
  interval: number = 3000,
  maxAttempts: number = 20
): Promise<AITag[]> => {
  let attempts = 0
  
  while (attempts < maxAttempts) {
    try {
      const tags = await querySmartTagJob(jobId)
      
      // 如果获取到结果，返回
      if (tags.length > 0) {
        return tags
      }
      
      // 等待后再次查询
      await new Promise(resolve => setTimeout(resolve, interval))
      attempts++
    } catch (error) {
      console.error('查询作业结果失败:', error)
      attempts++
    }
  }
  
  throw new Error('查询作业超时')
}

/**
 * 完整的智能标签流程（提交 -> 轮询 -> 返回结果）
 * @param videoUrl 视频URL
 * @param videoId 视频ID
 */
export const processVideoSmartTag = async (
  videoUrl: string,
  videoId: string
): Promise<AITag[]> => {
  // 1. 提交作业
  const jobId = await submitSmartTagJob(videoUrl, videoId)
  
  // 2. 轮询结果
  const tags = await pollJobResult(jobId)
  
  // 3. 返回标签
  return tags
}

/**
 * 分类标签颜色映射
 */
export const getTagColor = (category: AITag['category']): string => {
  const colorMap: Record<AITag['category'], string> = {
    scene: 'bg-blue-500',
    object: 'bg-green-500',
    person: 'bg-purple-500',
    action: 'bg-orange-500',
    emotion: 'bg-pink-500',
    other: 'bg-gray-500'
  }
  return colorMap[category] || 'bg-gray-500'
}

/**
 * 分类标签中文名称映射
 */
export const getTagCategoryName = (category: AITag['category']): string => {
  const nameMap: Record<AITag['category'], string> = {
    scene: '场景',
    object: '物体',
    person: '人物',
    action: '动作',
    emotion: '情感',
    other: '其他'
  }
  return nameMap[category] || '其他'
}


