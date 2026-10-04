<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    step?: number
    title?: string
  }>(),
  {
    step: 0,
    title: 'Multi-Threaded DOM Chaos vs Single-Threaded Event Loop'
  }
)

interface RaceStep {
  threadA: string
  threadB: string
  domState: string
  eventLoopState: string
  hasConflict: boolean
  action: string
  note: string
}

const raceSteps: RaceStep[] = [
  { threadA: 'Idle', threadB: 'Idle', domState: '<div id="box">Hello</div>', eventLoopState: 'Stack Idle', hasConflict: false, action: '1. Initial state: Single DOM node exists in memory', note: 'Two threads attempt concurrent operations on the same DOM element.' },
  { threadA: 'Read #box styles', threadB: 'Idle', domState: '<div id="box">Hello</div>', eventLoopState: 'Stack Idle', hasConflict: false, action: '2. Thread A reads geometry & styles of #box', note: 'Thread A begins layout computation.' },
  { threadA: 'Compute layout...', threadB: 'box.remove() invoked', domState: '💥 RACE CONDITION!', eventLoopState: 'Turn 1: Stack runs', hasConflict: true, action: '3. Thread B deletes the DOM node while Thread A is computing!', note: 'Without locks: Thread A crashes accessing dangling memory pointer!' },
  { threadA: 'Dangling Pointer Access!', threadB: 'Memory freed', domState: 'NULL POINTER DEREFERENCE', eventLoopState: 'Turn 1 completes', hasConflict: true, action: '4. Multi-threading requires complex Mutexes, Locks & Deadlock risks!', note: 'Deadlocks freeze the entire browser window.' },
  { threadA: 'Single Thread (No Locks)', threadB: 'Event Loop Order', domState: '<div id="box">Hello</div>', eventLoopState: 'Task 1: Style update', hasConflict: false, action: '5. The JS Solution: Single Thread with Run-to-Completion!', note: 'JavaScript avoids all race conditions: one task completes fully before next begins!' },
  { threadA: 'Task 1 Finishes', threadB: 'Next Tick', domState: '<div id="box" class="active">', eventLoopState: 'Task 2: remove()', hasConflict: false, action: '6. Task 2 runs in next turn: Clean, predictable DOM mutation!', note: 'Zero mutexes, zero deadlocks, zero race conditions on DOM.' }
]

const currentIdx = computed(() => Math.min(Math.max(0, props.step), raceSteps.length - 1))
const currentStep = computed(() => raceSteps[currentIdx.value])
</script>

<template>
  <div class="thread-vs-loop bg-white border-2 border-slate-300 rounded-xl p-3 shadow-md font-mono text-slate-800 text-xs select-none">
    <!-- Header -->
    <div class="flex items-center justify-between pb-2 mb-2 border-b border-slate-200">
      <div class="flex items-center gap-2">
        <span class="w-3 h-3 rounded-full bg-rose-600 animate-pulse"></span>
        <span class="font-extrabold text-xs uppercase tracking-tight text-slate-900">{{ title }}</span>
      </div>
      <div class="flex items-center gap-2">
        <span class="px-2 py-0.5 rounded text-[10px] font-black uppercase"
          :class="currentStep.hasConflict
            ? 'bg-rose-100 text-rose-900 border border-rose-300 ring-2 ring-rose-300 animate-bounce'
            : 'bg-emerald-100 text-emerald-900 border border-emerald-300'"
        >
          {{ currentStep.hasConflict ? '⚠️ RACE CONDITION DETECTED' : 'SAFE SEQUENTIAL TURN' }}
        </span>
        <span class="bg-slate-100 text-slate-800 border border-slate-300 px-2 py-0.5 rounded text-[10px] font-black">
          Step {{ currentIdx + 1 }} / {{ raceSteps.length }}
        </span>
      </div>
    </div>

    <!-- Main Comparison Grid -->
    <div class="grid grid-cols-12 gap-2.5 min-h-[190px]">
      
      <!-- Multi-Threaded Model (6 Cols) -->
      <div class="col-span-6 bg-rose-50/70 border-2 rounded-lg p-2.5 flex flex-col justify-between"
        :class="currentStep.hasConflict ? 'border-rose-500 ring-2 ring-rose-300' : 'border-rose-200'"
      >
        <div>
          <div class="flex items-center justify-between text-[10px] font-black text-rose-950 uppercase mb-1.5">
            <span>❌ Multi-Threaded DOM Contention</span>
            <span class="text-[8px] bg-rose-200 text-rose-900 px-1 rounded font-bold">Unsafe</span>
          </div>

          <div class="space-y-1.5 min-h-[110px] p-2 bg-white/90 rounded border border-rose-200 text-[10px]">
            <div class="p-1 rounded bg-slate-100 border flex justify-between">
              <span class="font-bold text-slate-700">Thread A:</span>
              <span class="text-rose-700 font-mono">{{ currentStep.threadA }}</span>
            </div>
            <div class="p-1 rounded bg-slate-100 border flex justify-between">
              <span class="font-bold text-slate-700">Thread B:</span>
              <span class="text-rose-700 font-mono">{{ currentStep.threadB }}</span>
            </div>
            <div class="p-1 rounded border flex justify-between font-bold"
              :class="currentStep.hasConflict ? 'bg-rose-100 text-rose-950 border-rose-300' : 'bg-slate-50 text-slate-700'"
            >
              <span>Shared DOM:</span>
              <span class="font-mono text-[9px]">{{ currentStep.domState }}</span>
            </div>
          </div>
        </div>

        <div class="text-[8.5px] text-rose-900 text-center font-bold mt-1">
          Requires Mutex locks, causing UI deadlocks & crashes
        </div>
      </div>

      <!-- Single-Threaded Event Loop (6 Cols) -->
      <div class="col-span-6 bg-emerald-50/70 border-2 border-emerald-300 rounded-lg p-2.5 flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between text-[10px] font-black text-emerald-950 uppercase mb-1.5">
            <span>✅ Single-Threaded Event Loop</span>
            <span class="text-[8px] bg-emerald-200 text-emerald-900 px-1 rounded font-bold">Safe</span>
          </div>

          <div class="space-y-1.5 min-h-[110px] p-2 bg-white/90 rounded border border-emerald-200 text-[10px]">
            <div class="p-1 rounded bg-slate-100 border flex justify-between">
              <span class="font-bold text-slate-700">Active Turn:</span>
              <span class="text-emerald-700 font-mono font-bold">{{ currentStep.eventLoopState }}</span>
            </div>
            <div class="p-1 rounded bg-emerald-100/60 border border-emerald-200 text-emerald-900 text-[9.5px]">
              ✔ Run-to-Completion guarantee: Each task finishes 100% uninterrupted.
            </div>
            <div class="p-1 rounded bg-emerald-100/60 border border-emerald-200 text-emerald-900 text-[9.5px]">
              ✔ Zero race conditions, zero locks, zero deadlocks on the DOM!
            </div>
          </div>
        </div>

        <div class="text-[8.5px] text-emerald-900 text-center font-bold mt-1">
          Non-blocking I/O offloaded to background threads
        </div>
      </div>

    </div>

    <!-- Bottom Status Note -->
    <div class="mt-2 pt-1.5 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-700 bg-slate-50 px-2 py-1 rounded">
      <div class="flex items-center gap-1.5 font-bold">
        <span class="text-indigo-600">▶ Action:</span>
        <span>{{ currentStep.action }}</span>
      </div>
      <div class="text-[9px] text-slate-400 font-mono">
        {{ currentStep.note }}
      </div>
    </div>
  </div>
</template>
