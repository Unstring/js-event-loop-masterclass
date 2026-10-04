<!-- ========================================== -->
<!-- TOPIC 3 • SLIDE 1 OF 2: CODE & QUESTIONS    -->
<!-- ========================================== -->
<script setup lang="ts">
import SlLayout from '../components/SlLayout.vue'
import CodePanel from '../components/CodePanel.vue'
import QuestionCards from '../components/QuestionCards.vue'

const codeLines = [
  "console.log('1: First');",
  "",
  "setTimeout(() => {",
  "  console.log('2: Inside Timeout Callback');",
  "}, 1000);",
  "",
  "console.log('3: Last');"
]

const captions = [
  "Topic 3: Understand how setTimeout() Works Internally — The Web API hand-off.",
  "Line 1 executes synchronously: '1: First' prints to the console terminal immediately.",
  "Line 3 calls setTimeout: Is setTimeout part of JavaScript or V8? NO, it is a host Web API!",
  "Lines 4-5: The callback is NOT executed now — it is registered with a 1000ms browser timer.",
  "Line 7 executes synchronously right away: '3: Last' prints before the timeout finishes!"
]

const questions = [
  {
    type: 'WHAT' as const,
    q: "Is setTimeout built into the JavaScript V8 engine?",
    a: "NO! setTimeout is a Web API provided by the browser (or libuv in Node.js). V8 has no timer hardware.",
    revealStep: 1
  },
  {
    type: 'HOW' as const,
    q: "How does the 1000ms countdown happen without freezing JS?",
    a: "The browser handles the countdown on a separate C++ background thread, keeping JS non-blocking.",
    revealStep: 2
  },
  {
    type: 'WHERE' as const,
    q: "Where does the callback go when 1000ms expires?",
    a: "It does NOT jump to the Call Stack! It is pushed into the Macrotask (Callback) Queue.",
    revealStep: 3
  },
  {
    type: 'WHEN' as const,
    q: "When does the callback finally execute?",
    a: "ONLY after the Call Stack is 100% empty and the Event Loop pushes it from the queue to the stack!",
    revealStep: 4
  }
]
</script>

<SlLayout
  topic="How setTimeout() Works Internally"
  pair="Topic 3 • Slide 1/2"
  :step="$clicks"
  :captions="captions"
  phase="concept"
>
  <div class="slide-grid">
    <div class="col-left">
      <CodePanel
        title="settimeout-demo.js"
        :lines="codeLines"
        :active-line="$clicks === 1 ? 1 : ($clicks === 2 ? 3 : ($clicks === 3 ? 3 : ($clicks === 4 ? 7 : 0)))"
        :highlight-lines="$clicks === 2 ? [3, 4, 5] : ($clicks === 4 ? [7] : [])"
        tag="Web API"
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
<!-- TOPIC 3 • SLIDE 2 OF 2: LIFECYCLE SIMULATOR -->
<!-- ========================================== -->
<script setup lang="ts">
import { computed } from 'vue'
import SlLayout from '../components/SlLayout.vue'
import CodePanel from '../components/CodePanel.vue'
import EngineVisualizer from '../components/EngineVisualizer.vue'

const codeLines = [
  "console.log('1: First');",
  "setTimeout(() => {",
  "  console.log('2: Timeout');",
  "}, 1000);",
  "console.log('3: Last');"
]

const captions = [
  "Interactive Trace: Follow setTimeout through the Call Stack, Web APIs, and Macrotask Queue.",
  "Step 1: '1: First' executes synchronously on the Call Stack and prints to console.",
  "Step 2: setTimeout() is pushed to Call Stack. Browser registers a 1000ms Timer in Web APIs.",
  "Step 3: setTimeout() pops off the Call Stack immediately — non-blocking!",
  "Step 4: '3: Last' executes synchronously and prints to console. Main script finishes!",
  "Step 5: 1000ms passes in background. Web API pushes callback to Macrotask Queue.",
  "Step 6: Event Loop checks: Call Stack is empty! It dequeues callback to Call Stack.",
  "Step 7: Callback executes: '2: Timeout' prints to console. Stack clears!"
]

const traceStates = [
  {
    stack: ['global()'],
    webApis: [],
    macrotasks: [],
    logs: [],
    loopStatus: 'Executing sync code',
    activeComp: 'stack' as const,
    line: 1
  },
  {
    stack: ['global()', 'console.log("1: First")'],
    webApis: [],
    macrotasks: [],
    logs: ['1: First'],
    loopStatus: 'Output printed',
    activeComp: 'console' as const,
    line: 1
  },
  {
    stack: ['global()', 'setTimeout(cb, 1000)'],
    webApis: ['Timer: 1000ms (counting)'],
    macrotasks: [],
    logs: ['1: First'],
    loopStatus: 'Registering Web API timer',
    activeComp: 'webapi' as const,
    line: 2
  },
  {
    stack: ['global()'],
    webApis: ['Timer: 1000ms (background)'],
    macrotasks: [],
    logs: ['1: First'],
    loopStatus: 'setTimeout popped from stack',
    activeComp: 'stack' as const,
    line: 5
  },
  {
    stack: ['global()', 'console.log("3: Last")'],
    webApis: ['Timer: 1000ms (background)'],
    macrotasks: [],
    logs: ['1: First', '3: Last'],
    loopStatus: 'Sync script completed',
    activeComp: 'console' as const,
    line: 5
  },
  {
    stack: [],
    webApis: [],
    macrotasks: ['callback() [from timer]'],
    logs: ['1: First', '3: Last'],
    loopStatus: 'Timer expired -> Macrotask Queue',
    activeComp: 'macro' as const,
    line: 3
  },
  {
    stack: ['callback()'],
    webApis: [],
    macrotasks: [],
    logs: ['1: First', '3: Last'],
    loopStatus: 'Event Loop moved callback to Stack',
    activeComp: 'loop' as const,
    line: 3
  },
  {
    stack: [],
    webApis: [],
    macrotasks: [],
    logs: ['1: First', '3: Last', '2: Timeout'],
    loopStatus: 'All tasks completed successfully!',
    activeComp: 'console' as const,
    line: 3
  }
]

function getState(step: number = 0) {
  const idx = Math.max(0, Math.min(step ?? 0, traceStates.length - 1))
  return traceStates[idx] || traceStates[0]
}
</script>

<SlLayout
  topic="setTimeout Web API & Macrotask Lifecycle"
  pair="Topic 3 • Slide 2/2"
  :step="$clicks"
  :captions="captions"
  phase="demo"
>
  <div class="slide-grid-engine">
    <div class="col-code-narrow">
      <CodePanel
        title="settimeout-trace.js"
        :lines="codeLines"
        :active-line="getState($clicks).line"
        tag="Web API Lifecycle"
      />
    </div>
    <div class="col-engine-wide">
      <EngineVisualizer
        :state="{
          stack: getState($clicks).stack,
          webApis: getState($clicks).webApis,
          microtasks: [],
          macrotasks: getState($clicks).macrotasks,
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
