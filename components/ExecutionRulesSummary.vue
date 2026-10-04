<script setup lang="ts">
const rules = [
  {
    num: '1',
    title: 'Call Stack First',
    desc: 'The single JS thread executes synchronous code top-to-bottom to completion. Nothing from any queue can run until the Call Stack is completely empty.'
  },
  {
    num: '2',
    title: 'Web APIs / Host Offload',
    desc: 'Timers, network requests, and DOM listeners are handled by host threads (browser or libuv). When ready, their callbacks are pushed into queues.'
  },
  {
    num: '3',
    title: 'Microtasks Drain Completely',
    desc: 'Whenever the stack empties (or after any individual task), the Event Loop drains the Microtask Queue until empty. Microtasks scheduled by microtasks run in the same drain!'
  },
  {
    num: '4',
    title: 'One Macrotask Per Tick',
    desc: 'The Event Loop pulls exactly ONE macrotask (e.g., setTimeout callback) from the FIFO task queue, executes it on the stack, and then immediately drains all microtasks.'
  },
  {
    num: '5',
    title: 'Rendering Fits Between Macrotasks',
    desc: 'Browsers repaint at ~60Hz (every 16.6ms). Rendering occurs only when Call Stack and Microtask Queues are clear, never in the middle of executing synchronous code.'
  },
  {
    num: '6',
    title: 'await is a Microtask Continuation',
    desc: '`await p` evaluates `p`, pauses the async function, and schedules the remainder of the function body as a microtask on the resolution of `p`.'
  }
]
</script>

<template>
  <div class="h-full flex flex-col justify-between py-1 select-none overflow-hidden">
    <div class="grid grid-cols-2 gap-2 my-auto flex-1 items-stretch min-h-0">
      <div
        v-for="r in rules"
        :key="r.num"
        class="bg-white border border-slate-300 rounded-lg p-2 flex flex-col justify-between shadow-xs"
      >
        <div class="flex items-center gap-1.5 mb-0.5">
          <span class="w-5 h-5 rounded-full bg-blue-600 text-white font-black text-[10px] flex items-center justify-center shrink-0">
            {{ r.num }}
          </span>
          <span class="font-extrabold text-xs text-slate-900">{{ r.title }}</span>
        </div>
        <p class="text-[10px] text-slate-700 font-semibold leading-snug">
          {{ r.desc }}
        </p>
      </div>
    </div>
  </div>
</template>
