<script setup lang="ts">
import { ref } from 'vue'

const isExpanded = ref(false)

const domains = [
  { name: 'Call Stack', bg: '#DBEAFE', text: '#1D4ED8', border: '#3B82F6' },
  { name: 'Web APIs', bg: '#FFEDD5', text: '#C2410C', border: '#F97316' },
  { name: 'Microtask Queue', bg: '#DCFCE7', text: '#15803D', border: '#22C55E' },
  { name: 'Macrotask Queue', bg: '#EDE9FE', text: '#6D28D9', border: '#8B5CF6' },
  { name: 'Event Loop', bg: '#FEE2E2', text: '#B91C1C', border: '#EF4444' },
  { name: 'Console', bg: '#F1F5F9', text: '#1E293B', border: '#64748B' },
  { name: 'Heap / Memory', bg: '#FEF9C3', text: '#A16207', border: '#EAB308' }
]
</script>

<template>
  <div class="fixed top-3 right-4 z-50 select-none text-xs font-sans">
    <div
      v-if="!isExpanded"
      @click="isExpanded = true"
      class="cursor-pointer bg-white/95 border-2 border-slate-300 shadow-md rounded-full px-3 py-1 font-bold text-slate-700 hover:border-slate-500 hover:bg-slate-50 transition flex items-center gap-1.5"
    >
      <span class="inline-block w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></span>
      <span>Color Legend</span>
      <span class="text-slate-400">▼</span>
    </div>

    <div
      v-else
      class="bg-white border-2 border-slate-300 shadow-xl rounded-xl p-3 w-64 backdrop-blur-md"
    >
      <div class="flex items-center justify-between pb-2 mb-2 border-b border-slate-200">
        <span class="font-extrabold text-sm text-slate-800 tracking-wide uppercase">Runtime Legend</span>
        <button
          @click="isExpanded = false"
          class="text-slate-400 hover:text-slate-700 text-sm font-bold px-1"
        >
          ✕
        </button>
      </div>

      <div class="space-y-1.5">
        <div
          v-for="d in domains"
          :key="d.name"
          class="flex items-center gap-2 px-2 py-1 rounded-lg border font-semibold text-xs"
          :style="{ backgroundColor: d.bg, color: d.text, borderColor: d.border }"
        >
          <span
            class="w-3 h-3 rounded-full border shrink-0"
            :style="{ backgroundColor: d.text, borderColor: d.border }"
          ></span>
          <span>{{ d.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
