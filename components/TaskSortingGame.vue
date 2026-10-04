<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  step?: number
}>()

const allTasks = [
  { name: 'setTimeout() callback', type: 'macro', note: 'Timer Host Web API' },
  { name: 'Promise.then() callback', type: 'micro', note: 'Promise Reaction Record' },
  { name: 'queueMicrotask(() => {})', type: 'micro', note: 'Explicit microtask queue' },
  { name: 'setInterval() callback', type: 'macro', note: 'Repeating Timer Web API' },
  { name: 'DOM click / input listener', type: 'macro', note: 'User Interaction Event' },
  { name: 'MutationObserver callback', type: 'micro', note: 'DOM Mutation Reaction' },
  { name: 'fetch() response handler', type: 'micro', note: 'Resolved Promise Chain' },
  { name: 'MessageChannel / postMessage', type: 'macro', note: 'Cross-origin / Worker Task' }
]

const visibleCount = computed(() => Math.min((props.step ?? 0) + 1, allTasks.length))
</script>

<template>
  <div class="h-full flex flex-col justify-between py-1 select-none overflow-hidden">
    <!-- Active prompt banner -->
    <div class="bg-slate-900 text-white px-3 py-1.5 rounded-lg flex items-center justify-between border border-slate-700 shrink-0">
      <div class="flex items-center gap-2">
        <span class="text-[9px] uppercase font-bold px-1.5 py-0.2 rounded bg-amber-400 text-slate-950">Classification</span>
        <span class="font-bold text-xs">Which Queue does this API register into?</span>
      </div>
      <span class="text-[10px] font-mono font-bold text-amber-300">
        {{ visibleCount }} of {{ allTasks.length }} Classified
      </span>
    </div>

    <!-- The 2 Queues Comparison Grid -->
    <div class="grid grid-cols-12 gap-2 my-auto flex-1 items-stretch min-h-0">
      <!-- Microtasks Column (Green) -->
      <div class="col-span-6 bg-green-50/70 border-2 border-green-500 rounded-xl p-2.5 flex flex-col justify-between shadow-xs overflow-hidden">
        <div>
          <div class="flex items-center justify-between pb-1 border-b border-green-300">
            <span class="font-bold text-green-950 text-xs">⚡ Microtask Queue</span>
            <span class="text-[8px] bg-green-600 text-white font-bold px-1.5 py-0.2 rounded">Runs Before Render</span>
          </div>

          <div class="mt-1.5 space-y-1 overflow-y-auto max-h-[220px]">
            <div
              v-for="item in allTasks.slice(0, visibleCount).filter(t => t.type === 'micro')"
              :key="item.name"
              class="bg-white border border-green-400 rounded-lg p-1.5 font-mono text-[11px] font-bold text-green-950 flex items-center justify-between shadow-xs"
            >
              <span>{{ item.name }}</span>
              <span class="text-[9px] text-green-800 font-sans font-semibold bg-green-100 px-1 py-0.2 rounded">
                {{ item.note }}
              </span>
            </div>
          </div>
        </div>

        <div class="text-[10px] bg-green-200/90 text-green-950 p-1.5 rounded-lg font-bold shrink-0">
          Rule: JS drains ALL microtasks to 0 before yielding to render or next macrotask!
        </div>
      </div>

      <!-- Macrotasks Column (Purple) -->
      <div class="col-span-6 bg-purple-50/70 border-2 border-purple-500 rounded-xl p-2.5 flex flex-col justify-between shadow-xs overflow-hidden">
        <div>
          <div class="flex items-center justify-between pb-1 border-b border-purple-300">
            <span class="font-bold text-purple-950 text-xs">📦 Macrotask Queue</span>
            <span class="text-[8px] bg-purple-600 text-white font-bold px-1.5 py-0.2 rounded">1 Task Per Tick</span>
          </div>

          <div class="mt-1.5 space-y-1 overflow-y-auto max-h-[220px]">
            <div
              v-for="item in allTasks.slice(0, visibleCount).filter(t => t.type === 'macro')"
              :key="item.name"
              class="bg-white border border-purple-400 rounded-lg p-1.5 font-mono text-[11px] font-bold text-purple-950 flex items-center justify-between shadow-xs"
            >
              <span>{{ item.name }}</span>
              <span class="text-[9px] text-purple-800 font-sans font-semibold bg-purple-100 px-1 py-0.2 rounded">
                {{ item.note }}
              </span>
            </div>
          </div>
        </div>

        <div class="text-[10px] bg-purple-200/90 text-purple-950 p-1.5 rounded-lg font-bold shrink-0">
          Rule: Only ONE macrotask executes per loop turn before microtask queue is checked!
        </div>
      </div>
    </div>
  </div>
</template>
