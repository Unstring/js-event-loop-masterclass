<!-- ========================================== -->
<!-- TOPIC 5 • SLIDE 1 OF 2: CODE & QUESTIONS    -->
<!-- ========================================== -->
<script setup lang="ts">
import SlLayout from '../components/SlLayout.vue'
import CodePanel from '../components/CodePanel.vue'
import QuestionCards from '../components/QuestionCards.vue'

const codeLines = [
  "console.log('1: Script Start');",
  "",
  "async function fetchData() {",
  "  console.log('2: Inside asyncFn (Sync)');",
  "  const res = await Promise.resolve('Data payload');",
  "  console.log('3: Resumed with:', res);",
  "}",
  "",
  "fetchData();",
  "",
  "console.log('4: Script End');"
]

const captions = [
  "Step 0: Engine loads script. Preparing to demystify Promises and async/await.",
  "Step 1: Line 1 executes: console.log('1: Script Start') pushed to Call Stack.",
  "Step 2: Log executes: '1: Script Start' printed. Frame pops from Call Stack.",
  "Step 3: Line 3-7: async function fetchData declared in memory heap.",
  "Step 4: Line 9: fetchData() invoked on Call Stack.",
  "Step 5: Misconception Busted: async functions do NOT run in the background!",
  "Step 6: Line 4 executes: console.log('2: Inside asyncFn (Sync)') runs synchronously.",
  "Step 7: Log executes: '2: Inside asyncFn (Sync)' printed to console terminal.",
  "Step 8: Line 5: Promise.resolve('Data payload') evaluated — resolves instantly in Heap.",
  "Step 9: Line 5: 'await' reached! What does await actually do under the hood?",
  "Step 10: WHAT Question: An async function runs synchronously until the first 'await'!",
  "Step 11: Engine creates a microtask for the continuation of fetchData.",
  "Step 12: fetchData() pauses its local execution context and yields the Call Stack.",
  "Step 13: HOW Question: await converts everything below into a hidden .then() reaction!",
  "Step 14: Call Stack is returned to caller — execution resumes at line 11!",
  "Step 15: Line 11: console.log('4: Script End') executes synchronously.",
  "Step 16: Log executes: '4: Script End' printed to console terminal.",
  "Step 17: WHERE Question: Paused generator state machine lives in Engine Heap.",
  "Step 18: Synchronous code finished! Call Stack reaches depth 0.",
  "Step 19: WHEN Question: Awaited Promise resolved -> continuation enqueued to Microtasks!",
  "Step 20: Event Loop runs microtask: res = 'Data payload' -> prints '3: Resumed with: Data payload'!"
]

const questions = [
  {
    type: 'WHAT' as const,
    q: "What actually happens when an async function is called?",
    a: "It executes SYNCHRONOUSLY until the first 'await'! It does not automatically run in background.",
    revealStep: 10,
    pinpoint: "Synchronous preamble: Lines before await run immediately on Call Stack"
  },
  {
    type: 'HOW' as const,
    q: "How does 'await' pause without freezing the thread?",
    a: "It converts everything below the 'await' into a hidden .then() microtask callback and yields the stack.",
    revealStep: 13,
    pinpoint: "await expr; code... <=> Promise.resolve(expr).then(() => { code... })"
  },
  {
    type: 'WHERE' as const,
    q: "Where does the paused function context live?",
    a: "Suspended in the Engine Heap as a generator/coroutine state machine until the Promise settles.",
    revealStep: 17,
    pinpoint: "Heap coroutine frame preserves local scope variables across turns"
  },
  {
    type: 'WHEN' as const,
    q: "When does the code after await resume?",
    a: "As soon as the awaited Promise settles, its continuation is enqueued to the VIP Microtask Queue!",
    revealStep: 19,
    pinpoint: "Resumes on the NEXT microtask drain cycle after resolution"
  }
]

const lineMap = [0, 1, 1, 3, 9, 9, 4, 4, 5, 5, 5, 5, 5, 5, 9, 11, 11, 11, 11, 6, 6]
function getLine(step: number = 0) {
  const idx = Math.max(0, Math.min(step ?? 0, lineMap.length - 1))
  return lineMap[idx]
}
</script>

<SlLayout
  topic="Promises & async/await Execution Anatomy"
  pair="Topic 5 • Slide 1/2"
  :step="$clicks"
  :captions="captions"
  phase="concept"
