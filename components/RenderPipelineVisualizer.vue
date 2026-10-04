<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    step?: number
    title?: string
  }>(),
  {
    step: 0,
    title: 'Browser Render Pipeline & The 16.6ms Frame Budget (60 FPS)'
  }
)

interface RenderStep {
  activeUnit: 'task' | 'micro' | 'raf' | 'style' | 'layout' | 'paint' | 'composite' | 'idle'
  elapsedMs: number
  droppedFrame: boolean
  action: string
  note: string
  optimizationTip: string
  activeLayers: string[]
}

const renderSteps: RenderStep[] = [
  {
    activeUnit: 'task',
    elapsedMs: 1.2,
    droppedFrame: false,
    action: "1. Event Loop Turn begins: Macrotask executes on Call Stack",
    note: "Main thread begins running synchronous JavaScript logic.",
    optimizationTip: "Keep tasks short (<50ms) to avoid long task flags.",
    activeLayers: ["DOM Tree"]
  },
  {
    activeUnit: 'micro',
    elapsedMs: 2.5,
    droppedFrame: false,
    action: "2. Microtask Checkpoint: Promise reactions drained",
    note: "All microtasks queued during the macrotask are drained to 0.",
    optimizationTip: "Never spawn infinite recursive microtasks.",
    activeLayers: ["DOM Tree", "Microtask Queue"]
  },
  {
    activeUnit: 'micro',
    elapsedMs: 3.2,
    droppedFrame: false,
    action: "3. MutationObserver callbacks batch processed",
    note: "DOM tree modifications observed during the task are notified.",
    optimizationTip: "Batch DOM mutations together before rendering.",
    activeLayers: ["DOM Tree (Modified)"]
  },
  {
    activeUnit: 'idle',
    elapsedMs: 4.1,
    droppedFrame: false,
    action: "4. Render Opportunity Check: Is display V-Sync tick due?",
    note: "Browser checks hardware 60Hz (16.6ms) or 120Hz (8.3ms) refresh tick.",
    optimizationTip: "If no visual changes occurred, rendering is skipped entirely!",
    activeLayers: ["V-Sync Pulse Detected"]
  },
  {
    activeUnit: 'raf',
    elapsedMs: 5.8,
    droppedFrame: false,
    action: "5. requestAnimationFrame (rAF) callbacks fire",
    note: "Perfect phase to update animations before style calculation!",
    optimizationTip: "Always use rAF instead of setTimeout for smooth animations.",
    activeLayers: ["rAF Animation Queue"]
  },
  {
    activeUnit: 'style',
    elapsedMs: 7.9,
    droppedFrame: false,
    action: "6. Style Recalculation: Matching CSSOM selectors",
    note: "Computes final computed CSS values for affected DOM nodes.",
    optimizationTip: "Use simple CSS class selectors; avoid deep nesting.",
    activeLayers: ["CSSOM", "Render Tree"]
  },
  {
    activeUnit: 'layout',
    elapsedMs: 10.4,
    droppedFrame: false,
    action: "7. Layout / Reflow: Calculating exact pixel geometries",
    note: "Computes width, height, x, y coordinates and element flow.",
    optimizationTip: "Avoid reading offsetTop right after modifying styles (Layout Thrashing).",
    activeLayers: ["Geometry Tree", "Box Models"]
  },
  {
    activeUnit: 'paint',
    elapsedMs: 13.1,
    droppedFrame: false,
    action: "8. Paint: Rasterizing vectors into bitmap layers",
    note: "Draws text, colors, shadows, borders, and images onto surfaces.",
    optimizationTip: "Painting is expensive; isolate changing areas with will-change.",
    activeLayers: ["Paint Records", "Skia Draw Calls"]
  },
  {
    activeUnit: 'composite',
    elapsedMs: 15.0,
    droppedFrame: false,
    action: "9. Compositing: GPU thread merges visual layers",
    note: "GPU composites layers onto screen buffer. Frame delivered <16.6ms!",
    optimizationTip: "Transforms and opacity bypass Layout and Paint completely!",
    activeLayers: ["GPU Textures", "DirectX/Metal Buffer"]
  },
  {
    activeUnit: 'idle',
    elapsedMs: 16.6,
    droppedFrame: false,
    action: "10. Frame Buffer Swapped! Fluid 60 FPS delivered",
    note: "User experiences zero jank, crisp 60 FPS visual smoothness.",
    optimizationTip: "Total budget met: 15.0ms < 16.6ms threshold.",
    activeLayers: ["Screen Output (60 FPS)"]
  },
  {
    activeUnit: 'task',
    elapsedMs: 19.5,
    droppedFrame: true,
    action: "11. SCENARIO 2: Long Task Contention (>50ms loop on Stack)",
    note: "A heavy synchronous JSON parse or array sort blocks the Call Stack.",
    optimizationTip: "Break long tasks with scheduler.yield() or setTimeout(0).",
    activeLayers: ["Main Thread Blocked"]
  },
  {
    activeUnit: 'task',
    elapsedMs: 24.2,
    droppedFrame: true,
    action: "12. 16.6ms Budget EXCEEDED! Main thread unable to yield",
    note: "Hardware V-Sync pulse passes, but main thread cannot trigger render!",
    optimizationTip: "Chrome flags tasks >50ms as Long Tasks in DevTools.",
    activeLayers: ["Budget Overflow (24ms)"]
  },
  {
    activeUnit: 'idle',
    elapsedMs: 28.5,
    droppedFrame: true,
    action: "13. ❌ FRAME DROPPED! JANK & STUTTER DETECTED!",
    note: "Screen misses frame refresh. Animations freeze and user clicks lag.",
    optimizationTip: "User experiences dropped frame (frame rate drops to 30 FPS).",
    activeLayers: ["Jank Detected • Missed V-Sync"]
  },
  {
    activeUnit: 'style',
    elapsedMs: 32.0,
    droppedFrame: true,
    action: "14. Late Render: Delayed Style and Layout execution",
    note: "Browser finally recalculates geometry after stack unfreezes.",
    optimizationTip: "Offload heavy data manipulation to Web Workers.",
    activeLayers: ["Delayed Reflow"]
  },
  {
    activeUnit: 'composite',
    elapsedMs: 35.0,
    droppedFrame: true,
    action: "15. Late Frame delivered at half-rate (30 FPS)",
    note: "Recovery frame completed after severe latency.",
    optimizationTip: "Consistency matters more than raw speed.",
    activeLayers: ["Late Frame Buffer"]
  },
  {
    activeUnit: 'composite',
    elapsedMs: 4.2,
    droppedFrame: false,
    action: "16. GPU Fast-Path: CSS transform & opacity optimization",
    note: "Animating transform: translate3d() skips Layout AND Paint entirely!",
    optimizationTip: "Only Composite phase runs on GPU thread. Zero CPU blocking.",
    activeLayers: ["GPU Direct Layer"]
  },
  {
    activeUnit: 'layout',
    elapsedMs: 8.5,
    droppedFrame: false,
    action: "17. Avoiding Layout Thrashing (Forced Synchronous Layout)",
    note: "Reading element.offsetHeight after writing element.style.width forces reflow.",
    optimizationTip: "Read all measurements first, then batch all DOM writes.",
    activeLayers: ["Batch DOM Pipeline"]
  },
  {
    activeUnit: 'idle',
    elapsedMs: 5.1,
    droppedFrame: false,
    action: "18. content-visibility: auto for offscreen DOM",
    note: "Skips Layout and Paint for elements outside the viewport until scrolled.",
    optimizationTip: "Massive rendering performance boost for long list feeds.",
    activeLayers: ["Viewport Culling"]
  },
  {
    activeUnit: 'composite',
    elapsedMs: 3.5,
    droppedFrame: false,
    action: "19. OffscreenCanvas: Rendering inside Web Workers",
    note: "Canvas drawing completely offloaded to background thread with zero main thread jank.",
    optimizationTip: "Free up main thread exclusively for UI interaction.",
    activeLayers: ["Worker Thread Canvas"]
  },
  {
    activeUnit: 'idle',
    elapsedMs: 0,
    droppedFrame: false,
    action: "20. Browser Render Pipeline Mastered! 60 FPS Guaranteed",
    note: "Task -> Microtask Drain -> rAF -> Style -> Layout -> Paint -> Composite!",
    optimizationTip: "Ready for Module 5: Promises & Async/Await!",
    activeLayers: ["Mastered Pipeline"]
  }
]

