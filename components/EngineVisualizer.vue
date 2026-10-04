<script setup lang="ts">
import { computed } from 'vue'

export interface EngineState {
  stack?: string[]
  webApis?: string[]
  microtasks?: string[]
  macrotasks?: string[]
  logs?: string[]
  loopStatus?: string
  loopPhase?: 'stack' | 'micro' | 'render' | 'macro' | 'idle'
  pinpointRule?: string
  activeComponent?: 'stack' | 'webapi' | 'micro' | 'macro' | 'loop' | 'console' | 'pinpoint'
}

const props = defineProps<{
  state: EngineState
}>()

const stackFrames = computed(() => props.state.stack ?? [])
const webApiList = computed(() => props.state.webApis ?? [])
const microList = computed(() => props.state.microtasks ?? [])
const macroList = computed(() => props.state.macrotasks ?? [])
const logList = computed(() => props.state.logs ?? [])
const loopText = computed(() => props.state.loopStatus ?? 'Observing Call Stack...')
const loopPhase = computed(() => props.state.loopPhase ?? 'stack')
</script>

<template>
  <div class="ev-root">
    <!-- Top Row: Call Stack + Event Loop Gateway + Web APIs -->
    <div class="ev-row top-row">
      <!-- Call Stack -->
      <div :class="['ev-card', 'card-stack', { 'card--focused': state.activeComponent === 'stack' }]">
        <div class="ev-head head-stack">
          <div class="head-left">
            <span class="ev-icon">🥞</span>
            <span class="ev-label">Call Stack</span>
          </div>
          <div class="head-right">
            <span class="ev-badge bdg-stack">LIFO</span>
            <span class="ev-count">{{ stackFrames.length }} frame{{ stackFrames.length === 1 ? '' : 's' }}</span>
          </div>
        </div>
        <div class="ev-body body-stack">
          <div v-if="!stackFrames.length" class="ev-empty-stack">
            <span class="empty-icon">🟢</span>
            <span class="empty-text">Stack Empty (Thread Idle)</span>
          </div>
          <TransitionGroup name="stack-pop" tag="div" class="stack-list">
            <div
              v-for="(f, idx) in stackFrames"
              :key="f + idx"
              :class="['stack-frame', { 'frame--active': idx === stackFrames.length - 1 }]"
            >
              <span class="frame-idx">#{{ stackFrames.length - idx }}</span>
              <span class="frame-name">{{ f }}</span>
              <span v-if="idx === stackFrames.length - 1" class="frame-status">ACTIVE</span>
            </div>
          </TransitionGroup>
        </div>
      </div>

      <!-- Event Loop Centerpiece -->
      <div :class="['ev-card', 'card-loop', { 'card--focused': state.activeComponent === 'loop' }]">
        <div class="ev-head head-loop">
          <div class="head-left">
            <span class="ev-icon">🔄</span>
            <span class="ev-label">Event Loop Coordinator</span>
          </div>
          <span class="ev-badge bdg-loop">{{ loopPhase.toUpperCase() }}</span>
        </div>
        <div class="ev-body body-loop">
          <div class="loop-graphic">
            <div class="loop-ring-outer" :class="'phase-' + loopPhase">
              <div class="loop-ring-inner">
                <span class="loop-symbol">⚡</span>
              </div>
            </div>
          </div>
          <div class="loop-desc-box">
            <div class="loop-status-text">{{ loopText }}</div>
          </div>
        </div>
      </div>

      <!-- Browser Web APIs -->
      <div :class="['ev-card', 'card-webapi', { 'card--focused': state.activeComponent === 'webapi' }]">
        <div class="ev-head head-webapi">
          <div class="head-left">
            <span class="ev-icon">🌐</span>
            <span class="ev-label">Web APIs</span>
          </div>
          <div class="head-right">
            <span class="ev-badge bdg-webapi">Background C++</span>
          </div>
        </div>
        <div class="ev-body body-webapi">
          <div v-if="!webApiList.length" class="ev-empty">
            <span class="empty-text">No active timers or background workers</span>
          </div>
          <TransitionGroup name="tag-slide" tag="div" class="tag-list">
            <div v-for="(api, idx) in webApiList" :key="api + idx" class="webapi-item">
              <span class="webapi-spinner" />
              <span class="webapi-text">{{ api }}</span>
            </div>
          </TransitionGroup>
        </div>
      </div>
    </div>

    <!-- Bottom Row: Microtask Queue + Macrotask Queue + Terminal Console -->
    <div class="ev-row bottom-row">
      <!-- Microtask Queue -->
      <div :class="['ev-card', 'card-micro', { 'card--focused': state.activeComponent === 'micro' }]">
        <div class="ev-head head-micro">
          <div class="head-left">
            <span class="ev-icon">⭐</span>
            <span class="ev-label">Microtask Queue</span>
          </div>
          <span class="ev-badge bdg-micro">VIP Priority</span>
        </div>
        <div class="ev-body body-micro">
          <div v-if="!microList.length" class="ev-empty">
            <span class="empty-text">Queue Empty</span>
          </div>
          <TransitionGroup name="tag-slide" tag="div" class="queue-list">
            <div v-for="(item, idx) in microList" :key="item + idx" class="micro-item">
              <span class="q-ticket">#{{ idx + 1 }}</span>
              <span class="q-name">{{ item }}</span>
            </div>
          </TransitionGroup>
        </div>
      </div>

      <!-- Macrotask Queue -->
      <div :class="['ev-card', 'card-macro', { 'card--focused': state.activeComponent === 'macro' }]">
        <div class="ev-head head-macro">
          <div class="head-left">
            <span class="ev-icon">⏳</span>
            <span class="ev-label">Macrotask Queue</span>
          </div>
          <span class="ev-badge bdg-macro">Regular Task</span>
        </div>
        <div class="ev-body body-macro">
          <div v-if="!macroList.length" class="ev-empty">
            <span class="empty-text">Queue Empty</span>
          </div>
          <TransitionGroup name="tag-slide" tag="div" class="queue-list">
            <div v-for="(item, idx) in macroList" :key="item + idx" class="macro-item">
              <span class="q-ticket">#{{ idx + 1 }}</span>
              <span class="q-name">{{ item }}</span>
            </div>
          </TransitionGroup>
        </div>
      </div>

      <!-- Terminal Console Output -->
      <div :class="['ev-card', 'card-console', { 'card--focused': state.activeComponent === 'console' }]">
        <div class="ev-head head-console">
          <div class="head-left">
            <span class="ev-icon">💻</span>
            <span class="ev-label">Console STDOUT</span>
          </div>
          <span class="ev-badge bdg-console">{{ logList.length }} output{{ logList.length === 1 ? '' : 's' }}</span>
        </div>
        <div class="ev-body body-console">
          <div v-if="!logList.length" class="console-idle">// waiting for stdout...</div>
          <div v-for="(log, idx) in logList" :key="idx" class="console-line">
            <span class="console-prompt">❯</span>
            <span class="console-log">{{ log }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Optional Pinpoint Rule Bar -->
    <div v-if="state.pinpointRule" class="ev-pinpoint">
      <span class="pinpoint-badge">Engine Pinpoint:</span>
      <span class="pinpoint-text">{{ state.pinpointRule }}</span>
    </div>
  </div>
</template>

<style scoped>
.ev-root {
  display: flex;
  flex-direction: column;
  gap: 8px;
  height: 100%;
}
.ev-row {
  display: grid;
  gap: 8px;
  flex: 1;
  min-height: 0;
}
.top-row {
  grid-template-columns: 1.15fr 0.95fr 1.15fr;
}
.bottom-row {
  grid-template-columns: 1.15fr 1.05fr 1.1fr;
}

/* Card base */
.ev-card {
  background: #ffffff;
  border-radius: 8px;
  border: 1.5px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}
.card--focused {
  border-color: #3b82f6 !important;
  box-shadow: 0 0 0 2.5px rgba(59, 130, 246, 0.25), 0 4px 12px rgba(0, 0, 0, 0.08) !important;
  transform: translateY(-1px);
}

/* Card Header */
.ev-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px 10px;
  border-bottom: 1px solid #e2e8f0;
  flex-shrink: 0;
}
.head-left {
  display: flex;
  align-items: center;
  gap: 6px;
}
.head-right {
  display: flex;
  align-items: center;
  gap: 6px;
}
.ev-icon {
  font-size: 12px;
}
.ev-label {
  font-size: 11px;
  font-weight: 700;
  color: #1e293b;
  font-family: 'Inter', system-ui, sans-serif;
}
.ev-badge {
  font-size: 8.5px;
  font-family: 'JetBrains Mono', monospace;
  font-weight: 800;
  padding: 1.5px 5px;
  border-radius: 4px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}
