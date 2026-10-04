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
  activeLine: number
  stackState: string
  webApiState: string
  macrotaskState: string
  elapsedMs: number
  action: string
  note: string
}

const steps: Step[] = [
  { activeLine: 1, stackState: "log('1. Start')", webApiState: "None", macrotaskState: "Empty", elapsedMs: 0, action: "1. Line 1: console.log('1. Start') runs", note: "Executes synchronously on the Call Stack." },
  { activeLine: 2, stackState: "setTimeout(cb, 0)", webApiState: "Registering...", macrotaskState: "Empty", elapsedMs: 0.1, action: "2. Line 2: setTimeout(cb, 0) invoked", note: "V8 requests timer from host environment." },
  { activeLine: 2, stackState: "global()", webApiState: "Timer(0ms)", macrotaskState: "Empty", elapsedMs: 0.2, action: "3. setTimeout returns TimerID: 101 immediately", note: "Synchronous call finishes! Offloaded to Web APIs." },
  { activeLine: 2, stackState: "global()", webApiState: "Expired!", macrotaskState: "cb() queued", elapsedMs: 0.5, action: "4. Web API Timer expires in background (0ms elapsed)", note: "cb() is pushed into the Macrotask Queue!" },
  { activeLine: 4, stackState: "blockThread(2000ms)", webApiState: "Idle", macrotaskState: "cb() waiting", elapsedMs: 1.0, action: "5. Line 4: Heavy synchronous loop begins", note: "CPU is locked in a tight synchronous calculation!" },
  { activeLine: 4, stackState: "blockThread(2000ms)", webApiState: "Idle", macrotaskState: "cb() waiting", elapsedMs: 500, action: "6. 500ms elapsed: cb() is STILL waiting in Queue!", note: "Even though 0ms was requested, cb cannot run while stack is busy." },
  { activeLine: 4, stackState: "blockThread(2000ms)", webApiState: "Idle", macrotaskState: "cb() waiting", elapsedMs: 1000, action: "7. 1000ms elapsed: Main thread remains blocked", note: "User clicks, animations, and timer callbacks are all suspended." },
  { activeLine: 4, stackState: "blockThread(2000ms)", webApiState: "Idle", macrotaskState: "cb() waiting", elapsedMs: 1500, action: "8. 1500ms elapsed: Stack continues executing loop", note: "Event loop CANNOT intervene until the current frame returns." },
  { activeLine: 4, stackState: "blockThread(2000ms)", webApiState: "Idle", macrotaskState: "cb() waiting", elapsedMs: 2000, action: "9. 2000ms elapsed: Heavy loop finally finishes!", note: "blockThread() pops off the Call Stack." },
  { activeLine: 5, stackState: "log('2. End')", webApiState: "Idle", macrotaskState: "cb() waiting", elapsedMs: 2000.5, action: "10. Line 5: console.log('2. End') executes", note: "Pushed to Call Stack and outputs to stdout." },
  { activeLine: 5, stackState: "Empty!", webApiState: "Idle", macrotaskState: "cb() waiting", elapsedMs: 2001, action: "11. Call Stack is now completely EMPTY!", note: "Event loop now has an opportunity to check queues!" },
  { activeLine: 2, stackState: "Empty!", webApiState: "Idle", macrotaskState: "Draining...", elapsedMs: 2001.2, action: "12. Event loop checks Microtask Queue first", note: "0 microtasks registered. Event loop moves to Macrotask Queue." },
  { activeLine: 2, stackState: "cb()", webApiState: "Idle", macrotaskState: "Empty", elapsedMs: 2001.5, action: "13. Event loop dequeues cb() onto Call Stack", note: "cb() finally gets its turn to execute on CPU!" },
  { activeLine: 2, stackState: "log('3. Timeout')", webApiState: "Idle", macrotaskState: "Empty", elapsedMs: 2002, action: "14. cb() executes: console.log('3. Timeout')", note: "Outputs '3. Timeout' to console!" },
  { activeLine: 2, stackState: "Empty", webApiState: "Idle", macrotaskState: "Empty", elapsedMs: 2002.5, action: "15. Total Delay: 2002ms instead of 0ms!", note: "Proof: setTimeout delay is only a MINIMUM threshold." },
  { activeLine: 0, stackState: "Idle", webApiState: "Idle", macrotaskState: "Empty", elapsedMs: 2002.5, action: "16. Golden Rule: Never block the Call Stack", note: "Long synchronous tasks delay all pending timers and user inputs." },
  { activeLine: 0, stackState: "Idle", webApiState: "Idle", macrotaskState: "Empty", elapsedMs: 2002.5, action: "17. setTimeout(fn, 0) is a yield tool", note: "Often used to defer non-urgent work to the next event loop turn." },
  { activeLine: 0, stackState: "Idle", webApiState: "Idle", macrotaskState: "Empty", elapsedMs: 2002.5, action: "18. Microtasks will ALWAYS jump ahead of setTimeout", note: "Promise callbacks always execute before cb(), even with 0ms delay!" },
  { activeLine: 0, stackState: "Idle", webApiState: "Idle", macrotaskState: "Empty", elapsedMs: 2002.5, action: "19. Solution for heavy tasks: Web Workers", note: "Run CPU-intensive algorithms on separate background threads." },
  { activeLine: 0, stackState: "Idle", webApiState: "Idle", macrotaskState: "Empty", elapsedMs: 2002.5, action: "20. The 0ms Myth Mastered!", note: "You now know the exact lifecycle of setTimeout." }
]

const currentIdx = computed(() => Math.min(Math.max(0, props.step), steps.length - 1))
const currentStep = computed(() => steps[currentIdx.value])

