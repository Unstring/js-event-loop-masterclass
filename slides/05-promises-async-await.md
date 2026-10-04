---
layout: default
clicks: 20
---

<PromiseStateVisualizer :step="$clicks" title="Promise Machine: Internal Slots & Reaction Records" />

<!--
Slide 17: Promise Internals & State Machine.
Explain the ECMAScript internal slots:
[[PromiseState]], [[PromiseResult]], and [[PromiseFulfillReactions]].
Calling .then() on an already-resolved promise still schedules a microtask to avoid Zälgo.
-->

---
layout: default
clicks: 20
---

<Slide18PromiseChaining :step="$clicks" />

<!--
Slide 18: Chained Promises & The 2-Microtask Unwrap Penalty.
Explain why returning a Promise from .then() requires 2 extra microtask ticks:
PromiseResolveThenableJob inspects the .then property to flatten the promise chain.
-->

---
layout: default
clicks: 20
---

<Slide19AsyncAwait :step="$clicks" />

<!--
Slide 19: async / await: Non-Blocking Coroutines.
Show how await pauses the function execution context and pops it off the stack, leaving the thread unblocked.
When the awaited promise settles, a microtask repushes the frame to resume!
-->

---
layout: default
clicks: 20
---

<Slide20GrandQuiz :step="$clicks" />

<!--
Slide 20: Grand Final Synthesis & Live Diagnostic Quiz.
Trace the 7-line puzzle: 1 -> 5 -> 7 -> 3 -> 6 -> 4 -> 2.
Run through the 5 interactive quiz questions.
Congratulate the audience on mastering the Event Loop!
-->
