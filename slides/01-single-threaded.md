<!-- ========================================== -->
<!-- TOPIC 1 • SLIDE 1 OF 2: CODE & QUESTIONS    -->
<!-- ========================================== -->
<script setup lang="ts">
import SlLayout from '../components/SlLayout.vue'
import CodePanel from '../components/CodePanel.vue'
import QuestionCards from '../components/QuestionCards.vue'

const codeLines = [
  "console.log('1: Start');",
  "",
  "function heavyCompute() {",
  "  const start = Date.now();",
  "  console.log('2: Entering heavyCompute');",
  "  while (Date.now() - start < 3000) {",
  "    // Synchronously monopolizing the thread",
  "  }",
  "  console.log('3: Heavy computation done');",
  "}",
  "",
  "heavyCompute();",
  "",
  "console.log('4: End of script');"
]

const captions = [
  "Step 0: Engine loads script. The single Main Thread prepares for execution.",
  "Step 1: Line 1 executes — console.log('1: Start') runs immediately on Call Stack.",
  "Step 2: '1: Start' logged. Stack frame pops. Main thread advances to line 3.",
  "Step 3: Line 3-10: heavyCompute function declared and stored in memory heap.",
  "Step 4: Line 12: heavyCompute() invoked. Pushed directly to Call Stack.",
  "Step 5: Inside heavyCompute: const start = Date.now() timestamp captured.",
  "Step 6: Line 5: console.log('2: Entering heavyCompute') pushed to stack.",
  "Step 7: Log executes: '2: Entering heavyCompute' printed. Stack pops log.",
  "Step 8: Line 6: while-loop starts! Single thread enters a continuous spin for 3000ms.",
  "Step 9: Thread status: 100% CPU on Main Thread. No other code can run!",
  "Step 10: WHAT Question Revealed: Exactly ONE Call Stack and ONE Memory Heap.",
  "Step 11: Millisecond 1000: Loop still spinning. User tries clicking a button on page.",
  "Step 12: Browser receives click event, but cannot process it — Main Thread is busy!",
  "Step 13: HOW Question Revealed: Stack frames must return before anything else runs.",
  "Step 14: Millisecond 2000: CSS animations stutter and freeze completely.",
  "Step 15: WHERE Question Revealed: The freeze happens directly on the UI Main Thread.",
  "Step 16: Millisecond 3000: Date.now() - start >= 3000. Loop condition finally fails!",
  "Step 17: Line 9: console.log('3: Heavy computation done') pushes and prints.",
  "Step 18: heavyCompute() completes and pops off the Call Stack.",
  "Step 19: WHEN Question Revealed: Browser unfreezes only when stack depth reaches 0!",
  "Step 20: Line 14: console.log('4: End of script') executes. All synchronous work done!"
]

const questions = [
  {
    type: 'WHAT' as const,
    q: "What does 'single-threaded' actually mean in JS?",
    a: "V8 has ONE Call Stack and ONE Memory Heap. It executes strictly one instruction at any single moment.",
    revealStep: 10,
    pinpoint: "1 Thread = 1 Call Stack = 0 Concurrent JS Executions"
  },
  {
    type: 'HOW' as const,
    q: "How does the Call Stack execute this code?",
    a: "Functions push stack frames onto the top. A frame MUST finish executing before caller code can resume.",
    revealStep: 13,
    pinpoint: "LIFO: Last-In, First-Out Execution Rule"
  },
  {
    type: 'WHERE' as const,
    q: "Where does the browser freeze occur?",
    a: "On the Main Thread! HTML parsing, DOM rendering, style calculations, and JS share the same thread.",
    revealStep: 15,
    pinpoint: "Rendering and JavaScript share 1 UI thread"
  },
  {
    type: 'WHEN' as const,
    q: "When can user clicks or CSS animations resume?",
    a: "ONLY after heavyCompute() pops completely off the stack and stack depth returns to 0!",
    revealStep: 19,
    pinpoint: "Stack must reach 0 before browser can paint 60fps"
  }
]

const lineMap = [0, 1, 1, 3, 12, 4, 5, 5, 6, 6, 6, 6, 6, 6, 6, 6, 6, 9, 12, 12, 14]
function getLine(step: number = 0) {
  const idx = Math.max(0, Math.min(step ?? 0, lineMap.length - 1))
  return lineMap[idx]
}
</script>

<SlLayout
  topic="Why JavaScript is Single-Threaded: Architecture"
  pair="Topic 1 • Slide 1/2"
  :step="$clicks"
  :captions="captions"
  phase="concept"
>
  <div class="slide-grid">
    <div class="col-left">
      <CodePanel
        title="single-threaded.js"
        :lines="codeLines"
        :active-line="getLine($clicks)"
        :highlight-lines="$clicks >= 8 && $clicks <= 16 ? [6, 7, 8] : []"
        tag="Synchronous"
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
<!-- TOPIC 1 • SLIDE 2 OF 2: UI FREEZE SIMULATOR -->
<!-- ========================================== -->
<script setup lang="ts">
import SlLayout from '../components/SlLayout.vue'
import CodePanel from '../components/CodePanel.vue'
import EngineVisualizer from '../components/EngineVisualizer.vue'

const codeLines = [
  "console.log('1: Start');",
  "function blockThread() {",
  "  const end = Date.now() + 3000;",
  "  while (Date.now() < end) {}",
  "}",
  "blockThread();",
  "console.log('2: End');"
]

