<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    step?: number
  }>(),
  {
    step: 0
  }
)

interface Step {
  activeUnit: 'v8' | 'browser' | 'libuv' | 'bridge' | 'all'
  action: string
  note: string
  v8Status: {
    stackFrame: string
    heapStatus: string
    threadCount: number
    isBlocked: boolean
  }
  browserThreads: {
    name: string
    tech: string
    task: string
    active: boolean
  }[]
  libuvPool: {
    id: number
    type: 'pool' | 'demux'
    task: string
    busy: boolean
  }[]
  relayQueue: string[]
  highlightBadge: string
}

const steps: Step[] = [
  {
    activeUnit: 'v8',
    action: "1. Inside V8: Strictly 1 Call Stack and 1 Memory Heap",
    note: "V8 (Chrome/Node), SpiderMonkey (Firefox), JavaScriptCore (Safari). Exactly 1 main execution thread.",
    v8Status: { stackFrame: "main() [Global Execution Context]", heapStatus: "Objects & Closures allocated", threadCount: 1, isBlocked: false },
    browserThreads: [
      { name: "Network Thread", tech: "Chromium C++ / Sockets", task: "Idle", active: false },
      { name: "Timer Thread", tech: "OS High-Res Clock", task: "Idle", active: false },
      { name: "DOM / Input Thread", tech: "OS Event Queue", task: "Monitoring user clicks", active: false },
      { name: "GPU Compositor", tech: "DirectX / Metal / Vulkan", task: "Rendering 60 FPS layers", active: true }
    ],
    libuvPool: [
      { id: 1, type: 'pool', task: "Idle", busy: false },
      { id: 2, type: 'pool', task: "Idle", busy: false },
      { id: 3, type: 'pool', task: "Idle", busy: false },
      { id: 4, type: 'pool', task: "Idle", busy: false }
    ],
    relayQueue: [],
    highlightBadge: "V8 Engine Single-Threaded Core"
  },
  {
    activeUnit: 'v8',
    action: "2. Why Single-Threaded? Simple Memory & Race Prevention",
    note: "Brendan Eich (1995): Designed for the DOM. Avoids deadlocks, livelocks, mutexes, and multi-threaded race hazards.",
    v8Status: { stackFrame: "No Mutexes • No Deadlocks", heapStatus: "Deterministic Memory Model", threadCount: 1, isBlocked: false },
    browserThreads: [
      { name: "Network Thread", tech: "Chromium C++ / Sockets", task: "Idle", active: false },
      { name: "Timer Thread", tech: "OS High-Res Clock", task: "Idle", active: false },
      { name: "DOM / Input Thread", tech: "OS Event Queue", task: "Monitoring user clicks", active: false },
      { name: "GPU Compositor", tech: "DirectX / Metal / Vulkan", task: "60 FPS V-Sync", active: true }
    ],
    libuvPool: [
      { id: 1, type: 'pool', task: "Idle", busy: false },
      { id: 2, type: 'pool', task: "Idle", busy: false },
      { id: 3, type: 'pool', task: "Idle", busy: false },
      { id: 4, type: 'pool', task: "Idle", busy: false }
    ],
    relayQueue: [],
    highlightBadge: "Run-to-Completion Semantics"
  },
  {
    activeUnit: 'v8',
    action: "3. The Paradox: How does 1 thread handle 50,000 concurrent requests?",
    note: "If JS is single-threaded, a 5-second database query or slow network call should freeze the entire browser!",
    v8Status: { stackFrame: "fetch('api/users') + fs.readFile()", heapStatus: "Registers async callback closures", threadCount: 1, isBlocked: false },
    browserThreads: [
      { name: "Network Thread", tech: "Chromium C++ / Sockets", task: "Waiting for offload", active: false },
      { name: "Timer Thread", tech: "OS High-Res Clock", task: "Waiting for offload", active: false },
      { name: "DOM / Input Thread", tech: "OS Event Queue", task: "Active", active: false },
      { name: "GPU Compositor", tech: "DirectX / Metal / Vulkan", task: "60 FPS V-Sync", active: true }
    ],
    libuvPool: [
      { id: 1, type: 'pool', task: "Waiting for offload", busy: false },
      { id: 2, type: 'pool', task: "Idle", busy: false },
      { id: 3, type: 'pool', task: "Idle", busy: false },
      { id: 4, type: 'pool', task: "Idle", busy: false }
    ],
    relayQueue: [],
    highlightBadge: "The Host Environment Secret"
  },
  {
    activeUnit: 'all',
    action: "4. The Revelation: V8 NEVER executes in isolation!",
    note: "V8 is merely an execution library embedded inside a massive multi-threaded Host (Browser or Node.js).",
    v8Status: { stackFrame: "V8 Delegates Heavy Work", heapStatus: "Passes callbacks to C++ Host", threadCount: 1, isBlocked: false },
    browserThreads: [
      { name: "Network Thread", tech: "Chromium C++ / Sockets", task: "Ready", active: true },
      { name: "Timer Thread", tech: "OS High-Res Clock", task: "Ready", active: true },
      { name: "DOM / Input Thread", tech: "OS Event Queue", task: "Ready", active: true },
      { name: "GPU Compositor", tech: "DirectX / Metal / Vulkan", task: "60 FPS V-Sync", active: true }
    ],
    libuvPool: [
      { id: 1, type: 'pool', task: "Ready", busy: false },
      { id: 2, type: 'pool', task: "Ready", busy: false },
      { id: 3, type: 'pool', task: "Ready", busy: false },
      { id: 4, type: 'pool', task: "Ready", busy: false }
    ],
    relayQueue: [],
    highlightBadge: "Host Concurrency Paradigm"
  },
  {
    activeUnit: 'browser',
    action: "5. Browser Host: Multi-Process & Multi-Threaded Chromium C++",
    note: "Chrome spawns separate browser processes, network processes, GPU processes, and utility processes.",
    v8Status: { stackFrame: "Offloading fetch() & setTimeout()", heapStatus: "Retains callback references", threadCount: 1, isBlocked: false },
    browserThreads: [
      { name: "Network Thread", tech: "Chromium C++ / Sockets", task: "Spawning HTTP/2 worker", active: true },
      { name: "Timer Thread", tech: "OS High-Res Clock", task: "Spawning hardware timer", active: true },
      { name: "DOM / Input Thread", tech: "OS Event Queue", task: "Listening for user input", active: true },
      { name: "GPU Compositor", tech: "DirectX / Metal / Vulkan", task: "Compositing textures", active: true }
    ],
    libuvPool: [
      { id: 1, type: 'pool', task: "Idle", busy: false },
      { id: 2, type: 'pool', task: "Idle", busy: false },
      { id: 3, type: 'pool', task: "Idle", busy: false },
      { id: 4, type: 'pool', task: "Idle", busy: false }
    ],
    relayQueue: [],
    highlightBadge: "Chromium C++ Web APIs"
  },
  {
    activeUnit: 'browser',
    action: "6. Browser Thread 1: Dedicated Network Thread (HTTP/2 & TLS)",
    note: "TCP handshakes, TLS decryption, and streaming binary packets happen entirely on background OS threads!",
    v8Status: { stackFrame: "JS Stack UNBLOCKED (Runs line 2)", heapStatus: "Waiting for Network", threadCount: 1, isBlocked: false },
    browserThreads: [
      { name: "Network Thread", tech: "Chromium C++ / Sockets", task: "⚡ Downloading 10MB JSON (TLS 1.3)", active: true },
      { name: "Timer Thread", tech: "OS High-Res Clock", task: "Idle", active: false },
      { name: "DOM / Input Thread", tech: "OS Event Queue", task: "Listening", active: false },
      { name: "GPU Compositor", tech: "DirectX / Metal / Vulkan", task: "60 FPS V-Sync", active: true }
    ],
    libuvPool: [
      { id: 1, type: 'pool', task: "Idle", busy: false },
      { id: 2, type: 'pool', task: "Idle", busy: false },
      { id: 3, type: 'pool', task: "Idle", busy: false },
      { id: 4, type: 'pool', task: "Idle", busy: false }
    ],
    relayQueue: [],
    highlightBadge: "True Parallel Network I/O"
  },
  {
    activeUnit: 'browser',
    action: "7. Browser Thread 2: Timer Thread & Hardware Clock Interrupts",
    note: "Timers do not run a loop in JS. The OS kernel hardware clock fires an interrupt when the delay elapses.",
    v8Status: { stackFrame: "JS Stack UNBLOCKED (Runs line 3)", heapStatus: "TimerID: 101 registered", threadCount: 1, isBlocked: false },
    browserThreads: [
      { name: "Network Thread", tech: "Chromium C++ / Sockets", task: "Downloading 10MB JSON...", active: true },
      { name: "Timer Thread", tech: "OS High-Res Clock", task: "⏱️ Counting 50ms HW Clock tick", active: true },
      { name: "DOM / Input Thread", tech: "OS Event Queue", task: "Listening", active: false },
      { name: "GPU Compositor", tech: "DirectX / Metal / Vulkan", task: "60 FPS V-Sync", active: true }
    ],
    libuvPool: [
      { id: 1, type: 'pool', task: "Idle", busy: false },
      { id: 2, type: 'pool', task: "Idle", busy: false },
      { id: 3, type: 'pool', task: "Idle", busy: false },
      { id: 4, type: 'pool', task: "Idle", busy: false }
    ],
    relayQueue: [],
    highlightBadge: "Zero CPU Burn While Waiting"
  },
  {
    activeUnit: 'browser',
    action: "8. Browser Thread 3: DOM Event Thread captures user clicks",
    note: "Mouse movements, touch gestures, and keyboard inputs are captured by OS event listeners in real-time.",
    v8Status: { stackFrame: "JS Stack UNBLOCKED (Processing math)", heapStatus: "EventListeners registered", threadCount: 1, isBlocked: false },
    browserThreads: [
      { name: "Network Thread", tech: "Chromium C++ / Sockets", task: "Downloading 10MB JSON...", active: true },
      { name: "Timer Thread", tech: "OS High-Res Clock", task: "Counting 50ms...", active: true },
      { name: "DOM / Input Thread", tech: "OS Event Queue", task: "🖱️ User clicked #submit-btn!", active: true },
      { name: "GPU Compositor", tech: "DirectX / Metal / Vulkan", task: "60 FPS V-Sync", active: true }
    ],
    libuvPool: [
      { id: 1, type: 'pool', task: "Idle", busy: false },
      { id: 2, type: 'pool', task: "Idle", busy: false },
      { id: 3, type: 'pool', task: "Idle", busy: false },
      { id: 4, type: 'pool', task: "Idle", busy: false }
    ],
    relayQueue: ["clickCallback()"],
    highlightBadge: "Asynchronous Input Buffering"
  },
  {
    activeUnit: 'browser',
    action: "9. Browser Thread 4: GPU Compositor Thread delivers 60/120 FPS",
    note: "CSS transforms and opacity scroll smoothly on the GPU thread even if main thread JS is momentarily busy!",
    v8Status: { stackFrame: "Heavy CPU calculation (10ms)", heapStatus: "Memory active", threadCount: 1, isBlocked: false },
    browserThreads: [
      { name: "Network Thread", tech: "Chromium C++ / Sockets", task: "Downloading 10MB JSON...", active: true },
      { name: "Timer Thread", tech: "OS High-Res Clock", task: "Counting 50ms...", active: true },
      { name: "DOM / Input Thread", tech: "OS Event Queue", task: "Buffered click", active: false },
      { name: "GPU Compositor", tech: "DirectX / Metal / Vulkan", task: "🖥️ Rasterizing GPU Composited Layers", active: true }
    ],
    libuvPool: [
      { id: 1, type: 'pool', task: "Idle", busy: false },
      { id: 2, type: 'pool', task: "Idle", busy: false },
      { id: 3, type: 'pool', task: "Idle", busy: false },
      { id: 4, type: 'pool', task: "Idle", busy: false }
    ],
    relayQueue: ["clickCallback()"],
    highlightBadge: "Off-Main-Thread Compositing"
  },
  {
    activeUnit: 'browser',
    action: "10. Browser Thread 5: Dedicated Web Workers (new Worker())",
    note: "True multi-threaded JS! Web Workers run on separate OS threads and communicate via structured cloning / postMessage.",
    v8Status: { stackFrame: "worker.postMessage({ data })", heapStatus: "Structured Clone serialized", threadCount: 1, isBlocked: false },
    browserThreads: [
      { name: "Network Thread", tech: "Chromium C++ / Sockets", task: "Payload ready", active: true },
      { name: "Timer Thread", tech: "OS High-Res Clock", task: "Expired!", active: true },
      { name: "Web Worker #1", tech: "Dedicated OS Thread", task: "⚙️ Heavy Image Filter Algorithm", active: true },
      { name: "GPU Compositor", tech: "DirectX / Metal / Vulkan", task: "60 FPS V-Sync", active: true }
    ],
    libuvPool: [
      { id: 1, type: 'pool', task: "Idle", busy: false },
      { id: 2, type: 'pool', task: "Idle", busy: false },
      { id: 3, type: 'pool', task: "Idle", busy: false },
      { id: 4, type: 'pool', task: "Idle", busy: false }
    ],
    relayQueue: ["clickCallback()", "timerCallback()"],
    highlightBadge: "Explicit Web Worker Concurrency"
  },
  {
    activeUnit: 'libuv',
    action: "11. Host 2: Node.js — Ryan Dahl (2009) pairs V8 with libuv",
    note: "Node.js combines Google V8 with libuv: an ultra-high performance asynchronous I/O engine written in C.",
    v8Status: { stackFrame: "Node.js Server Entrypoint", heapStatus: "V8 C++ Bindings active", threadCount: 1, isBlocked: false },
    browserThreads: [
      { name: "Browser Web APIs", tech: "N/A in Node.js", task: "Not applicable in server runtime", active: false },
      { name: "Browser Web APIs", tech: "N/A in Node.js", task: "Not applicable in server runtime", active: false },
      { name: "Browser Web APIs", tech: "N/A in Node.js", task: "Not applicable in server runtime", active: false },
      { name: "Browser Web APIs", tech: "N/A in Node.js", task: "Not applicable in server runtime", active: false }
    ],
    libuvPool: [
      { id: 1, type: 'pool', task: "Worker Pool Ready", busy: false },
      { id: 2, type: 'pool', task: "Worker Pool Ready", busy: false },
      { id: 3, type: 'pool', task: "Worker Pool Ready", busy: false },
      { id: 4, type: 'pool', task: "Worker Pool Ready", busy: false }
    ],
    relayQueue: [],
    highlightBadge: "V8 + libuv Server Architecture"
  },
  {
    activeUnit: 'libuv',
    action: "12. libuv Pillar 1: Non-Blocking Event Demultiplexer (epoll/kqueue)",
    note: "Network sockets use OS kernel notification (Linux epoll, macOS kqueue, Windows IOCP). Zero thread pool overhead!",
    v8Status: { stackFrame: "server.on('request', handler)", heapStatus: "File descriptors registered", threadCount: 1, isBlocked: false },
    browserThreads: [
      { name: "Browser APIs", tech: "Server Mode", task: "Disabled", active: false },
      { name: "Browser APIs", tech: "Server Mode", task: "Disabled", active: false },
      { name: "Browser APIs", tech: "Server Mode", task: "Disabled", active: false },
      { name: "Browser APIs", tech: "Server Mode", task: "Disabled", active: false }
    ],
    libuvPool: [
      { id: 1, type: 'demux', task: "epoll: 10,000 active socket FDs", busy: true },
      { id: 2, type: 'pool', task: "Worker Pool Idle", busy: false },
      { id: 3, type: 'pool', task: "Worker Pool Idle", busy: false },
      { id: 4, type: 'pool', task: "Worker Pool Idle", busy: false }
    ],
    relayQueue: [],
    highlightBadge: "Linux epoll / macOS kqueue"
  },
  {
    activeUnit: 'libuv',
    action: "13. 100,000 Concurrent Sockets with 1 Single Thread!",
    note: "The OS kernel notifies libuv when socket packets arrive. 1 thread manages thousands of client connections easily.",
    v8Status: { stackFrame: "Handling active client #442", heapStatus: "Buffer streams", threadCount: 1, isBlocked: false },
    browserThreads: [
      { name: "Browser APIs", tech: "Server Mode", task: "Disabled", active: false },
      { name: "Browser APIs", tech: "Server Mode", task: "Disabled", active: false },
      { name: "Browser APIs", tech: "Server Mode", task: "Disabled", active: false },
      { name: "Browser APIs", tech: "Server Mode", task: "Disabled", active: false }
    ],
    libuvPool: [
      { id: 1, type: 'demux', task: "epoll: Socket packet arrived!", busy: true },
      { id: 2, type: 'pool', task: "Worker Pool Idle", busy: false },
      { id: 3, type: 'pool', task: "Worker Pool Idle", busy: false },
      { id: 4, type: 'pool', task: "Worker Pool Idle", busy: false }
    ],
    relayQueue: ["httpReqCallback()"],
    highlightBadge: "C10K Problem Solved"
  },
  {
    activeUnit: 'libuv',
    action: "14. libuv Pillar 2: Worker Thread Pool (UV_THREADPOOL_SIZE = 4)",
    note: "What about blocking operations? Operating systems have NO non-blocking file I/O or crypto! So libuv uses a C thread pool.",
    v8Status: { stackFrame: "Calling fs.readFile() & crypto.pbkdf2()", heapStatus: "Delegates to libuv C Pool", threadCount: 1, isBlocked: false },
    browserThreads: [
      { name: "Browser APIs", tech: "Server Mode", task: "Disabled", active: false },
      { name: "Browser APIs", tech: "Server Mode", task: "Disabled", active: false },
      { name: "Browser APIs", tech: "Server Mode", task: "Disabled", active: false },
      { name: "Browser APIs", tech: "Server Mode", task: "Disabled", active: false }
    ],
    libuvPool: [
      { id: 1, type: 'pool', task: "fs.readFile('database.sqlite')", busy: true },
      { id: 2, type: 'pool', task: "crypto.pbkdf2(password, hash)", busy: true },
      { id: 3, type: 'pool', task: "zlib.gzip(payload)", busy: true },
      { id: 4, type: 'pool', task: "dns.lookup('api.google.com')", busy: true }
    ],
    relayQueue: ["httpReqCallback()"],
    highlightBadge: "4 Worker Threads: fs, crypto, zlib, dns"
  },
  {
    activeUnit: 'libuv',
    action: "15. Thread Pool Saturation Hazard: The 5th Crypto Call Waits!",
    note: "If all 4 threads are occupied by heavy crypto hashing, a 5th file read or DNS lookup MUST wait in line!",
    v8Status: { stackFrame: "crypto.pbkdf2() #5 called", heapStatus: "Waiting for thread slot", threadCount: 1, isBlocked: false },
    browserThreads: [
      { name: "Browser APIs", tech: "Server Mode", task: "Disabled", active: false },
      { name: "Browser APIs", tech: "Server Mode", task: "Disabled", active: false },
      { name: "Browser APIs", tech: "Server Mode", task: "Disabled", active: false },
      { name: "Browser APIs", tech: "Server Mode", task: "Disabled", active: false }
    ],
    libuvPool: [
      { id: 1, type: 'pool', task: "crypto: Hashing #1 (100% CPU)", busy: true },
      { id: 2, type: 'pool', task: "crypto: Hashing #2 (100% CPU)", busy: true },
      { id: 3, type: 'pool', task: "crypto: Hashing #3 (100% CPU)", busy: true },
      { id: 4, type: 'pool', task: "crypto: Hashing #4 (100% CPU)", busy: true }
    ],
    relayQueue: ["httpReqCallback()", "fsCallback()"],
    highlightBadge: "Tune UV_THREADPOOL_SIZE=64"
  },
  {
    activeUnit: 'bridge',
    action: "16. How Background Threads Notify V8: The Event Queues",
    note: "When an OS socket, C++ Web API, or libuv worker thread finishes, it posts its callback into the Event Queue.",
    v8Status: { stackFrame: "Finishing synchronous function", heapStatus: "Ready for queue callbacks", threadCount: 1, isBlocked: false },
    browserThreads: [
      { name: "Network Thread", tech: "Chromium C++ / Sockets", task: "Download Complete! ✔", active: false },
      { name: "Timer Thread", tech: "OS High-Res Clock", task: "Timer Expired! ✔", active: false },
      { name: "DOM / Input Thread", tech: "OS Event Queue", task: "Click Captured! ✔", active: false },
      { name: "GPU Compositor", tech: "DirectX / Metal / Vulkan", task: "60 FPS V-Sync", active: true }
    ],
    libuvPool: [
      { id: 1, type: 'pool', task: "fs read complete! ✔", busy: false },
      { id: 2, type: 'pool', task: "crypto hash complete! ✔", busy: false },
      { id: 3, type: 'pool', task: "zlib complete! ✔", busy: false },
      { id: 4, type: 'pool', task: "dns complete! ✔", busy: false }
    ],
    relayQueue: ["networkCallback()", "timerCallback()", "fsCallback()", "cryptoCallback()"],
    highlightBadge: "Thread-Safe Event Queue Bridge"
  },
  {
    activeUnit: 'bridge',
    action: "17. Strict Invariant: Host Threads NEVER Touch V8 Directly!",
    note: "Crucial rule: Background C++ threads never push frames to the JS Call Stack or mutate V8 variables. No race conditions!",
    v8Status: { stackFrame: "Call Stack Isolation Guard", heapStatus: "Protected from race conditions", threadCount: 1, isBlocked: false },
    browserThreads: [
      { name: "Network Thread", tech: "Chromium C++ / Sockets", task: "Idle", active: false },
      { name: "Timer Thread", tech: "OS High-Res Clock", task: "Idle", active: false },
      { name: "DOM / Input Thread", tech: "OS Event Queue", task: "Idle", active: false },
      { name: "GPU Compositor", tech: "DirectX / Metal / Vulkan", task: "60 FPS V-Sync", active: true }
    ],
    libuvPool: [
      { id: 1, type: 'pool', task: "Idle", busy: false },
      { id: 2, type: 'pool', task: "Idle", busy: false },
      { id: 3, type: 'pool', task: "Idle", busy: false },
      { id: 4, type: 'pool', task: "Idle", busy: false }
    ],
    relayQueue: ["networkCallback()", "timerCallback()", "fsCallback()"],
    highlightBadge: "Strict Thread Boundary"
  },
  {
    activeUnit: 'v8',
    action: "18. Event Loop Bridge: Relays Callbacks ONLY When Stack is 0",
    note: "Only when the single-threaded V8 Call Stack reaches 0 frames does the Event Loop dequeue and push the callback!",
    v8Status: { stackFrame: "networkCallback() [Executing on Stack]", heapStatus: "Processes 10MB payload", threadCount: 1, isBlocked: false },
    browserThreads: [
      { name: "Network Thread", tech: "Chromium C++ / Sockets", task: "Idle", active: false },
      { name: "Timer Thread", tech: "OS High-Res Clock", task: "Idle", active: false },
      { name: "DOM / Input Thread", tech: "OS Event Queue", task: "Idle", active: false },
      { name: "GPU Compositor", tech: "DirectX / Metal / Vulkan", task: "60 FPS V-Sync", active: true }
    ],
    libuvPool: [
      { id: 1, type: 'pool', task: "Idle", busy: false },
      { id: 2, type: 'pool', task: "Idle", busy: false },
      { id: 3, type: 'pool', task: "Idle", busy: false },
      { id: 4, type: 'pool', task: "Idle", busy: false }
    ],
    relayQueue: ["timerCallback()", "fsCallback()"],
    highlightBadge: "Event Loop Orchestration"
  },
  {
    activeUnit: 'all',
    action: "19. The Dual Architecture: Single-Threaded Logic + Multi-Threaded Host",
    note: "Developers write simple, lock-free sequential JS, while the multi-core OS kernel & C++ host handle brute concurrency.",
    v8Status: { stackFrame: "Single-Thread Simplicity", heapStatus: "No Mutexes Required", threadCount: 1, isBlocked: false },
    browserThreads: [
      { name: "Browser C++ Threads", tech: "Chromium Core", task: "Multi-Process Web APIs", active: true },
      { name: "Browser C++ Threads", tech: "Chromium Core", task: "GPU Rendering Pipeline", active: true },
      { name: "Browser C++ Threads", tech: "Chromium Core", task: "WebAudio & WebRTC", active: true },
      { name: "Browser C++ Threads", tech: "Chromium Core", task: "Service Workers", active: true }
    ],
    libuvPool: [
      { id: 1, type: 'pool', task: "libuv Thread Pool", busy: true },
      { id: 2, type: 'pool', task: "libuv Thread Pool", busy: true },
      { id: 3, type: 'demux', task: "epoll Non-Blocking Sockets", busy: true },
      { id: 4, type: 'pool', task: "Cross-Platform I/O", busy: true }
    ],
    relayQueue: ["Cooperative Event Queues"],
    highlightBadge: "The Ultimate Engineering Design"
  },
  {
    activeUnit: 'all',
    action: "20. Host Concurrency Mastered! Ready for Event Loop Cycle!",
    note: "Now you have the complete mental model: JS is single-threaded, but its execution environment is massively multi-threaded!",
    v8Status: { stackFrame: "Ready for Slide 9: Event Loop Cycle!", heapStatus: "All systems synchronized", threadCount: 1, isBlocked: false },
    browserThreads: [
      { name: "Network Thread", tech: "Chromium C++ / Sockets", task: "Standing by", active: true },
      { name: "Timer Thread", tech: "OS High-Res Clock", task: "Standing by", active: true },
      { name: "DOM / Input Thread", tech: "OS Event Queue", task: "Standing by", active: true },
      { name: "GPU Compositor", tech: "DirectX / Metal / Vulkan", task: "60 FPS V-Sync", active: true }
    ],
    libuvPool: [
      { id: 1, type: 'pool', task: "Standing by", busy: false },
      { id: 2, type: 'pool', task: "Standing by", busy: false },
      { id: 3, type: 'demux', task: "Standing by", busy: false },
      { id: 4, type: 'pool', task: "Standing by", busy: false }
    ],
    relayQueue: ["Ready for Next Turn"],
    highlightBadge: "Outcome 2 Complete • Slide 08/20 Mastered"
  }
]

