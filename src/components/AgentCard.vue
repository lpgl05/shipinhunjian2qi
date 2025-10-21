<template>
  <div 
    class="agent-card group relative p-8 bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 cursor-pointer transition-all duration-300 hover:border-gray-600 hover:-translate-y-2 hover:shadow-2xl"
    :class="[`hover:shadow-${gradient.split(' ')[0].replace('from-', '')}/20`]"
    @click="$emit('click')"
  >
    <!-- Badge -->
    <div 
      v-if="badge" 
      class="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full"
    >
      {{ badge }}
    </div>

    <!-- Icon -->
    <div 
      class="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110 bg-gradient-to-r"
      :class="gradient"
    >
      <component :is="iconComponent" :size="32" class="text-white" />
    </div>

    <!-- Content -->
    <h3 class="text-xl font-bold mb-3 text-gray-50 group-hover:text-blue-400 transition-colors">
      {{ title }}
    </h3>
    <p class="text-gray-400 leading-relaxed">
      {{ description }}
    </p>

    <!-- Hover Effect -->
    <div class="absolute inset-0 rounded-2xl bg-gradient-to-r opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none" :class="gradient"></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { 
  Scissors, 
  Type, 
  Share2, 
  Wand2, 
  BarChart3, 
  Target 
} from 'lucide-vue-next'

interface Props {
  icon: string
  title: string
  description: string
  badge?: string
  gradient?: string
}

const props = withDefaults(defineProps<Props>(), {
  gradient: 'from-blue-500 to-violet-500'
})

defineEmits<{
  click: []
}>()

// Map icon name to component
const iconComponent = computed(() => {
  const iconMap: Record<string, any> = {
    'Scissors': Scissors,
    'Type': Type,
    'Share2': Share2,
    'Wand2': Wand2,
    'BarChart3': BarChart3,
    'Target': Target
  }
  return iconMap[props.icon] || Scissors
})
</script>

<style scoped>
.agent-card {
  position: relative;
  overflow: hidden;
}

.agent-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, transparent 0%, rgba(59, 130, 246, 0.05) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.agent-card:hover::before {
  opacity: 1;
}
</style>
