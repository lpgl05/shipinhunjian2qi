import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Asset {
  id: string
  name: string
  type: 'image' | 'video' | 'audio' | 'document'
  size: number
  url: string
  thumbnail?: string
  uploadTime: string
  folderId?: string
  duration?: string
  tags: string[]
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
  const selectedFolderId = ref<string | null>(null)
  const viewMode = ref<'grid' | 'list'>('grid')
  const searchQuery = ref('')
  
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
      folderId: '2',
      duration: '2:30',
      tags: ['产品展示', '营销视频']
    },
    {
      id: '2',
      name: 'sample-image-1.jpg',
      type: 'image',
      size: 512000,
      url: '/assets/sample-image-1.jpg',
      thumbnail: '/assets/thumbnails/image-1.jpg',
      uploadTime: '2024-01-15 11:00:00',
      folderId: '3',
      tags: ['品牌素材', '宣传图']
    }
  ])

  // 计算属性
  const currentAssets = computed(() => {
    let filteredAssets = assets.value.filter(asset => asset.folderId === selectedFolderId.value)
    
    if (searchQuery.value) {
      filteredAssets = filteredAssets.filter(asset => 
        asset.name.toLowerCase().includes(searchQuery.value.toLowerCase())
      )
    }
    
    return filteredAssets
  })

  const selectedAssetIds = computed(() => selectedAssets.value)

  const toggleAssetManager = () => {
    showAssetManager.value = !showAssetManager.value
  }

  const closeAssetManager = () => {
    showAssetManager.value = false
  }

  const setCurrentFolder = (folderId: string | null) => {
    currentFolder.value = folderId
  }

  const selectFolder = (folderId: string) => {
    selectedFolderId.value = folderId
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

  const toggleAssetSelection = (assetId: string) => {
    selectAsset(assetId)
  }

  const toggleSelectAll = () => {
    if (selectedAssets.value.length === currentAssets.value.length) {
      selectedAssets.value = []
    } else {
      selectedAssets.value = currentAssets.value.map(asset => asset.id)
    }
  }

  const deleteAsset = (assetId: string) => {
    const index = assets.value.findIndex(asset => asset.id === assetId)
    if (index !== -1) {
      assets.value.splice(index, 1)
      // 从选中列表中移除
      const selectedIndex = selectedAssets.value.indexOf(assetId)
      if (selectedIndex !== -1) {
        selectedAssets.value.splice(selectedIndex, 1)
      }
    }
  }

  const deleteAssets = (assetIds: string[]) => {
    assetIds.forEach((assetId: string) => {
      deleteAsset(assetId)
    })
  }

  const clearSelection = () => {
    selectedAssets.value = []
  }

  return {
    showAssetManager,
    currentFolder,
    selectedAssets,
    selectedFolderId,
    viewMode,
    searchQuery,
    folders,
    assets,
    currentAssets,
    selectedAssetIds,
    toggleAssetManager,
    closeAssetManager,
    setCurrentFolder,
    selectFolder,
    getCurrentAssets,
    selectAsset,
    toggleAssetSelection,
    toggleSelectAll,
    deleteAsset,
    deleteAssets,
    clearSelection
  }
})