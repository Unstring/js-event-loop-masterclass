<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  step?: number
}>()

const currentStep = computed(() => props.step ?? 0)

const stepsData = [
  {
    caption: '1995 Netscape: Brendan Eich designs JavaScript for simple web scripts.',
    domText: '<div id="banner">Initial Text</div>',
    threadA: 'Idle',
    threadB: 'Idle',
    threadAAction: 'Waiting for user click...',
    threadBAction: 'Waiting for network timer...',
    hazard: 'No race conditions yet. DOM element is stable.'
  },
  {
    caption: 'Hypothetical multi-threaded JavaScript: Two threads run simultaneously!',
    domText: '<div id="banner">Initial Text</div>',
    threadA: 'Thread A: preparing to write "Hello World"',
    threadB: 'Thread B: preparing to delete #banner',
    threadAAction: 'document.getElementById("banner").innerText = "Hello"',
    threadBAction: 'document.getElementById("banner").remove()',
    hazard: 'Both threads read the pointer to #banner at the exact same microsecond.'
  },
  {
    caption: 'Thread B finishes first: DOM Node #banner is deallocated from memory!',
    domText: '<!-- #banner REMOVED from DOM Tree -->',
    threadA: 'Thread A: holds dangling reference to deleted pointer!',
    threadB: 'Thread B: successfully executed .remove()',
    threadAAction: 'Attempting to write text into freed memory...',
    threadBAction: 'Node deleted cleanly.',
    hazard: 'CRASH HAZARD: Segmentation fault or NULL pointer dereference in browser!'
  },
  {
    caption: 'Thread A attempts write: Memory corruption or browser crash occurs!',
    domText: '💥 CORRUPTED / CRASHED STATE',
    threadA: 'Thread A: EXCEPTION / SIGSEGV',
    threadB: 'Thread B: Done',
    threadAAction: 'Cannot set innerText of null / dead memory address!',
    threadBAction: 'Finished.',
    hazard: 'Multi-threading requires mutexes, locks, and synchronization overhead!'
  },
  {
    caption: 'JavaScript Solution: SINGLE THREAD for execution, Event Loop for concurrency.',
    domText: '<div id="banner">Hello World</div>',
    threadA: 'Single Main Thread: Operation 1 completes atomically.',
    threadB: 'Event Loop: Operation 2 queued safely after Operation 1.',
    threadAAction: '1. Update text ➔ Safe',
    threadBAction: '2. Delete node ➔ Safe',
    hazard: 'Zero DOM race conditions, zero locks, zero deadlocks by design!'
  }
]

const current = computed(() => {
  const idx = Math.min(currentStep.value, stepsData.length - 1)
  return stepsData[idx]
})
</script>

<template>
  <div class="h-full flex flex-col justify-between py-1 select-none overflow-hidden">
    <!-- Interactive Visual Columns -->
    <div class="grid grid-cols-12 gap-2 my-auto flex-1 items-stretch">
      <!-- Thread A -->
      <div class="col-span-4 bg-blue-50 border-2 border-blue-500 rounded-xl p-2.5 flex flex-col justify-between shadow-xs">
        <div>
          <div class="flex items-center justify-between pb-1 border-b border-blue-200">
            <span class="font-bold text-blue-900 text-xs">Thread A (User Interaction)</span>
            <span class="text-[9px] bg-blue-600 text-white font-bold px-1.5 py-0.2 rounded">Worker 1</span>
          </div>
          <div class="mt-2 font-mono text-xs bg-white p-2 rounded-lg border border-blue-300 font-bold text-blue-950">
            {{ current.threadAAction }}
          </div>
        </div>
        <div class="text-[10px] font-bold text-blue-800 bg-blue-100 p-1.5 rounded">
          State: {{ current.threadA }}
        </div>
      </div>

      <!-- Shared DOM Canvas -->
      <div class="col-span-4 bg-amber-50 border-2 border-amber-500 rounded-xl p-2.5 flex flex-col justify-between shadow-xs">
        <div>
          <div class="flex items-center justify-between pb-1 border-b border-amber-200">
            <span class="font-bold text-amber-900 text-xs">Shared DOM Tree</span>
            <span class="text-[9px] bg-amber-600 text-white font-bold px-1.5 py-0.2 rounded">Target Node</span>
          </div>
          <div class="mt-2 font-mono text-xs bg-white p-2.5 rounded-lg border border-amber-300 font-black text-center flex items-center justify-center min-h-[55px]"
            :class="{ 'bg-rose-100 text-rose-800 border-rose-400': currentStep === 3 }"
          >
            {{ current.domText }}
          </div>
        </div>
        <div class="text-[10px] font-bold text-amber-900 bg-amber-100 p-1.5 rounded border border-amber-300">
          {{ current.hazard }}
        </div>
      </div>

      <!-- Thread B -->
      <div class="col-span-4 bg-purple-50 border-2 border-purple-500 rounded-xl p-2.5 flex flex-col justify-between shadow-xs">
        <div>
          <div class="flex items-center justify-between pb-1 border-b border-purple-200">
            <span class="font-bold text-purple-900 text-xs">Thread B (Async Network / Script)</span>
            <span class="text-[9px] bg-purple-600 text-white font-bold px-1.5 py-0.2 rounded">Worker 2</span>
          </div>
          <div class="mt-2 font-mono text-xs bg-white p-2 rounded-lg border border-purple-300 font-bold text-purple-950">
            {{ current.threadBAction }}
          </div>
        </div>
        <div class="text-[10px] font-bold text-purple-800 bg-purple-100 p-1.5 rounded">
          State: {{ current.threadB }}
        </div>
      </div>
    </div>

    <!-- Lesson takeaway pill (Compact) -->
    <div class="bg-blue-100 border border-blue-500 text-blue-950 px-3 py-1 rounded-lg font-bold text-xs flex items-center justify-between shrink-0">
      <span>💡 <strong>Architectural Decision:</strong> Netscape avoided locks and deadlocks by keeping JavaScript strictly single-threaded.</span>
      <span class="font-mono text-[9px] bg-blue-700 text-white px-1.5 py-0.5 rounded">Deterministic</span>
    </div>
  </div>
</template>
