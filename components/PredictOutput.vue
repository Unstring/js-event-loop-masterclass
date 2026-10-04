<script setup lang="ts">
defineProps<{
  prompt?: string
  revealed?: boolean
  answer?: string
  commonMistake?: string
  whatIf?: string
}>()
</script>

<template>
  <div v-if="prompt" class="my-1 shrink-0 transition-all">
    <!-- Question state before reveal -->
    <div
      v-if="!revealed"
      class="bg-amber-100 border-2 border-amber-500 rounded-lg px-2.5 py-1 shadow-xs flex items-center gap-2 animate-pulse"
    >
      <span class="text-base">🛑</span>
      <div class="flex-1 flex items-center justify-between gap-2 overflow-hidden">
        <span class="text-[10px] uppercase font-black text-amber-900 shrink-0">Classroom Prediction:</span>
        <span class="text-xs font-bold text-amber-950 truncate">{{ prompt }}</span>
        <span class="text-[9px] font-mono bg-amber-200 text-amber-900 px-1.5 py-0.2 rounded shrink-0">Think & Answer</span>
      </div>
    </div>

    <!-- Revealed state -->
    <div
      v-else
      class="bg-emerald-50 border-2 border-emerald-600 rounded-lg px-2.5 py-1 shadow-xs flex items-center justify-between gap-2"
    >
      <div class="flex items-center gap-2 overflow-hidden">
        <span class="text-base">✅</span>
        <div class="text-xs font-bold text-emerald-950 font-mono truncate">
          {{ answer || 'Prediction Confirmed!' }}
        </div>
      </div>
      <div v-if="commonMistake" class="text-[10px] font-semibold text-rose-800 bg-rose-100 px-2 py-0.5 rounded border border-rose-300 truncate max-w-xs">
        ⚠️ {{ commonMistake }}
      </div>
    </div>
  </div>
</template>
