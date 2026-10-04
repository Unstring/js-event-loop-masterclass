<script setup lang="ts">
import { computed } from 'vue'

export interface SimStep {
  line?: number
  action: string
  stack: string[]
  webApis?: { name: string; time?: string }[]
  microtasks?: string[]
  macrotasks?: string[]
  logs: string[]
  phase: 'stack' | 'webapi' | 'microtask' | 'render' | 'macrotask' | 'idle'
  note?: string
}

const props = withDefaults(
  defineProps<{
    step?: number
    scenario?: 'mystery' | 'starvation' | 'async_await' | 'grand' | 'custom'
    code?: string[]
    steps?: SimStep[]
    title?: string
  }>(),
  {
    step: 0,
    scenario: 'mystery',
    title: 'Interactive JavaScript Runtime Engine Simulator'
  }
)

// Pre-packaged rich scenarios with 20-25 micro-steps
const mysterySteps: SimStep[] = [
  { line: 1, action: "Engine initializes Global Execution Context", stack: ['global()'], webApis: [], microtasks: [], macrotasks: [], logs: [], phase: 'stack', note: 'Call Stack initialized with global frame.' },
  { line: 1, action: "Line 1: console.log('1. Start')", stack: ['global()', "log('1. Start')"], webApis: [], microtasks: [], macrotasks: [], logs: [], phase: 'stack', note: 'Pushed to Call Stack.' },
  { line: 1, action: "Executes console.log('1. Start') -> stdout", stack: ['global()'], webApis: [], microtasks: [], macrotasks: [], logs: ['1. Start'], phase: 'stack', note: 'Popped from Call Stack. Output emitted.' },
  { line: 3, action: "Line 3: setTimeout(cb, 0) encountered", stack: ['global()', 'setTimeout(cb, 0)'], webApis: [], microtasks: [], macrotasks: [], logs: ['1. Start'], phase: 'stack', note: 'Browser API called.' },
  { line: 3, action: "setTimeout handed off to Web APIs background thread", stack: ['global()'], webApis: [{ name: 'Timer(0ms)', time: '0ms' }], microtasks: [], macrotasks: [], logs: ['1. Start'], phase: 'webapi', note: 'Offloaded! JS thread continues immediately.' },
  { line: 3, action: "Web API Timer expires immediately in background", stack: ['global()'], webApis: [], microtasks: [], macrotasks: ['timerCb()'], logs: ['1. Start'], phase: 'macrotask', note: 'Callback queued in Macrotask (Task) Queue.' },
  { line: 5, action: "Line 5: Promise.resolve().then(pCb) encountered", stack: ['global()', 'Promise.resolve()'], webApis: [], microtasks: [], macrotasks: ['timerCb()'], logs: ['1. Start'], phase: 'stack', note: 'Promise resolves synchronously.' },
  { line: 5, action: ".then() registers PromiseReactionJob into Microtasks", stack: ['global()'], webApis: [], microtasks: ['pCb()'], macrotasks: ['timerCb()'], logs: ['1. Start'], phase: 'microtask', note: 'Queued to VIP Microtask Queue!' },
  { line: 7, action: "Line 7: queueMicrotask(qCb) encountered", stack: ['global()', 'queueMicrotask()'], webApis: [], microtasks: ['pCb()'], macrotasks: ['timerCb()'], logs: ['1. Start'], phase: 'stack', note: 'Direct microtask API called.' },
  { line: 7, action: "qCb queued into Microtask Queue", stack: ['global()'], webApis: [], microtasks: ['pCb()', 'qCb()'], macrotasks: ['timerCb()'], logs: ['1. Start'], phase: 'microtask', note: 'Microtask queue now has 2 tasks.' },
  { line: 9, action: "Line 9: console.log('2. End') encountered", stack: ['global()', "log('2. End')"], webApis: [], microtasks: ['pCb()', 'qCb()'], macrotasks: ['timerCb()'], logs: ['1. Start'], phase: 'stack', note: 'Pushed to Call Stack.' },
  { line: 9, action: "Executes console.log('2. End') -> stdout", stack: ['global()'], webApis: [], microtasks: ['pCb()', 'qCb()'], macrotasks: ['timerCb()'], logs: ['1. Start', '2. End'], phase: 'stack', note: 'Popped from stack.' },
  { line: 9, action: "global() finishes! Call Stack is now EMPTY!", stack: [], webApis: [], microtasks: ['pCb()', 'qCb()'], macrotasks: ['timerCb()'], logs: ['1. Start', '2. End'], phase: 'idle', note: 'Call Stack Empty! Event Loop Checkpoint reached!' },
  { line: 5, action: "EVENT LOOP: Inspects Microtasks FIRST (VIP queue)", stack: [], webApis: [], microtasks: ['pCb()', 'qCb()'], macrotasks: ['timerCb()'], logs: ['1. Start', '2. End'], phase: 'microtask', note: 'Microtasks ALWAYS run before any macrotask.' },
  { line: 5, action: "Dequeues pCb() to Call Stack", stack: ['pCb()'], webApis: [], microtasks: ['qCb()'], macrotasks: ['timerCb()'], logs: ['1. Start', '2. End'], phase: 'stack', note: 'Pushed to Stack for execution.' },
  { line: 5, action: "pCb() executes: console.log('3. Promise')", stack: ['pCb()', "log('3. Promise')"], webApis: [], microtasks: ['qCb()'], macrotasks: ['timerCb()'], logs: ['1. Start', '2. End'], phase: 'stack', note: 'Executing promise callback.' },
  { line: 5, action: "pCb() finished & popped!", stack: [], webApis: [], microtasks: ['qCb()'], macrotasks: ['timerCb()'], logs: ['1. Start', '2. End', '3. Promise'], phase: 'microtask', note: 'Popped. Checks if more microtasks exist...' },
  { line: 7, action: "Microtask Queue NOT empty: Dequeues qCb()", stack: ['qCb()'], webApis: [], microtasks: [], macrotasks: ['timerCb()'], logs: ['1. Start', '2. End', '3. Promise'], phase: 'stack', note: 'Microtask queue must drain to 100%!' },
  { line: 7, action: "qCb() executes: console.log('4. Microtask')", stack: ['qCb()', "log('4. Microtask')"], webApis: [], microtasks: [], macrotasks: ['timerCb()'], logs: ['1. Start', '2. End', '3. Promise'], phase: 'stack', note: 'Executing microtask callback.' },
  { line: 7, action: "qCb() finished & popped! Microtasks: 0!", stack: [], webApis: [], microtasks: [], macrotasks: ['timerCb()'], logs: ['1. Start', '2. End', '3. Promise', '4. Microtask'], phase: 'render', note: 'Microtasks fully drained! Render check occurs.' },
  { line: 3, action: "EVENT LOOP: Checks Macrotask Queue. Picks timerCb()", stack: ['timerCb()'], webApis: [], microtasks: [], macrotasks: [], logs: ['1. Start', '2. End', '3. Promise', '4. Microtask'], phase: 'stack', note: 'Dequeues ONE macrotask to Call Stack.' },
  { line: 3, action: "timerCb() executes: console.log('5. Timeout')", stack: ['timerCb()', "log('5. Timeout')"], webApis: [], microtasks: [], macrotasks: [], logs: ['1. Start', '2. End', '3. Promise', '4. Microtask'], phase: 'stack', note: 'Executing timer callback.' },
  { line: 3, action: "timerCb() completes and pops! All queues empty!", stack: [], webApis: [], microtasks: [], macrotasks: [], logs: ['1. Start', '2. End', '3. Promise', '4. Microtask', '5. Timeout'], phase: 'idle', note: 'Cycle complete! Final Order: 1 -> 2 -> 3 -> 4 -> 5' }
]