>
  <div class="slide-grid">
    <div class="col-left">
      <CodePanel
        title="async-await.js"
        :lines="codeLines"
        :active-line="getLine($clicks)"
        :highlight-lines="$clicks >= 8 && $clicks <= 14 ? [4, 5] : []"
        tag="async / await"
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
<!-- TOPIC 5 • SLIDE 2 OF 2: ASYNC STEPPER       -->
<!-- ========================================== -->
<script setup lang="ts">
import SlLayout from '../components/SlLayout.vue'
import CodePanel from '../components/CodePanel.vue'
import EngineVisualizer from '../components/EngineVisualizer.vue'

const codeLines = [
  "console.log('1: Start');",
  "async function run() {",
  "  console.log('2: In Async');",
  "  await Promise.resolve();",
  "  console.log('3: After Await');",
  "}",
  "run();",
  "console.log('4: End');"
]

const captions = [
  "Step 0: Initializing async/await execution trace.",
  "Step 1: Line 1: console.log('1: Start') pushes to Call Stack.",
  "Step 2: Log executes: '1: Start' printed to terminal. Frame pops.",
  "Step 3: Line 2-6: async function run() registered in memory.",
  "Step 4: Line 7: run() invoked! Call Stack pushes run() frame.",
  "Step 5: Line 3 executes synchronously inside run(): console.log('2: In Async').",
  "Step 6: Log executes: '2: In Async' printed to terminal. Frame pops.",
  "Step 7: Line 4: await Promise.resolve() encountered.",
  "Step 8: Promise.resolve() resolves immediately with undefined.",
  "Step 9: await schedules the remainder of run() into MICROTASK QUEUE.",
  "Step 10: run() context suspended. Returns pending Promise to caller.",
  "Step 11: Call Stack POPS run() frame! Control returns to top-level script.",
  "Step 12: Line 8: console.log('4: End') pushes to Call Stack.",
  "Step 13: Log executes: '4: End' printed to terminal. Frame pops.",
  "Step 14: Synchronous script 100% COMPLETE! Call Stack is now empty.",
  "Step 15: Event Loop wakes up: Call Stack is empty! Checks Microtask Queue.",
  "Step 16: Microtask found: [resume run()]. Dequeued to Call Stack!",
  "Step 17: run() resumes execution context from where it paused (line 5).",
  "Step 18: Line 5: console.log('3: After Await') executes on Call Stack.",
  "Step 19: Log executes: '3: After Await' printed to terminal!",
  "Step 20: run() finishes execution, resolves its outer Promise, and pops.",
  "Step 21: All microtasks complete. Output verified: 1 -> 2 -> 4 -> 3!"
]

