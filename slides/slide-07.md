---
clicks: 25
layout: default
---

<script setup lang="ts">
import ExecutionContextDemo from '../components/ExecutionContextDemo.vue'
import CaptionBar from '../components/CaptionBar.vue'
import PersistentLegend from '../components/PersistentLegend.vue'
import ProgressBar from '../components/ProgressBar.vue'

const captions = [
  "Execution Context Lifecycle: Every stack frame undergoes a TWO-PHASE lifecycle.",
  "Phase 1: The CREATION PHASE (Compiler / Engine scan before any line runs).",
  "The engine sets up: 1. `this` binding, 2. VariableEnvironment, 3. LexicalEnvironment.",
  "Hoisting occurs here: Function declarations are copied in full into memory.",
  "`var` variables are registered in VariableEnvironment and initialized to `undefined`.",
  "`let` and `const` variables are registered in LexicalEnvironment in the Temporal Dead Zone (TDZ).",
  "Phase 2: The EXECUTION PHASE (Bytecode runs line-by-line, assigning values).",
  "Now let's examine Snippet 4: The classic closure loop interview question!",
  "Loop 1: `for (var i = 0; i < 3; i++) setTimeout(() => console.log(i), 0);`",
  "Because `var` has NO block scope, `i` belongs to the GLOBAL VariableEnvironment.",
  "Iteration 0: i = 0. Timer callback is registered with a closure capturing the pointer to `i`.",
  "Iteration 1: i = 1. Second callback registered, pointing to the EXACT SAME memory slot.",
  "Iteration 2: i = 2. Third callback registered, pointing to the exact same slot.",
  "Loop terminates when `i++` reaches 3. The loop finishes synchronously.",
  "Global Call Stack empties. Event Loop now pulls the three timer callbacks from the queue.",
  "Callback 1 runs: Reads `i`. What is in that memory slot? 3!",
  "Callback 2 runs: Reads `i`. The slot still contains 3!",
  "Callback 3 runs: Reads `i`. It logs 3! Final output: `3, 3, 3`.",
  "Now look at Loop 2: `for (let j = 0; j < 3; j++) setTimeout(() => console.log(j), 0);`",
  "In ECMAScript specification: `let` in a for-loop creates a BRAND NEW Lexical Scope PER ITERATION!",
  "Iteration 0: Scope 0 is created with `j = 0`. Callback 0 closes over Scope 0.",
  "Iteration 1: Scope 1 is created with `j = 1`. Callback 1 closes over Scope 1.",
  "Iteration 2: Scope 2 is created with `j = 2`. Callback 2 closes over Scope 2.",
  "When the timers fire: Callback 0 reads Scope 0 (`0`), Callback 1 reads Scope 1 (`1`), Callback 2 reads Scope 2 (`2`).",
  "Takeaway: Closures capture VARIABLE REFERENCES (environment bindings), not literal values!"
]
</script>

<div class="h-full flex flex-col justify-between py-1 select-none">
  <PersistentLegend />
  <ProgressBar :step="$clicks" :total-steps="25" :slide-number="7" :total-slides="20" />

  <CaptionBar
    :caption="captions[Math.min($clicks, captions.length - 1)]"
    :phase="$clicks <= 6 ? 'sync' : 'macrotasks'"
    :is-last="$clicks >= 24"
    takeaway="var shares one global slot (3 3 3); let creates a new lexical environment binding per loop iteration (0 1 2)."
  />

  <div class="flex-1 my-1">
    <ExecutionContextDemo :step="Math.floor($clicks / 5)" />
  </div>
</div>

<!--
SPEAKER NOTES:
[Click 0-6]: Explain the Creation Phase vs Execution Phase. Emphasize that hoisting is just memory allocation during creation phase.
[Click 7-18]: Trace the var loop. Show how all 3 callbacks reference the same single memory address for i.
[Click 19-24]: Contrast with the let loop. Explain ES6 spec creating a fresh lexical binding per iteration.
-->
