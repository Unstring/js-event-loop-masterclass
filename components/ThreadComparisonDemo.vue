<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  step?: number
}>()

const activeTab = computed(() => {
  const s = props.step ?? 0
  if (s <= 1) return 'comparison'
  if (s <= 3) return 'deadlock'
  return 'js-solution'
})
</script>

<template>
  <div class="h-full flex flex-col justify-between py-1 select-none overflow-hidden">
    <div class="grid grid-cols-12 gap-2 my-auto flex-1 items-stretch">
      <!-- Multi-Threaded Model Panel -->
      <div class="col-span-6 bg-rose-50/50 border-2 border-rose-400 rounded-xl p-3 flex flex-col justify-between shadow-xs">
        <div>
          <div class="flex items-center justify-between pb-1.5 border-b border-rose-300">
            <span class="font-extrabold text-rose-950 text-xs">Multi-Threaded (Java / C++)</span>
            <span class="text-[9px] bg-rose-600 text-white font-bold px-1.5 py-0.2 rounded">Heavy Concurrency</span>
          </div>

          <div class="mt-2 space-y-1.5">
            <div class="bg-white border border-rose-200 rounded-lg p-2 flex items-center justify-between text-xs">
              <span class="font-bold text-slate-800">Thread 1 (Stack 1)</span>
              <span class="font-mono text-[10px] bg-rose-100 text-rose-800 px-1.5 py-0.5 rounded font-bold">Acquires Mutex A</span>
            </div>
            <div class="bg-white border border-rose-200 rounded-lg p-2 flex items-center justify-between text-xs">
              <span class="font-bold text-slate-800">Thread 2 (Stack 2)</span>
              <span class="font-mono text-[10px] bg-rose-100 text-rose-800 px-1.5 py-0.5 rounded font-bold">Acquires Mutex B</span>
            </div>

            <!-- Deadlock state illustration -->
            <div
              class="border border-rose-500 rounded-lg p-2 bg-rose-100 transition-all"
              :class="{ 'ring-2 ring-rose-500 animate-pulse': activeTab === 'deadlock' }"
            >
              <div class="font-bold text-rose-950 text-xs flex items-center gap-1">
                <span>⛔</span>
                <span>Deadlock Hazard: Mutual Wait</span>
              </div>
              <p class="text-[10px] text-rose-900 mt-0.5 font-semibold leading-tight">
                Thread 1 waits for Mutex B; Thread 2 waits for Mutex A. Complete process freeze!
              </p>
            </div>
          </div>
        </div>

        <div class="text-[10px] bg-rose-200/80 text-rose-950 p-1.5 rounded-lg font-bold">
          ⚠️ Requires synchronized locks, volatile memory barriers, race hazard audits.
        </div>
      </div>

      <!-- JavaScript Single Thread + Event Loop Panel -->
      <div class="col-span-6 bg-blue-50/50 border-2 border-blue-500 rounded-xl p-3 flex flex-col justify-between shadow-xs">
        <div>
          <div class="flex items-center justify-between pb-1.5 border-b border-blue-300">
            <span class="font-extrabold text-blue-950 text-xs">JavaScript Single Thread + Event Loop</span>
            <span class="text-[9px] bg-blue-600 text-white font-bold px-1.5 py-0.2 rounded">Event-Driven</span>
          </div>

          <div class="mt-2 space-y-1.5">
            <div class="bg-white border border-blue-200 rounded-lg p-2 flex items-center justify-between text-xs">
              <span class="font-bold text-slate-800">1. One Call Stack</span>
              <span class="font-mono text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-bold">Runs to Completion</span>
            </div>
            <div class="bg-white border border-blue-200 rounded-lg p-2 flex items-center justify-between text-xs">
              <span class="font-bold text-slate-800">2. Non-blocking Host APIs</span>
              <span class="font-mono text-[10px] bg-orange-100 text-orange-800 px-1.5 py-0.5 rounded font-bold">Libuv / Browser Threads</span>
            </div>
            <div class="bg-white border border-blue-200 rounded-lg p-2 flex items-center justify-between text-xs">
              <span class="font-bold text-slate-800">3. Queued Callback Execution</span>
              <span class="font-mono text-[10px] bg-green-100 text-green-800 px-1.5 py-0.5 rounded font-bold">Safe FIFO Order</span>
            </div>
          </div>
        </div>

        <div class="text-[10px] bg-blue-200/80 text-blue-950 p-1.5 rounded-lg font-bold">
          ✅ Zero deadlocks, zero lock contention, atomic memory execution per tick!
        </div>
      </div>
    </div>
  </div>
</template>
