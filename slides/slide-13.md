---
clicks: 25
layout: default
---

<script setup lang="ts">
import RuntimeStage from '../components/RuntimeStage.vue'
import type { SimulatorStep } from '../composables/useSimulator'

const code = [
  "console.log('1');",
  "setTimeout(() => console.log('2'), 0);",
  "Promise.resolve().then(() => console.log('3'));",
  "console.log('4');"
]

const steps: SimulatorStep[] = [
  {
    line: 1,
    caption: "Microtask vs Macrotask Priority: Snippet 2 Master Trace (1, 4, 3, 2).",
    callStack: [{ name: "global()" }],
    phase: "sync"
  },
  {
    line: 1,
    caption: "Classroom Prediction: In what exact order will numbers 1, 2, 3, 4 print?",
    callStack: [{ name: "global()" }],
    predictPrompt: "What is the exact output sequence for lines 1 to 4?",
    phase: "sync"
  },
  {
    line: 1,
    caption: "Line 1: `console.log('1')` executes synchronously on Call Stack.",
    callStack: [{ name: "global()" }, { name: "console.log('1')" }],
    phase: "sync"
  },
  {
    line: 1,
    caption: "'1' prints to console. Frame pops.",
    callStack: [{ name: "global()" }],
    console: ["1"],
    phase: "sync"
  },
  {
    line: 2,
    caption: "Line 2: `setTimeout(..., 0)` pushes to Call Stack.",
    callStack: [{ name: "global()" }, { name: "setTimeout(...)" }],
    console: ["1"],
    phase: "sync"
  },
  {
    line: 2,
    caption: "Host Web API registers 0ms timer in background.",
    callStack: [{ name: "global()" }],
    webApis: [{ id: "t2", label: "Timer (0ms)", progress: 0, timeLeft: "0ms Ready" }],
    console: ["1"],
    phase: "sync"
  },
  {
    line: 2,
    caption: "Timer expires immediately! Host pushes `() => log('2')` to MACROTASK Queue (Purple).",
    callStack: [{ name: "global()" }],
    macrotasks: ["log('2') [macrotask]"],
    tokenMovement: { from: "webapi", to: "macrotasks", label: "log('2')" },
    console: ["1"],
    phase: "sync"
  },
  {
    line: 3,
    caption: "Line 3: `Promise.resolve()` creates an already-fulfilled Promise object.",
    callStack: [{ name: "global()" }, { name: "Promise.resolve()" }],
    macrotasks: ["log('2') [macrotask]"],
    console: ["1"],
    phase: "sync"
  },
  {
    line: 3,
    caption: "Calling `.then(fn)` on a fulfilled Promise queues `() => log('3')` into the MICROTASK Queue (Green)!",
    callStack: [{ name: "global()" }, { name: ".then(...)" }],
    microtasks: ["log('3') [microtask]"],
    macrotasks: ["log('2') [macrotask]"],
    tokenMovement: { from: "callStack", to: "microtasks", label: "log('3')" },
    console: ["1"],
    phase: "sync"
  },
  {
    line: 3,
    caption: "Notice the state: BOTH queues now have 1 item! Which queue has priority?",
    callStack: [{ name: "global()" }],
    microtasks: ["log('3') [microtask]"],
    macrotasks: ["log('2') [macrotask]"],
    console: ["1"],
    phase: "sync"
  },
  {
    line: 4,
    caption: "Line 4: `console.log('4')` executes synchronously.",
    callStack: [{ name: "global()" }, { name: "console.log('4')" }],
    microtasks: ["log('3') [microtask]"],
    macrotasks: ["log('2') [macrotask]"],
    console: ["1"],
    phase: "sync"
  },
  {
    line: 4,
    caption: "'4' prints to console. Frame pops.",
    callStack: [{ name: "global()" }],
    microtasks: ["log('3') [microtask]"],
    macrotasks: ["log('2') [macrotask]"],
    console: ["1", "4"],
    phase: "sync"
  },
  {
    line: 4,
    caption: "End of script reached! `global()` execution context pops off. Call Stack is EMPTY!",
    callStack: [],
    microtasks: ["log('3') [microtask]"],
    macrotasks: ["log('2') [macrotask]"],
    loopQuestion: { isStackEmpty: true, hasMicrotasks: true, decision: "DRAIN MICROTASKS FIRST!" },
    console: ["1", "4"],
    phase: "idle"
  },
  {
    line: 4,
    caption: "Event Loop Rule: ALWAYS DRAIN MICROTASKS BEFORE ANY MACROTASK!",
    callStack: [],
    microtasks: ["log('3') [microtask]"],
    macrotasks: ["log('2') [macrotask]"],
    loopQuestion: { isStackEmpty: true, hasMicrotasks: true, decision: "DRAIN MICROTASKS" },
    console: ["1", "4"],
    phase: "microtasks"
  },
  {
    line: 3,
    caption: "Event Loop pulls `() => log('3')` from Microtask Queue into Call Stack!",
    callStack: [{ name: "() => log('3')" }],
    microtasks: [],
    macrotasks: ["log('2') [macrotask]"],
    tokenMovement: { from: "microtasks", to: "callStack", label: "log('3')" },
    console: ["1", "4"],
    phase: "microtasks"
  },
  {
    line: 3,
    caption: "Inside microtask: `console.log('3')` executes.",
    callStack: [{ name: "() => log('3')" }, { name: "console.log('3')" }],
    macrotasks: ["log('2') [macrotask]"],
    console: ["1", "4"],
    phase: "microtasks"
  },
  {
    line: 3,
    caption: "'3' prints to console! Frame pops off stack.",
    callStack: [{ name: "() => log('3')" }],
    macrotasks: ["log('2') [macrotask]"],
    console: ["1", "4", "3"],
    phase: "microtasks"
  },
  {
    line: 3,
    caption: "Microtask finishes and pops. Microtask queue length is now ZERO (empty).",
    callStack: [],
    macrotasks: ["log('2') [macrotask]"],
    loopQuestion: { isStackEmpty: true, hasMicrotasks: false, decision: "NOW CHECK MACROTASKS" },
    console: ["1", "4", "3"],
    phase: "idle"
  },
  {
    line: 2,
    caption: "Microtasks are clear! Event Loop now picks the oldest Macrotask: `() => log('2')`.",
    callStack: [{ name: "() => log('2')" }],
    macrotasks: [],
    tokenMovement: { from: "macrotasks", to: "callStack", label: "log('2')" },
    console: ["1", "4", "3"],
    phase: "macrotasks"
  },
  {
    line: 2,
    caption: "Inside macrotask: `console.log('2')` executes.",
    callStack: [{ name: "() => log('2')" }, { name: "console.log('2')" }],
    console: ["1", "4", "3"],
    phase: "macrotasks"
  },
  {
    line: 2,
    caption: "'2' prints to console! Frame pops.",
    callStack: [],
    console: ["1", "4", "3", "2"],
    phase: "idle"
  },
  {
    line: 0,
    caption: "Prediction confirmed! Output sequence is 1 ➔ 4 ➔ 3 ➔ 2.",
    callStack: [],
    console: ["1", "4", "3", "2"],
    predictReveal: "Output: 1, 4, 3, 2 (Microtasks jump ahead of macrotasks!)",
    phase: "idle"
  },
  {
    line: 0,
    caption: "Common mistake: Thinking setTimeout(fn, 0) runs before Promise.resolve().then() because it was written earlier.",
    callStack: [],
    console: ["1", "4", "3", "2"],
    commonMistake: "Order of registration does not matter when competing across different queues!",
    phase: "idle"
  },
  {
    line: 0,
    caption: "Queue priority dominates code order: Synchronous ➔ ALL Microtasks ➔ Oldest Macrotask.",
    callStack: [],
    console: ["1", "4", "3", "2"],
    phase: "idle"
  },
  {
    line: 0,
    caption: "Slide 13 Complete: You have mastered microtask queue priority!",
    callStack: [],
    console: ["1", "4", "3", "2"],
    phase: "idle"
  }
]
</script>

<div class="h-full">
  <RuntimeStage
    :steps="steps"
    :code="code"
    :step="$clicks"
    :slide-number="13"
    :total-slides="20"
    title="Slide 13: Snippet 2 Master Trace (1 4 3 2)"
    takeaway="Priority Law: Synchronous first ➔ ALL Microtasks second ➔ Macrotasks third."
  />
</div>

<!--
SPEAKER NOTES:
[Click 0-2]: Ask the prediction: 1, 2, 3, 4? Many will guess 1, 2, 3, 4 or 1, 4, 2, 3.
[Click 3-12]: Trace synchronous 1 and 4, showing items entering both queues simultaneously.
[Click 13-18]: Demonstrate microtask drain. Why 3 beats 2 every time.
[Click 19-21]: Finally, macrotask 2 executes.
[Click 22-24]: Summarize the priority invariant.
-->
