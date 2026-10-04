<script setup lang="ts">
defineProps<{
  isStackEmpty?: boolean
  hasMicrotasks?: boolean
  hasMacrotasks?: boolean
  decision?: string
  question?: string
  isSpinning?: boolean
}>()
</script>

<template>
  <div class="h-full bg-red-50/60 border-2 border-red-500 rounded-xl px-2 py-1 shadow-xs flex items-center justify-between gap-2 overflow-hidden">
    <!-- Spinning Ring Icon -->
    <div class="flex items-center gap-1.5 overflow-hidden">
      <div
        class="w-6 h-6 shrink-0 rounded-full border-2 border-dashed border-red-600 flex items-center justify-center text-red-600 font-bold text-xs"
        :class="{ 'animate-spin': isSpinning, 'animate-ring-pulse': !isSpinning }"
      >
        ↻
      </div>
      <div class="truncate">
        <div class="text-[9px] font-black uppercase tracking-wider text-red-700">Event Loop</div>
        <div class="text-[10px] font-bold text-slate-800 truncate">
          {{ question || 'Continuous Coordinator Tick' }}
        </div>
      </div>
    </div>

    <!-- Questions & Badges -->
    <div class="flex items-center gap-1.5 shrink-0">
      <!-- Stack Empty Badge -->
      <div class="text-center px-1.5 py-0.5 rounded border text-[9px] font-bold"
        :class="isStackEmpty ? 'bg-emerald-100 text-emerald-800 border-emerald-400' : 'bg-rose-100 text-rose-800 border-rose-400'"
      >
        <span>Stack: {{ isStackEmpty ? 'EMPTY' : 'BUSY' }}</span>
      </div>

      <!-- Decision Pill -->
      <div
        v-if="decision"
        class="bg-red-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-lg uppercase tracking-wider shadow-xs animate-pulse truncate max-w-[120px]"
      >
        {{ decision }}
      </div>
    </div>
  </div>
</template>
