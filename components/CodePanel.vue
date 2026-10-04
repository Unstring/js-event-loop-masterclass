<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  title?: string
  lines: string[]
  activeLine?: number
  highlightLines?: number[]
  tag?: string
  scopeWatch?: Record<string, string | number>
}>()

const active = computed(() => props.activeLine ?? 0)
const highlights = computed(() => props.highlightLines ?? [])

// Fast, zero-dependency JavaScript syntax tokenization for ultra-vivid code rendering
function highlightJs(line: string) {
  if (!line) return '&nbsp;'
  
  // Escape HTML characters first
  let escaped = line
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  // Single-line comments
  if (escaped.trim().startsWith('//') || escaped.trim().startsWith('/*')) {
    return `<span class="token-comment">${escaped}</span>`
  }

  // Strings ('...' or "...")
  escaped = escaped.replace(/(['"])(.*?)\1/g, '<span class="token-string">$1$2$1</span>')

  // Keywords
  escaped = escaped.replace(/\b(const|let|var|function|return|if|else|while|for|async|await|new|class|import|export|from|default)\b/g, '<span class="token-keyword">$1</span>')

  // Built-in objects and methods
  escaped = escaped.replace(/\b(console|setTimeout|setInterval|Promise|resolve|reject|Date|now|Math|queueMicrotask)\b/g, '<span class="token-builtin">$1</span>')
  escaped = escaped.replace(/\.(log|then|catch|finally|push|pop)\b/g, '.<span class="token-method">$1</span>')

  // Numbers
  escaped = escaped.replace(/\b(\d+)\b/g, '<span class="token-number">$1</span>')

  // Arrow functions and operators
  escaped = escaped.replace(/(=&gt;|===|!==|==|!=|\+|-|\*|\/)/g, '<span class="token-operator">$1</span>')

  return escaped
}
</script>

<template>
  <div class="cp-panel">
    <!-- Header bar -->
    <div class="cp-header">
      <div class="cp-dots">
        <span class="cp-dot red" />
        <span class="cp-dot yellow" />
        <span class="cp-dot green" />
      </div>
      <span class="cp-title">{{ title ?? 'script.js' }}</span>
      <div class="cp-right">
        <span v-if="active > 0" class="cp-line-badge">Line {{ active }}</span>
        <span v-if="tag" class="cp-tag">{{ tag }}</span>
      </div>
    </div>

    <!-- Code body -->
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
        <span class="cp-code" v-html="highlightJs(line)" />
      </div>
    </div>

    <!-- Scope / Local Watch bar if provided -->
    <div v-if="scopeWatch && Object.keys(scopeWatch).length" class="cp-scope">
      <div class="cp-scope-title">
        <span class="cp-scope-dot" /> Scope Watch
      </div>
      <div class="cp-scope-vars">
        <span v-for="(val, key) in scopeWatch" :key="key" class="cp-var-tag">
          <span class="cp-var-key">{{ key }}:</span>
          <span class="cp-var-val">{{ val }}</span>
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cp-panel {
  display: flex;
  flex-direction: column;
  background: #0d1117;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.22);
  border: 1.5px solid #30363d;
  height: 100%;
}
.cp-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: #161b22;
  border-bottom: 1px solid #30363d;
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
.cp-dot.red { background: #ff5f56; }
.cp-dot.yellow { background: #ffbd2e; }
.cp-dot.green { background: #27c93f; }
.cp-title {
  font-size: 11.5px;
  font-family: 'JetBrains Mono', monospace;
  font-weight: 700;
  color: #e6edf3;
  letter-spacing: 0.02em;
}
.cp-right {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 6px;
}
.cp-line-badge {
  font-size: 9px;
  padding: 1.5px 6px;
  border-radius: 4px;
  background: rgba(56, 189, 248, 0.2);
  color: #38bdf8;
  font-family: 'JetBrains Mono', monospace;
  font-weight: 700;
}
.cp-tag {
  font-size: 9.5px;
  padding: 1.5px 7px;
  border-radius: 4px;
  background: #21262d;
  color: #79c0ff;
  border: 1px solid #388bfd40;
  font-family: 'JetBrains Mono', monospace;
  font-weight: 700;
}
.cp-body {
  flex: 1;
  padding: 6px 0;
  overflow-y: auto;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  line-height: 1.55;
  background: #0d1117;
}
.cp-line {
  display: flex;
  align-items: center;
  padding: 1px 8px;
  transition: all 0.12s ease;
  white-space: pre;
}
.cp-line--active {
  background: rgba(56, 189, 248, 0.22);
  border-left: 3.5px solid #38bdf8;
  padding-left: 4.5px;
}
.cp-line--highlight {
  background: rgba(245, 158, 11, 0.18);
  border-left: 3.5px solid #f59e0b;
  padding-left: 4.5px;
}
.cp-num {
  width: 22px;
  text-align: right;
  color: #6e7681;
  font-size: 10px;
  user-select: none;
  margin-right: 8px;
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
  font-size: 9.5px;
  font-weight: 900;
  animation: pulse-arrow 0.8s infinite alternate ease-in-out;
}
.cp-code {
  color: #e6edf3;
  font-family: inherit;
}

/* Syntax Token Colors (Vivid & High Contrast) */
:deep(.token-keyword) {
  color: #ff7b72;
  font-weight: 700;
}
:deep(.token-builtin) {
  color: #79c0ff;
  font-weight: 700;
}
:deep(.token-method) {
  color: #d2a8ff;
  font-weight: 600;
}
:deep(.token-string) {
  color: #7ee787;
  font-weight: 500;
}
:deep(.token-number) {
  color: #ffa657;
  font-weight: 600;
}
:deep(.token-operator) {
  color: #79c0ff;
  font-weight: 700;
}
:deep(.token-comment) {
  color: #8b949e;
  font-style: italic;
}

/* Scope watch footer */
.cp-scope {
  background: #161b22;
  border-top: 1px solid #30363d;
  padding: 4px 10px;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}
.cp-scope-title {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 9.5px;
  font-family: 'JetBrains Mono', monospace;
  font-weight: 700;
  color: #8b949e;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.cp-scope-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #238636;
}
.cp-scope-vars {
  display: flex;
  gap: 8px;
  overflow-x: auto;
}
.cp-var-tag {
  font-size: 10px;
  font-family: 'JetBrains Mono', monospace;
  background: #21262d;
  padding: 1px 6px;
  border-radius: 4px;
  border: 1px solid #30363d;
}
.cp-var-key {
  color: #79c0ff;
  font-weight: 600;
  margin-right: 3px;
}
.cp-var-val {
  color: #ffa657;
  font-weight: 700;
}

@keyframes pulse-arrow {
  from { opacity: 0.6; transform: translateX(0); }
  to { opacity: 1; transform: translateX(3px); }
}
</style>
