<script setup lang="ts">
import type { WebApiItem } from '../composables/useSimulator'

defineProps<{
  items?: WebApiItem[]
}>()
</script>

<template>
  <div class="h-full flex flex-col bg-orange-50/40 border-2 border-orange-500 rounded-xl shadow-xs overflow-hidden">
    <!-- Header -->
    <div class="bg-orange-600 text-white px-2.5 py-0.5 flex items-center justify-between shrink-0">
      <div class="flex items-center gap-1">
        <span class="text-xs">🌐</span>
        <span class="font-bold text-[10px] uppercase tracking-wider">Web APIs / Host</span>
      </div>
      <span class="text-[9px] font-mono bg-orange-800 px-1.5 py-0.2 rounded-full font-bold">
        {{ (items || []).length }}
      </span>
    </div>

    <!-- Active Tasks -->
    <div class="flex-1 p-1 flex flex-col gap-1 overflow-y-auto min-h-0">
      <div
        v-if="!items || items.length === 0"
        class="flex-1 flex flex-col items-center justify-center text-orange-400 font-semibold text-[10px] border border-dashed border-orange-200 rounded p-1"
      >
        <span>( Idle )</span>
      </div>

      <TransitionGroup name="token-move">
        <div
          v-for="item in items"
          :key="item.id"
          class="bg-orange-100 border border-orange-400 rounded-lg p-1 text-orange-950 font-sans shadow-xs"
        >
          <div class="flex items-center justify-between mb-0.5 text-[10px]">
            <span class="font-mono font-bold flex items-center gap-1 truncate">
              <span>{{ item.type === 'fetch' ? '📡' : '⏱️' }}</span>
              <span>{{ item.label }}</span>
            </span>
            <span class="text-[9px] font-mono font-bold bg-white text-orange-800 px-1 rounded border border-orange-300 shrink-0">
              {{ item.timeLeft ?? 'Pending' }}
            </span>
          </div>

          <!-- Progress Bar -->
          <div class="w-full bg-orange-200 h-1.5 rounded-full overflow-hidden">
            <div
              class="bg-orange-600 h-full transition-all duration-300 rounded-full"
              :style="{ width: `${item.progress ?? 100}%` }"
            ></div>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>
