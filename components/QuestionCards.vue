<script setup lang="ts">
import { computed } from 'vue'

export interface QuestionItem {
  type: 'WHAT' | 'HOW' | 'WHERE' | 'WHEN'
  q: string
  a: string
  revealStep: number
}

const props = defineProps<{
  items: QuestionItem[]
  step: number
}>()

const TYPE_CONFIG = {
  WHAT: {
    bg: '#eff6ff',
    border: '#93c5fd',
    badgeBg: '#2563eb',
    badgeFg: '#ffffff',
    title: 'WHAT happens?',
    icon: '🔍'
  },
  HOW: {
    bg: '#faf5ff',
    border: '#d8b4fe',
    badgeBg: '#7c3aed',
    badgeFg: '#ffffff',
    title: 'HOW does it work?',
    icon: '⚙️'
  },
  WHERE: {
    bg: '#fffbeb',
    border: '#fde68a',
    badgeBg: '#d97706',
    badgeFg: '#ffffff',
    title: 'WHERE does it live?',
    icon: '📍'
  },
  WHEN: {
    bg: '#ecfdf5',
    border: '#a7f3d0',
    badgeBg: '#059669',
    badgeFg: '#ffffff',
    title: 'WHEN does it run?',
    icon: '⏱️'
  }
}
</script>

<template>
  <div class="qc-grid">
    <div
      v-for="(item, idx) in items"
      :key="idx"
      :class="[
        'qc-card',
        {
          'qc-card--revealed': step >= item.revealStep,
          'qc-card--active': step === item.revealStep
        }
      ]"
      :style="{
        background: step >= item.revealStep ? TYPE_CONFIG[item.type].bg : '#f8fafc',
        borderColor: step >= item.revealStep ? TYPE_CONFIG[item.type].border : '#e2e8f0'
      }"
    >
      <div class="qc-top">
        <span
          class="qc-badge"
          :style="{
            background: step >= item.revealStep ? TYPE_CONFIG[item.type].badgeBg : '#94a3b8',
            color: TYPE_CONFIG[item.type].badgeFg
          }"
        >
          {{ item.type }}
        </span>
        <span class="qc-type-label">{{ TYPE_CONFIG[item.type].title }}</span>
        <span class="qc-icon">{{ TYPE_CONFIG[item.type].icon }}</span>
      </div>

      <div class="qc-q">{{ item.q }}</div>

      <div class="qc-answer-box">
        <Transition name="fade-slide" mode="out-in">
          <div v-if="step >= item.revealStep" class="qc-a">
            <span class="qc-a-prefix">Insight:</span> {{ item.a }}
          </div>
          <div v-else class="qc-a-hidden">
            <span class="qc-lock">🔒</span> Next click reveals answer...
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<style scoped>
.qc-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
  height: 100%;
  justify-content: space-between;
}
.qc-card {
  padding: 8px 12px;
  border-radius: 8px;
  border: 1.5px solid #e2e8f0;
  transition: all 0.25s ease;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.qc-card--active {
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.16);
  transform: translateY(-1px);
}
.qc-top {
  display: flex;
  align-items: center;
  gap: 6px;
}
.qc-badge {
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.08em;
  padding: 1.5px 6px;
  border-radius: 4px;
  font-family: 'JetBrains Mono', monospace;
}
.qc-type-label {
  font-size: 11px;
  font-weight: 700;
  color: #334155;
}
.qc-icon {
  margin-left: auto;
  font-size: 12px;
}
.qc-q {
  font-size: 11.5px;
  font-weight: 600;
  color: #0f172a;
  line-height: 1.35;
}
.qc-answer-box {
  min-height: 28px;
  display: flex;
  align-items: center;
}
.qc-a {
  font-size: 11px;
  color: #1e293b;
  line-height: 1.4;
  background: rgba(255, 255, 255, 0.7);
  padding: 4px 8px;
  border-radius: 5px;
  width: 100%;
}
.qc-a-prefix {
  font-weight: 700;
  color: #0f172a;
}
.qc-a-hidden {
  font-size: 10.5px;
  color: #94a3b8;
  font-style: italic;
  display: flex;
  align-items: center;
  gap: 4px;
}
.qc-lock {
  font-size: 10px;
}
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.2s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(4px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
