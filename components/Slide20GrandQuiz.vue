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
  stage: 'trace' | 'quiz' | 'wrapup'
  activeQuizItem?: number
  activePillar?: number
  traceOutput: string[]
  action: string
  note: string
}

const steps: Step[] = [
  { stage: 'trace', traceOutput: ['1'], action: "1. Line 1: console.log('1') executes synchronously", note: "Direct stack execution prints 1." },
  { stage: 'trace', traceOutput: ['1'], action: "2. Line 2: setTimeout('2', 0) enters Web APIs", note: "Timer offloaded to background thread." },
  { stage: 'trace', traceOutput: ['1'], action: "3. Line 3: Promise.resolve() queues '3' to Microtasks", note: "Promise fulfillment callback registered." },
  { stage: 'trace', traceOutput: ['1', '5'], action: "4. Line 5: fn() called -> logs '5' synchronously!", note: "Code before await executes synchronously on the stack!" },
  { stage: 'trace', traceOutput: ['1', '5'], action: "5. await null suspends fn() & queues '6' to Microtasks", note: "fn() context popped from stack! Control returns to caller." },
  { stage: 'trace', traceOutput: ['1', '5', '7'], action: "6. Line 7: console.log('7') executes synchronously", note: "Stack empty! Time for Microtask Checkpoint!" },
  { stage: 'trace', traceOutput: ['1', '5', '7', '3'], action: "7. Microtask Checkpoint: Runs '3' -> queues '4'", note: "First microtask prints 3." },
  { stage: 'trace', traceOutput: ['1', '5', '7', '3', '6'], action: "8. Next Microtask: fn() resumes -> prints '6'", note: "Microtask continuation prints 6." },
  { stage: 'trace', traceOutput: ['1', '5', '7', '3', '6', '4'], action: "9. Next Microtask: Runs '4' -> prints '4'", note: "Microtask queue now 100% empty!" },
  { stage: 'trace', traceOutput: ['1', '5', '7', '3', '6', '4', '2'], action: "10. Event Loop picks Macrotask: prints '2'!", note: "Final Output: 1 -> 5 -> 7 -> 3 -> 6 -> 4 -> 2!" },
  { stage: 'quiz', activeQuizItem: 1, traceOutput: ['1', '5', '7', '3', '6', '4', '2'], action: "11. Quiz Q1: Why does Promise.then() beat setTimeout(fn, 0)?", note: "Answer: Microtasks are drained at the end of the current task BEFORE macrotasks." },
  { stage: 'quiz', activeQuizItem: 2, traceOutput: ['1', '5', '7', '3', '6', '4', '2'], action: "12. Quiz Q2: Can async/await freeze the browser UI thread?", note: "Answer: No! await yields execution. Only synchronous loops freeze the UI." },
  { stage: 'quiz', activeQuizItem: 3, traceOutput: ['1', '5', '7', '3', '6', '4', '2'], action: "13. Quiz Q3: What happens if microtasks enqueue more microtasks infinitely?", note: "Answer: Starvation! Macrotasks, I/O, and 60fps renders are completely blocked." },
  { stage: 'quiz', activeQuizItem: 4, traceOutput: ['1', '5', '7', '3', '6', '4', '2'], action: "14. Quiz Q4: When does the browser recalculate styles and paint?", note: "Answer: Between macrotask turns, after all microtasks drain (every ~16.6ms)." },
  { stage: 'quiz', activeQuizItem: 5, traceOutput: ['1', '5', '7', '3', '6', '4', '2'], action: "15. Quiz Q5: Is new Promise((resolve) => { ... }) synchronous?", note: "Answer: Yes! The executor function executes immediately on the Call Stack." },
  { stage: 'wrapup', activePillar: 1, traceOutput: ['1', '5', '7', '3', '6', '4', '2'], action: "16. Master Pillar 1: Single Thread & DOM Safety", note: "1 Call Stack, 1 Heap, run-to-completion semantics, zero mutex deadlocks." },
  { stage: 'wrapup', activePillar: 2, traceOutput: ['1', '5', '7', '3', '6', '4', '2'], action: "17. Master Pillar 2: The Cooperative Event Loop", note: "Heartbeat coordination: Stack -> Microtasks -> Render -> Macrotask." },
  { stage: 'wrapup', activePillar: 3, traceOutput: ['1', '5', '7', '3', '6', '4', '2'], action: "18. Master Pillar 3: Web APIs & OS Min-Heap Timers", note: "Offloaded parallel I/O, Min-Heap O(log n), HTML5 4ms clamping." },
  { stage: 'wrapup', activePillar: 4, traceOutput: ['1', '5', '7', '3', '6', '4', '2'], action: "19. Master Pillar 4: Two-Tier Queues & 60 FPS", note: "VIP Microtasks (100% drain) vs Macrotasks (1-per-turn fairness)." },
  { stage: 'wrapup', activePillar: 5, traceOutput: ['1', '5', '7', '3', '6', '4', '2'], action: "20. COURSE COMPLETE! Full Engine Mental Model Achieved!", note: "Congratulations on mastering the JavaScript Event Loop!" }
]

