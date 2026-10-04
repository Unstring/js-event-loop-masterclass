---
clicks: 10
layout: default
---

<script setup lang="ts">
import ExecutionRulesSummary from '../components/ExecutionRulesSummary.vue'
import CaptionBar from '../components/CaptionBar.vue'
import PersistentLegend from '../components/PersistentLegend.vue'
import ProgressBar from '../components/ProgressBar.vue'

const captions = [
  "Appendix: JavaScript Concurrency Golden Rules Cheat Sheet.",
  "Rule 1: Call Stack First — Synchronous code always runs to completion without preemption.",
  "Rule 2: Web APIs Offload — Host C++ threads manage timers, fetch, and DOM events in parallel.",
  "Rule 3: Microtask Drain-to-Zero — All microtasks clear before next macrotask or browser paint.",
  "Rule 4: One Macrotask Per Tick — Event Loop pulls exactly one task, then checks microtasks.",
  "Rule 5: 60 FPS Render Window — Paint runs only when stack and microtasks are completely empty.",
  "Rule 6: await Desugaring — await suspends function and enqueues continuation as a microtask.",
  "Keep this cheat sheet handy for every asynchronous interview and production debug session.",
  "Thank you for attending the JavaScript Event Loop Masterclass!",
  "Questions & Open Discussion."
]
</script>

<div class="h-full flex flex-col justify-between py-1 select-none">
  <PersistentLegend />
  <ProgressBar :step="$clicks" :total-steps="10" :slide-number="21" :total-slides="21" />

  <CaptionBar
    :caption="captions[Math.min($clicks, captions.length - 1)]"
    phase="idle"
    :is-last="$clicks >= 9"
    takeaway="Print or screenshot this page for your engineering cheat-sheet collection!"
  />

  <div class="flex-1 my-1">
    <ExecutionRulesSummary />
  </div>
</div>

<!--
SPEAKER NOTES:
Appendix slide: Review the 6 golden rules as students take photos of the slide.
-->
