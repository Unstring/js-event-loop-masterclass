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

interface Milestone {
  id: number
  pillar: number
  title: string
  detail: string
  badge: string
}

const milestones: Milestone[] = [
  { id: 1, pillar: 1, title: "01. Single-Threaded Architecture", detail: "Why JS runs on exactly 1 Call Stack and 1 Memory Heap inside V8.", badge: "V8 Engine" },
  { id: 2, pillar: 1, title: "02. The DOM Race Condition Nightmare", detail: "Why multi-threading was avoided to eliminate mutex deadlocks on DOM nodes.", badge: "Thread Safety" },
  { id: 3, pillar: 1, title: "03. Memory Heap Allocation", detail: "Unstructured memory references, closures, and V8 Mark & Sweep GC.", badge: "Memory Management" },
  { id: 4, pillar: 1, title: "04. Execution Context & Hoisting", detail: "Creation Phase (Variable Env & TDZ) vs Execution Phase line-by-line.", badge: "Scope & TDZ" },

  { id: 5, pillar: 2, title: "05. Call Stack LIFO Unwinding", detail: "Nested function execution: caller pauses, top frame runs, return value pops.", badge: "Stack Mechanics" },
  { id: 6, pillar: 2, title: "06. Call Stack Overflow Limits", detail: "Unbounded recursion hitting V8's ~10,420 frame memory limit (RangeError).", badge: "Stack Guard" },
  { id: 7, pillar: 2, title: "07. Host Superpower: Web APIs & libuv", detail: "Browser multi-threaded C++ workers vs Node.js libuv thread pool (UV_THREADPOOL_SIZE).", badge: "Host Concurrency" },
  { id: 8, pillar: 2, title: "08. The Event Loop Infinite Cycle", detail: "The non-blocking heartbeat checking Stack empty -> Drain microtasks -> Render -> Macrotask.", badge: "Event Loop" },

  { id: 9, pillar: 3, title: "09. The 0ms setTimeout Latency Myth", detail: "Why setTimeout(fn, 0) takes 2000ms if a synchronous loop blocks the stack.", badge: "Latency Reality" },
  { id: 10, pillar: 3, title: "10. Timer Engine Min-Heap Structure", detail: "OS/libuv priority tree storing earliest expiry at root with O(log n) efficiency.", badge: "Data Structure" },
  { id: 11, pillar: 3, title: "11. The 4ms HTML5 Clamping Rule", detail: "Nested timers (depth >= 5) are forcibly clamped to minimum 4ms.", badge: "HTML5 Spec" },
  { id: 12, pillar: 3, title: "12. Background Tab Battery Throttling", detail: "Inactive browser tabs throttled to >= 1000ms (1s) to conserve power.", badge: "Power Saving" },

  { id: 13, pillar: 4, title: "13. Two-Tier Queues: Micro vs Macro", detail: "Why Promise reactions and queueMicrotask have VIP bypass over timers and clicks.", badge: "Queue Priority" },
  { id: 14, pillar: 4, title: "14. Microtask Starvation Tab Freeze", detail: "How recursive microtasks trap the event loop at 0 FPS and freeze the window.", badge: "Starvation Alert" },
  { id: 15, pillar: 4, title: "15. Macrotask Fairness: 1 Task Per Turn", detail: "Only ONE macrotask dequeues per turn, allowing screen rendering in between.", badge: "Task Fairness" },
  { id: 16, pillar: 4, title: "16. Browser Render Pipeline (16.6ms)", detail: "The 60 FPS frame budget: Task -> Microtasks -> rAF -> Style -> Layout -> Paint.", badge: "60 FPS Render" },

  { id: 17, pillar: 5, title: "17. Promise State Machine & Slots", detail: "Internal slots: [[PromiseState]], [[PromiseResult]], [[PromiseFulfillReactions]].", badge: "ECMA-262 Spec" },
  { id: 18, pillar: 5, title: "18. Chaining & The 2-Microtask Penalty", detail: "Why returning a Promise introduces PromiseResolveThenableJob (2 extra ticks).", badge: "Unwrap Penalty" },
  { id: 19, pillar: 5, title: "19. Async / Await Coroutines", detail: "How await pops the execution context without blocking the single thread.", badge: "Coroutine Sugar" },
  { id: 20, pillar: 5, title: "20. Grand Final Synthesis & Quiz", detail: "Solving the 7-step execution trace and 5-question interactive diagnostic quiz!", badge: "Final Mastery" }
]

