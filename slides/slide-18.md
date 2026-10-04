---
clicks: 35
layout: default
---

<script setup lang="ts">
import RuntimeStage from '../components/RuntimeStage.vue'
import type { SimulatorStep } from '../composables/useSimulator'

const code = [
  "async function foo() {",
  "  console.log('foo start');",
  "  await bar();",
  "  console.log('foo end');",
  "}",
  "async function bar() { console.log('bar'); }",
  "console.log('script start');",
  "setTimeout(() => console.log('timeout'), 0);",
  "foo();",
  "new Promise(res => { console.log('promise executor'); res(); })",
  "  .then(() => console.log('promise then'));",
  "console.log('script end');"
]

const steps: SimulatorStep[] = [
  {
    line: 7,
    caption: "Snippet 6: async/await Desugaring Master Trace. Await = Suspend & Resume.",
    callStack: [{ name: "global()" }],
    phase: "sync"
  },
  {
    line: 7,
    caption: "Classroom Prediction Challenge: Trace the execution of foo(), bar(), Promise, and timer!",
    callStack: [{ name: "global()" }],
    predictPrompt: "Can you predict the full 8-log output sequence?",
    phase: "sync"
  },
  {
    line: 7,
    caption: "Line 7: `console.log('script start')` executes synchronously.",
    callStack: [{ name: "global()" }, { name: "console.log('script start')" }],
    phase: "sync"
  },
  {
    line: 7,
    caption: "'script start' printed to console. Frame pops.",
    callStack: [{ name: "global()" }],
    console: ["script start"],
    phase: "sync"
  },
  {
    line: 8,
    caption: "Line 8: `setTimeout(..., 0)` registers with Host Web APIs.",
    callStack: [{ name: "global()" }, { name: "setTimeout(...)" }],
    console: ["script start"],
    phase: "sync"
  },
  {
    line: 8,
    caption: "Timer expires immediately! Host pushes `() => log('timeout')` to MACROTASK Queue.",
    callStack: [{ name: "global()" }],
    macrotasks: ["log('timeout') [macro]"],
    tokenMovement: { from: "webapi", to: "macrotasks", label: "timeout callback" },
    console: ["script start"],
    phase: "sync"
  },
  {
    line: 9,
    caption: "Line 9: `foo()` is invoked synchronously on the Call Stack!",
    callStack: [{ name: "global()" }, { name: "foo() [async]" }],
    macrotasks: ["log('timeout') [macro]"],
    console: ["script start"],
    phase: "sync"
  },
  {
    line: 2,
    caption: "Inside `foo()` Line 2: `console.log('foo start')` executes synchronously.",
    callStack: [{ name: "global()" }, { name: "foo() [async]" }, { name: "console.log('foo start')" }],
    macrotasks: ["log('timeout') [macro]"],
    console: ["script start"],
    phase: "sync"
  },
  {
    line: 2,
    caption: "'foo start' prints to console. Frame pops.",
    callStack: [{ name: "global()" }, { name: "foo() [async]" }],
    macrotasks: ["log('timeout') [macro]"],
    console: ["script start", "foo start"],
    phase: "sync"
  },
  {
    line: 3,
    caption: "Line 3: `await bar()`. First, `bar()` is invoked synchronously on the Call Stack.",
    callStack: [{ name: "global()" }, { name: "foo() [async]" }, { name: "bar() [async]" }],
    macrotasks: ["log('timeout') [macro]"],
    console: ["script start", "foo start"],
    phase: "sync"
  },
  {
    line: 6,
    caption: "Inside `bar()` Line 6: `console.log('bar')` executes synchronously.",
    callStack: [{ name: "global()" }, { name: "foo() [async]" }, { name: "bar() [async]" }, { name: "console.log('bar')" }],
    macrotasks: ["log('timeout') [macro]"],
    console: ["script start", "foo start"],
    phase: "sync"
  },
  {
    line: 6,
    caption: "'bar' prints to console. `bar()` returns a resolved Promise and pops.",
    callStack: [{ name: "global()" }, { name: "foo() [async]" }],
    macrotasks: ["log('timeout') [macro]"],
    console: ["script start", "foo start", "bar"],
    phase: "sync"
  },
  {
    line: 3,
    caption: "Crucial moment: `await` evaluates the resolved Promise from `bar()`.",
    callStack: [{ name: "global()" }, { name: "foo() [async]" }],
    macrotasks: ["log('timeout') [macro]"],
    console: ["script start", "foo start", "bar"],
    phase: "sync"
  },
  {
    line: 3,
    caption: "`await` SUSPENDS `foo()`. The execution state of `foo` is saved to the heap.",
    callStack: [{ name: "global()" }],
    microtasks: ["foo continuation [micro]"],
    macrotasks: ["log('timeout') [macro]"],
    tokenMovement: { from: "callStack", to: "microtasks", label: "foo resumption" },
    console: ["script start", "foo start", "bar"],
    phase: "sync"
  },
  {
    line: 3,
    caption: "`foo()`'s frame is REMOVED from Call Stack! Control yields back to global caller.",
    callStack: [{ name: "global()" }],
    microtasks: ["foo continuation [micro]"],
    macrotasks: ["log('timeout') [macro]"],
    console: ["script start", "foo start", "bar"],
    phase: "sync"
  },
  {
    line: 10,
    caption: "Line 10: `new Promise(...)` constructor runs SYNCHRONOUSLY.",
    callStack: [{ name: "global()" }, { name: "Promise executor" }],
    microtasks: ["foo continuation [micro]"],
    macrotasks: ["log('timeout') [macro]"],
    console: ["script start", "foo start", "bar"],
    phase: "sync"
  },
  {
    line: 10,
    caption: "Inside executor: `console.log('promise executor')` executes synchronously.",
    callStack: [{ name: "global()" }, { name: "Promise executor" }, { name: "console.log(...)" }],
    microtasks: ["foo continuation [micro]"],
    macrotasks: ["log('timeout') [macro]"],
    console: ["script start", "foo start", "bar"],
    phase: "sync"
  },
  {
    line: 10,
    caption: "'promise executor' prints to console! `res()` fulfills the promise immediately.",
    callStack: [{ name: "global()" }, { name: "Promise executor" }],
    microtasks: ["foo continuation [micro]"],
    macrotasks: ["log('timeout') [macro]"],
    console: ["script start", "foo start", "bar", "promise executor"],
    phase: "sync"
  },
  {
    line: 11,
    caption: "Line 11: `.then()` registers `promise then` callback into Microtask Queue!",
    callStack: [{ name: "global()" }],
    microtasks: ["foo continuation [micro]", "promise then [micro]"],
    macrotasks: ["log('timeout') [macro]"],
    tokenMovement: { from: "callStack", to: "microtasks", label: "promise then" },
    console: ["script start", "foo start", "bar", "promise executor"],
    phase: "sync"
  },
  {
    line: 12,
    caption: "Line 12: `console.log('script end')` executes synchronously.",
    callStack: [{ name: "global()" }, { name: "console.log('script end')" }],
    microtasks: ["foo continuation [micro]", "promise then [micro]"],
    macrotasks: ["log('timeout') [macro]"],
    console: ["script start", "foo start", "bar", "promise executor"],
    phase: "sync"
  },
  {
    line: 12,
    caption: "'script end' prints! Global execution context completes and pops off.",
    callStack: [],
    microtasks: ["foo continuation [micro]", "promise then [micro]"],
    macrotasks: ["log('timeout') [macro]"],
    loopQuestion: { isStackEmpty: true, hasMicrotasks: true, decision: "STACK EMPTY: DRAIN MICROTASKS" },
    console: ["script start", "foo start", "bar", "promise executor", "script end"],
    phase: "idle"
  },
  {
    line: 4,
    caption: "Event Loop pulls first microtask: `foo continuation`! Restores `foo()` stack frame!",
    callStack: [{ name: "foo() [resumed]" }],
    microtasks: ["promise then [micro]"],
    macrotasks: ["log('timeout') [macro]"],
    tokenMovement: { from: "microtasks", to: "callStack", label: "restore foo()" },
    console: ["script start", "foo start", "bar", "promise executor", "script end"],
    phase: "microtasks"
  },
  {
    line: 4,
    caption: "Inside resumed `foo()` Line 4: `console.log('foo end')` executes.",
    callStack: [{ name: "foo() [resumed]" }, { name: "console.log('foo end')" }],
    microtasks: ["promise then [micro]"],
    macrotasks: ["log('timeout') [macro]"],
    console: ["script start", "foo start", "bar", "promise executor", "script end"],
    phase: "microtasks"
  },
  {
    line: 4,
    caption: "'foo end' prints to console! `foo()` completes and pops off stack.",
    callStack: [],
    microtasks: ["promise then [micro]"],
    macrotasks: ["log('timeout') [macro]"],
    console: ["script start", "foo start", "bar", "promise executor", "script end", "foo end"],
    phase: "microtasks"
  },
  {
    line: 11,
    caption: "Event Loop pulls second microtask: `() => log('promise then')` to Call Stack.",
    callStack: [{ name: "() => log('promise then')" }],
    microtasks: [],
    macrotasks: ["log('timeout') [macro]"],
    tokenMovement: { from: "microtasks", to: "callStack", label: "promise then" },
    console: ["script start", "foo start", "bar", "promise executor", "script end", "foo end"],
    phase: "microtasks"
  },
  {
    line: 11,
    caption: "'promise then' prints to console! Frame pops off stack.",
    callStack: [],
    microtasks: [],
    macrotasks: ["log('timeout') [macro]"],
    loopQuestion: { isStackEmpty: true, hasMicrotasks: false, decision: "MICROTASKS CLEAR! PICK MACROTASK" },
    console: ["script start", "foo start", "bar", "promise executor", "script end", "foo end", "promise then"],
    phase: "idle"
  },
  {
    line: 8,
    caption: "Microtasks are 100% empty. Event Loop finally picks macrotask: `() => log('timeout')`.",
    callStack: [{ name: "() => log('timeout')" }],
    macrotasks: [],
    tokenMovement: { from: "macrotasks", to: "callStack", label: "timeout callback" },
    console: ["script start", "foo start", "bar", "promise executor", "script end", "foo end", "promise then"],
    phase: "macrotasks"
  },
  {
    line: 8,
    caption: "'timeout' prints to console! Callback completes and pops.",
    callStack: [],
    console: ["script start", "foo start", "bar", "promise executor", "script end", "foo end", "promise then", "timeout"],
    phase: "idle"
  },
  {
    line: 0,
    caption: "Prediction confirmed! Exact output sequence fully verified.",
    callStack: [],
    console: ["script start", "foo start", "bar", "promise executor", "script end", "foo end", "promise then", "timeout"],
    predictReveal: "script start -> foo start -> bar -> promise executor -> script end -> foo end -> promise then -> timeout",
    phase: "idle"
  },
  {
    line: 0,
    caption: "Key Mechanism: `async/await` is syntactic sugar over Promises and Microtasks.",
    callStack: [],
    console: ["script start", "foo start", "bar", "promise executor", "script end", "foo end", "promise then", "timeout"],
    phase: "idle"
  },
  {
    line: 0,
    caption: "`await expr` wraps `expr` in `Promise.resolve(expr)` and registers the remainder of the function as a microtask.",
    callStack: [],
    console: ["script start", "foo start", "bar", "promise executor", "script end", "foo end", "promise then", "timeout"],
    phase: "idle"
  },
  {
    line: 0,
    caption: "The Call Stack yields to other synchronous code until the next microtask checkpoint.",
    callStack: [],
    console: ["script start", "foo start", "bar", "promise executor", "script end", "foo end", "promise then", "timeout"],
    phase: "idle"
  },
  {
    line: 0,
    caption: "When the microtask runs, the stack frame is restored with all local variables intact.",
    callStack: [],
    console: ["script start", "foo start", "bar", "promise executor", "script end", "foo end", "promise then", "timeout"],
    phase: "idle"
  },
  {
    line: 0,
    caption: "Slide 18 Complete: You have mastered async/await desugaring down to the metal!",
    callStack: [],
    console: ["script start", "foo start", "bar", "promise executor", "script end", "foo end", "promise then", "timeout"],
    phase: "idle"
  }
]
</script>

<div class="h-full">
  <RuntimeStage
    :steps="steps"
    :code="code"
    :step="$clicks"
    :slide-number="18"
    :total-slides="20"
    title="Slide 18: Snippet 6 Master Trace (async/await Desugaring)"
    takeaway="`await` suspends the function frame, yields stack control, and resumes later as a microtask!"
  />
</div>

<!--
SPEAKER NOTES:
[Click 0-6]: Synchronous start and timer setup.
[Click 7-12]: Enter foo() and bar(). bar() runs synchronously up until the await!
[Click 13-15]: The critical await suspension! foo frame pops off the stack, continuation enters microtask queue.
[Click 16-21]: Promise constructor and script end run synchronously.
[Click 22-26]: Drain microtasks: foo end runs first, then promise then!
[Click 27-34]: Finally timeout runs. Summarize desugaring equivalence.
-->
