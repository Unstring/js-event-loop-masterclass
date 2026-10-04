---
clicks: 25
layout: default
---

<script setup lang="ts">
import TaskSortingGame from '../components/TaskSortingGame.vue'
import CaptionBar from '../components/CaptionBar.vue'
import PersistentLegend from '../components/PersistentLegend.vue'
import ProgressBar from '../components/ProgressBar.vue'

const captions = [
  "Outcome 4: Microtasks vs Macrotasks. The classification challenge!",
  "JavaScript has TWO distinct queues with completely different priorities.",
  "Item 1: `setTimeout(fn, 0)` callback.",
  "Classification: MACROTASK (Task Queue). Managed by the browser timer subsystem.",
  "Item 2: `Promise.resolve().then(fn)` reaction callback.",
  "Classification: MICROTASK. Handled by the ECMAScript Job Queue with ultra-high priority.",
  "Item 3: `queueMicrotask(() => {})`.",
  "Classification: MICROTASK. Standardized in HTML5 specifically to schedule explicit microtasks.",
  "Item 4: `setInterval(fn, 1000)` callback.",
  "Classification: MACROTASK. Repeating host timer event.",
  "Item 5: User DOM event listener (`button.addEventListener('click', fn)`).",
  "Classification: MACROTASK. Dispatched by the browser's UI input thread.",
  "Item 6: `new MutationObserver(fn)` callback.",
  "Classification: MICROTASK. Notified immediately after DOM alterations, before next repaint!",
  "Item 7: `fetch('/api/users').then(fn)` response handler.",
  "Classification: MICROTASK. The network transfer happens in host C++ threads, but `.then()` fires as a microtask!",
  "Item 8: `MessageChannel.port1.onmessage` / `postMessage`.",
  "Classification: MACROTASK. Frequently used by React scheduler as a zero-delay macrotask polyfill.",
  "Notice the fundamental difference: Microtasks represent short-term continuation of CURRENT code.",
  "Macrotasks represent brand new, discrete events from the outside world.",
  "The Event Loop gives Microtasks 100% preferential treatment.",
  "Every microtask MUST run before the browser will paint or run the next macrotask.",
  "Memorize this table: It will prevent 90% of asynchronous ordering bugs in your code.",
  "Next up: Let's trace a snippet where microtasks and macrotasks race head-to-head!",
  "Slide 12 Complete: You have mastered task queue classification!"
]
</script>

<div class="h-full flex flex-col justify-between py-1 select-none">
  <PersistentLegend />
  <ProgressBar :step="$clicks" :total-steps="25" :slide-number="12" :total-slides="20" />

  <CaptionBar
    :caption="captions[Math.min($clicks, captions.length - 1)]"
    :phase="$clicks <= 11 ? 'microtasks' : 'macrotasks'"
    :is-last="$clicks >= 24"
    takeaway="Promises, queueMicrotask, MutationObserver ➔ Microtasks. Timers, UI events, I/O ➔ Macrotasks."
  />

  <div class="flex-1 my-1">
    <TaskSortingGame :step="Math.floor($clicks / 3)" />
  </div>
</div>

<!--
SPEAKER NOTES:
[Click 0-2]: Frame the challenge: Two queues, different sources, different priorities.
[Click 3-17]: Walk through all 8 APIs, having students shout 'Micro' or 'Macro' before each click.
[Click 18-24]: Cement the conceptual difference: continuations vs external events.
-->
