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
  microtaskQueue: string[]
  activePromise: string
  tickNumber: number
  action: string
  note: string
  phaseType: 'chain' | 'zalgo' | 'race' | 'error' | 'concurrency'
  visualBadge: string
  detailCard: { title: string; line1: string; line2: string; highlight: string }
}

const steps: Step[] = [
  {
    microtaskQueue: ['P1_callback'],
    activePromise: 'Promise.resolve()',
    tickNumber: 0,
    action: "1. Promise.resolve() resolves synchronously",
    note: "Queues P1 fulfillment callback into Microtask Queue.",
    phaseType: 'chain',
    visualBadge: "Tick 0 • Enqueue P1",
    detailCard: { title: "Chain Init", line1: "Promise.resolve() fulfilled immediately", line2: "P1 fulfillment queued as microtask", highlight: "Microtask Queue: [P1]" }
  },
  {
    microtaskQueue: [],
    activePromise: 'P1 executing...',
    tickNumber: 1,
    action: "2. Microtask Tick 1: P1 executes",
    note: "console.log('P1') runs. Returns primitive 'Result 1'.",
    phaseType: 'chain',
    visualBadge: "Tick 1 • P1 Executing",
    detailCard: { title: "Primitive Return", line1: "P1 returns string 'Result 1'", line2: "Primitives resolve synchronously!", highlight: "Return: 'Result 1' (0 unwrap delay)" }
  },
  {
    microtaskQueue: ['P2_callback'],
    activePromise: 'P1 fulfilled with primitive',
    tickNumber: 1,
    action: "3. Primitive return resolves chained promise immediately",
    note: "P2 callback queued to Microtask Queue for next tick.",
    phaseType: 'chain',
    visualBadge: "Tick 1 • P2 Enqueued",
    detailCard: { title: "Fast Path", line1: "Chained promise directly scheduled", line2: "P2 ready for Tick 2", highlight: "Microtask Queue: [P2]" }
  },
  {
    microtaskQueue: [],
    activePromise: 'P2 executing...',
    tickNumber: 2,
    action: "4. Microtask Tick 2: P2 executes",
    note: "P2 returns Promise.resolve('Nested') -> A THENANCE OBJECT!",
    phaseType: 'chain',
    visualBadge: "Tick 2 • Thenable Detected",
    detailCard: { title: "Thenable Return", line1: "P2 returns Promise.resolve('Nested')", line2: "Cannot resolve synchronously!", highlight: "Penalty Triggered: 2 Extra Ticks" }
  },
  {
    microtaskQueue: ['PromiseResolveThenableJob'],
    activePromise: 'Unwrapping started',
    tickNumber: 2,
    action: "5. Engine detects Promise return: Enqueues ThenableJob",
    note: "ECMAScript spec: Promise returns cannot resolve synchronously!",
    phaseType: 'chain',
    visualBadge: "Tick 2 • Unwrap Job #1",
    detailCard: { title: "Job #1", line1: "HostEnqueuePromiseJob(ThenableJob)", line2: "Extracts .then property to verify signature", highlight: "Microtask Queue: [ThenableJob]" }
  },
  {
    microtaskQueue: [],
    activePromise: 'ThenableJob running...',
    tickNumber: 3,
    action: "6. Microtask Tick 3: ThenableJob inspects .then method",
    note: "Accesses .then method to conform to Promises/A+ standard.",
    phaseType: 'chain',
    visualBadge: "Tick 3 • Inspecting .then",
    detailCard: { title: "Unwrapping", line1: "ThenableJob calls inner .then()", line2: "Passes internal resolve/reject handlers", highlight: "Inner Promise Evaluation" }
  },
  {
    microtaskQueue: ['PromiseReactionJob'],
    activePromise: 'Reaction scheduled',
    tickNumber: 3,
    action: "7. Inner promise resolution scheduled as next microtask",
    note: "This is the second microtask turn of the unwrap penalty!",
    phaseType: 'chain',
    visualBadge: "Tick 3 • Unwrap Job #2",
    detailCard: { title: "Job #2", line1: "Inner promise fulfills with 'Nested'", line2: "Reaction queued to resolve outer promise", highlight: "Microtask Queue: [ReactionJob]" }
  },
  {
    microtaskQueue: [],
    activePromise: 'Unwrapped: "Nested"',
    tickNumber: 4,
    action: "8. Microtask Tick 4: Value 'Nested' officially resolved!",
    note: "Finally, the chained promise transitions to fulfilled.",
    phaseType: 'chain',
    visualBadge: "Tick 4 • Unwrapped",
    detailCard: { title: "Unwrapped Value", line1: "Chained promise fulfilled with 'Nested'", line2: "P3 callback can finally be queued!", highlight: "Settled Value: 'Nested'" }
  },
  {
    microtaskQueue: ['P3_callback("Nested")'],
    activePromise: 'P3 ready',
    tickNumber: 4,
    action: "9. P3 callback finally enters Microtask Queue",
    note: "Took 2 extra microtask ticks compared to primitive return!",
    phaseType: 'chain',
    visualBadge: "Tick 4 • P3 Enqueued",
    detailCard: { title: "P3 Scheduled", line1: "P3 registered for next microtask drain", line2: "Total unwrap cost = 2 ticks", highlight: "Microtask Queue: [P3]" }
  },
  {
    microtaskQueue: [],
    activePromise: 'P3 executed',
    tickNumber: 5,
    action: "10. Microtask Tick 5: P3 executes -> console.log('Nested')",
    note: "Output logged to console after 5 microtask ticks.",
    phaseType: 'chain',
    visualBadge: "Tick 5 • P3 Finished",
    detailCard: { title: "Execution Complete", line1: "Stdout: 'Nested'", line2: "Chain successfully resolved", highlight: "Total Ticks: 5" }
  },
  {
    microtaskQueue: [],
    activePromise: 'Zälgo Defense Active',
    tickNumber: 5,
    action: "11. Why 2 Extra Ticks? Defending Against Zälgo!",
    note: "Isaac Schlueter (npm creator): Never release Zälgo! An API must never be sometimes sync and sometimes async.",
    phaseType: 'zalgo',
    visualBadge: "Zälgo Prevention",
    detailCard: { title: "The Zälgo Anti-Pattern", line1: "Bad: if (cached) return val; else fetch(cb);", line2: "Unpredictable ordering crashes state machines!", highlight: "Rule: Always Asynchronous" }
  },
  {
    microtaskQueue: ['CustomThenableJob'],
    activePromise: '{ then(resolve) { resolve(99); } }',
    tickNumber: 6,
    action: "12. Custom Thenables: Any object with a .then method",
    note: "ECMAScript supports libraries like Bluebird or jQuery Deferred via duck-typing.",
    phaseType: 'zalgo',
    visualBadge: "Duck Typing",
    detailCard: { title: "Custom Thenable", line1: "const thenable = { then: fn };", line2: "Undergoes the identical 2-tick unwrapping safely", highlight: "Interoperable with all Promise libraries" }
  },
  {
    microtaskQueue: ['ChainA_Tick1', 'ChainB_Tick1'],
    activePromise: 'Chain A vs Chain B Race',
    tickNumber: 7,
    action: "13. Parallel Promise Chains: Interleaving Output Race",
    note: "When two promise chains run simultaneously, their ticks alternate in FIFO queue order!",
    phaseType: 'race',
    visualBadge: "Interleaving Matrix",
    detailCard: { title: "Two Parallel Chains", line1: "Chain A: P1 -> P2 -> P3", line2: "Chain B: Q1 -> Q2 -> Q3", highlight: "FIFO Order: A1 -> B1 -> A2 -> B2" }
  },
  {
    microtaskQueue: ['ChainB_Tick1', 'ChainA_Tick2'],
    activePromise: 'Chain A1 finishes -> Enqueues A2',
    tickNumber: 8,
    action: "14. Parallel Tick 1: A1 executes -> Appends A2 behind B1",
    note: "Microtask queue order: B1 is now at the head, followed by A2.",
    phaseType: 'race',
    visualBadge: "Tick Interleaving",
    detailCard: { title: "Queue Interleaving", line1: "A1 runs and appends A2 behind B1", line2: "Output so far: 'A1'", highlight: "Next in Queue: B1" }
  },
  {
    microtaskQueue: ['ChainA_Tick2', 'ChainB_Tick2'],
    activePromise: 'Chain B1 finishes -> Enqueues B2',
    tickNumber: 9,
    action: "15. Parallel Tick 2: B1 executes -> Appends B2 behind A2",
    note: "Output interleaves cleanly: A1 -> B1 -> A2 -> B2 -> A3 -> B3.",
    phaseType: 'race',
    visualBadge: "Deterministic Interleaving",
    detailCard: { title: "Alternating Waves", line1: "B1 runs and logs 'B1'", line2: "Output so far: 'A1', 'B1'", highlight: "Fair Multi-Chain Concurrency" }
  },
  {
    microtaskQueue: ['catchHandler'],
    activePromise: 'Promise.reject(Error)',
    tickNumber: 10,
    action: "16. Error Rejection Propagation: Bypasses .then() handlers",
    note: "When a rejection occurs, all downstream fulfillment handlers are skipped until .catch().",
    phaseType: 'error',
    visualBadge: "Rejection Bypass",
    detailCard: { title: "Rejection Bypass", line1: "Unhandled .then() callbacks skipped", line2: "Direct jump to nearest rejection handler", highlight: "Fast-path to .catch()" }
  },
  {
    microtaskQueue: ['recoveryThen'],
    activePromise: 'Recovered in .catch()',
    tickNumber: 11,
    action: "17. Chain Recovery: Returning a value from .catch() restores fulfillment",
    note: "If .catch() returns a fallback value, the next chained .then() receives it as fulfilled!",
    phaseType: 'error',
    visualBadge: "Chain Recovery",
    detailCard: { title: "Error Recovery", line1: "catch(err) { return 'Fallback'; }", line2: "Subsequent .then(val) receives 'Fallback'", highlight: "Resumes normal fulfillment pipeline" }
  },
  {
    microtaskQueue: [],
    activePromise: 'Global unhandledRejection',
    tickNumber: 12,
    action: "18. Unhandled Rejections: window.onunhandledrejection",
    note: "If no .catch() exists, Node.js terminates the process and browsers log red console errors.",
    phaseType: 'error',
    visualBadge: "Unhandled Rejection",
    detailCard: { title: "Host Notification", line1: "Process exit code 1 in Node.js", line2: "Always attach .catch() or use try/catch in async functions", highlight: "Crash Prevention" }
  },
  {
    microtaskQueue: ['Promise.allSettled'],
    activePromise: 'Promise Concurrency Combinators',
    tickNumber: 13,
    action: "19. Promise Combinators: all vs allSettled vs race vs any",
    note: "Promise.all fails fast on 1 error; Promise.allSettled waits for all promises to finish.",
    phaseType: 'concurrency',
    visualBadge: "Combinator Matrix",
    detailCard: { title: "Concurrency Tools", line1: "Promise.all: All must succeed", line2: "Promise.allSettled: Never rejects, gives status report", highlight: "Parallel Orchestration" }
  },
  {
    microtaskQueue: [],
    activePromise: 'Mastery Complete',
    tickNumber: 14,
    action: "20. Promise Chaining & Unwrapping Mastered! Ready for async/await",
    note: "You understand internal thenable jobs, interleaving, and Zälgo defense!",
    phaseType: 'concurrency',
    visualBadge: "Outcome 5 Mastered",
    detailCard: { title: "Module 5 Milestone", line1: "ECMA-262 Promise specification mastered", line2: "Ready for Slide 19: async / await Coroutines", highlight: "Slide 18/20 Complete" }
  }
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
          <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-100 text-rose-900 border border-rose-300 uppercase tracking-wider">
            Outcome 5 • Slide 18/20
          </span>
          <span class="text-xs text-slate-500 font-medium font-mono">Thenable Unwrapping & Interleaving</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-[10px] font-mono text-slate-500 font-bold">Step {{ currentIdx + 1 }} / 20</span>
          <div class="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              class="h-full bg-rose-600 transition-all duration-300 rounded-full"
              :style="{ width: ((currentIdx + 1) / 20) * 100 + '%' }"
            ></div>
          </div>
        </div>
      </div>

      <h1 class="text-2xl font-black text-slate-900 tracking-tight">
        Chained Promises & The 2-Microtask Unwrap Penalty
      </h1>
      <p class="text-xs text-slate-600 font-medium">
        Why returning a Promise introduces two microtask ticks of overhead and how parallel chains interleave.
      </p>
    </div>

    <!-- Active Action Banner -->
    <div class="bg-rose-50 border-2 border-rose-300 p-2 rounded-lg flex items-center justify-between text-xs">
      <div class="flex items-center gap-2 font-bold text-rose-950">
        <span class="text-rose-600 animate-pulse">▶</span>
        <span>{{ currentStep.action }}</span>
      </div>
      <div class="flex items-center gap-2">
        <span class="text-[9.5px] font-bold font-mono px-2 py-0.5 rounded bg-rose-200 text-rose-950 border border-rose-300">
          {{ currentStep.visualBadge }}
        </span>
        <span class="text-[10px] text-slate-600 font-medium">{{ currentStep.note }}</span>
      </div>
    </div>

    <!-- Main Grid: Code / Diagram (Left 5) vs Dynamic Spec Pipeline (Right 7) -->
    <div class="grid grid-cols-12 gap-3 my-1">
      <!-- Code Panel (5 Cols) -->
      <div class="col-span-5 bg-slate-950 rounded-xl p-3 text-slate-200 font-mono text-[9.5px] flex flex-col justify-between border border-slate-800">
        <div>
          <div class="text-[9px] uppercase tracking-wider text-slate-400 font-bold mb-1.5 pb-1 border-b border-slate-800 flex justify-between">
            <span>Promise Chaining Architecture</span>
            <span class="text-rose-400">Microtask Ticks</span>
          </div>
          <div class="space-y-1 leading-relaxed">
            <div class="text-purple-400">Promise.resolve()</div>
            <div class="text-slate-300 pl-2">.then(() => {</div>
            <div class="text-amber-300 pl-4">return "Primitive Result"; // 1 tick</div>
            <div class="text-slate-300 pl-2">})</div>
            <div class="text-slate-300 pl-2">.then(() => {</div>
            <div class="text-emerald-400 font-bold pl-4">return Promise.resolve("Nested"); // 2 ticks!</div>
            <div class="text-slate-300 pl-2">})</div>
            <div class="text-slate-300 pl-2">.then(console.log);</div>
          </div>
        </div>

        <div class="mt-2 pt-1 border-t border-slate-800 flex items-center justify-between text-[8.5px]">
          <span class="text-slate-400">Active Promise State:</span>
          <span class="text-rose-300 font-bold font-mono">{{ currentStep.activePromise }}</span>
        </div>
      </div>

      <!-- Unwrapping Visualization & Active Detail Card (7 Cols) -->
      <div class="col-span-7 bg-purple-50/70 border-2 border-purple-300 rounded-xl p-3 flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between text-[11px] font-black uppercase text-purple-950 mb-1.5">
            <span>🔬 ECMAScript Thenable Job Pipeline</span>
            <span class="text-[9px] bg-purple-200 text-purple-900 px-1.5 py-0.5 rounded font-bold font-mono">
              Tick #{{ currentStep.tickNumber }}
            </span>
          </div>

          <div class="space-y-1.5 min-h-[110px] p-2 bg-white/95 rounded-lg border border-purple-200 text-[10px]">
            <!-- Pending Microtasks -->
            <div class="p-1 rounded bg-slate-50 border border-slate-200 flex justify-between items-center">
              <span class="text-slate-600 font-bold text-[9px]">Microtask Queue:</span>
              <div class="flex gap-1">
                <span v-for="m in currentStep.microtaskQueue" :key="m" class="bg-purple-100 text-purple-950 font-bold px-1.5 py-0.5 rounded text-[8.5px] border border-purple-300 animate-pulse">
                  {{ m }}
                </span>
                <span v-if="currentStep.microtaskQueue.length === 0" class="text-slate-400 italic text-[8.5px]">
                  (Queue Drained • 0 pending)
                </span>
              </div>
            </div>

            <!-- Active Step Detail Card -->
            <div class="p-2 rounded-lg border transition-all duration-300"
              :class="{
                'bg-purple-50 border-purple-300 text-purple-950': currentStep.phaseType === 'chain',
                'bg-amber-50 border-amber-300 text-amber-950': currentStep.phaseType === 'zalgo',
                'bg-blue-50 border-blue-300 text-blue-950': currentStep.phaseType === 'race',
                'bg-rose-50 border-rose-300 text-rose-950': currentStep.phaseType === 'error',
                'bg-emerald-50 border-emerald-300 text-emerald-950': currentStep.phaseType === 'concurrency'
              }"
            >
              <div class="font-bold text-[10px] uppercase tracking-wider mb-0.5 flex justify-between">
                <span>{{ currentStep.detailCard.title }}</span>
                <span class="font-mono text-[8.5px] font-bold px-1 rounded bg-black/10">
                  {{ currentStep.detailCard.highlight }}
                </span>
              </div>
              <div class="text-[9px] leading-snug">{{ currentStep.detailCard.line1 }}</div>
              <div class="text-[8.5px] opacity-80 mt-0.5">{{ currentStep.detailCard.line2 }}</div>
            </div>
          </div>
        </div>

        <div class="text-[8.5px] text-purple-900 font-bold text-center mt-1 bg-purple-100/60 py-0.5 rounded">
          Primitive returns unwrap in 1 tick • Promise returns require 2 extra ticks
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="flex items-center justify-between text-xs text-slate-500 border-t border-slate-200 pt-2 font-mono">
      <span>Module 5: Promise Internals • Thenable Unwrapping</span>
      <span class="text-slate-600 font-bold">Slide 18 / 20</span>
    </div>
  </div>
</template>
