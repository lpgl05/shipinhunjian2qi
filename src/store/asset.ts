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

  // 文件夹管理功能
  const addFolder = (folder: Folder) => {
    if (folder.parentId) {
      // 递归查找父文件夹并添加子文件夹
      const addToParent = (folderList: Folder[], parentId: string): boolean => {
        for (const f of folderList) {
          if (f.id === parentId) {
            if (!f.children) f.children = []
            f.children.push(folder)
            return true
          }
          if (f.children && addToParent(f.children, parentId)) {
            return true
          }
        }
        return false
      }
      addToParent(folders.value, folder.parentId)
    } else {
      folders.value.push(folder)
    }
  }

  const deleteFolder = (folderId: string) => {
    // 递归删除文件夹
    const removeFromParent = (folderList: Folder[]): boolean => {
      for (let i = 0; i < folderList.length; i++) {
        if (folderList[i].id === folderId) {
          // 删除文件夹中的所有资源
          const assetsToDelete = assets.value.filter(asset => asset.folderId === folderId)
          assetsToDelete.forEach(asset => deleteAsset(asset.id))
          
          // 删除文件夹
          folderList.splice(i, 1)
          
          // 如果当前选中的是被删除的文件夹，重置选择
          if (selectedFolderId.value === folderId) {
            selectedFolderId.value = '1' // 默认选择"我的素材"
          }
          return true
        }
        if (folderList[i].children && removeFromParent(folderList[i].children!)) {
          return true
        }
      }
      return false
    }
    removeFromParent(folders.value)
  }

  const renameFolder = (folderId: string, newName: string) => {
    // 递归查找并重命名文件夹
    const findAndRename = (folderList: Folder[]): boolean => {
      for (const folder of folderList) {
        if (folder.id === folderId) {
          folder.name = newName
          return true
        }
        if (folder.children && findAndRename(folder.children)) {
          return true
        }
      }
      return false
    }
    findAndRename(folders.value)
  }

  const getFolderById = (folderId: string): Folder | null => {
    // 递归查找文件夹
    const findFolder = (folderList: Folder[]): Folder | null => {
      for (const folder of folderList) {
        if (folder.id === folderId) {
          return folder
        }
        if (folder.children) {
          const found = findFolder(folder.children)
          if (found) return found
        }
      }
      return null
    }
    return findFolder(folders.value)
  }

  const moveAssetToFolder = (assetId: string, targetFolderId: string | undefined) => {
    const asset = assets.value.find(a => a.id === assetId)
    if (asset) {
      asset.folderId = targetFolderId
    }
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
    clearSelection,
    addFolder,
    deleteFolder,
    renameFolder,
    getFolderById,
    moveAssetToFolder
  }
})