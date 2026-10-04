<script setup lang="ts">
import { computed } from 'vue'

export interface QueueStateStep {
  microtasks: string[]
  macrotasks: string[]
  callStack: string
  activeQueue: 'microtask' | 'macrotask' | 'render' | 'stack' | 'none'
  action: string
  note: string
  specRule: string
}

const props = withDefaults(
  defineProps<{
    step?: number
    title?: string
  }>(),
  {
    step: 0,
    title: 'Two-Tier Concurrency: Microtasks vs Macrotasks',
  }
)

const steps: QueueStateStep[] = [
  {
    microtasks: [],
    macrotasks: [],
    callStack: "main() [Global Execution Context]",
    activeQueue: 'stack',
    action: "1. Global Script begins executing on Call Stack",
    note: "V8 allocates memory and runs synchronous script statements.",
    specRule: "Synchronous Execution"
  },
  {
    microtasks: [],
    macrotasks: ['setTimeout(cbA, 0)'],
    callStack: "main() -> setTimeout(cbA, 0)",
    activeQueue: 'macrotask',
    action: "2. Line 1: setTimeout(cbA, 0) invoked -> Offloaded to Web APIs",
    note: "Timer expires immediately (0ms) and pushes cbA to Macrotask Queue.",
    specRule: "Task Scheduled"
  },
  {
    microtasks: ['Promise.then(p1)'],
    macrotasks: ['setTimeout(cbA, 0)'],
    callStack: "main() -> Promise.resolve().then(p1)",
    activeQueue: 'microtask',
    action: "3. Line 2: Promise.resolve().then(p1) called",
    note: "p1 enters the VIP Microtask Queue. Jumps ahead of all timers!",
    specRule: "ECMA Job Enqueued"
  },
  {
    microtasks: ['Promise.then(p1)', 'queueMicrotask(p2)'],
    macrotasks: ['setTimeout(cbA, 0)'],
    callStack: "main() -> queueMicrotask(p2)",
    activeQueue: 'microtask',
    action: "4. Line 3: queueMicrotask(p2) invoked",
    note: "Standard Web API appends p2 directly into the Microtask VIP Queue.",
    specRule: "VIP Queue Appended"
  },
  {
    microtasks: ['Promise.then(p1)', 'queueMicrotask(p2)'],
    macrotasks: ['setTimeout(cbA, 0)', 'setTimeout(cbB, 0)'],
    callStack: "main() -> setTimeout(cbB, 0)",
    activeQueue: 'macrotask',
    action: "5. Line 4: setTimeout(cbB, 0) second timer scheduled",
    note: "cbB appended behind cbA in the Macrotask Queue (FIFO order).",
    specRule: "FIFO Macrotask"
  },
  {
    microtasks: ['Promise.then(p1)', 'queueMicrotask(p2)'],
    macrotasks: ['setTimeout(cbA, 0)', 'setTimeout(cbB, 0)'],
    callStack: "main() finishes -> Stack is EMPTY (0 frames)!",
    activeQueue: 'none',
    action: "6. Synchronous Script Finishes: Call Stack is 100% EMPTY!",
    note: "Event loop awakens to coordinate queued asynchronous callbacks.",
    specRule: "Call Stack Empty"
  },
  {
    microtasks: ['Promise.then(p1)', 'queueMicrotask(p2)'],
    macrotasks: ['setTimeout(cbA, 0)', 'setTimeout(cbB, 0)'],
    callStack: "Event Loop inspecting queues",
    activeQueue: 'microtask',
    action: "7. Event Loop Rule: Checks Microtask VIP Queue FIRST",
    note: "Microtasks have absolute priority over any macrotask or timer.",
    specRule: "Priority Law"
  },
  {
    microtasks: ['queueMicrotask(p2)'],
    macrotasks: ['setTimeout(cbA, 0)', 'setTimeout(cbB, 0)'],
    callStack: "p1() [Executing on Call Stack]",
    activeQueue: 'microtask',
    action: "8. Dequeue p1 to Call Stack -> Runs to completion",
    note: "p1 logs 'Promise 1'. Inside p1, it calls queueMicrotask(p3)!",
    specRule: "VIP Dequeue"
  },
  {
    microtasks: ['queueMicrotask(p2)', 'queueMicrotask(p3)'],
    macrotasks: ['setTimeout(cbA, 0)', 'setTimeout(cbB, 0)'],
    callStack: "p1() spawned p3",
    activeQueue: 'microtask',
    action: "9. Microtasks spawned DURING drain enter the CURRENT checkpoint!",
    note: "Crucial rule: newly spawned microtasks are processed in the same turn.",
    specRule: "Checkpoint Drain"
  },
  {
    microtasks: ['queueMicrotask(p3)'],
    macrotasks: ['setTimeout(cbA, 0)', 'setTimeout(cbB, 0)'],
    callStack: "p2() [Executing on Call Stack]",
    activeQueue: 'microtask',
    action: "10. Dequeue p2 to Call Stack -> Runs to completion",
    note: "p2 logs 'Microtask 2'. Queue depth drops to 1.",
    specRule: "VIP Dequeue"
  },
  {
    microtasks: [],
    macrotasks: ['setTimeout(cbA, 0)', 'setTimeout(cbB, 0)'],
    callStack: "p3() [Executing on Call Stack]",
    activeQueue: 'microtask',
    action: "11. Dequeue p3 to Call Stack -> Runs to completion",
    note: "Spawned microtask p3 executed. Queue reaches 0 pending.",
    specRule: "VIP Dequeue"
  },
  {
    microtasks: [],
    macrotasks: ['setTimeout(cbA, 0)', 'setTimeout(cbB, 0)'],
    callStack: "Empty (Microtasks 0)",
    activeQueue: 'none',
    action: "12. Microtask Queue is 100% EMPTY (0 Pending)",
    note: "Spec requirement met: Engine can now transition to Render Check.",
    specRule: "Drained Invariant"
  },
  {
    microtasks: [],
    macrotasks: ['setTimeout(cbA, 0)', 'setTimeout(cbB, 0)'],
    callStack: "Display Hardware V-Sync",
    activeQueue: 'render',
    action: "13. RENDER OPPORTUNITY #1: Screen Paints at 60 FPS",
    note: "Between microtask drain and the next macrotask, the browser updates UI!",
    specRule: "Render Window"
  },
  {
    microtasks: [],
    macrotasks: ['setTimeout(cbB, 0)'],
    callStack: "cbA() [Executing on Call Stack]",
    activeQueue: 'macrotask',
    action: "14. Event Loop picks EXACTLY ONE Macrotask: cbA()",
    note: "Task fairness guarantee: cbB MUST wait for the next turn!",
    specRule: "1 Task Per Turn"
  },
  {
    microtasks: [],
    macrotasks: ['setTimeout(cbB, 0)'],
    callStack: "cbA() complete",
    activeQueue: 'macrotask',
    action: "15. cbA() finishes and pops off the Call Stack",
    note: "Turn 1 completes. Event loop checks for newly spawned microtasks.",
    specRule: "Turn 1 Complete"
  },
  {
    microtasks: [],
    macrotasks: ['setTimeout(cbB, 0)'],
    callStack: "Checking VIP Queue (0 pending)",
    activeQueue: 'microtask',
    action: "16. Microtask Check: 0 microtasks pending",
    note: "Verified clear before next rendering check.",
    specRule: "Microtask Check"
  },
  {
    microtasks: [],
    macrotasks: ['setTimeout(cbB, 0)'],
    callStack: "Display Hardware V-Sync",
    activeQueue: 'render',
    action: "17. RENDER OPPORTUNITY #2: Frame Painted to Display",
    note: "Display delivers smooth 60 FPS frame between macrotasks.",
    specRule: "Render Window"
  },
  {
    microtasks: [],
    macrotasks: [],
    callStack: "cbB() [Executing on Call Stack]",
    activeQueue: 'macrotask',
    action: "18. Turn 2: Dequeue next Macrotask: cbB()",
    note: "cbB() runs to completion. Macrotask queue is now 100% empty.",
    specRule: "Turn 2 Dequeue"
  },
  {
    microtasks: [],
    macrotasks: [],
    callStack: "Empty",
    activeQueue: 'none',
    action: "19. Final State: All Queues and Call Stack completely cleared",
    note: "Execution summary: Microtasks drained 100%, Macrotasks yielded 1-by-1.",
    specRule: "Clean Slate"
  },
  {
    microtasks: [],
    macrotasks: [],
    callStack: "Empty",
    activeQueue: 'none',
    action: "20. Priority Law Mastered: Microtasks (Jobs) > Macrotasks (Tasks)",
    note: "You now understand why Promises always execute before setTimeout!",
    specRule: "Mastery Synthesis"
  }
]

