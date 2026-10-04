<script setup lang="ts">
import { computed } from 'vue'

export interface EngineState {
  stack?: string[]
  webApis?: string[]
  microtasks?: string[]
  macrotasks?: string[]
  logs?: string[]
  loopStatus?: string
  activeComponent?: 'stack' | 'webapi' | 'micro' | 'macro' | 'loop' | 'console'
}

const props = defineProps<{
  state: EngineState
}>()

const stackFrames = computed(() => props.state.stack ?? [])
const webApiList = computed(() => props.state.webApis ?? [])
const microList = computed(() => props.state.microtasks ?? [])
const macroList = computed(() => props.state.macrotasks ?? [])
const logList = computed(() => props.state.logs ?? [])
const loopText = computed(() => props.state.loopStatus ?? 'Monitoring Stack...')
</script>

<template>
  <div class="ev-grid">
    <!-- Row 1: Execution Engine (Stack, Web APIs, Event Loop) -->
    <div class="ev-row top">
      <!-- Call Stack -->
      <div :class="['ev-box', 'ev-stack', { 'ev-box--active': state.activeComponent === 'stack' }]">
        <div class="ev-header stack-hdr">
          <span class="ev-title">Call Stack</span>
          <span class="ev-badge stack-bdg">LIFO</span>
        </div>
        <div class="ev-body stack-body">
          <div v-if="!stackFrames.length" class="ev-empty">Stack Empty</div>
          <TransitionGroup name="stack-trans" tag="div" class="ev-stack-list">
            <div
              v-for="(frame, idx) in stackFrames"
              :key="frame + idx"
              :class="['ev-frame', { 'ev-frame--top': idx === stackFrames.length - 1 }]"
            >
              {{ frame }}
            </div>
          </TransitionGroup>
        </div>
      </div>

      <!-- Event Loop Wheel / Indicator -->
      <div :class="['ev-box', 'ev-loop', { 'ev-box--active': state.activeComponent === 'loop' }]">
        <div class="ev-header loop-hdr">
          <span class="ev-title">Event Loop</span>
          <span class="ev-badge loop-bdg">Watcher</span>
        </div>
        <div class="ev-body loop-body">
          <div class="ev-loop-orbit">
            <div class="ev-loop-spinner" />
            <span class="ev-loop-core">⟳</span>
          </div>
          <div class="ev-loop-status">{{ loopText }}</div>
        </div>
      </div>

      <!-- Web APIs -->
      <div :class="['ev-box', 'ev-webapi', { 'ev-box--active': state.activeComponent === 'webapi' }]">
        <div class="ev-header webapi-hdr">
          <span class="ev-title">Browser Web APIs</span>
          <span class="ev-badge webapi-bdg">Background</span>
        </div>
        <div class="ev-body queue-body">
          <div v-if="!webApiList.length" class="ev-empty">Idle (No Timers/Fetches)</div>
          <TransitionGroup name="tag-trans" tag="div" class="ev-tag-list">
            <div v-for="(api, idx) in webApiList" :key="api + idx" class="ev-tag-item webapi-tag">
              <span class="ev-tag-dot" /> {{ api }}
            </div>
          </TransitionGroup>
        </div>
      </div>
    </div>

    <!-- Row 2: Queues and Console -->
    <div class="ev-row bottom">
      <!-- Microtask Queue -->
      <div :class="['ev-box', 'ev-micro', { 'ev-box--active': state.activeComponent === 'micro' }]">
        <div class="ev-header micro-hdr">
          <span class="ev-title">Microtask Queue</span>
          <span class="ev-badge micro-bdg">VIP • Highest Priority</span>
        </div>
        <div class="ev-body queue-body">
          <div v-if="!microList.length" class="ev-empty">Empty</div>
          <TransitionGroup name="tag-trans" tag="div" class="ev-tag-list">
            <div v-for="(task, idx) in microList" :key="task + idx" class="ev-tag-item micro-tag">
              {{ task }}
            </div>
          </TransitionGroup>
        </div>
      </div>

      <!-- Macrotask Queue -->
      <div :class="['ev-box', 'ev-macro', { 'ev-box--active': state.activeComponent === 'macro' }]">
        <div class="ev-header macro-hdr">
          <span class="ev-title">Macrotask Queue</span>
          <span class="ev-badge macro-bdg">Regular • Low Priority</span>
        </div>
        <div class="ev-body queue-body">
          <div v-if="!macroList.length" class="ev-empty">Empty</div>
          <TransitionGroup name="tag-trans" tag="div" class="ev-tag-list">
            <div v-for="(task, idx) in macroList" :key="task + idx" class="ev-tag-item macro-tag">
              {{ task }}
            </div>
          </TransitionGroup>
        </div>
      </div>

      <!-- Terminal Console -->
      <div :class="['ev-box', 'ev-console', { 'ev-box--active': state.activeComponent === 'console' }]">
        <div class="ev-header console-hdr">
          <span class="ev-title">Console Terminal</span>
          <span class="ev-badge console-bdg">STDOUT</span>
        </div>
        <div class="ev-body console-body">
          <div v-if="!logList.length" class="ev-empty-console">// waiting for output...</div>
          <div v-for="(log, idx) in logList" :key="idx" class="ev-log-line">
            <span class="ev-prompt">&gt;</span> {{ log }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ev-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
  height: 100%;
}
.ev-row {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr 1.2fr;
  gap: 8px;
  flex: 1;
  min-height: 0;
}
.ev-box {
  background: #ffffff;
  border-radius: 8px;
  border: 1.5px solid #cbd5e1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: all 0.2s ease;
}
.ev-box--active {
  box-shadow: 0 0 0 2px #3b82f6;
  border-color: #2563eb;
}
.ev-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 8px;
  border-bottom: 1px solid #e2e8f0;
  font-size: 10px;
  font-weight: 700;
  font-family: 'Inter', system-ui, sans-serif;
  flex-shrink: 0;
}
.ev-title {
  color: #1e293b;
}
.ev-badge {
  font-size: 8px;
  font-family: 'JetBrains Mono', monospace;
  font-weight: 700;
  padding: 1px 4px;
  border-radius: 3px;
  text-transform: uppercase;
}

