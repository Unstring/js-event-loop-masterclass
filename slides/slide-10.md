---
clicks: 25
layout: default
---

<script setup lang="ts">
import RuntimeStage from '../components/RuntimeStage.vue'
import type { SimulatorStep } from '../composables/useSimulator'

const code = [
  "console.log('A');",
  "setTimeout(() => console.log('B'), 0);",
  "console.log('C');"
]

const steps: SimulatorStep[] = [
  {
    line: 1,
    caption: "Outcome 3: setTimeout Internals. Full mechanical trace of Snippet 1.",
    callStack: [{ name: "global()" }],
    phase: "sync"
  },
  {
    line: 1,
    caption: "Step 1: Code starts execution. `global()` frame sits at base of Call Stack.",
    callStack: [{ name: "global()" }],
    phase: "sync"
  },
  {
    line: 1,
    caption: "Step 2: Line 1 `console.log('A')` pushed to Call Stack.",
    callStack: [{ name: "global()" }, { name: "console.log('A')" }],
    phase: "sync"
  },
  {
    line: 1,
    caption: "Step 3: 'A' prints synchronously to console. Frame pops off stack.",
    callStack: [{ name: "global()" }],
    console: ["A"],
    phase: "sync"
  },
  {
    line: 2,
    caption: "Step 4: Line 2 `setTimeout(() => console.log('B'), 0)` pushed to Call Stack.",
    callStack: [{ name: "global()" }, { name: "setTimeout(fn, 0)" }],
    console: ["A"],
    phase: "sync"
  },
  {
    line: 2,
    caption: "Step 5: Engine evaluates setTimeout. Identifies it as a Host Web API function.",
    callStack: [{ name: "global()" }, { name: "setTimeout(fn, 0)" }],
    console: ["A"],
    phase: "sync"
  },
  {
    line: 2,
    caption: "Step 6: Engine packages callback pointer and 0ms delay, hands it off to Host.",
    callStack: [{ name: "global()" }],
    webApis: [{ id: "t0", label: "Timer (0ms)", progress: 100, timeLeft: "0ms" }],
    tokenMovement: { from: "callStack", to: "webapi", label: "() => log('B')" },
    console: ["A"],
    phase: "sync"
  },
  {
    line: 2,
    caption: "Step 7: `setTimeout` function call returns a timer ID (integer, e.g. 1) and pops.",
    callStack: [{ name: "global()" }],
    webApis: [{ id: "t0", label: "Timer (0ms)", progress: 0, timeLeft: "0ms Ready" }],
    console: ["A"],
    phase: "sync"
  },
  {
    line: 3,
    caption: "Step 8: Host Web API timer fires in background. Host moves callback to Macrotask Queue.",
    callStack: [{ name: "global()" }],
    macrotasks: ["log('B') [macrotask]"],
    tokenMovement: { from: "webapi", to: "macrotasks", label: "log('B')" },
    console: ["A"],
    phase: "sync"
  },
  {
    line: 3,
    caption: "Step 9: Can callback log('B') run now? NO! Line 3 is next on Call Stack.",
    callStack: [{ name: "global()" }],
    macrotasks: ["log('B') [macrotask]"],
    loopQuestion: { isStackEmpty: false, decision: "STACK NOT EMPTY" },
    console: ["A"],
    phase: "sync"
  },
  {
    line: 3,
    caption: "Step 10: Line 3 `console.log('C')` pushed to Call Stack.",
    callStack: [{ name: "global()" }, { name: "console.log('C')" }],
    macrotasks: ["log('B') [macrotask]"],
    console: ["A"],
    phase: "sync"
  },
  {
    line: 3,
    caption: "Step 11: 'C' prints synchronously to console. Frame pops off stack.",
    callStack: [{ name: "global()" }],
    macrotasks: ["log('B') [macrotask]"],
    console: ["A", "C"],
    phase: "sync"
  },
  {
    line: 3,
    caption: "Step 12: End of synchronous file reached! `global()` context pops off.",
    callStack: [],
    macrotasks: ["log('B') [macrotask]"],
    loopQuestion: { isStackEmpty: true, decision: "STACK IS EMPTY!" },
    console: ["A", "C"],
    phase: "idle"
  },
  {
    line: 3,
    caption: "Step 13: Event Loop tick: Checks Call Stack. Stack is empty!",
    callStack: [],
    macrotasks: ["log('B') [macrotask]"],
    loopQuestion: { isStackEmpty: true, hasMicrotasks: false, decision: "CHECK QUEUES" },
    console: ["A", "C"],
    phase: "idle"
  },
  {
    line: 3,
    caption: "Step 14: Checks Microtask Queue. Length = 0. No microtasks pending.",
    callStack: [],
    macrotasks: ["log('B') [macrotask]"],
    loopQuestion: { isStackEmpty: true, hasMicrotasks: false, decision: "CHECK MACROTASKS" },
    console: ["A", "C"],
    phase: "idle"
  },
  {
    line: 2,
    caption: "Step 15: Event Loop grabs `log('B')` from Macrotask Queue and pushes to Call Stack!",
    callStack: [{ name: "() => log('B')" }],
    macrotasks: [],
    tokenMovement: { from: "macrotasks", to: "callStack", label: "() => log('B')" },
    console: ["A", "C"],
    phase: "macrotasks"
  },
  {
    line: 2,
    caption: "Step 16: Inside callback: `console.log('B')` is pushed to Call Stack.",
    callStack: [{ name: "() => log('B')" }, { name: "console.log('B')" }],
    console: ["A", "C"],
    phase: "macrotasks"
  },
  {
    line: 2,
    caption: "Step 17: 'B' prints to console. Frame pops.",
    callStack: [{ name: "() => log('B')" }],
    console: ["A", "C", "B"],
    phase: "macrotasks"
  },
  {
    line: 2,
    caption: "Step 18: Callback finishes execution and pops off Call Stack.",
    callStack: [],
    console: ["A", "C", "B"],
    phase: "idle"
  },
  {
    line: 0,
    caption: "Step 19: Result verified: Output is strictly 'A', then 'C', then 'B'.",
    callStack: [],
    console: ["A", "C", "B"],
    predictReveal: "Final Output: A, C, B",
    phase: "idle"
  },
  {
    line: 0,
    caption: "Step 20: Common mistake: Assuming 0ms delay causes synchronous execution.",
    callStack: [],
    console: ["A", "C", "B"],
    commonMistake: "Assuming setTimeout(fn, 0) inserts fn into the current call stack.",
    phase: "idle"
  },
  {
    line: 0,
    caption: "Step 21: What if we set delay to -5ms? In spec, negative delays clamp to 0ms.",
    callStack: [],
    console: ["A", "C", "B"],
    whatIf: "setTimeout(fn, -5) is treated identically to setTimeout(fn, 0).",
    phase: "idle"
  },
  {
    line: 0,
    caption: "Step 22: Hand-off law: Every callback MUST travel Web API -> Queue -> Stack.",
    callStack: [],
    console: ["A", "C", "B"],
    phase: "idle"
  },
  {
    line: 0,
    caption: "Step 23: There are no shortcuts. A queued task CANNOT bypass the Call Stack.",
    callStack: [],
    console: ["A", "C", "B"],
    phase: "idle"
  },
  {
    line: 0,
    caption: "Slide 10 Complete: You have mastered the complete setTimeout registration lifecycle!",
    callStack: [],
    console: ["A", "C", "B"],
    phase: "idle"
  }
]
</script>

<div class="h-full">
  <RuntimeStage
    :steps="steps"
    :code="code"
    :step="$clicks"
    :slide-number="10"
    :total-slides="20"
    title="Slide 10: Snippet 1 Master Trace (A C B)"
    takeaway="Callbacks must queue: Web API ➔ Macrotask Queue ➔ Empty Stack ➔ Execution."
  />
</div>

<!--
SPEAKER NOTES:
[Click 0-4]: Trace synchronous console.log('A').
[Click 5-9]: Trace setTimeout registration to Web APIs and queueing.
[Click 10-12]: Trace synchronous console.log('C') and global context exit.
[Click 13-19]: Event loop picks the macrotask and prints 'B'.
[Click 20-24]: Address common misconceptions.
-->
