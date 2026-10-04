<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  step?: number
}>()

const s = computed(() => props.step ?? 0)

const activeTopic = computed(() => {
  if (s.value <= 1) return 'minimum'
  if (s.value <= 3) return 'clamping'
  if (s.value <= 5) return 'ordering'
  return 'drift'
})
</script>

<template>
  <div class="h-full flex flex-col justify-between py-1 select-none overflow-hidden">
    <div class="grid grid-cols-12 gap-2 my-auto items-stretch flex-1 min-h-0">
      <!-- Card 1: 4ms Clamping Rule -->
      <div
        class="col-span-6 bg-white border-2 rounded-xl p-3 flex flex-col justify-between shadow-xs transition-all"
        :class="activeTopic === 'clamping' ? 'border-orange-500 ring-2 ring-orange-200 bg-orange-50/50' : 'border-slate-300'"
      >
        <div>
          <div class="flex items-center justify-between pb-1 border-b border-slate-200">
            <span class="font-extrabold text-xs text-slate-900">HTML5 4ms Clamping Rule</span>
            <span class="text-[9px] font-bold bg-orange-100 text-orange-800 px-1.5 py-0.2 rounded">W3C Spec</span>
          </div>

          <p class="text-[11px] text-slate-700 mt-1.5 font-semibold leading-relaxed">
            In browsers, if `setTimeout` calls are nested more than <strong>5 levels deep</strong>, the browser enforces a <strong>minimum delay clamp of 4ms</strong>!
          </p>

          <div class="font-mono text-[10px] bg-slate-100 p-2 rounded-lg border border-slate-300 mt-2 text-slate-800">
            <div>Level 1..4: setTimeout(fn, 0) ➔ ~0-1ms</div>
            <div class="text-orange-600 font-bold">Level 5+: setTimeout(fn, 0) ➔ CLAMPED to 4ms!</div>
          </div>
        </div>

        <div class="text-[10px] bg-orange-100 p-1.5 rounded-lg text-orange-950 font-bold mt-1.5">
          Purpose: Prevents infinite 0ms nested timers from burning 100% CPU on mobile batteries.
        </div>
      </div>

      <!-- Card 2: Multiple Timers Ordering & Expiry -->
      <div
        class="col-span-6 bg-white border-2 rounded-xl p-3 flex flex-col justify-between shadow-xs transition-all"
        :class="activeTopic === 'ordering' ? 'border-purple-500 ring-2 ring-purple-200 bg-purple-50/50' : 'border-slate-300'"
      >
        <div>
          <div class="flex items-center justify-between pb-1 border-b border-slate-200">
            <span class="font-extrabold text-xs text-slate-900">Host Timer Queue Ordering</span>
            <span class="text-[9px] font-bold bg-purple-100 text-purple-800 px-1.5 py-0.2 rounded">Min-Heap</span>
          </div>

          <p class="text-[11px] text-slate-700 mt-1.5 font-semibold leading-relaxed">
            Host Web APIs maintain active timers in a <strong>Min-Heap priority queue</strong> ordered by expiration timestamp:
          </p>

          <div class="space-y-1 font-mono text-[10px] mt-2">
            <div class="bg-purple-100 p-1 rounded-md border border-purple-300 flex justify-between text-purple-950">
              <span>setTimeout(fnA, 50)</span>
              <span class="font-bold">Expires: t + 50ms (First)</span>
            </div>
            <div class="bg-purple-50 p-1 rounded-md border border-purple-200 flex justify-between text-purple-900">
              <span>setTimeout(fnB, 150)</span>
              <span class="font-bold">Expires: t + 150ms (Second)</span>
            </div>
          </div>
        </div>

        <div class="text-[10px] bg-purple-100 p-1.5 rounded-lg text-purple-950 font-bold mt-1.5">
          clearTimeout(id): Deletes timer node from Host Min-Heap before it ever reaches the Macrotask Queue!
        </div>
      </div>
    </div>
  </div>
</template>
