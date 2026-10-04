<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  step?: number
  totalSteps?: number
  slideNumber?: number
  totalSlides?: number
}>()

const percent = computed(() => {
  if (!props.totalSteps || props.totalSteps <= 1) return 0
  const curr = props.step ?? 0
  return Math.min(100, Math.round((curr / (props.totalSteps - 1)) * 100))
})
</script>

<template>
  <div class="fixed bottom-0 left-0 right-0 h-1 bg-slate-200 z-50">
    <div
      class="h-full bg-blue-600 transition-all duration-200 ease-out"
      :style="{ width: `${percent}%` }"
    ></div>
  </div>

  <div class="fixed bottom-1 right-2.5 z-40 text-[9px] font-mono font-bold text-slate-500 bg-white/95 px-1.5 py-0.2 rounded border border-slate-300 shadow-xs flex items-center gap-1.5">
    <span v-if="slideNumber">Slide {{ slideNumber }} / {{ totalSlides || 20 }}</span>
    <span v-if="totalSteps" class="text-blue-700">Step {{ (step ?? 0) + 1 }} / {{ totalSteps }}</span>
  </div>
</template>
