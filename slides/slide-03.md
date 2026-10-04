---
clicks: 25
layout: default
---

<script setup lang="ts">
import RaceConditionDemo from '../components/RaceConditionDemo.vue'
import CaptionBar from '../components/CaptionBar.vue'
import PersistentLegend from '../components/PersistentLegend.vue'
import ProgressBar from '../components/ProgressBar.vue'

const captions = [
  "Outcome 1: Why is JavaScript single-threaded? Let's travel back to May 1995.",
  "Netscape Navigator needed a scripting language to make static web pages interactive.",
  "Brendan Eich was tasked with creating Mocha (later JavaScript) in just 10 days.",
  "Web browsers are built around a shared, mutable tree structure: The DOM.",
  "Every HTML element (like <div id='banner'>) resides in a single heap memory address.",
  "What if JavaScript had multiple threads executing simultaneously on that same DOM node?",
  "Imagine Thread A: Handling a user click event to update banner text to 'Hello'.",
  "Simultaneously, Thread B: An async network response deleting #banner entirely.",
  "Thread A reads the pointer to #banner: Memory address 0x7FFE.",
  "Thread B reads the exact same pointer: Memory address 0x7FFE.",
  "Thread B executes first: document.getElementById('banner').remove() is called.",
  "The browser engine deallocates 0x7FFE and frees the memory back to the OS.",
  "Thread A now attempts to write innerText into 0x7FFE!",
  "Catastrophe: A dangling pointer write causes memory corruption or a SIGSEGV browser crash!",
  "In multi-threaded languages (C++, Java), developers must use mutex locks and semaphores.",
  "Mutexes introduce devastating bugs: Deadlocks, priority inversions, and massive overhead.",
  "Imagine web developers having to write `mutex.lock()` before changing CSS colors!",
  "Eich's brilliant design decision: KEEP JAVASCRIPT STRICTLY SINGLE-THREADED.",
  "One thread means: Only ONE function executes at any given millisecond.",
  "Atomic execution: When your code runs, no other script can mutate the DOM underneath you.",
  "Zero race conditions on shared memory objects.",
  "Zero deadlocks from conflicting lock acquisitions.",
  "Simple, deterministic programming model that any developer can reason about.",
  "But wait: If JS has only one thread, how does it fetch data without freezing?",
  "The answer: Delegate long operations to the BROWSER host, and coordinate via the Event Loop!"
]
</script>

<div class="h-full flex flex-col justify-between py-1 select-none">
  <PersistentLegend />
  <ProgressBar :step="$clicks" :total-steps="25" :slide-number="3" :total-slides="20" />

  <CaptionBar
    :caption="captions[Math.min($clicks, captions.length - 1)]"
    phase="sync"
    :is-last="$clicks >= 24"
    takeaway="JavaScript is single-threaded to keep DOM mutations atomic and prevent multi-threaded memory corruption."
  />

  <div class="flex-1 my-1">
    <RaceConditionDemo :step="Math.floor($clicks / 5)" />
  </div>
</div>

<!--
SPEAKER NOTES:
[Click 0-5]: Establish the 1995 context. Brendan Eich had 10 days. The browser DOM is a shared tree.
[Click 6-13]: Walk through the hypothetical race condition. Thread A wants to write, Thread B deletes.
[Click 14-17]: Highlight the nightmare of locks and mutexes for web developers.
[Click 18-24]: Conclude why single-threading was a feature, not a bug, and segue into asynchronous delegation.
-->
