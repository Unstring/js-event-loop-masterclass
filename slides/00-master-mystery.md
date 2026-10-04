<script setup lang="ts">
import SlLayout from '../components/SlLayout.vue'
import CodePanel from '../components/CodePanel.vue'
import EngineVisualizer from '../components/EngineVisualizer.vue'

const codeLines = [
  "console.log('1: Sync Start');",
  "",
  "setTimeout(() => {",
  "  console.log('2: Timeout Callback');",
  "}, 0);",
  "",
  "Promise.resolve()",
  "  .then(() => console.log('3: Microtask 1'))",
  "  .then(() => console.log('4: Microtask 2'));",
  "",
  "async function asyncFn() {",
  "  console.log('5: Async Start');",
  "  await null;",
  "  console.log('6: After Await');",
  "}",
  "asyncFn();",
  "",
  "console.log('7: Sync End');"
]

const captions = [
  "Step 0: Engine loads script. Call stack and memory heaps initialized.",
  "Step 1: Line 1 executes — console.log('1: Sync Start') pushed to Call Stack.",
  "Step 2: Log executes — stdout prints '1: Sync Start'. Call Stack pops frame.",
  "Step 3: Line 3 executes — setTimeout() pushed onto Call Stack.",
  "Step 4: Engine registers timer in Browser Web APIs (0ms timer thread created).",
  "Step 5: setTimeout() finishes registering and POPS off the Call Stack immediately!",
  "Step 6: Web API 0ms timer fires in background thread.",
  "Step 7: Web API places callback into MACROTASK QUEUE (NOT Call Stack).",
  "Step 8: Line 7 executes — Promise.resolve() returns resolved Promise in Heap.",
  "Step 9: Line 8 executes — .then() registers callback. Pushed to MICROTASK QUEUE (VIP)!",
  "Step 10: Line 11 executes — async function asyncFn() declared in global scope.",
  "Step 11: Line 16 executes — asyncFn() invoked! Stack pushes asyncFn() frame.",
  "Step 12: Line 12 executes — console.log('5: Async Start') pushed to Call Stack.",
  "Step 13: Log executes — stdout prints '5: Async Start'. Frame pops.",
  "Step 14: Line 13 executes — 'await null' reached! asyncFn() pauses execution context.",
  "Step 15: Continuation of asyncFn queued as a MICROTASK. asyncFn() yields Call Stack!",
  "Step 16: Call Stack pops asyncFn() — returning to top-level synchronous code.",
  "Step 17: Line 18 executes — console.log('7: Sync End') pushed to Call Stack.",
  "Step 18: Log executes — stdout prints '7: Sync End'. Frame pops.",
  "Step 19: Synchronous execution 100% COMPLETE! Call Stack is now completely empty.",
  "Step 20: Event Loop tick: Call Stack is empty! Checks VIP Microtask Queue FIRST.",
  "Step 21: Microtask 1 runs on Call Stack: prints '3: Microtask 1' & chains Microtask 2!",
  "Step 22: asyncFn continuation runs on Call Stack: prints '6: After Await'!",
  "Step 23: Microtask 2 runs on Call Stack: prints '4: Microtask 2'. Microtask queue empty!",
  "Step 24: Event Loop now moves to Macrotask Queue: prints '2: Timeout Callback'! Done!"
]

