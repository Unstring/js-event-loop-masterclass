---
clicks: 35
layout: default
---

<script setup lang="ts">
import RuntimeStage from '../components/RuntimeStage.vue'
import type { SimulatorStep } from '../composables/useSimulator'

const code = [
  "console.log('script start');",
  "setTimeout(() => {",
  "  console.log('timeout 1');",
  "  Promise.resolve().then(() => console.log('promise inside timeout'));",
  "}, 0);",
  "setTimeout(() => console.log('timeout 2'), 0);",
  "Promise.resolve()",
  "  .then(() => console.log('promise 1'))",
  "  .then(() => console.log('promise 2'));",
  "console.log('script end');"
]

const steps: SimulatorStep[] = [
  {
    line: 1,
    caption: "Snippet 5 Master Trace: Nested microtasks inside macrotasks.",
    callStack: [{ name: "global()" }],
    phase: "sync"
  },
  {
    line: 1,
    caption: "Classroom Challenge: Predict the complete 7-line output sequence!",
    callStack: [{ name: "global()" }],
    predictPrompt: "Can you trace all 7 logs across multiple ticks?",
    phase: "sync"
  },
  {
    line: 1,
    caption: "Line 1: `console.log('script start')` executes synchronously.",
    callStack: [{ name: "global()" }, { name: "console.log(...)" }],
    phase: "sync"
  },
  {
    line: 1,
    caption: "'script start' printed to console.",
    callStack: [{ name: "global()" }],
    console: ["script start"],
    phase: "sync"
  },
  {
    line: 2,
    caption: "Line 2: `setTimeout` #1 (0ms) registers with Host Web APIs.",
    callStack: [{ name: "global()" }, { name: "setTimeout #1" }],
    console: ["script start"],
    phase: "sync"
  },
  {
    line: 2,
    caption: "Host Web API finishes 0ms timer and queues `timeout 1` into Macrotask Queue.",
    callStack: [{ name: "global()" }],
    macrotasks: ["timeout 1 [macro]"],
    tokenMovement: { from: "webapi", to: "macrotasks", label: "timeout 1" },
    console: ["script start"],
    phase: "sync"
  },
  {
    line: 6,
    caption: "Line 6: `setTimeout` #2 (0ms) registers with Host Web APIs.",
    callStack: [{ name: "global()" }, { name: "setTimeout #2" }],
    macrotasks: ["timeout 1 [macro]"],
    console: ["script start"],
    phase: "sync"
  },
  {
    line: 6,
    caption: "Host Web API queues `timeout 2` into Macrotask Queue (behind `timeout 1`).",
    callStack: [{ name: "global()" }],
    macrotasks: ["timeout 1 [macro]", "timeout 2 [macro]"],
    tokenMovement: { from: "webapi", to: "macrotasks", label: "timeout 2" },
    console: ["script start"],
    phase: "sync"
  },
  {
    line: 7,
    caption: "Line 7: `Promise.resolve()` fulfills immediately.",
    callStack: [{ name: "global()" }, { name: "Promise.resolve()" }],
    macrotasks: ["timeout 1 [macro]", "timeout 2 [macro]"],
    console: ["script start"],
    phase: "sync"
  },
  {
    line: 8,
    caption: "Line 8: `.then()` registers first microtask `promise 1` into Microtask Queue.",
    callStack: [{ name: "global()" }, { name: ".then(p1)" }],
    microtasks: ["promise 1 [micro]"],
    macrotasks: ["timeout 1 [macro]", "timeout 2 [macro]"],
    tokenMovement: { from: "callStack", to: "microtasks", label: "promise 1" },
    console: ["script start"],
    phase: "sync"
  },
  {
    line: 9,
    caption: "Line 9: Second `.then()` attaches to the promise returned by the first `.then()`.",
    callStack: [{ name: "global()" }],
    microtasks: ["promise 1 [micro]"],
    macrotasks: ["timeout 1 [macro]", "timeout 2 [macro]"],
    console: ["script start"],
    phase: "sync"
  },
  {
    line: 10,
    caption: "Line 10: `console.log('script end')` executes synchronously.",
    callStack: [{ name: "global()" }, { name: "console.log('script end')" }],
    microtasks: ["promise 1 [micro]"],
    macrotasks: ["timeout 1 [macro]", "timeout 2 [macro]"],
    console: ["script start"],
    phase: "sync"
  },
  {
    line: 10,
    caption: "'script end' printed to console! Global script finishes and pops off.",
    callStack: [],
    microtasks: ["promise 1 [micro]"],
    macrotasks: ["timeout 1 [macro]", "timeout 2 [macro]"],
    loopQuestion: { isStackEmpty: true, hasMicrotasks: true, decision: "DRAIN MICROTASKS FIRST!" },
    console: ["script start", "script end"],
    phase: "idle"
  },
  {
    line: 8,
    caption: "Event Loop pulls `promise 1` from Microtask Queue to Call Stack.",
    callStack: [{ name: "() => log('promise 1')" }],
    microtasks: [],
    macrotasks: ["timeout 1 [macro]", "timeout 2 [macro]"],
    tokenMovement: { from: "microtasks", to: "callStack", label: "promise 1" },
    console: ["script start", "script end"],
    phase: "microtasks"
  },
  {
    line: 8,
    caption: "'promise 1' prints! Its return fulfills the chained promise, queuing `promise 2`!",
    callStack: [{ name: "() => log('promise 1')" }],
    microtasks: ["promise 2 [micro]"],
    tokenMovement: { from: "callStack", to: "microtasks", label: "promise 2" },
    console: ["script start", "script end", "promise 1"],
    phase: "microtasks"
  },
  {
    line: 8,
    caption: "First microtask pops off. Is Microtask Queue empty? NO! `promise 2` is waiting.",
    callStack: [],
    microtasks: ["promise 2 [micro]"],
    macrotasks: ["timeout 1 [macro]", "timeout 2 [macro]"],
    loopQuestion: { isStackEmpty: true, hasMicrotasks: true, decision: "KEEP DRAINING MICROTASKS" },
    console: ["script start", "script end", "promise 1"],
    phase: "microtasks"
  },
  {
    line: 9,
    caption: "Event Loop pulls `promise 2` to Call Stack immediately.",
    callStack: [{ name: "() => log('promise 2')" }],
    microtasks: [],
    macrotasks: ["timeout 1 [macro]", "timeout 2 [macro]"],
    tokenMovement: { from: "microtasks", to: "callStack", label: "promise 2" },
    console: ["script start", "script end", "promise 1"],
    phase: "microtasks"
  },
  {
    line: 9,
    caption: "'promise 2' prints to console! Frame pops off Call Stack.",
    callStack: [],
    microtasks: [],
    macrotasks: ["timeout 1 [macro]", "timeout 2 [macro]"],
    loopQuestion: { isStackEmpty: true, hasMicrotasks: false, decision: "MICROTASKS CLEAR! PICK 1 MACROTASK" },
    console: ["script start", "script end", "promise 1", "promise 2"],
    phase: "idle"
  },
  {
    line: 2,
    caption: "Microtasks are 100% drained. Event Loop takes OLDEST macrotask: `timeout 1`.",
    callStack: [{ name: "timeout 1 callback()" }],
    microtasks: [],
    macrotasks: ["timeout 2 [macro]"],
    tokenMovement: { from: "macrotasks", to: "callStack", label: "timeout 1" },
    console: ["script start", "script end", "promise 1", "promise 2"],
    phase: "macrotasks"
  },
  {
    line: 3,
    caption: "Inside `timeout 1`: `console.log('timeout 1')` executes.",
    callStack: [{ name: "timeout 1 callback()" }, { name: "console.log('timeout 1')" }],
    macrotasks: ["timeout 2 [macro]"],
    console: ["script start", "script end", "promise 1", "promise 2"],
    phase: "macrotasks"
  },
  {
    line: 3,
    caption: "'timeout 1' prints to console.",
    callStack: [{ name: "timeout 1 callback()" }],
    macrotasks: ["timeout 2 [macro]"],
    console: ["script start", "script end", "promise 1", "promise 2", "timeout 1"],
    phase: "macrotasks"
  },
  {
    line: 4,
    caption: "Line 4: A NEW Promise is created inside the macrotask and resolves!",
    callStack: [{ name: "timeout 1 callback()" }, { name: "Promise.resolve()" }],
    macrotasks: ["timeout 2 [macro]"],
    console: ["script start", "script end", "promise 1", "promise 2", "timeout 1"],
    phase: "macrotasks"
  },
  {
    line: 4,
    caption: "Crucial moment: `.then()` pushes `promise inside timeout` to the Microtask Queue!",
    callStack: [{ name: "timeout 1 callback()" }],
    microtasks: ["promise inside timeout [micro]"],
    macrotasks: ["timeout 2 [macro]"],
    tokenMovement: { from: "callStack", to: "microtasks", label: "inner promise" },
    console: ["script start", "script end", "promise 1", "promise 2", "timeout 1"],
    phase: "macrotasks"
  },
  {
    line: 5,
    caption: "`timeout 1` callback finishes and pops off Call Stack.",
    callStack: [],
    microtasks: ["promise inside timeout [micro]"],
    macrotasks: ["timeout 2 [macro]"],
    loopQuestion: { isStackEmpty: true, hasMicrotasks: true, decision: "DRAIN MICROTASKS BEFORE NEXT MACROTASK!" },
    console: ["script start", "script end", "promise 1", "promise 2", "timeout 1"],
    phase: "idle"
  },
  {
    line: 4,
    caption: "Question: Does `timeout 2` run next, or the nested promise? Microtask wins!",
    callStack: [],
    microtasks: ["promise inside timeout [micro]"],
    macrotasks: ["timeout 2 [macro]"],
    phase: "microtasks"
  },
  {
    line: 4,
    caption: "Event Loop pulls `promise inside timeout` to Call Stack immediately!",
    callStack: [{ name: "() => log('inner promise')" }],
    microtasks: [],
    macrotasks: ["timeout 2 [macro]"],
    tokenMovement: { from: "microtasks", to: "callStack", label: "inner promise" },
    console: ["script start", "script end", "promise 1", "promise 2", "timeout 1"],
    phase: "microtasks"
  },
  {
    line: 4,
    caption: "'promise inside timeout' prints to console!",
    callStack: [{ name: "() => log('inner promise')" }],
    macrotasks: ["timeout 2 [macro]"],
    console: ["script start", "script end", "promise 1", "promise 2", "timeout 1", "promise inside timeout"],
    phase: "microtasks"
  },
  {
    line: 4,
    caption: "Nested microtask pops off. Microtask Queue is empty once again.",
    callStack: [],
    microtasks: [],
    macrotasks: ["timeout 2 [macro]"],
    loopQuestion: { isStackEmpty: true, hasMicrotasks: false, decision: "NOW PICK NEXT MACROTASK" },
    console: ["script start", "script end", "promise 1", "promise 2", "timeout 1", "promise inside timeout"],
    phase: "idle"
  },
  {
    line: 6,
    caption: "Event Loop finally picks the remaining macrotask: `timeout 2`!",
    callStack: [{ name: "timeout 2 callback()" }],
    macrotasks: [],
    tokenMovement: { from: "macrotasks", to: "callStack", label: "timeout 2" },
    console: ["script start", "script end", "promise 1", "promise 2", "timeout 1", "promise inside timeout"],
    phase: "macrotasks"
  },
  {
    line: 6,
    caption: "'timeout 2' prints to console!",
    callStack: [{ name: "timeout 2 callback()" }],
    console: ["script start", "script end", "promise 1", "promise 2", "timeout 1", "promise inside timeout", "timeout 2"],
    phase: "macrotasks"
  },
  {
    line: 6,
    caption: "`timeout 2` finishes and pops. All queues and Call Stack are completely clear!",
    callStack: [],
    console: ["script start", "script end", "promise 1", "promise 2", "timeout 1", "promise inside timeout", "timeout 2"],
    loopQuestion: { isStackEmpty: true, decision: "ALL TASKS COMPLETE" },
    phase: "idle"
  },
  {
    line: 0,
    caption: "Full Output Verified: script start -> script end -> promise 1 -> promise 2 -> timeout 1 -> promise inside timeout -> timeout 2.",
    callStack: [],
    console: ["script start", "script end", "promise 1", "promise 2", "timeout 1", "promise inside timeout", "timeout 2"],
    predictReveal: "Full Sequence Verified!",
    phase: "idle"
  },
  {
    line: 0,
    caption: "Golden rule demonstrated: AFTER EVERY MACROTASK, the microtask queue is checked and drained!",
    callStack: [],
    console: ["script start", "script end", "promise 1", "promise 2", "timeout 1", "promise inside timeout", "timeout 2"],
    phase: "idle"
  },
  {
    line: 0,
    caption: "`timeout 2` could NOT run until the inner promise of `timeout 1` was completely finished.",
    callStack: [],
    console: ["script start", "script end", "promise 1", "promise 2", "timeout 1", "promise inside timeout", "timeout 2"],
    phase: "idle"
  },
  {
    line: 0,
    caption: "Slide 15 Complete: You just solved the ultimate JavaScript concurrency interview puzzle!",
    callStack: [],
    console: ["script start", "script end", "promise 1", "promise 2", "timeout 1", "promise inside timeout", "timeout 2"],
    phase: "idle"
  }
]
</script>

<div class="h-full">
  <RuntimeStage
    :steps="steps"
    :code="code"
    :step="$clicks"
    :slide-number="15"
    :total-slides="20"
    title="Slide 15: Snippet 5 Master Trace (Nested Microtasks)"
    takeaway="After EVERY macrotask completes, the event loop drains any newly spawned microtasks before the next macrotask!"
  />
</div>

<!--
SPEAKER NOTES:
[Click 0-3]: Synchronous script start.
[Click 4-13]: Register timers 1 & 2, then promise 1 & 2, and script end.
[Click 14-18]: Drain promise 1 and promise 2 microtasks.
[Click 19-24]: Execute timeout 1, which spawns a brand new microtask!
[Click 25-28]: Emphasize that the inner microtask runs BEFORE timeout 2!
[Click 29-34]: Execute timeout 2 and celebrate the master trace completion.
-->