const traceStates = [
  { stack: ['global()'], micro: [], logs: [], loop: 'Script Starting', phase: 'stack' as const, line: 0, rule: 'Global scope ready' },
  { stack: ['global()', 'console.log("1: Start")'], micro: [], logs: [], loop: 'Executing sync log 1', phase: 'stack' as const, line: 1, rule: 'Sync log 1' },
  { stack: ['global()'], micro: [], logs: ['1: Start'], loop: 'Log 1 popped', phase: 'console' as const, line: 1, rule: 'Stdout: 1: Start' },
  { stack: ['global()'], micro: [], logs: ['1: Start'], loop: 'run() declared', phase: 'stack' as const, line: 2, rule: 'Function stored in Heap' },
  { stack: ['global()', 'run()'], micro: [], logs: ['1: Start'], loop: 'run() called', phase: 'stack' as const, line: 7, rule: 'Push frame: run()' },
  { stack: ['global()', 'run()', 'console.log("2: In Async")'], micro: [], logs: ['1: Start'], loop: 'Synchronous log inside asyncFn', phase: 'stack' as const, line: 3, rule: 'Sync preamble running' },
  { stack: ['global()', 'run()'], micro: [], logs: ['1: Start', '2: In Async'], loop: 'Log 2 printed', phase: 'console' as const, line: 3, rule: 'Stdout: 2: In Async' },
  { stack: ['global()', 'run()', 'Promise.resolve()'], micro: [], logs: ['1: Start', '2: In Async'], loop: 'Evaluating Promise.resolve()', phase: 'stack' as const, line: 4, rule: 'Promise settled in Heap' },
  { stack: ['global()', 'run()'], micro: [], logs: ['1: Start', '2: In Async'], loop: 'Promise resolved -> await creates microtask', phase: 'stack' as const, line: 4, rule: 'Continuation prepared' },
  { stack: ['global()', 'run()'], micro: ['resume run() [Microtask]'], logs: ['1: Start', '2: In Async'], loop: 'Enqueued to VIP Microtasks', phase: 'micro' as const, line: 4, rule: 'Continuation buffered in Microtasks' },
  { stack: ['global()', 'run()'], micro: ['resume run() [Microtask]'], logs: ['1: Start', '2: In Async'], loop: 'run() yielded Call Stack', phase: 'stack' as const, line: 4, rule: 'Returning pending Promise' },
  { stack: ['global()'], micro: ['resume run() [Microtask]'], logs: ['1: Start', '2: In Async'], loop: 'run() popped from Call Stack', phase: 'stack' as const, line: 7, rule: 'Caller resumes control' },
  { stack: ['global()', 'console.log("4: End")'], micro: ['resume run() [Microtask]'], logs: ['1: Start', '2: In Async'], loop: 'Executing sync log 4', phase: 'stack' as const, line: 8, rule: 'Top-level synchronous code' },
  { stack: ['global()', 'console.log("4: End")'], micro: ['resume run() [Microtask]'], logs: ['1: Start', '2: In Async', '4: End'], loop: 'Log 4 printed', phase: 'console' as const, line: 8, rule: 'Stdout: 4: End' },
  { stack: ['global()'], micro: ['resume run() [Microtask]'], logs: ['1: Start', '2: In Async', '4: End'], loop: 'Sync script finished', phase: 'stack' as const, line: 8, rule: 'Stack preparing to empty' },
  { stack: [], micro: ['resume run() [Microtask]'], logs: ['1: Start', '2: In Async', '4: End'], loop: 'STACK EMPTY! Checking Microtasks...', phase: 'loop' as const, line: 8, rule: 'Pre-condition satisfied: Stack == 0' },
  { stack: [], micro: ['resume run() [Microtask]'], logs: ['1: Start', '2: In Async', '4: End'], loop: 'Dequeuing microtask to Call Stack', phase: 'micro' as const, line: 5, rule: 'Event Loop dispatches microtask' },
  { stack: ['run() [resumed]'], micro: [], logs: ['1: Start', '2: In Async', '4: End'], loop: 'run() context resumed on Call Stack', phase: 'stack' as const, line: 5, rule: 'Push frame: run() [resumed]' },
  { stack: ['run() [resumed]', 'console.log("3: After Await")'], micro: [], logs: ['1: Start', '2: In Async', '4: End'], loop: 'Executing post-await code', phase: 'stack' as const, line: 5, rule: 'Running statement after await' },
  { stack: ['run() [resumed]'], micro: [], logs: ['1: Start', '2: In Async', '4: End', '3: After Await'], loop: 'Stdout printed: 3: After Await', phase: 'console' as const, line: 5, rule: 'Stdout flushed' },
  { stack: [], micro: [], logs: ['1: Start', '2: In Async', '4: End', '3: After Await'], loop: 'run() complete. Stack empty!', phase: 'stack' as const, line: 6, rule: 'Outer Promise fulfilled' },
  { stack: [], micro: [], logs: ['1: Start', '2: In Async', '4: End', '3: After Await'], loop: 'Cycle complete! Output: 1, 2, 4, 3', phase: 'idle' as const, line: 6, rule: 'Zero thread blocking achieved!' }
]

function getState(step: number = 0) {
  const idx = Math.max(0, Math.min(step ?? 0, traceStates.length - 1))
  return traceStates[idx] || traceStates[0]
}
</script>

<SlLayout
  topic="async/await Suspension & Resumption: 22-Step Trace"
  pair="Topic 5 • Slide 2/2"
  :step="$clicks"
  :captions="captions"
  phase="demo"
>
  <div class="slide-grid-sim">
    <div class="col-code">
      <CodePanel
        title="async-await-trace.js"
        :lines="codeLines"
        :active-line="getState($clicks).line"
        tag="Coroutine Trace"
      />
    </div>
    <div class="col-engine">
      <EngineVisualizer
        :state="{
          stack: getState($clicks).stack,
          webApis: [],
          microtasks: getState($clicks).micro,
          macrotasks: [],
          logs: getState($clicks).logs,
          loopStatus: getState($clicks).loop,
          loopPhase: getState($clicks).phase,
          pinpointRule: getState($clicks).rule,
          activeComponent: getState($clicks).phase === 'console' ? 'console' : (getState($clicks).phase === 'micro' ? 'micro' : (getState($clicks).phase === 'loop' ? 'loop' : 'stack'))
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
