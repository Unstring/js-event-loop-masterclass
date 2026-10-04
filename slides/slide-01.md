---
clicks: 25
layout: default
---

<script setup lang="ts">
import RuntimeStage from '../components/RuntimeStage.vue'
import type { SimulatorStep } from '../composables/useSimulator'

const code = [
  "console.log('1. Script start');",
  "setTimeout(() => {",
  "  console.log('2. Inside 0ms timer');",
  "}, 0);",
  "console.log('3. Script end');"
]

const steps: SimulatorStep[] = [
  {
    line: 1,
    caption: "Welcome to the JS Event Loop Masterclass! Press Next to explore the 0ms mystery.",
    callStack: [{ name: "global()" }],
    phase: "sync"
  },
  {
    line: 1,
    caption: "Intuition check: When does setTimeout(..., 0) run? Immediately, or later?",
    callStack: [{ name: "global()" }],
    predictPrompt: "Will '2. Inside 0ms timer' log before or after '3. Script end'?",
    phase: "sync"
  },
  {
    line: 1,
    caption: "Line 1: console.log('1. Script start') pushed to Call Stack.",
    callStack: [{ name: "global()" }, { name: "console.log('1...')" }],
    phase: "sync"
  },
  {
    line: 1,
    caption: "console.log executes synchronously and emits to stdout.",
    callStack: [{ name: "global()" }],
    console: ["1. Script start"],
    phase: "sync"
  },
  {
    line: 2,
    caption: "Line 2: setTimeout(callback, 0) invoked on Call Stack.",
    callStack: [{ name: "global()" }, { name: "setTimeout(fn, 0)" }],
    phase: "sync"
  },
  {
    line: 2,
    caption: "JavaScript engine delegates timer registration to Browser Host Web APIs.",
    callStack: [{ name: "global()" }],
    webApis: [{ id: "t0", label: "Timer (0ms)", progress: 100, timeLeft: "0ms ready" }],
    tokenMovement: { from: "callStack", to: "webapi", label: "callback () => {...}" },
    phase: "sync"
  },
  {
    line: 3,
    caption: "Timer expires immediately (0ms) in host environment!",
    callStack: [{ name: "global()" }],
    webApis: [{ id: "t0", label: "Timer (0ms)", progress: 0, timeLeft: "Expired" }],
    phase: "sync"
  },
  {
    line: 3,
    caption: "Host pushes callback to Macrotask Queue (FIFO). Notice: Stack is NOT empty yet!",
    callStack: [{ name: "global()" }],
    macrotasks: ["callback() [0ms timer]"],
    tokenMovement: { from: "webapi", to: "macrotasks", label: "timer callback" },
    phase: "sync"
  },
  {
    line: 4,
    caption: "Can the callback run right now? NO! The Call Stack is currently busy running global script.",
    callStack: [{ name: "global()" }],
    macrotasks: ["callback() [0ms timer]"],
    loopQuestion: { isStackEmpty: false, decision: "WAIT (Stack Busy)" },
    phase: "sync"
  },
  {
    line: 5,
    caption: "Line 5: console.log('3. Script end') pushed to Call Stack.",
    callStack: [{ name: "global()" }, { name: "console.log('3...')" }],
    macrotasks: ["callback() [0ms timer]"],
    phase: "sync"
  },
  {
    line: 5,
    caption: "console.log executes synchronously and prints to console.",
    callStack: [{ name: "global()" }],
    macrotasks: ["callback() [0ms timer]"],
    console: ["1. Script start", "3. Script end"],
    phase: "sync"
  },
  {
    line: 5,
    caption: "End of script reached. global() execution context pops off the stack!",
    callStack: [],
    macrotasks: ["callback() [0ms timer]"],
    loopQuestion: { isStackEmpty: true, decision: "STACK IS EMPTY!" },
    phase: "idle"
  },
  {
    line: 5,
    caption: "Event Loop wakes up: Stack is empty! Are there microtasks? None.",
    callStack: [],
    macrotasks: ["callback() [0ms timer]"],
    loopQuestion: { isStackEmpty: true, hasMicrotasks: false, decision: "CHECK MACROTASKS" },
    phase: "idle"
  },
  {
    line: 2,
    caption: "Event Loop pulls oldest macrotask from queue and pushes to Call Stack!",
    callStack: [{ name: "timer callback()" }],
    macrotasks: [],
    tokenMovement: { from: "macrotasks", to: "callStack", label: "callback ()" },
    phase: "macrotasks"
  },
  {
    line: 3,
    caption: "Inside callback: console.log('2. Inside 0ms timer') executes.",
    callStack: [{ name: "timer callback()" }, { name: "console.log('2...')" }],
    phase: "macrotasks"
  },
  {
    line: 3,
    caption: "Third output logged to console.",
    callStack: [{ name: "timer callback()" }],
    console: ["1. Script start", "3. Script end", "2. Inside 0ms timer"],
    phase: "macrotasks"
  },
  {
    line: 4,
    caption: "Callback completes execution and pops off Call Stack.",
    callStack: [],
    console: ["1. Script start", "3. Script end", "2. Inside 0ms timer"],
    phase: "idle"
  },
  {
    line: 4,
    caption: "Prediction confirmed! Output order is strictly 1 -> 3 -> 2.",
    callStack: [],
    console: ["1. Script start", "3. Script end", "2. Inside 0ms timer"],
    predictReveal: "1. Script start -> 3. Script end -> 2. Inside 0ms timer",
    phase: "idle"
  },
  {
    line: 0,
    caption: "Why? JavaScript has ONLY ONE Call Stack and runs synchronous code to completion.",
    callStack: [],
    console: ["1. Script start", "3. Script end", "2. Inside 0ms timer"],
    phase: "idle"
  },
  {
    line: 0,
    caption: "Host Web APIs handle timing independently in background C++ threads.",
    callStack: [],
    console: ["1. Script start", "3. Script end", "2. Inside 0ms timer"],
    phase: "idle"
  },
  {
    line: 0,
    caption: "Queues buffer completed tasks in strict FIFO (First-In, First-Out) order.",
    callStack: [],
    console: ["1. Script start", "3. Script end", "2. Inside 0ms timer"],
    phase: "idle"
  },
  {
    line: 0,
    caption: "The Event Loop is the coordinator that monitors the stack and queues.",
    callStack: [],
    console: ["1. Script start", "3. Script end", "2. Inside 0ms timer"],
    phase: "idle"
  },
  {
    line: 0,
    caption: "It NEVER interrupts a running function. Zero preemption in JavaScript.",
    callStack: [],
    console: ["1. Script start", "3. Script end", "2. Inside 0ms timer"],
    phase: "idle"
  },
  {
    line: 0,
    caption: "Over the next 19 slides, we will master every layer of this machine.",
    callStack: [],
    console: ["1. Script start", "3. Script end", "2. Inside 0ms timer"],
    phase: "idle"
  },
  {
    line: 0,
    caption: "Slide 1 Complete: Let's explore the roadmap of our journey!",
    callStack: [],
    console: ["1. Script start", "3. Script end", "2. Inside 0ms timer"],
    phase: "idle"
  }
]
</script>

<div class="h-full">
  <RuntimeStage
    :steps="steps"
    :code="code"
    :step="$clicks"
    :slide-number="1"
    :total-slides="20"
    title="Slide 1: The 0ms setTimeout Puzzle"
    takeaway="setTimeout(fn, 0) specifies a MINIMUM delay before queueing, NOT immediate execution!"
  />
</div>

<!--
SPEAKER NOTES:
[Click 0-4]: Welcome students! Ask the room: 'If delay is 0ms, does it print immediately?' Let them shout answers.
[Click 5-11]: Walk line by line. Emphasize that setTimeout is handed to the browser, which queues it.
[Click 12-17]: Highlight the empty stack condition. The event loop can only push when stack is empty.
[Click 18-24]: Summarize the core takeaway. Minimum delay != execution time.
-->
