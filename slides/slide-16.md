---
clicks: 25
layout: default
---

<script setup lang="ts">
import PromiseLifecycleDemo from '../components/PromiseLifecycleDemo.vue'
import CaptionBar from '../components/CaptionBar.vue'
import PersistentLegend from '../components/PersistentLegend.vue'
import ProgressBar from '../components/ProgressBar.vue'

const captions = [
  "Outcome 5: Promise Lifecycle and V8 Internal Slots.",
  "What is a Promise really? It is a JavaScript object managing asynchronous state transitions.",
  "Internal Slot 1: `[[PromiseState]]`. Can only have 3 possible values: 'pending', 'fulfilled', or 'rejected'.",
  "Internal Slot 2: `[[PromiseResult]]`. Stores the resolved value or the rejection reason.",
  "Internal Slot 3: `[[PromiseFulfillReactions]]` and `[[PromiseRejectReactions]]` handler lists.",
  "Step 1: Instantiation with `new Promise((resolve, reject) => { ... })`.",
  "CRITICAL TRAP: The executor function is NOT asynchronous! It executes SYNCHRONOUSLY immediately.",
  "Any synchronous code inside the executor runs right now on the Call Stack.",
  "While inside the executor, `[[PromiseState]]` is 'pending' and `[[PromiseResult]]` is `undefined`.",
  "Step 2: Calling `resolve(value)` or `reject(error)` triggers the state machine.",
  "`resolve(42)` transitions `[[PromiseState]]` from 'pending' to 'fulfilled'.",
  "`[[PromiseResult]]` is set permanently to `42`.",
  "THE IMMUTABILITY LAW: Once a Promise is settled (fulfilled or rejected), its state is FROZEN.",
  "Calling `resolve()` or `reject()` a second time does absolutely nothing. No exceptions, just ignored.",
  "Step 3: Attaching reactions with `.then(onFulfilled, onRejected)`.",
  "If the Promise is already fulfilled when `.then()` is called: A microtask is queued immediately!",
  "If the Promise is still pending: The callback is appended to `[[PromiseFulfillReactions]]`.",
  "When the Promise resolves later (e.g. from network), those queued reactions are dispatched as microtasks.",
  "Notice: Handlers registered hours later will STILL receive the exact same cached resolved value.",
  "Promises act as deterministic temporal memoization containers for values.",
  "Unhandled rejections: If a Promise rejects and has no `.catch()` handler attached by the next microtask checkpoint,",
  "the browser / Node process emits an 'unhandledrejection' event on the global window/process object.",
  "Every Promise created in modern JS follows these exact state machine invariants.",
  "Next: How do multiple `.then()` calls chain together under the hood?",
  "Slide 16 Complete: You have mastered the internal architecture of JavaScript Promises!"
]
</script>

<div class="h-full flex flex-col justify-between py-1 select-none">
  <PersistentLegend />
  <ProgressBar :step="$clicks" :total-steps="25" :slide-number="16" :total-slides="20" />

  <CaptionBar
    :caption="captions[Math.min($clicks, captions.length - 1)]"
    :phase="$clicks <= 5 ? 'sync' : 'microtasks'"
    :is-last="$clicks >= 24"
    takeaway="Promise executor runs synchronously; state transitions are permanent; reactions always run as microtasks."
  />

  <div class="flex-1 my-1">
    <PromiseLifecycleDemo :step="Math.floor($clicks / 6)" />
  </div>
</div>

<!--
SPEAKER NOTES:
[Click 0-5]: Introduce the three internal slots: state, result, reaction lists.
[Click 6-9]: Emphasize the synchronous executor trap.
[Click 10-14]: State transition from pending to fulfilled and the immutability law.
[Click 15-20]: How .then registers reaction records and microtask queues.
[Click 21-24]: Unhandled rejection lifecycle and recap.
-->
