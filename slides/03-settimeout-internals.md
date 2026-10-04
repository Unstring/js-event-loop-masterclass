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
  "  console.log('2: Timeout Callback');",
  "}, 1000);",
  "",
  "console.log('3: Last');"
]

const captions = [
  "Step 0: Engine loads script. Preparing to demonstrate the Web API hand-off.",
  "Step 1: Line 1 executes: console.log('1: First') pushed to Call Stack.",
  "Step 2: Log executes: stdout prints '1: First'. Frame pops from stack.",
  "Step 3: Line 3 executes: setTimeout(cb, 1000) pushed to Call Stack.",
  "Step 4: JavaScript engine checks V8 internals — no timer mechanism exists!",
  "Step 5: Engine hands callback & 1000ms delay to Browser Host Web APIs.",
  "Step 6: Browser creates a dedicated Timer thread in C++ background workers.",
  "Step 7: setTimeout() returns a numeric timerId (e.g. 1) to the caller.",
  "Step 8: setTimeout() POPS off the Call Stack immediately — non-blocking!",
  "Step 9: WHAT Question: setTimeout is a host Web API, NOT an ECMAScript built-in.",
  "Step 10: Line 7 executes: console.log('3: Last') pushed to Call Stack.",
  "Step 11: HOW Question: Background C++ timer thread counts down independently.",
  "Step 12: '3: Last' prints to console. Main script finishes synchronous turn.",
  "Step 13: WHERE Question: When 1000ms passes, callback goes to Macrotask Queue.",
  "Step 14: 1000ms passes in background. Web API pushes callback to Macrotask Queue.",
  "Step 15: Event Loop checks: Call Stack is completely clear (Depth = 0).",
  "Step 16: WHEN Question: Event Loop moves callback onto Call Stack.",
  "Step 17: Callback executes on Call Stack: console.log('2: Timeout Callback').",
  "Step 18: Console prints: '2: Timeout Callback'.",
  "Step 19: Callback pops off Call Stack. Macrotask turn complete!",
  "Step 20: Final Order: '1: First' -> '3: Last' -> '2: Timeout Callback'!"
]

const questions = [
  {
    type: 'WHAT' as const,
    q: "Is setTimeout built into the JavaScript V8 engine?",
    a: "NO! setTimeout is a browser/host Web API. V8 has no timer hardware or sleep syscalls.",
    revealStep: 9,
    pinpoint: "V8 Engine = Bytecode & Memory; Browser = Timers & DOM"
  },
  {
    type: 'HOW' as const,
    q: "How does the 1000ms countdown happen without freezing JS?",
    a: "The browser host tracks the timer on a background C++ thread, freeing the JS main thread.",
    revealStep: 11,
    pinpoint: "Parallel hardware timer offloads work from single thread"
  },
  {
    type: 'WHERE' as const,
    q: "Where does the callback go when 1000ms expires?",
    a: "It is pushed into the Macrotask (Callback) Queue. It CANNOT jump straight to the Call Stack!",
    revealStep: 13,
    pinpoint: "Queue buffer prevents collision with active stack frames"
  },
  {
    type: 'WHEN' as const,
    q: "When does the callback finally execute?",
    a: "ONLY after Call Stack reaches 0 AND the Event Loop dequeues it. Delay is a MINIMUM, not exact.",
    revealStep: 16,
    pinpoint: "setTimeout(fn, 1000) guarantees: 'Wait AT LEAST 1000ms'"
  }
]

const lineMap = [0, 1, 1, 3, 3, 3, 3, 3, 5, 5, 7, 7, 7, 7, 3, 3, 4, 4, 4, 5, 5]
function getLine(step: number = 0) {
  const idx = Math.max(0, Math.min(step ?? 0, lineMap.length - 1))
  return lineMap[idx]
}
</script>

<SlLayout
  topic="How setTimeout() Works Internally: Host Web APIs"
  pair="Topic 3 • Slide 1/2"
  :step="$clicks"
  :captions="captions"
  phase="concept"
