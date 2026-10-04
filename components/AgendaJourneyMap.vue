<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  step?: number
}>()

const s = computed(() => props.step ?? 0)

const outcomes = [
  {
    num: '01',
    title: 'Why JavaScript is Single-Threaded',
    detail: 'The 1995 DOM constraint, avoiding locks & mutexes, atomic state execution.',
    icon: '🧵'
  },
  {
    num: '02',
    title: 'The Call Stack & Execution Context',
    detail: 'LIFO frame mechanics, scope chains, lexical environment records, stack overflows.',
    icon: '📚'
  },
  {
    num: '03',
    title: 'Web APIs & setTimeout Internals',
    detail: 'Host C++ background threads, minimum delay guarantees, 4ms clamping, timer drift.',
    icon: '🌐'
  },
  {
    num: '04',
    title: 'Microtasks vs Macrotasks Priority',
    detail: 'Drain-to-zero rule, starvation hazards, 60 FPS rendering pipeline interaction.',
    icon: '⚡'
  },
  {
    num: '05',
    title: 'Promises, Async/Await & Real World',
    detail: 'Internal slots [[PromiseState]], microtask desugaring, error bubbling & network fetch.',
    icon: '🚀'
  }
]

const activeIndex = computed(() => {
  return Math.min(Math.floor(s.value / 5), outcomes.length - 1)
})
</script>

<template>
  <div class="h-full flex flex-col justify-around py-1 select-none overflow-hidden">
    <!-- Journey Pathway Cards -->
    <div class="space-y-1.5 my-auto">
      <div
        v-for="(item, idx) in outcomes"
        :key="item.num"
        class="border-2 rounded-xl px-3 py-2 flex items-center justify-between transition-all duration-200 shadow-xs"
        :class="idx === activeIndex
          ? 'bg-blue-50 border-blue-600 ring-2 ring-blue-300 scale-[1.01] shadow-sm'
          : idx < activeIndex
            ? 'bg-emerald-50 border-emerald-500 opacity-90'
            : 'bg-white border-slate-300 opacity-60'"
      >
        <div class="flex items-center gap-3">
          <div
            class="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-sm border shrink-0"
            :class="idx === activeIndex
              ? 'bg-blue-600 text-white border-blue-700'
              : idx < activeIndex
                ? 'bg-emerald-600 text-white border-emerald-700'
                : 'bg-slate-100 text-slate-500 border-slate-300'"
          >
            {{ idx < activeIndex ? '✓' : item.icon }}
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="text-[10px] font-mono font-bold text-slate-500">Outcome {{ item.num }}</span>
              <span
                v-if="idx === activeIndex"
                class="text-[8px] font-black uppercase bg-blue-600 text-white px-1.5 py-0.2 rounded-full animate-pulse"
              >
                Focusing Now
              </span>
            </div>
            <div class="text-xs font-bold text-slate-900 leading-tight">
              {{ item.title }}
            </div>
            <div class="text-[10px] text-slate-600 mt-0.5">
              {{ item.detail }}
            </div>
          </div>
        </div>

        <div class="shrink-0 text-right">
          <span
            class="font-mono text-[9px] font-black px-2 py-0.5 rounded border uppercase"
            :class="idx <= activeIndex ? 'bg-white text-slate-800 border-slate-300' : 'text-slate-400 border-slate-200'"
          >
            {{ idx <= activeIndex ? 'Unlocked' : 'Upcoming' }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