const currentIdx = computed(() => Math.min(Math.max(0, props.step), steps.length - 1))
const currentStep = computed(() => steps[currentIdx.value])
</script>

<template>
  <div class="h-full flex flex-col justify-between select-none bg-white p-5 font-sans">
    <!-- Header -->
    <div>
      <div class="flex items-center justify-between mb-1">
        <div class="flex items-center gap-2">
          <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-900 border border-emerald-300 uppercase tracking-wider">
            Grand Finale • Slide 20/20
          </span>
          <span class="text-xs text-slate-500 font-medium font-mono">Mastery Synthesis & Live Quiz</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-[10px] font-mono text-slate-500 font-bold">Step {{ currentIdx + 1 }} / 20</span>
          <div class="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              class="h-full bg-emerald-600 transition-all duration-300 rounded-full"
              :style="{ width: ((currentIdx + 1) / 20) * 100 + '%' }"
            ></div>
          </div>
        </div>
      </div>

      <h1 class="text-2xl font-black text-slate-900 tracking-tight">
        Architectural Mastery: Final Synthesis & Live Quiz
      </h1>
      <p class="text-xs text-slate-600 font-medium">
        Consolidating all 5 foundational pillars with the ultimate execution trace and interactive quiz.
      </p>
    </div>

    <!-- Active Action Banner -->
    <div class="bg-emerald-50 border-2 border-emerald-300 p-2 rounded-lg flex items-center justify-between text-xs">
      <div class="flex items-center gap-2 font-bold text-emerald-950">
        <span class="text-emerald-600 animate-pulse">▶</span>
        <span>{{ currentStep.action }}</span>
      </div>
      <span class="text-[10.5px] text-slate-600 font-medium">{{ currentStep.note }}</span>
    </div>

    <!-- Main Grid: Trace on Left (5 Cols) | Quiz or 5 Pillars on Right (7 Cols) -->
    <div class="grid grid-cols-12 gap-3 my-1">
      <!-- Trace Panel (5 Cols) -->
      <div class="col-span-5 bg-slate-950 rounded-xl p-3 text-slate-200 font-mono text-[9px] flex flex-col justify-between border border-slate-800">
        <div>
          <div class="text-[9px] uppercase tracking-wider text-slate-400 font-bold mb-1 pb-1 border-b border-slate-800 flex justify-between">
            <span>Ultimate 7-Line Puzzle</span>
            <span class="text-emerald-400 font-bold">Execution</span>
          </div>
          <div class="space-y-0.5 leading-tight">
            <div>console.log('1');</div>
            <div class="text-amber-400">setTimeout(() => console.log('2'), 0);</div>
            <div class="text-purple-400">Promise.resolve().then(() => console.log('3')).then(() => console.log('4'));</div>
            <div class="text-indigo-400">async function fn() {</div>
            <div class="text-slate-400">&nbsp;&nbsp;console.log('5'); await null; console.log('6');</div>
            <div class="text-indigo-400">}</div>
            <div>fn();</div>
            <div>console.log('7');</div>
          </div>
        </div>

        <div class="mt-2 p-1.5 bg-black/60 rounded border border-slate-800 flex items-center justify-between">
          <span class="text-[8.5px] text-slate-400">Stdout:</span>
          <span class="font-mono font-bold text-emerald-400 text-[10px]">
            {{ currentStep.traceOutput.join(' ➔ ') }}
          </span>
        </div>
      </div>

      <!-- Right Panel (7 Cols): Dynamic Quiz vs 5 Architectural Pillars -->
      <div class="col-span-7 bg-slate-50 border-2 border-slate-300 rounded-xl p-2.5 flex flex-col justify-between">
        
        <!-- Mode A: Interactive Diagnostic Quiz (Steps 1 to 15) -->
        <div v-if="currentStep.stage !== 'wrapup'">
          <div class="text-[10px] font-black uppercase text-slate-900 mb-1 flex items-center justify-between">
            <span>💡 5-Question Interactive Diagnostic Quiz</span>
            <span class="text-[8.5px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-bold font-mono">
              Q{{ currentStep.activeQuizItem || 1 }}/5
            </span>
          </div>

          <div class="space-y-1 text-[9px]">
            <div class="p-1 rounded border transition-all duration-300"
              :class="currentStep.activeQuizItem === 1 ? 'bg-indigo-50 border-indigo-500 font-bold shadow-xs' : 'bg-white border-slate-200'"
            >
              <div class="text-indigo-950 font-bold">Q1: Why does Promise.then() beat setTimeout(fn, 0)?</div>
              <div v-if="currentIdx >= 10" class="text-slate-600 pl-2 border-l border-indigo-400 mt-0.5 text-[8px]">
                ➜ Microtasks drain at every checkpoint BEFORE any macrotask dequeues!
              </div>
            </div>

            <div class="p-1 rounded border transition-all duration-300"
              :class="currentStep.activeQuizItem === 2 ? 'bg-indigo-50 border-indigo-500 font-bold shadow-xs' : 'bg-white border-slate-200'"
            >
              <div class="text-indigo-950 font-bold">Q2: Can async/await freeze the browser UI?</div>
              <div v-if="currentIdx >= 11" class="text-slate-600 pl-2 border-l border-indigo-400 mt-0.5 text-[8px]">
                ➜ No! await yields execution. Only synchronous loops freeze UI.
              </div>
            </div>

            <div class="p-1 rounded border transition-all duration-300"
              :class="currentStep.activeQuizItem === 3 ? 'bg-indigo-50 border-indigo-500 font-bold shadow-xs' : 'bg-white border-slate-200'"
            >
              <div class="text-indigo-950 font-bold">Q3: What occurs if microtasks enqueue endlessly?</div>
              <div v-if="currentIdx >= 12" class="text-slate-600 pl-2 border-l border-indigo-400 mt-0.5 text-[8px]">
                ➜ Starvation! Macrotasks, clicks, and 60fps renders are completely blocked.
              </div>
            </div>

            <div class="p-1 rounded border transition-all duration-300"
              :class="currentStep.activeQuizItem === 4 ? 'bg-indigo-50 border-indigo-500 font-bold shadow-xs' : 'bg-white border-slate-200'"
            >
              <div class="text-indigo-950 font-bold">Q4: When does the browser recalculate styles and paint?</div>
              <div v-if="currentIdx >= 13" class="text-slate-600 pl-2 border-l border-indigo-400 mt-0.5 text-[8px]">
                ➜ Between macrotask turns, after all microtasks drain (every ~16.6ms).
              </div>
            </div>

            <div class="p-1 rounded border transition-all duration-300"
              :class="currentStep.activeQuizItem === 5 ? 'bg-indigo-50 border-indigo-500 font-bold shadow-xs' : 'bg-white border-slate-200'"
            >
              <div class="text-indigo-950 font-bold">Q5: Is new Promise((resolve) => { ... }) synchronous?</div>
              <div v-if="currentIdx >= 14" class="text-slate-600 pl-2 border-l border-indigo-400 mt-0.5 text-[8px]">
                ➜ Yes! The executor function runs immediately on Call Stack during construction!
              </div>
            </div>
          </div>
        </div>

        <!-- Mode B: The 5 Master Architectural Pillars (Steps 16 to 20) -->
        <div v-else>
          <div class="text-[10px] font-black uppercase text-emerald-950 mb-1 flex items-center justify-between">
            <span>🏆 The 5 Pillars of Asynchronous Mastery</span>
            <span class="text-[8.5px] bg-emerald-200 text-emerald-900 px-1.5 py-0.5 rounded font-bold font-mono">
              Pillar {{ currentStep.activePillar || 5 }} / 5
            </span>
          </div>

          <div class="space-y-1 text-[8.5px]">
            <!-- Pillar 1 -->
            <div class="p-1 rounded border transition-all duration-300 flex items-center justify-between"
              :class="currentStep.activePillar === 1 ? 'bg-blue-100 border-blue-500 ring-2 ring-blue-300 font-bold scale-[1.01]' : (currentIdx >= 15 ? 'bg-blue-50/80 border-blue-200 text-slate-800' : 'opacity-40')"
            >
              <div class="flex items-center gap-1.5">
                <span class="text-blue-700 font-black">1.</span>
                <span>Single-Threaded Core: 1 Stack, 1 Heap, DOM race safety</span>
              </div>
              <span class="font-mono text-[7.5px] font-bold text-blue-800 bg-white px-1 rounded">V8 Core</span>
            </div>

            <!-- Pillar 2 -->
            <div class="p-1 rounded border transition-all duration-300 flex items-center justify-between"
              :class="currentStep.activePillar === 2 ? 'bg-indigo-100 border-indigo-500 ring-2 ring-indigo-300 font-bold scale-[1.01]' : (currentIdx >= 16 ? 'bg-indigo-50/80 border-indigo-200 text-slate-800' : 'opacity-40')"
            >
              <div class="flex items-center gap-1.5">
                <span class="text-indigo-700 font-black">2.</span>
                <span>The Event Loop: Non-blocking coordinator loop</span>
              </div>
              <span class="font-mono text-[7.5px] font-bold text-indigo-800 bg-white px-1 rounded">Heartbeat</span>
            </div>

            <!-- Pillar 3 -->
            <div class="p-1 rounded border transition-all duration-300 flex items-center justify-between"
              :class="currentStep.activePillar === 3 ? 'bg-amber-100 border-amber-500 ring-2 ring-amber-300 font-bold scale-[1.01]' : (currentIdx >= 17 ? 'bg-amber-50/80 border-amber-200 text-slate-800' : 'opacity-40')"
            >
              <div class="flex items-center gap-1.5">
                <span class="text-amber-700 font-black">3.</span>
                <span>Multi-Threaded Host: Web APIs, libuv, Min-Heap Timers</span>
              </div>
              <span class="font-mono text-[7.5px] font-bold text-amber-800 bg-white px-1 rounded">OS Threads</span>
            </div>

            <!-- Pillar 4 -->
            <div class="p-1 rounded border transition-all duration-300 flex items-center justify-between"
              :class="currentStep.activePillar === 4 ? 'bg-purple-100 border-purple-500 ring-2 ring-purple-300 font-bold scale-[1.01]' : (currentIdx >= 18 ? 'bg-purple-50/80 border-purple-200 text-slate-800' : 'opacity-40')"
            >
              <div class="flex items-center gap-1.5">
                <span class="text-purple-700 font-black">4.</span>
                <span>Two-Tier Priority: VIP Microtasks & 16.6ms Render Window</span>
              </div>
              <span class="font-mono text-[7.5px] font-bold text-purple-800 bg-white px-1 rounded">VIP / Tasks</span>
            </div>

            <!-- Pillar 5 -->
            <div class="p-1 rounded border transition-all duration-300 flex items-center justify-between"
              :class="currentStep.activePillar === 5 ? 'bg-rose-100 border-rose-500 ring-2 ring-rose-300 font-bold scale-[1.01]' : (currentIdx >= 19 ? 'bg-rose-50/80 border-rose-200 text-slate-800' : 'opacity-40')"
            >
              <div class="flex items-center gap-1.5">
                <span class="text-rose-700 font-black">5.</span>
                <span>Coroutines: async/await yields without blocking CPU</span>
              </div>
              <span class="font-mono text-[7.5px] font-bold text-rose-800 bg-white px-1 rounded">Async/Await</span>
            </div>
          </div>
        </div>

        <div class="text-[9px] text-emerald-900 font-bold text-center mt-1 bg-emerald-100/70 py-0.5 rounded border border-emerald-300">
          🎉 Masterclass Completed • 20 / 20 Slides Mastered!
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="flex items-center justify-between text-xs text-slate-500 border-t border-slate-200 pt-2 font-mono">
      <span>Module 5: Summary & Assessment • Course Masterclass Conclusion</span>
      <span class="text-emerald-700 font-bold">Slide 20 / 20</span>
    </div>
  </div>
</template>
