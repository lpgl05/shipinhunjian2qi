<template>
  <div class="waiting-transition flex items-center gap-3 py-2">
    <div class="flex gap-1.5">
      <div class="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style="animation-delay: 0s"></div>
      <div class="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
      <div class="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style="animation-delay: 0.4s"></div>
    </div>
    <span class="text-sm text-gray-300">{{ message }}</span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  message?: string
}>()
</script>

<style scoped>
@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
    opacity: 0.7;
  }
  50% {
    transform: translateY(-8px);
    opacity: 1;
  }
}

.animate-bounce {
  animation: bounce 1.4s ease-in-out infinite;
}
</style>
