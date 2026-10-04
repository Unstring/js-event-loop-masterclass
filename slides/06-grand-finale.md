<!-- ========================================== -->
<!-- GRAND FINALE: THE MASTER PUZZLE SOLVED     -->
<!-- ========================================== -->
<script setup lang="ts">
import SlLayout from '../components/SlLayout.vue'
import CodePanel from '../components/CodePanel.vue'
import EngineVisualizer from '../components/EngineVisualizer.vue'

const codeLines = [
  "console.log('1: Sync Start');",
  "setTimeout(() => console.log('2: Timeout'), 0);",
  "Promise.resolve()",
  "  .then(() => console.log('3: Micro 1'))",
  "  .then(() => console.log('4: Micro 2'));",
  "async function asyncFn() {",
  "  console.log('5: Async Start');",
  "  await null;",
  "  console.log('6: After Await');",
  "}",
  "asyncFn();",
  "console.log('7: Sync End');"
]

const captions = [
  "Step 0: Grand Finale — Tracing all 5 concepts unified in one master simulation.",
  "Step 1: Line 1 executes: console.log('1: Sync Start') pushes to Call Stack.",
  "Step 2: Log executes: stdout prints '1: Sync Start'. Call Stack pops frame.",
  "Step 3: Line 2 executes: setTimeout(cb, 0) pushes to Call Stack.",
  "Step 4: Web API registers 0ms timer and immediately places cb into MACROTASK queue.",
  "Step 5: setTimeout pops off Call Stack immediately (non-blocking).",
  "Step 6: Line 3-4 executes: Promise.resolve().then(...) registers reaction.",
  "Step 7: Callback enqueued to MICROTASK QUEUE (VIP): [Micro 1].",
  "Step 8: Line 6-10: async function asyncFn declared in scope.",
  "Step 9: Line 11 executes: asyncFn() invoked on Call Stack.",
  "Step 10: Line 7 executes synchronously inside asyncFn: console.log('5: Async Start').",
  "Step 11: Log executes: stdout prints '5: Async Start'. Frame pops.",
  "Step 12: Line 8 executes: 'await null' encountered! asyncFn suspends.",
  "Step 13: asyncFn continuation enqueued to MICROTASK QUEUE: [Micro 1, resume asyncFn].",
  "Step 14: asyncFn yields Call Stack and pops off!",
  "Step 15: Line 12 executes: console.log('7: Sync End') pushes to Call Stack.",
  "Step 16: Log executes: stdout prints '7: Sync End'. Frame pops.",
  "Step 17: Synchronous phase 100% DONE! Call Stack is now completely empty.",
  "Step 18: Phase 2 (Microtasks): Event Loop checks VIP Microtask Queue FIRST!",
  "Step 19: Micro 1 runs on Call Stack: prints '3: Micro 1' and chains Micro 2!",
  "Step 20: resume asyncFn runs on Call Stack: prints '6: After Await'!",
  "Step 21: Micro 2 runs on Call Stack: prints '4: Micro 2'! Microtasks now EMPTY (0).",
  "Step 22: Phase 3 (Macrotask): Event Loop now takes ONE task from Macrotask Queue.",
  "Step 23: Timeout callback runs on Call Stack: prints '2: Timeout'!",
  "Step 24: ALL TASKS RESOLVED! Final Output: 1 → 5 → 7 → 3 → 6 → 4 → 2! Masterclass Complete!"
]

