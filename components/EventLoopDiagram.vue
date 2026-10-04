<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    step?: number
    title?: string
  }>(),
  {
    step: 0,
    title: 'The Event Loop: The Infinite Non-Blocking Heartbeat',
  }
)

interface Step {
  activePhase: 'stack' | 'webapi' | 'microtask' | 'render' | 'macrotask' | 'idle'
  action: string
  note: string
  stackFrames: string[]
  webApiTasks: { name: string; delay: string; status: 'active' | 'done' }[]
  microtasks: string[]
  macrotasks: string[]
  renderStatus: { active: boolean; fps: string; text: string }
  loopAngle: number
}

const steps: Step[] = [
  {
    activePhase: 'stack',
    action: "1. Global Script Execution begins: main() pushes to Stack",
    note: "V8 allocates Global Execution Context on the single thread Call Stack.",
    stackFrames: ['main()'],
    webApiTasks: [],
    microtasks: [],
    macrotasks: [],
    renderStatus: { active: false, fps: "60 FPS", text: "Display buffer ready" },
    loopAngle: 0
  },
  {
    activePhase: 'stack',
    action: "2. Line 1: console.log('1. Start') runs synchronously",
    note: "Direct execution on CPU. Outputs '1. Start' to stdout.",
    stackFrames: ['main()', "console.log('1. Start')"],
    webApiTasks: [],
    microtasks: [],
    macrotasks: [],
    renderStatus: { active: false, fps: "60 FPS", text: "Display buffer ready" },
    loopAngle: 15
  },
  {
    activePhase: 'webapi',
    action: "3. Line 2: setTimeout(cbA, 10) offloaded to Web APIs",
    note: "V8 requests hardware timer from browser/libuv. Stack does NOT wait!",
    stackFrames: ['main()'],
    webApiTasks: [{ name: "Timer(cbA)", delay: "10ms", status: 'active' }],
    microtasks: [],
    macrotasks: [],
    renderStatus: { active: false, fps: "60 FPS", text: "Display buffer ready" },
    loopAngle: 72
  },
  {
    activePhase: 'stack',
    action: "4. Line 3: Promise.resolve().then(micro1) registered",
    note: "ECMAScript PromiseReactionJob created for micro1 callback.",
    stackFrames: ['main()', "Promise.then(micro1)"],
    webApiTasks: [{ name: "Timer(cbA)", delay: "8ms", status: 'active' }],
    microtasks: [],
    macrotasks: [],
    renderStatus: { active: false, fps: "60 FPS", text: "Display buffer ready" },
    loopAngle: 90
  },
  {
    activePhase: 'microtask',
    action: "5. micro1 enqueued into Microtask VIP Queue",
    note: "Promises bypass the macrotask queue completely into VIP lane!",
    stackFrames: ['main()'],
    webApiTasks: [{ name: "Timer(cbA)", delay: "6ms", status: 'active' }],
    microtasks: ['micro1()'],
    macrotasks: [],
    renderStatus: { active: false, fps: "60 FPS", text: "Display buffer ready" },
    loopAngle: 144
  },
  {
    activePhase: 'microtask',
    action: "6. Line 4: queueMicrotask(micro2) enqueued",
    note: "Direct microtask scheduling API appends micro2 to the queue.",
    stackFrames: ['main()'],
    webApiTasks: [{ name: "Timer(cbA)", delay: "4ms", status: 'active' }],
    microtasks: ['micro1()', 'micro2()'],
    macrotasks: [],
    renderStatus: { active: false, fps: "60 FPS", text: "Display buffer ready" },
    loopAngle: 150
  },
  {
    activePhase: 'stack',
    action: "7. Line 5: console.log('2. End') runs synchronously",
    note: "Outputs '2. End' to stdout. Synchronous code completed!",
    stackFrames: ['main()', "console.log('2. End')"],
    webApiTasks: [{ name: "Timer(cbA)", delay: "2ms", status: 'active' }],
    microtasks: ['micro1()', 'micro2()'],
    macrotasks: [],
    renderStatus: { active: false, fps: "60 FPS", text: "Display buffer ready" },
    loopAngle: 20
  },
  {
    activePhase: 'stack',
    action: "8. main() returns: Call Stack is completely EMPTY (0 frames)!",
    note: "Crucial moment: The Event Loop is awakened to coordinate queues!",
    stackFrames: [],
    webApiTasks: [{ name: "Timer(cbA)", delay: "1ms", status: 'active' }],
    microtasks: ['micro1()', 'micro2()'],
    macrotasks: [],
    renderStatus: { active: false, fps: "60 FPS", text: "Display buffer ready" },
    loopAngle: 180
  },
  {
    activePhase: 'microtask',
    action: "9. Event Loop Phase 1: Microtask VIP Checkpoint",
    note: "Priority Law: The Event Loop ALWAYS drains Microtasks before Macrotasks!",
    stackFrames: [],
    webApiTasks: [{ name: "Timer(cbA)", delay: "0ms (Due)", status: 'done' }],
    microtasks: ['micro1()', 'micro2()'],
    macrotasks: [],
    renderStatus: { active: false, fps: "60 FPS", text: "Display buffer ready" },
    loopAngle: 144
  },
  {
    activePhase: 'microtask',
    action: "10. Dequeue micro1 onto Call Stack -> Executes to completion",
    note: "micro1 logs 'Promise fulfilled'. Pops off stack upon finish.",
    stackFrames: ['micro1()'],
    webApiTasks: [],
    microtasks: ['micro2()'],
    macrotasks: ['cbA() [Timer Expired]'],
    renderStatus: { active: false, fps: "60 FPS", text: "Display buffer ready" },
    loopAngle: 160
  },
  {
    activePhase: 'microtask',
    action: "11. Dequeue micro2 onto Call Stack -> Executes to completion",
    note: "micro2 logs 'queueMicrotask executed'. Pops off stack.",
    stackFrames: ['micro2()'],
    webApiTasks: [],
    microtasks: [],
    macrotasks: ['cbA() [Timer Expired]'],
    renderStatus: { active: false, fps: "60 FPS", text: "Display buffer ready" },
    loopAngle: 170
  },
  {
    activePhase: 'microtask',
    action: "12. Microtask Queue 100% DRAINED (0 pending)!",
    note: "Spec Invariant satisfied: The engine can now transition to Render Check.",
    stackFrames: [],
    webApiTasks: [],
    microtasks: [],
    macrotasks: ['cbA() [Timer Expired]'],
    renderStatus: { active: false, fps: "60 FPS", text: "Microtasks verified 0" },
    loopAngle: 180
  },
  {
    activePhase: 'render',
    action: "13. Event Loop Phase 2: RENDER OPPORTUNITY (V-Sync Check)",
    note: "Hardware screen refresh pulse arrives (16.6ms at 60Hz / 8.3ms at 120Hz).",
    stackFrames: [],
    webApiTasks: [],
    microtasks: [],
    macrotasks: ['cbA() [Timer Expired]'],
    renderStatus: { active: true, fps: "60 FPS", text: "🎨 requestAnimationFrame -> Style -> Layout -> Paint" },
    loopAngle: 216
  },
  {
    activePhase: 'render',
    action: "14. Frame Painted to Screen! UI is smooth & stutter-free",
    note: "Browser delivers pixel buffer to GPU compositor before touching Macrotasks.",
    stackFrames: [],
    webApiTasks: [],
    microtasks: [],
    macrotasks: ['cbA() [Timer Expired]'],
    renderStatus: { active: true, fps: "60 FPS", text: "✔ Frame Buffer Swapped (16.6ms budget met)" },
    loopAngle: 230
  },
  {
    activePhase: 'macrotask',
    action: "15. Event Loop Phase 3: Inspects Macrotask Queue",
    note: "Event loop sees 1 pending macrotask: cbA() from setTimeout.",
    stackFrames: [],
    webApiTasks: [],
    microtasks: [],
    macrotasks: ['cbA()'],
    renderStatus: { active: false, fps: "60 FPS", text: "Waiting next frame" },
    loopAngle: 288
  },
  {
    activePhase: 'macrotask',
    action: "16. Event Loop picks EXACTLY ONE Macrotask: cbA()",
    note: "Strict Fairness Law: Only 1 macrotask dequeues per turn to prevent starvation.",
    stackFrames: ['cbA() [Executing]'],
    webApiTasks: [],
    microtasks: [],
    macrotasks: [],
    renderStatus: { active: false, fps: "60 FPS", text: "Waiting next frame" },
    loopAngle: 300
  },
  {
    activePhase: 'stack',
    action: "17. cbA() executes on Call Stack: console.log('3. Timeout')",
    note: "Outputs '3. Timeout' to console. Runs to completion.",
    stackFrames: ['cbA()', "console.log('3. Timeout')"],
    webApiTasks: [],
    microtasks: [],
    macrotasks: [],
    renderStatus: { active: false, fps: "60 FPS", text: "Waiting next frame" },
    loopAngle: 330
  },
  {
    activePhase: 'stack',
    action: "18. cbA() pops: Call Stack is EMPTY once again!",
    note: "Current turn completes. Event loop checks for newly spawned microtasks.",
    stackFrames: [],
    webApiTasks: [],
    microtasks: [],
    macrotasks: [],
    renderStatus: { active: false, fps: "60 FPS", text: "Waiting next frame" },
    loopAngle: 350
  },
  {
    activePhase: 'idle',
    action: "19. Infinite Loop Heartbeat: Ready for new OS events",
    note: "All queues empty. Engine enters power-saving sleep until next interrupt.",
    stackFrames: [],
    webApiTasks: [],
    microtasks: [],
    macrotasks: [],
    renderStatus: { active: false, fps: "60 FPS", text: "Power-saving sleep" },
    loopAngle: 360
  },
  {
    activePhase: 'idle',
    action: "20. Master Summary: Stack -> Microtasks -> Render -> 1 Macrotask",
    note: "The universal 4-step heartbeat of JavaScript asynchronous execution!",
    stackFrames: [],
    webApiTasks: [],
    microtasks: [],
    macrotasks: [],
    renderStatus: { active: false, fps: "60 FPS", text: "Heartbeat Cycle Mastered" },
    loopAngle: 360
  }
]

