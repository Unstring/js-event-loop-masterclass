<script setup lang="ts">
defineProps<{
  blocked?: boolean
  activeOperation?: string
  taskCount?: number
}>()
</script>

<template>
  <div class="tb-container">
    <!-- JS Engine Thread -->
    <div :class="['tb-card', 'tb-main', { 'tb-card--blocked': blocked }]">
      <div class="tb-header">
        <span class="tb-badge js">JS Engine</span>
        <span class="tb-title">Single Main Thread</span>
        <span :class="['tb-status', blocked ? 'status-blocked' : 'status-ok']">
          {{ blocked ? '⛔ BLOCKED (Unresponsive)' : '⚡ RUNNING (1 Op at a time)' }}
        </span>
      </div>
      <div class="tb-content">
        <div class="tb-core">
          <div class="tb-icon">{{ blocked ? '⏳' : '⚙️' }}</div>
          <div class="tb-op-name">{{ activeOperation ?? 'Executing Synchronous Bytecode' }}</div>
        </div>
        <div class="tb-note">
          Only ONE call stack. If a synchronous task takes 5 seconds, DOM rendering and user clicks are frozen!
        </div>
      </div>
    </div>

    <!-- Browser Background Threads -->
    <div class="tb-card tb-browser">
      <div class="tb-header">
        <span class="tb-badge web">Browser Host</span>
        <span class="tb-title">Multi-Threaded Web APIs</span>
        <span class="tb-status status-ok">🌐 Parallel Background Threads</span>
      </div>
      <div class="tb-thread-list">
        <div class="tb-thread-item">
          <span class="tb-dot green" />
          <span class="tb-th-name">Timer Thread</span>
          <span class="tb-th-desc">Counts setTimeout / setInterval ms in C++</span>
        </div>
        <div class="tb-thread-item">
          <span class="tb-dot blue" />
          <span class="tb-th-name">Network Thread</span>
          <span class="tb-th-desc">Performs HTTP requests & fetch() downloads</span>
        </div>
        <div class="tb-thread-item">
          <span class="tb-dot purple" />
          <span class="tb-th-name">UI / Render Thread</span>
          <span class="tb-th-desc">Paints DOM layout at 60fps (waits on Main Thread)</span>
        </div>
        <div class="tb-thread-item">
          <span class="tb-dot orange" />
          <span class="tb-th-name">DOM Event Thread</span>
          <span class="tb-th-desc">Listens for user clicks, keyboard, resize</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tb-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
  height: 100%;
}
.tb-card {
  border-radius: 8px;
  border: 1.5px solid #cbd5e1;
  background: #ffffff;
  padding: 8px 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
}
.tb-card--blocked {
  border-color: #ef4444;
  background: #fef2f2;
  animation: shake 0.4s infinite alternate ease-in-out;
}
.tb-header {
  display: flex;
  align-items: center;
  gap: 8px;
}
.tb-badge {
  font-size: 8.5px;
  font-weight: 800;
  font-family: 'JetBrains Mono', monospace;
  padding: 1.5px 5px;
  border-radius: 4px;
  text-transform: uppercase;
}
.tb-badge.js { background: #facc15; color: #713f12; }
.tb-badge.web { background: #38bdf8; color: #075985; }
.tb-title {
  font-size: 11px;
  font-weight: 700;
  color: #0f172a;
}
.tb-status {
  margin-left: auto;
  font-size: 9.5px;
  font-weight: 700;
  font-family: 'JetBrains Mono', monospace;
}
.status-ok { color: #16a34a; }
.status-blocked { color: #dc2626; font-weight: 800; }

.tb-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.tb-core {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f1f5f9;
  border-radius: 6px;
  padding: 6px 10px;
}
.tb-card--blocked .tb-core {
  background: #fee2e2;
}
.tb-icon {
  font-size: 16px;
}
.tb-op-name {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  font-weight: 600;
  color: #1e293b;
}
.tb-card--blocked .tb-op-name {
  color: #991b1b;
}
.tb-note {
  font-size: 10px;
  color: #475569;
  line-height: 1.35;
}

.tb-thread-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.tb-thread-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 3px 6px;
  background: #f8fafc;
  border-radius: 4px;
  border: 1px solid #e2e8f0;
  font-size: 10px;
}
.tb-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}
.tb-dot.green { background: #22c55e; }
.tb-dot.blue { background: #3b82f6; }
.tb-dot.purple { background: #a855f7; }
.tb-dot.orange { background: #f97316; }

.tb-th-name {
  font-family: 'JetBrains Mono', monospace;
  font-weight: 700;
  color: #1e293b;
  width: 120px;
  flex-shrink: 0;
}
.tb-th-desc {
  color: #64748b;
  font-size: 9.5px;
}

@keyframes shake {
  from { transform: translateX(-1px); }
  to { transform: translateX(1px); }
}
</style>
