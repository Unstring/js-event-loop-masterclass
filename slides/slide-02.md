---
clicks: 25
layout: default
---

<script setup lang="ts">
import AgendaJourneyMap from '../components/AgendaJourneyMap.vue'
import CaptionBar from '../components/CaptionBar.vue'
import PersistentLegend from '../components/PersistentLegend.vue'
import ProgressBar from '../components/ProgressBar.vue'

const captions = [
  "Mastery Agenda: 5 outcomes designed to take you from intuition to runtime expert.",
  "Outcome 1: Understand why Brendan Eich designed JS to be strictly single-threaded.",
  "Outcome 1: Discover how browsers avoid mutex deadlocks and memory corruption.",
  "Outcome 1: Understand how the browser still accomplishes heavy work asynchronously.",
  "Outcome 1: The single-threaded mental model: one call stack, infinite possibilities.",
  "Outcome 2: Deep dive into the Call Stack and Execution Context lifecycle.",
  "Outcome 2: Frame allocation, arguments, local variables, and return pointers.",
  "Outcome 2: Creation phase vs Execution phase: hoisting demystified.",
  "Outcome 2: Lexical scope chains: why var and let behave differently in loops.",
  "Outcome 2: Stack overflow boundaries: recursion depth and CPU blocking.",
  "Outcome 3: Understand how setTimeout and Web APIs work behind the scenes.",
  "Outcome 3: The C++ browser host threads: timers, network sockets, DOM handlers.",
  "Outcome 3: Minimum delay guarantees: why 0ms is never guaranteed 0ms.",
  "Outcome 3: Browser clamping rules: the 4ms nested interval standard.",
  "Outcome 3: Cancelling timers with clearTimeout before queue handoff.",
  "Outcome 4: Differentiate between Microtasks and Macrotasks with precision.",
  "Outcome 4: The Microtask Queue: Promise reactions, queueMicrotask, MutationObserver.",
  "Outcome 4: The Macrotask Queue: Timers, I/O events, user clicks.",
  "Outcome 4: The golden rule: Microtasks drain completely before the next macrotask!",
  "Outcome 4: Event loop starvation hazards: how runaway microtasks freeze 60 FPS paint.",
  "Outcome 5: Master Promises, internal slots, and async/await mechanics.",
  "Outcome 5: Under the hood: [[PromiseState]], [[PromiseResult]], and [[PromiseFulfillReactions]].",
  "Outcome 5: Promise chaining internals: why every .then() returns a brand-new Promise.",
  "Outcome 5: async/await desugaring: how await suspends and resumes via microtasks.",
  "Outcome 5: Real-world error handling and live end-to-end full network flow!"
]
</script>

<div class="h-full flex flex-col justify-between py-1 select-none">
  <PersistentLegend />
  <ProgressBar :step="$clicks" :total-steps="25" :slide-number="2" :total-slides="20" />

  <CaptionBar
    :caption="captions[Math.min($clicks, captions.length - 1)]"
    :phase="$clicks <= 4 ? 'sync' : ($clicks <= 9 ? 'sync' : ($clicks <= 14 ? 'macrotasks' : ($clicks <= 19 ? 'microtasks' : 'idle')))"
    :is-last="$clicks >= 24"
    takeaway="Every asynchronous line of JavaScript maps cleanly to these 5 architectural pillars."
  />

  <div class="flex-1 my-1">
    <AgendaJourneyMap :step="$clicks" />
  </div>
</div>

<!--
SPEAKER NOTES:
[Click 0-4]: Introduce the agenda. Explain that we'll cover single-threading first so students understand WHY asynchronous architecture is required.
[Click 5-9]: Introduce Call Stack and execution context.
[Click 10-14]: Introduce Web APIs and setTimeout.
[Click 15-19]: Emphasize the microtask vs macrotask distinction — the source of most senior interview bugs.
[Click 20-24]: Set expectations for Promises and async/await desugaring.
-->