const traceStates = [
  { stack: ['global()'], webApis: [], micro: [], macro: [], logs: [], loop: 'Starting Master Script', phase: 'stack' as const, line: 0, rule: 'Global Execution Context' },
  { stack: ['global()', 'console.log()'], webApis: [], micro: [], macro: [], logs: [], loop: 'Sync log executing', phase: 'stack' as const, line: 1, rule: 'Synchronous execution' },
  { stack: ['global()'], webApis: [], micro: [], macro: [], logs: ['1: Sync Start'], loop: 'Sync log printed', phase: 'console' as const, line: 1, rule: 'Stdout: 1: Sync Start' },
  { stack: ['global()', 'setTimeout(cb, 0)'], webApis: [], micro: [], macro: [], logs: ['1: Sync Start'], loop: 'Calling Web API', phase: 'stack' as const, line: 2, rule: 'Offloading timer' },
  { stack: ['global()'], webApis: [], micro: [], macro: ['setTimeout cb (0ms)'], logs: ['1: Sync Start'], loop: 'Timer queued to Macrotasks', phase: 'macro' as const, line: 2, rule: 'Macrotask Queue buffer' },
  { stack: ['global()'], webApis: [], micro: [], macro: ['setTimeout cb (0ms)'], logs: ['1: Sync Start'], loop: 'Stack free for next line', phase: 'stack' as const, line: 3, rule: 'Non-blocking return' },
  { stack: ['global()', 'Promise.then()'], webApis: [], micro: [], macro: ['setTimeout cb (0ms)'], logs: ['1: Sync Start'], loop: 'Attaching Promise reaction', phase: 'stack' as const, line: 4, rule: 'Promise settled in Heap' },
  { stack: ['global()'], webApis: [], micro: ['Promise 1 cb'], macro: ['setTimeout cb (0ms)'], logs: ['1: Sync Start'], loop: 'VIP Microtask Enqueued', phase: 'micro' as const, line: 4, rule: 'Enqueued to VIP Microtasks' },
  { stack: ['global()'], webApis: [], micro: ['Promise 1 cb'], macro: ['setTimeout cb (0ms)'], logs: ['1: Sync Start'], loop: 'asyncFn declared', phase: 'stack' as const, line: 6, rule: 'Function stored in Heap' },
  { stack: ['global()', 'asyncFn()'], webApis: [], micro: ['Promise 1 cb'], macro: ['setTimeout cb (0ms)'], logs: ['1: Sync Start'], loop: 'Calling asyncFn()', phase: 'stack' as const, line: 11, rule: 'Sync execution until await' },
  { stack: ['global()', 'asyncFn()', 'console.log()'], webApis: [], micro: ['Promise 1 cb'], macro: ['setTimeout cb (0ms)'], logs: ['1: Sync Start'], loop: 'Sync log inside asyncFn', phase: 'stack' as const, line: 7, rule: 'Sync preamble running' },
  { stack: ['global()', 'asyncFn()'], webApis: [], micro: ['Promise 1 cb'], macro: ['setTimeout cb (0ms)'], logs: ['1: Sync Start', '5: Async Start'], loop: 'Log printed', phase: 'console' as const, line: 7, rule: 'Stdout: 5: Async Start' },
  { stack: ['global()', 'asyncFn()'], webApis: [], micro: ['Promise 1 cb'], macro: ['setTimeout cb (0ms)'], logs: ['1: Sync Start', '5: Async Start'], loop: 'await reached -> function paused', phase: 'micro' as const, line: 8, rule: 'await schedules microtask' },
  { stack: ['global()', 'asyncFn()'], webApis: [], micro: ['Promise 1 cb', 'resume asyncFn()'], macro: ['setTimeout cb (0ms)'], logs: ['1: Sync Start', '5: Async Start'], loop: 'Continuation in Microtask Queue', phase: 'micro' as const, line: 8, rule: 'Continuation buffered' },
  { stack: ['global()'], webApis: [], micro: ['Promise 1 cb', 'resume asyncFn()'], macro: ['setTimeout cb (0ms)'], logs: ['1: Sync Start', '5: Async Start'], loop: 'asyncFn yielded Call Stack', phase: 'stack' as const, line: 11, rule: 'Stack returned to caller' },
  { stack: ['global()', 'console.log()'], webApis: [], micro: ['Promise 1 cb', 'resume asyncFn()'], macro: ['setTimeout cb (0ms)'], logs: ['1: Sync Start', '5: Async Start'], loop: 'Running final sync statement', phase: 'stack' as const, line: 12, rule: 'Final top-level code' },
  { stack: ['global()'], webApis: [], micro: ['Promise 1 cb', 'resume asyncFn()'], macro: ['setTimeout cb (0ms)'], logs: ['1: Sync Start', '5: Async Start', '7: Sync End'], loop: 'Sync log printed', phase: 'console' as const, line: 12, rule: 'Stdout: 7: Sync End' },
  { stack: [], webApis: [], micro: ['Promise 1 cb', 'resume asyncFn()'], macro: ['setTimeout cb (0ms)'], logs: ['1: Sync Start', '5: Async Start', '7: Sync End'], loop: 'SYNC COMPLETE! Draining Microtasks...', phase: 'loop' as const, line: 12, rule: 'Stack is 0. Microtask drain begins.' },
  { stack: ['Promise 1 cb'], webApis: [], micro: ['resume asyncFn()'], macro: ['setTimeout cb (0ms)'], logs: ['1: Sync Start', '5: Async Start', '7: Sync End'], loop: 'Executing Microtask 1', phase: 'stack' as const, line: 4, rule: 'Microtask 1 running on stack' },
  { stack: [], webApis: [], micro: ['resume asyncFn()', 'Promise 2 cb'], macro: ['setTimeout cb (0ms)'], logs: ['1: Sync Start', '5: Async Start', '7: Sync End', '3: Micro 1'], loop: 'Micro 1 ran -> chained Micro 2', phase: 'micro' as const, line: 5, rule: 'Chained promise enqueued' },
  { stack: ['resume asyncFn()'], webApis: [], micro: ['Promise 2 cb'], macro: ['setTimeout cb (0ms)'], logs: ['1: Sync Start', '5: Async Start', '7: Sync End', '3: Micro 1'], loop: 'Executing asyncFn continuation', phase: 'stack' as const, line: 9, rule: 'asyncFn resumed from microtask' },
  { stack: [], webApis: [], micro: [], macro: ['setTimeout cb (0ms)'], logs: ['1: Sync Start', '5: Async Start', '7: Sync End', '3: Micro 1', '6: After Await', '4: Micro 2'], loop: 'Microtasks completely drained to 0!', phase: 'micro' as const, line: 5, rule: 'VIP Lane empty. Now Macrotasks.' },
  { stack: ['setTimeout cb'], webApis: [], micro: [], macro: [], logs: ['1: Sync Start', '5: Async Start', '7: Sync End', '3: Micro 1', '6: After Await', '4: Micro 2'], loop: 'Executing Macrotask', phase: 'stack' as const, line: 2, rule: 'Dequeued from Macrotask queue' },
  { stack: [], webApis: [], micro: [], macro: [], logs: ['1: Sync Start', '5: Async Start', '7: Sync End', '3: Micro 1', '6: After Await', '4: Micro 2', '2: Timeout'], loop: 'Macrotask finished!', phase: 'console' as const, line: 2, rule: 'Stdout: 2: Timeout' },
  { stack: [], webApis: [], micro: [], macro: [], logs: ['1: Sync Start', '5: Async Start', '7: Sync End', '3: Micro 1', '6: After Await', '4: Micro 2', '2: Timeout'], loop: 'PUZZLE SOLVED: 1 -> 5 -> 7 -> 3 -> 6 -> 4 -> 2', phase: 'idle' as const, line: 0, rule: '4 Golden Rules Mastered!' }
]

function getState(step: number = 0) {
  const idx = Math.max(0, Math.min(step ?? 0, traceStates.length - 1))
  return traceStates[idx] || traceStates[0]
}
</script>

<SlLayout
  topic="The Master Puzzle Solved: 25-Step Architecture Resolution"
  pair="Recap • Masterclass Finale"
  :step="$clicks"
  :captions="captions"
  phase="recap"
>
  <div class="slide-grid-sim">
    <div class="col-code">
      <CodePanel
        title="event-loop-resolved.js"
        :lines="codeLines"
        :active-line="getState($clicks).line"
        tag="Final Resolution"
      />
    </div>
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
