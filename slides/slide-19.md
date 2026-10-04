---
clicks: 25
layout: default
---

<script setup lang="ts">
import RuntimeStage from '../components/RuntimeStage.vue'
import type { SimulatorStep } from '../composables/useSimulator'

const code = [
  "async function load() {",
  "  try {",
  "    console.log('fetching');",
  "    const res = await fetch('/api/users/1');",
  "    if (!res.ok) throw new Error('HTTP ' + res.status);",
  "    const user = await res.json();",
  "    console.log(user.name);",
  "  } catch (e) {",
  "    console.log('error:', e.message);",
  "  } finally {",
  "    console.log('cleanup');",
  "  }",
  "}",
  "load();",
  "console.log('after load call');"
]

const steps: SimulatorStep[] = [
  {
    line: 14,
    caption: "Real-World Async: Network Fetch, Try/Catch/Finally, and 404 Error Flow.",
    callStack: [{ name: "global()" }],
    phase: "sync"
  },
  {
    line: 14,
    caption: "Line 14: `load()` is invoked synchronously on Call Stack.",
    callStack: [{ name: "global()" }, { name: "load() [async]" }],
    phase: "sync"
  },
  {
    line: 3,
    caption: "Inside `load()` Line 3: `console.log('fetching')` executes.",
    callStack: [{ name: "global()" }, { name: "load() [async]" }, { name: "console.log('fetching')" }],
    phase: "sync"
  },
  {
    line: 3,
    caption: "'fetching' printed to console. Frame pops.",
    callStack: [{ name: "global()" }, { name: "load() [async]" }],
    console: ["fetching"],
    phase: "sync"
  },
  {
    line: 4,
    caption: "Line 4: `fetch('/api/users/1')` initiates network request with Host Web APIs.",
    callStack: [{ name: "global()" }, { name: "load() [async]" }, { name: "fetch(...)" }],
    webApis: [{ id: "f1", label: "fetch(/api/users/1)", progress: 20, timeLeft: "DNS/TLS -> Server", type: "fetch" }],
    console: ["fetching"],
    phase: "sync"
  },
  {
    line: 4,
    caption: "`await` suspends `load()`. Execution frame leaves Call Stack.",
    callStack: [{ name: "global()" }],
    webApis: [{ id: "f1", label: "fetch(/api/users/1)", progress: 50, timeLeft: "HTTP In-Flight", type: "fetch" }],
    tokenMovement: { from: "callStack", to: "webapi", label: "suspend load()" },
    console: ["fetching"],
    phase: "sync"
  },
  {
    line: 15,
    caption: "Line 15: `console.log('after load call')` executes synchronously.",
    callStack: [{ name: "global()" }, { name: "console.log('after load call')" }],
    webApis: [{ id: "f1", label: "fetch(/api/users/1)", progress: 75, timeLeft: "Waiting Server", type: "fetch" }],
    console: ["fetching"],
    phase: "sync"
  },
  {
    line: 15,
    caption: "'after load call' printed! Global script finishes. Call Stack is empty!",
    callStack: [],
    webApis: [{ id: "f1", label: "fetch(/api/users/1)", progress: 95, timeLeft: "Receiving Packets", type: "fetch" }],
    console: ["fetching", "after load call"],
    phase: "idle"
  },
  {
    line: 4,
    caption: "Host C++ network thread receives HTTP Response Headers from Server.",
    callStack: [],
    webApis: [{ id: "f1", label: "fetch(/api/users/1)", progress: 100, timeLeft: "HTTP 200 OK", type: "fetch" }],
    console: ["fetching", "after load call"],
    phase: "idle"
  },
  {
    line: 4,
    caption: "Network Promise resolves! Continuation of `load()` queued to Microtask Queue.",
    callStack: [],
    microtasks: ["load() resumption [micro]"],
    tokenMovement: { from: "webapi", to: "microtasks", label: "resumption microtask" },
    console: ["fetching", "after load call"],
    phase: "idle"
  },
  {
    line: 4,
    caption: "Event Loop pulls microtask: Restores `load()` frame back onto Call Stack!",
    callStack: [{ name: "load() [resumed]", locals: { res: "Response { ok: true }" } }],
    microtasks: [],
    tokenMovement: { from: "microtasks", to: "callStack", label: "restore load()" },
    console: ["fetching", "after load call"],
    phase: "microtasks"
  },
  {
    line: 5,
    caption: "Line 5: `res.ok` is true (status 200). `if (!res.ok)` is skipped.",
    callStack: [{ name: "load() [resumed]" }],
    console: ["fetching", "after load call"],
    phase: "microtasks"
  },
  {
    line: 6,
    caption: "Line 6: `await res.json()` parses body stream. Suspends briefly and resumes as microtask.",
    callStack: [{ name: "load() [resumed]", locals: { user: "{ name: 'Ada Lovelace' }" } }],
    console: ["fetching", "after load call"],
    phase: "microtasks"
  },
  {
    line: 7,
    caption: "Line 7: `console.log(user.name)` executes.",
    callStack: [{ name: "load() [resumed]" }, { name: "console.log('Ada Lovelace')" }],
    console: ["fetching", "after load call"],
    phase: "microtasks"
  },
  {
    line: 7,
    caption: "'Ada Lovelace' printed to console!",
    callStack: [{ name: "load() [resumed]" }],
    console: ["fetching", "after load call", "Ada Lovelace"],
    phase: "microtasks"
  },
  {
    line: 11,
    caption: "Line 11: `finally` block executes unconditionally: `console.log('cleanup')`.",
    callStack: [{ name: "load() [resumed]" }, { name: "console.log('cleanup')" }],
    console: ["fetching", "after load call", "Ada Lovelace"],
    phase: "microtasks"
  },
  {
    line: 11,
    caption: "'cleanup' printed! Success path complete.",
    callStack: [],
    console: ["fetching", "after load call", "Ada Lovelace", "cleanup"],
    phase: "idle"
  },
  {
    line: 5,
    caption: "Now examine the Failure Path: What if server returned HTTP 404 Not Found?",
    callStack: [],
    console: ["fetching", "after load call", "Ada Lovelace", "cleanup"],
    phase: "idle"
  },
  {
    line: 5,
    caption: "In 404 path: `res.ok` is false! Line 5 throws `new Error('HTTP 404')`.",
    callStack: [],
    console: ["fetching", "after load call", "Ada Lovelace", "cleanup"],
    phase: "idle"
  },
  {
    line: 8,
    caption: "The throw jumps straight into the `catch (e)` block on Line 8, skipping lines 6-7.",
    callStack: [],
    console: ["fetching", "after load call", "Ada Lovelace", "cleanup"],
    phase: "idle"
  },
  {
    line: 9,
    caption: "Catch block logs: 'error: HTTP 404'.",
    callStack: [],
    console: ["fetching", "after load call", "Ada Lovelace", "cleanup"],
    phase: "idle"
  },
  {
    line: 11,
    caption: "Even after the error, the `finally` block runs: 'cleanup' is guaranteed to execute!",
    callStack: [],
    console: ["fetching", "after load call", "Ada Lovelace", "cleanup"],
    phase: "idle"
  },
  {
    line: 0,
    caption: "Takeaway: `try/catch/finally` inside async functions handles rejected promises synchronously in syntax.",
    callStack: [],
    console: ["fetching", "after load call", "Ada Lovelace", "cleanup"],
    phase: "idle"
  },
  {
    line: 0,
    caption: "Behind the scenes, it compiles down to `.then()` and `.catch()` microtask reactions.",
    callStack: [],
    console: ["fetching", "after load call", "Ada Lovelace", "cleanup"],
    phase: "idle"
  },
  {
    line: 0,
    caption: "Slide 19 Complete: You have mastered end-to-end asynchronous error handling!",
    callStack: [],
    console: ["fetching", "after load call", "Ada Lovelace", "cleanup"],
    phase: "idle"
  }
]
</script>

<div class="h-full">
  <RuntimeStage
    :steps="steps"
    :code="code"
    :step="$clicks"
    :slide-number="19"
    :total-slides="20"
    title="Slide 19: Real-World Network Fetch & Error Handling"
    takeaway="Network I/O runs in host C++ threads; async/await try/catch handles fulfillment and rejection cleanly."
  />
</div>

<!--
SPEAKER NOTES:
[Click 0-4]: Trace synchronous start up to the fetch call.
[Click 5-8]: Show load() suspension and synchronous 'after load call'.
[Click 9-17]: Walk through the success path (HTTP 200, user.name, finally cleanup).
[Click 18-24]: Walk through the 404 path (res.ok false, throw, catch, finally cleanup).
-->
