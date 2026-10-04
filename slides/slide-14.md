---
clicks: 25
layout: default
---

<script setup lang="ts">
import StarvationDemo from '../components/StarvationDemo.vue'
import CaptionBar from '../components/CaptionBar.vue'
import PersistentLegend from '../components/PersistentLegend.vue'
import ProgressBar from '../components/ProgressBar.vue'

const captions = [
  "Starvation & Rendering: What happens when the microtask queue NEVER empties?",
  "We established: The Event Loop MUST drain ALL microtasks before moving to rendering or macrotasks.",
  "Consider this dangerous function: `function starve() { Promise.resolve().then(starve); }`",
  "Call `starve()`: Step 1 schedules a microtask to run `starve` again.",
  "Call Stack empties. Event Loop begins draining the Microtask Queue.",
  "Microtask 1 executes `starve()`. It schedules Microtask 2 and finishes.",
  "Is the Microtask Queue empty? NO! Microtask 2 is waiting.",
  "Event Loop executes Microtask 2. It schedules Microtask 3!",
  "Microtask 3 schedules Microtask 4... Microtask 4 schedules Microtask 5!",
  "Notice what has happened: THE MICROTASK QUEUE LENGTH NEVER REACHES ZERO.",
  "The Event Loop is mathematically trapped inside Phase 2 (Microtask Checkpoint).",
  "Now look at what is waiting on the outside: 1. User Clicks (Macrotasks).",
  "2. `setTimeout` and `setInterval` timers (Macrotasks). Trapped and delayed forever!",
  "3. `requestAnimationFrame` (rAF) callbacks. Cannot execute.",
  "4. BROWSER RENDERING (Style, Layout, Paint). Completely frozen!",
  "Even though the Call Stack is repeatedly pushing and popping (not stuck in a while-loop), the browser freezes!",
  "Tabs become completely unresponsive. Animations freeze mid-frame. Scrolling stops dead.",
  "Contrast this with recursive macrotasks: `function loop() { setTimeout(loop, 0); }`",
  "With `setTimeout`, each callback is ONE Macrotask.",
  "Between Macrotasks, the Event Loop checks microtasks (0) and CHECKS RENDERING!",
  "The browser can paint a frame at 60 FPS between each `setTimeout` tick!",
  "Therefore: `setTimeout` loops allow the browser to breathe; recursive microtasks suffocate it.",
  "Where does `requestAnimationFrame` fit? It runs right before layout and paint.",
  "Rule: Never spawn unbounded recursive microtasks without yielding to a macrotask or rAF!",
  "Slide 14 Complete: You now understand Event Loop starvation and frame drops!"
]
</script>

<div class="h-full flex flex-col justify-between py-1 select-none">
  <PersistentLegend />
  <ProgressBar :step="$clicks" :total-steps="25" :slide-number="14" :total-slides="20" />

  <CaptionBar
    :caption="captions[Math.min($clicks, captions.length - 1)]"
    :phase="$clicks <= 4 ? 'sync' : ($clicks <= 11 ? 'microtasks' : 'blocked')"
    :is-last="$clicks >= 24"
    takeaway="Recursive microtasks starve the event loop, completely blocking the 60 FPS rendering pipeline."
  />

  <div class="flex-1 my-1">
    <StarvationDemo :step="Math.floor($clicks / 5)" />
  </div>
</div>

<!--
SPEAKER NOTES:
[Click 0-4]: Introduce the recursive Promise loop.
[Click 5-11]: Show how queue length never reaches zero, trapping the event loop in Phase 2.
[Click 12-17]: Highlight that paint, rAF, and macrotasks are completely starved.
[Click 18-24]: Contrast with recursive setTimeout, which yields to paint between ticks.
-->
