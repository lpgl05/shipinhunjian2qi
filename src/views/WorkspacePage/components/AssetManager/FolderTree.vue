<template>
  <div class="folder-tree">
    <div
      class="folder-item flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all"
      :class="[
        selectedId === folder.id 
          ? 'bg-blue-500/20 text-blue-400' 
          : 'text-gray-400 hover:bg-gray-700 hover:text-gray-200'
      ]"
      @click="handleSelect"
    >
      <ChevronRight 
        v-if="folder.children && folder.children.length > 0"
        :size="16" 
        class="transition-transform"
        :class="{ 'rotate-90': isExpanded }"
        @click.stop="isExpanded = !isExpanded"
      />
      <span v-else class="w-4"></span>
      
      <FolderIcon :size="18" />
      <span class="text-sm font-medium flex-1">{{ folder.name }}</span>
      
      <span v-if="folder.id === selectedId" class="text-xs opacity-50">
        ✓
      </span>
    </div>

    <!-- 子文件夹 -->
    <div v-if="isExpanded && folder.children && folder.children.length > 0" class="ml-4 mt-1 space-y-1">
      <FolderTree
        v-for="child in folder.children"
        :key="child.id"
        :folder="child"
        :selected-id="selectedId"
        @select="$emit('select', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Folder as FolderIcon, ChevronRight } from 'lucide-vue-next'
import type { Folder } from '../../../../store/asset'

interface Props {
  folder: Folder
  selectedId: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  select: [folderId: string]
}>()

const isExpanded = ref(true)

const handleSelect = () => {
  emit('select', props.folder.id)
}
</script>

