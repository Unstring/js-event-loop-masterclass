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
  microtaskCount: number
  macrotaskCount: number
  renderFrozen: boolean
  action: string
  note: string
}

const steps: Step[] = [
  { microtaskCount: 1, macrotaskCount: 1, renderFrozen: false, action: "1. Script initializes: User click handler queued in Macrotasks", note: "1 user click waiting in Macrotask queue." },
  { microtaskCount: 1, macrotaskCount: 1, renderFrozen: false, action: "2. infiniteMicrotask() invoked", note: "First microtask scheduled into Microtask Queue." },
  { microtaskCount: 0, macrotaskCount: 1, renderFrozen: false, action: "3. Call Stack clears: Event loop checks Microtask Queue", note: "Microtask Queue has 1 item. Event loop dequeues it." },
  { microtaskCount: 1, macrotaskCount: 1, renderFrozen: false, action: "4. Inside callback: Calls queueMicrotask(infiniteMicrotask)", note: "Before finishing, it queues another microtask!" },
  { microtaskCount: 2, macrotaskCount: 1, renderFrozen: false, action: "5. Microtask queue depth grows to 2", note: "Queue was not empty, and new microtasks were appended." },
  { microtaskCount: 5, macrotaskCount: 1, renderFrozen: true, action: "6. Recursive loop continues: Depth reaches 5", note: "Spec rule: Event loop CANNOT leave until Microtasks = 0!" },
  { microtaskCount: 20, macrotaskCount: 2, renderFrozen: true, action: "7. User clicks button: New event arrives in Macrotasks", note: "Macrotask count = 2. But Event Loop is trapped!" },
  { microtaskCount: 100, macrotaskCount: 3, renderFrozen: true, action: "8. Depth reaches 100: Browser UI completely freezes!", note: "Rendering engine cannot recalculate styles or paint frames." },
  { microtaskCount: 500, macrotaskCount: 4, renderFrozen: true, action: "9. Frame rate drops to 0 FPS (Total Tab Lockup)", note: "User sees spinning beachball / unresponsive page warning!" },
  { microtaskCount: 1000, macrotaskCount: 5, renderFrozen: true, action: "10. STALLED: Macrotasks and renders 100% starved!", note: "Browser watchdog timer may prompt user to kill the tab." },
  { microtaskCount: 0, macrotaskCount: 1, renderFrozen: false, action: "11. Contrast: What happens with setTimeout(loop, 0)?", note: "Let's see the cooperative macrotask alternative!" },
  { microtaskCount: 0, macrotaskCount: 1, renderFrozen: false, action: "12. setTimeout pushes to Macrotask Queue (NOT Microtask)", note: "Each recursion schedules a brand new task." },
  { microtaskCount: 0, macrotaskCount: 0, renderFrozen: false, action: "13. Event loop runs ONE macrotask per turn", note: "Task finishes. Stack and Microtasks are empty!" },
  { microtaskCount: 0, macrotaskCount: 0, renderFrozen: false, action: "14. RENDER OPPORTUNITY! 60 FPS update occurs!", note: "Between macrotask turns, the browser updates the screen!" },
  { microtaskCount: 0, macrotaskCount: 1, renderFrozen: false, action: "15. User clicks are processed between macrotask turns", note: "UI remains responsive, smooth, and interactive!" },
  { microtaskCount: 0, macrotaskCount: 1, renderFrozen: false, action: "16. Golden Concurrency Law: Microtasks drain 100%", note: "Never recursively enqueue microtasks synchronously." },
  { microtaskCount: 0, macrotaskCount: 1, renderFrozen: false, action: "17. Macrotasks yield cooperatively after each turn", note: "Ideal for chunking long arrays or CPU-heavy workloads." },
  { microtaskCount: 0, macrotaskCount: 1, renderFrozen: false, action: "18. Web Workers for true background parallel computing", note: "Offload heavy algorithms completely off the main thread." },
  { microtaskCount: 0, macrotaskCount: 0, renderFrozen: false, action: "19. scheduler.yield() in modern browsers", note: "New Chrome standard explicitly yielding to event loop." },
  { microtaskCount: 0, macrotaskCount: 0, renderFrozen: false, action: "20. Microtask Starvation Mastered!", note: "You understand why queue types dictate UI responsiveness." }
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
          <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-purple-100 text-purple-900 border border-purple-300 uppercase tracking-wider">
            Outcome 4 • Slide 14/20
          </span>
          <span class="text-xs text-slate-500 font-medium font-mono">Starvation Hazard</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-[10px] font-mono text-slate-500 font-bold">Step {{ currentIdx + 1 }} / 20</span>
          <div class="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              class="h-full transition-all duration-300 rounded-full"
              :class="currentStep.renderFrozen ? 'bg-rose-600' : 'bg-purple-600'"
              :style="{ width: ((currentIdx + 1) / 20) * 100 + '%' }"
            ></div>
          </div>
        </div>
      </div>

      <h1 class="text-2xl font-black text-slate-900 tracking-tight">
        Microtask Starvation: Freezing the Browser Window
      </h1>
      <p class="text-xs text-slate-600 font-medium">
        Why recursive microtasks lock the event loop, starving clicks, timers, and 60fps renders.
      </p>
    </div>

    <!-- Active Action Banner -->
    <div class="border-2 p-2 rounded-lg flex items-center justify-between text-xs"
      :class="currentStep.renderFrozen ? 'bg-rose-100 border-rose-400 text-rose-950 font-bold' : 'bg-purple-50 border-purple-300 text-purple-950'"
    >
      <div class="flex items-center gap-2">
        <span>{{ currentStep.renderFrozen ? '💥' : '▶' }}</span>
        <span>{{ currentStep.action }}</span>
      </div>
      <div class="flex items-center gap-2">
        <span class="text-[10px] font-mono font-bold px-2 py-0.5 rounded"
          :class="currentStep.renderFrozen ? 'bg-rose-200 text-rose-950' : 'bg-purple-200 text-purple-950'"
        >
          UI: {{ currentStep.renderFrozen ? 'FROZEN (0 FPS)' : 'RESPONSIVE (60 FPS)' }}
        </span>
        <span class="text-[10.5px] opacity-80">{{ currentStep.note }}</span>
      </div>
    </div>

    <!-- Main Comparison: Recursive Microtask (Left) vs Macrotask (Right) -->
    <div class="grid grid-cols-12 gap-3 my-1">
      <!-- Microtask Trap (6 Cols) -->
      <div class="col-span-6 bg-rose-50/70 border-2 rounded-xl p-3 flex flex-col justify-between"
        :class="currentStep.renderFrozen ? 'border-rose-500 ring-2 ring-rose-300' : 'border-rose-200'"
      >
        <div>
          <div class="flex items-center justify-between text-[11px] font-black text-rose-950 uppercase mb-2">
            <span>❌ Recursive Microtask (Tab Lock)</span>
            <span class="text-[9px] bg-rose-200 text-rose-900 px-1.5 py-0.5 rounded font-bold font-mono">
              Queue: {{ currentStep.microtaskCount }}
            </span>
          </div>

          <div class="bg-slate-950 rounded-lg p-2.5 text-white font-mono text-[10px] mb-2 leading-relaxed">
            <span class="text-purple-400">function</span> <span class="text-rose-400">freeze</span>() {<br/>
            &nbsp;&nbsp;<span class="text-rose-400">queueMicrotask</span>(freeze);<br/>
            }<br/>
            freeze();
          </div>

          <div class="p-2 bg-white rounded border border-rose-200 text-[10px] text-slate-700 space-y-1">
            <div class="flex justify-between font-bold text-rose-900">
              <span>Event Loop Status:</span>
              <span>Trapped in Microtask Drain</span>
            </div>
            <div>Screen repaints and user clicks are <strong>100% blocked</strong>.</div>
          </div>
        </div>

        <div class="text-[9px] text-rose-900 font-bold text-center mt-2 bg-rose-100/60 py-1 rounded">
          Event loop will NEVER leave microtask checkpoint while queue is non-empty!
        </div>
      </div>

      <!-- Cooperative Macrotask (6 Cols) -->
      <div class="col-span-6 bg-emerald-50/70 border-2 border-emerald-300 rounded-xl p-3 flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between text-[11px] font-black text-emerald-950 uppercase mb-2">
            <span>✅ Cooperative Macrotask (UI Fluid)</span>
            <span class="text-[9px] bg-emerald-200 text-emerald-900 px-1.5 py-0.5 rounded font-bold font-mono">
              Tasks: {{ currentStep.macrotaskCount }}
            </span>
          </div>

          <div class="bg-slate-950 rounded-lg p-2.5 text-white font-mono text-[10px] mb-2 leading-relaxed">
            <span class="text-purple-400">function</span> <span class="text-emerald-400">cooperative</span>() {<br/>
            &nbsp;&nbsp;<span class="text-emerald-400">setTimeout</span>(cooperative, 0);<br/>
            }<br/>
            cooperative();
          </div>

          <div class="p-2 bg-white rounded border border-emerald-200 text-[10px] text-slate-700 space-y-1">
            <div class="flex justify-between font-bold text-emerald-900">
              <span>Event Loop Status:</span>
              <span>Yields to Render on Each Turn</span>
            </div>
            <div>Only 1 macrotask runs per turn. Display updates at <strong>60 FPS</strong>.</div>
          </div>
        </div>

        <div class="text-[9px] text-emerald-900 font-bold text-center mt-2 bg-emerald-100/60 py-1 rounded">
          Interleaves rendering, user input, and network I/O smoothly!
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="flex items-center justify-between text-xs text-slate-500 border-t border-slate-200 pt-2 font-mono">
      <span>Module 4: Queue Priorities • Microtask Starvation</span>
      <span class="text-slate-600 font-bold">Slide 14 / 20</span>
    </div>
  </div>
</template>