/* Color schemes */
.stack-hdr { background: #eff6ff; }
.stack-bdg { background: #2563eb; color: #fff; }
.webapi-hdr { background: #fff7ed; }
.webapi-bdg { background: #ea580c; color: #fff; }
.loop-hdr { background: #fdf2f8; }
.loop-bdg { background: #db2777; color: #fff; }
.micro-hdr { background: #f0fdf4; }
.micro-bdg { background: #16a34a; color: #fff; }
.macro-hdr { background: #faf5ff; }
.macro-bdg { background: #7c3aed; color: #fff; }
.console-hdr { background: #0f172a; border-bottom: 1px solid #334155; }
.console-hdr .ev-title { color: #f8fafc; }
.console-bdg { background: #38bdf8; color: #0f172a; }

.ev-body {
  flex: 1;
  padding: 6px;
  overflow-y: auto;
  font-family: 'JetBrains Mono', monospace;
}
.ev-empty {
  font-size: 9.5px;
  color: #94a3b8;
  text-align: center;
  margin: auto;
  padding: 8px 0;
  font-style: italic;
}

/* Stack styling (LIFO bottom-up) */
.stack-body {
  display: flex;
  flex-direction: column-reverse;
  background: #f8fafc;
}
.ev-stack-list {
  display: flex;
  flex-direction: column-reverse;
  gap: 3px;
  width: 100%;
}
.ev-frame {
  background: #dbeafe;
  color: #1e40af;
  border: 1px solid #93c5fd;
  border-radius: 4px;
  padding: 3px 6px;
  font-size: 9.5px;
  font-weight: 600;
  text-align: center;
  transition: all 0.2s ease;
}
.ev-frame--top {
  background: #2563eb;
  color: #ffffff;
  border-color: #1d4ed8;
  box-shadow: 0 2px 4px rgba(37, 99, 235, 0.25);
}

/* Loop centerpiece */
.loop-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  background: #fdf4ff;
}
.ev-loop-orbit {
  position: relative;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.ev-loop-spinner {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 2px dashed #ec4899;
  animation: spin 6s linear infinite;
}
.ev-loop-core {
  font-size: 15px;
  color: #db2777;
  font-weight: 800;
}
.ev-loop-status {
  font-size: 9.5px;
  color: #831843;
  font-weight: 600;
  text-align: center;
  line-height: 1.2;
}

/* Tags and queue items */
.queue-body {
  background: #fafafa;
}
.ev-tag-list {
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.ev-tag-item {
  font-size: 9.5px;
  padding: 3px 6px;
  border-radius: 4px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
}
.webapi-tag {
  background: #ffedd5;
  color: #9a3412;
  border: 1px solid #fed7aa;
}
.micro-tag {
  background: #dcfce7;
  color: #166534;
  border: 1px solid #bbf7d0;
}
.macro-tag {
  background: #f3e8ff;
  color: #6b21a8;
  border: 1px solid #e9d5ff;
}
.ev-tag-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #ea580c;
}

/* Console terminal */
.console-body {
  background: #090d16;
  color: #4ade80;
  font-size: 9.5px;
  line-height: 1.4;
}
.ev-empty-console {
  color: #475569;
  font-style: italic;
  font-size: 9px;
}
.ev-log-line {
  display: flex;
  gap: 4px;
}
.ev-prompt {
  color: #38bdf8;
  user-select: none;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Transitions */
.stack-trans-enter-active, .stack-trans-leave-active,
.tag-trans-enter-active, .tag-trans-leave-active {
  transition: all 0.2s ease;
}
.stack-trans-enter-from, .tag-trans-enter-from {
  opacity: 0;
  transform: translateY(-6px) scale(0.96);
}
.stack-trans-leave-to, .tag-trans-leave-to {
  opacity: 0;
  transform: translateY(6px) scale(0.96);
}
</style>