const currentIdx = computed(() => Math.min(Math.max(0, props.step), steps.length - 1))
const currentStep = computed(() => steps[currentIdx.value])
const activePhase = computed(() => currentStep.value.activePhase)
</script>

<template>
  <div class="event-loop-box bg-white border-2 border-slate-300 rounded-xl p-4 shadow-md font-mono text-slate-800 text-xs select-none">
    <!-- Header -->
    <div class="flex items-center justify-between pb-2 mb-2 border-b border-slate-200">
      <div class="flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
        <span class="text-xs uppercase font-extrabold text-slate-900">{{ title }}</span>
      </div>
      <div class="flex items-center gap-2 text-[10px]">
        <span class="text-slate-500 font-bold">Step {{ currentIdx + 1 }} / {{ steps.length }}</span>
        <span class="font-extrabold uppercase px-2 py-0.5 rounded border transition-all duration-200"
          :class="{
            'bg-blue-100 text-blue-900 border-blue-300': activePhase === 'stack',
            'bg-emerald-100 text-emerald-900 border-emerald-300': activePhase === 'webapi',
            'bg-purple-100 text-purple-900 border-purple-300 ring-2 ring-purple-300': activePhase === 'microtask',
            'bg-rose-100 text-rose-900 border-rose-300 ring-2 ring-rose-300': activePhase === 'render',
            'bg-amber-100 text-amber-900 border-amber-300': activePhase === 'macrotask',
            'bg-slate-100 text-slate-800 border-slate-300': activePhase === 'idle',
          }"
        >
          Phase: {{ activePhase.toUpperCase() }}
        </span>
      </div>
    </div>

    <!-- Active Step Banner -->
    <div class="p-2 mb-2 rounded-lg border-2 flex items-center justify-between transition-all duration-300"
      :class="{
        'bg-blue-50 border-blue-300 text-blue-950 font-bold': activePhase === 'stack',
        'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold': activePhase === 'webapi',
        'bg-purple-50 border-purple-300 text-purple-950 font-bold': activePhase === 'microtask',
        'bg-rose-50 border-rose-300 text-rose-950 font-bold': activePhase === 'render',
        'bg-amber-50 border-amber-300 text-amber-950 font-bold': activePhase === 'macrotask',
        'bg-slate-50 border-slate-200 text-slate-800': activePhase === 'idle',
      }"
    >
      <div class="flex items-center gap-2">
        <span class="text-amber-600 animate-pulse">▶</span>
        <span>{{ currentStep.action }}</span>
      </div>
      <span class="text-[10px] opacity-80 font-normal">{{ currentStep.note }}</span>
    </div>

    <!-- Main Diagram Grid: Call Stack (4) | Event Loop Hub (4) | Web APIs (4) -->
    <div class="grid grid-cols-12 gap-2.5 items-center relative py-1">
      
      <!-- 1. Call Stack (Left, 4 Cols) -->
      <div
        class="col-span-4 rounded-xl p-3 border-2 transition-all duration-300 flex flex-col justify-between h-[155px]"
        :class="activePhase === 'stack'
          ? 'bg-blue-50/90 border-blue-500 shadow-md ring-2 ring-blue-300 scale-[1.02]'
          : 'bg-slate-50 border-slate-200 opacity-80'"
      >
        <div class="flex items-center justify-between">
          <span class="font-bold text-blue-950 flex items-center gap-1 text-[10.5px]">
            <span>⚡</span> Call Stack
          </span>
          <span class="text-[8.5px] px-1.5 py-0.5 rounded font-bold bg-blue-100 text-blue-800 border border-blue-200">
            {{ currentStep.stackFrames.length }} Frames
          </span>
        </div>

        <div class="my-1 flex flex-col-reverse gap-1 text-[9.5px]">
          <div
            v-for="(f, fIdx) in currentStep.stackFrames"
            :key="f + fIdx"
            class="rounded px-2 py-0.5 font-bold flex justify-between shadow-xs transition-all duration-200"
            :class="fIdx === currentStep.stackFrames.length - 1
              ? 'bg-blue-600 text-white border border-blue-700 animate-pulse'
              : 'bg-white border border-blue-200 text-blue-900'"
          >
            <span class="truncate">{{ f }}</span>
            <span class="text-[8px] opacity-80">{{ fIdx === currentStep.stackFrames.length - 1 ? 'TOP' : '#' + (fIdx + 1) }}</span>
          </div>
          <div v-if="currentStep.stackFrames.length === 0" class="text-slate-400 italic text-[9px] text-center py-4">
            (Call Stack is EMPTY • 0 Frames)
          </div>
        </div>

        <div class="text-[8.5px] text-blue-900 font-semibold text-center bg-blue-100/60 py-0.5 rounded">
          Single-threaded LIFO execution
        </div>
      </div>

      <!-- 2. Center Event Loop Hub (4 Cols) -->
      <div class="col-span-4 flex flex-col items-center justify-center h-[155px] relative">
        <div
          class="relative w-20 h-20 rounded-full border-2 flex flex-col items-center justify-center transition-all duration-300 shadow-sm"
          :class="activePhase !== 'stack' && activePhase !== 'idle'
            ? 'border-amber-500 bg-amber-100 shadow-md ring-4 ring-amber-300 scale-105'
            : 'border-slate-300 bg-slate-100'"
        >
          <!-- Spinning ring -->
          <div
            class="absolute inset-0 rounded-full border-2 border-dashed border-amber-600/70"
            :style="{ transform: `rotate(${currentStep.loopAngle}deg)`, transition: 'transform 0.5s ease-out' }"
          ></div>
          <div class="text-base font-black text-amber-700">↻</div>
          <div class="text-[8.5px] font-black tracking-tight text-center text-slate-800 leading-none mt-0.5">EVENT<br/>LOOP</div>
        </div>

        <div class="text-[9px] font-bold text-center text-slate-700 mt-2">
          {{ activePhase === 'render' ? '🎨 Yielding to Render' : (activePhase === 'microtask' ? '⭐ Draining VIP Queue' : (activePhase === 'macrotask' ? '⏳ Dispatching 1 Task' : 'Non-Blocking Coordination')) }}
        </div>
      </div>

      <!-- 3. Web APIs / Host Threads (Right, 4 Cols) -->
      <div
        class="col-span-4 rounded-xl p-3 border-2 transition-all duration-300 flex flex-col justify-between h-[155px]"
        :class="activePhase === 'webapi'
          ? 'bg-emerald-50/90 border-emerald-500 shadow-md ring-2 ring-emerald-300 scale-[1.02]'
          : 'bg-slate-50 border-slate-200 opacity-80'"
      >
        <div class="flex items-center justify-between">
          <span class="font-bold text-emerald-950 flex items-center gap-1 text-[10.5px]">
            <span>🌐</span> Web APIs / libuv
          </span>
          <span class="text-[8.5px] px-1.5 py-0.5 rounded font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">OS Threads</span>
        </div>

        <div class="my-1 flex flex-col gap-1 text-[9.5px]">
          <div
            v-for="w in currentStep.webApiTasks"
            :key="w.name"
            class="rounded px-2 py-0.5 border flex justify-between shadow-xs transition-all duration-200"
            :class="w.status === 'done' ? 'bg-emerald-100 border-emerald-400 text-emerald-950 font-bold' : 'bg-white border-emerald-200 text-slate-800'"
          >
            <span>{{ w.name }}</span>
            <span class="font-mono text-emerald-700 text-[8.5px] font-bold">{{ w.delay }}</span>
          </div>
          <div v-if="currentStep.webApiTasks.length === 0" class="text-slate-400 italic text-[9px] text-center py-4">
            (Background Threads Idle)
          </div>
        </div>

        <div class="text-[8.5px] text-emerald-900 font-semibold text-center bg-emerald-100/60 py-0.5 rounded">
          Multi-Threaded Host Timers & Sockets
        </div>
      </div>

      <!-- Bottom Queues Row: Microtasks (4) | Render Opportunity (4) | Macrotasks (4) -->
      <!-- 4. Microtask Queue (4 Cols) -->
      <div class="col-span-4 rounded-lg p-2 border-2 transition-all duration-300"
        :class="activePhase === 'microtask' ? 'bg-purple-100 border-purple-500 ring-2 ring-purple-300 shadow-md' : 'bg-slate-50 border-slate-200'"
      >
        <div class="flex items-center justify-between mb-1">
          <span class="font-bold text-purple-950 text-[9.5px]">⭐ Microtasks (VIP)</span>
          <span class="text-[8px] bg-purple-200 text-purple-900 px-1 rounded font-bold">100% Drain</span>
        </div>
        <div class="flex flex-col gap-0.5 min-h-[30px]">
          <div v-for="m in currentStep.microtasks" :key="m" class="px-1.5 py-0.5 rounded bg-purple-600 text-white font-mono text-[8.5px] font-bold truncate animate-pulse">
            👑 {{ m }}
          </div>
          <div v-if="currentStep.microtasks.length === 0" class="text-slate-400 italic text-[8.5px] py-1 text-center">
            (Queue Empty • Drained)
          </div>
        </div>
      </div>

      <!-- 5. Render Opportunity (4 Cols) -->
      <div class="col-span-4 rounded-lg p-2 border-2 transition-all duration-300"
        :class="activePhase === 'render' ? 'bg-rose-100 border-rose-500 ring-2 ring-rose-300 shadow-md' : 'bg-slate-50 border-slate-200'"
      >
        <div class="flex items-center justify-between mb-1">
          <span class="font-bold text-rose-950 text-[9.5px]">🎨 Render Window</span>
          <span class="text-[8px] bg-rose-200 text-rose-900 px-1 rounded font-bold">16.6ms</span>
        </div>
        <div class="min-h-[30px] flex flex-col justify-center text-center">
          <span class="text-[8.5px] font-bold" :class="currentStep.renderStatus.active ? 'text-rose-900 animate-pulse' : 'text-slate-500'">
            {{ currentStep.renderStatus.text }}
          </span>
        </div>
      </div>

      <!-- 6. Macrotask Queue (4 Cols) -->
      <div class="col-span-4 rounded-lg p-2 border-2 transition-all duration-300"
        :class="activePhase === 'macrotask' ? 'bg-amber-100 border-amber-500 ring-2 ring-amber-300 shadow-md' : 'bg-slate-50 border-slate-200'"
      >
        <div class="flex items-center justify-between mb-1">
          <span class="font-bold text-amber-950 text-[9.5px]">⏳ Macrotasks</span>
          <span class="text-[8px] bg-amber-200 text-amber-900 px-1 rounded font-bold">1 Per Turn</span>
        </div>
        <div class="flex flex-col gap-0.5 min-h-[30px]">
          <div v-for="t in currentStep.macrotasks" :key="t" class="px-1.5 py-0.5 rounded bg-amber-500 text-slate-950 font-mono text-[8.5px] font-bold truncate">
            ⏱️ {{ t }}
          </div>
          <div v-if="currentStep.macrotasks.length === 0" class="text-slate-400 italic text-[8.5px] py-1 text-center">
            (Macrotask Queue Empty)
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