const currentIdx = computed(() => Math.min(Math.max(0, props.step), milestones.length - 1))
const currentM = computed(() => milestones[currentIdx.value])
</script>

<template>
  <div class="h-full flex flex-col justify-between select-none bg-white p-6 font-sans">
    <!-- Header -->
    <div>
      <div class="flex items-center justify-between mb-1">
        <div class="flex items-center gap-2">
          <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-indigo-100 text-indigo-900 border border-indigo-300 uppercase tracking-wider">
            Slide 01 / 20 • Course Roadmap
          </span>
          <span class="text-xs text-slate-500 font-medium font-mono">{{ currentM.badge }}</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-[10px] font-mono text-slate-500 font-bold">Step {{ currentIdx + 1 }} / 20</span>
          <div class="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              class="h-full bg-indigo-600 transition-all duration-300 rounded-full"
              :style="{ width: ((currentIdx + 1) / 20) * 100 + '%' }"
            ></div>
          </div>
        </div>
      </div>

      <h1 class="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
        <span class="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">JavaScript Event Loop</span>
        <span class="text-slate-700">& Asynchronous Architecture</span>
      </h1>
      <p class="text-xs text-slate-600 font-medium">
        Mastering Single-Threading, Execution Contexts, Timers, Queues, and Promises.
      </p>
    </div>

    <!-- Active Step Highlight Banner -->
    <div class="bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-300 p-2.5 rounded-xl shadow-xs transition-all duration-300">
      <div class="flex items-center justify-between mb-1">
        <div class="flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-ping"></span>
          <span class="text-xs font-black text-indigo-950 uppercase tracking-wide">
            {{ currentM.title }}
          </span>
        </div>
        <span class="text-[10px] font-bold bg-indigo-200 text-indigo-950 px-2 py-0.5 rounded">
          Milestone {{ currentIdx + 1 }} of 20
        </span>
      </div>
      <p class="text-xs text-slate-700 font-medium leading-relaxed">
        {{ currentM.detail }}
      </p>
    </div>

    <!-- 5 Architectural Pillars Grid with Active Milestone Highlight -->
    <div class="grid grid-cols-5 gap-2 my-1">
      <!-- Pillar 1 -->
      <div
        class="p-2.5 rounded-xl border-2 transition-all duration-300 flex flex-col justify-between"
        :class="currentM.pillar === 1 ? 'bg-indigo-100 border-indigo-600 shadow-md ring-2 ring-indigo-400 scale-[1.02]' : 'bg-slate-50 border-slate-200 opacity-70'"
      >
        <div>
          <div class="text-[10px] font-black text-indigo-950 uppercase mb-1">01. Single Thread</div>
          <div class="grid grid-cols-2 gap-1 text-[8px] font-mono mt-1">
            <span v-for="n in [1, 2, 3, 4]" :key="n"
              class="p-1 rounded text-center border font-bold"
              :class="currentM.id === n ? 'bg-indigo-600 text-white border-indigo-700 shadow-xs' : 'bg-white text-slate-600 border-slate-200'"
            >
              #{{ n }}
            </span>
          </div>
        </div>
        <div class="mt-2 text-[8px] font-bold text-indigo-800 bg-white/80 py-0.5 px-1 rounded text-center border border-indigo-200">
          Slides 1 – 4
        </div>
      </div>

      <!-- Pillar 2 -->
      <div
        class="p-2.5 rounded-xl border-2 transition-all duration-300 flex flex-col justify-between"
        :class="currentM.pillar === 2 ? 'bg-blue-100 border-blue-600 shadow-md ring-2 ring-blue-400 scale-[1.02]' : 'bg-slate-50 border-slate-200 opacity-70'"
      >
        <div>
          <div class="text-[10px] font-black text-blue-950 uppercase mb-1">02. Event Loop</div>
          <div class="grid grid-cols-2 gap-1 text-[8px] font-mono mt-1">
            <span v-for="n in [5, 6, 7, 8]" :key="n"
              class="p-1 rounded text-center border font-bold"
              :class="currentM.id === n ? 'bg-blue-600 text-white border-blue-700 shadow-xs' : 'bg-white text-slate-600 border-slate-200'"
            >
              #{{ n }}
            </span>
          </div>
        </div>
        <div class="mt-2 text-[8px] font-bold text-blue-800 bg-white/80 py-0.5 px-1 rounded text-center border border-blue-200">
          Slides 5 – 8
        </div>
      </div>

      <!-- Pillar 3 -->
      <div
        class="p-2.5 rounded-xl border-2 transition-all duration-300 flex flex-col justify-between"
        :class="currentM.pillar === 3 ? 'bg-amber-100 border-amber-600 shadow-md ring-2 ring-amber-400 scale-[1.02]' : 'bg-slate-50 border-slate-200 opacity-70'"
      >
        <div>
          <div class="text-[10px] font-black text-amber-950 uppercase mb-1">03. setTimeout</div>
          <div class="grid grid-cols-2 gap-1 text-[8px] font-mono mt-1">
            <span v-for="n in [9, 10, 11, 12]" :key="n"
              class="p-1 rounded text-center border font-bold"
              :class="currentM.id === n ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-xs' : 'bg-white text-slate-600 border-slate-200'"
            >
              #{{ n }}
            </span>
          </div>
        </div>
        <div class="mt-2 text-[8px] font-bold text-amber-800 bg-white/80 py-0.5 px-1 rounded text-center border border-amber-200">
          Slides 9 – 12
        </div>
      </div>

      <!-- Pillar 4 -->
      <div
        class="p-2.5 rounded-xl border-2 transition-all duration-300 flex flex-col justify-between"
        :class="currentM.pillar === 4 ? 'bg-purple-100 border-purple-600 shadow-md ring-2 ring-purple-400 scale-[1.02]' : 'bg-slate-50 border-slate-200 opacity-70'"
      >
        <div>
          <div class="text-[10px] font-black text-purple-950 uppercase mb-1">04. Microtasks</div>
          <div class="grid grid-cols-2 gap-1 text-[8px] font-mono mt-1">
            <span v-for="n in [13, 14, 15, 16]" :key="n"
              class="p-1 rounded text-center border font-bold"
              :class="currentM.id === n ? 'bg-purple-600 text-white border-purple-700 shadow-xs' : 'bg-white text-slate-600 border-slate-200'"
            >
              #{{ n }}
            </span>
          </div>
        </div>
        <div class="mt-2 text-[8px] font-bold text-purple-800 bg-white/80 py-0.5 px-1 rounded text-center border border-purple-200">
          Slides 13 – 16
        </div>
      </div>

      <!-- Pillar 5 -->
      <div
        class="p-2.5 rounded-xl border-2 transition-all duration-300 flex flex-col justify-between"
        :class="currentM.pillar === 5 ? 'bg-rose-100 border-rose-600 shadow-md ring-2 ring-rose-400 scale-[1.02]' : 'bg-slate-50 border-slate-200 opacity-70'"
      >
        <div>
          <div class="text-[10px] font-black text-rose-950 uppercase mb-1">05. Promises</div>
          <div class="grid grid-cols-2 gap-1 text-[8px] font-mono mt-1">
            <span v-for="n in [17, 18, 19, 20]" :key="n"
              class="p-1 rounded text-center border font-bold"
              :class="currentM.id === n ? 'bg-rose-600 text-white border-rose-700 shadow-xs' : 'bg-white text-slate-600 border-slate-200'"
            >
              #{{ n }}
            </span>
          </div>
        </div>
        <div class="mt-2 text-[8px] font-bold text-rose-800 bg-white/80 py-0.5 px-1 rounded text-center border border-rose-200">
          Slides 17 – 20
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="flex items-center justify-between text-xs text-slate-500 border-t border-slate-200 pt-2 font-mono">
      <span class="text-indigo-600 font-bold">Press Spacebar or ➔ to step forward through each milestone</span>
      <span class="text-slate-600 font-bold">Slide 01 / 20</span>
    </div>
  </div>
</template>
