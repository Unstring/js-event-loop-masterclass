<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  step?: number
}>()

const activeNode = computed(() => {
  const s = (props.step ?? 0) % 5
  return ['task', 'microtasks', 'render', 'macrotask', 'check'][s]
})
</script>

<template>
  <div class="h-full flex flex-col justify-between py-1 select-none overflow-hidden">
    <!-- Flowchart Container -->
    <div class="grid grid-cols-5 gap-2 my-auto items-center">
      <!-- Step 1: Run Synchronous / Macrotask -->
      <div
        class="bg-blue-50 border-2 rounded-xl p-2.5 flex flex-col items-center text-center shadow-xs transition-all"
        :class="activeNode === 'task' ? 'border-blue-600 ring-2 ring-blue-300 bg-blue-100 scale-102' : 'border-blue-300'"
      >
        <span class="w-6 h-6 rounded-full bg-blue-600 text-white font-black flex items-center justify-center text-xs mb-1">1</span>
        <div class="font-extrabold text-[11px] text-blue-950">Run Current Task</div>
        <div class="text-[9px] text-blue-800 font-semibold mt-1">Execute synchronous script or 1 macrotask until Stack is empty.</div>
      </div>

      <!-- Arrow -->
      <div class="text-center font-black text-xl text-slate-400">➔</div>

      <!-- Step 2: Drain ALL Microtasks -->
      <div
        class="bg-green-50 border-2 rounded-xl p-2.5 flex flex-col items-center text-center shadow-xs transition-all"
        :class="activeNode === 'microtasks' ? 'border-green-600 ring-2 ring-green-300 bg-green-100 scale-102' : 'border-green-300'"
      >
        <span class="w-6 h-6 rounded-full bg-green-600 text-white font-black flex items-center justify-center text-xs mb-1">2</span>
        <div class="font-extrabold text-[11px] text-green-950">Drain Microtasks</div>
        <div class="text-[9px] text-green-800 font-semibold mt-1">Run ALL microtasks. If microtasks schedule more, keep draining!</div>
      </div>

      <!-- Arrow -->
      <div class="text-center font-black text-xl text-slate-400">➔</div>

      <!-- Step 3: Render Opportunity (Browser) -->
      <div
        class="bg-yellow-50 border-2 rounded-xl p-2.5 flex flex-col items-center text-center shadow-xs transition-all"
        :class="activeNode === 'render' ? 'border-yellow-600 ring-2 ring-yellow-300 bg-yellow-100 scale-102' : 'border-yellow-300'"
      >
        <span class="w-6 h-6 rounded-full bg-yellow-600 text-white font-black flex items-center justify-center text-xs mb-1">3</span>
        <div class="font-extrabold text-[11px] text-yellow-950">Render Phase?</div>
        <div class="text-[9px] text-yellow-800 font-semibold mt-1">If 16.6ms (60Hz): run rAF, recalculate style, layout, paint!</div>
      </div>
    </div>

    <!-- Algorithm loop returning arrow -->
    <div class="bg-red-50 border-2 border-red-500 rounded-xl p-2 text-red-950 flex items-center justify-between shadow-xs shrink-0">
      <div class="flex items-center gap-2">
        <span class="text-lg animate-spin">↻</span>
        <div>
          <span class="font-black text-xs uppercase">Step 4: Pick Next Macrotask</span>
          <p class="text-[10px] font-semibold text-red-900 leading-tight">
            Event loop queries Macrotask Queue: take OLDEST task (FIFO), push to Call Stack, and repeat cycle!
          </p>
        </div>
      </div>
      <div class="bg-red-600 text-white font-mono font-bold text-[10px] px-2 py-0.5 rounded-lg shrink-0">
        Continuous Tick
      </div>
    </div>
  </div>
</template>
