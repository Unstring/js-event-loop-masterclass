---
layout: default
clicks: 20
---

<QueueVisualizer :step="$clicks" title="Two-Tier Concurrency: Microtasks vs Macrotasks" />

<!--
Slide 13: Two-Tier Concurrency: Microtask VIP Queue.
Explain the queue priority:
Microtasks (Promises, queueMicrotask, MutationObserver) always jump ahead of Macrotasks (timers, clicks, I/O).
The Event Loop drains microtasks to 100% before touching any macrotask.
-->

---
layout: default
clicks: 20
---

<Slide14Starvation :step="$clicks" />

<!--
Slide 14: Microtask Starvation: Freezing the Browser Window.
Demonstrate starvation:
queueMicrotask(recurse) traps the event loop in microtask drain phase.
Clicks, animations, and renders are starved; tab freezes at 0 FPS.
Contrast with cooperative macrotask loop via setTimeout(0).
-->

---
layout: default
clicks: 20
---

<Slide15MacrotaskTurn :step="$clicks" />

<!--
Slide 15: The Macrotask Lifecycle: One Task Per Turn.
Explain task fairness:
Only ONE macrotask dequeues per turn.
Between macrotasks, the event loop yields to microtasks and browser rendering.
-->

---
layout: default
clicks: 20
---

<RenderPipelineVisualizer :step="$clicks" title="Browser Render Pipeline & The 16.6ms 60fps Budget" />

<!--
Slide 16: The Browser Render Pipeline.
Explain the 16.6ms frame budget:
Task -> Microtask Drain -> requestAnimationFrame -> Style -> Layout -> Paint -> Composite.
If JS blocks for >16.6ms, a frame is dropped and the user sees jank!
-->
