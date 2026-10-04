<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  step?: number
}>()

const s = computed(() => props.step ?? 0)

const questions = [
  {
    q: '1. Why is JavaScript single-threaded?',
    a: 'To prevent multi-threaded DOM race conditions (e.g. one thread writing while another deletes a node), deadlocks, and thread-synchronization complexity.',
    category: 'Architecture'
  },
  {
    q: '2. Does setTimeout(fn, 0) execute on the next line?',
    a: 'No! The callback is handed to the Host Web API timer, placed in the Macrotask Queue, and only runs after the Call Stack is completely empty and microtasks are drained.',
    category: 'Timers'
  },
  {
    q: '3. What has higher priority: Microtasks or Macrotasks?',
    a: 'Microtasks! The Event Loop drains the entire Microtask Queue before picking the next Macrotask or performing browser rendering.',
    category: 'Queues'
  },
  {
    q: '4. What happens when new Promise((resolve) => ...) is invoked?',
    a: 'The executor function runs SYNCHRONOUSLY immediately on the Call Stack! Only the subsequent .then() / .catch() handlers are queued as microtasks.',
    category: 'Promises'
  },
  {
    q: '5. What does "await fn()" actually do under the hood?',
    a: 'It suspends the async function, saves its local frame, registers a continuation Promise reaction microtask, and yields control back to the caller.',
    category: 'async/await'
  },
  {
    q: '6. What causes the browser UI to freeze / stutter?',
    a: 'Either a long-running synchronous while loop on the Call Stack or an infinite recursive microtask loop that starves the render phase.',
    category: 'Performance'
  }
]

const currentQ = computed(() => {
  const qIndex = Math.min(Math.floor(s.value / 2), questions.length - 1)
  const isRevealed = s.value % 2 === 1 || s.value >= questions.length * 2 - 1
  return {
    ...questions[qIndex],
    index: qIndex + 1,
    isRevealed
  }
})
</script>

<template>
  <div class="h-full flex flex-col justify-between py-1 select-none overflow-hidden">
    <!-- Header -->
    <div class="bg-slate-900 text-white px-3 py-1.5 rounded-lg flex items-center justify-between border border-slate-700 shrink-0">
      <div class="flex items-center gap-1.5">
        <span class="text-[9px] uppercase font-black px-1.5 py-0.2 rounded bg-amber-400 text-slate-950">Mastery Quiz</span>
        <span class="font-bold text-xs">Question {{ currentQ.index }} of 6</span>
      </div>
      <span class="text-[10px] font-mono font-bold text-amber-300">
        {{ currentQ.category }}
      </span>
    </div>

    <!-- Active Question Card -->
    <div class="bg-white border-2 border-slate-300 rounded-xl p-3 my-1.5 flex-1 flex flex-col justify-between shadow-xs">
      <div>
        <div class="text-[10px] uppercase font-bold text-slate-400 mb-0.5">
          Challenge Question
        </div>
        <div class="text-base font-black text-slate-900 leading-snug">
          {{ currentQ.q }}
        </div>
      </div>

      <!-- Answer Box -->
      <div
        class="rounded-lg p-2.5 border transition-all duration-200"
        :class="currentQ.isRevealed
          ? 'bg-emerald-50 border-emerald-500 text-emerald-950 shadow-xs'
          : 'bg-amber-50 border-amber-300 text-amber-900'"
      >
        <div class="flex items-center justify-between mb-0.5">
          <span class="text-[9px] font-bold uppercase">
            {{ currentQ.isRevealed ? 'Verified Answer' : 'Classroom Discussion Point' }}
          </span>
          <span class="text-sm">{{ currentQ.isRevealed ? '✅' : '🛑' }}</span>
        </div>

        <p v-if="currentQ.isRevealed" class="text-xs font-semibold leading-relaxed">
          {{ currentQ.a }}
        </p>
        <p v-else class="text-[11px] font-bold text-amber-800 italic">
          (Click Next to reveal the official architectural answer)
        </p>
      </div>

      <!-- Quick overview pills -->
      <div class="flex items-center justify-between pt-1 border-t border-slate-200 text-[10px]">
        <div class="flex items-center gap-1.5 font-mono font-bold">
          <span
            v-for="(q, idx) in questions"
            :key="idx"
            class="w-5 h-5 rounded-full flex items-center justify-center border text-[9px]"
            :class="idx + 1 === currentQ.index
              ? 'bg-blue-600 text-white border-blue-600'
              : idx + 1 < currentQ.index
                ? 'bg-emerald-100 text-emerald-800 border-emerald-400'
                : 'bg-slate-100 text-slate-500 border-slate-300'"
          >
            {{ idx + 1 }}
          </span>
        </div>
        <span class="font-bold text-slate-500">Mastery Checkpoint</span>
      </div>
    </div>
  </div>
</template>
