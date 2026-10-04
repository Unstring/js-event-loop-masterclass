<script setup lang="ts">
import { computed } from 'vue'
import QuizCard from './QuizCard.vue'
import CaptionBar from './CaptionBar.vue'
import PersistentLegend from './PersistentLegend.vue'
import ProgressBar from './ProgressBar.vue'

const props = defineProps<{
  step?: number
}>()

const s = computed(() => props.step ?? 0)

const captions = [
  "Slide 20: The Grand Finale — Recap, Boss Challenge & Classroom Quiz!",
  "Outcome 1 Recap: JS is single-threaded to prevent DOM memory corruption and deadlock bugs.",
  "Outcome 2 Recap: The Call Stack executes LIFO frames; creation phase hoists, execution phase runs.",
  "Outcome 3 Recap: Host Web APIs manage timers via min-heaps; setTimeout delay is a MINIMUM.",
  "Outcome 4 Recap: Microtasks drain to zero before ANY macrotask or browser paint.",
  "Outcome 5 Recap: Promises are internal state machines; await suspends and resumes via microtasks.",
  "Now: The Final 'Boss Snippet' Challenge! Grab a pencil and paper.",
  "Boss Code: `setTimeout(() => console.log('T1'), 0);`",
  "Boss Code: `Promise.resolve().then(() => { console.log('P1'); setTimeout(() => console.log('T2'), 0); });`",
  "Boss Code: `async function main() { console.log('M1'); await null; console.log('M2'); }`",
  "Boss Code: `main(); console.log('SYNC');`",
  "Question: In what exact order will T1, P1, T2, M1, M2, and SYNC print to console?",
  "Let's trace it together: M1 runs synchronously inside main()! (First log: M1)",
  "`await null` suspends main() and queues M2 as a microtask!",
  "'SYNC' logs synchronously! (Second log: SYNC). Call Stack is empty!",
  "Drain Microtasks: P1 logs! It registers timer T2 with Web APIs! (Third log: P1)",
  "Next Microtask: M2 resumes and logs! (Fourth log: M2). Microtask queue empty!",
  "Pick oldest Macrotask: T1 logs! (Fifth log: T1)",
  "Pick next Macrotask: T2 logs! (Sixth log: T2)",
  "Final Output Confirmed: M1 ➔ SYNC ➔ P1 ➔ M2 ➔ T1 ➔ T2.",
  "Now, enter the 6-Question Senior Masterclass Quiz! Click Next to test each concept.",
  "Quiz Question 1: Why is JavaScript single-threaded?",
  "Quiz Question 1 Answer Revealed: DOM synchronization, zero locks, zero deadlocks.",
  "Quiz Question 2: Does setTimeout(fn, 0) execute on the next line?",
  "Quiz Question 2 Answer Revealed: No, it queues into the Macrotask Queue.",
  "Quiz Question 3: What has higher priority: Microtasks or Macrotasks?",
  "Quiz Question 3 Answer Revealed: Microtasks! Drain-to-zero rule.",
  "Quiz Question 4: What happens when new Promise(...) is invoked?",
  "Quiz Question 4 Answer Revealed: The executor runs synchronously on the Call Stack!",
  "Quiz Question 5: What does 'await fn()' actually do under the hood?",
  "Quiz Question 5 Answer Revealed: Suspends frame, returns to caller, resumes as microtask.",
  "Quiz Question 6: What causes the browser UI to freeze?",
  "Quiz Question 6 Answer Revealed: Synchronous while loops or infinite recursive microtasks.",
  "CONGRATULATIONS! You have completed the 20-slide Event Loop Masterclass with 100% mastery!",
  "Press Next to view the Appendix Golden Rules Cheat Sheet."
]

const bossSnippet = [
  "setTimeout(() => console.log('T1'), 0);",
  "Promise.resolve().then(() => {",
  "  console.log('P1');",
  "  setTimeout(() => console.log('T2'), 0);",
  "});",
  "async function main() {",
  "  console.log('M1');",
  "  await null;",
  "  console.log('M2');",
  "}",
  "main();",
  "console.log('SYNC');"
]

