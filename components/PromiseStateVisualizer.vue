<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    step?: number
    title?: string
  }>(),
  {
    step: 0,
    title: 'Promise State Machine & ECMAScript Internal Slots'
  }
)

interface PromiseSimStep {
  state: 'pending' | 'fulfilled' | 'rejected'
  result: string
  fulfillReactions: string[]
  rejectReactions: string[]
  microtaskQueue: string[]
  callStack: string
  action: string
  note: string
  specSlot: string
}

const pSteps: PromiseSimStep[] = [
  {
    state: 'pending',
    result: '<empty>',
    fulfillReactions: [],
    rejectReactions: [],
    microtaskQueue: [],
    callStack: "new Promise(executor)",
    action: "1. new Promise(executor) memory allocated in V8 Heap",
    note: "Initial internal state: [[PromiseState]] = 'pending', [[PromiseResult]] = undefined.",
    specSlot: "Allocated in Heap"
  },
  {
    state: 'pending',
    result: '<empty>',
    fulfillReactions: [],
    rejectReactions: [],
    microtaskQueue: [],
    callStack: "executor(resolve, reject)",
    action: "2. Synchronous Executor function runs IMMEDIATELY on Stack",
    note: "Common beginner misconception: The executor is NOT asynchronous!",
    specSlot: "Synchronous Execution"
  },
  {
    state: 'pending',
    result: '<empty>',
    fulfillReactions: [],
    rejectReactions: [],
    microtaskQueue: [],
    callStack: "setTimeout(resolve, 100)",
    action: "3. Executor offloads async operation to Web APIs / libuv",
    note: "Timer or network request initiates in background.",
    specSlot: "Offloaded to Host"
  },
  {
    state: 'pending',
    result: '<empty>',
    fulfillReactions: ['cb1(val)'],
    rejectReactions: [],
    microtaskQueue: [],
    callStack: "p.then(cb1)",
    action: "4. p.then(cb1) called while promise is 'pending'",
    note: "cb1 wrapped in PromiseReaction record and stored in [[PromiseFulfillReactions]].",
    specSlot: "Reaction Registered"
  },
  {
    state: 'pending',
    result: '<empty>',
    fulfillReactions: ['cb1(val)', 'cb2(val)'],
    rejectReactions: [],
    microtaskQueue: [],
    callStack: "p.then(cb2)",
    action: "5. p.then(cb2) second handler registered",
    note: "Appended to [[PromiseFulfillReactions]] list. Queue is still empty!",
    specSlot: "Reactions Appended"
  },
  {
    state: 'pending',
    result: '<empty>',
    fulfillReactions: ['cb1(val)', 'cb2(val)'],
    rejectReactions: ['catchCb(err)'],
    microtaskQueue: [],
    callStack: "p.catch(catchCb)",
    action: "6. p.catch(catchCb) error handler registered",
    note: "Stored in [[PromiseRejectReactions]]. State remains 'pending'.",
    specSlot: "Reject Handler Stored"
  },
  {
    state: 'pending',
    result: '<empty>',
    fulfillReactions: ['cb1(val)', 'cb2(val)'],
    rejectReactions: ['catchCb(err)'],
    microtaskQueue: [],
    callStack: "Host Timer Expired",
    action: "7. Background operation finishes: Host triggers resolve('Data 42')",
    note: "resolve() function called with resolution value.",
    specSlot: "Resolve Triggered"
  },
  {
    state: 'fulfilled',
    result: '"Data 42"',
    fulfillReactions: ['cb1(val)', 'cb2(val)'],
    rejectReactions: [],
    microtaskQueue: [],
    callStack: "resolve('Data 42')",
    action: "8. STATE TRANSITION: [[PromiseState]] locks into 'fulfilled'!",
    note: "[[PromiseResult]] is permanently set to 'Data 42'. Rejection list purged.",
    specSlot: "State Locked (Immutable)"
  },
  {
    state: 'fulfilled',
    result: '"Data 42"',
    fulfillReactions: ['cb2(val)'],
    rejectReactions: [],
    microtaskQueue: ['Job(cb1)'],
    callStack: "TriggerPromiseReactions",
    action: "9. V8 schedules PromiseReactionJob for cb1 into Microtasks",
    note: "Creates HostEnqueuePromiseJob for cb1.",
    specSlot: "Microtask 1 Scheduled"
  },
  {
    state: 'fulfilled',
    result: '"Data 42"',
    fulfillReactions: [],
    rejectReactions: [],
    microtaskQueue: ['Job(cb1)', 'Job(cb2)'],
    callStack: "TriggerPromiseReactions",
    action: "10. V8 schedules PromiseReactionJob for cb2 into Microtasks",
    note: "Both fulfillment handlers now queued. Handler lists cleared from Promise.",
    specSlot: "Microtask 2 Scheduled"
  },
  {
    state: 'fulfilled',
    result: '"Data 42"',
    fulfillReactions: [],
    rejectReactions: [],
    microtaskQueue: ['Job(cb1)', 'Job(cb2)'],
    callStack: "Stack Empty -> Checkpoint",
    action: "11. Call Stack clears: Event Loop reaches Microtask Checkpoint",
    note: "VIP Microtask queue begins draining immediately.",
    specSlot: "Checkpoint Active"
  },
  {
    state: 'fulfilled',
    result: '"Data 42"',
    fulfillReactions: [],
    rejectReactions: [],
    microtaskQueue: ['Job(cb2)'],
    callStack: "cb1('Data 42') [Stack]",
    action: "12. Dequeue cb1 to Call Stack -> Runs cb1('Data 42')",
    note: "Outputs result to user. Returns transformed value.",
    specSlot: "Job 1 Executing"
  },
  {
    state: 'fulfilled',
    result: '"Data 42"',
    fulfillReactions: [],
    rejectReactions: [],
    microtaskQueue: [],
    callStack: "cb2('Data 42') [Stack]",
    action: "13. Dequeue cb2 to Call Stack -> Runs cb2('Data 42')",
    note: "Both reaction jobs have finished. Queue is 100% drained.",
    specSlot: "Job 2 Executing"
  },
  {
    state: 'fulfilled',
    result: '"Data 42"',
    fulfillReactions: [],
    rejectReactions: [],
    microtaskQueue: [],
    callStack: "Empty",
    action: "14. Settled State Invariant: Cannot be resolved twice!",
    note: "Calling resolve() or reject() again does nothing; state is immutable.",
    specSlot: "Idempotent State"
  },
  {
    state: 'fulfilled',
    result: '"Data 42"',
    fulfillReactions: [],
    rejectReactions: [],
    microtaskQueue: ['Job(lateCb)'],
    callStack: "p.then(lateCb)",
    action: "15. Late Handler: p.then(lateCb) attached to settled promise",
    note: "Promise is ALREADY fulfilled. Does lateCb run synchronously? NO!",
    specSlot: "Late Registration"
  },
  {
    state: 'fulfilled',
    result: '"Data 42"',
    fulfillReactions: [],
    rejectReactions: [],
    microtaskQueue: ['Job(lateCb)'],
    callStack: "p.then returns immediately",
    action: "16. Zälgo Defense: lateCb is ALWAYS scheduled as a Microtask!",
    note: "ECMAScript guarantees .then callbacks are NEVER called synchronously.",
    specSlot: "Never Synchronous"
  },
  {
    state: 'fulfilled',
    result: '"Data 42"',
    fulfillReactions: [],
    rejectReactions: [],
    microtaskQueue: [],
    callStack: "lateCb('Data 42')",
    action: "17. lateCb dequeues and executes on next microtask tick",
    note: "Consistency and predictability across all promise consumers.",
    specSlot: "Async Guarantee"
  },
  {
    state: 'rejected',
    result: 'Error("Network Failed")',
    fulfillReactions: [],
    rejectReactions: [],
    microtaskQueue: ['Job(catchCb)'],
    callStack: "reject(Error)",
    action: "18. Rejection Lifecycle: [[PromiseState]] = 'rejected'",
    note: "Rejection flows down the chain until caught by .catch().",
    specSlot: "Rejection Pipeline"
  },
  {
    state: 'rejected',
    result: 'Error("Network Failed")',
    fulfillReactions: [],
    rejectReactions: [],
    microtaskQueue: [],
    callStack: "window.onunhandledrejection",
    action: "19. Unhandled Rejection Tracking in V8",
    note: "If no reject reaction exists, V8 notifies host (unhandledrejection event).",
    specSlot: "Host Telemetry"
  },
  {
    state: 'fulfilled',
    result: '"Data 42"',
    fulfillReactions: [],
    rejectReactions: [],
    microtaskQueue: [],
    callStack: "Ready",
    action: "20. Promise State Machine Mastered! Ready for Slide 18: Chaining",
    note: "You now understand all ECMAScript internal slots and reaction jobs!",
    specSlot: "Module 5 Complete"
  }
]

