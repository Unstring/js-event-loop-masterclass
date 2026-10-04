---
layout: default
clicks: 20
---

<EventLoopDiagram :step="$clicks" title="The Event Loop: The Infinite Non-Blocking Heartbeat" />

<!--
Slide 9: The Event Loop Heartbeat Cycle.
Explain the infinite heartbeat check:
Is Stack empty?
Drain Microtasks (100%).
Check 60fps Render opportunity.
Dequeue 1 Macrotask.
Repeat forever!
-->

---
layout: default
clicks: 20
---

<Slide10SetTimeoutZero :step="$clicks" />

<!--
Slide 10: setTimeout(fn, 0): The Zero Millisecond Myth.
Debunk the 0ms myth:
The delay is the MINIMUM time before the callback enters the Macrotask Queue.
If the Call Stack is blocked by a 2000ms loop, the callback waits 2000ms!
-->

---
layout: default
clicks: 20
---

<TimerInternalsVisualizer :step="$clicks" title="Timer Internals: OS / libuv Min-Heap & Timer Wheel" />

<!--
Slide 11: Timer Internals: Min-Heap Priority Queue.
Explain how the browser manages thousands of timers:
Min-Heap data structure with O(log n) insertion.
Earliest timer bubbles to the root; OS sets hardware timer for that exact timestamp.
-->

---
layout: default
clicks: 20
---

<Slide12TimerClamping :step="$clicks" />

<!--
Slide 12: Timer Drift & The 4ms HTML5 Clamping Rule.
Walk through the HTML5 specification:
Nested timers at depth >= 5 are clamped to minimum 4ms.
Background/inactive tabs are throttled to 1000ms (1 second) to conserve battery.
-->