const isQuizPhase = computed(() => s.value >= 20)
</script>

<template>
  <div class="h-full flex flex-col justify-between py-1 select-none overflow-hidden">
    <PersistentLegend />
    <ProgressBar :step="s" :total-steps="35" :slide-number="20" :total-slides="20" />

    <CaptionBar
      :caption="captions[Math.min(s, captions.length - 1)]"
      :phase="s <= 5 ? 'sync' : (s <= 19 ? 'microtasks' : 'idle')"
      :is-last="s >= 34"
      takeaway="Mastery achieved: Call Stack ➔ Web APIs ➔ Microtasks ➔ Macrotasks ➔ Event Loop."
    />

    <div class="flex-1 my-auto min-h-0 overflow-hidden">
      <!-- Show Boss Snippet during clicks 0 to 19 -->
      <div v-if="!isQuizPhase" class="h-full flex flex-col justify-between">
        <div class="bg-slate-900 text-white px-3 py-1 rounded-lg border border-slate-700 flex items-center justify-between shrink-0">
          <span class="font-extrabold text-xs uppercase text-amber-400">Boss Snippet Concurrency Puzzle</span>
          <span class="font-mono text-[10px] text-slate-300">Timers + Promises + async/await</span>
        </div>

        <div class="grid grid-cols-2 gap-2 my-1 flex-1 items-stretch min-h-0">
          <div class="bg-slate-50 border border-slate-300 rounded-lg p-2 font-mono text-[11px] leading-snug text-slate-900 font-bold overflow-y-auto">
            <div v-for="(line, idx) in bossSnippet" :key="idx">{{ line }}</div>
          </div>

          <div class="bg-white border border-slate-300 rounded-lg p-2 flex flex-col justify-between">
            <div class="font-bold text-[10px] uppercase text-slate-500">Live Execution Result</div>
            <div class="space-y-0.5 font-mono text-[10px]">
              <div class="px-1.5 py-0.5 rounded bg-slate-100" :class="{ 'bg-emerald-100 font-bold text-emerald-950 border border-emerald-400': s >= 12 }">
                1. M1 (sync inside main)
              </div>
              <div class="px-1.5 py-0.5 rounded bg-slate-100" :class="{ 'bg-emerald-100 font-bold text-emerald-950 border border-emerald-400': s >= 14 }">
                2. SYNC (sync script end)
              </div>
              <div class="px-1.5 py-0.5 rounded bg-slate-100" :class="{ 'bg-emerald-100 font-bold text-emerald-950 border border-emerald-400': s >= 15 }">
                3. P1 (microtask 1)
              </div>
              <div class="px-1.5 py-0.5 rounded bg-slate-100" :class="{ 'bg-emerald-100 font-bold text-emerald-950 border border-emerald-400': s >= 16 }">
                4. M2 (await microtask resumption)
              </div>
              <div class="px-1.5 py-0.5 rounded bg-slate-100" :class="{ 'bg-emerald-100 font-bold text-emerald-950 border border-emerald-400': s >= 17 }">
                5. T1 (macrotask 1)
              </div>
              <div class="px-1.5 py-0.5 rounded bg-slate-100" :class="{ 'bg-emerald-100 font-bold text-emerald-950 border border-emerald-400': s >= 18 }">
                6. T2 (macrotask 2)
              </div>
            </div>
            <div class="text-[10px] font-bold text-slate-700 bg-amber-50 p-1.5 rounded border border-amber-300">
              {{ s >= 19 ? 'Verified Output: M1 ➔ SYNC ➔ P1 ➔ M2 ➔ T1 ➔ T2' : 'Follow the step-by-step resolution by clicking Next...' }}
            </div>
          </div>
        </div>
      </div>

      <!-- Quiz Card from Click 20 onwards -->
      <div v-else class="h-full">
        <QuizCard :step="s - 20" />
      </div>
    </div>
  </div>
</template>
