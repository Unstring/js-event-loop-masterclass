<!-- ========================================== -->
<!-- TOPIC 2 • SLIDE 1 OF 2: CODE & QUESTIONS    -->
<!-- ========================================== -->
<script setup lang="ts">
import SlLayout from '../components/SlLayout.vue'
import CodePanel from '../components/CodePanel.vue'
import QuestionCards from '../components/QuestionCards.vue'

const codeLines = [
  "function multiply(a, b) {",
  "  return a * b;",
  "}",
  "",
  "function square(n) {",
  "  return multiply(n, n);",
  "}",
  "",
  "function printSquare(x) {",
  "  const result = square(x);",
  "  console.log('Result:', result);",
  "}",
  "",
  "printSquare(4);"
]

const captions = [
  "Topic 2: The Call Stack & Event Loop — How function calls are structured in memory.",
  "Line 14: printSquare(4) is invoked — a stack frame is created and pushed to the Call Stack.",
  "Line 10: printSquare calls square(4) — another frame stacks directly on top.",
  "Line 6: square calls multiply(4, 4) — the stack reaches a depth of 3 active frames.",
  "Line 2: multiply calculates 16 and returns — frames unwind one by one (LIFO)."
]

const questions = [
  {
    type: 'WHAT' as const,
    q: "What is a Call Stack frame?",
    a: "A contiguous block of memory storing the function's arguments, local variables, and return address.",
    revealStep: 1
  },
  {
    type: 'HOW' as const,
    q: "How does LIFO (Last-In, First-Out) work?",
    a: "The most recently called function is pushed on top and must return before caller functions can resume.",
    revealStep: 2
  },
  {
    type: 'WHERE' as const,
    q: "Where does the Event Loop sit in this picture?",
    a: "The Event Loop continuously observes the Call Stack: while frames exist, it never interrupts.",
    revealStep: 3
  },
  {
    type: 'WHEN' as const,
    q: "When does stack overflow happen?",
    a: "When unbounded recursion pushes frames until the engine runs out of allocated stack memory!",
    revealStep: 4
  }
]
</script>

<SlLayout
  topic="The Call Stack & Event Loop Coordination"
  pair="Topic 2 • Slide 1/2"
  :step="$clicks"
  :captions="captions"
  phase="concept"
>
  <div class="slide-grid">
    <div class="col-left">
      <CodePanel
        title="call-stack-trace.js"
        :lines="codeLines"
        :active-line="$clicks === 1 ? 14 : ($clicks === 2 ? 10 : ($clicks === 3 ? 6 : ($clicks === 4 ? 2 : 0)))"
        :highlight-lines="$clicks === 1 ? [14] : ($clicks === 2 ? [9, 10] : ($clicks === 3 ? [5, 6] : ($clicks === 4 ? [1, 2] : [])))"
        tag="LIFO Stack"
      />
    </div>
    <div class="col-right">
      <QuestionCards
        :items="questions"
        :step="$clicks"
      />
    </div>
  </div>
</SlLayout>

<style scoped>
.slide-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  height: 100%;
  padding: 10px 14px;
  box-sizing: border-box;
}
.col-left, .col-right {
  height: 100%;
  overflow: hidden;
}
</style>

---

<!-- ========================================== -->
<!-- TOPIC 2 • SLIDE 2 OF 2: ENGINE SIMULATOR    -->
<!-- ========================================== -->
<script setup lang="ts">
import { computed } from 'vue'
import SlLayout from '../components/SlLayout.vue'
import CodePanel from '../components/CodePanel.vue'
import EngineVisualizer from '../components/EngineVisualizer.vue'

const codeLines = [
  "1: printSquare(4);",
  "2:   -> square(4);",
  "3:     -> multiply(4, 4);",
  "4:     <- returns 16;",
  "5:   <- returns 16;",
  "6: console.log('Result: 16');"
]

const captions = [
  "Simulator: Watch the Call Stack push & unwind while the Event Loop monitors execution.",
  "Step 1: printSquare(4) is called. Stack pushes printSquare.",
  "Step 2: square(4) is called. Stack pushes square.",
  "Step 3: multiply(4, 4) is called. Stack pushes multiply.",
  "Step 4: multiply computes 16 and returns. multiply() pops off!",
  "Step 5: square() returns 16. square() pops off!",
  "Step 6: console.log('Result: 16') executes and prints to terminal.",
  "Step 7: printSquare() finishes and pops off. Call Stack is 100% EMPTY. Event Loop is ready!"
]

const traceStates = [
  { stack: ['global()'], loopStatus: 'Call Stack active (global)', logs: [], line: 1 },
  { stack: ['global()', 'printSquare(4)'], loopStatus: 'Executing printSquare', logs: [], line: 1 },
  { stack: ['global()', 'printSquare(4)', 'square(4)'], loopStatus: 'Executing square', logs: [], line: 2 },
  { stack: ['global()', 'printSquare(4)', 'square(4)', 'multiply(4,4)'], loopStatus: 'Executing multiply', logs: [], line: 3 },
  { stack: ['global()', 'printSquare(4)', 'square(4)'], loopStatus: 'multiply returned 16', logs: [], line: 4 },
  { stack: ['global()', 'printSquare(4)'], loopStatus: 'square returned 16', logs: [], line: 5 },
  { stack: ['global()', 'printSquare(4)', 'console.log()'], loopStatus: 'Printing output', logs: ['Result: 16'], line: 6 },
  { stack: [], loopStatus: 'STACK EMPTY! Event Loop checking queues...', logs: ['Result: 16'], line: 6 }
]

function getState(step: number = 0) {
  const idx = Math.max(0, Math.min(step ?? 0, traceStates.length - 1))
  return traceStates[idx] || traceStates[0]
}
</script>

<SlLayout
  topic="Call Stack Unwinding & The Event Loop Tick"
  pair="Topic 2 • Slide 2/2"
  :step="$clicks"
  :captions="captions"
  phase="demo"
>
  <div class="slide-grid-engine">
    <div class="col-code-narrow">
      <CodePanel
        title="stack-trace.js"
        :lines="codeLines"
        :active-line="getState($clicks).line"
        tag="LIFO Execution"
      />
    </div>
    <div class="col-engine-wide">
      <EngineVisualizer
        :state="{
          stack: getState($clicks).stack,
          webApis: [],
          microtasks: [],
          macrotasks: [],
          logs: getState($clicks).logs,
          loopStatus: getState($clicks).loopStatus,
          activeComponent: getState($clicks).stack.length ? 'stack' : 'loop'
        }"
      />
    </div>
  </div>
</SlLayout>

<style scoped>
.slide-grid-engine {
  display: grid;
  grid-template-columns: 0.95fr 1.35fr;
  gap: 12px;
  height: 100%;
  padding: 10px 14px;
  box-sizing: border-box;
}
.col-code-narrow, .col-engine-wide {
  height: 100%;
  overflow: hidden;
}
</style>
