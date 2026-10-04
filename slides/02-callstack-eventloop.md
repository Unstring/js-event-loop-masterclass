---
layout: default
clicks: 12
---

<Slide05CallStack :step="$clicks" />

<!--
Slide 5: Call Stack in Action: Nested LIFO Execution.
Walk through nested function invocations:
- Calling a function pauses the caller frame and pushes a new frame.
- Frame on top has exclusive thread control.
- Returning a value pops the frame and passes the result downwards.
-->

---
layout: default
clicks: 12
---

<ThreadVsEventLoop :step="$clicks" title="Why Not Multi-Threading? The DOM Concurrency Hazard" />

<!--
Slide 6: Why Not Multi-Threading?
Demonstrate the DOM race condition:
Thread A computes layout for #box while Thread B removes #box from memory.
Without mutexes, the browser crashes with null pointer dereference.
With mutexes, the UI freezes with deadlocks.
JavaScript's single thread eliminates this hazard!
-->

---
layout: default
clicks: 12
---

<Slide07StackOverflow :step="$clicks" />

<!--
Slide 7: Call Stack Overflow & Memory Exhaustion.
Show what happens when recursion lacks a base case:
Stack frame counter climbs to ~10,420 frames in V8 until the Stack Guard triggers RangeError.
Demonstrate solutions: Base cases, iteration, trampolines, and async offloading.
-->

---
layout: default
clicks: 20
---

<Slide08HostEnvironments :step="$clicks" />

<!--
Slide 8: The Host Superpower: Browser Web APIs vs Node.js libuv.
Clarify that while JS is single-threaded inside V8, the host environment is massively multi-threaded!
- Browser: Chromium C++ Network, Timer, Audio, and GPU compositor threads.
- Node.js: libuv event demultiplexer (epoll/kqueue) + 4-thread Worker Pool (UV_THREADPOOL_SIZE).
-->