const currentIdx = computed(() => Math.min(Math.max(0, props.step), renderSteps.length - 1))
const currentStep = computed(() => renderSteps[currentIdx.value])
</script>

<template>
  <div class="render-pipeline bg-white border-2 border-slate-300 rounded-xl p-3 shadow-md font-mono text-slate-800 text-xs select-none">
    <!-- Header -->
    <div class="flex items-center justify-between pb-2 mb-2 border-b border-slate-200">
      <div class="flex items-center gap-2">
        <span class="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
        <span class="font-extrabold text-xs uppercase tracking-tight text-slate-900">{{ title }}</span>
      </div>
      <div class="flex items-center gap-2">
        <span class="px-2 py-0.5 rounded text-[10px] font-black uppercase transition-all duration-200"
          :class="currentStep.droppedFrame
            ? 'bg-rose-100 text-rose-900 border border-rose-300 ring-2 ring-rose-300 animate-pulse'
            : 'bg-emerald-100 text-emerald-900 border border-emerald-300'"
        >
          {{ currentStep.droppedFrame ? '⚠️ JANK / FRAME DROPPED' : '✔ 60 FPS HEALTHY' }}
        </span>
        <span class="bg-slate-100 text-slate-800 border border-slate-300 px-2 py-0.5 rounded text-[10px] font-black">
          Step {{ currentIdx + 1 }} / {{ renderSteps.length }}
        </span>
      </div>
    </div>

    <!-- Frame Time Bar (16.6ms budget) -->
    <div class="mb-2 p-2 bg-slate-50 border rounded-lg">
      <div class="flex items-center justify-between text-[10px] font-bold mb-1">
        <span class="text-slate-700">16.6ms V-Sync Frame Budget Gauge</span>
        <span :class="currentStep.elapsedMs > 16.6 ? 'text-rose-600 font-black' : 'text-emerald-700 font-bold'">
          {{ currentStep.elapsedMs.toFixed(1) }} ms / 16.6 ms ({{ currentStep.elapsedMs > 16.6 ? 'OVER BUDGET' : 'ON TIME' }})
        </span>
      </div>
      <div class="w-full h-3 bg-slate-200 rounded-full overflow-hidden relative">
        <div
          class="h-full transition-all duration-300 rounded-full"
          :class="currentStep.elapsedMs > 16.6 ? 'bg-gradient-to-r from-amber-500 to-rose-600' : 'bg-gradient-to-r from-emerald-500 to-blue-500'"
          :style="{ width: Math.min(100, (currentStep.elapsedMs / 16.6) * 100) + '%' }"
        ></div>
        <!-- 16.6ms limit marker -->
        <div class="absolute top-0 bottom-0 left-[100%] w-0.5 bg-rose-600"></div>
      </div>
    </div>

    <!-- Sequential Stages Pipeline (7 Stages) -->
    <div class="grid grid-cols-7 gap-1.5 text-center my-1.5">
      <!-- 1. JS Task -->
      <div class="p-2 rounded-lg border-2 transition-all duration-300"
        :class="currentStep.activeUnit === 'task' ? 'bg-amber-100 border-amber-500 ring-2 ring-amber-300 scale-105 font-bold shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-600'"
      >
        <div class="text-[12px] mb-0.5">⚡</div>
        <div class="text-[9px] font-black uppercase">1. JS Task</div>
        <div class="text-[8px] text-slate-500">Call Stack</div>
      </div>

      <!-- 2. Microtasks -->
      <div class="p-2 rounded-lg border-2 transition-all duration-300"
        :class="currentStep.activeUnit === 'micro' ? 'bg-purple-100 border-purple-500 ring-2 ring-purple-300 scale-105 font-bold shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-600'"
      >
        <div class="text-[12px] mb-0.5">⭐</div>
        <div class="text-[9px] font-black uppercase">2. Microtasks</div>
        <div class="text-[8px] text-slate-500">100% Drain</div>
      </div>

      <!-- 3. rAF -->
      <div class="p-2 rounded-lg border-2 transition-all duration-300"
        :class="currentStep.activeUnit === 'raf' ? 'bg-cyan-100 border-cyan-500 ring-2 ring-cyan-300 scale-105 font-bold shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-600'"
      >
        <div class="text-[12px] mb-0.5">🎬</div>
        <div class="text-[9px] font-black uppercase">3. rAF()</div>
        <div class="text-[8px] text-slate-500">Animation</div>
      </div>

      <!-- 4. Style -->
      <div class="p-2 rounded-lg border-2 transition-all duration-300"
        :class="currentStep.activeUnit === 'style' ? 'bg-blue-100 border-blue-500 ring-2 ring-blue-300 scale-105 font-bold shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-600'"
      >
        <div class="text-[12px] mb-0.5">🎨</div>
        <div class="text-[9px] font-black uppercase">4. Style</div>
        <div class="text-[8px] text-slate-500">CSSOM Tree</div>
      </div>

      <!-- 5. Layout -->
      <div class="p-2 rounded-lg border-2 transition-all duration-300"
        :class="currentStep.activeUnit === 'layout' ? 'bg-indigo-100 border-indigo-500 ring-2 ring-indigo-300 scale-105 font-bold shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-600'"
      >
        <div class="text-[12px] mb-0.5">📐</div>
        <div class="text-[9px] font-black uppercase">5. Layout</div>
        <div class="text-[8px] text-slate-500">Reflow Pixels</div>
      </div>

      <!-- 6. Paint -->
      <div class="p-2 rounded-lg border-2 transition-all duration-300"
        :class="currentStep.activeUnit === 'paint' ? 'bg-rose-100 border-rose-500 ring-2 ring-rose-300 scale-105 font-bold shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-600'"
      >
        <div class="text-[12px] mb-0.5">🖌️</div>
        <div class="text-[9px] font-black uppercase">6. Paint</div>
        <div class="text-[8px] text-slate-500">Raster Layers</div>
      </div>

      <!-- 7. Composite -->
      <div class="p-2 rounded-lg border-2 transition-all duration-300"
        :class="currentStep.activeUnit === 'composite' ? 'bg-emerald-100 border-emerald-500 ring-2 ring-emerald-300 scale-105 font-bold shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-600'"
      >
        <div class="text-[12px] mb-0.5">🖥️</div>
        <div class="text-[9px] font-black uppercase">7. Composite</div>
        <div class="text-[8px] text-slate-500">GPU Output</div>
      </div>
    </div>

    <!-- Active Action & Optimization Details -->
    <div class="mt-1.5 p-2 bg-slate-50 rounded border border-slate-200 flex items-center justify-between">
      <div class="text-[10.5px] font-bold text-slate-800 flex items-center gap-1.5">
        <span class="text-indigo-600 animate-pulse">▶</span>
        <span>{{ currentStep.action }}</span>
      </div>
      <div class="text-[9.5px] text-slate-500 italic max-w-[45%] text-right truncate">
        {{ currentStep.note }}
      </div>
    </div>

    <!-- Bottom Optimization Tip Bar -->
    <div class="mt-1.5 p-1.5 bg-blue-50/70 border border-blue-200 rounded flex items-center justify-between text-[9.5px]">
      <span class="font-bold text-blue-900">💡 Performance Optimization: {{ currentStep.optimizationTip }}</span>
      <div class="flex gap-1">
        <span v-for="l in currentStep.activeLayers" :key="l" class="px-1.5 py-0.5 rounded bg-blue-200 text-blue-950 font-bold font-mono text-[8.5px]">
          {{ l }}
        </span>
      </div>
    </div>
  </div>
</template>
