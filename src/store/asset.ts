import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface Asset {
  id: string
  name: string
  type: 'image' | 'video' | 'audio' | 'document'
  size: number
  url: string
  thumbnail?: string
  uploadTime: string
  folderId?: string
}

export interface Folder {
  id: string
  name: string
  parentId?: string
  children?: Folder[]
  assets?: Asset[]
}

export const useAssetStore = defineStore('asset', () => {
  const showAssetManager = ref(false)
  const currentFolder = ref<string | null>(null)
  const selectedAssets = ref<string[]>([])
  
  // 示例文件夹结构
  const folders = ref<Folder[]>([
    {
      id: '1',
      name: '我的素材',
      children: [
        {
          id: '2',
          name: '视频素材',
          parentId: '1',
          children: [],
          assets: []
        },
        {
          id: '3',
          name: '图片素材',
          parentId: '1',
          children: [],
          assets: []
        },
        {
          id: '4',
          name: '音频素材',
          parentId: '1',
          children: [],
          assets: []
        }
      ]
    }
  ])

  // 示例素材数据
  const assets = ref<Asset[]>([
    {
      id: '1',
      name: 'sample-video-1.mp4',
      type: 'video',
      size: 1024000,
      url: '/assets/sample-video-1.mp4',
      thumbnail: '/assets/thumbnails/video-1.jpg',
      uploadTime: '2024-01-15 10:30:00',
      folderId: '2'
    },
    {
      id: '2',
      name: 'sample-image-1.jpg',
      type: 'image',
      size: 512000,
      url: '/assets/sample-image-1.jpg',
      thumbnail: '/assets/thumbnails/image-1.jpg',
      uploadTime: '2024-01-15 11:00:00',
      folderId: '3'
    }
  ])

  const toggleAssetManager = () => {
    showAssetManager.value = !showAssetManager.value
  }

  const setCurrentFolder = (folderId: string | null) => {
    currentFolder.value = folderId
  }

  const getCurrentAssets = () => {
    return assets.value.filter(asset => asset.folderId === currentFolder.value)
  }

  const selectAsset = (assetId: string) => {
    const index = selectedAssets.value.indexOf(assetId)
    if (index > -1) {
      selectedAssets.value.splice(index, 1)
    } else {
      selectedAssets.value.push(assetId)
    }
  }

  const clearSelection = () => {
    selectedAssets.value = []
  }

  return {
    showAssetManager,
    currentFolder,
    selectedAssets,
    folders,
    assets,
    toggleAssetManager,
    setCurrentFolder,
    getCurrentAssets,
    selectAsset,
    clearSelection
  }
})