const traceStates = [
  { stack: ['global()'], webApis: [], micro: [], macro: [], logs: [], loop: 'Script Initialized', phase: 'stack' as const, line: 0, rule: 'Global Execution Context loaded.' },
  { stack: ['global()', 'console.log()'], webApis: [], micro: [], macro: [], logs: [], loop: 'Executing sync log', phase: 'stack' as const, line: 1, rule: 'Sync code runs immediately on the single thread.' },
  { stack: ['global()'], webApis: [], micro: [], macro: [], logs: ['1: Sync Start'], loop: 'Call Stack popped', phase: 'stack' as const, line: 1, rule: 'Stdout flushed to terminal.' },
  { stack: ['global()', 'setTimeout(cb, 0)'], webApis: [], micro: [], macro: [], logs: ['1: Sync Start'], loop: 'Calling Web API', phase: 'stack' as const, line: 3, rule: 'setTimeout is a Web API, not part of V8 engine.' },
  { stack: ['global()', 'setTimeout(cb, 0)'], webApis: ['Timer (0ms delay)'], micro: [], macro: [], logs: ['1: Sync Start'], loop: 'Timer registered in Web API', phase: 'webapi' as const, line: 3, rule: 'Timer counted down on browser background thread.' },
  { stack: ['global()'], webApis: ['Timer (0ms delay)'], micro: [], macro: [], logs: ['1: Sync Start'], loop: 'Stack cleared for next sync line', phase: 'stack' as const, line: 5, rule: 'Non-blocking: setTimeout never delays synchronous execution.' },
  { stack: ['global()'], webApis: ['Timer 0ms [EXPIRED]'], micro: [], macro: [], logs: ['1: Sync Start'], loop: 'Timer completed in background', phase: 'webapi' as const, line: 5, rule: '0ms means "as soon as possible", not "immediately".' },
  { stack: ['global()'], webApis: [], micro: [], macro: ['Timeout Callback'], logs: ['1: Sync Start'], loop: 'Callback enqueued to Macrotasks', phase: 'macro' as const, line: 5, rule: 'Callbacks cannot jump to stack — must wait in queue.' },
  { stack: ['global()', 'Promise.resolve()'], webApis: [], micro: [], macro: ['Timeout Callback'], logs: ['1: Sync Start'], loop: 'Resolving Promise', phase: 'stack' as const, line: 7, rule: 'Promise settles synchronously in Memory Heap.' },
  { stack: ['global()'], webApis: [], micro: ['Promise Microtask 1'], macro: ['Timeout Callback'], logs: ['1: Sync Start'], loop: 'VIP Microtask Enqueued', phase: 'micro' as const, line: 8, rule: 'Promise.then always schedules into the Microtask Queue.' },
  { stack: ['global()'], webApis: [], micro: ['Promise Microtask 1'], macro: ['Timeout Callback'], logs: ['1: Sync Start'], loop: 'Function declared', phase: 'stack' as const, line: 11, rule: 'async functions are parsed and stored in memory.' },
  { stack: ['global()', 'asyncFn()'], webApis: [], micro: ['Promise Microtask 1'], macro: ['Timeout Callback'], logs: ['1: Sync Start'], loop: 'Invoking async function', phase: 'stack' as const, line: 16, rule: 'async functions execute synchronously until first await!' },
  { stack: ['global()', 'asyncFn()', 'console.log()'], webApis: [], micro: ['Promise Microtask 1'], macro: ['Timeout Callback'], logs: ['1: Sync Start'], loop: 'Running sync log inside asyncFn', phase: 'stack' as const, line: 12, rule: 'Code before await is 100% synchronous.' },
  { stack: ['global()', 'asyncFn()'], webApis: [], micro: ['Promise Microtask 1'], macro: ['Timeout Callback'], logs: ['1: Sync Start', '5: Async Start'], loop: 'Log completed', phase: 'stack' as const, line: 12, rule: 'Stdout prints 5: Async Start.' },
  { stack: ['global()', 'asyncFn()'], webApis: [], micro: ['Promise Microtask 1'], macro: ['Timeout Callback'], logs: ['1: Sync Start', '5: Async Start'], loop: 'await encountered -> context paused', phase: 'micro' as const, line: 13, rule: 'await pauses function and creates a microtask continuation.' },
  { stack: ['global()', 'asyncFn()'], webApis: [], micro: ['Promise Microtask 1', 'resume asyncFn()'], macro: ['Timeout Callback'], logs: ['1: Sync Start', '5: Async Start'], loop: 'async continuation enqueued', phase: 'micro' as const, line: 13, rule: 'Continuation added to VIP Microtask Queue.' },
  { stack: ['global()'], webApis: [], micro: ['Promise Microtask 1', 'resume asyncFn()'], macro: ['Timeout Callback'], logs: ['1: Sync Start', '5: Async Start'], loop: 'asyncFn yielded Call Stack', phase: 'stack' as const, line: 16, rule: 'Call Stack returned to caller synchronously.' },
  { stack: ['global()', 'console.log()'], webApis: [], micro: ['Promise Microtask 1', 'resume asyncFn()'], macro: ['Timeout Callback'], logs: ['1: Sync Start', '5: Async Start'], loop: 'Executing final sync line', phase: 'stack' as const, line: 18, rule: 'Last synchronous top-level statement.' },
  { stack: ['global()'], webApis: [], micro: ['Promise Microtask 1', 'resume asyncFn()'], macro: ['Timeout Callback'], logs: ['1: Sync Start', '5: Async Start', '7: Sync End'], loop: 'Sync log printed', phase: 'stack' as const, line: 18, rule: 'Stdout prints 7: Sync End.' },
  { stack: [], webApis: [], micro: ['Promise Microtask 1', 'resume asyncFn()'], macro: ['Timeout Callback'], logs: ['1: Sync Start', '5: Async Start', '7: Sync End'], loop: 'STACK EMPTY! Checking Queues...', phase: 'loop' as const, line: 18, rule: 'Call Stack is completely clear. Event loop engages!' },
  { stack: [], webApis: [], micro: ['Promise Microtask 1', 'resume asyncFn()'], macro: ['Timeout Callback'], logs: ['1: Sync Start', '5: Async Start', '7: Sync End'], loop: 'Prioritizing VIP Microtasks', phase: 'micro' as const, line: 8, rule: 'Golden Rule: Microtask queue MUST drain to 0 before macrotasks.' },
  { stack: ['Microtask 1()'], webApis: [], micro: ['resume asyncFn()', 'Promise Microtask 2'], macro: ['Timeout Callback'], logs: ['1: Sync Start', '5: Async Start', '7: Sync End', '3: Microtask 1'], loop: 'Microtask 1 ran -> chained Micro 2', phase: 'micro' as const, line: 8, rule: 'Microtask 1 executed and pushed chained .then() to Microtasks.' },
  { stack: ['resume asyncFn()'], webApis: [], micro: ['Promise Microtask 2'], macro: ['Timeout Callback'], logs: ['1: Sync Start', '5: Async Start', '7: Sync End', '3: Microtask 1', '6: After Await'], loop: 'async continuation executed', phase: 'micro' as const, line: 14, rule: 'asyncFn resumed from microtask queue!' },
  { stack: ['Microtask 2()'], webApis: [], micro: [], macro: ['Timeout Callback'], logs: ['1: Sync Start', '5: Async Start', '7: Sync End', '3: Microtask 1', '6: After Await', '4: Microtask 2'], loop: 'Microtask Queue completely drained!', phase: 'micro' as const, line: 9, rule: 'All microtasks finished. Queue depth is 0.' },
  { stack: ['Timeout cb()'], webApis: [], micro: [], macro: [], logs: ['1: Sync Start', '5: Async Start', '7: Sync End', '3: Microtask 1', '6: After Await', '4: Microtask 2', '2: Timeout Callback'], loop: 'Macrotask executed. Cycle complete!', phase: 'macro' as const, line: 4, rule: 'Final output: 1 → 5 → 7 → 3 → 6 → 4 → 2! Puzzle solved!' }
]

