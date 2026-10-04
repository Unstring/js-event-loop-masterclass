<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  step?: number
}>()

const s = computed(() => props.step ?? 0)

const activeBranch = computed(() => {
  if (s.value <= 1) return 'chain'
  if (s.value <= 3) return 'error'
  return 'combinators'
})
</script>

<template>
  <div class="h-full flex flex-col justify-between py-1 select-none overflow-hidden">
    <!-- Header -->
    <div class="bg-slate-900 text-white px-3 py-1.5 rounded-lg flex items-center justify-between border border-slate-700 shrink-0">
      <div class="flex items-center gap-1.5">
        <span class="text-[9px] uppercase font-bold px-1.5 py-0.2 rounded bg-emerald-600">Internals</span>
        <span class="font-bold text-xs">Chaining Mechanics & Static Combinators</span>
      </div>
      <span class="text-[10px] font-mono font-bold text-emerald-300">
        {{ activeBranch === 'chain' ? 'Chain Step 1-2' : activeBranch === 'error' ? 'Error Propagation' : 'Combinators' }}
      </span>
    </div>

    <!-- Main Comparison -->
    <div class="grid grid-cols-12 gap-2 my-auto flex-1 items-stretch min-h-0">
      <!-- Left: Chaining Sequence -->
      <div class="col-span-6 bg-green-50/50 border-2 border-green-500 rounded-xl p-2.5 flex flex-col justify-between shadow-xs">
        <div>
          <div class="font-bold text-[11px] uppercase tracking-wider text-green-950 mb-1">
            Every .then() returns a Brand New Promise
          </div>

          <div class="space-y-1 mt-1.5">
            <!-- P1 -->
            <div class="bg-white border border-green-300 rounded-lg p-1.5 shadow-xs flex items-center justify-between">
              <span class="font-mono text-[11px] font-black text-green-950">Promise 1 (Initial)</span>
              <span class="text-[9px] bg-green-100 text-green-800 font-bold px-1.5 py-0.2 rounded">Resolves: 10</span>
            </div>
            <div class="text-center font-bold text-[10px] text-green-600">▼ .then(x => x * 2)</div>

            <!-- P2 -->
            <div class="bg-white border border-green-400 rounded-lg p-1.5 shadow-xs flex items-center justify-between">
              <span class="font-mono text-[11px] font-black text-green-950">Promise 2 (New Promise)</span>
              <span class="text-[9px] bg-green-200 text-green-900 font-bold px-1.5 py-0.2 rounded">Resolves: 20</span>
            </div>
            <div class="text-center font-bold text-[10px] text-green-600">▼ .then(x => x + 5)</div>

            <!-- P3 -->
            <div class="bg-white border border-green-500 rounded-lg p-1.5 shadow-xs flex items-center justify-between">
              <span class="font-mono text-[11px] font-black text-green-950">Promise 3 (Final Chain)</span>
              <span class="text-[9px] bg-green-300 text-green-950 font-bold px-1.5 py-0.2 rounded">Resolves: 25</span>
            </div>
          </div>
        </div>

        <div class="text-[10px] bg-green-100 text-green-950 p-1.5 rounded-lg border border-green-300 font-bold">
          If a handler throws an Error, intermediate .then() handlers are skipped until reaching .catch()!
        </div>
      </div>

      <!-- Right: Static Combinators Matrix -->
      <div class="col-span-6 bg-slate-50 border-2 border-slate-300 rounded-xl p-2.5 flex flex-col justify-between shadow-xs">
        <div class="font-bold text-[11px] uppercase tracking-wider text-slate-800 mb-1">
          Static Promise Combinators (ES2020+)
        </div>

        <div class="space-y-1 text-xs font-sans">
          <!-- Promise.all -->
          <div class="bg-white border border-blue-300 p-1.5 rounded-lg flex items-center justify-between shadow-xs">
            <span class="font-mono font-bold text-[11px] text-blue-900">Promise.all([p1, p2])</span>
            <span class="text-[9px] font-semibold text-slate-700 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">
              Fails on first reject
            </span>
          </div>

          <!-- Promise.allSettled -->
          <div class="bg-white border border-purple-300 p-1.5 rounded-lg flex items-center justify-between shadow-xs">
            <span class="font-mono font-bold text-[11px] text-purple-900">Promise.allSettled([p1, p2])</span>
            <span class="text-[9px] font-semibold text-slate-700 bg-purple-50 px-1.5 py-0.2 rounded border border-purple-200">
              Waits for ALL (never rejects)
            </span>
          </div>

          <!-- Promise.race -->
          <div class="bg-white border border-amber-300 p-1.5 rounded-lg flex items-center justify-between shadow-xs">
            <span class="font-mono font-bold text-[11px] text-amber-900">Promise.race([p1, p2])</span>
            <span class="text-[9px] font-semibold text-slate-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
              First to settle wins
            </span>
          </div>

          <!-- Promise.any -->
          <div class="bg-white border border-emerald-300 p-1.5 rounded-lg flex items-center justify-between shadow-xs">
            <span class="font-mono font-bold text-[11px] text-emerald-900">Promise.any([p1, p2])</span>
            <span class="text-[9px] font-semibold text-slate-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
              First fulfilled wins
            </span>
          </div>
        </div>

        <div class="text-[10px] bg-slate-200/90 text-slate-900 p-1.5 rounded-lg font-bold">
          All combinator callbacks resolve asynchronously as microtasks!
        </div>
      </div>
    </div>
  </div>
</template>
