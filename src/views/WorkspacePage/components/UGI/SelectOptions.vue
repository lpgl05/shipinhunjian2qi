<template>
  <div class="select-options">
    <p v-if="title" class="text-sm text-gray-300 mb-3">{{ title }}</p>
    <div class="flex flex-wrap gap-2">
      <button
        v-for="(option, index) in options"
        :key="index"
        class="px-5 py-2.5 bg-gray-700 text-gray-200 text-sm font-medium rounded-lg border border-gray-600 hover:border-blue-500 hover:bg-gray-600 hover:text-blue-400 active:scale-95 transition-all duration-200"
        :class="{ 'border-blue-500 bg-gray-600 text-blue-400': selectedIndex === index }"
        @click="handleSelect(option, index)"
      >
        {{ option }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  options: string[]
  title?: string
}

defineProps<Props>()
const emit = defineEmits<{
  select: [option: string, index: number]
}>()

const selectedIndex = ref<number | null>(null)

const handleSelect = (option: string, index: number) => {
  selectedIndex.value = index
  emit('select', option, index)
}
</script>