const currentIdx = computed(() => Math.min(Math.max(0, props.step), steps.length - 1))
const currentStep = computed(() => steps[currentIdx.value])
</script>

<template>
  <div class="h-full flex flex-col justify-between select-none bg-white p-5 font-sans">
    <!-- Header -->
    <div>
      <div class="flex items-center justify-between mb-1">
        <div class="flex items-center gap-2">
          <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-100 text-blue-900 border border-blue-300 uppercase tracking-wider">
            Outcome 2 • Slide 08/20
          </span>
          <span class="text-xs text-slate-500 font-medium font-mono">Host Concurrency Architecture</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-[10px] font-mono text-slate-500 font-bold">Step {{ currentIdx + 1 }} / {{ steps.length }}</span>
          <div class="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              class="h-full bg-blue-600 transition-all duration-300 rounded-full"
              :style="{ width: ((currentIdx + 1) / steps.length) * 100 + '%' }"
            ></div>
          </div>
        </div>
      </div>

      <h1 class="text-2xl font-black text-slate-900 tracking-tight">
        The Host Superpower: Browser Web APIs vs Node.js libuv
      </h1>
      <p class="text-xs text-slate-600 font-medium">
        JavaScript is single-threaded, but the host environment is massively multi-threaded!
      </p>
    </div>

    <!-- Active Step Action Banner -->
    <div class="bg-blue-50 border-2 border-blue-300 p-2 rounded-lg flex items-center justify-between text-xs">
      <div class="flex items-center gap-2 font-bold text-blue-950">
        <span class="text-blue-600 animate-pulse">▶</span>
        <span>{{ currentStep.action }}</span>
      </div>
      <div class="flex items-center gap-2">
        <span class="text-[9.5px] font-bold font-mono px-2 py-0.5 rounded bg-blue-200 text-blue-950 border border-blue-300">
          {{ currentStep.highlightBadge }}
        </span>
        <span class="text-[10px] text-slate-600 font-medium">{{ currentStep.note }}</span>
      </div>
    </div>

    <!-- 3 Core Engines Grid: Browser Web APIs (Left) | V8 Engine (Center) | Node.js libuv (Right) -->
    <div class="grid grid-cols-12 gap-2.5 my-1">
      
      <!-- 1. Browser Web APIs (4 Cols) -->
      <div class="col-span-4 bg-emerald-50/80 border-2 rounded-xl p-2.5 flex flex-col justify-between transition-all duration-300"
        :class="currentStep.activeUnit === 'browser' || currentStep.activeUnit === 'all'
          ? 'border-emerald-500 ring-2 ring-emerald-300 shadow-md scale-[1.01]'
          : 'border-emerald-200 opacity-75'"
      >
        <div>
          <div class="flex items-center justify-between text-[10.5px] font-black uppercase text-emerald-950 mb-1.5">
            <span class="flex items-center gap-1">
              <span class="w-2 h-2 rounded-full bg-emerald-500" :class="currentStep.activeUnit === 'browser' ? 'animate-ping' : ''"></span>
              🌐 Browser Web APIs
            </span>
            <span class="text-[8px] bg-emerald-200 text-emerald-900 px-1 rounded font-bold font-mono">Chromium C++</span>
          </div>

          <div class="space-y-1 min-h-[120px] p-1.5 bg-white/95 rounded-lg border border-emerald-200 text-[10px]">
            <div class="text-[8.5px] font-bold text-emerald-900 mb-0.5 uppercase tracking-wider flex justify-between">
              <span>Multi-Threaded Host Workers:</span>
              <span class="text-emerald-700 font-mono">C++ Threads</span>
            </div>
            
            <div
              v-for="th in currentStep.browserThreads"
              :key="th.name"
              class="p-1 rounded border flex flex-col justify-between transition-all duration-300"
              :class="th.active
                ? 'bg-emerald-100 border-emerald-400 text-emerald-950 font-bold shadow-xs'
                : 'bg-slate-50 border-slate-200 text-slate-500'"
            >
              <div class="flex justify-between items-center text-[9px]">
                <span class="font-bold">{{ th.name }}</span>
                <span class="text-[7.5px] font-mono opacity-70">{{ th.tech }}</span>
              </div>
              <div class="text-[8px] font-mono truncate" :class="th.active ? 'text-emerald-800 font-bold' : 'text-slate-400'">
                {{ th.task }}
              </div>
            </div>
          </div>
        </div>

        <div class="text-[8.5px] text-emerald-900 font-bold text-center mt-1 bg-emerald-100/70 py-0.5 rounded">
          DOM, Fetch, Hardware Timers, WebAudio on OS Threads
        </div>
      </div>

      <!-- 2. V8 Single Thread Engine (4 Cols) -->
      <div class="col-span-4 bg-blue-50/80 border-2 rounded-xl p-2.5 flex flex-col justify-between transition-all duration-300"
        :class="currentStep.activeUnit === 'v8' || currentStep.activeUnit === 'all'
          ? 'border-blue-600 ring-2 ring-blue-400 shadow-md scale-[1.01]'
          : 'border-blue-200 opacity-75'"
      >
        <div>
          <div class="flex items-center justify-between text-[10.5px] font-black uppercase text-blue-950 mb-1.5">
            <span class="flex items-center gap-1">
              <span class="w-2 h-2 rounded-full bg-blue-600" :class="currentStep.activeUnit === 'v8' ? 'animate-ping' : ''"></span>
              ⚡ V8 JS Engine
            </span>
            <span class="text-[8px] bg-blue-200 text-blue-900 px-1 rounded font-bold font-mono">1 Thread</span>
          </div>

          <div class="space-y-1.5 min-h-[120px] p-2 bg-white/95 rounded-lg border border-blue-200 text-[10px]">
            <div class="p-1 rounded bg-blue-50 border border-blue-200 font-bold text-blue-900 flex justify-between text-[9px]">
              <span>Call Stack:</span>
              <span class="text-rose-600 font-black">1 Frame at a Time (LIFO)</span>
            </div>
            
            <div class="p-1.5 rounded bg-slate-900 text-emerald-400 font-mono text-[9px] font-bold text-center border border-slate-700 shadow-inner">
              {{ currentStep.v8Status.stackFrame }}
            </div>

            <div class="p-1 rounded bg-slate-50 border border-slate-200 text-slate-700 text-[8.5px] flex justify-between">
              <span>Memory Heap:</span>
              <span class="font-bold text-blue-900">{{ currentStep.v8Status.heapStatus }}</span>
            </div>

            <div class="p-1 rounded bg-amber-50 border border-amber-200 text-amber-900 text-[8px] text-center font-bold">
              Run-to-Completion: No context switching on JS variables
            </div>
          </div>
        </div>

        <div class="text-[8.5px] text-blue-900 font-bold text-center mt-1 bg-blue-100/70 py-0.5 rounded">
          Single-threaded execution guarantees zero race conditions
        </div>
      </div>

      <!-- 3. Node.js libuv (4 Cols) -->
      <div class="col-span-4 bg-purple-50/80 border-2 rounded-xl p-2.5 flex flex-col justify-between transition-all duration-300"
        :class="currentStep.activeUnit === 'libuv' || currentStep.activeUnit === 'all'
          ? 'border-purple-600 ring-2 ring-purple-400 shadow-md scale-[1.01]'
          : 'border-purple-200 opacity-75'"
      >
        <div>
          <div class="flex items-center justify-between text-[10.5px] font-black uppercase text-purple-950 mb-1.5">
            <span class="flex items-center gap-1">
              <span class="w-2 h-2 rounded-full bg-purple-600" :class="currentStep.activeUnit === 'libuv' ? 'animate-ping' : ''"></span>
              ⚙️ Node.js libuv
            </span>
            <span class="text-[8px] bg-purple-200 text-purple-900 px-1 rounded font-bold font-mono">epoll + Pool (4)</span>
          </div>

          <div class="space-y-1 min-h-[120px] p-1.5 bg-white/95 rounded-lg border border-purple-200 text-[10px]">
            <div class="text-[8.5px] font-bold text-purple-900 mb-0.5 uppercase tracking-wider flex justify-between">
              <span>libuv C Workers & Sockets:</span>
              <span class="text-purple-700 font-mono">UV_THREADPOOL</span>
            </div>

            <div class="grid grid-cols-2 gap-1 text-[8.5px] font-mono">
              <div v-for="th in currentStep.libuvPool" :key="th.id"
                class="p-1 rounded border flex flex-col justify-between transition-all duration-300"
                :class="th.busy
                  ? 'bg-purple-100 border-purple-400 text-purple-950 font-bold animate-pulse shadow-xs'
                  : 'bg-slate-50 border-slate-200 text-slate-500'"
              >
                <div class="flex justify-between items-center text-[8px]">
                  <span>{{ th.type === 'demux' ? '🌐 epoll' : '🧵 Pool #' + th.id }}</span>
                  <span class="w-1.5 h-1.5 rounded-full" :class="th.busy ? 'bg-purple-600' : 'bg-slate-300'"></span>
                </div>
                <span class="truncate text-[7.5px]">{{ th.task }}</span>
              </div>
            </div>

            <div class="text-[8px] text-purple-900 bg-purple-50 p-1 rounded border border-purple-200 text-center font-bold">
              Sockets: epoll (Linux) • Files/Crypto: C Thread Pool
            </div>
          </div>
        </div>

        <div class="text-[8.5px] text-purple-900 font-bold text-center mt-1 bg-purple-100/70 py-0.5 rounded">
          Non-blocking event demultiplexer + 4-thread worker pool
        </div>
      </div>

    </div>

    <!-- Bottom Queue Relay Status -->
    <div class="p-2 bg-slate-100 rounded-lg border border-slate-300 flex items-center justify-between text-[10px] transition-all duration-300"
      :class="currentStep.activeUnit === 'bridge' ? 'border-amber-400 bg-amber-50 ring-2 ring-amber-300 shadow-sm' : ''"
    >
      <div class="flex items-center gap-2">
        <span class="font-bold text-slate-800">Event Loop Relay Bridge:</span>
        <div class="flex gap-1.5">
          <span v-for="q in currentStep.relayQueue" :key="q" class="bg-amber-100 text-amber-950 border border-amber-300 px-2 py-0.5 rounded font-mono font-bold text-[9px] animate-pulse">
            ✔ {{ q }}
          </span>
          <span v-if="currentStep.relayQueue.length === 0" class="text-slate-400 italic text-[9px]">
            (Host threads ready to post completed callbacks into queue)
          </span>
        </div>
      </div>
      <span class="font-mono text-indigo-700 font-bold text-[9px]">V8 Stack ⮀ Event Loop ⮀ Host Threads</span>
    </div>

    <!-- Footer -->
    <div class="flex items-center justify-between text-xs text-slate-500 border-t border-slate-200 pt-2 font-mono">
      <span>Module 2: Host Concurrency • V8 vs Browser Web APIs vs Node.js libuv</span>
      <span class="text-slate-600 font-bold">Slide 08 / 20</span>
    </div>
  </div>
</template>