function getState(step: number = 0) {
  const idx = Math.max(0, Math.min(step ?? 0, traceStates.length - 1))
  return traceStates[idx] || traceStates[0]
}
</script>

<SlLayout
  topic="The Grand Mystery: 25-Step Event Loop Simulation"
  pair="Overview • Master Puzzle"
  :step="$clicks"
  :captions="captions"
  phase="intro"
>
  <div class="slide-grid-sim">
    <!-- Left Column: Code with live active line pointer -->
    <div class="col-code">
      <CodePanel
        title="event-loop-master.js"
        :lines="codeLines"
        :active-line="getState($clicks).line"
        tag="Live Debugger"
      />
    </div>

    <!-- Right Column: Live Full Engine Visualizer -->
    <div class="col-engine">
      <EngineVisualizer
        :state="{
          stack: getState($clicks).stack,
          webApis: getState($clicks).webApis,
          microtasks: getState($clicks).micro,
          macrotasks: getState($clicks).macro,
          logs: getState($clicks).logs,
          loopStatus: getState($clicks).loop,
          loopPhase: getState($clicks).phase,
          pinpointRule: getState($clicks).rule,
          activeComponent: getState($clicks).phase === 'stack' ? 'stack' : (getState($clicks).phase === 'webapi' ? 'webapi' : (getState($clicks).phase === 'micro' ? 'micro' : (getState($clicks).phase === 'macro' ? 'macro' : 'loop')))
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
