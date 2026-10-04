<script setup lang="ts">
import SlLayout from '../components/SlLayout.vue'
import CodePanel from '../components/CodePanel.vue'
import QuestionCards from '../components/QuestionCards.vue'

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
  "Master Puzzle: Can you predict the exact console output order of this script?",
  "Notice lines 1 & 18: Purely synchronous statements that run immediately on the Call Stack.",
  "Notice line 3: setTimeout with 0ms delay. Why does 0ms NOT execute immediately?",
  "Notice lines 7-9: Promise microtasks. What makes them jump ahead of setTimeout?",
  "Notice lines 11-16: async/await syntax. How does await pause execution without freezing JS?",
  "The 4 Core Questions: WHAT, HOW, WHERE, WHEN form the blueprint of the Event Loop."
]

const questions = [
  {
    type: 'WHAT' as const,
    q: 'What is the exact console output order?',
    a: '1 → 5 → 7 → 3 → 6 → 4 → 2! (Sync → Microtasks → Macrotasks)',
    revealStep: 1
  },
  {
    type: 'HOW' as const,
    q: 'How does JS handle concurrency with 1 single thread?',
    a: 'The engine offloads asynchronous tasks to multi-threaded Browser Web APIs.',
    revealStep: 2
  },
  {
    type: 'WHERE' as const,
    q: 'Where do waiting callbacks live in memory?',
    a: 'In two queues: Microtask Queue (Promises) & Macrotask Queue (setTimeout).',
    revealStep: 3
  },
  {
    type: 'WHEN' as const,
    q: 'When does the Event Loop move tasks to the Call Stack?',
    a: 'ONLY when the Call Stack is 100% empty! Microtasks always drain first.',
    revealStep: 4
  }
]
</script>

<SlLayout
  topic="The Master Mystery & 4 Core Questions"
  pair="Overview • Grand Puzzle"
  :step="$clicks"
  :captions="captions"
  phase="intro"
>
  <div class="slide-grid">
    <!-- Left Column: Complete Code Snippet -->
    <div class="col-left">
      <CodePanel
        title="event-loop-puzzle.js"
        :lines="codeLines"
        :active-line="$clicks === 1 ? 1 : ($clicks === 2 ? 3 : ($clicks === 3 ? 7 : ($clicks === 4 ? 11 : 0)))"
        :highlight-lines="$clicks === 1 ? [1, 18] : ($clicks === 2 ? [3, 4, 5] : ($clicks === 3 ? [7, 8, 9] : ($clicks === 4 ? [11, 12, 13, 14, 15, 16] : [])))"
        tag="All 5 Concepts"
      />
    </div>

    <!-- Right Column: The 4 Core Questions -->
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
