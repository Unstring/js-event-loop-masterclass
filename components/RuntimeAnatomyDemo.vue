<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  step?: number
}>()

const activePart = computed(() => {
  const s = props.step ?? 0
  if (s <= 1) return 'overview'
  if (s === 2) return 'heap'
  if (s === 3) return 'stack'
  if (s === 4) return 'host'
  if (s === 5) return 'micro'
  if (s === 6) return 'macro'
  return 'eventloop'
})
</script>

<template>
  <div class="h-full flex flex-col justify-between py-1 select-none overflow-hidden">
    <!-- Visual Architecture Layout -->
    <div class="grid grid-cols-12 gap-2 my-auto flex-1 items-stretch">
      <!-- Left Box: The JavaScript Engine (V8) -->
      <div
        class="col-span-5 bg-white border-2 rounded-xl p-2.5 flex flex-col justify-between shadow-xs transition-all"
        :class="{
          'border-blue-600 ring-2 ring-blue-300': activePart === 'stack' || activePart === 'heap' || activePart === 'overview',
          'border-slate-300': activePart !== 'stack' && activePart !== 'heap' && activePart !== 'overview'
        }"
      >
        <div class="flex items-center justify-between pb-1 border-b border-slate-200">
          <div class="flex items-center gap-1">
            <span class="text-sm">⚙️</span>
            <span class="font-extrabold text-slate-900 text-xs">JS Engine (V8)</span>
          </div>
          <span class="text-[9px] font-bold bg-slate-200 text-slate-800 px-1.5 py-0.2 rounded">Core</span>
        </div>

        <!-- Engine internal components -->
        <div class="grid grid-cols-2 gap-1.5 my-1.5 flex-1">
          <!-- Memory Heap -->
          <div
            class="bg-amber-50 border rounded-lg p-2 flex flex-col justify-between transition-all"
            :class="activePart === 'heap' ? 'border-amber-600 ring-1 ring-amber-400 bg-amber-100' : 'border-amber-300'"
          >
            <div class="font-extrabold text-amber-950 text-[11px] flex items-center justify-between">
              <span>Memory Heap</span>
              <span class="text-[8px] bg-amber-300 px-1 rounded">Yellow</span>
            </div>
            <p class="text-[10px] text-amber-900 font-semibold leading-tight my-0.5">
              Allocates objects, closures, arrays, and variables.
            </p>
            <div class="font-mono text-[9px] bg-white p-1 rounded border border-amber-200 text-amber-900">
              { user: 0x4f12 }
            </div>
          </div>

          <!-- Call Stack -->
          <div
            class="bg-blue-50 border rounded-lg p-2 flex flex-col justify-between transition-all"
            :class="activePart === 'stack' ? 'border-blue-600 ring-1 ring-blue-400 bg-blue-100' : 'border-blue-300'"
          >
            <div class="font-extrabold text-blue-950 text-[11px] flex items-center justify-between">
              <span>Call Stack</span>
              <span class="text-[8px] bg-blue-300 text-blue-950 px-1 rounded">Blue</span>
            </div>
            <p class="text-[10px] text-blue-900 font-semibold leading-tight my-0.5">
              Single LIFO execution thread. Where frames execute.
            </p>
            <div class="font-mono text-[9px] bg-white p-1 rounded border border-blue-200 text-blue-900">
              [ main() ➔ foo() ]
            </div>
          </div>
        </div>

        <div class="text-[10px] font-semibold text-slate-600 bg-slate-100 p-1 rounded text-center">
          Engine does NOT have `setTimeout`, `fetch`, or `DOM` built in!
        </div>
      </div>

      <!-- Center Box: The Event Loop Bridge -->
      <div
        class="col-span-2 bg-red-50 border-2 rounded-xl p-2 flex flex-col items-center justify-between shadow-xs transition-all"
        :class="activePart === 'eventloop' ? 'border-red-600 ring-2 ring-red-400 bg-red-100' : 'border-red-400'"
      >
        <div class="text-center">
          <div class="w-7 h-7 mx-auto rounded-full bg-red-600 text-white flex items-center justify-center font-black text-sm animate-spin">
            ↻
          </div>
          <div class="font-extrabold text-[11px] text-red-950 mt-1">Event Loop</div>
          <div class="text-[8px] font-bold text-red-700 bg-red-200 px-1 py-0.2 rounded-full mt-0.5">
            Red
          </div>
        </div>

        <p class="text-[9px] font-semibold text-red-900 text-center leading-tight">
          Pulls callbacks into the stack ONLY when stack is empty!
        </p>

        <div class="text-[9px] font-mono font-bold bg-white px-1.5 py-0.5 rounded border border-red-300 text-red-800 text-center w-full">
          Stack == [] ?
        </div>
      </div>

      <!-- Right Box: Host Environment + Queues -->
      <div class="col-span-5 flex flex-col gap-1.5">
        <!-- Host Environment -->
        <div
          class="bg-orange-50 border rounded-xl p-2 shadow-xs transition-all"
          :class="activePart === 'host' ? 'border-orange-600 ring-1 ring-orange-400 bg-orange-100' : 'border-orange-300'"
        >
          <div class="flex items-center justify-between pb-0.5 border-b border-orange-200">
            <span class="font-extrabold text-orange-950 text-[11px]">Host Environment (Browser / Node)</span>
            <span class="text-[8px] bg-orange-200 text-orange-900 font-bold px-1 rounded">Orange</span>
          </div>
          <p class="text-[10px] text-orange-900 font-semibold mt-0.5">
            Web APIs (DOM, timers, fetch) in Browser, or C++ Libuv thread pool in Node.js.
          </p>
        </div>

        <!-- Queues Container -->
        <div class="flex-1 grid grid-cols-2 gap-1.5">
          <!-- Microtasks -->
          <div
            class="bg-green-50 border rounded-lg p-1.5 flex flex-col justify-between transition-all"
            :class="activePart === 'micro' ? 'border-green-600 ring-1 ring-green-400 bg-green-100' : 'border-green-300'"
          >
            <div class="flex items-center justify-between text-[11px] font-extrabold text-green-950">
              <span>Microtask Queue</span>
              <span class="text-[8px] bg-green-200 text-green-900 px-1 rounded">Green</span>
            </div>
            <p class="text-[9px] text-green-900 font-semibold leading-tight">
              High priority: Promise `.then`, `queueMicrotask`.
            </p>
            <div class="text-[8px] font-bold text-green-800 bg-white p-0.5 rounded border border-green-200 text-center">
              Drained immediately after stack
            </div>
          </div>

          <!-- Macrotasks -->
          <div
            class="bg-purple-50 border rounded-lg p-1.5 flex flex-col justify-between transition-all"
            :class="activePart === 'macro' ? 'border-purple-600 ring-1 ring-purple-400 bg-purple-100' : 'border-purple-300'"
          >
            <div class="flex items-center justify-between text-[11px] font-extrabold text-purple-950">
              <span>Macrotask Queue</span>
              <span class="text-[8px] bg-purple-200 text-purple-900 px-1 rounded">Purple</span>
            </div>
            <p class="text-[9px] text-purple-900 font-semibold leading-tight">
              Standard tasks: `setTimeout`, `setInterval`, events.
            </p>
            <div class="text-[8px] font-bold text-purple-800 bg-white p-0.5 rounded border border-purple-200 text-center">
              1 task per loop tick
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
