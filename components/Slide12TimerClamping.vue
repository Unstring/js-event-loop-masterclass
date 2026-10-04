<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    step?: number
  }>(),
  {
    step: 0
  }
)

interface Step {
  depth: number
  requestedDelay: number
  actualDelay: number
  isClamped: boolean
  tabState: 'active' | 'background'
  action: string
  note: string
}

const steps: Step[] = [
  { depth: 1, requestedDelay: 0, actualDelay: 0, isClamped: false, tabState: 'active', action: "1. Level 1: setTimeout(fn, 0) invoked", note: "Allowed with raw 0ms requested delay." },
  { depth: 2, requestedDelay: 0, actualDelay: 0, isClamped: false, tabState: 'active', action: "2. Level 2: Inside fn(), calls setTimeout(fn, 0)", note: "Nesting depth increases to 2. Allowed without clamp." },
  { depth: 3, requestedDelay: 0, actualDelay: 0, isClamped: false, tabState: 'active', action: "3. Level 3: Inside nested timer, calls setTimeout(fn, 0)", note: "Nesting depth increases to 3. Allowed without clamp." },
  { depth: 4, requestedDelay: 0, actualDelay: 0, isClamped: false, tabState: 'active', action: "4. Level 4: Calls setTimeout(fn, 0)", note: "Nesting depth 4: Final tier before HTML5 clamping kicks in!" },
  { depth: 5, requestedDelay: 0, actualDelay: 4, isClamped: true, tabState: 'active', action: "5. Level 5! CLAMPED: 0ms forced to 4ms MINIMUM!", note: "HTML5 Living Standard: Depth >= 5 clamped to min 4ms." },
  { depth: 6, requestedDelay: 1, actualDelay: 4, isClamped: true, tabState: 'active', action: "6. Level 6: Requested 1ms delay -> Clamped to 4ms", note: "Any requested delay < 4ms is forcibly overridden to 4ms." },
  { depth: 10, requestedDelay: 2, actualDelay: 4, isClamped: true, tabState: 'active', action: "7. Level 10: Deep recursive timers strictly capped at 250Hz", note: "Max frequency for nested timers is 1000ms / 4ms = 250 calls/sec." },
  { depth: 1, requestedDelay: 0, actualDelay: 0, isClamped: false, tabState: 'active', action: "8. Why was the 4ms rule created?", note: "Historical reasons: Prevent runaway loops from pinning CPU at 100%!" },
  { depth: 1, requestedDelay: 0, actualDelay: 0, isClamped: false, tabState: 'active', action: "9. Legacy animations used setTimeout(fn, 10)", note: "Caused laptop batteries to drain and browser to overheat." },
  { depth: 1, requestedDelay: 0, actualDelay: 16.6, isClamped: false, tabState: 'active', action: "10. Modern Solution: requestAnimationFrame", note: "rAF syncs directly with display refresh rate (60Hz / 120Hz)!" },
  { depth: 1, requestedDelay: 10, actualDelay: 1000, isClamped: true, tabState: 'background', action: "11. Background Tab Throttling: User switches tabs!", note: "Browser detects tab visibility change (document.hidden = true)." },
  { depth: 1, requestedDelay: 10, actualDelay: 1000, isClamped: true, tabState: 'background', action: "12. Inactive Tab Clamp: Timers throttled to >= 1000ms!", note: "All timers in background tabs fire at most ONCE per second." },
  { depth: 1, requestedDelay: 10, actualDelay: 1000, isClamped: true, tabState: 'background', action: "13. Chrome & Safari Budget Throttling", note: "CPU time allocated to background tabs capped to 1% per second." },
  { depth: 1, requestedDelay: 10, actualDelay: 10, isClamped: false, tabState: 'active', action: "14. User returns to tab: document.hidden = false", note: "Normal timer scheduling immediately restored!" },
  { depth: 1, requestedDelay: 0, actualDelay: 0, isClamped: false, tabState: 'active', action: "15. What if you NEED precise background timers?", note: "Example: Music players, timers, audio synth, stopwatches." },
  { depth: 1, requestedDelay: 0, actualDelay: 0, isClamped: false, tabState: 'active', action: "16. Solution: Web Workers or Web Audio API", note: "Dedicated worker threads are not subject to tab throttling." },
  { depth: 1, requestedDelay: 0, actualDelay: 0, isClamped: false, tabState: 'active', action: "17. Clock Jitter & OS Interrupt latency", note: "Timers will always experience 1-3ms jitter based on OS scheduler." },
  { depth: 1, requestedDelay: 0, actualDelay: 0, isClamped: false, tabState: 'active', action: "18. Never use setTimeout for game physics clocks", note: "Use performance.now() delta timing for reliable simulations." },
  { depth: 0, requestedDelay: 0, actualDelay: 0, isClamped: false, tabState: 'active', action: "19. Summary: 4ms nested clamp + 1000ms tab clamp", note: "The two pillars of timer throttling in modern web browsers." },
  { depth: 0, requestedDelay: 0, actualDelay: 0, isClamped: false, tabState: 'active', action: "20. Timer Clamping Mastered!", note: "Ready for Module 4: Microtasks vs Macrotasks!" }
]

