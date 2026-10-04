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
  "  console.log('Result is:', result);",
  "}",
  "",
  "printSquare(4);"
]

const captions = [
  "Step 0: Engine initializes execution. Call Stack contains the global execution context.",
  "Step 1: Lines 1-3: multiply function declared and stored in Memory Heap.",
  "Step 2: Lines 5-7: square function declared and stored in Memory Heap.",
  "Step 3: Lines 9-12: printSquare function declared and stored in Memory Heap.",
  "Step 4: Line 14: printSquare(4) invoked — pushing new frame to Call Stack.",
  "Step 5: Inside printSquare(4): parameter x initialized to 4 in local scope.",
  "Step 6: Line 10: printSquare calls square(x) with argument 4.",
  "Step 7: Stack pushes square(4) directly on top of printSquare(4).",
  "Step 8: Line 6: square calls multiply(n, n) -> multiply(4, 4).",
  "Step 9: Stack pushes multiply(4, 4) on top — Call Stack depth is now 3!",
  "Step 10: WHAT Question: A stack frame stores arguments, locals, and return pointer.",
  "Step 11: Line 2: multiply calculates 4 * 4 = 16 and returns value 16.",
  "Step 12: HOW Question: LIFO rule — top frame pops first and returns control to caller.",
  "Step 13: multiply(4, 4) pops off! square(4) receives return value 16.",
  "Step 14: square(4) finishes and returns 16 to printSquare.",
  "Step 15: square(4) pops off! Call Stack depth returns to 1 (printSquare).",
  "Step 16: WHERE Question: Event Loop sits outside the V8 engine, watching stack depth.",
  "Step 17: Line 11: console.log('Result is:', 16) pushes and prints to terminal.",
  "Step 18: console.log pops! printSquare(4) has no more statements and pops.",
  "Step 19: WHEN Question: Stack reaches 0 -> Event Loop can now check task queues!",
  "Step 20: Execution finished cleanly. Zero memory leaks, zero stack overflow."
]

const questions = [
  {
    type: 'WHAT' as const,
    q: "What is a Call Stack frame?",
    a: "A contiguous memory record holding function arguments, local variables, and the return address.",
    revealStep: 10,
    pinpoint: "Stack Frame = Memory context of 1 function invocation"
  },
  {
    type: 'HOW' as const,
    q: "How does LIFO (Last-In, First-Out) work?",
    a: "The most recently pushed function must complete and pop before caller functions can resume.",
    revealStep: 12,
    pinpoint: "LIFO: Caller waits until child function returns"
  },
  {
    type: 'WHERE' as const,
    q: "Where does the Event Loop sit?",
    a: "The Event Loop is a coordination loop in the host environment (browser / Node.js runtime).",
    revealStep: 16,
    pinpoint: "Event Loop continuously polls: 'Is Stack empty?'"
  },
  {
    type: 'WHEN' as const,
    q: "When does the Event Loop dispatch tasks?",
    a: "ONLY when the Call Stack reaches depth 0! It never interrupts active synchronous functions.",
    revealStep: 19,
    pinpoint: "Non-preemptive: JS functions cannot be paused by Event Loop"
  }
]

const lineMap = [0, 1, 5, 9, 14, 9, 10, 10, 6, 6, 6, 2, 2, 6, 7, 10, 10, 11, 12, 14, 14]
function getLine(step: number = 0) {
  const idx = Math.max(0, Math.min(step ?? 0, lineMap.length - 1))
  return lineMap[idx]
}
</script>

<SlLayout
  topic="The Call Stack & Event Loop: Mechanics"
  pair="Topic 2 • Slide 1/2"
  :step="$clicks"
  :captions="captions"
  phase="concept"
>
  <div class="slide-grid">
    <div class="col-left">
      <CodePanel
        title="nested-stack.js"
        :lines="codeLines"
        :active-line="getLine($clicks)"
        :highlight-lines="$clicks >= 8 && $clicks <= 13 ? [5, 6, 7] : []"
        tag="Call Stack"
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
import SlLayout from '../components/SlLayout.vue'
import CodePanel from '../components/CodePanel.vue'
import EngineVisualizer from '../components/EngineVisualizer.vue'

const codeLines = [
  "function multiply(a, b) { return a * b; }",
  "function square(n) { return multiply(n, n); }",
  "function printSquare(x) {",
  "  const res = square(x);",
  "  console.log('Square:', res);",
  "}",
  "printSquare(4);"
]

const captions = [
  "Step 0: Engine starts execution. Call Stack is ready.",
  "Step 1: Line 7: printSquare(4) called. Stack pushes printSquare(4).",
  "Step 2: Inside printSquare: local variable x = 4 initialized.",
  "Step 3: Line 4: square(x) invoked with argument 4.",
  "Step 4: Stack pushes square(4) on top of printSquare.",
  "Step 5: Line 2: inside square(4), parameter n = 4.",
  "Step 6: Line 2: square calls multiply(4, 4).",
  "Step 7: Stack pushes multiply(4, 4) — Stack depth reaches maximum (3 frames).",
  "Step 8: Line 1: inside multiply, evaluating 4 * 4.",
  "Step 9: multiply computes 16 and executes return statement.",
  "Step 10: multiply(4, 4) pops off the Call Stack! Returned: 16.",
  "Step 11: square(4) receives return value 16.",
  "Step 12: square(4) executes return statement with 16.",
  "Step 13: square(4) pops off the Call Stack! Returned: 16.",
  "Step 14: printSquare receives 16, stores into const res = 16.",
  "Step 15: Line 5: console.log('Square:', 16) invoked on Call Stack.",
  "Step 16: Console prints: 'Square: 16' to stdout!",
  "Step 17: console.log pops off the Call Stack.",
  "Step 18: printSquare reaches end of function body and pops off stack.",
  "Step 19: Call Stack is 100% EMPTY! (Depth = 0).",
  "Step 20: Event Loop executes tick: confirms stack is empty, ready for async tasks!"
]

