<script setup lang="ts">
import { computed } from 'vue'

export interface TraceStep {
  line: number
  note: string
  stack?: string[]
  webApi?: string[]
  microtasks?: string[]
  macrotasks?: string[]
  console?: string[]
}

const props = withDefaults(
  defineProps<{
    code: string
    step?: number
    steps: TraceStep[]
    title?: string
  }>(),
  {
    step: 0,
    title: 'Execution Trace & State Inspector',
  }
)

const lines = computed(() => {
  return props.code.trim().split('\n')
})

const currentStepData = computed(() => {
  if (!props.steps || props.steps.length === 0) {
    return {
      line: 1,
      note: 'Starting execution...',
      stack: ['global()'],
      webApi: [],
      microtasks: [],
      macrotasks: [],
      console: []
    }
  }
  const idx = Math.min(Math.max(0, props.step), props.steps.length - 1)
  return props.steps[idx]
})

const activeLine = computed(() => currentStepData.value.line)
const note = computed(() => currentStepData.value.note)
const stack = computed(() => currentStepData.value.stack || [])
const webApi = computed(() => currentStepData.value.webApi || [])
const microtasks = computed(() => currentStepData.value.microtasks || [])
const macrotasks = computed(() => currentStepData.value.macrotasks || [])
const consoleLogs = computed(() => currentStepData.value.console || [])
</script>

