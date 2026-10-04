<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  code: string | string[]
  activeLine?: number | number[]
  annotations?: Record<number, string>
  title?: string
}>()

const lines = computed(() => {
  if (Array.isArray(props.code)) return props.code
  return props.code.split('\n')
})

const isLineActive = (lineNum: number) => {
  if (props.activeLine === undefined) return false
  if (Array.isArray(props.activeLine)) {
    return props.activeLine.includes(lineNum)
  }
  return props.activeLine === lineNum
}
</script>

<template>
  <div class="h-full flex flex-col bg-white border-2 border-slate-300 rounded-xl shadow-sm overflow-hidden">
    <!-- Header -->
    <div class="bg-slate-100 px-3 py-1 border-b border-slate-200 flex items-center justify-between shrink-0">
      <div class="flex items-center gap-1.5">
        <span class="w-2 h-2 rounded-full bg-rose-400"></span>
        <span class="w-2 h-2 rounded-full bg-amber-400"></span>
        <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
        <span class="ml-1.5 font-mono font-bold text-[11px] uppercase tracking-wider text-slate-600">
          {{ title || 'Script Execution' }}
        </span>
      </div>
      <div class="text-[10px] font-mono text-slate-400">JavaScript</div>
    </div>

    <!-- Code Body -->
    <div class="flex-1 p-2 overflow-y-auto font-mono text-[12px] leading-[1.45] bg-slate-50/50">
      <div
        v-for="(line, idx) in lines"
        :key="idx"
        class="flex items-center group transition-colors duration-150 rounded px-1.5 py-0.5"
        :class="{
          'bg-amber-100 font-bold border-l-2 border-amber-500 shadow-xs text-slate-950': isLineActive(idx + 1),
          'text-slate-700': !isLineActive(idx + 1)
        }"
      >
        <!-- Arrow Pointer -->
        <span class="w-4 shrink-0 text-amber-600 text-[10px] font-black text-center">
          <span v-if="isLineActive(idx + 1)">▶</span>
        </span>

        <!-- Line Number -->
        <span class="w-5 text-right pr-2 select-none text-slate-400 text-[11px] font-semibold">
          {{ idx + 1 }}
        </span>

        <!-- Line Content -->
        <span class="flex-1 whitespace-pre font-semibold">
          {{ line }}
        </span>

        <!-- Per-line Annotation -->
        <span
          v-if="annotations && annotations[idx + 1]"
          class="ml-2 text-[10px] font-sans font-bold bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded border border-blue-300"
        >
          {{ annotations[idx + 1] }}
        </span>
      </div>
    </div>
  </div>
</template>