const mysteryCode = [
  "console.log('1. Start');",
  "",
  "setTimeout(() => console.log('5. Timeout'), 0);",
  "",
  "Promise.resolve().then(() => console.log('3. Promise'));",
  "",
  "queueMicrotask(() => console.log('4. Microtask'));",
  "",
  "console.log('2. End');"
]

const activeSteps = computed(() => {
  if (props.steps && props.steps.length > 0) return props.steps
  return mysterySteps
})

const activeCode = computed(() => {
  if (props.code && props.code.length > 0) return props.code
  return mysteryCode
})

const currentIdx = computed(() => {
  return Math.min(Math.max(0, props.step), activeSteps.value.length - 1)
})

const currentStep = computed(() => activeSteps.value[currentIdx.value])
</script>

<template>
  <div class="runtime-simulator bg-white border-2 border-slate-300 rounded-xl p-3 shadow-md font-mono text-slate-800 text-xs select-none">
    <!-- Top Bar: Title + Phase Badge + Stepper Indicator -->
    <div class="flex items-center justify-between pb-2 mb-2 border-b border-slate-200">
      <div class="flex items-center gap-2">
        <span class="w-3 h-3 rounded-full bg-indigo-600 animate-ping"></span>
        <span class="font-extrabold text-xs uppercase tracking-tight text-slate-900">{{ title }}</span>
      </div>
      <div class="flex items-center gap-2">
        <div class="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider"
          :class="{
            'bg-blue-100 text-blue-900 border border-blue-300': currentStep.phase === 'stack',
            'bg-emerald-100 text-emerald-900 border border-emerald-300': currentStep.phase === 'webapi',
            'bg-purple-100 text-purple-900 border border-purple-300 ring-2 ring-purple-300': currentStep.phase === 'microtask',
            'bg-pink-100 text-pink-900 border border-pink-300': currentStep.phase === 'render',
            'bg-amber-100 text-amber-900 border border-amber-300': currentStep.phase === 'macrotask',
            'bg-slate-100 text-slate-700 border border-slate-300': currentStep.phase === 'idle',
          }"
        >
          Phase: {{ currentStep.phase }}
        </div>
        <div class="bg-indigo-50 text-indigo-900 border border-indigo-200 px-2 py-0.5 rounded text-[10px] font-black">
          Step {{ currentIdx + 1 }} / {{ activeSteps.length }}
        </div>
      </div>
    </div>

    <!-- Main Grid: Code (Left) | Engine Units (Right) -->
    <div class="grid grid-cols-12 gap-2.5 items-stretch min-h-[220px]">
      
      <!-- Left: Code Panel (4 Cols) -->
      <div class="col-span-4 bg-slate-950 rounded-lg p-2.5 text-slate-200 font-mono text-[10px] flex flex-col justify-between border border-slate-800 shadow-inner">
        <div>
          <div class="text-[9px] uppercase tracking-wider text-slate-400 font-bold mb-1.5 pb-1 border-b border-slate-800 flex justify-between items-center">
            <span>JavaScript Source</span>
            <span class="text-amber-400 font-mono">JS Single Thread</span>
          </div>
          <div class="space-y-0.5 leading-relaxed">
            <div
              v-for="(line, idx) in activeCode"
              :key="idx"
              class="px-1.5 py-0.5 rounded transition-all duration-200 flex items-center gap-1.5"
              :class="currentStep.line === idx + 1
                ? 'bg-indigo-600/90 text-white font-bold ring-1 ring-indigo-300 translate-x-1 shadow-sm'
                : 'text-slate-400 hover:text-slate-300'"
            >
              <span class="w-3 text-[9px] opacity-40 select-none text-right">{{ idx + 1 }}</span>
              <span class="truncate">{{ line || ' ' }}</span>
            </div>
          </div>
        </div>
        <div class="mt-2 pt-1 border-t border-slate-800 text-[9px] text-indigo-300 truncate">
          ▶ {{ currentStep.action }}
        </div>
      </div>

      <!-- Right: The Engine Architecture (8 Cols) -->
      <div class="col-span-8 grid grid-cols-12 gap-2">
        
        <!-- Call Stack (4 Cols) -->
        <div class="col-span-4 bg-blue-50/70 border-2 rounded-lg p-2 flex flex-col justify-between transition-all duration-300"
          :class="currentStep.phase === 'stack' ? 'border-blue-500 ring-2 ring-blue-300 bg-blue-50 shadow-sm' : 'border-blue-200'"
        >
          <div>
            <div class="flex items-center justify-between text-[10px] font-black text-blue-950 uppercase mb-1">
              <span class="flex items-center gap-1"><span>⚡</span> Call Stack</span>
              <span class="text-[8.5px] bg-blue-200 px-1 rounded text-blue-900 font-bold">LIFO</span>
            </div>
            <div class="flex flex-col-reverse gap-1 min-h-[95px] max-h-[105px] overflow-hidden p-1 bg-white/80 rounded border border-blue-200">
              <TransitionGroup name="stack-pop">
                <div
                  v-for="(frame, fIdx) in currentStep.stack"
                  :key="frame + fIdx"
                  class="px-1.5 py-0.5 rounded text-[9.5px] font-bold shadow-xs truncate text-center"
                  :class="fIdx === currentStep.stack.length - 1
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white ring-1 ring-blue-400'
                    : 'bg-blue-100 text-blue-900 border border-blue-200'"
                >
                  {{ frame }}
                </div>
              </TransitionGroup>
              <div v-if="currentStep.stack.length === 0" class="h-full flex items-center justify-center text-slate-400 text-[10px] italic py-4">
                (Stack Empty)
              </div>
            </div>
          </div>
          <div class="text-[8.5px] text-blue-800 text-center font-bold mt-1">
            Frames: {{ currentStep.stack.length }}
          </div>
        </div>

        <!-- Web APIs & Background Threads (4 Cols) -->
        <div class="col-span-4 bg-emerald-50/70 border-2 rounded-lg p-2 flex flex-col justify-between transition-all duration-300"
          :class="currentStep.phase === 'webapi' ? 'border-emerald-500 ring-2 ring-emerald-300 bg-emerald-50 shadow-sm' : 'border-emerald-200'"
        >
          <div>
            <div class="flex items-center justify-between text-[10px] font-black text-emerald-950 uppercase mb-1">
              <span class="flex items-center gap-1"><span>🌐</span> Web APIs</span>
              <span class="text-[8.5px] bg-emerald-200 px-1 rounded text-emerald-900 font-bold">OS Threads</span>
            </div>
            <div class="flex flex-col gap-1 min-h-[95px] max-h-[105px] overflow-hidden p-1 bg-white/80 rounded border border-emerald-200">
              <div
                v-for="(api, aIdx) in currentStep.webApis || []"
                :key="aIdx"
                class="px-1.5 py-0.5 rounded text-[9.5px] font-bold bg-emerald-100 text-emerald-950 border border-emerald-300 flex items-center justify-between shadow-xs"
              >
                <span>{{ api.name }}</span>
                <span class="text-[8.5px] text-emerald-700 font-mono">{{ api.time }}</span>
              </div>
              <div v-if="!currentStep.webApis || currentStep.webApis.length === 0" class="h-full flex items-center justify-center text-slate-400 text-[10px] italic py-4">
                (No Active APIs)
              </div>
            </div>
          </div>
          <div class="text-[8.5px] text-emerald-800 text-center font-bold mt-1">
            Background Timers / I/O
          </div>
        </div>

        <!-- Console stdout (4 Cols) -->
        <div class="col-span-4 bg-slate-900 border-2 border-slate-700 rounded-lg p-2 flex flex-col justify-between text-white">
          <div>
            <div class="flex items-center justify-between text-[10px] font-black uppercase text-emerald-400 mb-1">
              <span class="flex items-center gap-1"><span>📟</span> Console stdout</span>
              <span class="text-[8.5px] bg-slate-800 text-emerald-300 px-1 rounded">Live</span>
            </div>
            <div class="flex flex-col gap-0.5 min-h-[95px] max-h-[105px] overflow-hidden p-1 bg-black/60 rounded border border-slate-800 font-mono text-[9px]">
              <div
                v-for="(log, lIdx) in currentStep.logs"
                :key="lIdx"
                class="text-emerald-400 flex items-center gap-1 animate-pulse"
              >
                <span class="text-slate-500">></span>
                <span>{{ log }}</span>
              </div>
              <div v-if="currentStep.logs.length === 0" class="text-slate-600 text-[9px] italic py-4 text-center">
                (Waiting for output...)
              </div>
            </div>
          </div>
          <div class="text-[8.5px] text-slate-400 text-center font-mono mt-1">
            Logs: {{ currentStep.logs.length }}
          </div>
        </div>

        <!-- Microtask Queue (VIP) (6 Cols) -->
        <div class="col-span-6 bg-purple-50/80 border-2 rounded-lg p-2 flex flex-col justify-between transition-all duration-300"
          :class="currentStep.phase === 'microtask' ? 'border-purple-500 ring-2 ring-purple-300 bg-purple-50 shadow-sm' : 'border-purple-200'"
        >
          <div>
            <div class="flex items-center justify-between text-[10px] font-black text-purple-950 uppercase mb-1">
              <span class="flex items-center gap-1"><span>⭐</span> Microtask Queue (VIP)</span>
              <span class="text-[8px] bg-purple-200 text-purple-900 px-1 rounded font-bold">100% Drain</span>
            </div>
            <div class="flex items-center gap-1 overflow-x-auto min-h-[32px] p-1 bg-white/90 rounded border border-purple-200">
              <div
                v-for="(m, mIdx) in currentStep.microtasks || []"
                :key="mIdx"
                class="px-2 py-0.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded text-[9px] font-bold shadow-xs whitespace-nowrap"
              >
                {{ m }}
              </div>
              <div v-if="!currentStep.microtasks || currentStep.microtasks.length === 0" class="text-slate-400 text-[9px] italic py-1 px-2">
                (Empty - 0 Microtasks)
              </div>
            </div>
          </div>
        </div>

        <!-- Macrotask Queue (Task Queue) (6 Cols) -->
        <div class="col-span-6 bg-amber-50/80 border-2 rounded-lg p-2 flex flex-col justify-between transition-all duration-300"
          :class="currentStep.phase === 'macrotask' ? 'border-amber-500 ring-2 ring-amber-300 bg-amber-50 shadow-sm' : 'border-amber-200'"
        >
          <div>
            <div class="flex items-center justify-between text-[10px] font-black text-amber-950 uppercase mb-1">
              <span class="flex items-center gap-1"><span>⏳</span> Macrotask Queue (Tasks)</span>
              <span class="text-[8px] bg-amber-200 text-amber-900 px-1 rounded font-bold">1 per turn</span>
            </div>
            <div class="flex items-center gap-1 overflow-x-auto min-h-[32px] p-1 bg-white/90 rounded border border-amber-200">
              <div
                v-for="(task, tIdx) in currentStep.macrotasks || []"
                :key="tIdx"
                class="px-2 py-0.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded text-[9px] font-bold shadow-xs whitespace-nowrap"
              >
                {{ task }}
              </div>
              <div v-if="!currentStep.macrotasks || currentStep.macrotasks.length === 0" class="text-slate-400 text-[9px] italic py-1 px-2">
                (Empty - 0 Tasks)
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- Bottom Stepper / Note Bar -->
    <div class="mt-2 pt-1.5 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-700 bg-slate-50 px-2 py-1 rounded">
      <div class="flex items-center gap-1.5 font-bold">
        <span class="text-indigo-600">💡 State:</span>
        <span>{{ currentStep.note || currentStep.action }}</span>
      </div>
      <div class="text-[9px] text-slate-400 font-mono">
        Press Space / ➔ to advance ({{ currentIdx + 1 }}/{{ activeSteps.length }})
      </div>
    </div>
  </div>
</template>

<style scoped>
.stack-pop-enter-active,
.stack-pop-leave-active {
  transition: all 0.25s ease-out;
}
.stack-pop-enter-from {
  opacity: 0;
  transform: translateY(-12px) scale(0.95);
}
.stack-pop-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.9);
}
</style>