const captions = [
  "Step 0: Initializing single thread execution trace.",
  "Step 1: Line 1: console.log('1: Start') pushes to Call Stack.",
  "Step 2: '1: Start' outputs to console. Call Stack pops log.",
  "Step 3: Line 2: function blockThread declared.",
  "Step 4: Line 6: blockThread() invoked! Pushes to Call Stack.",
  "Step 5: Line 3: const end = Date.now() + 3000 calculated in memory heap.",
  "Step 6: Line 4: while-loop starts spinning. Thread status: ACTIVE.",
  "Step 7: Millisecond 500: Main thread is occupied. CPU at 100%.",
  "Step 8: Millisecond 1000: Render thread attempts 60fps frame paint — BLOCKED!",
  "Step 9: Millisecond 1500: Browser window becomes unresponsive to user clicks.",
  "Step 10: Millisecond 2000: Cursor beachball / spinner appears on screen.",
  "Step 11: Millisecond 2500: Event queue fills with pending user interactions.",
  "Step 12: Millisecond 3000: while loop finishes! Thread unlocked.",
  "Step 13: blockThread() finishes execution and POPS off the Call Stack.",
  "Step 14: Thread idle! Browser immediately renders delayed layout changes.",
  "Step 15: Line 7: console.log('2: End') pushed to Call Stack.",
  "Step 16: '2: End' outputs to console. Frame pops.",
  "Step 17: Call Stack is 100% EMPTY! Normal 60fps rendering resumed.",
  "Step 18: Core Takeaway: JavaScript NEVER should run heavy synchronous loops on Main Thread!",
  "Step 19: Solution: Offload asynchronous work to Web APIs and the Event Loop!"
]

const traceStates = [
  { stack: ['global()'], loop: 'Idle', logs: [], line: 0, rule: 'Global scope ready' },
  { stack: ['global()', 'console.log()'], loop: 'Executing sync log', logs: [], line: 1, rule: 'Sync log executing' },
  { stack: ['global()'], loop: 'Log popped', logs: ['1: Start'], line: 1, rule: 'Stdout: 1: Start' },
  { stack: ['global()'], loop: 'Function declared', logs: ['1: Start'], line: 2, rule: 'blockThread in Heap' },
  { stack: ['global()', 'blockThread()'], loop: 'blockThread pushed', logs: ['1: Start'], line: 6, rule: 'Stack depth: 2' },
  { stack: ['global()', 'blockThread()'], loop: 'Computing target time', logs: ['1: Start'], line: 3, rule: 'end = timestamp + 3000ms' },
  { stack: ['global()', 'blockThread()', 'while() [0ms]'], loop: 'THREAD RUNNING (0ms)', logs: ['1: Start'], line: 4, rule: 'Single thread running loop' },
  { stack: ['global()', 'blockThread()', 'while() [500ms]'], loop: 'THREAD BUSY (500ms)', logs: ['1: Start'], line: 4, rule: 'CPU pinned at 100%' },
  { stack: ['global()', 'blockThread()', 'while() [1000ms]'], loop: '⚠️ RENDER BLOCKED (1000ms)', logs: ['1: Start'], line: 4, rule: 'Render tree cannot paint!' },
  { stack: ['global()', 'blockThread()', 'while() [1500ms]'], loop: '⛔ UI UNRESPONSIVE (1500ms)', logs: ['1: Start'], line: 4, rule: 'User clicks ignored!' },
  { stack: ['global()', 'blockThread()', 'while() [2000ms]'], loop: '⛔ UI FROZEN (2000ms)', logs: ['1: Start'], line: 4, rule: 'Browser shows beachball' },
  { stack: ['global()', 'blockThread()', 'while() [2500ms]'], loop: '⛔ UI FROZEN (2500ms)', logs: ['1: Start'], line: 4, rule: 'DOM events accumulating' },
  { stack: ['global()', 'blockThread()'], loop: 'Loop condition met (3000ms)', logs: ['1: Start'], line: 4, rule: 'Date.now() >= end' },
  { stack: ['global()'], loop: 'blockThread popped', logs: ['1: Start'], line: 6, rule: 'Thread released!' },
  { stack: ['global()'], loop: 'Flushing pending DOM paints', logs: ['1: Start'], line: 6, rule: '60fps rendering recovers' },
  { stack: ['global()', 'console.log()'], loop: 'Running final log', logs: ['1: Start'], line: 7, rule: 'Sync log executing' },
  { stack: ['global()'], loop: 'Final log complete', logs: ['1: Start', '2: End'], line: 7, rule: 'Stdout: 2: End' },
  { stack: [], loop: 'STACK EMPTY (Responsive)', logs: ['1: Start', '2: End'], line: 7, rule: 'Normal operation restored' },
  { stack: [], loop: 'Key Lesson: Do not block main thread', logs: ['1: Start', '2: End'], line: 7, rule: 'Async APIs prevent UI freezing' },
  { stack: [], loop: 'Next: How Event Loop Solves This', logs: ['1: Start', '2: End'], line: 7, rule: 'Web APIs provide non-blocking concurrency' }
]

function getState(step: number = 0) {
  const idx = Math.max(0, Math.min(step ?? 0, traceStates.length - 1))
  return traceStates[idx] || traceStates[0]
}
</script>

<SlLayout
  topic="Single Thread Execution: 20-Step UI Freeze Simulation"
  pair="Topic 1 • Slide 2/2"
  :step="$clicks"
  :captions="captions"
  phase="demo"
>
  <div class="slide-grid-sim">
    <div class="col-code">
      <CodePanel
        title="thread-freeze.js"
        :lines="codeLines"
        :active-line="getState($clicks).line"
        :highlight-lines="[4]"
        tag="Freeze Trace"
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
          pinpointRule: getState($clicks).rule,
          activeComponent: getState($clicks).stack.length ? 'stack' : 'console'
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
