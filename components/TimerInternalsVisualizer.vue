<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    step?: number
    title?: string
  }>(),
  {
    step: 0,
    title: 'Timer Internals: OS & libuv Min-Heap Priority Queue'
  }
)

interface TimerNode {
  id: number
  cb: string
  delay: number
  dueInMs: number
  isRoot?: boolean
  isNew?: boolean
  isTombstone?: boolean
}

interface Step {
  heapNodes: TimerNode[]
  osInterruptMs: number
  callStack: string
  action: string
  note: string
  timeComplexity: string
  heapOperation: string
}

const steps: Step[] = [
  {
    heapNodes: [],
    osInterruptMs: 0,
    callStack: "main()",
    action: "1. Host Timer Manager Initialized (Min-Heap Empty)",
    note: "V8 engine connects to browser Web APIs / libuv C++ timer subsystem.",
    timeComplexity: "O(1)",
    heapOperation: "Empty Heap"
  },
  {
    heapNodes: [
      { id: 101, cb: "taskA", delay: 100, dueInMs: 100, isRoot: true, isNew: true }
    ],
    osInterruptMs: 100,
    callStack: "main() -> setTimeout(taskA, 100)",
    action: "2. setTimeout(taskA, 100) invoked: Inserted into Min-Heap",
    note: "Inserted as Root node. OS timer interrupt scheduled for +100ms.",
    timeComplexity: "O(log n)",
    heapOperation: "Insert at root"
  },
  {
    heapNodes: [
      { id: 101, cb: "taskA", delay: 100, dueInMs: 100, isRoot: true },
      { id: 102, cb: "taskB", delay: 200, dueInMs: 200, isNew: true }
    ],
    osInterruptMs: 100,
    callStack: "main() -> setTimeout(taskB, 200)",
    action: "3. setTimeout(taskB, 200) added: Placed as child node",
    note: "200ms > 100ms, so taskB stays below taskA. Root unchanged.",
    timeComplexity: "O(log n)",
    heapOperation: "Heapify: No swap needed"
  },
  {
    heapNodes: [
      { id: 101, cb: "taskA", delay: 100, dueInMs: 100, isRoot: true },
      { id: 102, cb: "taskB", delay: 200, dueInMs: 200 },
      { id: 103, cb: "taskC", delay: 50, dueInMs: 50, isNew: true }
    ],
    osInterruptMs: 100,
    callStack: "main() -> setTimeout(taskC, 50)",
    action: "4. setTimeout(taskC, 50) added: Earliest delay detected!",
    note: "50ms is sooner than 100ms! taskC must bubble up to root.",
    timeComplexity: "O(log n)",
    heapOperation: "Bubble-Up initiated"
  },
  {
    heapNodes: [
      { id: 103, cb: "taskC", delay: 50, dueInMs: 50, isRoot: true },
      { id: 102, cb: "taskB", delay: 200, dueInMs: 200 },
      { id: 101, cb: "taskA", delay: 100, dueInMs: 100 }
    ],
    osInterruptMs: 50,
    callStack: "main()",
    action: "5. taskC bubbles to ROOT! OS Hardware Timer Reprogrammed",
    note: "libuv updates epoll_wait timeout from 100ms to 50ms immediately.",
    timeComplexity: "O(log n)",
    heapOperation: "Root Replaced: Swapped with taskA"
  },
  {
    heapNodes: [
      { id: 103, cb: "taskC", delay: 50, dueInMs: 50, isRoot: true },
      { id: 102, cb: "taskB", delay: 200, dueInMs: 200 },
      { id: 101, cb: "taskA", delay: 100, dueInMs: 100 },
      { id: 104, cb: "taskD", delay: 10, dueInMs: 10, isNew: true }
    ],
    osInterruptMs: 50,
    callStack: "main() -> setTimeout(taskD, 10)",
    action: "6. setTimeout(taskD, 10) inserted: Even earlier delay!",
    note: "10ms timer added. Bubbles past taskA and taskC to become new root.",
    timeComplexity: "O(log n)",
    heapOperation: "Bubble-Up: 10ms < 50ms"
  },
  {
    heapNodes: [
      { id: 104, cb: "taskD", delay: 10, dueInMs: 10, isRoot: true },
      { id: 103, cb: "taskC", delay: 50, dueInMs: 50 },
      { id: 101, cb: "taskA", delay: 100, dueInMs: 100 },
      { id: 102, cb: "taskB", delay: 200, dueInMs: 200 }
    ],
    osInterruptMs: 10,
    callStack: "main() finishes",
    action: "7. Heap Re-Balanced: Root is taskD (10ms)",
    note: "OS Hardware Timer interrupt set to fire in 10ms.",
    timeComplexity: "O(log n)",
    heapOperation: "Heap Stable: Root = taskD (10ms)"
  },
  {
    heapNodes: [
      { id: 104, cb: "taskD", delay: 10, dueInMs: 0, isRoot: true },
      { id: 103, cb: "taskC", delay: 50, dueInMs: 40 },
      { id: 101, cb: "taskA", delay: 100, dueInMs: 90 },
      { id: 102, cb: "taskB", delay: 200, dueInMs: 190 }
    ],
    osInterruptMs: 0,
    callStack: "Empty (Event loop waiting)",
    action: "8. 10ms Elapses: OS Hardware Clock Interrupt Fires!",
    note: "Kernel wakes event loop thread. Root timer (taskD) has expired.",
    timeComplexity: "O(1) Check",
    heapOperation: "Expiry Detected"
  },
  {
    heapNodes: [
      { id: 103, cb: "taskC", delay: 50, dueInMs: 40, isRoot: true },
      { id: 102, cb: "taskB", delay: 200, dueInMs: 190 },
      { id: 101, cb: "taskA", delay: 100, dueInMs: 90 }
    ],
    osInterruptMs: 40,
    callStack: "taskD() [Executing on Stack]",
    action: "9. taskD extracted from Heap -> Pushed to Macrotasks -> Runs on Stack",
    note: "Root is popped (O(log n)). Remaining heap re-heapifies down. Root is now taskC.",
    timeComplexity: "O(log n)",
    heapOperation: "Heapify Down: Root = taskC (40ms left)"
  },
  {
    heapNodes: [
      { id: 103, cb: "taskC", delay: 50, dueInMs: 40, isRoot: true },
      { id: 102, cb: "taskB", delay: 200, dueInMs: 190, isTombstone: true },
      { id: 101, cb: "taskA", delay: 100, dueInMs: 90 }
    ],
    osInterruptMs: 40,
    callStack: "clearTimeout(102)",
    action: "10. clearTimeout(102) invoked: Cancelling taskB (200ms)",
    note: "Engine marks node as Tombstone / cancelled to avoid expensive mid-heap re-balancing.",
    timeComplexity: "O(1) Tombstone",
    heapOperation: "Marked Cancelled (Tombstone)"
  },
  {
    heapNodes: [
      { id: 103, cb: "taskC", delay: 50, dueInMs: 0, isRoot: true },
      { id: 101, cb: "taskA", delay: 100, dueInMs: 50 }
    ],
    osInterruptMs: 0,
    callStack: "taskC() [Executing on Stack]",
    action: "11. 40ms pass: taskC expires -> Executed on Call Stack",
    note: "taskC pops from root. Cancelled taskB is garbage collected during heapify.",
    timeComplexity: "O(log n)",
    heapOperation: "taskC Dequeued, taskB purged"
  },
  {
    heapNodes: [
      { id: 101, cb: "taskA", delay: 100, dueInMs: 50, isRoot: true }
    ],
    osInterruptMs: 50,
    callStack: "Empty",
    action: "12. Only taskA remains in Min-Heap (50ms remaining)",
    note: "OS hardware timer set for 50ms. Zero CPU usage while idling.",
    timeComplexity: "O(1)",
    heapOperation: "Root = taskA (50ms)"
  },
  {
    heapNodes: [
      { id: 101, cb: "taskA", delay: 100, dueInMs: 0, isRoot: true }
    ],
    osInterruptMs: 0,
    callStack: "taskA() [Executing on Stack]",
    action: "13. Final timer (taskA) fires and pops from Min-Heap",
    note: "All timers executed. Min-Heap is now 100% empty.",
    timeComplexity: "O(log n)",
    heapOperation: "Heap Empty"
  },
  {
    heapNodes: [],
    osInterruptMs: 0,
    callStack: "Empty",
    action: "14. Scaling: Why not a simple sorted Array?",
    note: "Array insertion takes O(n). With 10,000 active timers, an array would crush CPU throughput!",
    timeComplexity: "Array: O(n) vs Heap: O(log n)",
    heapOperation: "Min-Heap Advantage"
  },
  {
    heapNodes: [],
    osInterruptMs: 0,
    callStack: "Empty",
    action: "15. Scaling: The Hashed Timer Wheel (O(1) Alternative)",
    note: "Linux kernel and high-throughput servers use circular Timer Wheels for O(1) amortized timers.",
    timeComplexity: "Timer Wheel: O(1)",
    heapOperation: "Bucket Hashing"
  },
  {
    heapNodes: [],
    osInterruptMs: 0,
    callStack: "Empty",
    action: "16. libuv epoll_wait Integration",
    note: "libuv passes the root timer due time directly into epoll_wait(..., timeoutMs) syscall!",
    timeComplexity: "Zero polling",
    heapOperation: "OS Kernel Sleep"
  },
  {
    heapNodes: [],
    osInterruptMs: 0,
    callStack: "Empty",
    action: "17. Clock Jitter & OS Quantum Drift",
    note: "Timers are not real-time guarantees; they can drift by 1-5ms based on OS thread scheduling.",
    timeComplexity: "±2ms Jitter",
    heapOperation: "Non-Realtime OS"
  },
  {
    heapNodes: [],
    osInterruptMs: 0,
    callStack: "Empty",
    action: "18. clearTimeout Memory Safety",
    note: "Always clear unused timers to prevent uncollected closures and memory leaks in long-running apps.",
    timeComplexity: "GC Safe",
    heapOperation: "Resource Cleanup"
  },
  {
    heapNodes: [],
    osInterruptMs: 0,
    callStack: "Empty",
    action: "19. Min-Heap Priority Queue Summary",
    note: "Root is always earliest. Insertion: O(log n). Extraction: O(log n). Root check: O(1).",
    timeComplexity: "O(log n) Guarantee",
    heapOperation: "Spec Optimal"
  },
  {
    heapNodes: [],
    osInterruptMs: 0,
    callStack: "Empty",
    action: "20. Timer Internals Mastered! Ready for Slide 12: Clamping Rules",
    note: "You now know the exact data structure driving setTimeout under the hood!",
    timeComplexity: "Mastered",
    heapOperation: "Module 3 Complete"
  }
]

