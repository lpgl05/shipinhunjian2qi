<template>
  <button
    class="template-button px-4 py-2 bg-gray-800 text-gray-300 text-sm rounded-lg border border-gray-700 hover:border-purple-500 hover:text-purple-400 hover:bg-gray-800/80 transition-all duration-200 flex items-center gap-2"
    @click="handleClick"
  >
    <component v-if="template.icon" :is="template.icon" :size="16" />
    <span>{{ template.name }}</span>
    <span v-if="template.description" class="text-xs text-gray-500">
      {{ template.description }}
    </span>
  </button>
</template>

<script setup lang="ts">
import type { WritingTemplate } from '../store/frontend-config'

interface Props {
  template: WritingTemplate
}

const props = defineProps<Props>()

const emit = defineEmits<{
  select: [template: WritingTemplate]
}>()

const handleClick = () => {
  emit('select', props.template)
}
</script>

<style scoped>
.template-button {
  min-width: fit-content;
}
</style>

