/**
 * 高光时刻识别工具
 * 模拟三方接口，用于识别视频中的高光片段
 */

export interface HighlightMoment {
  id: string
  startTime: number // 开始时间（秒）
  endTime: number // 结束时间（秒）
  duration: number // 时长（秒）
  type: 'applause' | 'standing' | 'ppt' | 'goal' | 'save' | 'celebration' | 'key-moment'
  description: string // 描述
  confidence: number // 置信度 0-1
  thumbnail?: string // 缩略图URL
}

export interface HighlightAnalysisResult {
  videoId: string
  videoName: string
  status: 'processing' | 'completed' | 'failed'
  progress: number // 0-100
  moments: HighlightMoment[]
  error?: string
}

/**
 * 模拟高光时刻识别API
 * @param videoUrl 视频URL
 * @param videoId 视频ID
 * @param videoName 视频名称
 * @param onProgress 进度回调
 */
export async function analyzeHighlightMoments(
  videoUrl: string,
  videoId: string,
  videoName: string,
  onProgress?: (progress: number) => void
): Promise<HighlightAnalysisResult> {
  // 模拟异步处理
  return new Promise((resolve) => {
    let progress = 0
    
    // 模拟分析进度
    const interval = setInterval(() => {
      progress += Math.random() * 15
      if (progress > 100) progress = 100
      
      if (onProgress) {
        onProgress(progress)
      }
      
      if (progress >= 100) {
        clearInterval(interval)
        
        // 模拟生成高光片段
        // 根据视频名称判断类型（演讲/球赛）
        const isSpeech = videoName.toLowerCase().includes('演讲') || 
                        videoName.toLowerCase().includes('speech') ||
                        videoName.toLowerCase().includes('presentation')
        const isSports = videoName.toLowerCase().includes('球') || 
                        videoName.toLowerCase().includes('football') ||
                        videoName.toLowerCase().includes('soccer') ||
                        videoName.toLowerCase().includes('match')
        
        const moments = generateMockMoments(isSpeech, isSports)
        
        resolve({
          videoId,
          videoName,
          status: 'completed',
          progress: 100,
          moments
        })
      }
    }, 500)
  })
}

/**
 * 生成模拟的高光片段
 */
function generateMockMoments(isSpeech: boolean, isSports: boolean): HighlightMoment[] {
  const moments: HighlightMoment[] = []
  
  if (isSpeech) {
    // 演讲视频：识别起立、鼓掌、关键PPT展示
    const types: Array<'standing' | 'applause' | 'ppt'> = ['standing', 'applause', 'ppt']
    const descriptions = {
      standing: '观众起立',
      applause: '热烈鼓掌',
      ppt: '关键PPT展示'
    }
    
    // 生成8-12个高光片段（模拟80%识别率）
    const count = Math.floor(Math.random() * 5) + 8
    
    for (let i = 0; i < count; i++) {
      const type = types[Math.floor(Math.random() * types.length)]
      const startTime = Math.random() * 540 + i * 60 // 10分钟内分布
      const duration = 3 + Math.random() * 5 // 3-8秒
      
      moments.push({
        id: `moment-${Date.now()}-${i}`,
        startTime: Math.floor(startTime),
        endTime: Math.floor(startTime + duration),
        duration: Math.floor(duration),
        type,
        description: descriptions[type],
        confidence: 0.8 + Math.random() * 0.2, // 0.8-1.0
        thumbnail: undefined // 使用占位符，避免请求不存在的资源
      })
    }
  } else if (isSports) {
    // 球赛视频：识别进球、关键扑救
    const types: Array<'goal' | 'save' | 'celebration'> = ['goal', 'save', 'celebration']
    const descriptions = {
      goal: '精彩进球',
      save: '关键扑救',
      celebration: '庆祝时刻'
    }
    
    // 生成8-12个高光片段（模拟80%识别率）
    const count = Math.floor(Math.random() * 5) + 8
    
    for (let i = 0; i < count; i++) {
      const type = types[Math.floor(Math.random() * types.length)]
      const startTime = Math.random() * 540 + i * 60 // 10分钟内分布
      const duration = 5 + Math.random() * 10 // 5-15秒
      
      moments.push({
        id: `moment-${Date.now()}-${i}`,
        startTime: Math.floor(startTime),
        endTime: Math.floor(startTime + duration),
        duration: Math.floor(duration),
        type,
        description: descriptions[type],
        confidence: 0.8 + Math.random() * 0.2, // 0.8-1.0
        thumbnail: undefined // 使用占位符，避免请求不存在的资源
      })
    }
  } else {
    // 通用视频：识别关键时刻
    const count = Math.floor(Math.random() * 5) + 5
    
    for (let i = 0; i < count; i++) {
      const startTime = Math.random() * 300 + i * 40
      const duration = 3 + Math.random() * 7
      
      moments.push({
        id: `moment-${Date.now()}-${i}`,
        startTime: Math.floor(startTime),
        endTime: Math.floor(startTime + duration),
        duration: Math.floor(duration),
        type: 'key-moment',
        description: '关键时刻',
        confidence: 0.7 + Math.random() * 0.3,
        thumbnail: undefined // 使用占位符，避免请求不存在的资源
      })
    }
  }
  
  // 按开始时间排序
  return moments.sort((a, b) => a.startTime - b.startTime)
}

/**
 * 批量分析多个视频的高光时刻
 */
export async function analyzeMultipleVideos(
  videos: Array<{ id: string; url: string; name: string }>,
  onProgress?: (videoId: string, progress: number) => void
): Promise<Map<string, HighlightAnalysisResult>> {
  const results = new Map<string, HighlightAnalysisResult>()
  
  // 并行处理所有视频
  const promises = videos.map(video => 
    analyzeHighlightMoments(
      video.url,
      video.id,
      video.name,
      (progress) => {
        if (onProgress) {
          onProgress(video.id, progress)
        }
      }
    ).then(result => {
      results.set(video.id, result)
      return result
    })
  )
  
  await Promise.all(promises)
  return results
}

/**
 * 合成高光片段为新视频
 * @param moments 选中的高光片段
 * @param videoId 源视频ID
 */
export async function mergeHighlightMoments(
  moments: HighlightMoment[],
  videoId: string
): Promise<{ videoId: string; videoUrl: string; duration: number }> {
  // 模拟视频合成过程，直接返回成功
  return new Promise((resolve) => {
    setTimeout(() => {
      const totalDuration = moments.reduce((sum, m) => sum + m.duration, 0)
      
      // 创建一个可以预览的视频URL（使用示例视频）
      // 这里使用一个公开的示例视频URL，实际项目中应该使用真实的视频URL
      const videoUrl = `https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4`
      
      resolve({
        videoId: `highlight-${Date.now()}`,
        videoUrl: videoUrl,
        duration: totalDuration || 30 // 如果时长为0，默认30秒
      })
    }, 2000) // 模拟2秒合成时间
  })
}

/**
 * 格式化时间（秒转 MM:SS）
 */
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

