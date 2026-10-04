<script setup lang="ts">
import type { QueueItem } from '../composables/useSimulator'

defineProps<{
  title: string
  type: 'micro' | 'macro'
  items?: (QueueItem | string)[]
  activeDrain?: boolean
}>()
</script>

<template>
  <div
    class="flex flex-col rounded-xl border-2 shadow-xs overflow-hidden transition-all"
    :class="{
      'bg-green-50/40 border-green-500': type === 'micro',
      'bg-purple-50/40 border-purple-500': type === 'macro',
      'ring-2 ring-green-400': type === 'micro' && activeDrain,
      'ring-2 ring-purple-400': type === 'macro' && activeDrain
    }"
  >
    <!-- Header -->
    <div
      class="text-white px-2 py-0.5 flex items-center justify-between shrink-0"
      :class="{
        'bg-green-600': type === 'micro',
        'bg-purple-600': type === 'macro'
      }"
    >
      <div class="flex items-center gap-1">
        <span class="text-xs">{{ type === 'micro' ? '⚡' : '📦' }}</span>
        <span class="font-bold text-[10px] uppercase tracking-wider">{{ title }}</span>
      </div>
      <span
        class="text-[8px] font-mono px-1.5 py-0.2 rounded-full font-bold uppercase"
        :class="{
          'bg-green-800 text-green-100': type === 'micro',
          'bg-purple-800 text-purple-100': type === 'macro'
        }"
      >
        FIFO
      </span>
    </div>

    <!-- Queue Items row -->
    <div class="p-1 flex items-center gap-1 overflow-x-auto min-h-[38px]">
      <div
        v-if="!items || items.length === 0"
        class="w-full text-center text-[10px] font-semibold py-0.5"
        :class="type === 'micro' ? 'text-green-600/70' : 'text-purple-600/70'"
      >
        ( Empty )
      </div>

      <TransitionGroup name="token-move">
        <div
          v-for="(item, idx) in items"
          :key="typeof item === 'string' ? `${item}-${idx}` : item.id"
          class="shrink-0 px-2 py-0.5 rounded-md border font-mono text-[11px] font-bold shadow-xs flex items-center gap-1 transition-all"
          :class="[
            type === 'micro'
              ? 'bg-green-100 border-green-500 text-green-950'
              : 'bg-purple-100 border-purple-500 text-purple-950',
            idx === 0 ? 'ring-1 ring-amber-400' : ''
          ]"
        >
          <span v-if="idx === 0" class="text-amber-600 text-[9px]">▶</span>
          <span>{{ typeof item === 'string' ? item : item.label }}</span>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>
