---
clicks: 25
layout: default
---

<script setup lang="ts">
import ThreadComparisonDemo from '../components/ThreadComparisonDemo.vue'
import CaptionBar from '../components/CaptionBar.vue'
import PersistentLegend from '../components/PersistentLegend.vue'
import ProgressBar from '../components/ProgressBar.vue'

const captions = [
  "Single vs Multi-Thread: Let's compare the runtime architectures side-by-side.",
  "Multi-Threading (Java, C++, Rust): Multiple operating system threads share memory.",
  "Thread 1 executes stack 1; Thread 2 executes stack 2 simultaneously on multi-core CPUs.",
  "To prevent conflicting memory writes, developers must place MUTEXES (Mutual Exclusions).",
  "Thread 1 locks Mutex A before modifying resource A.",
  "Thread 2 locks Mutex B before modifying resource B.",
  "Now the disaster strikes: Thread 1 requests Mutex B to complete its transaction.",
  "Thread 2 simultaneously requests Mutex A to complete its transaction!",
  "Neither thread can proceed. Both are blocked waiting forever: A DEADLOCK.",
  "Deadlocks are notoriously difficult to reproduce, debug, and eliminate in production.",
  "Multi-threading also introduces thread switching overhead and heavy memory per stack (~1MB each).",
  "Now look at JavaScript's Single-Threaded Architecture on the right.",
  "JavaScript has strictly ONE Call Stack on the engine main thread.",
  "Execution is 'Run-to-Completion': A function runs entirely before another function starts.",
  "No function can ever be interrupted mid-execution by another JavaScript function.",
  "Because there is only one thread touching memory, MUTEXES DO NOT EXIST.",
  "No mutexes = Zero possibility of deadlocks!",
  "No data races on shared JavaScript variables.",
  "Memory footprint is tiny: Only one stack needs to be allocated.",
  "Question: If JavaScript is single-threaded, how does it handle 10,000 requests in Node.js?",
  "Question: Why does a 5-second fetch() not freeze your mouse clicks in the browser?",
  "Key Insight: Single-threaded refers ONLY to the JavaScript execution engine (V8).",
  "The HOST ENVIRONMENT (Browser or Node.js runtime) is deeply multi-threaded!",
  "When you call fetch(), the browser's C++ network threads handle the download in the background.",
  "When the download completes, the result is queued for the single JS thread to process safely!"
]
</script>

<div class="h-full flex flex-col justify-between py-1 select-none">
  <PersistentLegend />
  <ProgressBar :step="$clicks" :total-steps="25" :slide-number="4" :total-slides="20" />

  <CaptionBar
    :caption="captions[Math.min($clicks, captions.length - 1)]"
    :phase="$clicks <= 11 ? 'blocked' : 'sync'"
    :is-last="$clicks >= 24"
    takeaway="JS is single-threaded, but the Host Environment (Browser / Node) is deeply multi-threaded."
  />

  <div class="flex-1 my-1">
    <ThreadComparisonDemo :step="Math.floor($clicks / 5)" />
  </div>
</div>

<!--
SPEAKER NOTES:
[Click 0-10]: Explain the classical multi-threaded deadlock. Two threads waiting on each other's locks.
[Click 11-18]: Contrast with JavaScript's single thread. Run-to-completion guarantees atomic execution.
[Click 19-24]: Address the elephant in the room: 'How does it do many things at once?' The host environment offload!
-->
