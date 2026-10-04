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

interface StackStep {
  line: number
  action: string
  note: string
  frames: { name: string; ret?: string; active: boolean }[]
  retVal: string
}

const steps: StackStep[] = [
  { line: 7, action: "1. Global script execution begins", note: "Pushes global() frame to base of stack.", frames: [{ name: "global()", active: true }], retVal: "" },
  { line: 7, action: "2. a() invoked on Line 7", note: "Pushes a() frame. global() caller pauses.", frames: [{ name: "global()", active: false }, { name: "a()", active: true }], retVal: "" },
  { line: 5, action: "3. Inside a(): Calls b() on Line 5", note: "Pushes b() frame. a() caller pauses.", frames: [{ name: "global()", active: false }, { name: "a()", active: false }, { name: "b()", active: true }], retVal: "" },
  { line: 3, action: "4. Inside b(): Calls c() on Line 3", note: "Pushes c() frame. b() caller pauses.", frames: [{ name: "global()", active: false }, { name: "a()", active: false }, { name: "b()", active: false }, { name: "c()", active: true }], retVal: "" },
  { line: 1, action: "5. Inside c(): Evaluates return 42", note: "c() computes return value 42.", frames: [{ name: "global()", active: false }, { name: "a()", active: false }, { name: "b()", active: false }, { name: "c()", ret: "42", active: true }], retVal: "42" },
  { line: 3, action: "6. c() returns 42 and pops off stack", note: "c() frame destroyed! Value 42 handed to b().", frames: [{ name: "global()", active: false }, { name: "a()", active: false }, { name: "b()", ret: "from c() = 42", active: true }], retVal: "42" },
  { line: 4, action: "7. Inside b(): Computes return 42 * 2 = 84", note: "b() computes return value 84.", frames: [{ name: "global()", active: false }, { name: "a()", active: false }, { name: "b()", ret: "84", active: true }], retVal: "84" },
  { line: 5, action: "8. b() returns 84 and pops off stack", note: "b() frame destroyed! Value 84 handed to a().", frames: [{ name: "global()", active: false }, { name: "a()", ret: "from b() = 84", active: true }], retVal: "84" },
  { line: 6, action: "9. Inside a(): Computes return 84 + 1 = 85", note: "a() computes final return value 85.", frames: [{ name: "global()", active: false }, { name: "a()", ret: "85", active: true }], retVal: "85" },
  { line: 7, action: "10. a() returns 85 and pops off stack", note: "a() frame destroyed! Value 85 assigned in global().", frames: [{ name: "global()", ret: "result = 85", active: true }], retVal: "85" },
  { line: 8, action: "11. console.log(result) outputs 85", note: "stdout receives final computed value 85.", frames: [{ name: "global()", ret: "result = 85", active: true }], retVal: "85" },
  { line: 8, action: "12. Global execution completes", note: "global() frame destroyed. Stack depth = 0.", frames: [], retVal: "" },
  { line: 0, action: "13. LIFO Law 1: Last-In, First-Out", note: "The most recently called function is ALWAYS the first to return.", frames: [], retVal: "" },
  { line: 0, action: "14. Caller Suspension: Invocations halt caller", note: "When a() calls b(), a()'s execution context freezes until b() returns.", frames: [], retVal: "" },
  { line: 0, action: "15. Contiguous Stack Frame Allocation", note: "Frames allocate on the CPU stack segment for instant access.", frames: [], retVal: "" },
  { line: 0, action: "16. Return values travel backwards down the stack", note: "Value 42 -> 84 -> 85 propagated from top to bottom.", frames: [], retVal: "" },
  { line: 0, action: "17. Zero Concurrency inside the Call Stack", note: "One instruction at a time: JS never interrupts a running frame.", frames: [], retVal: "" },
  { line: 0, action: "18. Synchronous Run-to-Completion Rule", note: "A synchronous function runs until return or throw without yielding.", frames: [], retVal: "" },
  { line: 0, action: "19. Stack Memory Cleanup is instantaneous", note: "Hardware stack pointer simply moves down.", frames: [], retVal: "" },
  { line: 0, action: "20. Stack Lifecycle Mastered!", note: "You now hold an exact mechanical model of JS Call Stack execution.", frames: [], retVal: "" }
]

const currentIdx = computed(() => Math.min(Math.max(0, props.step), steps.length - 1))
const currentStep = computed(() => steps[currentIdx.value])

const codeLines = [
  "function c() { return 42; }",
  "",
  "function b() { return c() * 2; }",
  "",
  "function a() { return b() + 1; }",
  "",
  "const result = a();",
  "console.log(result); // 85"
]
</script>

