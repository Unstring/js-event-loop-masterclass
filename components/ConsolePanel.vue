<script setup lang="ts">
defineProps<{
  logs?: string[]
}>()
</script>

<template>
  <div class="h-full flex flex-col bg-slate-900 border-2 border-slate-700 rounded-xl shadow-xs overflow-hidden text-slate-100">
    <!-- Header -->
    <div class="bg-slate-800 px-2.5 py-0.5 flex items-center justify-between border-b border-slate-700 shrink-0">
      <div class="flex items-center gap-1 font-mono text-[10px] font-bold text-slate-300">
        <span class="text-emerald-400">❯_</span>
        <span>Console Output</span>
      </div>
      <span class="text-[9px] font-mono text-slate-400">stdout</span>
    </div>

    <!-- Output lines -->
    <div class="flex-1 p-1.5 font-mono text-xs leading-normal overflow-y-auto min-h-0 bg-slate-950/80">
      <div v-if="!logs || logs.length === 0" class="text-slate-600 text-[10px] italic py-0.5">
        ( No logs emitted yet )
      </div>

      <div
        v-for="(line, idx) in logs"
        :key="idx"
        class="flex items-center gap-1.5 py-0.5 border-b border-slate-800/40 text-emerald-400"
      >
        <span class="text-slate-600 select-none text-[10px]">#{{ idx + 1 }}</span>
        <span class="text-slate-400 text-xs">›</span>
        <span class="font-bold text-white text-xs bg-slate-800 px-1.5 py-0.2 rounded border border-slate-700">
          {{ line }}
        </span>
      </div>
    </div>
  </div>
</template>
