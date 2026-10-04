<!-- ========================================== -->
<!-- GRAND FINALE: THE MASTER PUZZLE SOLVED     -->
<!-- ========================================== -->
<script setup lang="ts">
import { computed } from 'vue'
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
  "Grand Finale: Solving the Master Puzzle with the complete Event Loop architecture!",
  "Phase 1 (Sync): '1: Sync Start' runs. setTimeout registers to Macrotask. Promise 1 to Microtask.",
  "Phase 1 (Sync): asyncFn() starts -> '5: Async Start' prints. 'await' queues continuation to Microtask.",
  "Phase 1 (Sync): '7: Sync End' prints! Synchronous phase complete. Call Stack empties!",
  "Phase 2 (Microtasks): Microtask 1 runs -> '3: Micro 1' prints & enqueues Microtask 2.",
  "Phase 2 (Microtasks): async continuation runs -> '6: After Await' prints.",
  "Phase 2 (Microtasks): Microtask 2 runs -> '4: Micro 2' prints. Microtask queue empty!",
  "Phase 3 (Macrotask): Finally, Macrotask queue runs: '2: Timeout' prints! Puzzle Solved: 1, 5, 7, 3, 6, 4, 2!"
]

const traceStates = [
  {
    stack: ['global()'],
    micro: [],
    macro: [],
    logs: [],
    loopStatus: 'Starting Master Script',
    activeComp: 'stack' as const,
    line: 1
  },
  {
    stack: ['global()'],
    micro: ['Promise 1 cb'],
    macro: ['setTimeout cb (0ms)'],
    logs: ['1: Sync Start'],
    loopStatus: 'Timer & Promise queued',
    activeComp: 'micro' as const,
    line: 3
  },
  {
    stack: ['global()', 'asyncFn()'],
    micro: ['Promise 1 cb', 'resume asyncFn()'],
    macro: ['setTimeout cb (0ms)'],
    logs: ['1: Sync Start', '5: Async Start'],
    loopStatus: 'asyncFn paused at await',
    activeComp: 'stack' as const,
    line: 8
  },
  {
    stack: [],
    micro: ['Promise 1 cb', 'resume asyncFn()'],
    macro: ['setTimeout cb (0ms)'],
    logs: ['1: Sync Start', '5: Async Start', '7: Sync End'],
    loopStatus: 'Sync phase done! Draining Microtasks...',
    activeComp: 'loop' as const,
    line: 12
  },
  {
    stack: ['Promise 1 cb'],
    micro: ['resume asyncFn()', 'Promise 2 cb'],
    macro: ['setTimeout cb (0ms)'],
    logs: ['1: Sync Start', '5: Async Start', '7: Sync End', '3: Micro 1'],
    loopStatus: 'Microtask 1 ran -> chained Microtask 2',
    activeComp: 'micro' as const,
    line: 4
  },
  {
    stack: ['resume asyncFn()'],
    micro: ['Promise 2 cb'],
    macro: ['setTimeout cb (0ms)'],
    logs: ['1: Sync Start', '5: Async Start', '7: Sync End', '3: Micro 1', '6: After Await'],
    loopStatus: 'asyncFn continuation finished',
    activeComp: 'stack' as const,
    line: 9
  },
  {
    stack: ['Promise 2 cb'],
    micro: [],
    macro: ['setTimeout cb (0ms)'],
    logs: ['1: Sync Start', '5: Async Start', '7: Sync End', '3: Micro 1', '6: After Await', '4: Micro 2'],
    loopStatus: 'Microtasks completely drained to 0!',
    activeComp: 'micro' as const,
    line: 5
  },
  {
    stack: ['setTimeout cb'],
    micro: [],
    macro: [],
    logs: ['1: Sync Start', '5: Async Start', '7: Sync End', '3: Micro 1', '6: After Await', '4: Micro 2', '2: Timeout'],
    loopStatus: 'Macrotask executed. Output: 1, 5, 7, 3, 6, 4, 2',
    activeComp: 'console' as const,
    line: 2
  }
]

function getState(step: number = 0) {
  const idx = Math.max(0, Math.min(step ?? 0, traceStates.length - 1))
  return traceStates[idx] || traceStates[0]
}
</script>

<SlLayout
  topic="The Master Puzzle Solved & 4 Golden Rules"
  pair="Recap • Masterclass Finale"
  :step="$clicks"
  :captions="captions"
  phase="recap"
>
  <div class="slide-grid-engine">
    <div class="col-code-narrow">
      <CodePanel
        title="event-loop-master.js"
        :lines="codeLines"
        :active-line="getState($clicks).line"
        tag="Final Resolution"
      />
    </div>
    <div class="col-engine-wide">
      <EngineVisualizer
        :state="{
          stack: getState($clicks).stack,
          webApis: [],
          microtasks: getState($clicks).micro,
          macrotasks: getState($clicks).macro,
          logs: getState($clicks).logs,
          loopStatus: getState($clicks).loopStatus,
          activeComponent: getState($clicks).activeComp
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