const currentIdx = computed(() => Math.min(Math.max(0, props.step), steps.length - 1))
const currentStep = computed(() => steps[currentIdx.value])
const microtasks = computed(() => currentStep.value.microtasks)
const macrotasks = computed(() => currentStep.value.macrotasks)
const activeQueue = computed(() => currentStep.value.activeQueue)
</script>

<template>
  <div class="queue-visualizer-container bg-white border-2 border-slate-300 rounded-xl p-4 shadow-md font-mono text-slate-800 text-xs select-none">
    <!-- Header -->
    <div class="flex items-center justify-between pb-2 mb-2 border-b border-slate-200">
      <div class="flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full bg-purple-600 animate-pulse"></span>
        <span class="text-xs font-black text-slate-900 uppercase">{{ title }}</span>
      </div>
      <div class="flex items-center gap-2 text-[10px]">
        <span class="text-slate-500 font-bold">Step {{ currentIdx + 1 }} / {{ steps.length }}</span>
        <span class="px-2 py-0.5 rounded bg-purple-100 text-purple-900 border border-purple-300 font-bold">
          Microtasks: {{ microtasks.length }}
        </span>
        <span class="px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300 font-bold">
          Macrotasks: {{ macrotasks.length }}
        </span>
      </div>
    </div>

    <!-- Active Action Banner -->
    <div class="p-2 mb-2 rounded-lg border-2 flex items-center justify-between transition-all duration-300"
      :class="{
        'bg-purple-50 border-purple-300 text-purple-950 font-bold': activeQueue === 'microtask',
        'bg-amber-50 border-amber-300 text-amber-950 font-bold': activeQueue === 'macrotask',
        'bg-rose-50 border-rose-300 text-rose-950 font-bold': activeQueue === 'render',
        'bg-blue-50 border-blue-300 text-blue-950 font-bold': activeQueue === 'stack',
        'bg-slate-50 border-slate-200 text-slate-800': activeQueue === 'none',
      }"
    >
      <div class="flex items-center gap-2">
        <span class="text-purple-600 animate-pulse">▶</span>
        <span>{{ currentStep.action }}</span>
      </div>
      <div class="flex items-center gap-2">
        <span class="text-[9px] font-bold font-mono px-2 py-0.5 rounded bg-white border border-slate-300">
          {{ currentStep.specRule }}
        </span>
        <span class="text-[10px] opacity-80 font-normal">{{ currentStep.note }}</span>
      </div>
    </div>

    <!-- Two-Tier Visual Pipeline Lanes + Call Stack Status -->
    <div class="space-y-2 my-1">
      <!-- Call Stack Frame Bar -->
      <div class="p-2 rounded-lg border flex items-center justify-between transition-all duration-200"
        :class="activeQueue === 'stack' ? 'bg-blue-100 border-blue-400 font-bold' : 'bg-slate-50 border-slate-200 text-slate-700'"
      >
        <span class="text-[10px] font-bold text-blue-950 flex items-center gap-1.5">
          <span>⚡</span> Active Call Stack:
        </span>
        <span class="font-mono text-[9.5px] font-bold" :class="activeQueue === 'stack' ? 'text-blue-900' : 'text-slate-800'">
          {{ currentStep.callStack }}
        </span>
      </div>

      <!-- 1. Microtask VIP Lane (Purple) -->
      <div
        class="rounded-xl p-2.5 border-2 transition-all duration-300"
        :class="activeQueue === 'microtask'
          ? 'bg-purple-100/90 border-purple-600 shadow-md ring-2 ring-purple-300 scale-[1.01]'
          : 'bg-slate-50 border-slate-200'"
      >
        <div class="flex items-center justify-between mb-1.5">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-purple-600" :class="activeQueue === 'microtask' ? 'animate-ping' : ''"></span>
            <span class="font-black text-purple-950 text-xs uppercase tracking-wide">⭐ Microtask VIP Queue (Jobs)</span>
          </div>
          <span class="text-[8.5px] font-bold bg-purple-200 text-purple-900 px-2 py-0.5 rounded">
            Drained to 0 at every checkpoint
          </span>
        </div>

        <div class="flex gap-2 min-h-[38px] items-center p-1.5 bg-white rounded-lg border border-purple-200 overflow-x-auto">
          <div
            v-for="(task, idx) in microtasks"
            :key="task + idx"
            class="px-2.5 py-1 rounded text-[9.5px] font-mono font-bold transition-all duration-300 shadow-xs flex items-center gap-1"
            :class="idx === 0 && activeQueue === 'microtask'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white ring-2 ring-purple-400 animate-pulse'
              : 'bg-purple-50 text-purple-900 border border-purple-200'"
          >
            <span>{{ idx === 0 ? '👑 HEAD:' : '#' + (idx + 1) }}</span>
            <span>{{ task }}</span>
          </div>
          <div v-if="microtasks.length === 0" class="text-slate-400 italic text-[9.5px] py-1 px-2">
            (Microtask Queue is Empty • 100% Drained)
          </div>
        </div>
      </div>

      <!-- 2. Macrotask Task Lane (Amber) -->
      <div
        class="rounded-xl p-2.5 border-2 transition-all duration-300"
        :class="activeQueue === 'macrotask'
          ? 'bg-amber-100/90 border-amber-600 shadow-md ring-2 ring-amber-300 scale-[1.01]'
          : 'bg-slate-50 border-slate-200'"
      >
        <div class="flex items-center justify-between mb-1.5">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-amber-600" :class="activeQueue === 'macrotask' ? 'animate-ping' : ''"></span>
            <span class="font-black text-amber-950 text-xs uppercase tracking-wide">⏳ Macrotask Queue (Tasks)</span>
          </div>
          <span class="text-[8.5px] font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded">
            Only 1 task dequeued per turn
          </span>
        </div>

        <div class="flex gap-2 min-h-[38px] items-center p-1.5 bg-white rounded-lg border border-amber-200 overflow-x-auto">
          <div
            v-for="(task, idx) in macrotasks"
            :key="task + idx"
            class="px-2.5 py-1 rounded text-[9.5px] font-mono font-bold transition-all duration-300 shadow-xs flex items-center gap-1"
            :class="idx === 0 && activeQueue === 'macrotask'
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 ring-2 ring-amber-400 font-black animate-pulse'
              : 'bg-amber-50 text-amber-950 border border-amber-200'"
          >
            <span>{{ idx === 0 ? '👑 HEAD:' : '#' + (idx + 1) }}</span>
            <span>{{ task }}</span>
          </div>
          <div v-if="macrotasks.length === 0" class="text-slate-400 italic text-[9.5px] py-1 px-2">
            (Macrotask Queue is Empty)
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Priority Law Banner -->
    <div class="p-2 bg-slate-100 rounded-lg border border-slate-300 flex items-center justify-between text-[9.5px]">
      <span class="font-bold text-slate-800">Priority Law: Microtasks (Jobs) always drain BEFORE the next Macrotask turn</span>
      <span class="font-mono text-purple-700 font-bold">ECMA-262 VIP Invariant</span>
    </div>
  </div>
</template>