const currentIdx = computed(() => Math.min(Math.max(0, props.step), pSteps.length - 1))
const currentStep = computed(() => pSteps[currentIdx.value])
</script>

<template>
  <div class="promise-visualizer bg-white border-2 border-slate-300 rounded-xl p-3 shadow-md font-mono text-slate-800 text-xs select-none">
    <!-- Header -->
    <div class="flex items-center justify-between pb-2 mb-2 border-b border-slate-200">
      <div class="flex items-center gap-2">
        <span class="w-3 h-3 rounded-full bg-purple-600 animate-pulse"></span>
        <span class="font-extrabold text-xs uppercase tracking-tight text-slate-900">{{ title }}</span>
      </div>
      <div class="flex items-center gap-2">
        <span class="px-2 py-0.5 rounded text-[10px] font-black uppercase transition-all duration-200"
          :class="{
            'bg-amber-100 text-amber-900 border border-amber-300': currentStep.state === 'pending',
            'bg-emerald-100 text-emerald-900 border border-emerald-300': currentStep.state === 'fulfilled',
            'bg-rose-100 text-rose-900 border border-rose-300': currentStep.state === 'rejected',
          }"
        >
          [[PromiseState]]: {{ currentStep.state.toUpperCase() }}
        </span>
        <span class="bg-purple-100 text-purple-900 border border-purple-300 px-2 py-0.5 rounded text-[10px] font-black">
          Step {{ currentIdx + 1 }} / {{ pSteps.length }}
        </span>
      </div>
    </div>

    <!-- Active Step Action Banner -->
    <div class="p-2 mb-2 rounded-lg border-2 bg-purple-50 border-purple-300 flex items-center justify-between text-xs">
      <div class="flex items-center gap-2 font-bold text-purple-950">
        <span class="text-purple-600 animate-pulse">▶</span>
        <span>{{ currentStep.action }}</span>
      </div>
      <div class="flex items-center gap-2">
        <span class="text-[9.5px] font-bold font-mono px-2 py-0.5 rounded bg-purple-200 text-purple-950 border border-purple-300">
          {{ currentStep.specSlot }}
        </span>
        <span class="text-[10px] text-slate-600 font-medium">{{ currentStep.note }}</span>
      </div>
    </div>

    <!-- Main Grid: V8 Promise Internal Slots (Left 6) | Scheduled Microtask Queue (Right 6) -->
    <div class="grid grid-cols-12 gap-2.5 min-h-[195px]">
      
      <!-- Promise Object Internal Slots (6 Cols) -->
      <div class="col-span-6 bg-purple-50/70 border-2 border-purple-200 rounded-lg p-2.5 flex flex-col justify-between">
        <div>
          <div class="text-[10px] font-black text-purple-950 uppercase mb-1.5 flex items-center justify-between">
            <span>🔬 V8 Promise Internal Slots</span>
            <span class="text-[8px] bg-purple-200 text-purple-900 px-1 rounded font-bold">ECMA-262 Spec</span>
          </div>
          
          <div class="space-y-1.5 text-[10px]">
            <!-- State slot -->
            <div class="p-1.5 bg-white rounded border border-purple-200 flex items-center justify-between shadow-xs">
              <span class="text-purple-900 font-bold">[[PromiseState]]</span>
              <span class="font-mono px-2 py-0.5 rounded font-black text-[9.5px] transition-all duration-200"
                :class="{
                  'bg-amber-100 text-amber-900 border border-amber-300': currentStep.state === 'pending',
                  'bg-emerald-100 text-emerald-900 border border-emerald-300 animate-pulse': currentStep.state === 'fulfilled',
                  'bg-rose-100 text-rose-900 border border-rose-300': currentStep.state === 'rejected'
                }"
              >
                "{{ currentStep.state }}"
              </span>
            </div>

            <!-- Result slot -->
            <div class="p-1.5 bg-white rounded border border-purple-200 flex items-center justify-between shadow-xs">
              <span class="text-purple-900 font-bold">[[PromiseResult]]</span>
              <span class="font-mono text-slate-800 font-bold text-[9.5px] bg-slate-100 px-1.5 py-0.5 rounded">
                {{ currentStep.result }}
              </span>
            </div>

            <!-- Reaction Records -->
            <div class="p-1.5 bg-white rounded border border-purple-200 shadow-xs">
              <div class="text-[9px] text-purple-900 font-bold mb-1 flex justify-between">
                <span>[[PromiseFulfillReactions]]</span>
                <span class="text-purple-700 font-mono text-[8.5px]">Count: {{ currentStep.fulfillReactions.length }}</span>
              </div>
              <div class="flex flex-wrap gap-1 min-h-[22px]">
                <span
                  v-for="(r, rIdx) in currentStep.fulfillReactions"
                  :key="rIdx"
                  class="bg-purple-100 text-purple-900 text-[8.5px] px-1.5 py-0.5 rounded font-bold border border-purple-300"
                >
                  {{ r }}
                </span>
                <span v-if="currentStep.fulfillReactions.length === 0" class="text-slate-400 italic text-[8.5px]">
                  (No handlers registered)
                </span>
              </div>
            </div>

            <!-- Reject Reactions -->
            <div class="p-1.5 bg-white rounded border border-purple-200 shadow-xs">
              <div class="text-[9px] text-purple-900 font-bold mb-1 flex justify-between">
                <span>[[PromiseRejectReactions]]</span>
                <span class="text-purple-700 font-mono text-[8.5px]">Count: {{ currentStep.rejectReactions.length }}</span>
              </div>
              <div class="flex flex-wrap gap-1 min-h-[22px]">
                <span
                  v-for="(rj, rjIdx) in currentStep.rejectReactions"
                  :key="rjIdx"
                  class="bg-rose-100 text-rose-900 text-[8.5px] px-1.5 py-0.5 rounded font-bold border border-rose-300"
                >
                  {{ rj }}
                </span>
                <span v-if="currentStep.rejectReactions.length === 0" class="text-slate-400 italic text-[8.5px]">
                  (No rejection handlers)
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="text-[8.5px] text-purple-800 text-center font-bold mt-1 bg-purple-100/60 py-0.5 rounded">
          Call Stack Active: {{ currentStep.callStack }}
        </div>
      </div>

      <!-- Microtask Queue Destination (6 Cols) -->
      <div class="col-span-6 bg-slate-900 text-white rounded-lg p-2.5 flex flex-col justify-between border-2 border-slate-700 shadow-inner">
        <div>
          <div class="text-[10px] font-black text-purple-300 uppercase mb-1.5 flex items-center justify-between">
            <span>⚡ Scheduled Microtask VIP Jobs</span>
            <span class="text-[8px] bg-slate-800 text-emerald-400 px-1 rounded font-bold">Queue</span>
          </div>

          <div class="space-y-1 min-h-[120px] p-2 bg-black/60 rounded border border-slate-800">
            <div
              v-for="(job, jIdx) in currentStep.microtaskQueue"
              :key="jIdx"
              class="p-1.5 rounded bg-purple-950/90 border border-purple-500 text-purple-200 text-[9.5px] flex items-center justify-between animate-pulse"
            >
              <div class="flex items-center gap-1.5">
                <span class="text-purple-400">➜</span>
                <span class="font-mono font-bold">{{ job }}</span>
              </div>
              <span class="text-[8px] font-mono text-purple-300">PromiseReactionJob</span>
            </div>

            <div v-if="currentStep.microtaskQueue.length === 0" class="text-slate-500 text-[9.5px] italic text-center py-8">
              (Microtask Queue is currently empty • Drained)
            </div>
          </div>
        </div>

        <div class="text-[8.5px] text-slate-400 text-center font-mono mt-1 pt-1 border-t border-slate-800">
          Drained to 0 before any Macrotask turn or screen repaint
        </div>
      </div>

    </div>
  </div>
</template>
