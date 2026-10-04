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
  "  const res = await Promise.resolve('Data');",
  "  console.log('3: Resumed after await:', res);",
  "}",
  "",
  "fetchData();",
  "",
  "console.log('4: Script End');"
]

const captions = [
  "Topic 5: Explain Promises & async/await — Syntactic sugar over microtask scheduling.",
  "Line 1 runs synchronously: '1: Script Start' prints immediately.",
  "Line 9 invokes fetchData(): The function begins running synchronously — NOT in the background!",
  "Line 5 hits 'await': The function pauses, saves its local state, and yields the Call Stack back to caller.",
  "Line 11 continues synchronously: '4: Script End' prints before line 6 ever resumes!"
]

const questions = [
  {
    type: 'WHAT' as const,
    q: "What actually happens when an async function is called?",
    a: "It runs SYNCHRONOUSLY until the first 'await'! Then it returns a pending Promise to the caller.",
    revealStep: 1
  },
  {
    type: 'HOW' as const,
    q: "How does 'await' pause without freezing the thread?",
    a: "It converts everything below the 'await' into a hidden .then() microtask callback and yields the stack.",
    revealStep: 2
  },
  {
    type: 'WHERE' as const,
    q: "Where does the paused function context live?",
    a: "Suspended in the Engine Heap as a generator/coroutine state machine until the Promise resolves.",
    revealStep: 3
  },
  {
    type: 'WHEN' as const,
    q: "When does the code after await resume?",
    a: "As soon as the awaited Promise settles, its resume task is enqueued to the Microtask Queue!",
    revealStep: 4
  }
]
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
        title="async-await-anatomy.js"
        :lines="codeLines"
        :active-line="$clicks === 1 ? 1 : ($clicks === 2 ? 4 : ($clicks === 3 ? 5 : ($clicks === 4 ? 11 : 0)))"
        :highlight-lines="$clicks === 2 ? [3, 4] : ($clicks === 3 ? [5] : ($clicks === 4 ? [11] : []))"
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
import { computed } from 'vue'
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
  "Simulator: Step through async/await context suspension and microtask resumption.",
  "Step 1: '1: Start' executes on the Call Stack and logs to console.",
  "Step 2: run() is invoked on Call Stack. '2: In Async' executes synchronously.",
  "Step 3: 'await' reached! Function suspends context, returns Promise, and pops off stack.",
  "Step 4: Synchronous code continues: '4: End' logs to console. Stack clears!",
  "Step 5: The awaited Promise resolved! Continuation of run() enqueued to Microtask Queue.",
  "Step 6: Event Loop drains microtask: run() resumes on Call Stack!",
  "Step 7: '3: After Await' logs to console. Execution completed with 0 blocking!"
]

const traceStates = [
  {
    stack: ['global()'],
    micro: [],
    logs: [],
    loopStatus: 'Starting script',
    activeComp: 'stack' as const,
    line: 1
  },
  {
    stack: ['global()', 'console.log("1: Start")'],
    micro: [],
    logs: ['1: Start'],
    loopStatus: 'Synchronous log printed',
    activeComp: 'console' as const,
    line: 1
  },
  {
    stack: ['global()', 'run()', 'console.log("2: In Async")'],
    micro: [],
    logs: ['1: Start', '2: In Async'],
    loopStatus: 'Inside async function (synchronous phase)',
    activeComp: 'stack' as const,
    line: 3
  },
  {
    stack: ['global()'],
    micro: ['resume run() [Microtask]'],
    logs: ['1: Start', '2: In Async'],
    loopStatus: 'await suspended run() -> yielded stack',
    activeComp: 'micro' as const,
    line: 4
  },
  {
    stack: ['global()', 'console.log("4: End")'],
    micro: ['resume run() [Microtask]'],
    logs: ['1: Start', '2: In Async', '4: End'],
    loopStatus: 'Sync script completed',
    activeComp: 'console' as const,
    line: 8
  },
  {
    stack: [],
    micro: ['resume run() [Microtask]'],
    logs: ['1: Start', '2: In Async', '4: End'],
    loopStatus: 'Stack empty! Draining microtask queue...',
    activeComp: 'loop' as const,
    line: 5
  },
  {
    stack: ['run() [resumed]', 'console.log("3: After Await")'],
    micro: [],
    logs: ['1: Start', '2: In Async', '4: End', '3: After Await'],
    loopStatus: 'Resumed from microtask queue',
    activeComp: 'console' as const,
    line: 5
  },
  {
    stack: [],
    micro: [],
    logs: ['1: Start', '2: In Async', '4: End', '3: After Await'],
    loopStatus: 'Program completed without thread blocking!',
    activeComp: 'loop' as const,
    line: 5
  }
]

const current = computed(() => {
  const idx = Math.min($clicks, traceStates.length - 1)
  return traceStates[idx]
})
</script>

<SlLayout
  topic="async/await Suspension & Microtask Resumption"
  pair="Topic 5 • Slide 2/2"
  :step="$clicks"
  :captions="captions"
  phase="demo"
>
  <div class="slide-grid-engine">
    <div class="col-code-narrow">
      <CodePanel
        title="async-await-trace.js"
        :lines="codeLines"
        :active-line="current.line"
        tag="Coroutine Stepper"
      />
    </div>
    <div class="col-engine-wide">
      <EngineVisualizer
        :state="{
          stack: current.stack,
          webApis: [],
          microtasks: current.micro,
          macrotasks: [],
          logs: current.logs,
          loopStatus: current.loopStatus,
          activeComponent: current.activeComp
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