>
  <div class="slide-grid">
    <div class="col-left">
      <CodePanel
        title="settimeout-anatomy.js"
        :lines="codeLines"
        :active-line="getLine($clicks)"
        :highlight-lines="$clicks >= 3 && $clicks <= 8 ? [3, 4, 5] : []"
        tag="Host Web API"
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
  "Step 0: Initializing setTimeout lifecycle simulation.",
  "Step 1: Line 1: console.log('1: First') pushes to Call Stack.",
  "Step 2: Log executes: '1: First' printed. Stack frame pops.",
  "Step 3: Line 2: setTimeout(cb, 1000) pushes to Call Stack.",
  "Step 4: Engine registers timer in Browser Web APIs: Timer #1 (1000ms).",
  "Step 5: setTimeout() pops off the Call Stack! Main thread is immediately free.",
  "Step 6: Line 5: console.log('3: Last') pushes to Call Stack.",
  "Step 7: Log executes: '3: Last' printed to console terminal.",
  "Step 8: Line 5: console.log pops. Synchronous script execution finished!",
  "Step 9: Call Stack is empty! Event Loop polls stack and queues.",
  "Step 10: Web API timer thread: 250ms elapsed... (750ms remaining).",
  "Step 11: Web API timer thread: 500ms elapsed... (500ms remaining).",
  "Step 12: Web API timer thread: 750ms elapsed... (250ms remaining).",
  "Step 13: Web API timer thread: 1000ms elapsed! Timer COMPLETE.",
  "Step 14: Web API pushes callback () => console.log('2: Timeout') to MACROTASK QUEUE.",
  "Step 15: Event Loop check 1: Is Call Stack empty? YES (0 frames).",
  "Step 16: Event Loop check 2: Is Microtask Queue empty? YES (0 microtasks).",
  "Step 17: Event Loop dequeues callback from Macrotask Queue onto Call Stack!",
  "Step 18: Callback frame active on Call Stack: executing line 3.",
  "Step 19: console.log('2: Timeout') executes and prints to stdout!",
  "Step 20: Callback pops off Call Stack. All queues empty. Lifecycle complete!"
]