const currentIdx = computed(() => Math.min(Math.max(0, props.step), steps.length - 1))
const currentStep = computed(() => steps[currentIdx.value])
</script>

<template>
  <div class="timer-internals bg-white border-2 border-slate-300 rounded-xl p-3 shadow-md font-mono text-slate-800 text-xs select-none">
    <!-- Header -->
    <div class="flex items-center justify-between pb-2 mb-2 border-b border-slate-200">
      <div class="flex items-center gap-2">
        <span class="w-3 h-3 rounded-full bg-amber-500 animate-pulse"></span>
        <span class="font-extrabold text-xs uppercase tracking-tight text-slate-900">{{ title }}</span>
      </div>
      <div class="flex items-center gap-2">
        <span class="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-amber-100 text-amber-900 border border-amber-300">
          Complexity: {{ currentStep.timeComplexity }}
        </span>
        <span class="bg-slate-100 text-slate-800 border border-slate-300 px-2 py-0.5 rounded text-[10px] font-black">
          Step {{ currentIdx + 1 }} / {{ steps.length }}
        </span>
      </div>
    </div>

    <!-- Active Step Action Banner -->
    <div class="p-2 mb-2 rounded-lg border-2 bg-amber-50 border-amber-300 flex items-center justify-between text-xs">
      <div class="flex items-center gap-2 font-bold text-amber-950">
        <span class="text-amber-600 animate-pulse">▶</span>
        <span>{{ currentStep.action }}</span>
      </div>
      <div class="flex items-center gap-2">
        <span class="text-[9.5px] font-bold font-mono px-2 py-0.5 rounded bg-amber-200 text-amber-950 border border-amber-300">
          {{ currentStep.heapOperation }}
        </span>
        <span class="text-[10px] text-slate-600 font-medium">{{ currentStep.note }}</span>
      </div>
    </div>

    <!-- Main Grid: Min-Heap Visual Tree (Left 7 Cols) | OS & Hardware Scheduler (Right 5 Cols) -->
    <div class="grid grid-cols-12 gap-2.5 min-h-[195px]">
      
      <!-- Left: Min-Heap Priority Queue Tree (7 Cols) -->
      <div class="col-span-7 bg-amber-50/70 border-2 border-amber-200 rounded-lg p-2.5 flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between text-[10px] font-black text-amber-950 uppercase mb-1.5">
            <span>🌲 OS / libuv Min-Heap Binary Tree</span>
            <span class="text-[8px] bg-amber-200 text-amber-900 px-1 rounded font-bold">O(log n) Insertion</span>
          </div>

          <div class="space-y-1.5 min-h-[110px] p-2 bg-white/95 rounded border border-amber-200">
            <div
              v-for="(t, idx) in currentStep.heapNodes"
              :key="t.id"
              class="p-1.5 rounded text-[10px] flex items-center justify-between font-bold border transition-all duration-300"
              :class="{
                'bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 border-amber-500 shadow-sm ring-1 ring-amber-300 scale-[1.01]': t.isRoot,
                'bg-rose-50 border-rose-300 text-rose-800 line-through opacity-60': t.isTombstone,
                'bg-white border-amber-200 text-slate-800': !t.isRoot && !t.isTombstone,
                'ring-2 ring-emerald-400': t.isNew
              }"
            >
              <div class="flex items-center gap-1.5">
                <span class="text-[8.5px] px-1 rounded font-mono" :class="t.isRoot ? 'bg-black/15 text-slate-950 font-black' : 'bg-slate-100 text-slate-600'">
                  {{ t.isRoot ? '👑 ROOT' : '#' + (idx + 1) }}
                </span>
                <span class="font-mono">setTimeout({{ t.cb }}, {{ t.delay }}ms)</span>
              </div>
              <div class="flex items-center gap-2 text-[9px] font-mono">
                <span :class="t.dueInMs === 0 ? 'text-rose-600 font-black animate-pulse' : 'text-slate-600'">
                  Due: {{ t.dueInMs }}ms
                </span>
                <span class="text-[8px] opacity-70">ID: {{ t.id }}</span>
              </div>
            </div>

            <div v-if="currentStep.heapNodes.length === 0" class="text-slate-400 text-center py-6 text-[10px] italic">
              (Min-Heap is Empty • No pending timers)
            </div>
          </div>
        </div>

        <div class="text-[8.5px] text-amber-900 text-center font-bold mt-1 bg-amber-100/60 py-0.5 rounded">
          Earliest timer bubbles to ROOT • O(1) lookup of next event
        </div>
      </div>

      <!-- Right: OS Hardware Timer & Call Stack (5 Cols) -->
      <div class="col-span-5 bg-slate-900 text-white rounded-lg p-2.5 flex flex-col justify-between border-2 border-slate-700">
        <div>
          <div class="flex items-center justify-between text-[10px] font-black uppercase text-amber-400 mb-1.5">
            <span>⏱️ OS Kernel Hardware Interrupt</span>
            <span class="text-[8px] bg-slate-800 text-amber-300 px-1 rounded font-bold font-mono">Kernel Clock</span>
          </div>

          <div class="p-2 bg-black/60 rounded border border-slate-800 space-y-2 text-[10px]">
            <div class="flex items-center justify-between">
              <span class="text-slate-300">OS Next Wakeup:</span>
              <span class="font-bold text-amber-400 text-xs font-mono">
                {{ currentStep.osInterruptMs > 0 ? `+${currentStep.osInterruptMs} ms` : 'Idle / Expired' }}
              </span>
            </div>

            <div class="flex items-center justify-between">
              <span class="text-slate-300">libuv Syscall:</span>
              <span class="font-mono text-emerald-400 text-[9px] font-bold">
                {{ currentStep.osInterruptMs > 0 ? `epoll_wait(timeout: ${currentStep.osInterruptMs}ms)` : 'epoll_wait(timeout: -1)' }}
              </span>
            </div>

            <div class="p-1 rounded bg-slate-800 border border-slate-700 text-[8.5px] text-slate-300">
              V8 Call Stack: <strong class="text-white font-mono">{{ currentStep.callStack }}</strong>
            </div>

            <div class="text-[8.5px] text-slate-400 leading-snug">
              {{ currentStep.osInterruptMs > 0
                ? 'CPU stays completely asleep in non-blocking kernel wait until hardware timer interrupt fires.'
                : 'Kernel awakened main thread; timer callback dispatching to Call Stack.' }}
            </div>
          </div>
        </div>

        <div class="text-[8px] text-slate-400 text-center font-mono mt-1 pt-1 border-t border-slate-800">
          Hardware clock fires interrupt ➜ Event loop pushes callback
        </div>
      </div>

    </div>
  </div>
</template>
