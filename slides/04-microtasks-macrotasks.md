<!-- ========================================== -->
<!-- TOPIC 4 • SLIDE 1 OF 2: CODE & QUESTIONS    -->
<!-- ========================================== -->
<script setup lang="ts">
import SlLayout from '../components/SlLayout.vue'
import CodePanel from '../components/CodePanel.vue'
import QuestionCards from '../components/QuestionCards.vue'

const codeLines = [
  "console.log('1: Sync');",
  "",
  "setTimeout(() => {",
  "  console.log('2: Macrotask (setTimeout 0ms)');",
  "}, 0);",
  "",
  "Promise.resolve().then(() => {",
  "  console.log('3: Microtask (Promise)');",
  "});",
  "",
  "console.log('4: Sync');"
]

const captions = [
  "Step 0: Engine loads script. Two distinct asynchronous queues are ready.",
  "Step 1: Line 1 executes: console.log('1: Sync') pushed to Call Stack.",
  "Step 2: Log executes: '1: Sync' printed. Call Stack pops frame.",
  "Step 3: Line 3 executes: setTimeout(cb, 0) pushed to Call Stack.",
  "Step 4: Engine registers 0ms timer in Web APIs. setTimeout pops immediately.",
  "Step 5: 0ms timer expires immediately on background thread.",
  "Step 6: Web API places callback into MACROTASK QUEUE (Regular Lane).",
  "Step 7: Line 7 executes: Promise.resolve() returns resolved Promise in Heap.",
  "Step 8: Line 7: .then(cb) registers reaction callback.",
  "Step 9: Engine immediately pushes callback into MICROTASK QUEUE (VIP Lane)!",
  "Step 10: WHAT Question: Microtasks = Promises/queueMicrotask; Macrotasks = timers/I/O.",
  "Step 11: Line 11 executes: console.log('4: Sync') pushed to Call Stack.",
  "Step 12: Log executes: '4: Sync' printed to console terminal.",
  "Step 13: HOW Question: Microtasks have absolute priority over Macrotasks!",
  "Step 14: Synchronous code finishes! Call Stack is now 100% EMPTY.",
  "Step 15: WHERE Question: Queues are separate FIFO buffers in the host runtime.",
  "Step 16: Event Loop checks: Stack is empty! Checks VIP Microtask Queue FIRST.",
  "Step 17: Microtask callback pushed to Call Stack: prints '3: Microtask (Promise)'.",
  "Step 18: Microtask queue depth reaches 0! Event Loop now turns to Macrotask queue.",
  "Step 19: WHEN Question: Macrotask runs only after microtask queue is fully drained!",
  "Step 20: Macrotask callback runs: prints '2: Macrotask (setTimeout 0ms)'! Done!"
]

const questions = [
  {
    type: 'WHAT' as const,
    q: "What belongs to Microtasks vs Macrotasks?",
    a: "Microtasks: Promises, queueMicrotask, MutationObserver. Macrotasks: setTimeout, setInterval, setImmediate, I/O.",
    revealStep: 10,
    pinpoint: "Microtasks = JS spec async; Macrotasks = Host environment tasks"
  },
  {
    type: 'HOW' as const,
    q: "How does the Event Loop prioritize between them?",
    a: "Microtasks have absolute priority! The entire microtask queue must be 100% drained before running 1 macrotask.",
    revealStep: 13,
    pinpoint: "Priority Rule: Microtask Queue must reach 0 before next Macrotask"
  },
  {
    type: 'WHERE' as const,
    q: "Where do these queues live in the runtime?",
    a: "They are separate FIFO queues managed by the Event Loop coordination algorithm in the host environment.",
    revealStep: 15,
    pinpoint: "Microtask Queue (VIP Lane) vs Macrotask Queue (Regular Lane)"
  },
  {
    type: 'WHEN' as const,
    q: "When does 'Microtask Starvation' occur?",
    a: "If a microtask continuously schedules another microtask, macrotasks and screen paints NEVER run!",
    revealStep: 19,
    pinpoint: "Starvation: Recursive queueMicrotask freezes timers and UI"
  }
]

const lineMap = [0, 1, 1, 3, 3, 5, 5, 7, 7, 7, 7, 11, 11, 11, 11, 11, 8, 8, 8, 4, 4]
function getLine(step: number = 0) {
  const idx = Math.max(0, Math.min(step ?? 0, lineMap.length - 1))
  return lineMap[idx]
}
</script>

<SlLayout
  topic="Microtasks vs Macrotasks: Priority Architecture"
  pair="Topic 4 • Slide 1/2"
  :step="$clicks"
  :captions="captions"
  phase="concept"
