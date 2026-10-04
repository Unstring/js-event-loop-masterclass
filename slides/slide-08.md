---
clicks: 25
layout: default
---

<script setup lang="ts">
import RuntimeStage from '../components/RuntimeStage.vue'
import type { SimulatorStep } from '../composables/useSimulator'

const code = [
  "const start = Date.now();",
  "setTimeout(() => {",
  "  console.log('timer fired after', Date.now() - start, 'ms');",
  "}, 100);",
  "while (Date.now() - start < 3000) {",
  "  // BLOCKING Call Stack for 3000ms!",
  "}",
  "console.log('loop done');"
]

const steps: SimulatorStep[] = [
  {
    line: 1,
    caption: "Stack Overflow & UI Blocking: Snippet 3 demonstrates the single-threaded danger.",
    callStack: [{ name: "global()" }],
    phase: "sync"
  },
  {
    line: 1,
    caption: "Line 1: `start = Date.now()` records the initial timestamp (t = 0ms).",
    callStack: [{ name: "global()", locals: { start: 0 } }],
    phase: "sync"
  },
  {
    line: 2,
    caption: "Line 2: `setTimeout(..., 100)` registers a timer with the Browser Host Web API.",
    callStack: [{ name: "global()", locals: { start: 0 } }, { name: "setTimeout(...)" }],
    phase: "sync"
  },
  {
    line: 2,
    caption: "Host Web API starts counting down 100ms in background C++ timer thread.",
    callStack: [{ name: "global()", locals: { start: 0 } }],
    webApis: [{ id: "t1", label: "Timer (100ms)", progress: 100, timeLeft: "100ms" }],
    phase: "sync"
  },
  {
    line: 5,
    caption: "Line 5: CPU enters synchronous `while` loop! Start checking elapsed time.",
    callStack: [{ name: "global()", locals: { start: 0 } }, { name: "while (t < 3000)" }],
    webApis: [{ id: "t1", label: "Timer (100ms)", progress: 70, timeLeft: "70ms" }],
    phase: "blocked"
  },
  {
    line: 6,
    caption: "t = 100ms elapsed! The Host Web API timer reaches 0 and fires!",
    callStack: [{ name: "global()" }, { name: "while (t < 3000)" }],
    webApis: [{ id: "t1", label: "Timer (100ms)", progress: 0, timeLeft: "READY (0ms)" }],
    phase: "blocked"
  },
  {
    line: 6,
    caption: "Host pushes timer callback into Macrotask Queue. Ready to execute!",
    callStack: [{ name: "global()" }, { name: "while (t < 3000)" }],
    macrotasks: ["timerCallback() [ready at 100ms]"],
    tokenMovement: { from: "webapi", to: "macrotasks", label: "timer callback" },
    phase: "blocked"
  },
  {
    line: 6,
    caption: "Classroom question: Can the timer callback execute at 100ms?",
    callStack: [{ name: "global()" }, { name: "while (t < 3000)" }],
    macrotasks: ["timerCallback()"],
    predictPrompt: "Will the timer callback run at 100ms or after the 3000ms loop?",
    phase: "blocked"
  },
  {
    line: 6,
    caption: "NO! Event Loop checks the stack: while-loop is STILL executing on the main thread!",
    callStack: [{ name: "global()" }, { name: "while (t < 3000)" }],
    macrotasks: ["timerCallback()"],
    loopQuestion: { isStackEmpty: false, decision: "STACK BLOCKED! CANNOT RUN" },
    phase: "blocked"
  },
  {
    line: 6,
    caption: "t = 1000ms: CPU is 100% pegged in while-loop. UI cannot scroll, clicks are ignored.",
    callStack: [{ name: "global()" }, { name: "while (t < 3000)" }],
    macrotasks: ["timerCallback()"],
    phase: "blocked"
  },
  {
    line: 6,
    caption: "t = 2000ms: Browser marks the tab as 'Page Unresponsive' (beachball / spinner).",
    callStack: [{ name: "global()" }, { name: "while (t < 3000)" }],
    macrotasks: ["timerCallback()"],
    phase: "blocked"
  },
  {
    line: 6,
    caption: "t = 3000ms: Condition `Date.now() - start < 3000` finally evaluates to FALSE!",
    callStack: [{ name: "global()" }, { name: "while (t < 3000)" }],
    macrotasks: ["timerCallback()"],
    phase: "sync"
  },
  {
    line: 7,
    caption: "while-loop finishes and pops off the Call Stack.",
    callStack: [{ name: "global()" }],
    macrotasks: ["timerCallback()"],
    phase: "sync"
  },
  {
    line: 8,
    caption: "Line 8: `console.log('loop done')` executes synchronously.",
    callStack: [{ name: "global()" }, { name: "console.log('loop done')" }],
    macrotasks: ["timerCallback()"],
    phase: "sync"
  },
  {
    line: 8,
    caption: "'loop done' prints to console FIRST (even though timer expired 2900ms ago!).",
    callStack: [{ name: "global()" }],
    macrotasks: ["timerCallback()"],
    console: ["loop done"],
    phase: "sync"
  },
  {
    line: 8,
    caption: "Global script completes! `global()` context pops off. Stack is FINALLY empty!",
    callStack: [],
    macrotasks: ["timerCallback()"],
    loopQuestion: { isStackEmpty: true, decision: "STACK EMPTY: RESUME QUEUE" },
    phase: "idle"
  },
  {
    line: 2,
    caption: "Event Loop now pulls the waiting timer callback into the Call Stack.",
    callStack: [{ name: "timer callback()" }],
    macrotasks: [],
    tokenMovement: { from: "macrotasks", to: "callStack", label: "timer callback" },
    console: ["loop done"],
    phase: "macrotasks"
  },
  {
    line: 3,
    caption: "Inside callback: `Date.now() - start` evaluates to 3002ms!",
    callStack: [{ name: "timer callback()" }, { name: "console.log(...)" }],
    console: ["loop done"],
    phase: "macrotasks"
  },
  {
    line: 3,
    caption: "Console prints: 'timer fired after ~3002 ms'!",
    callStack: [{ name: "timer callback()" }],
    console: ["loop done", "timer fired after ~3002 ms"],
    predictReveal: "Output: loop done, then timer fired after ~3000ms (NOT 100ms!)",
    phase: "macrotasks"
  },
  {
    line: 4,
    caption: "Timer callback completes and pops off the stack.",
    callStack: [],
    console: ["loop done", "timer fired after ~3002 ms"],
    phase: "idle"
  },
  {
    line: 0,
    caption: "Core Rule: `setTimeout(fn, 100)` means 'Wait AT LEAST 100ms before queueing'.",
    callStack: [],
    console: ["loop done", "timer fired after ~3002 ms"],
    phase: "idle"
  },
  {
    line: 0,
    caption: "It does NOT mean 'Execute at exactly 100ms'.",
    callStack: [],
    console: ["loop done", "timer fired after ~3002 ms"],
    phase: "idle"
  },
  {
    line: 0,
    caption: "If the main thread is busy doing heavy math or synchronous loops, callbacks wait.",
    callStack: [],
    console: ["loop done", "timer fired after ~3002 ms"],
    phase: "idle"
  },
  {
    line: 0,
    caption: "Also beware: Infinite recursive calls without base case cause 'RangeError: Maximum call stack size exceeded'.",
    callStack: [],
    console: ["loop done", "timer fired after ~3002 ms"],
    phase: "idle"
  },
  {
    line: 0,
    caption: "Slide 8 Complete: You now understand why we NEVER block the Call Stack!",
    callStack: [],
    console: ["loop done", "timer fired after ~3002 ms"],
    phase: "idle"
  }
]
</script>

<div class="h-full">
  <RuntimeStage
    :steps="steps"
    :code="code"
    :step="$clicks"
    :slide-number="8"
    :total-slides="20"
    title="Slide 8: Blocking the Stack & Delayed Timers"
    takeaway="Timer delays are minimum delays; a blocked Call Stack delays timer execution indefinitely."
  />
</div>

<!--
SPEAKER NOTES:
[Click 0-4]: Show timer registration with 100ms delay.
[Click 5-11]: Emphasize the while-loop blocking the stack. Timer expires at 100ms, but sits trapped in the queue for 2900ms.
[Click 12-19]: 'loop done' prints first, followed by ~3000ms timer firing.
[Click 20-24]: Cement the golden rule: Never block the main thread.
-->
