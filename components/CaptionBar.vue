<script setup lang="ts">
defineProps<{
  caption: string
  phase?: string
  isLast?: boolean
  takeaway?: string
  subnote?: string
}>()
</script>

<template>
  <div class="w-full shrink-0 mb-1.5 select-none">
    <!-- Main Active Step Caption -->
    <div
      v-if="!isLast || !takeaway"
      class="bg-slate-900 text-white px-3 py-1.5 rounded-lg shadow border border-slate-700 flex items-center justify-between gap-2 min-h-[38px]"
    >
      <div class="flex items-center gap-2 overflow-hidden flex-1">
        <span class="inline-flex items-center justify-center w-5 h-5 rounded bg-blue-500 text-white font-black text-xs shrink-0">
          ▶
        </span>
        <span class="text-xs font-semibold text-slate-100 truncate">
          {{ caption || 'Press Next / Spacebar to step through the execution' }}
        </span>
      </div>

      <div v-if="phase" class="shrink-0 flex items-center gap-1.5">
        <span
          class="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full tracking-wider border"
          :class="{
            'bg-blue-100 text-blue-900 border-blue-400': phase === 'sync',
            'bg-green-100 text-green-900 border-green-400': phase === 'microtasks',
            'bg-purple-100 text-purple-900 border-purple-400': phase === 'macrotasks',
            'bg-yellow-100 text-yellow-900 border-yellow-400': phase === 'render',
            'bg-red-100 text-red-900 border-red-400': phase === 'blocked',
            'bg-slate-700 text-slate-200 border-slate-500': phase === 'idle'
          }"
        >
          Phase: {{ phase }}
        </span>
      </div>
    </div>

    <!-- Takeaway Banner on last step (Compact single bar replacing caption to save space) -->
    <div
      v-else
      class="bg-amber-100 border-2 border-amber-500 text-amber-950 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center justify-between gap-2 shadow min-h-[38px]"
    >
      <div class="flex items-center gap-2 overflow-hidden">
        <span class="text-base shrink-0">💡</span>
        <span class="truncate"><strong>Key Takeaway:</strong> {{ takeaway }}</span>
      </div>
      <span class="text-[10px] font-mono bg-amber-200 text-amber-900 px-2 py-0.5 rounded shrink-0 font-bold">
        Complete
      </span>
    </div>
  </div>
</template>
