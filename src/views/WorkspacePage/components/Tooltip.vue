<template>
  <div class="tooltip-container relative">
    <div 
      @mouseenter="showTooltip = true"
      @mouseleave="showTooltip = false"
    >
      <slot />
    </div>

    <!-- Tooltip -->
    <Transition name="tooltip">
      <div 
        v-if="showTooltip"
        class="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-3 py-2 bg-gray-700 text-gray-50 text-sm rounded-lg whitespace-nowrap pointer-events-none z-50 shadow-lg"
      >
        {{ text }}
        <!-- Arrow -->
        <div class="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-700"></div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  text: string
}

defineProps<Props>()

const showTooltip = ref(false)
</script>

<style scoped>
.tooltip-enter-active,
.tooltip-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.tooltip-enter-from,
.tooltip-leave-to {
  opacity: 0;
  transform: translateY(-50%) translateX(-4px);
}

.tooltip-enter-to,
.tooltip-leave-from {
  opacity: 1;
  transform: translateY(-50%) translateX(0);
}
</style>