<template>
  <div class="code-tracer-box bg-white border-2 border-slate-200 rounded-xl p-3 shadow-md font-mono text-slate-800 text-xs select-none">
    <!-- Header -->
    <div class="flex items-center justify-between pb-1.5 mb-2 border-b border-slate-200">
      <div class="flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse"></span>
        <span class="text-xs font-black text-slate-900 uppercase">{{ title }}</span>
      </div>
      <div class="flex items-center gap-2 text-[10px] text-slate-600 font-bold">
        <span>Step <strong class="text-blue-700 font-black">{{ Math.min(props.step + 1, props.steps.length) }}</strong> of {{ props.steps.length }}</span>
      </div>
    </div>

    <!-- 2-Column Split: Left = Code, Right = State & Console (16:9 vertical fit) -->
    <div class="grid grid-cols-12 gap-2.5 h-[230px]">
      
      <!-- Left: Code Snippet (col-span-6) -->
      <div class="col-span-6 bg-slate-50 rounded-lg p-2 border border-slate-300 flex flex-col justify-between overflow-hidden shadow-xs">
        <div class="text-[9px] uppercase tracking-wider text-slate-600 font-black mb-1 flex items-center justify-between border-b border-slate-200 pb-1">
          <span>JavaScript Source</span>
          <span class="text-blue-700 font-extrabold bg-blue-100 px-1.5 rounded">Line: {{ activeLine }}</span>
        </div>
        <div class="overflow-y-auto flex-1 font-mono text-[11px] leading-tight space-y-0.5">
          <div
            v-for="(codeLine, idx) in lines"
            :key="idx"
            class="flex items-center px-1.5 py-0.5 rounded transition-colors duration-200"
            :class="idx + 1 === activeLine 
              ? 'bg-blue-100 border-l-4 border-blue-600 text-blue-950 font-bold' 
              : 'text-slate-700 hover:text-slate-950'"
          >
            <span class="w-5 text-right pr-2 text-[10px] text-slate-400 select-none font-medium">{{ idx + 1 }}</span>
            <span class="truncate">{{ codeLine }}</span>
          </div>
        </div>
        <div class="mt-1 pt-1 border-t border-slate-200 text-[10px] text-blue-900 font-bold truncate">
          👉 {{ note }}
        </div>
      </div>

      <!-- Right: Call Stack, Web API/Queues, Console (col-span-6) -->
      <div class="col-span-6 flex flex-col justify-between gap-1.5 h-full">
        
        <!-- Live State Snapshot Cards -->
        <div class="grid grid-cols-2 gap-1.5">
          <!-- Mini Call Stack -->
          <div class="bg-blue-50/80 border border-blue-200 rounded p-1.5 shadow-xs">
            <div class="text-[9px] font-black text-blue-950 uppercase flex items-center justify-between mb-1">
              <span>⚡ Stack (LIFO)</span>
              <span class="text-blue-700 font-bold text-[8px] bg-blue-100 px-1 rounded">{{ stack.length }}</span>
            </div>
            <div class="flex flex-col-reverse gap-0.5 min-h-[36px]">
              <div
                v-for="(item, i) in stack"
                :key="i"
                class="px-1.5 py-0.5 rounded text-[10px] truncate shadow-xs"
                :class="i === stack.length - 1 ? 'bg-blue-600 text-white font-bold' : 'bg-white border border-slate-200 text-slate-800'"
              >
                {{ item }}
              </div>
              <div v-if="stack.length === 0" class="text-slate-400 text-[9px] italic">empty</div>
            </div>
          </div>

          <!-- Web APIs -->
          <div class="bg-emerald-50/80 border border-emerald-200 rounded p-1.5 shadow-xs">
            <div class="text-[9px] font-black text-emerald-950 uppercase flex items-center justify-between mb-1">
              <span>🌐 Web APIs</span>
              <span class="text-emerald-700 font-bold text-[8px] bg-emerald-100 px-1 rounded">{{ webApi.length }}</span>
            </div>
            <div class="flex flex-col gap-0.5 min-h-[36px]">
              <div
                v-for="(item, i) in webApi"
                :key="i"
                class="px-1.5 py-0.5 rounded text-[10px] bg-white border border-emerald-300 text-emerald-900 font-medium truncate shadow-xs"
              >
                {{ item }}
              </div>
              <div v-if="webApi.length === 0" class="text-slate-400 text-[9px] italic">idle</div>
            </div>
          </div>
        </div>

        <!-- Queues Snapshot Strip -->
        <div class="bg-slate-50 border border-slate-200 rounded p-1.5 text-[10px] space-y-1 shadow-xs">
          <div class="flex items-center justify-between">
            <span class="text-purple-900 font-black text-[9px]">⚡ Micro:</span>
            <div class="flex gap-1 overflow-x-auto truncate max-w-[150px]">
              <span v-for="(t, i) in microtasks" :key="i" class="px-1.5 py-0.5 rounded bg-purple-100 text-purple-900 border border-purple-300 text-[9px] font-bold">
                {{ t }}
              </span>
              <span v-if="microtasks.length === 0" class="text-slate-400 text-[8px] italic">empty</span>
            </div>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-amber-900 font-black text-[9px]">⏳ Macro:</span>
            <div class="flex gap-1 overflow-x-auto truncate max-w-[150px]">
              <span v-for="(t, i) in macrotasks" :key="i" class="px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300 text-[9px] font-bold">
                {{ t }}
              </span>
              <span v-if="macrotasks.length === 0" class="text-slate-400 text-[8px] italic">empty</span>
            </div>
          </div>
        </div>

        <!-- Live Console Terminal -->
        <div class="bg-slate-950 border border-slate-800 rounded p-1.5 flex-1 flex flex-col justify-between overflow-hidden shadow-sm">
          <div class="flex items-center justify-between border-b border-slate-800 pb-0.5 mb-1 text-[8px] text-slate-400">
            <span class="flex items-center gap-1 font-bold">
              <span class="w-1.5 h-1.5 rounded-full bg-red-400"></span>
              <span class="w-1.5 h-1.5 rounded-full bg-yellow-400"></span>
              <span class="w-1.5 h-1.5 rounded-full bg-green-400"></span>
              <span class="ml-1 uppercase font-mono text-slate-300">Browser Console</span>
            </span>
            <span class="font-bold text-slate-500">stdout</span>
          </div>
          <div class="flex-1 overflow-y-auto space-y-0.5 text-[10px] text-emerald-400 font-mono">
            <div v-for="(log, i) in consoleLogs" :key="i" class="flex items-center gap-1 font-semibold">
              <span class="text-slate-500">></span>
              <span>{{ log }}</span>
            </div>
            <div v-if="consoleLogs.length === 0" class="text-slate-600 text-[9px] italic">
              // waiting for logs...
            </div>
          </div>
        </div>

      </div>

    </div>
  </div>
</template>

<style scoped>
</style>