const codeLines = [
  "console.log('1. Start');",
  "setTimeout(() => console.log('3. Timeout'), 0);",
  "",
  "blockThreadFor(2000); // 2000ms synchronous loop",
  "console.log('2. End');"
]
</script>

<template>
  <div class="h-full flex flex-col justify-between select-none bg-white p-6 font-sans">
    <!-- Header -->
    <div>
      <div class="flex items-center justify-between mb-1">
        <div class="flex items-center gap-2">
          <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-900 border border-amber-300 uppercase tracking-wider">
            Outcome 3 • Slide 10/20
          </span>
          <span class="text-xs text-slate-500 font-medium font-mono">Timer Latency</span>
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
        <code>setTimeout(fn, 0)</code>: The Zero Millisecond Myth
      </h1>
      <p class="text-xs text-slate-600 font-medium">
        Why a 0ms timer takes 2000ms if the Call Stack is blocked by synchronous code.
      </p>
    </div>

    <!-- Active Action Banner -->
    <div class="bg-amber-50 border-2 border-amber-300 p-2 rounded-lg flex items-center justify-between text-xs">
      <div class="flex items-center gap-2 font-bold text-amber-950">
        <span class="text-amber-600">▶</span>
        <span>{{ currentStep.action }}</span>
      </div>
      <div class="flex items-center gap-2">
        <span class="text-[10px] font-mono font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded">
          Elapsed: {{ currentStep.elapsedMs }} ms
        </span>
        <span class="text-[10.5px] text-slate-500 font-medium">{{ currentStep.note }}</span>
      </div>
    </div>

    <!-- Main Grid: Code (Left) vs Engine State (Right) -->
    <div class="grid grid-cols-12 gap-3 my-1">
      <!-- Code Panel (5 Cols) -->
      <div class="col-span-5 bg-slate-950 rounded-xl p-3 text-slate-200 font-mono text-[10.5px] flex flex-col justify-between border border-slate-800">
        <div>
          <div class="text-[9px] uppercase tracking-wider text-slate-400 font-bold mb-2 pb-1 border-b border-slate-800 flex justify-between">
            <span>The 0ms Trap</span>
            <span class="text-amber-400">Thread Blocker</span>
          </div>
          <div class="space-y-1.5 leading-relaxed">
            <div
              v-for="(line, idx) in codeLines"
              :key="idx"
              class="px-2 py-0.5 rounded transition-all duration-200 flex items-center gap-2"
              :class="currentStep.activeLine === idx + 1
                ? 'bg-amber-500 text-slate-950 font-black ring-1 ring-amber-300 translate-x-1 shadow-sm'
                : 'text-slate-400'"
            >
              <span class="w-3 text-[9px] opacity-40 text-right">{{ idx + 1 }}</span>
              <span>{{ line || ' ' }}</span>
            </div>
          </div>
        </div>
        <div class="mt-2 pt-1 border-t border-slate-800 text-[9px] text-amber-300 truncate">
          Active Line: {{ currentStep.activeLine > 0 ? 'Line ' + currentStep.activeLine : 'Finished' }}
        </div>
      </div>

      <!-- Engine States (7 Cols) -->
      <div class="col-span-7 grid grid-cols-2 gap-2">
        <!-- Call Stack Box -->
        <div class="bg-blue-50/70 border-2 border-blue-300 rounded-xl p-2.5 flex flex-col justify-between">
          <div class="flex items-center justify-between text-[10px] font-black uppercase text-blue-950 mb-1">
            <span>⚡ Call Stack</span>
            <span class="text-[8px] bg-blue-200 px-1 rounded text-blue-900 font-bold">LIFO</span>
          </div>
          <div class="h-16 flex items-center justify-center p-2 bg-white rounded border border-blue-200 font-mono text-xs font-bold"
            :class="currentStep.stackState.includes('block') ? 'text-rose-600 bg-rose-50 border-rose-300' : 'text-blue-900'"
          >
            {{ currentStep.stackState }}
          </div>
          <div class="text-[8.5px] text-center text-blue-800 font-bold mt-1">
            Main Thread
          </div>
        </div>

        <!-- Macrotask Queue Box -->
        <div class="bg-amber-50/70 border-2 border-amber-300 rounded-xl p-2.5 flex flex-col justify-between">
          <div class="flex items-center justify-between text-[10px] font-black uppercase text-amber-950 mb-1">
            <span>⏳ Macrotask Queue</span>
            <span class="text-[8px] bg-amber-200 px-1 rounded text-amber-900 font-bold">FIFO</span>
          </div>
          <div class="h-16 flex items-center justify-center p-2 bg-white rounded border border-amber-200 font-mono text-xs font-bold"
            :class="currentStep.macrotaskState.includes('waiting') ? 'text-amber-700 bg-amber-50' : 'text-slate-600'"
          >
            {{ currentStep.macrotaskState }}
          </div>
          <div class="text-[8.5px] text-center text-amber-800 font-bold mt-1">
            Waiting for Stack
          </div>
        </div>

        <!-- Latency Formula Box (Spans 2 cols) -->
        <div class="col-span-2 bg-slate-900 text-white rounded-xl p-2.5 border border-slate-700">
          <div class="text-[9px] uppercase text-amber-400 font-bold mb-1">The True Latency Formula</div>
          <div class="font-mono text-xs text-emerald-400 font-bold">
            Actual Delay = Requested Delay (0ms) + OS Timer Wait + Stack Wait (2000ms)
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="flex items-center justify-between text-xs text-slate-500 border-t border-slate-200 pt-2 font-mono">
      <span>Module 3: setTimeout Internals • The 0ms Reality</span>
      <span class="text-slate-600 font-bold">Slide 10 / 20</span>
    </div>
  </div>
</template>
