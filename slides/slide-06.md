---
clicks: 25
layout: default
---

<script setup lang="ts">
import RuntimeStage from '../components/RuntimeStage.vue'
import type { SimulatorStep } from '../composables/useSimulator'

const code = [
  "function d() { return 4; }",
  "function c() { const x = d(); return x + 1; }",
  "function b() { const y = c(); return y * 2; }",
  "function a() { const z = b(); return z; }",
  "const result = a();",
  "console.log('Result:', result);"
]

const steps: SimulatorStep[] = [
  {
    line: 5,
    caption: "Outcome 2: Call Stack Deep Dive. LIFO (Last-In, First-Out) frame mechanics.",
    callStack: [{ name: "global()", locals: { result: "undefined" } }],
    phase: "sync"
  },
  {
    line: 5,
    caption: "Line 5: Global script executes `a()`. A new Stack Frame for `a` is allocated.",
    callStack: [{ name: "global()" }, { name: "a()", locals: { z: "uninit" } }],
    phase: "sync"
  },
  {
    line: 4,
    caption: "Inside `a()` (Line 4): It immediately invokes `b()`. Stack grows 2 deep.",
    callStack: [{ name: "global()" }, { name: "a()", locals: { z: "waiting" } }, { name: "b()", locals: { y: "uninit" } }],
    phase: "sync"
  },
  {
    line: 3,
    caption: "Inside `b()` (Line 3): It invokes `c()`. Stack grows 3 deep.",
    callStack: [
      { name: "global()" },
      { name: "a()", locals: { z: "waiting" } },
      { name: "b()", locals: { y: "waiting" } },
      { name: "c()", locals: { x: "uninit" } }
    ],
    phase: "sync"
  },
  {
    line: 2,
    caption: "Inside `c()` (Line 2): It invokes `d()`. Stack reaches maximum depth: 4 frames!",
    callStack: [
      { name: "global()" },
      { name: "a()", locals: { z: "waiting" } },
      { name: "b()", locals: { y: "waiting" } },
      { name: "c()", locals: { x: "waiting" } },
      { name: "d()", locals: { ret: 4 } }
    ],
    phase: "sync"
  },
  {
    line: 1,
    caption: "Inside `d()` (Line 1): Evaluates `return 4`. Returns value 4 to the caller `c()`.",
    callStack: [
      { name: "global()" },
      { name: "a()" },
      { name: "b()" },
      { name: "c()" },
      { name: "d()", locals: { ret: 4 } }
    ],
    phase: "sync"
  },
  {
    line: 2,
    caption: "`d()` completes execution. Its stack frame is POPPED and deallocated.",
    callStack: [
      { name: "global()" },
      { name: "a()", locals: { z: "waiting" } },
      { name: "b()", locals: { y: "waiting" } },
      { name: "c()", locals: { x: 4 } }
    ],
    phase: "sync"
  },
  {
    line: 2,
    caption: "Back in `c()`: Computes `x + 1` = `4 + 1` = 5. Ready to return 5.",
    callStack: [
      { name: "global()" },
      { name: "a()", locals: { z: "waiting" } },
      { name: "b()", locals: { y: "waiting" } },
      { name: "c()", locals: { x: 4, ret: 5 } }
    ],
    phase: "sync"
  },
  {
    line: 3,
    caption: "`c()` returns 5. Its stack frame is POPPED and return pointer resumes `b()`.",
    callStack: [
      { name: "global()" },
      { name: "a()", locals: { z: "waiting" } },
      { name: "b()", locals: { y: 5 } }
    ],
    phase: "sync"
  },
  {
    line: 3,
    caption: "Back in `b()`: Computes `y * 2` = `5 * 2` = 10. Ready to return 10.",
    callStack: [
      { name: "global()" },
      { name: "a()", locals: { z: "waiting" } },
      { name: "b()", locals: { y: 5, ret: 10 } }
    ],
    phase: "sync"
  },
  {
    line: 4,
    caption: "`b()` returns 10. Its stack frame is POPPED and return pointer resumes `a()`.",
    callStack: [
      { name: "global()" },
      { name: "a()", locals: { z: 10 } }
    ],
    phase: "sync"
  },
  {
    line: 4,
    caption: "Back in `a()`: Receives 10 and executes `return z` (10).",
    callStack: [
      { name: "global()" },
      { name: "a()", locals: { z: 10, ret: 10 } }
    ],
    phase: "sync"
  },
  {
    line: 5,
    caption: "`a()` finishes. Its frame pops! Return value 10 assigned to `result`.",
    callStack: [{ name: "global()", locals: { result: 10 } }],
    phase: "sync"
  },
  {
    line: 6,
    caption: "Line 6: `console.log('Result:', 10)` pushed to Call Stack.",
    callStack: [{ name: "global()" }, { name: "console.log(...)" }],
    phase: "sync"
  },
  {
    line: 6,
    caption: "console.log writes output to stdout terminal.",
    callStack: [{ name: "global()" }],
    console: ["Result: 10"],
    phase: "sync"
  },
  {
    line: 6,
    caption: "Global script completes! The `global()` context pops off.",
    callStack: [],
    console: ["Result: 10"],
    loopQuestion: { isStackEmpty: true, decision: "STACK IDLE" },
    phase: "idle"
  },
  {
    line: 0,
    caption: "Key Lesson: Every function call allocates memory for arguments and local variables.",
    callStack: [],
    console: ["Result: 10"],
    phase: "idle"
  },
  {
    line: 0,
    caption: "Return address: The engine remembers exact bytecode instruction to resume in the caller.",
    callStack: [],
    console: ["Result: 10"],
    phase: "idle"
  },
  {
    line: 0,
    caption: "LIFO Property: The most recently called function is ALWAYS at the top and executes first.",
    callStack: [],
    console: ["Result: 10"],
    phase: "idle"
  },
  {
    line: 0,
    caption: "A caller CANNOT finish before its callee finishes.",
    callStack: [],
    console: ["Result: 10"],
    phase: "idle"
  },
  {
    line: 0,
    caption: "Synchronous execution is strictly depth-first in tree traversal.",
    callStack: [],
    console: ["Result: 10"],
    phase: "idle"
  },
  {
    line: 0,
    caption: "Notice: Neither Web APIs nor Macrotask Queues were touched on this slide.",
    callStack: [],
    console: ["Result: 10"],
    phase: "idle"
  },
  {
    line: 0,
    caption: "Pure synchronous computation stays 100% inside the V8 engine's Call Stack.",
    callStack: [],
    console: ["Result: 10"],
    phase: "idle"
  },
  {
    line: 0,
    caption: "Next: What happens to scope and variable environment inside these frames?",
    callStack: [],
    console: ["Result: 10"],
    phase: "idle"
  },
  {
    line: 0,
    caption: "Slide 6 Complete: You've mastered LIFO push/pop mechanics!",
    callStack: [],
    console: ["Result: 10"],
    phase: "idle"
  }
]
</script>

<div class="h-full">
  <RuntimeStage
    :steps="steps"
    :code="code"
    :step="$clicks"
    :slide-number="6"
    :total-slides="20"
    title="Slide 6: Nested Call Stack LIFO Execution"
    takeaway="The Call Stack is strictly LIFO: frames push on call and pop on return with their local state."
  />
</div>

<!--
SPEAKER NOTES:
[Click 0-4]: Watch the stack grow four levels deep: global -> a -> b -> c -> d.
[Click 5-12]: Watch the stack unwind in reverse order as return values flow back down the chain.
[Click 13-16]: Global context finishes and console.log prints 10.
[Click 17-24]: Summarize LIFO mechanics and return address pointers.
-->
