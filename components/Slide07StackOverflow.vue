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
  framesCount: number
  status: 'normal' | 'warning' | 'critical' | 'crashed' | 'fixed'
  action: string
  note: string
  errorMsg?: string
}

const steps: Step[] = [
  { framesCount: 1, status: 'normal', action: "1. recurse() called for the first time", note: "Frame #1 pushed to the Call Stack." },
  { framesCount: 10, status: 'normal', action: "2. Missing base case condition", note: "recurse() immediately calls recurse() without return." },
  { framesCount: 50, status: 'normal', action: "3. Stack frame count increases to 50", note: "Local variables and return addresses allocated on stack." },
  { framesCount: 200, status: 'normal', action: "4. Stack frame count reaches 200", note: "Stack memory pointer continues moving downwards." },
  { framesCount: 500, status: 'normal', action: "5. Stack frame count reaches 500", note: "CPU caches fill with active call records." },
  { framesCount: 1200, status: 'warning', action: "6. Exceeding 1,000 frames: Memory warning", note: "Stack size growing beyond standard function hierarchy." },
  { framesCount: 3000, status: 'warning', action: "7. Exceeding 3,000 frames: High memory pressure", note: "Thread stack approaching allocated OS memory limit." },
  { framesCount: 6000, status: 'warning', action: "8. Exceeding 6,000 frames: Danger threshold", note: "Engine stack guard monitoring remaining memory boundary." },
  { framesCount: 8500, status: 'critical', action: "9. Approaching 10,000 frames: Critical danger!", note: "V8 stack segment limit almost fully saturated." },
  { framesCount: 10420, status: 'crashed', action: "10. STACK OVERFLOW! V8 Stack Guard triggered!", note: "Engine halts execution to prevent browser process segmentation fault!", errorMsg: "Uncaught RangeError: Maximum call stack size exceeded" },
  { framesCount: 10420, status: 'crashed', action: "11. Why does V8 halt with RangeError?", note: "To prevent native C++ process memory corruption!", errorMsg: "Uncaught RangeError: Maximum call stack size exceeded" },
  { framesCount: 10420, status: 'crashed', action: "12. Stack limits vary by browser engine", note: "Chrome/V8: ~10,000 frames. Safari/JSC: ~40,000. Firefox: ~50,000.", errorMsg: "Browser Engine Stack Allocations" },
  { framesCount: 1, status: 'fixed', action: "13. Solution 1: Add a Base Case", note: "if (count === 0) return; ensures the stack unwinds normally.", errorMsg: "Fixed via Base Condition" },
  { framesCount: 1, status: 'fixed', action: "14. Solution 2: Convert to Iterative Loop", note: "for or while loops use O(1) stack memory!", errorMsg: "Fixed via Iteration" },
  { framesCount: 1, status: 'fixed', action: "15. Solution 3: Trampoline Pattern", note: "Returning a thunk function flattens recursive calls.", errorMsg: "Fixed via Trampoline" },
  { framesCount: 1, status: 'fixed', action: "16. Solution 4: Asynchronous Offload (setTimeout)", note: "Each recursion becomes a new macrotask, resetting stack to depth 0!", errorMsg: "Fixed via Event Loop" },
  { framesCount: 1, status: 'fixed', action: "17. Solution 5: queueMicrotask Batching", note: "Chops big jobs into microtask chunks without stack buildup.", errorMsg: "Fixed via Microtask" },
  { framesCount: 1, status: 'fixed', action: "18. Key Rule: Stack is for depth, not volume", note: "Never use unbounded recursion for large datasets in JS.", errorMsg: "Best Practice" },
  { framesCount: 0, status: 'normal', action: "19. Stack memory safely reclaimed", note: "Engine returns to healthy idle state.", errorMsg: "" },
  { framesCount: 0, status: 'normal', action: "20. Stack Overflow & Memory Limits Mastered!", note: "Ready for Module 2: Host Web APIs!", errorMsg: "" }
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
          <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-100 text-blue-900 border border-blue-300 uppercase tracking-wider">
            Outcome 2 • Slide 07/20
          </span>
          <span class="text-xs text-slate-500 font-medium font-mono">Stack Limits</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-[10px] font-mono text-slate-500 font-bold">Step {{ currentIdx + 1 }} / 20</span>
          <div class="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              class="h-full transition-all duration-300 rounded-full"
              :class="currentStep.status === 'crashed' ? 'bg-rose-600' : 'bg-blue-600'"
              :style="{ width: ((currentIdx + 1) / 20) * 100 + '%' }"
            ></div>
          </div>
        </div>
      </div>

      <h1 class="text-2xl font-black text-slate-900 tracking-tight">
        Call Stack Overflow: Memory Exhaustion & RangeError
      </h1>
      <p class="text-xs text-slate-600 font-medium">
        What happens when infinite recursion blows past V8's ~10,000 stack frame limit.
      </p>
    </div>

    <!-- Active Step Action Banner -->
    <div class="border-2 p-2 rounded-lg flex items-center justify-between text-xs"
      :class="{
        'bg-rose-100 border-rose-400 text-rose-950 font-bold': currentStep.status === 'crashed',
        'bg-amber-50 border-amber-300 text-amber-950': currentStep.status === 'warning' || currentStep.status === 'critical',
        'bg-emerald-50 border-emerald-300 text-emerald-950': currentStep.status === 'fixed',
        'bg-blue-50 border-blue-200 text-blue-950': currentStep.status === 'normal'
      }"
    >
      <div class="flex items-center gap-2 font-bold">
        <span>{{ currentStep.status === 'crashed' ? '💥' : '▶' }}</span>
        <span>{{ currentStep.action }}</span>
      </div>
      <span class="text-[10.5px] opacity-80">{{ currentStep.note }}</span>
    </div>

    <!-- Main Grid: Code (Left) vs Stack Saturation Meter (Right) -->
    <div class="grid grid-cols-12 gap-3 my-1">
      <!-- Code Panel (5 Cols) -->
      <div class="col-span-5 bg-slate-950 rounded-xl p-3 text-white font-mono text-[10.5px] flex flex-col justify-between border border-slate-800">
        <div>
          <div class="text-[9px] uppercase tracking-wider text-slate-400 font-bold mb-2 pb-1 border-b border-slate-800 flex justify-between">
            <span>Dangerous Recursion</span>
            <span class="text-rose-400 font-bold">Unbounded</span>
          </div>
          <div class="space-y-1.5 leading-relaxed">
            <div class="text-purple-400">function <span class="text-amber-300">recurse</span>() {</div>
            <div class="text-slate-500">&nbsp;&nbsp;// No return condition!</div>
            <div class="text-rose-400 font-bold">&nbsp;&nbsp;recurse();</div>
            <div class="text-purple-400">}</div>
            <div class="text-amber-300 mt-2">recurse();</div>
          </div>
        </div>

        <div v-if="currentStep.errorMsg" class="mt-2 p-2 rounded bg-rose-950 border border-rose-600 text-rose-300 text-[9px] leading-tight">
          {{ currentStep.errorMsg }}
        </div>
      </div>

      <!-- Saturation Gauge & Frame Counter (7 Cols) -->
      <div class="col-span-7 bg-slate-50 border-2 border-slate-300 rounded-xl p-3 flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between text-[11px] font-black uppercase mb-1">
            <span class="text-slate-800">Stack Frame Saturation Gauge</span>
            <span class="font-mono text-xs font-black"
              :class="currentStep.status === 'crashed' ? 'text-rose-600' : 'text-blue-700'"
            >
              {{ currentStep.framesCount }} / 10,420 Frames
            </span>
          </div>

          <!-- Visual Progress Bar -->
          <div class="w-full h-4 bg-slate-200 rounded-full overflow-hidden p-0.5 mb-3 border">
            <div
              class="h-full rounded-full transition-all duration-300"
              :class="{
                'bg-blue-600': currentStep.status === 'normal' || currentStep.status === 'fixed',
                'bg-amber-500': currentStep.status === 'warning',
                'bg-orange-600': currentStep.status === 'critical',
                'bg-rose-600 animate-pulse': currentStep.status === 'crashed'
              }"
              :style="{ width: Math.min(100, (currentStep.framesCount / 10420) * 100) + '%' }"
            ></div>
          </div>

          <!-- Breakdown Details -->
          <div class="space-y-1.5 text-[10.5px]">
            <div class="p-1.5 bg-white rounded border flex justify-between">
              <span class="text-slate-600">Allocated Memory Limit:</span>
              <span class="font-mono font-bold text-slate-900">~1 MB per Thread</span>
            </div>
            <div class="p-1.5 bg-white rounded border flex justify-between">
              <span class="text-slate-600">V8 Stack Guard:</span>
              <span class="font-mono font-bold" :class="currentStep.status === 'crashed' ? 'text-rose-600' : 'text-emerald-700'">
                {{ currentStep.status === 'crashed' ? 'TRIGGERED (ABORT)' : 'ARMED & MONITORING' }}
              </span>
            </div>
            <div class="p-1.5 bg-white rounded border flex justify-between">
              <span class="text-slate-600">Safe Solution:</span>
              <span class="font-mono font-bold text-indigo-700">Trampoline / Asynchronous Yield</span>
            </div>
          </div>
        </div>

        <div class="text-[9.5px] text-center font-bold mt-2 py-1 rounded"
          :class="currentStep.status === 'crashed' ? 'bg-rose-100 text-rose-950' : 'bg-blue-100 text-blue-900'"
        >
          {{ currentStep.status === 'crashed' ? 'Stack Overflow halted to protect OS process!' : 'Stack memory within safe operating limits.' }}
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="flex items-center justify-between text-xs text-slate-500 border-t border-slate-200 pt-2 font-mono">
      <span>Module 2: Call Stack Limits • Stack Overflow Prevention</span>
      <span class="text-slate-600 font-bold">Slide 07 / 20</span>
    </div>
  </div>
</template>
