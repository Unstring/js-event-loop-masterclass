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
  action: string
  note: string
  heapObjects: { address: string; label: string; active: boolean }[]
  stackFrames: { name: string; vars: string; active: boolean }[]
}

const steps: Step[] = [
  { action: "1. Global Execution starts", note: "Call Stack allocates global() frame.", heapObjects: [], stackFrames: [{ name: "global()", vars: "base", active: true }] },
  { action: "2. Primitive const age = 30", note: "Stored directly on the Call Stack frame.", heapObjects: [], stackFrames: [{ name: "global()", vars: "age: 30", active: true }] },
  { action: "3. Object user = { name: 'Alice' } created", note: "V8 allocates memory in the Heap at address 0x10A.", heapObjects: [{ address: "0x10A", label: "{ name: 'Alice' }", active: true }], stackFrames: [{ name: "global()", vars: "user: ->0x10A", active: true }] },
  { action: "4. Function getUser() called", note: "Pushes getUser() frame on top of Call Stack.", heapObjects: [{ address: "0x10A", label: "{ name: 'Alice' }", active: false }], stackFrames: [{ name: "global()", vars: "user: ->0x10A", active: false }, { name: "getUser()", vars: "id: 101", active: true }] },
  { action: "5. Inner object profile created", note: "Allocated in Heap at address 0x20F.", heapObjects: [{ address: "0x10A", label: "{ name: 'Alice' }", active: false }, { address: "0x20F", label: "{ role: 'Admin' }", active: true }], stackFrames: [{ name: "global()", vars: "user: ->0x10A", active: false }, { name: "getUser()", vars: "prof: ->0x20F", active: true }] },
  { action: "6. Closure created referencing profile", note: "Closure maintains reference in Heap even if stack pops!", heapObjects: [{ address: "0x10A", label: "{ name: 'Alice' }", active: false }, { address: "0x20F", label: "{ role: 'Admin' }", active: true }, { address: "0x30C", label: "Closure[[Scope]]", active: true }], stackFrames: [{ name: "global()", vars: "user: ->0x10A", active: false }, { name: "getUser()", vars: "prof: ->0x20F", active: true }] },
  { action: "7. getUser() returns reference and pops", note: "Stack frame destroyed! Heap memory remains alive via reference.", heapObjects: [{ address: "0x10A", label: "{ name: 'Alice' }", active: false }, { address: "0x20F", label: "{ role: 'Admin' }", active: false }, { address: "0x30C", label: "Closure[[Scope]]", active: true }], stackFrames: [{ name: "global()", vars: "ref: ->0x30C", active: true }] },
  { action: "8. Temporary array items = [1, 2, 3]", note: "Array allocated in Heap at 0x40D.", heapObjects: [{ address: "0x10A", label: "{ name: 'Alice' }", active: false }, { address: "0x20F", label: "{ role: 'Admin' }", active: false }, { address: "0x30C", label: "Closure[[Scope]]", active: false }, { address: "0x40D", label: "[1, 2, 3]", active: true }], stackFrames: [{ name: "global()", vars: "items: ->0x40D", active: true }] },
  { action: "9. items = null (Reference cleared)", note: "Pointer removed from stack. Object 0x40D is now orphan/unreachable!", heapObjects: [{ address: "0x10A", label: "{ name: 'Alice' }", active: false }, { address: "0x20F", label: "{ role: 'Admin' }", active: false }, { address: "0x30C", label: "Closure[[Scope]]", active: false }, { address: "0x40D", label: "[ORPHAN]", active: true }], stackFrames: [{ name: "global()", vars: "items: null", active: true }] },
  { action: "10. V8 Garbage Collector triggered: Mark Phase", note: "GC traverses root pointers from Stack to Heap.", heapObjects: [{ address: "0x10A", label: "{ name: 'Alice' } [MARKED]", active: true }, { address: "0x20F", label: "{ role: 'Admin' } [MARKED]", active: true }, { address: "0x30C", label: "Closure [MARKED]", active: true }, { address: "0x40D", label: "[UNMARKED]", active: false }], stackFrames: [{ name: "global()", vars: "active roots", active: true }] },
  { action: "11. V8 GC: Sweep Phase cleans orphan memory", note: "Address 0x40D freed and returned to OS memory pool!", heapObjects: [{ address: "0x10A", label: "{ name: 'Alice' }", active: false }, { address: "0x20F", label: "{ role: 'Admin' }", active: false }, { address: "0x30C", label: "Closure[[Scope]]", active: false }], stackFrames: [{ name: "global()", vars: "active roots", active: true }] },
  { action: "12. Function compute() pushed to stack", note: "New stack frame created for synchronous computation.", heapObjects: [{ address: "0x10A", label: "{ name: 'Alice' }", active: false }, { address: "0x20F", label: "{ role: 'Admin' }", active: false }, { address: "0x30C", label: "Closure[[Scope]]", active: false }], stackFrames: [{ name: "global()", vars: "active roots", active: false }, { name: "compute()", vars: "temp: 99", active: true }] },
  { action: "13. compute() calculates return value", note: "CPU operates directly on registers & stack frame.", heapObjects: [{ address: "0x10A", label: "{ name: 'Alice' }", active: false }, { address: "0x20F", label: "{ role: 'Admin' }", active: false }, { address: "0x30C", label: "Closure[[Scope]]", active: false }], stackFrames: [{ name: "global()", vars: "active roots", active: false }, { name: "compute()", vars: "return 990", active: true }] },
  { action: "14. compute() pops from Call Stack", note: "Stack memory instantly reclaimed (fast pointer decrement).", heapObjects: [{ address: "0x10A", label: "{ name: 'Alice' }", active: false }, { address: "0x20F", label: "{ role: 'Admin' }", active: false }, { address: "0x30C", label: "Closure[[Scope]]", active: false }], stackFrames: [{ name: "global()", vars: "result: 990", active: true }] },
  { action: "15. Key Distinction: Stack is synchronous & contiguous", note: "Stack operates in LIFO order with hardware-level memory speed.", heapObjects: [{ address: "0x10A", label: "{ name: 'Alice' }", active: false }, { address: "0x20F", label: "{ role: 'Admin' }", active: false }, { address: "0x30C", label: "Closure[[Scope]]", active: false }], stackFrames: [{ name: "global()", vars: "result: 990", active: true }] },
  { action: "16. Heap is dynamic, flexible, and garbage-collected", note: "Heap stores objects of arbitrary size across the lifecycle.", heapObjects: [{ address: "0x10A", label: "{ name: 'Alice' }", active: true }, { address: "0x20F", label: "{ role: 'Admin' }", active: true }, { address: "0x30C", label: "Closure[[Scope]]", active: true }], stackFrames: [{ name: "global()", vars: "result: 990", active: true }] },
  { action: "17. Single Thread Rule applies to the Stack", note: "Exactly ONE frame can execute at any instant.", heapObjects: [{ address: "0x10A", label: "{ name: 'Alice' }", active: false }, { address: "0x20F", label: "{ role: 'Admin' }", active: false }, { address: "0x30C", label: "Closure[[Scope]]", active: false }], stackFrames: [{ name: "global()", vars: "Single Thread", active: true }] },
  { action: "18. Heap shared across the entire runtime environment", note: "All frames in the stack reference the same unified memory heap.", heapObjects: [{ address: "0x10A", label: "{ name: 'Alice' }", active: true }, { address: "0x20F", label: "{ role: 'Admin' }", active: true }, { address: "0x30C", label: "Closure[[Scope]]", active: true }], stackFrames: [{ name: "global()", vars: "Shared Heap", active: true }] },
  { action: "19. global() finishes and pops off stack", note: "Script execution concludes. Remaining memory cleaned up.", heapObjects: [], stackFrames: [] },
  { action: "20. Memory lifecycle cycle complete!", note: "You now understand V8 Memory Heap vs Call Stack allocation.", heapObjects: [], stackFrames: [] }
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
          <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-indigo-100 text-indigo-900 border border-indigo-300 uppercase tracking-wider">
            Outcome 1 • Slide 03/20
          </span>
          <span class="text-xs text-slate-500 font-medium font-mono">Engine Architecture</span>
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

      <h1 class="text-2xl font-black text-slate-900 tracking-tight">
        Inside V8: Memory Heap vs Call Stack
      </h1>
      <p class="text-xs text-slate-600 font-medium">
        Unstructured dynamic heap memory vs strictly ordered LIFO execution frames.
      </p>
    </div>

    <!-- Active Step Action Banner -->
    <div class="bg-indigo-50 border-2 border-indigo-200 p-2 rounded-lg flex items-center justify-between text-xs">
      <div class="flex items-center gap-2 font-bold text-indigo-950">
        <span class="text-indigo-600">▶</span>
        <span>{{ currentStep.action }}</span>
      </div>
      <span class="text-[10.5px] text-slate-500 font-medium">{{ currentStep.note }}</span>
    </div>

    <!-- Main Visual Split: Heap (Left) vs Stack (Right) -->
    <div class="grid grid-cols-12 gap-3 my-1">
      <!-- Memory Heap (6 Cols) -->
      <div class="col-span-6 bg-purple-50/70 border-2 border-purple-300 rounded-xl p-3 flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between text-[11px] font-black text-purple-950 uppercase mb-2">
            <span class="flex items-center gap-1.5"><span>🧠</span> V8 Memory Heap</span>
            <span class="text-[9px] bg-purple-200 text-purple-900 px-1.5 py-0.5 rounded font-bold">Dynamic Allocation</span>
          </div>

          <div class="grid grid-cols-2 gap-1.5 min-h-[135px] p-2 bg-white/90 rounded-lg border border-purple-200">
            <div
              v-for="obj in currentStep.heapObjects"
              :key="obj.address"
              class="p-2 rounded-lg border transition-all duration-300 flex flex-col justify-between shadow-xs"
              :class="obj.active
                ? 'bg-purple-100 border-purple-500 ring-2 ring-purple-300 text-purple-950 font-bold scale-[1.02]'
                : 'bg-slate-50 border-slate-200 text-slate-700'"
            >
              <div class="text-[9px] font-mono text-purple-700 font-bold">{{ obj.address }}</div>
              <div class="text-[10px] font-mono mt-1">{{ obj.label }}</div>
            </div>
            <div v-if="currentStep.heapObjects.length === 0" class="col-span-2 flex items-center justify-center text-slate-400 text-xs italic py-8">
              (Heap memory cleared / unallocated)
            </div>
          </div>
        </div>

        <div class="text-[9.5px] text-purple-900 font-bold text-center mt-2 bg-purple-100/60 py-1 rounded">
          Objects, arrays & closures survive across stack frame invocations
        </div>
      </div>

      <!-- Call Stack (6 Cols) -->
      <div class="col-span-6 bg-blue-50/70 border-2 border-blue-300 rounded-xl p-3 flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between text-[11px] font-black text-blue-950 uppercase mb-2">
            <span class="flex items-center gap-1.5"><span>⚡</span> Execution Call Stack</span>
            <span class="text-[9px] bg-blue-200 text-blue-900 px-1.5 py-0.5 rounded font-bold">LIFO (Single Thread)</span>
          </div>

          <div class="flex flex-col-reverse gap-1.5 min-h-[135px] p-2 bg-white/90 rounded-lg border border-blue-200">
            <div
              v-for="(f, fIdx) in currentStep.stackFrames"
              :key="f.name + fIdx"
              class="px-2.5 py-1.5 rounded-lg border transition-all duration-300 flex items-center justify-between shadow-xs"
              :class="f.active
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-500 ring-2 ring-blue-300 font-bold'
                : 'bg-blue-50 text-blue-900 border-blue-200'"
            >
              <span class="text-xs font-mono">{{ f.name }}</span>
              <span class="text-[9.5px] font-mono opacity-90">{{ f.vars }}</span>
            </div>
            <div v-if="currentStep.stackFrames.length === 0" class="flex items-center justify-center text-slate-400 text-xs italic py-8">
              (Call Stack Empty)
            </div>
          </div>
        </div>

        <div class="text-[9.5px] text-blue-900 font-bold text-center mt-2 bg-blue-100/60 py-1 rounded">
          Fast hardware-level pointer decrement when functions return
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="flex items-center justify-between text-xs text-slate-500 border-t border-slate-200 pt-2 font-mono">
      <span>Module 1: Single-Threaded Core • Engine Heap & Stack</span>
      <span class="text-slate-600 font-bold">Slide 03 / 20</span>
    </div>
  </div>
</template>
