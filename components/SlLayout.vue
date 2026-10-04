<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  topic: string
  pair: string
  step: number
  captions: string[]
  phase?: 'intro' | 'concept' | 'demo' | 'quiz' | 'recap'
}>()

const PHASES: Record<string, { bg: string; fg: string; label: string }> = {
  intro:   { bg: '#0f172a', fg: '#fff', label: 'Hook'    },
  concept: { bg: '#2563eb', fg: '#fff', label: 'Concept' },
  demo:    { bg: '#ea580c', fg: '#fff', label: 'Demo'    },
  quiz:    { bg: '#7c3aed', fg: '#fff', label: 'Quiz'    },
  recap:   { bg: '#16a34a', fg: '#fff', label: 'Recap'   },
}

const ph = computed(() => PHASES[props.phase ?? 'concept'])
const caption = computed(() => {
  const i = Math.min(props.step, props.captions.length - 1)
  return props.captions[i] ?? ''
})
</script>

<template>
  <div class="sl-root">
    <!-- ── Header ── -->
    <header class="sl-header">
      <span class="sl-crumb">JS Event Loop</span>
      <span class="sl-arrow">›</span>
      <span class="sl-topic">{{ topic }}</span>
      <div class="sl-right">
        <span class="sl-pair">{{ pair }}</span>
        <span class="sl-phase" :style="{ background: ph.bg, color: ph.fg }">
          {{ ph.label }}
        </span>
        <span class="sl-counter">{{ Math.min(step, captions.length - 1) }}&thinsp;/&thinsp;{{ captions.length - 1 }}</span>
      </div>
    </header>

    <!-- ── Content slot ── -->
    <main class="sl-main">
      <slot />
    </main>

    <!-- ── Caption bar ── -->
    <footer class="sl-caption">
      <Transition name="cap" mode="out-in">
        <p :key="caption" class="sl-cap-text">{{ caption }}</p>
      </Transition>
    </footer>
  </div>
</template>

<style scoped>
.sl-root {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  font-family: 'Inter', system-ui, sans-serif;
  color: #0f172a;
  overflow: hidden;
}

/* Header */
.sl-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 18px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  flex-shrink: 0;
  min-height: 38px;
}
.sl-crumb {
  font-size: 9px;
  font-weight: 700;
  letter-spacing: .12em;
  text-transform: uppercase;
  color: #94a3b8;
  font-family: 'JetBrains Mono', monospace;
}
.sl-arrow { color: #cbd5e1; font-size: 13px; }
.sl-topic { font-size: 13px; font-weight: 700; color: #1e293b; }
.sl-right { margin-left: auto; display: flex; align-items: center; gap: 8px; }
.sl-pair {
  font-size: 10px;
  padding: 2px 7px;
  border-radius: 4px;
  background: #dbeafe;
  color: #1d4ed8;
  font-family: 'JetBrains Mono', monospace;
  font-weight: 700;
}
.sl-phase {
  font-size: 10px;
  padding: 2px 9px;
  border-radius: 4px;
  font-weight: 600;
}
.sl-counter {
  font-size: 10px;
  color: #94a3b8;
  font-family: 'JetBrains Mono', monospace;
}

/* Main */
.sl-main {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* Caption */
.sl-caption {
  background: #eff6ff;
  border-top: 2.5px solid #3b82f6;
  padding: 9px 18px;
  min-height: 48px;
  display: flex;
  align-items: center;
  flex-shrink: 0;
}
.sl-cap-text {
  margin: 0;
  font-size: 12.5px;
  font-weight: 500;
  color: #1e40af;
  line-height: 1.45;
}

/* Transitions */
.cap-enter-active, .cap-leave-active { transition: opacity .15s, transform .15s; }
.cap-enter-from { opacity: 0; transform: translateY(5px); }
.cap-leave-to   { opacity: 0; transform: translateY(-5px); }
</style>
