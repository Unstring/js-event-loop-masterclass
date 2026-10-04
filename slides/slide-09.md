---
clicks: 25
layout: default
---

<script setup lang="ts">
import EventLoopFlowchart from '../components/EventLoopFlowchart.vue'
import CaptionBar from '../components/CaptionBar.vue'
import PersistentLegend from '../components/PersistentLegend.vue'
import ProgressBar from '../components/ProgressBar.vue'

const captions = [
  "The Event Loop Algorithm: The exact HTML5 specification step-by-step.",
  "What actually happens inside the browser's main thread loop on every tick?",
  "Phase 1: Task Execution. The engine runs the current synchronous script or 1 macrotask.",
  "The Call Stack runs bytecode until completion. Frames push and pop.",
  "When the Call Stack reaches depth 0 (empty), Phase 1 is complete.",
  "Phase 2: Microtask Checkpoint! The Event Loop inspects the Microtask Queue.",
  "Is the Microtask Queue empty? If NO: Pull the oldest microtask and run it on the stack.",
  "Crucial specification rule: DRAIN THE ENTIRE QUEUE TO ZERO.",
  "If microtask A schedules microtask B, microtask B runs in THIS SAME CHECKPOINT!",
  "Phase 2 does not end until Microtask Queue length is STRICTLY ZERO.",
  "Phase 3: Render Opportunity (Browsers only; not in Node.js).",
  "Standard monitors refresh at 60Hz (once every 16.6 milliseconds) or 120Hz (8.3ms).",
  "Has 16.6ms elapsed since the last frame? If YES: The browser triggers the render pipeline.",
  "Sub-step 3a: Run `requestAnimationFrame` (rAF) callbacks.",
  "Sub-step 3b: Run IntersectionObserver and ResizeObserver callbacks.",
  "Sub-step 3c: Recalculate CSS Styles, compute Layout geometry, and Paint pixels to screen.",
  "If 16.6ms has NOT elapsed: The render step is skipped to save GPU power.",
  "Phase 4: Select Next Macrotask from the Macrotask (Task) Queue.",
  "Look for the oldest runnable task (timer, network response, DOM click event).",
  "If a macrotask is found: Pull EXACTLY ONE TASK into the Call Stack.",
  "Only ONE macrotask runs per loop cycle! It does NOT drain the macrotask queue.",
  "Repeat the cycle: Run that 1 task ➔ Drain ALL microtasks ➔ Check render ➔ Next macrotask.",
  "What if all queues are empty? The thread goes to sleep to save CPU power until an event occurs.",
  "This elegant infinite loop is why JavaScript stays smooth, responsive, and predictable.",
  "Slide 9 Complete: You know the official 4-phase algorithm by heart!"
]
</script>

<div class="h-full flex flex-col justify-between py-1 select-none">
  <PersistentLegend />
  <ProgressBar :step="$clicks" :total-steps="25" :slide-number="9" :total-slides="20" />

  <CaptionBar
    :caption="captions[Math.min($clicks, captions.length - 1)]"
    :phase="$clicks <= 4 ? 'sync' : ($clicks <= 9 ? 'microtasks' : ($clicks <= 16 ? 'render' : 'macrotasks'))"
    :is-last="$clicks >= 24"
    takeaway="Loop Tick: 1 Macrotask ➔ Drain ALL Microtasks to 0 ➔ Render (if 16.6ms) ➔ Repeat."
  />

  <div class="flex-1 my-1">
    <EventLoopFlowchart :step="Math.floor($clicks / 5)" />
  </div>
</div>

<!--
SPEAKER NOTES:
[Click 0-4]: Phase 1: Call Stack execution.
[Click 5-9]: Phase 2: Microtask checkpoint. Emphasize 'drain to zero' — microtasks can spawn microtasks.
[Click 10-16]: Phase 3: The 16.6ms 60fps render opportunity.
[Click 17-21]: Phase 4: Exactly one macrotask is picked, then the whole cycle repeats.
[Click 22-24]: Summarize the loop invariant.
-->
