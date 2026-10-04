---
clicks: 25
layout: default
---

<script setup lang="ts">
import TimerDeepDiveDemo from '../components/TimerDeepDiveDemo.vue'
import CaptionBar from '../components/CaptionBar.vue'
import PersistentLegend from '../components/PersistentLegend.vue'
import ProgressBar from '../components/ProgressBar.vue'

const captions = [
  "setTimeout Deep Dive: The hidden engineering rules every senior developer must know.",
  "Rule 1: Delay argument specifies a MINIMUM delay, not an exact schedule.",
  "`setTimeout(fn, 1000)` instructs the OS: 'Do not queue `fn` before 1000 milliseconds have elapsed'.",
  "If the main thread is busy with synchronous calculations at 1000ms, the callback waits.",
  "Rule 2: Browser Clamping — The 4 millisecond rule.",
  "What happens if you recursively call `setTimeout(next, 0)` in a browser?",
  "According to HTML5 specification (section 8.5.1): If nesting level exceeds 5, delay MUST be clamped to at least 4ms.",
  "Browsers enforce this clamp to prevent accidental infinite 0ms loops from draining mobile battery.",
  "In Node.js: `setTimeout(fn, 0)` is internally normalized to `setTimeout(fn, 1)` (1ms minimum).",
  "To execute on the very next tick without 4ms clamping: Use `queueMicrotask()` or `setImmediate()` in Node.",
  "Rule 3: How the Host orders multiple timers.",
  "If you register `setTimeout(fnA, 50)` and `setTimeout(fnB, 10)`, which runs first?",
  "The Host Web API does NOT keep timers in a FIFO array; it uses a Min-Heap priority queue.",
  "Timers are sorted by absolute target timestamp: `now + delay`.",
  "`fnB` (10ms) expires earlier, so the Host pushes `fnB` to the Macrotask Queue first!",
  "Rule 4: setInterval drift and cumulative timing errors.",
  "`setInterval(fn, 1000)` does not account for the execution time of `fn` itself.",
  "If `fn` takes 400ms to run, intervals can drift and cause jitter across network frames.",
  "Professional pattern: Use recursive `setTimeout` instead of `setInterval` for deterministic gaps.",
  "Rule 5: How `clearTimeout(id)` works behind the scenes.",
  "When you invoke `const id = setTimeout(fn, 500)`, `id` is an integer token identifying the timer.",
  "Calling `clearTimeout(id)` asks the Host Web API to delete that timer from its internal Min-Heap.",
  "If the timer has already expired and moved to the Macrotask Queue: The callback is marked as cancelled.",
  "When the Event Loop encounters a cancelled task frame, it discards it without pushing to Call Stack.",
  "Slide 11 Complete: You now understand the full host timer subsystem!"
]
</script>

<div class="h-full flex flex-col justify-between py-1 select-none">
  <PersistentLegend />
  <ProgressBar :step="$clicks" :total-steps="25" :slide-number="11" :total-slides="20" />

  <CaptionBar
    :caption="captions[Math.min($clicks, captions.length - 1)]"
    phase="macrotasks"
    :is-last="$clicks >= 24"
    takeaway="Timers use host min-heaps, clamp to 4ms after 5 levels of nesting, and guarantee only minimum delay."
  />

  <div class="flex-1 my-1">
    <TimerDeepDiveDemo :step="Math.floor($clicks / 4)" />
  </div>
</div>

<!--
SPEAKER NOTES:
[Click 0-4]: Reinforce minimum delay rule.
[Click 5-10]: Explain the 4ms clamping rule in browsers and 1ms clamp in Node.
[Click 11-15]: Min-heap ordering of timers by expiry timestamp.
[Click 16-19]: Explain setInterval drift vs recursive setTimeout.
[Click 20-24]: Explain clearTimeout lifecycle.
-->