<template>
  <div class="h-full flex flex-col justify-between select-none bg-white p-6 font-sans">
    <!-- Header -->
    <div>
      <div class="flex items-center justify-between mb-1">
        <div class="flex items-center gap-2">
          <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-100 text-blue-900 border border-blue-300 uppercase tracking-wider">
            Outcome 2 • Slide 05/20
          </span>
          <span class="text-xs text-slate-500 font-medium font-mono">Stack Unwinding</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-[10px] font-mono text-slate-500 font-bold">Step {{ currentIdx + 1 }} / 20</span>
          <div class="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              class="h-full bg-blue-600 transition-all duration-300 rounded-full"
              :style="{ width: ((currentIdx + 1) / 20) * 100 + '%' }"
            ></div>
          </div>
        </div>
      </div>

      <h1 class="text-2xl font-black text-slate-900 tracking-tight">
        The Call Stack in Action: Nested LIFO Execution
      </h1>
      <p class="text-xs text-slate-600 font-medium">
        Watch how function frames push, suspend callers, and unwind with return values.
      </p>
    </div>

    <!-- Active Step Banner -->
    <div class="bg-blue-50 border-2 border-blue-200 p-2 rounded-lg flex items-center justify-between text-xs">
      <div class="flex items-center gap-2 font-bold text-blue-950">
        <span class="text-blue-600">▶</span>
        <span>{{ currentStep.action }}</span>
      </div>
      <span class="text-[10.5px] text-slate-500 font-medium">{{ currentStep.note }}</span>
    </div>

    <!-- Split Grid: Code (Left) vs Stack (Right) -->
    <div class="grid grid-cols-12 gap-3 my-1">
      <!-- Code Panel (5 Cols) -->
      <div class="col-span-5 bg-slate-950 rounded-xl p-3 text-slate-200 font-mono text-[10.5px] flex flex-col justify-between border border-slate-800 shadow-inner">
        <div>
          <div class="text-[9px] uppercase tracking-wider text-slate-400 font-bold mb-2 pb-1 border-b border-slate-800 flex justify-between">
            <span>JavaScript Source</span>
            <span class="text-blue-400">Nested Calls</span>
          </div>
          <div class="space-y-1 leading-relaxed">
            <div
              v-for="(line, idx) in codeLines"
              :key="idx"
              class="px-2 py-0.5 rounded transition-all duration-200 flex items-center gap-2"
              :class="currentStep.line === idx + 1
                ? 'bg-blue-600 text-white font-bold ring-1 ring-blue-300 translate-x-1 shadow-sm'
                : 'text-slate-400'"
            >
              <span class="w-3 text-[9px] opacity-40 text-right">{{ idx + 1 }}</span>
              <span>{{ line || ' ' }}</span>
            </div>
          </div>
        </div>
        <div class="mt-2 pt-1 border-t border-slate-800 text-[9px] text-blue-300 truncate">
          Active Line: {{ currentStep.line > 0 ? 'Line ' + currentStep.line : 'Finished' }}
        </div>
      </div>

      <!-- Call Stack (7 Cols) -->
      <div class="col-span-7 bg-blue-50/70 border-2 border-blue-300 rounded-xl p-3 flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between text-[11px] font-black text-blue-950 uppercase mb-2">
            <span class="flex items-center gap-1.5"><span>⚡</span> Live Call Stack</span>
            <div class="flex items-center gap-2">
              <span v-if="currentStep.retVal" class="text-[9.5px] bg-emerald-100 text-emerald-900 border border-emerald-300 px-2 py-0.5 rounded font-bold">
                Return: {{ currentStep.retVal }}
              </span>
              <span class="text-[9px] bg-blue-200 text-blue-900 px-1.5 py-0.5 rounded font-bold">
                Depth: {{ currentStep.frames.length }}
              </span>
            </div>
          </div>

          <div class="flex flex-col-reverse gap-1.5 min-h-[135px] p-2 bg-white/90 rounded-lg border border-blue-200">
            <div
              v-for="(f, fIdx) in currentStep.frames"
              :key="f.name + fIdx"
              class="px-3 py-1.5 rounded-lg border transition-all duration-300 flex items-center justify-between shadow-xs"
              :class="f.active
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-500 ring-2 ring-blue-300 font-bold'
                : 'bg-slate-100 text-slate-700 border-slate-300'"
            >
              <div class="flex items-center gap-2">
                <span class="text-[9px] opacity-70">#{{ fIdx + 1 }}</span>
                <span class="text-xs font-mono">{{ f.name }}</span>
              </div>
              <div class="flex items-center gap-2">
                <span v-if="f.ret" class="text-[9px] font-mono bg-white/20 px-1 rounded">{{ f.ret }}</span>
                <span class="text-[8.5px] uppercase px-1.5 py-0.5 rounded font-black"
                  :class="f.active ? 'bg-amber-400 text-slate-950' : 'bg-slate-200 text-slate-600'"
                >
                  {{ f.active ? 'Active' : 'Suspended' }}
                </span>
              </div>
            </div>
            <div v-if="currentStep.frames.length === 0" class="flex items-center justify-center text-slate-400 text-xs italic py-8">
              (Call Stack Empty - Ready for next task)
            </div>
          </div>
        </div>

        <div class="text-[9.5px] text-blue-900 font-bold text-center mt-2 bg-blue-100/60 py-1 rounded">
          Top frame has exclusive thread control; suspended frames wait for return values
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="flex items-center justify-between text-xs text-slate-500 border-t border-slate-200 pt-2 font-mono">
      <span>Module 2: Call Stack Mechanics • LIFO Unwinding</span>
      <span class="text-slate-600 font-bold">Slide 05 / 20</span>
    </div>
  </div>
</template>