const currentIdx = computed(() => Math.min(Math.max(0, props.step), steps.length - 1))
const currentStep = computed(() => steps[currentIdx.value])
</script>

<template>
  <div class="h-full flex flex-col justify-between select-none bg-white p-6 font-sans">
    <!-- Header -->
    <div>
      <div class="flex items-center justify-between mb-1">
        <div class="flex items-center gap-2">
          <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-900 border border-amber-300 uppercase tracking-wider">
            Outcome 3 • Slide 12/20
          </span>
          <span class="text-xs text-slate-500 font-medium font-mono">Specification Rules</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-[10px] font-mono text-slate-500 font-bold">Step {{ currentIdx + 1 }} / 20</span>
          <div class="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              class="h-full bg-amber-500 transition-all duration-300 rounded-full"
              :style="{ width: ((currentIdx + 1) / 20) * 100 + '%' }"
            ></div>
          </div>
        </div>
      </div>

      <h1 class="text-2xl font-black text-slate-900 tracking-tight">
        Timer Drift & The 4ms HTML5 Clamping Rule
      </h1>
      <p class="text-xs text-slate-600 font-medium">
        Why recursive timers are artificially throttled by browsers and background tabs.
      </p>
    </div>

    <!-- Active Action Banner -->
    <div class="border-2 p-2 rounded-lg flex items-center justify-between text-xs"
      :class="currentStep.isClamped ? 'bg-amber-100 border-amber-400 text-amber-950 font-bold' : 'bg-slate-50 border-slate-300 text-slate-800'"
    >
      <div class="flex items-center gap-2">
        <span>{{ currentStep.isClamped ? '⚠️' : '▶' }}</span>
        <span>{{ currentStep.action }}</span>
      </div>
      <div class="flex items-center gap-2">
        <span class="text-[10px] font-mono font-bold px-2 py-0.5 rounded"
          :class="currentStep.isClamped ? 'bg-amber-200 text-amber-950' : 'bg-slate-200 text-slate-800'"
        >
          Delay: {{ currentStep.actualDelay }} ms
        </span>
        <span class="text-[10.5px] opacity-80">{{ currentStep.note }}</span>
      </div>
    </div>

    <!-- Main Grid: Nesting Meter (Left) vs Tab Throttling (Right) -->
    <div class="grid grid-cols-12 gap-3 my-1">
      <!-- 4ms Nesting Depth (6 Cols) -->
      <div class="col-span-6 bg-amber-50/70 border-2 border-amber-300 rounded-xl p-3 flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between text-[11px] font-black text-amber-950 uppercase mb-2">
            <span>📜 HTML5 Nesting Meter (Depth >= 5)</span>
            <span class="text-[9px] bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded font-bold font-mono">
              Depth: {{ currentStep.depth }} / 5
            </span>
          </div>

          <!-- Depth Segments -->
          <div class="flex gap-1 mb-3">
            <div
              v-for="d in 5"
              :key="d"
              class="flex-1 h-5 rounded-md border flex items-center justify-center text-[10px] font-mono font-bold transition-all duration-300"
              :class="d <= currentStep.depth
                ? (d === 5 ? 'bg-rose-500 text-white border-rose-600 animate-pulse' : 'bg-amber-400 text-slate-950 border-amber-500')
                : 'bg-white text-slate-400 border-slate-200'"
            >
              {{ d === 5 ? '≥5: 4ms' : d }}
            </div>
          </div>

          <div class="p-2 bg-white rounded-lg border border-amber-200 space-y-1 text-[10.5px]">
            <div class="flex justify-between">
              <span class="text-slate-600">Requested Delay:</span>
              <span class="font-mono font-bold text-slate-800">{{ currentStep.requestedDelay }} ms</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-600">Actual Enforced Delay:</span>
              <span class="font-mono font-bold" :class="currentStep.isClamped ? 'text-rose-600' : 'text-emerald-700'">
                {{ currentStep.actualDelay }} ms
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-600">Clamping Status:</span>
              <span class="font-bold text-[10px]" :class="currentStep.isClamped ? 'text-rose-600' : 'text-slate-500'">
                {{ currentStep.isClamped ? 'CLAMPED TO MIN 4ms' : 'RAW DELAY ALLOWED' }}
              </span>
            </div>
          </div>
        </div>

        <div class="text-[9px] text-amber-900 font-bold text-center mt-2 bg-amber-100/60 py-1 rounded">
          HTML5 Living Standard Section 8.5: Timer Initialization Steps
        </div>
      </div>

      <!-- Background Tab Throttling (6 Cols) -->
      <div class="col-span-6 bg-slate-900 text-white rounded-xl p-3 flex flex-col justify-between border-2 border-slate-700">
        <div>
          <div class="flex items-center justify-between text-[11px] font-black uppercase text-amber-400 mb-2">
            <span>🔋 Inactive Tab Power Throttling</span>
            <span class="text-[9px] px-2 py-0.5 rounded font-bold font-mono"
              :class="currentStep.tabState === 'background' ? 'bg-rose-500 text-white' : 'bg-emerald-500 text-slate-950'"
            >
              {{ currentStep.tabState === 'background' ? 'BACKGROUND TAB' : 'ACTIVE TAB' }}
            </span>
          </div>

          <div class="p-2.5 bg-black/60 rounded-lg border border-slate-800 space-y-2 text-[10.5px]">
            <div class="flex justify-between text-slate-300">
              <span>document.hidden:</span>
              <span class="font-mono font-bold text-amber-300">
                {{ currentStep.tabState === 'background' ? 'true' : 'false' }}
              </span>
            </div>
            <div class="flex justify-between text-slate-300">
              <span>Throttle Limit:</span>
              <span class="font-mono font-bold text-rose-400">
                {{ currentStep.tabState === 'background' ? '>= 1000 ms (1s)' : 'Normal (<4ms)' }}
              </span>
            </div>
            <div class="text-[9.5px] text-slate-400 leading-snug">
              {{ currentStep.tabState === 'background'
                ? 'Chrome/Safari aggressively throttle inactive tabs to reduce laptop battery drain and CPU wakeups.'
                : 'Full CPU frequency available for active tab timer execution.' }}
            </div>
          </div>
        </div>

        <div class="text-[9px] text-slate-400 text-center font-mono mt-2 pt-1 border-t border-slate-800">
          Solution for audio/stopwatches: Use Web Workers or Web Audio API!
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="flex items-center justify-between text-xs text-slate-500 border-t border-slate-200 pt-2 font-mono">
      <span>Module 3: Timer Internals • Drift & Clamping Rules</span>
      <span class="text-slate-600 font-bold">Slide 12 / 20</span>
    </div>
  </div>
</template>