>
  <div class="slide-grid">
    <div class="col-left">
      <CodePanel
        title="queue-priority.js"
        :lines="codeLines"
        :active-line="getLine($clicks)"
        :highlight-lines="$clicks >= 7 && $clicks <= 9 ? [7, 8, 9] : ($clicks >= 3 && $clicks <= 6 ? [3, 4, 5] : [])"
        tag="Two Queues"
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
<!-- TOPIC 4 • SLIDE 2 OF 2: QUEUE SIMULATOR     -->
<!-- ========================================== -->
<script setup lang="ts">
import SlLayout from '../components/SlLayout.vue'
import CodePanel from '../components/CodePanel.vue'
import EngineVisualizer from '../components/EngineVisualizer.vue'

const codeLines = [
  "console.log('1: Sync');",
  "setTimeout(() => console.log('2: Macro (0ms)'), 0);",
  "Promise.resolve().then(() => console.log('3: Micro'));",
  "console.log('4: Sync');"
]

const captions = [
  "Step 0: Initializing two-queue Event Loop simulation.",
  "Step 1: Line 1: console.log('1: Sync') pushes to Call Stack.",
  "Step 2: Log executes: '1: Sync' printed. Frame pops from stack.",
  "Step 3: Line 2: setTimeout(cb, 0) pushes to Call Stack.",
  "Step 4: Web API registers 0ms timer. Timer fires immediately in background!",
  "Step 5: Web API enqueues callback into MACROTASK QUEUE: [setTimeout(0ms)].",
  "Step 6: setTimeout() pops off the Call Stack. Line 2 finished.",
  "Step 7: Line 3: Promise.resolve().then(cb) executes on Call Stack.",
  "Step 8: Promise reaction callback enqueued into MICROTASK QUEUE: [Promise.then].",
  "Step 9: Promise.then pops off Call Stack. Line 3 finished.",
  "Step 10: Line 4: console.log('4: Sync') pushes to Call Stack.",
  "Step 11: Log executes: '4: Sync' printed to console terminal.",
  "Step 12: console.log pops from stack. All synchronous code finished!",
  "Step 13: Call Stack is 100% EMPTY! Event Loop initiates queue inspection.",
  "Step 14: Event Loop Rule: Check Microtask Queue first (VIP priority).",
  "Step 15: Microtask found! Dequeued from Microtask Queue to Call Stack.",
  "Step 16: Microtask callback active: console.log('3: Micro') executes.",
  "Step 17: Console prints: '3: Micro'. Microtask frame pops off stack.",
  "Step 18: Microtask Queue depth is now 0 (completely drained!).",
  "Step 19: Event Loop now moves to Macrotask Queue: [setTimeout(0ms)] dequeued!",
  "Step 20: Macrotask callback active: prints '2: Macro (0ms)'.",
  "Step 21: Stack and all queues empty. Order verified: 1 -> 4 -> 3 -> 2!"
]

