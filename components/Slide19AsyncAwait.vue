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
  stage: 'entry' | 'await_hit' | 'suspended' | 'caller_runs' | 'micro_queued' | 'resumed' | 'generator' | 'error' | 'parallel' | 'tla' | 'complete'
  callStack: string[]
  microtasks: string[]
  isSuspended: boolean
  action: string
  note: string
  coroutineDetail: { title: string; line1: string; line2: string; highlight: string }
}

const steps: Step[] = [
  {
    stage: 'entry',
    callStack: ['global()', 'fetchUser()'],
    microtasks: [],
    isSuspended: false,
    action: "1. fetchUser() invoked: Starts synchronously on Stack",
    note: "Code before await runs immediately on Call Stack.",
    coroutineDetail: { title: "Entry Phase", line1: "Function execution context created", line2: "Synchronous statements execute immediately", highlight: "Stack: fetchUser()" }
  },
  {
    stage: 'entry',
    callStack: ['global()', 'fetchUser()', "log('1. Before')"],
    microtasks: [],
    isSuspended: false,
    action: "2. Executes console.log('1. Before')",
    note: "Logs '1. Before' to console synchronously.",
    coroutineDetail: { title: "Sync Execution", line1: "Direct console print on CPU", line2: "Runs before any suspension point", highlight: "Stdout: '1. Before'" }
  },
  {
    stage: 'await_hit',
    callStack: ['global()', 'fetchUser()', 'getUser()'],
    microtasks: [],
    isSuspended: false,
    action: "3. Evaluates await getUser(): Calls getUser()",
    note: "The expression after await is evaluated immediately.",
    coroutineDetail: { title: "Await Expression", line1: "getUser() returns a Promise", line2: "Evaluated on Call Stack right now", highlight: "Promise Created" }
  },
  {
    stage: 'await_hit',
    callStack: ['global()', 'fetchUser()'],
    microtasks: [],
    isSuspended: false,
    action: "4. Return value wrapped in Promise.resolve(p)",
    note: "Guarantees a thenable object to await.",
    coroutineDetail: { title: "Coercion", line1: "Ensures thenable signature", line2: "Prepares resumption callback record", highlight: "Promise Coerced" }
  },
  {
    stage: 'suspended',
    callStack: ['global()'],
    microtasks: [],
    isSuspended: true,
    action: "5. AWAIT HIT: fetchUser() Execution Context SUSPENDED!",
    note: "The function frame is completely popped off the Call Stack!",
    coroutineDetail: { title: "Context Suspension", line1: "Registers & local scope saved in V8 Heap", line2: "Function frame pops off Call Stack!", highlight: "Thread 100% Free" }
  },
  {
    stage: 'caller_runs',
    callStack: ['global()', "log('Caller continued')"],
    microtasks: [],
    isSuspended: true,
    action: "6. Caller continues: Main thread is 100% UNBLOCKED!",
    note: "The thread is free to handle clicks, timers, and renders.",
    coroutineDetail: { title: "Caller Resumption", line1: "fetchUser() returns pending promise to caller", line2: "Caller script proceeds without waiting", highlight: "Non-Blocking" }
  },
  {
    stage: 'caller_runs',
    callStack: ['global()'],
    microtasks: [],
    isSuspended: true,
    action: "7. Caller finishes. Stack becomes empty.",
    note: "Call stack empty. Waiting for awaited promise to settle.",
    coroutineDetail: { title: "Idling", line1: "Main thread idle / processing other events", line2: "Background I/O completes in host thread", highlight: "Stack: Empty" }
  },
  {
    stage: 'micro_queued',
    callStack: [],
    microtasks: ['fetchUser continuation'],
    isSuspended: true,
    action: "8. Awaited Promise settles: Resumption queued to Microtasks!",
    note: "Continuation callback enters Microtask Queue.",
    coroutineDetail: { title: "Microtask Queue", line1: "Awaited Promise resolved with { id: 42 }", line2: "Continuation job scheduled in Microtasks", highlight: "Microtask: [ResumptionJob]" }
  },
  {
    stage: 'resumed',
    callStack: ['fetchUser() [Resumed]'],
    microtasks: [],
    isSuspended: false,
    action: "9. Event loop dequeues continuation: Resumes after await!",
    note: "Frame pushed back to Call Stack with local variables intact!",
    coroutineDetail: { title: "Context Restored", line1: "Local variables & registers restored from Heap", line2: "Execution resumes exactly at Line 4", highlight: "const user = { id: 42 }" }
  },
  {
    stage: 'resumed',
    callStack: ['fetchUser()', "log('2. After')"],
    microtasks: [],
    isSuspended: false,
    action: "10. Executes console.log('2. After', user)",
    note: "Variable user receives the fulfilled promise value.",
    coroutineDetail: { title: "Post-Await Execution", line1: "Logs '2. After' with received user object", line2: "Function runs to completion", highlight: "Stdout: '2. After'" }
  },
  {
    stage: 'generator',
    callStack: ['function* generatorCoroutine()'],
    microtasks: [],
    isSuspended: false,
    action: "11. Under the Hood: Desugaring into ES6 Generators",
    note: "async/await is syntactic sugar over Generators (yield) + Promises!",
    coroutineDetail: { title: "Generator Desugaring", line1: "yield pauses execution generator.next() resumes", line2: "Automated runner wraps yielded promises", highlight: "Babel / V8 Desugaring" }
  },
  {
    stage: 'generator',
    callStack: ['Microtask Checkpoint'],
    microtasks: ['await boundary #1', 'await boundary #2'],
    isSuspended: false,
    action: "12. Microtask Boundary at EVERY await keyword",
    note: "Every await introduces an asynchronous microtask tick delay.",
    coroutineDetail: { title: "Tick Boundaries", line1: "await x; creates a microtask resumption", line2: "Multiple awaits create a chain of microtasks", highlight: "Deterministic Ticks" }
  },
  {
    stage: 'error',
    callStack: ['try { await fail() } catch(e)'],
    microtasks: [],
    isSuspended: false,
    action: "13. Synchronous-Style Error Handling: try / catch",
    note: "Rejected promises throw real catchable exceptions inside async functions!",
    coroutineDetail: { title: "Error Handling", line1: "catch (err) { handle(err); } catches rejections", line2: "No need for chained .catch() callbacks", highlight: "Syntactic Cleanliness" }
  },
  {
    stage: 'parallel',
    callStack: ['await fetchA(); await fetchB();'],
    microtasks: [],
    isSuspended: false,
    action: "14. The Sequential Await Anti-Pattern (2x Latency Hazard)",
    note: "Awaiting independent requests sequentially doubles network latency!",
    coroutineDetail: { title: "Sequential Anti-Pattern", line1: "const a = await getA(); (100ms)", line2: "const b = await getB(); (100ms) = 200ms Total!", highlight: "Double Latency" }
  },
  {
    stage: 'parallel',
    callStack: ['Promise.all([getA(), getB()])'],
    microtasks: ['Promise.all reaction'],
    isSuspended: false,
    action: "15. The Concurrent Solution: Promise.all()",
    note: "Launches both requests simultaneously on host threads: 100ms total!",
    coroutineDetail: { title: "Parallel Execution", line1: "const [a, b] = await Promise.all([getA(), getB()]);", line2: "Executes concurrently in background: 100ms Total!", highlight: "50% Latency Reduction" }
  },
  {
    stage: 'tla',
    callStack: ['Top-Level Await (ES2022)'],
    microtasks: [],
    isSuspended: false,
    action: "16. Top-Level Await in ES Modules",
    note: "Allows await at module root. Coordinates dependency module graph safely.",
    coroutineDetail: { title: "ES2022 Top-Level Await", line1: "const db = await connectDB(); in module root", line2: "Child modules wait for parent to settle", highlight: "Module Graph Loading" }
  },
  {
    stage: 'complete',
    callStack: ['Async Stack Traces (V8)'],
    microtasks: [],
    isSuspended: false,
    action: "17. Zero-Cost Async Stack Traces in V8",
    note: "V8 reconstructs call tree across await boundaries without memory overhead.",
    coroutineDetail: { title: "Async Stack Traces", line1: "Error stack traces preserve function origins", line2: "Bridges the gap across asynchronous ticks", highlight: "DevTools Debuggability" }
  },
  {
    stage: 'complete',
    callStack: ['for await (const chunk of stream)'],
    microtasks: ['AsyncIterator.next()'],
    isSuspended: false,
    action: "18. for-await-of and Async Iterators",
    note: "Consume streaming data (Node.js readable streams, Web Streams) seamlessly.",
    coroutineDetail: { title: "Async Iteration", line1: "Symbol.asyncIterator returns promises on next()", line2: "Ideal for streaming 1GB files chunk by chunk", highlight: "Stream Processing" }
  },
  {
    stage: 'complete',
    callStack: ['items.forEach(async fn) ❌'],
    microtasks: [],
    isSuspended: false,
    action: "19. Common Trap: Never use async inside Array.forEach!",
    note: "forEach does NOT await promises! All iterations run in an uncontrolled race.",
    coroutineDetail: { title: "forEach Trap", line1: "items.forEach(async (x) => await save(x)); // BUG!", line2: "Fix: Use for (const x of items) or Promise.all()", highlight: "Silent Concurrency Bug" }
  },
  {
    stage: 'complete',
    callStack: ['Mastery Achieved'],
    microtasks: [],
    isSuspended: false,
    action: "20. async/await Coroutines Mastered! Ready for Grand Finale!",
    note: "You understand non-blocking coroutines, suspension, and concurrency!",
    coroutineDetail: { title: "Module 5 Complete", line1: "Full Coroutine & Promise Mastery Achieved", line2: "Ready for Slide 20: The Grand Synthesis Challenge!", highlight: "Slide 19/20 Complete" }
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
            Outcome 5 • Slide 19/20
          </span>
          <span class="text-xs text-slate-500 font-medium font-mono">Coroutine Desugaring & Concurrency</span>
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
        <code>async / await</code>: The Non-Blocking Coroutine
      </h1>
      <p class="text-xs text-slate-600 font-medium">
        How <code>await</code> pauses the function without freezing the single JavaScript thread.
      </p>
    </div>

    <!-- Active Action Banner -->
    <div class="bg-rose-50 border-2 border-rose-300 p-2 rounded-lg flex items-center justify-between text-xs">
      <div class="flex items-center gap-2 font-bold text-rose-950">
        <span class="text-rose-600 animate-pulse">▶</span>
        <span>{{ currentStep.action }}</span>
      </div>
      <div class="flex items-center gap-2">
        <span class="text-[9.5px] font-mono font-bold px-2 py-0.5 rounded"
          :class="currentStep.isSuspended ? 'bg-amber-200 text-amber-950 border border-amber-300' : 'bg-emerald-200 text-emerald-950 border border-emerald-300'"
        >
          Status: {{ currentStep.isSuspended ? 'CONTEXT SUSPENDED' : 'STACK ACTIVE' }}
        </span>
        <span class="text-[10px] text-slate-600 font-medium">{{ currentStep.note }}</span>
      </div>
    </div>

    <!-- Main Grid: Code (Left 5) vs Engine State & Coroutine Detail Card (Right 7) -->
    <div class="grid grid-cols-12 gap-3 my-1">
      <!-- Code Panel (5 Cols) -->
      <div class="col-span-5 bg-slate-950 rounded-xl p-3 text-slate-200 font-mono text-[9.5px] flex flex-col justify-between border border-slate-800">
        <div>
          <div class="text-[9px] uppercase tracking-wider text-slate-400 font-bold mb-1.5 pb-1 border-b border-slate-800 flex justify-between">
            <span>Async Function Source</span>
            <span class="text-rose-400">Coroutine</span>
          </div>
          <div class="space-y-1 leading-relaxed">
            <div class="text-purple-400">async function fetchUser() {</div>
            <div class="text-slate-400 pl-2">console.log("1. Before");</div>
            <div class="text-amber-300 font-bold bg-slate-800/80 p-0.5 rounded pl-2">
              const user = await getUser();
            </div>
            <div class="text-slate-400 pl-2">console.log("2. After", user);</div>
            <div class="text-purple-400">}</div>
            <div class="text-slate-400 mt-1">fetchUser();</div>
            <div class="text-emerald-400 font-bold">console.log("Caller continued!");</div>
          </div>
        </div>
        <div class="mt-2 pt-1 border-t border-slate-800 text-[8.5px] text-rose-300 truncate">
          Suspended: {{ currentStep.isSuspended ? 'Frame saved in Heap' : 'Frame running on CPU' }}
        </div>
      </div>

      <!-- Engine State (Right 7 Cols) -->
      <div class="col-span-7 grid grid-cols-2 gap-2">
        <!-- Call Stack -->
        <div class="bg-blue-50/70 border-2 border-blue-300 rounded-xl p-2.5 flex flex-col justify-between">
          <div class="flex items-center justify-between text-[10px] font-black uppercase text-blue-950 mb-1">
            <span>⚡ Call Stack</span>
            <span class="text-[8px] bg-blue-200 px-1 rounded text-blue-900 font-bold font-mono">
              {{ currentStep.callStack.length }} Frames
            </span>
          </div>
          <div class="flex flex-col-reverse gap-1 min-h-[75px] p-1.5 bg-white rounded border border-blue-200">
            <div v-for="f in currentStep.callStack" :key="f" class="p-1 rounded bg-blue-100 text-blue-950 font-mono text-[8.5px] font-bold border border-blue-200 text-center truncate shadow-xs">
              {{ f }}
            </div>
            <div v-if="currentStep.callStack.length === 0" class="text-slate-400 italic text-[9px] text-center py-4">
              (Call Stack Empty)
            </div>
          </div>
          <div class="text-[8px] text-center text-blue-800 font-bold mt-1">
            {{ currentStep.isSuspended ? 'Frame Saved in Heap' : 'Single Thread Active' }}
          </div>
        </div>

        <!-- Microtask Queue -->
        <div class="bg-purple-50/70 border-2 border-purple-300 rounded-xl p-2.5 flex flex-col justify-between">
          <div class="flex items-center justify-between text-[10px] font-black uppercase text-purple-950 mb-1">
            <span>⭐ Microtask Queue</span>
            <span class="text-[8px] bg-purple-200 px-1 rounded text-purple-900 font-bold font-mono">VIP</span>
          </div>
          <div class="flex flex-col gap-1 min-h-[75px] p-1.5 bg-white rounded border border-purple-200">
            <div v-for="m in currentStep.microtasks" :key="m" class="p-1 rounded bg-purple-100 text-purple-950 font-mono text-[8.5px] font-bold border border-purple-200 text-center truncate animate-pulse shadow-xs">
              {{ m }}
            </div>
            <div v-if="currentStep.microtasks.length === 0" class="text-slate-400 italic text-[9px] text-center py-4">
              (No Microtasks)
            </div>
          </div>
          <div class="text-[8px] text-center text-purple-800 font-bold mt-1">
            Resumption Jobs
          </div>
        </div>

        <!-- Coroutine Detail Card (Spans 2 cols) -->
        <div class="col-span-2 bg-slate-900 text-white rounded-xl p-2 border border-slate-700 flex flex-col justify-between">
          <div class="flex items-center justify-between text-[9.5px] font-bold text-amber-400 mb-0.5">
            <span>{{ currentStep.coroutineDetail.title }}</span>
            <span class="font-mono text-[8.5px] text-emerald-400">{{ currentStep.coroutineDetail.highlight }}</span>
          </div>
          <div class="text-[9px] text-slate-300">{{ currentStep.coroutineDetail.line1 }}</div>
          <div class="text-[8.5px] text-slate-400">{{ currentStep.coroutineDetail.line2 }}</div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="flex items-center justify-between text-xs text-slate-500 border-t border-slate-200 pt-2 font-mono">
      <span>Module 5: Async/Await • Coroutine Suspension</span>
      <span class="text-slate-600 font-bold">Slide 19 / 20</span>
    </div>
  </div>
</template>