const traceStates = [
  { stack: ['global()'], logs: [], loop: 'Global context', phase: 'stack' as const, line: 0, rule: 'Base context loaded' },
  { stack: ['global()', 'printSquare(4)'], logs: [], loop: 'printSquare called', phase: 'stack' as const, line: 7, rule: 'Push frame: printSquare(4)' },
  { stack: ['global()', 'printSquare(4)'], logs: [], loop: 'x = 4 in local scope', phase: 'stack' as const, line: 3, rule: 'Scope initialized' },
  { stack: ['global()', 'printSquare(4)'], logs: [], loop: 'Calling square(4)', phase: 'stack' as const, line: 4, rule: 'Evaluating argument' },
  { stack: ['global()', 'printSquare(4)', 'square(4)'], logs: [], loop: 'square pushed', phase: 'stack' as const, line: 4, rule: 'Push frame: square(4)' },
  { stack: ['global()', 'printSquare(4)', 'square(4)'], logs: [], loop: 'n = 4 in local scope', phase: 'stack' as const, line: 2, rule: 'Scope initialized' },
  { stack: ['global()', 'printSquare(4)', 'square(4)'], logs: [], loop: 'Calling multiply(4, 4)', phase: 'stack' as const, line: 2, rule: 'Evaluating args' },
  { stack: ['global()', 'printSquare(4)', 'square(4)', 'multiply(4,4)'], logs: [], loop: 'multiply pushed (Depth 3)', phase: 'stack' as const, line: 1, rule: 'Max Call Stack depth' },
  { stack: ['global()', 'printSquare(4)', 'square(4)', 'multiply(4,4)'], logs: [], loop: 'Computing 4 * 4', phase: 'stack' as const, line: 1, rule: 'ALU multiplication' },
  { stack: ['global()', 'printSquare(4)', 'square(4)', 'multiply(4,4)'], logs: [], loop: 'Returning 16', phase: 'stack' as const, line: 1, rule: 'Return opcode' },
  { stack: ['global()', 'printSquare(4)', 'square(4)'], logs: [], loop: 'multiply popped (ret: 16)', phase: 'stack' as const, line: 2, rule: 'Pop frame: multiply' },
  { stack: ['global()', 'printSquare(4)', 'square(4)'], logs: [], loop: 'square received 16', phase: 'stack' as const, line: 2, rule: 'Resuming square' },
  { stack: ['global()', 'printSquare(4)', 'square(4)'], logs: [], loop: 'square returning 16', phase: 'stack' as const, line: 2, rule: 'Return opcode' },
  { stack: ['global()', 'printSquare(4)'], logs: [], loop: 'square popped (ret: 16)', phase: 'stack' as const, line: 4, rule: 'Pop frame: square' },
  { stack: ['global()', 'printSquare(4)'], logs: [], loop: 'res = 16 stored', phase: 'stack' as const, line: 4, rule: 'Variable assignment' },
  { stack: ['global()', 'printSquare(4)', 'console.log()'], logs: [], loop: 'console.log called', phase: 'stack' as const, line: 5, rule: 'Push frame: console.log' },
  { stack: ['global()', 'printSquare(4)', 'console.log()'], logs: ['Square: 16'], loop: 'Stdout printed', phase: 'console' as const, line: 5, rule: 'Stdout flushed' },
  { stack: ['global()', 'printSquare(4)'], logs: ['Square: 16'], loop: 'console.log popped', phase: 'stack' as const, line: 5, rule: 'Pop frame: console.log' },
  { stack: ['global()'], logs: ['Square: 16'], loop: 'printSquare finished & popped', phase: 'stack' as const, line: 7, rule: 'Pop frame: printSquare' },
  { stack: [], logs: ['Square: 16'], loop: 'STACK EMPTY! Depth = 0', phase: 'loop' as const, line: 7, rule: 'All frames unstacked' },
  { stack: [], logs: ['Square: 16'], loop: 'Event Loop ready for tasks', phase: 'idle' as const, line: 7, rule: 'Event loop tick: 0 tasks pending' }
]

function getState(step: number = 0) {
  const idx = Math.max(0, Math.min(step ?? 0, traceStates.length - 1))
  return traceStates[idx] || traceStates[0]
}
</script>

<SlLayout
  topic="Call Stack Unwinding: 21-Step Visual Stepper"
  pair="Topic 2 • Slide 2/2"
  :step="$clicks"
  :captions="captions"
  phase="demo"
>
  <div class="slide-grid-sim">
    <div class="col-code">
      <CodePanel
        title="stack-unwind.js"
        :lines="codeLines"
        :active-line="getState($clicks).line"
        tag="LIFO Engine"
      />
    </div>
    <div class="col-engine">
      <EngineVisualizer
        :state="{
          stack: getState($clicks).stack,
          webApis: [],
          microtasks: [],
          macrotasks: [],
          logs: getState($clicks).logs,
          loopStatus: getState($clicks).loop,
          loopPhase: getState($clicks).phase,
          pinpointRule: getState($clicks).rule,
          activeComponent: getState($clicks).phase === 'console' ? 'console' : (getState($clicks).phase === 'loop' ? 'loop' : 'stack')
        }"
      />
    </div>
  </div>
</SlLayout>

<style scoped>
.slide-grid-sim {
  display: grid;
  grid-template-columns: 0.95fr 1.35fr;
  gap: 12px;
  height: 100%;
  padding: 10px 14px;
  box-sizing: border-box;
}
.col-code, .col-engine {
  height: 100%;
  overflow: hidden;
}
</style>
