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
  "  // Synchronous blocking loop (3 seconds)",
  "  while (Date.now() - start < 3000) {",
  "    /* monopolizing the single thread */",
  "  }",
  "  console.log('2: Heavy compute finished');",
  "}",
  "",
  "heavyCompute();",
  "",
  "console.log('3: End');"
]

const captions = [
  "Topic 1: Why JavaScript is Single-Threaded — Starting with synchronous blocking code.",
  "Line 1 executes immediately on the single thread: '1: Start' prints to the console.",
  "Line 12 invokes heavyCompute(): A new frame is pushed onto the Call Stack.",
  "Lines 6-8 run a tight while-loop for 3,000ms. Why does the entire webpage freeze?",
  "Line 14 cannot execute until heavyCompute() returns: Single thread means strictly one task at a time."
]

const questions = [
  {
    type: 'WHAT' as const,
    q: "What does 'single-threaded' actually mean in JS?",
    a: "The JS Engine (V8) has exactly ONE Call Stack and ONE Memory Heap — running 1 instruction at a time.",
    revealStep: 1
  },
  {
    type: 'HOW' as const,
    q: "How does the Call Stack execute this code?",
    a: "Functions push stack frames onto the top. A frame MUST finish executing before anything else can run.",
    revealStep: 2
  },
  {
    type: 'WHERE' as const,
    q: "Where does the browser freeze occur?",
    a: "On the Main Thread! The browser DOM rendering and JS execution share this single thread.",
    revealStep: 3
  },
  {
    type: 'WHEN' as const,
    q: "When can user clicks or CSS animations resume?",
    a: "ONLY after the while loop finishes and heavyCompute() pops completely off the stack!",
    revealStep: 4
  }
]
</script>

<SlLayout
  topic="Why JavaScript is Single-Threaded"
  pair="Topic 1 • Slide 1/2"
  :step="$clicks"
  :captions="captions"
  phase="concept"
>
  <div class="slide-grid">
    <div class="col-left">
      <CodePanel
        title="single-threaded-block.js"
        :lines="codeLines"
        :active-line="$clicks === 1 ? 1 : ($clicks === 2 ? 12 : ($clicks === 3 ? 6 : ($clicks === 4 ? 14 : 0)))"
        :highlight-lines="$clicks === 3 ? [6, 7, 8] : []"
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
<!-- TOPIC 1 • SLIDE 2 OF 2: EXECUTION SIMULATOR -->
<!-- ========================================== -->
<script setup lang="ts">
import { computed } from 'vue'
import SlLayout from '../components/SlLayout.vue'
import CodePanel from '../components/CodePanel.vue'
import ThreadBox from '../components/ThreadBox.vue'
import CallStack from '../components/CallStack.vue'

const codeLines = [
  "console.log('1: Start');",
  "heavyCompute();",
  "console.log('3: End');"
]

const captions = [
  "Interactive Trace: Watch how the single main thread behaves during a blocking operation.",
  "Step 1: '1: Start' executes. Call Stack pushes and pops console.log.",
  "Step 2: heavyCompute() is called. Stack pushes heavyCompute().",
  "Step 3: Inside heavyCompute(): 3000ms loop runs. The Main Thread is BLOCKED. UI is frozen!",
  "Step 4: heavyCompute() finishes and pops off the stack. Thread unfreezes.",
  "Step 5: '3: End' executes. Stack clears. Page becomes responsive again."
]

// Step-driven simulation states
const stepsState = [
  { frames: ['global()'], blocked: false, op: 'Starting script execution', line: 1 },
  { frames: ['global()'], blocked: false, op: 'console.log("1: Start")', line: 1 },
  { frames: ['global()', 'heavyCompute()'], blocked: false, op: 'Entering heavyCompute()', line: 2 },
  { frames: ['global()', 'heavyCompute()', 'while(loop 3s)'], blocked: true, op: 'BLOCKED: while(Date.now() - start < 3000)', line: 2 },
  { frames: ['global()'], blocked: false, op: 'heavyCompute() resolved & popped', line: 2 },
  { frames: [], blocked: false, op: 'console.log("3: End") -> Execution Complete', line: 3 }
]

const current = computed(() => {
  const idx = Math.min($clicks, stepsState.length - 1)
  return stepsState[idx]
})
</script>

<SlLayout
  topic="Single Thread Architecture & UI Blocking"
  pair="Topic 1 • Slide 2/2"
  :step="$clicks"
  :captions="captions"
  phase="demo"
>
  <div class="slide-grid-sim">
    <!-- Left Column: Compact Code -->
    <div class="col-code">
      <CodePanel
        title="blocking-trace.js"
        :lines="codeLines"
        :active-line="current.line"
        tag="Trace"
      />
      <div class="callstack-box">
        <CallStack :frames="current.frames" />
      </div>
    </div>

    <!-- Right Column: Single Thread vs Browser Host -->
    <div class="col-thread">
      <ThreadBox
        :blocked="current.blocked"
        :active-operation="current.op"
      />
    </div>
  </div>
</SlLayout>

<style scoped>
.slide-grid-sim {
  display: grid;
  grid-template-columns: 1fr 1.3fr;
  gap: 12px;
  height: 100%;
  padding: 10px 14px;
  box-sizing: border-box;
}
.col-code {
  display: flex;
  flex-direction: column;
  gap: 8px;
  height: 100%;
  overflow: hidden;
}
.callstack-box {
  flex: 1;
  min-height: 130px;
}
.col-thread {
  height: 100%;
  overflow: hidden;
}
</style>
