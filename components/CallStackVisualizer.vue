<script setup lang="ts">
import { computed } from 'vue'

interface StackStep {
  frames: string[]
  action?: 'push' | 'pop' | 'idle'
  message?: string
  active?: string
}

const props = withDefaults(
  defineProps<{
    step?: number
    title?: string
    steps?: StackStep[]
    frames?: string[]
    maxHeight?: string
  }>(),
  {
    step: 0,
    title: 'Call Stack (LIFO Engine)',
    maxHeight: '260px',
  }
)

const currentData = computed(() => {
  if (props.steps && props.steps.length > 0) {
    const idx = Math.min(Math.max(0, props.step), props.steps.length - 1)
    return props.steps[idx]
  }
  return {
    frames: props.frames || [],
    action: 'idle' as const,
    message: '',
    active: props.frames && props.frames.length > 0 ? props.frames[props.frames.length - 1] : undefined
  }
})

const activeFrames = computed(() => currentData.value.frames || [])
const currentAction = computed(() => currentData.value.action || 'idle')
const currentMessage = computed(() => currentData.value.message || '')
</script>

<template>
  <div class="call-stack-container bg-white border-2 border-slate-200 rounded-xl p-3 shadow-md font-mono text-slate-800 flex flex-col justify-between" :style="{ maxHeight }">
    <div class="flex items-center justify-between border-b border-slate-200 pb-2 mb-2">
      <div class="flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse"></span>
        <span class="text-xs uppercase tracking-wider font-bold text-blue-900">{{ title }}</span>
      </div>
      <div class="flex items-center gap-2 text-[11px]">
        <span v-if="currentAction === 'push'" class="px-2 py-0.5 rounded font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
          PUSH ⭡
        </span>
        <span v-else-if="currentAction === 'pop'" class="px-2 py-0.5 rounded font-bold bg-rose-100 text-rose-800 border border-rose-300">
          POP ⭣
        </span>
        <span v-else class="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold border border-slate-200">
          IDLE
        </span>
        <span class="text-slate-600">Depth: <strong class="text-slate-900 font-black">{{ activeFrames.length }}</strong></span>
      </div>
    </div>

    <!-- Stack Content -->
    <div class="stack-body flex-1 flex flex-col-reverse justify-start gap-1.5 overflow-hidden p-2 min-h-[140px] bg-slate-50 border-2 border-dashed border-slate-200 rounded-lg">
      <TransitionGroup name="stack-frame">
        <div
          v-for="(frame, index) in activeFrames"
          :key="frame + '-' + index"
          class="stack-frame flex items-center justify-between px-3 py-1.5 rounded-md text-xs font-semibold shadow-sm transition-all duration-300"
          :class="index === activeFrames.length - 1 
            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 border border-blue-500 text-white shadow-md ring-2 ring-blue-300 font-bold' 
            : 'bg-white border border-slate-300 text-slate-800'"
        >
          <div class="flex items-center gap-2">
            <span class="text-[10px]" :class="index === activeFrames.length - 1 ? 'text-blue-100' : 'text-slate-400'">#{{ index + 1 }}</span>
            <span class="tracking-wide">{{ frame }}</span>
          </div>
          <span v-if="index === activeFrames.length - 1" class="text-[9px] uppercase px-1.5 py-0.5 bg-amber-400 text-slate-950 font-black rounded shadow-xs">
            TOP (Active)
          </span>
          <span v-else-if="index === 0" class="text-[9px] uppercase px-1.5 py-0.5 bg-slate-200 text-slate-700 font-bold rounded">
            Base
          </span>
        </div>
      </TransitionGroup>

      <div v-if="activeFrames.length === 0" class="h-full flex flex-col items-center justify-center text-slate-400 text-xs italic py-6">
        <span class="text-base mb-1">📭</span>
        Stack is Empty (Main thread idle)
      </div>
    </div>

    <!-- Message / Note below -->
    <div class="mt-2 pt-1 flex items-center justify-between text-[11px] text-slate-600 border-t border-slate-100">
      <div class="truncate text-slate-700">
        <span v-if="currentMessage" class="text-blue-700 font-bold">ℹ {{ currentMessage }}</span>
        <span v-else class="text-slate-500 font-medium">Last In, First Out (LIFO) Execution Context</span>
      </div>
      <div class="text-[10px] text-slate-400 uppercase tracking-widest pl-2 font-bold">Bottom ⏚</div>
    </div>
  </div>
</template>

<style scoped>
.stack-frame-enter-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.stack-frame-leave-active {
  transition: all 0.25s ease-in;
}
.stack-frame-enter-from {
  opacity: 0;
  transform: translateY(-20px) scale(0.95);
}
.stack-frame-leave-to {
  opacity: 0;
  transform: translateY(-25px) scale(0.9);
}
</style>
