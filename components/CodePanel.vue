<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  title?: string
  lines: string[]
  activeLine?: number
  highlightLines?: number[]
  tag?: string
}>()

const active = computed(() => props.activeLine ?? 0)
const highlights = computed(() => props.highlightLines ?? [])
</script>

<template>
  <div class="cp-panel">
    <div class="cp-header">
      <div class="cp-dots">
        <span class="cp-dot red" />
        <span class="cp-dot yellow" />
        <span class="cp-dot green" />
      </div>
      <span class="cp-title">{{ title ?? 'script.js' }}</span>
      <span v-if="tag" class="cp-tag">{{ tag }}</span>
    </div>
    <div class="cp-body">
      <div
        v-for="(line, idx) in lines"
        :key="idx"
        :class="[
          'cp-line',
          {
            'cp-line--active': active === idx + 1,
            'cp-line--highlight': highlights.includes(idx + 1)
          }
        ]"
      >
        <span class="cp-num">{{ idx + 1 }}</span>
        <span class="cp-pointer">
          <span v-if="active === idx + 1" class="cp-arrow">▶</span>
        </span>
        <code class="cp-code">{{ line }}</code>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cp-panel {
  display: flex;
  flex-direction: column;
  background: #0f172a;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 14px rgba(15, 23, 42, 0.12);
  border: 1px solid #1e293b;
  height: 100%;
}
.cp-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: #1e293b;
  border-bottom: 1px solid #334155;
  flex-shrink: 0;
}
.cp-dots {
  display: flex;
  gap: 5px;
}
.cp-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
}
.cp-dot.red { background: #ef4444; }
.cp-dot.yellow { background: #eab308; }
.cp-dot.green { background: #22c55e; }
.cp-title {
  font-size: 11px;
  font-family: 'JetBrains Mono', monospace;
  font-weight: 600;
  color: #94a3b8;
}
.cp-tag {
  margin-left: auto;
  font-size: 9px;
  padding: 1px 6px;
  border-radius: 4px;
  background: #334155;
  color: #38bdf8;
  font-family: 'JetBrains Mono', monospace;
  font-weight: 600;
}
.cp-body {
  flex: 1;
  padding: 8px 0;
  overflow-y: auto;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  line-height: 1.5;
}
.cp-line {
  display: flex;
  align-items: center;
  padding: 1.5px 10px;
  transition: background 0.15s ease;
  white-space: pre;
}
.cp-line--active {
  background: rgba(56, 189, 248, 0.18);
  border-left: 3px solid #38bdf8;
  padding-left: 7px;
}
.cp-line--highlight {
  background: rgba(245, 158, 11, 0.15);
}
.cp-num {
  width: 22px;
  text-align: right;
  color: #475569;
  font-size: 10px;
  user-select: none;
  margin-right: 6px;
  flex-shrink: 0;
}
.cp-pointer {
  width: 12px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
}
.cp-arrow {
  color: #38bdf8;
  font-size: 9px;
  animation: pulse 1s infinite alternate;
}
.cp-code {
  color: #f1f5f9;
  font-family: inherit;
}
@keyframes pulse {
  from { opacity: 0.6; transform: translateX(0); }
  to { opacity: 1; transform: translateX(2px); }
}
</style>
