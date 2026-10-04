---
layout: default
clicks: 20
---

<Slide01Roadmap :step="$clicks" />

<!--
Slide 1: Masterclass Roadmap & Interactive Overview.
Step through the 20 milestones with spacebar.
Explain the single-threaded asynchronous nature of JavaScript.
-->

---
layout: default
clicks: 22
---

<RuntimeSimulator :step="$clicks" scenario="mystery" title="The Great JavaScript Mystery: What Logs First?" />

<!--
Slide 2: The Mystery Code Puzzle.
Step through each of the 22 execution micro-steps:
1. console.log('1. Start') runs synchronously.
2. setTimeout(cb, 0) handed to Web APIs.
3. Promise.resolve().then(cb) enters Microtasks.
4. queueMicrotask(cb) enters Microtasks.
5. console.log('2. End') runs synchronously.
6. Call Stack empty -> Microtasks drain 100% (Promise, Microtask).
7. Macrotask dequeues: Timeout!
Output: 1 -> 2 -> 3 -> 4 -> 5!
-->

---
layout: default
clicks: 20
---

<Slide03HeapStack :step="$clicks" />

<!--
Slide 3: V8 Engine Under the Hood.
Explain Memory Heap vs Call Stack:
- Heap stores objects, arrays, and closures with dynamic references (0x10A, 0x20F).
- Call Stack executes functions with hardware-speed LIFO pointers.
- Trace the Mark & Sweep garbage collector cleaning orphan memory!
-->

---
layout: default
clicks: 14
---

<ExecutionContextVisualizer :step="$clicks" title="Execution Context: Creation Phase, Hoisting & TDZ" />

<!--
Slide 4: Execution Context Lifecycle.
Step through Creation Phase vs Execution Phase:
- Creation: var initialized to undefined; let & const placed in Temporal Dead Zone (TDZ); functions hoisted.
- Execution: Line-by-line assignment, TDZ clearance, and function invocation.
-->
