<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div class="bg-gray-800 rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
      <div class="flex items-center justify-between p-4 border-b border-gray-700">
        <h3 class="text-xl font-semibold text-gray-50">模板库</h3>
        <button class="text-gray-400 hover:text-gray-50" @click="$emit('close')">×</button>
      </div>
      <div class="flex-1 overflow-y-auto p-4">
        <div class="grid grid-cols-3 gap-4">
          <div v-for="t in templates" :key="t.id" class="bg-gray-700 rounded-lg p-4 cursor-pointer hover:bg-gray-600" @click="$emit('select', t)">
            <h4 class="font-medium text-gray-50">{{ t.name }}</h4>
            <p class="text-sm text-gray-400 mt-1">{{ t.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{ close: [], select: [t: any] }>()
const templates = [
  { id: '1', name: '产品宣传', description: '适合产品展示' },
  { id: '2', name: '社媒营销', description: '适合社交媒体' },
  { id: '3', name: '活动推广', description: '适合活动宣传' }
]
</script>