.ev-count {
  font-size: 9px;
  color: #64748b;
  font-family: 'JetBrains Mono', monospace;
  font-weight: 600;
}

/* Header colors */
.head-stack { background: #eff6ff; }
.bdg-stack { background: #2563eb; color: #fff; }

.head-loop { background: #fdf2f8; }
.bdg-loop { background: #db2777; color: #fff; }

.head-webapi { background: #fff7ed; }
.bdg-webapi { background: #ea580c; color: #fff; }

.head-micro { background: #f0fdf4; }
.bdg-micro { background: #16a34a; color: #fff; }

.head-macro { background: #faf5ff; }
.bdg-macro { background: #7c3aed; color: #fff; }

.head-console { background: #161b22; border-color: #30363d; }
.head-console .ev-label { color: #f0f6fc; }
.bdg-console { background: #38bdf8; color: #0f172a; }

/* Body base */
.ev-body {
  flex: 1;
  padding: 6px 8px;
  overflow-y: auto;
  font-family: 'JetBrains Mono', monospace;
  background: #f8fafc;
}
.ev-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-size: 9.5px;
  color: #94a3b8;
  font-style: italic;
  text-align: center;
}

/* Call stack frames */
.body-stack {
  display: flex;
  flex-direction: column-reverse;
  background: #f0f7ff;
}
.ev-empty-stack {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin: auto;
  font-size: 10px;
  color: #059669;
  font-weight: 600;
}
.stack-list {
  display: flex;
  flex-direction: column-reverse;
  gap: 3px;
  width: 100%;
}
.stack-frame {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #ffffff;
  color: #1e40af;
  border: 1.5px solid #93c5fd;
  border-radius: 5px;
  padding: 3px 7px;
  font-size: 10px;
  font-weight: 600;
}
.frame--active {
  background: #2563eb;
  color: #ffffff;
  border-color: #1d4ed8;
  box-shadow: 0 2px 6px rgba(37, 99, 235, 0.3);
}
.frame-idx {
  font-size: 8.5px;
  opacity: 0.8;
}
.frame-name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.frame-status {
  font-size: 7.5px;
  background: #fbbf24;
  color: #78350f;
  padding: 1px 4px;
  border-radius: 3px;
  font-weight: 800;
}

/* Event Loop graphic */
.body-loop {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background: #fff5f7;
  padding: 4px;
}
.loop-graphic {
  position: relative;
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.loop-ring-outer {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 2.5px dashed #db2777;
  animation: loop-rotate 4s linear infinite;
}
.loop-ring-outer.phase-micro { border-color: #16a34a; }
.loop-ring-outer.phase-macro { border-color: #7c3aed; }
.loop-ring-outer.phase-idle { border-color: #94a3b8; animation-duration: 10s; }
.loop-ring-inner {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: #ffffff;
  border-radius: 50%;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}
.loop-symbol {
  font-size: 13px;
}
.loop-desc-box {
  background: rgba(255, 255, 255, 0.85);
  border: 1px solid #fbcfe8;
  border-radius: 5px;
  padding: 3px 6px;
  width: 90%;
  text-align: center;
}
.loop-status-text {
  font-size: 9.5px;
  font-weight: 700;
  color: #9d174d;
  line-height: 1.25;
}

/* Web APIs & Queue items */
.body-webapi { background: #fffaf5; }
.tag-list, .queue-list {
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.webapi-item {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #ffedd5;
  border: 1px solid #fed7aa;
  color: #9a3412;
  padding: 3px 6px;
  border-radius: 4px;
  font-size: 9.5px;
  font-weight: 600;
}
.webapi-spinner {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  border: 1.5px solid #ea580c;
  border-top-color: transparent;
  animation: loop-rotate 1s linear infinite;
  flex-shrink: 0;
}

.body-micro { background: #f6fef9; }
.micro-item {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #dcfce7;
  border: 1px solid #bbf7d0;
  color: #14532d;
  padding: 3px 6px;
  border-radius: 4px;
  font-size: 9.5px;
  font-weight: 700;
}

.body-macro { background: #faf5ff; }
.macro-item {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #ede9fe;
  border: 1px solid #ddd6fe;
  color: #581c87;
  padding: 3px 6px;
  border-radius: 4px;
  font-size: 9.5px;
  font-weight: 700;
}
.q-ticket {
  font-size: 8px;
  opacity: 0.7;
}

/* Console terminal */
.body-console {
  background: #0d1117;
  color: #38bdf8;
  font-size: 10px;
  line-height: 1.45;
}
.console-idle {
  color: #484f58;
  font-size: 9.5px;
  font-style: italic;
  padding-top: 4px;
}
.console-line {
  display: flex;
  align-items: center;
  gap: 5px;
}
.console-prompt {
  color: #22c55e;
  font-weight: 800;
  user-select: none;
}
.console-log {
  color: #e6edf3;
  font-weight: 600;
}

/* Pinpoint Bar */
.ev-pinpoint {
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 6px;
  padding: 4px 10px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 10.5px;
  flex-shrink: 0;
}
.pinpoint-badge {
  font-weight: 800;
  color: #1d4ed8;
  font-family: 'JetBrains Mono', monospace;
  text-transform: uppercase;
  font-size: 9.5px;
}
.pinpoint-text {
  color: #1e3a8a;
  font-weight: 600;
}

@keyframes loop-rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Transitions */
.stack-pop-enter-active, .stack-pop-leave-active,
.tag-slide-enter-active, .tag-slide-leave-active {
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}
.stack-pop-enter-from {
  opacity: 0;
  transform: translateY(-8px) scale(0.95);
}
.stack-pop-leave-to {
  opacity: 0;
  transform: translateY(8px) scale(0.95);
}
.tag-slide-enter-from {
  opacity: 0;
  transform: translateX(-10px);
}
.tag-slide-leave-to {
  opacity: 0;
  transform: translateX(10px);
}
</style>
