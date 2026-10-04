<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  step?: number
}>()

const s = computed(() => props.step ?? 0)

const status = computed(() => {
  if (s.value === 0) return 'pending'
  if (s.value === 1) return 'executor'
  if (s.value === 2) return 'settling'
  return 'fulfilled'
})
</script>

<template>
  <div class="h-full flex flex-col justify-between py-1 select-none overflow-hidden">
    <!-- State banner -->
    <div class="bg-slate-900 text-white px-3 py-1.5 rounded-lg flex items-center justify-between border border-slate-700 shrink-0">
      <div class="flex items-center gap-1.5">
        <span class="text-[9px] uppercase font-bold px-1.5 py-0.2 rounded bg-blue-600">Promise State</span>
        <span class="font-bold text-xs">Internal Slots: [[PromiseState]] & [[PromiseResult]]</span>
      </div>
      <span
        class="text-[9px] font-mono font-black uppercase px-2 py-0.2 rounded-full"
        :class="{
          'bg-amber-400 text-slate-950': status === 'pending' || status === 'executor',
          'bg-emerald-400 text-slate-950': status === 'fulfilled' || status === 'settling'
        }"
      >
        State: {{ status === 'executor' ? 'pending (executing)' : status }}
      </span>
    </div>

    <!-- Promise Diagram -->
    <div class="grid grid-cols-12 gap-2 my-auto flex-1 items-stretch min-h-0">
      <!-- Left: Code & Executor details -->
      <div class="col-span-6 bg-slate-50 border-2 border-slate-300 rounded-xl p-2.5 flex flex-col justify-between shadow-xs">
        <div>
          <div class="font-bold text-[11px] uppercase tracking-wider text-slate-700 mb-1">
            Promise Constructor Execution
          </div>
          <pre class="bg-white p-2 rounded-lg border border-slate-200 font-mono text-[11px] leading-relaxed text-slate-900 font-bold">
const p = new Promise((resolve, reject) => {
  // CRITICAL: This executor runs SYNCHRONOUSLY!
  console.log('executor runs right now!');
  resolve(42); // Transitions state permanently
});
p.then(val => console.log('got:', val));
          </pre>
        </div>

        <div class="bg-blue-100 border border-blue-400 p-2 rounded-lg text-[10px] font-bold text-blue-950">
          ⚡ <strong>Synchronous Trap:</strong> The callback passed to `new Promise(...)` executes immediately on Call Stack! Only `.then()` is deferred to microtasks.
        </div>
      </div>

      <!-- Right: Internal Slots Machine -->
      <div class="col-span-6 bg-green-50/50 border-2 border-green-500 rounded-xl p-2.5 flex flex-col justify-between shadow-xs">
        <div class="font-bold text-[11px] uppercase tracking-wider text-green-950 mb-1">
          V8 Internal Promise Object
        </div>

        <div class="space-y-1.5">
          <!-- Slot 1: [[PromiseState]] -->
          <div class="bg-white border border-green-300 rounded-lg p-2 shadow-xs">
            <div class="text-[10px] font-bold text-slate-600 mb-0.5">[[PromiseState]]</div>
            <div
              class="font-mono text-xs font-black px-1.5 py-0.5 rounded border inline-block"
              :class="{
                'bg-amber-100 text-amber-900 border-amber-300': status === 'pending' || status === 'executor',
                'bg-emerald-100 text-emerald-900 border-emerald-400': status === 'fulfilled' || status === 'settling'
              }"
            >
              "{{ status === 'executor' ? 'pending' : status }}"
            </div>
            <span class="text-[10px] text-slate-500 ml-2">(Immutable once settled)</span>
          </div>

          <!-- Slot 2: [[PromiseResult]] -->
          <div class="bg-white border border-green-300 rounded-lg p-2 shadow-xs">
            <div class="text-[10px] font-bold text-slate-600 mb-0.5">[[PromiseResult]]</div>
            <div class="font-mono text-xs font-black text-slate-950 bg-slate-100 px-1.5 py-0.5 rounded border inline-block">
              {{ status === 'fulfilled' || status === 'settling' ? '42' : 'undefined' }}
            </div>
          </div>

          <!-- Slot 3: [[PromiseFulfillReactions]] -->
          <div class="bg-white border border-green-300 rounded-lg p-2 shadow-xs">
            <div class="text-[10px] font-bold text-slate-600 mb-0.5">[[PromiseFulfillReactions]] (Handlers)</div>
            <div class="font-mono text-[10px] text-green-900 bg-green-50 p-1 rounded border border-green-200 font-bold">
              {{ status === 'fulfilled' ? 'QueueMicrotask: [ (val) => log(val) ]' : '[ Pending registration ]' }}
            </div>
          </div>
        </div>

        <div class="text-[10px] bg-green-200/90 text-green-950 p-1.5 rounded-lg font-bold">
          Once resolved, calling `.then()` later will still immediately queue a microtask!
        </div>
      </div>
    </div>
  </div>
</template>
