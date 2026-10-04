---
clicks: 25
layout: default
---

<script setup lang="ts">
import RuntimeAnatomyDemo from '../components/RuntimeAnatomyDemo.vue'
import CaptionBar from '../components/CaptionBar.vue'
import PersistentLegend from '../components/PersistentLegend.vue'
import ProgressBar from '../components/ProgressBar.vue'

const captions = [
  "Runtime Anatomy: Who actually owns what? Let's dissect the machine piece by piece.",
  "Crucial mental distinction: The JS ENGINE is NOT the same thing as the BROWSER.",
  "Piece 1: The JavaScript Engine (Google V8, SpiderMonkey, JavaScriptCore).",
  "The Engine consists of exactly two primary memory structures: The Heap and the Call Stack.",
  "Memory Heap (Yellow): A large, unstructured region where objects, strings, and closures are allocated.",
  "Whenever you create `const user = { name: 'Alice' }`, memory is allocated in the Heap.",
  "Call Stack (Blue): The single LIFO (Last-In, First-Out) stack that tracks function execution.",
  "When a function is called, a stack frame is pushed. When it returns, the frame is popped.",
  "Here is the shocker for most students: V8 DOES NOT HAVE `setTimeout` OR `fetch`!",
  "If you download V8 source code and search for `setTimeout`, it does not exist.",
  "So where does `setTimeout` come from? Enter Piece 2: The HOST ENVIRONMENT (Orange).",
  "In browsers: The Host provides Web APIs (DOM manipulation, timers, fetch, geolocation).",
  "In Node.js: The Host provides C++ bindings and the Libuv multi-threaded asynchronous I/O pool.",
  "The Host is implemented in multi-threaded C/C++ or Rust.",
  "When you call `setTimeout(fn, 1000)`, V8 delegates the timer counting to the Host.",
  "Now look at Piece 3: The QUEUES (Green & Purple).",
  "When a background task finishes, its callback cannot jump directly into the Call Stack!",
  "Microtask Queue (Green): High-priority queue for Promise `.then()`, `queueMicrotask`, `MutationObserver`.",
  "Macrotask Queue (Purple): Standard task queue for `setTimeout`, `setInterval`, UI clicks, and I/O.",
  "And finally, Piece 4: The EVENT LOOP (Red).",
  "The Event Loop is a continuous coordinator running between the queues and the Call Stack.",
  "It constantly asks: 'Is the Call Stack completely empty?'",
  "If the stack has active frames, the Event Loop WAITS. It never interrupts running code.",
  "Once the stack is 100% empty, it drains all Microtasks first, then processes one Macrotask.",
  "Notice our 7-color classroom palette: Memorize these colors, they stay consistent on every slide!"
]
</script>

<div class="h-full flex flex-col justify-between py-1 select-none">
  <PersistentLegend />
  <ProgressBar :step="$clicks" :total-steps="25" :slide-number="5" :total-slides="20" />

  <CaptionBar
    :caption="captions[Math.min($clicks, captions.length - 1)]"
    :phase="$clicks <= 9 ? 'sync' : ($clicks <= 14 ? 'macrotasks' : ($clicks <= 19 ? 'microtasks' : 'idle'))"
    :is-last="$clicks >= 24"
    takeaway="The Engine executes JS (Stack + Heap); the Host handles async APIs; the Event Loop coordinates queues."
  />

  <div class="flex-1 my-1">
    <RuntimeAnatomyDemo :step="Math.floor($clicks / 4)" />
  </div>
</div>

<!--
SPEAKER NOTES:
[Click 0-9]: Distinguish Engine from Browser/Node. Point to the Heap and Stack. Emphasize V8 doesn't have setTimeout.
[Click 10-14]: Introduce Host Web APIs. They run in C++ background threads.
[Click 15-19]: Introduce Microtask (green) and Macrotask (purple) queues.
[Click 20-24]: Introduce the Event Loop as the coordinator ring. Tie in the classroom color code.
-->
