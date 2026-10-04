<script setup lang="ts">
import type { StackFrame } from '../composables/useSimulator'

defineProps<{
  frames?: (StackFrame | string)[]
  isBlocked?: boolean
}>()
</script>

<template>
  <div class="h-full flex flex-col bg-blue-50/40 border-2 border-blue-500 rounded-xl shadow-xs overflow-hidden">
    <!-- Header -->
    <div class="bg-blue-600 text-white px-2.5 py-1 flex items-center justify-between shrink-0">
      <div class="flex items-center gap-1">
        <span class="text-xs">📚</span>
        <span class="font-bold text-[11px] uppercase tracking-wider">Call Stack (LIFO)</span>
      </div>
      <span class="text-[9px] font-mono bg-blue-800 px-1.5 py-0.2 rounded-full font-bold">
        {{ (frames || []).length }} Frame{{ (frames || []).length === 1 ? '' : 's' }}
      </span>
    </div>

    <!-- Stack Content -->
    <div class="flex-1 p-1.5 flex flex-col-reverse justify-start gap-1 overflow-y-auto min-h-0">
      <div
        v-if="!frames || frames.length === 0"
        class="flex-1 flex flex-col items-center justify-center text-blue-400 font-semibold text-[11px] border border-dashed border-blue-200 rounded-lg p-2"
      >
        <span>( Stack Empty )</span>
      </div>

      <TransitionGroup name="token-move">
        <div
          v-for="(f, idx) in frames"
          :key="typeof f === 'string' ? `${f}-${idx}` : `${f.name}-${idx}`"
          class="bg-blue-100 border border-blue-500 rounded-lg p-1.5 shadow-xs transition-all"
          :class="{
            'ring-1 ring-blue-700 bg-blue-200 font-bold': idx === frames.length - 1,
            'bg-rose-100 border-rose-600 text-rose-900': isBlocked
          }"
        >
          <div class="flex items-center justify-between">
            <div class="font-mono text-xs font-bold text-blue-950 flex items-center gap-1">
              <span v-if="idx === frames.length - 1" class="text-[9px] text-blue-700">▶</span>
              <span>{{ typeof f === 'string' ? f : f.name }}</span>
              <span v-if="typeof f !== 'string' && f.args" class="text-[10px] font-normal text-blue-700">
                ({{ f.args }})
              </span>
            </div>
            <span
              v-if="idx === frames.length - 1"
              class="text-[8px] uppercase font-black bg-blue-600 text-white px-1 py-0.2 rounded"
            >
              Active
            </span>
          </div>

          <!-- Local Variables -->
          <div
            v-if="typeof f !== 'string' && f.locals && Object.keys(f.locals).length > 0"
            class="mt-0.5 pt-0.5 border-t border-blue-200/80 flex flex-wrap gap-1 text-[10px] font-mono text-blue-900"
          >
            <span
              v-for="(val, key) in f.locals"
              :key="key"
              class="bg-white px-1 py-0.2 rounded border border-blue-200"
            >
              {{ key }}: <strong>{{ val }}</strong>
            </span>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>
