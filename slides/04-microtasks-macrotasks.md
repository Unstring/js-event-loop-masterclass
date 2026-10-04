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
  "Topic 4: Differentiate between Microtasks and Macrotasks — The two-tier queue hierarchy.",
  "Lines 1 & 11: Synchronous logs execute first on the Call Stack ('1: Sync' and '4: Sync').",
  "Line 3: setTimeout with 0ms delay — pushed to the MACROTASK queue.",
  "Line 7: Promise.resolve().then() — pushed to the MICROTASK queue (VIP lane).",
  "The Golden Rule: The Event Loop MUST completely drain the Microtask Queue before touching the Macrotask Queue!"
]

const questions = [
  {
    type: 'WHAT' as const,
    q: "What belongs to Microtasks vs Macrotasks?",
    a: "Microtasks: Promises, queueMicrotask, MutationObserver. Macrotasks: setTimeout, setInterval, setImmediate, I/O.",
    revealStep: 1
  },
  {
    type: 'HOW' as const,
    q: "How does the Event Loop prioritize them?",
    a: "Microtasks have absolute priority! The entire microtask queue must be 100% drained before running 1 macrotask.",
    revealStep: 2
  },
  {
    type: 'WHERE' as const,
    q: "Where do these queues live in the runtime?",
    a: "They are separate FIFO queues managed by the Event Loop coordination algorithm in the host environment.",
    revealStep: 3
  },
  {
    type: 'WHEN' as const,
    q: "When does 'Microtask Starvation' occur?",
    a: "If a microtask continuously schedules another microtask, macrotasks and screen paints NEVER run!",
    revealStep: 4
  }
]
</script>

<SlLayout
  topic="Microtasks vs Macrotasks Priority"
  pair="Topic 4 • Slide 1/2"
  :step="$clicks"
  :captions="captions"
  phase="concept"
>
  <div class="slide-grid">
    <div class="col-left">
      <CodePanel
        title="two-queues.js"
        :lines="codeLines"
        :active-line="$clicks === 1 ? 1 : ($clicks === 2 ? 3 : ($clicks === 3 ? 7 : ($clicks === 4 ? 11 : 0)))"
        :highlight-lines="$clicks === 2 ? [3, 4, 5] : ($clicks === 3 ? [7, 8, 9] : ($clicks === 4 ? [11] : []))"
        tag="Queue Hierarchy"
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
import { computed } from 'vue'
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
  "Simulator: Watch the Event Loop prioritize the Microtask VIP queue over the Macrotask queue.",
  "Step 1: '1: Sync' executes on Call Stack and prints to terminal.",
  "Step 2: setTimeout(cb, 0) runs. Web API immediately places cb into MACROTASK queue.",
  "Step 3: Promise.resolve().then(cb) runs. Callback placed into MICROTASK queue (VIP).",
  "Step 4: '4: Sync' executes on Call Stack and prints. Synchronous script ends!",
  "Step 5: Call Stack is empty! Event Loop checks VIP Microtask queue FIRST.",
  "Step 6: Microtask cb runs on Call Stack: '3: Micro' prints! Microtask queue is now empty.",
  "Step 7: Event Loop now moves to Macrotask queue: '2: Macro (0ms)' runs and prints!"
]

const traceStates = [
  {
    stack: ['global()'],
    micro: [],
    macro: [],
    logs: [],
    loopStatus: 'Running synchronous script',
    activeComp: 'stack' as const,
    line: 1
  },
  {
    stack: ['global()', 'console.log("1: Sync")'],
    micro: [],
    macro: [],
    logs: ['1: Sync'],
    loopStatus: 'Sync log printed',
    activeComp: 'console' as const,
    line: 1
  },
  {
    stack: ['global()'],
    micro: [],
    macro: ['setTimeout(cb, 0)'],
    logs: ['1: Sync'],
    loopStatus: 'Macrotask enqueued (0ms timer done)',
    activeComp: 'macro' as const,
    line: 2
  },
  {
    stack: ['global()'],
    micro: ['Promise.then(cb)'],
    macro: ['setTimeout(cb, 0)'],
    logs: ['1: Sync'],
    loopStatus: 'VIP Microtask enqueued!',
    activeComp: 'micro' as const,
    line: 3
  },
  {
    stack: ['global()', 'console.log("4: Sync")'],
    micro: ['Promise.then(cb)'],
    macro: ['setTimeout(cb, 0)'],
    logs: ['1: Sync', '4: Sync'],
    loopStatus: 'Sync phase complete. Stack emptying.',
    activeComp: 'console' as const,
    line: 4
  },
  {
    stack: [],
    micro: ['Promise.then(cb)'],
    macro: ['setTimeout(cb, 0)'],
    logs: ['1: Sync', '4: Sync'],
    loopStatus: 'STACK EMPTY! Draining Microtasks first...',
    activeComp: 'loop' as const,
    line: 3
  },
  {
    stack: ['Promise callback()'],
    micro: [],
    macro: ['setTimeout(cb, 0)'],
    logs: ['1: Sync', '4: Sync', '3: Micro'],
    loopStatus: 'Microtask executed on Stack',
    activeComp: 'stack' as const,
    line: 3
  },
  {
    stack: ['setTimeout callback()'],
    micro: [],
    macro: [],
    logs: ['1: Sync', '4: Sync', '3: Micro', '2: Macro (0ms)'],
    loopStatus: 'Macrotask executed after microtasks empty!',
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
  topic="VIP Microtask Draining & Queue Priority"
  pair="Topic 4 • Slide 2/2"
  :step="$clicks"
  :captions="captions"
  phase="demo"
>
  <div class="slide-grid-engine">
    <div class="col-code-narrow">
      <CodePanel
        title="queue-priority-trace.js"
        :lines="codeLines"
        :active-line="getState($clicks).line"
        tag="Queue Simulator"
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