const traceStates = [
  { stack: ['global()'], webApis: [], macro: [], logs: [], loop: 'Script Starting', phase: 'stack' as const, line: 0, rule: 'Global scope ready' },
  { stack: ['global()', 'console.log("1: First")'], webApis: [], macro: [], logs: [], loop: 'Executing sync log', phase: 'stack' as const, line: 1, rule: 'Sync log 1' },
  { stack: ['global()'], webApis: [], macro: [], logs: ['1: First'], loop: 'Log popped', phase: 'console' as const, line: 1, rule: 'Stdout: 1: First' },
  { stack: ['global()', 'setTimeout(cb, 1000)'], webApis: [], macro: [], logs: ['1: First'], loop: 'Calling Web API', phase: 'stack' as const, line: 2, rule: 'Invoking host timer API' },
  { stack: ['global()', 'setTimeout(cb, 1000)'], webApis: ['Timer (1000ms: 1000ms left)'], macro: [], logs: ['1: First'], loop: 'Timer registered in Web API', phase: 'webapi' as const, line: 2, rule: 'Offloaded to background C++' },
  { stack: ['global()'], webApis: ['Timer (1000ms: 900ms left)'], macro: [], logs: ['1: First'], loop: 'setTimeout popped from stack', phase: 'stack' as const, line: 5, rule: 'Non-blocking: stack returned' },
  { stack: ['global()', 'console.log("3: Last")'], webApis: ['Timer (1000ms: 800ms left)'], macro: [], logs: ['1: First'], loop: 'Executing sync log 3', phase: 'stack' as const, line: 5, rule: 'Sync log 3' },
  { stack: ['global()', 'console.log("3: Last")'], webApis: ['Timer (1000ms: 700ms left)'], macro: [], logs: ['1: First', '3: Last'], loop: 'Log 3 printed', phase: 'console' as const, line: 5, rule: 'Stdout: 3: Last' },
  { stack: ['global()'], webApis: ['Timer (1000ms: 600ms left)'], macro: [], logs: ['1: First', '3: Last'], loop: 'Sync script finished', phase: 'stack' as const, line: 5, rule: 'Stack preparing to empty' },
  { stack: [], webApis: ['Timer (1000ms: 500ms left)'], macro: [], logs: ['1: First', '3: Last'], loop: 'Stack empty. Waiting on timers...', phase: 'loop' as const, line: 5, rule: 'Event Loop in idle poll' },
  { stack: [], webApis: ['Timer (1000ms: 750ms left)'], macro: [], logs: ['1: First', '3: Last'], loop: 'Counting down in background...', phase: 'webapi' as const, line: 4, rule: '25% elapsed' },
  { stack: [], webApis: ['Timer (1000ms: 500ms left)'], macro: [], logs: ['1: First', '3: Last'], loop: 'Counting down in background...', phase: 'webapi' as const, line: 4, rule: '50% elapsed' },
  { stack: [], webApis: ['Timer (1000ms: 250ms left)'], macro: [], logs: ['1: First', '3: Last'], loop: 'Counting down in background...', phase: 'webapi' as const, line: 4, rule: '75% elapsed' },
  { stack: [], webApis: ['Timer [EXPIRED 1000ms]'], macro: [], logs: ['1: First', '3: Last'], loop: 'Timer reached 0ms!', phase: 'webapi' as const, line: 4, rule: 'Web API triggers callback transfer' },
  { stack: [], webApis: [], macro: ['callback() [from timer]'], logs: ['1: First', '3: Last'], loop: 'Callback enqueued to Macrotasks', phase: 'macro' as const, line: 4, rule: 'Buffered in Macrotask queue' },
  { stack: [], webApis: [], macro: ['callback() [from timer]'], logs: ['1: First', '3: Last'], loop: 'Event loop: Stack is empty!', phase: 'loop' as const, line: 3, rule: 'Pre-condition satisfied: Stack == 0' },
  { stack: [], webApis: [], macro: ['callback() [from timer]'], logs: ['1: First', '3: Last'], loop: 'Event loop: Microtasks are empty!', phase: 'loop' as const, line: 3, rule: 'Pre-condition satisfied: Microtasks == 0' },
  { stack: ['callback()'], webApis: [], macro: [], logs: ['1: First', '3: Last'], loop: 'Dequeued to Call Stack!', phase: 'stack' as const, line: 3, rule: 'Push frame: callback' },
  { stack: ['callback()', 'console.log("2: Timeout")'], webApis: [], macro: [], logs: ['1: First', '3: Last'], loop: 'Executing callback body', phase: 'stack' as const, line: 3, rule: 'Callback running on stack' },
  { stack: ['callback()'], webApis: [], macro: [], logs: ['1: First', '3: Last', '2: Timeout'], loop: 'Stdout printed: 2: Timeout', phase: 'console' as const, line: 3, rule: 'Stdout flushed' },
  { stack: [], webApis: [], macro: [], logs: ['1: First', '3: Last', '2: Timeout'], loop: 'All tasks completed successfully!', phase: 'idle' as const, line: 4, rule: 'Total elapsed time: ~1000ms' }
]

function getState(step: number = 0) {
  const idx = Math.max(0, Math.min(step ?? 0, traceStates.length - 1))
  return traceStates[idx] || traceStates[0]
}
</script>

<SlLayout
  topic="setTimeout Web API: 21-Step Lifecycle Simulation"
  pair="Topic 3 • Slide 2/2"
  :step="$clicks"
  :captions="captions"
  phase="demo"
>
  <div class="slide-grid-sim">
    <div class="col-code">
      <CodePanel
        title="settimeout-lifecycle.js"
        :lines="codeLines"
        :active-line="getState($clicks).line"
        tag="Lifecycle Trace"
      />
    </div>
    <div class="col-engine">
      <EngineVisualizer
        :state="{
          stack: getState($clicks).stack,
          webApis: getState($clicks).webApis,
          microtasks: [],
          macrotasks: getState($clicks).macro,
          logs: getState($clicks).logs,
          loopStatus: getState($clicks).loop,
          loopPhase: getState($clicks).phase,
          pinpointRule: getState($clicks).rule,
          activeComponent: getState($clicks).phase === 'console' ? 'console' : (getState($clicks).phase === 'webapi' ? 'webapi' : (getState($clicks).phase === 'macro' ? 'macro' : (getState($clicks).phase === 'loop' ? 'loop' : 'stack')))
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