const traceStates = [
  { stack: ['global()'], micro: [], macro: [], logs: [], loop: 'Script Starting', phase: 'stack' as const, line: 0, rule: 'Global scope ready' },
  { stack: ['global()', 'console.log("1: Sync")'], micro: [], macro: [], logs: [], loop: 'Executing sync log 1', phase: 'stack' as const, line: 1, rule: 'Sync log 1' },
  { stack: ['global()'], micro: [], macro: [], logs: ['1: Sync'], loop: 'Log 1 popped', phase: 'console' as const, line: 1, rule: 'Stdout: 1: Sync' },
  { stack: ['global()', 'setTimeout(cb, 0)'], micro: [], macro: [], logs: ['1: Sync'], loop: 'Calling Web API', phase: 'stack' as const, line: 2, rule: 'setTimeout called' },
  { stack: ['global()', 'setTimeout(cb, 0)'], micro: [], macro: [], logs: ['1: Sync'], loop: '0ms timer fired', phase: 'webapi' as const, line: 2, rule: 'Timer fired instantly' },
  { stack: ['global()', 'setTimeout(cb, 0)'], micro: [], macro: ['setTimeout(cb, 0ms)'], logs: ['1: Sync'], loop: 'Enqueued to Macrotasks', phase: 'macro' as const, line: 2, rule: 'Buffered in Macrotask queue' },
  { stack: ['global()'], micro: [], macro: ['setTimeout(cb, 0ms)'], logs: ['1: Sync'], loop: 'setTimeout popped from stack', phase: 'stack' as const, line: 3, rule: 'Stack returned' },
  { stack: ['global()', 'Promise.then()'], micro: [], macro: ['setTimeout(cb, 0ms)'], logs: ['1: Sync'], loop: 'Calling Promise.then', phase: 'stack' as const, line: 3, rule: 'Registering microtask' },
  { stack: ['global()', 'Promise.then()'], micro: ['Promise.then(cb)'], macro: ['setTimeout(cb, 0ms)'], logs: ['1: Sync'], loop: 'VIP Microtask Enqueued!', phase: 'micro' as const, line: 3, rule: 'Enqueued to VIP Microtask queue' },
  { stack: ['global()'], micro: ['Promise.then(cb)'], macro: ['setTimeout(cb, 0ms)'], logs: ['1: Sync'], loop: 'Promise.then popped', phase: 'stack' as const, line: 4, rule: 'Stack returned' },
  { stack: ['global()', 'console.log("4: Sync")'], micro: ['Promise.then(cb)'], macro: ['setTimeout(cb, 0ms)'], logs: ['1: Sync'], loop: 'Executing sync log 4', phase: 'stack' as const, line: 4, rule: 'Sync log 4' },
  { stack: ['global()', 'console.log("4: Sync")'], micro: ['Promise.then(cb)'], macro: ['setTimeout(cb, 0ms)'], logs: ['1: Sync', '4: Sync'], loop: 'Log 4 printed', phase: 'console' as const, line: 4, rule: 'Stdout: 4: Sync' },
  { stack: ['global()'], micro: ['Promise.then(cb)'], macro: ['setTimeout(cb, 0ms)'], logs: ['1: Sync', '4: Sync'], loop: 'Sync script finished', phase: 'stack' as const, line: 4, rule: 'Stack preparing to empty' },
  { stack: [], micro: ['Promise.then(cb)'], macro: ['setTimeout(cb, 0ms)'], logs: ['1: Sync', '4: Sync'], loop: 'STACK EMPTY! Checking queues...', phase: 'loop' as const, line: 4, rule: 'Pre-condition satisfied: Stack == 0' },
  { stack: [], micro: ['Promise.then(cb)'], macro: ['setTimeout(cb, 0ms)'], logs: ['1: Sync', '4: Sync'], loop: 'Checking Microtask Queue first', phase: 'micro' as const, line: 3, rule: 'VIP Lane: Microtasks take priority' },
  { stack: ['Promise callback()'], micro: [], macro: ['setTimeout(cb, 0ms)'], logs: ['1: Sync', '4: Sync'], loop: 'Microtask pushed to Call Stack', phase: 'stack' as const, line: 3, rule: 'Push frame: Promise callback' },
  { stack: ['Promise callback()', 'console.log("3: Micro")'], micro: [], macro: ['setTimeout(cb, 0ms)'], logs: ['1: Sync', '4: Sync'], loop: 'Executing microtask body', phase: 'stack' as const, line: 3, rule: 'Running microtask' },
  { stack: ['Promise callback()'], micro: [], macro: ['setTimeout(cb, 0ms)'], logs: ['1: Sync', '4: Sync', '3: Micro'], loop: 'Stdout: 3: Micro printed', phase: 'console' as const, line: 3, rule: 'Stdout flushed' },
  { stack: [], micro: [], macro: ['setTimeout(cb, 0ms)'], logs: ['1: Sync', '4: Sync', '3: Micro'], loop: 'Microtasks fully drained (Depth 0)', phase: 'loop' as const, line: 2, rule: 'Microtasks empty -> now check macrotasks' },
  { stack: ['setTimeout callback()'], micro: [], macro: [], logs: ['1: Sync', '4: Sync', '3: Micro'], loop: 'Macrotask dequeued to Stack', phase: 'stack' as const, line: 2, rule: 'Push frame: setTimeout callback' },
  { stack: ['setTimeout callback()'], micro: [], macro: [], logs: ['1: Sync', '4: Sync', '3: Micro', '2: Macro (0ms)'], loop: 'Stdout: 2: Macro printed', phase: 'console' as const, line: 2, rule: 'Stdout flushed' },
  { stack: [], micro: [], macro: [], logs: ['1: Sync', '4: Sync', '3: Micro', '2: Macro (0ms)'], loop: 'Cycle complete! Output: 1, 4, 3, 2', phase: 'idle' as const, line: 2, rule: 'Complete cycle executed successfully!' }
]

function getState(step: number = 0) {
  const idx = Math.max(0, Math.min(step ?? 0, traceStates.length - 1))
  return traceStates[idx] || traceStates[0]
}
</script>

<SlLayout
  topic="VIP Microtask Draining: 22-Step Queue Simulation"
  pair="Topic 4 • Slide 2/2"
  :step="$clicks"
  :captions="captions"
  phase="demo"
>
  <div class="slide-grid-sim">
    <div class="col-code">
      <CodePanel
        title="queue-priority-sim.js"
        :lines="codeLines"
        :active-line="getState($clicks).line"
        tag="Queue Priority"
      />
    </div>
    <div class="col-engine">
      <EngineVisualizer
        :state="{
          stack: getState($clicks).stack,
          webApis: [],
          microtasks: getState($clicks).micro,
          macrotasks: getState($clicks).macro,
          logs: getState($clicks).logs,
          loopStatus: getState($clicks).loop,
          loopPhase: getState($clicks).phase,
          pinpointRule: getState($clicks).rule,
          activeComponent: getState($clicks).phase === 'console' ? 'console' : (getState($clicks).phase === 'micro' ? 'micro' : (getState($clicks).phase === 'macro' ? 'macro' : (getState($clicks).phase === 'loop' ? 'loop' : 'stack')))
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
