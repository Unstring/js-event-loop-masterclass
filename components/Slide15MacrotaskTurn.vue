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
  currentStage: 'stack' | 'micro' | 'render' | 'macro' | 'idle'
  activeTask: string
  macrotasksRemaining: string[]
  renderCount: number
  action: string
  note: string
}

const steps: Step[] = [
  { currentStage: 'idle', activeTask: 'None', macrotasksRemaining: ['Task A (Click)', 'Task B (Timer)', 'Task C (Fetch)'], renderCount: 0, action: "1. Event loop begins: 3 Macrotasks in Queue", note: "Task A, Task B, and Task C waiting in FIFO order." },
  { currentStage: 'macro', activeTask: 'Task A', macrotasksRemaining: ['Task B (Timer)', 'Task C (Fetch)'], renderCount: 0, action: "2. Dequeue Task A: Pushed to Call Stack", note: "Event loop picks exactly ONE macrotask." },
  { currentStage: 'stack', activeTask: 'Task A running...', macrotasksRemaining: ['Task B (Timer)', 'Task C (Fetch)'], renderCount: 0, action: "3. Task A executes synchronously on stack", note: "Handles user click event listener." },
  { currentStage: 'stack', activeTask: 'Task A complete', macrotasksRemaining: ['Task B (Timer)', 'Task C (Fetch)'], renderCount: 0, action: "4. Task A pops off Call Stack", note: "Execution context destroyed. Stack empty!" },
  { currentStage: 'micro', activeTask: 'None', macrotasksRemaining: ['Task B (Timer)', 'Task C (Fetch)'], renderCount: 0, action: "5. Microtask Checkpoint: Checks VIP Queue", note: "Drains any microtasks spawned by Task A." },
  { currentStage: 'render', activeTask: 'None', macrotasksRemaining: ['Task B (Timer)', 'Task C (Fetch)'], renderCount: 1, action: "6. RENDER OPPORTUNITY #1: Frame Painted!", note: "Screen updates with visual changes from Task A!" },
  { currentStage: 'macro', activeTask: 'Task B', macrotasksRemaining: ['Task C (Fetch)'], renderCount: 1, action: "7. Next Turn: Dequeue Task B (Timer)", note: "Event loop picks the next single macrotask." },
  { currentStage: 'stack', activeTask: 'Task B running...', macrotasksRemaining: ['Task C (Fetch)'], renderCount: 1, action: "8. Task B executes setTimeout callback", note: "Performs background data calculation." },
  { currentStage: 'stack', activeTask: 'Task B complete', macrotasksRemaining: ['Task C (Fetch)'], renderCount: 1, action: "9. Task B pops off Call Stack", note: "Stack cleared once again." },
  { currentStage: 'micro', activeTask: 'None', macrotasksRemaining: ['Task C (Fetch)'], renderCount: 1, action: "10. Microtask Checkpoint: Verified empty", note: "0 microtasks pending." },
  { currentStage: 'render', activeTask: 'None', macrotasksRemaining: ['Task C (Fetch)'], renderCount: 2, action: "11. RENDER OPPORTUNITY #2: Frame Painted!", note: "Browser updates styles and layout." },
  { currentStage: 'macro', activeTask: 'Task C', macrotasksRemaining: [], renderCount: 2, action: "12. Next Turn: Dequeue Task C (Fetch Response)", note: "Event loop picks the final macrotask in line." },
  { currentStage: 'stack', activeTask: 'Task C running...', macrotasksRemaining: [], renderCount: 2, action: "13. Task C processes incoming network payload", note: "Updates application state." },
  { currentStage: 'stack', activeTask: 'Task C complete', macrotasksRemaining: [], renderCount: 2, action: "14. Task C pops off Call Stack", note: "All 3 macrotasks have now been serviced." },
  { currentStage: 'render', activeTask: 'None', macrotasksRemaining: [], renderCount: 3, action: "15. RENDER OPPORTUNITY #3: Frame Painted!", note: "Final state rendered to display." },
  { currentStage: 'idle', activeTask: 'None', macrotasksRemaining: [], renderCount: 3, action: "16. Task Fairness Guaranteed", note: "No single task can starve user input or animation frames." },
  { currentStage: 'idle', activeTask: 'None', macrotasksRemaining: [], renderCount: 3, action: "17. Chunking Heavy Computations", note: "Break a 100,000 item loop into 100 macrotasks using setTimeout(0)." },
  { currentStage: 'idle', activeTask: 'None', macrotasksRemaining: [], renderCount: 3, action: "18. Yielding to Browser Event Loop", note: "Lets the browser breathe, paint, and handle mouse clicks." },
  { currentStage: 'idle', activeTask: 'None', macrotasksRemaining: [], renderCount: 3, action: "19. Contrast with Microtasks", note: "Microtasks do NOT yield to render between jobs; macrotasks DO." },
  { currentStage: 'idle', activeTask: 'None', macrotasksRemaining: [], renderCount: 3, action: "20. Macrotask Lifecycle Mastered!", note: "Ready for Slide 16: Browser Render Pipeline!" }
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
            Outcome 4 • Slide 15/20
          </span>
          <span class="text-xs text-slate-500 font-medium font-mono">Fair Scheduling</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-[10px] font-mono text-slate-500 font-bold">Step {{ currentIdx + 1 }} / 20</span>
          <div class="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              class="h-full bg-purple-600 transition-all duration-300 rounded-full"
              :style="{ width: ((currentIdx + 1) / 20) * 100 + '%' }"
            ></div>
          </div>
        </div>
      </div>

      <h1 class="text-2xl font-black text-slate-900 tracking-tight">
        The Macrotask Lifecycle: One Task Per Turn
      </h1>
      <p class="text-xs text-slate-600 font-medium">
        How the event loop enforces task fairness and yields to user interactions and screen rendering.
      </p>
    </div>

    <!-- Active Action Banner -->
    <div class="bg-purple-50 border-2 border-purple-300 p-2 rounded-lg flex items-center justify-between text-xs">
      <div class="flex items-center gap-2 font-bold text-purple-950">
        <span class="text-purple-600">▶</span>
        <span>{{ currentStep.action }}</span>
      </div>
      <div class="flex items-center gap-2">
        <span class="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 px-2 py-0.5 rounded">
          Frames Rendered: {{ currentStep.renderCount }}
        </span>
        <span class="text-[10.5px] text-slate-500 font-medium">{{ currentStep.note }}</span>
      </div>
    </div>

    <!-- 4 Stage Turn Cycle Grid -->
    <div class="grid grid-cols-4 gap-2.5 my-1">
      <!-- 1. Dequeue 1 Macrotask -->
      <div class="p-3 rounded-xl border-2 transition-all duration-300 flex flex-col justify-between"
        :class="currentStep.currentStage === 'macro' ? 'bg-amber-100 border-amber-500 ring-2 ring-amber-300 shadow-md' : 'bg-slate-50 border-slate-200'"
      >
        <div>
          <div class="text-[10px] font-black text-amber-950 uppercase mb-1">1. Dequeue 1 Task</div>
          <div class="text-[9px] text-slate-600">Takes oldest task from queue</div>
        </div>
        <div class="text-xs font-mono font-bold text-amber-900 mt-2 p-1 bg-white rounded border border-amber-200 truncate">
          {{ currentStep.activeTask }}
        </div>
      </div>

      <!-- 2. Call Stack Run -->
      <div class="p-3 rounded-xl border-2 transition-all duration-300 flex flex-col justify-between"
        :class="currentStep.currentStage === 'stack' ? 'bg-blue-100 border-blue-500 ring-2 ring-blue-300 shadow-md' : 'bg-slate-50 border-slate-200'"
      >
        <div>
          <div class="text-[10px] font-black text-blue-950 uppercase mb-1">2. Run to Completion</div>
          <div class="text-[9px] text-slate-600">Single frame executes on CPU</div>
        </div>
        <div class="text-xs font-mono font-bold text-blue-900 mt-2 p-1 bg-white rounded border border-blue-200">
          Stack Active
        </div>
      </div>

      <!-- 3. Microtask Drain -->
      <div class="p-3 rounded-xl border-2 transition-all duration-300 flex flex-col justify-between"
        :class="currentStep.currentStage === 'micro' ? 'bg-purple-100 border-purple-500 ring-2 ring-purple-300 shadow-md' : 'bg-slate-50 border-slate-200'"
      >
        <div>
          <div class="text-[10px] font-black text-purple-950 uppercase mb-1">3. Microtask Check</div>
          <div class="text-[9px] text-slate-600">Drains any new Promise jobs</div>
        </div>
        <div class="text-xs font-mono font-bold text-purple-900 mt-2 p-1 bg-white rounded border border-purple-200">
          100% Drain
        </div>
      </div>

      <!-- 4. Render Opportunity -->
      <div class="p-3 rounded-xl border-2 transition-all duration-300 flex flex-col justify-between"
        :class="currentStep.currentStage === 'render' ? 'bg-emerald-100 border-emerald-500 ring-2 ring-emerald-300 shadow-md' : 'bg-slate-50 border-slate-200'"
      >
        <div>
          <div class="text-[10px] font-black text-emerald-950 uppercase mb-1">4. Render Screen</div>
          <div class="text-[9px] text-slate-600">Checks display V-Sync pulse</div>
        </div>
        <div class="text-xs font-mono font-bold text-emerald-900 mt-2 p-1 bg-white rounded border border-emerald-200">
          60 FPS Frame
        </div>
      </div>
    </div>

    <!-- Remaining Queue Status -->
    <div class="p-2 bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-between text-[10.5px]">
      <div class="flex items-center gap-2">
        <span class="font-bold text-slate-700">Remaining in Macrotask Queue:</span>
        <span v-for="t in currentStep.macrotasksRemaining" :key="t" class="bg-amber-100 text-amber-950 px-2 py-0.5 rounded font-mono font-bold text-[9.5px] border border-amber-300">
          {{ t }}
        </span>
        <span v-if="currentStep.macrotasksRemaining.length === 0" class="text-slate-400 italic">
          (0 tasks remaining - Queue drained)
        </span>
      </div>
      <span class="font-mono text-slate-500 font-bold">1 Macrotask Per Turn Guarantee</span>
    </div>

    <!-- Footer -->
    <div class="flex items-center justify-between text-xs text-slate-500 border-t border-slate-200 pt-2 font-mono">
      <span>Module 4: Macrotasks • Task Fairness</span>
      <span class="text-slate-600 font-bold">Slide 15 / 20</span>
    </div>
  </div>
</template>
