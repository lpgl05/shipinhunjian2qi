import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Asset {
  id: string
  name: string
  type: 'video' | 'image' | 'audio' | 'other'
  thumbnail?: string
  size: string
  duration?: string
  uploadTime: number
  folderId: string
  tags: string[]
}

export interface Folder {
  id: string
  name: string
  parentId: string | null
  children: Folder[]
}

export const useAssetStore = defineStore('asset', () => {
  const assets = ref<Asset[]>([
    // 示例数据
    {
      id: '1',
      name: '示例视频1.mp4',
      type: 'video',
      size: '12.5 MB',
      duration: '00:30',
      uploadTime: Date.now() - 86400000,
      folderId: 'root',
      tags: ['旅行', '风景']
    },
    {
      id: '2',
      name: '示例视频2.mp4',
      type: 'video',
      size: '8.3 MB',
      duration: '00:15',
      uploadTime: Date.now() - 172800000,
      folderId: 'root',
      tags: ['美食']
    },
    {
      id: '3',
      name: '背景音乐.mp3',
      type: 'audio',
      size: '4.2 MB',
      duration: '03:45',
      uploadTime: Date.now() - 259200000,
      folderId: 'root',
      tags: ['音乐']
    }
  ])

  const folders = ref<Folder[]>([
    {
      id: 'root',
      name: '我的素材',
      parentId: null,
      children: [
        {
          id: 'videos',
          name: '视频',
          parentId: 'root',
          children: []
        },
        {
          id: 'images',
          name: '图片',
          parentId: 'root',
          children: []
        },
        {
          id: 'music',
          name: '音乐',
          parentId: 'root',
          children: []
        }
      ]
    }
  ])

  const selectedFolderId = ref('root')
  const selectedAssetIds = ref<string[]>([])
  const showAssetManager = ref(false)
  const searchQuery = ref('')
  const viewMode = ref<'grid' | 'list'>('grid')

  // 获取当前文件夹的资源
  const currentAssets = computed(() => {
    let filtered = assets.value.filter(asset => 
      selectedFolderId.value === 'root' || asset.folderId === selectedFolderId.value
    )

    if (searchQuery.value) {
      filtered = filtered.filter(asset =>
        asset.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        asset.tags.some(tag => tag.toLowerCase().includes(searchQuery.value.toLowerCase()))
      )
    }

    return filtered
  })

  // 添加资源
  const addAsset = (asset: Asset) => {
    assets.value.unshift(asset)
  }

  // 删除资源
  const deleteAsset = (assetId: string) => {
    const index = assets.value.findIndex(a => a.id === assetId)
    if (index !== -1) {
      assets.value.splice(index, 1)
    }
    selectedAssetIds.value = selectedAssetIds.value.filter(id => id !== assetId)
  }

  // 删除多个资源
  const deleteAssets = (assetIds: string[]) => {
    assets.value = assets.value.filter(a => !assetIds.includes(a.id))
    selectedAssetIds.value = []
  }

  // 选择文件夹
  const selectFolder = (folderId: string) => {
    selectedFolderId.value = folderId
  }

  // 切换资源选择
  const toggleAssetSelection = (assetId: string) => {
    const index = selectedAssetIds.value.indexOf(assetId)
    if (index === -1) {
      selectedAssetIds.value.push(assetId)
    } else {
      selectedAssetIds.value.splice(index, 1)
    }
  }

  // 全选/取消全选
  const toggleSelectAll = () => {
    if (selectedAssetIds.value.length === currentAssets.value.length) {
      selectedAssetIds.value = []
    } else {
      selectedAssetIds.value = currentAssets.value.map(a => a.id)
    }
  }

  // 打开/关闭素材管理器
  const openAssetManager = () => {
    showAssetManager.value = true
  }

  const closeAssetManager = () => {
    showAssetManager.value = false
    selectedAssetIds.value = []
  }

  return {
    assets,
    folders,
    selectedFolderId,
    selectedAssetIds,
    showAssetManager,
    searchQuery,
    viewMode,
    currentAssets,
    addAsset,
    deleteAsset,
    deleteAssets,
    selectFolder,
    toggleAssetSelection,
    toggleSelectAll,
    openAssetManager,
    closeAssetManager
  }
})

