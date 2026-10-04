<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  step?: number
}>()

const s = computed(() => props.step ?? 0)

const isStarved = computed(() => s.value >= 2)
</script>

<template>
  <div class="h-full flex flex-col justify-between py-1 select-none overflow-hidden">
    <div class="grid grid-cols-12 gap-2 my-auto items-stretch flex-1 min-h-0">
      <!-- Left: Infinite microtask code -->
      <div class="col-span-5 bg-slate-50 border-2 border-slate-300 rounded-xl p-2.5 flex flex-col justify-between shadow-xs">
        <div>
          <div class="font-extrabold text-[11px] uppercase tracking-wider text-rose-800 mb-1 flex items-center gap-1">
            <span>🔥</span>
            <span>Microtask Starvation Loop</span>
          </div>
          <pre class="bg-white p-2 rounded-lg border border-slate-200 font-mono text-[11px] leading-relaxed text-slate-900 font-bold">
function starve() {
  Promise.resolve().then(starve);
}
starve(); // schedules next microtask recursively!
          </pre>
        </div>

        <div
          class="p-2 rounded-lg border font-bold text-[10px]"
          :class="isStarved ? 'bg-rose-100 border-rose-500 text-rose-950 animate-pulse' : 'bg-slate-100 border-slate-300 text-slate-700'"
        >
          <span v-if="!isStarved">Click Next to trace what happens to the Event Loop...</span>
          <span v-else>⚠️ CRITICAL: Microtask queue NEVER reaches length 0. The engine cannot proceed to Render phase or Macrotasks!</span>
        </div>
      </div>

      <!-- Right: Pipeline status -->
      <div class="col-span-7 bg-white border-2 border-slate-300 rounded-xl p-2.5 flex flex-col justify-between shadow-xs">
        <div class="font-bold text-[11px] uppercase tracking-wider text-slate-700 mb-1.5">
          Browser 60 FPS Frame Pipeline
        </div>

        <div class="space-y-1.5">
          <!-- Microtask drain gate -->
          <div class="bg-green-50 border border-green-500 rounded-lg p-2 flex items-center justify-between text-xs">
            <span class="font-bold text-green-950">1. Microtask Checkpoint: Drain Queue</span>
            <span
              class="font-mono text-[10px] font-black px-1.5 py-0.2 rounded"
              :class="isStarved ? 'bg-rose-600 text-white animate-bounce' : 'bg-green-200 text-green-900'"
            >
              {{ isStarved ? 'TRAPPED IN INFINITE LOOP' : 'Queue Drained' }}
            </span>
          </div>

          <!-- requestAnimationFrame -->
          <div class="bg-yellow-50 border border-yellow-400 rounded-lg p-2 flex items-center justify-between text-xs opacity-80"
            :class="{ 'opacity-30 line-through': isStarved }"
          >
            <span class="font-bold text-yellow-950">2. requestAnimationFrame (rAF)</span>
            <span class="font-mono text-[10px] font-bold bg-yellow-200 text-yellow-900 px-1.5 py-0.2 rounded">
              {{ isStarved ? 'STARVED (Never Called)' : 'Scheduled' }}
            </span>
          </div>

          <!-- Browser Paint -->
          <div class="bg-rose-50 border border-rose-400 rounded-lg p-2 flex items-center justify-between text-xs opacity-80"
            :class="{ 'opacity-30 line-through': isStarved }"
          >
            <span class="font-bold text-rose-950">3. Style, Layout, & Paint (UI Render)</span>
            <span class="font-mono text-[10px] font-bold bg-rose-200 text-rose-900 px-1.5 py-0.2 rounded">
              {{ isStarved ? 'FROZEN / UNRESPONSIVE UI' : 'Painted 60Hz' }}
            </span>
          </div>
        </div>

        <div class="bg-slate-100 p-1.5 rounded-lg text-[10px] font-bold text-slate-800 text-center">
          Difference: `setTimeout` queues a Macrotask, allowing browser to paint between iterations!
        </div>
      </div>
    </div>
  </div>
</template>
