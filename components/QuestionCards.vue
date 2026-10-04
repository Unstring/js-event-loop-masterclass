<script setup lang="ts">
import { computed } from 'vue'

export interface QuestionItem {
  type: 'WHAT' | 'HOW' | 'WHERE' | 'WHEN'
  q: string
  a: string
  revealStep: number
  pinpoint?: string
}

const props = defineProps<{
  items: QuestionItem[]
  step: number
}>()

const TYPE_CONFIG = {
  WHAT: {
    bg: '#eff6ff',
    border: '#93c5fd',
    activeBorder: '#2563eb',
    badgeBg: '#2563eb',
    badgeFg: '#ffffff',
    title: 'WHAT happens?',
    icon: '🔍'
  },
  HOW: {
    bg: '#faf5ff',
    border: '#d8b4fe',
    activeBorder: '#7c3aed',
    badgeBg: '#7c3aed',
    badgeFg: '#ffffff',
    title: 'HOW does it work?',
    icon: '⚙️'
  },
  WHERE: {
    bg: '#fffbeb',
    border: '#fde68a',
    activeBorder: '#d97706',
    badgeBg: '#d97706',
    badgeFg: '#ffffff',
    title: 'WHERE does it live?',
    icon: '📍'
  },
  WHEN: {
    bg: '#ecfdf5',
    border: '#a7f3d0',
    activeBorder: '#059669',
    badgeBg: '#059669',
    badgeFg: '#ffffff',
    title: 'WHEN does it run?',
    icon: '⏱️'
  }
}
</script>

<template>
  <div class="qc-root">
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
        background: step >= item.revealStep ? TYPE_CONFIG[item.type].bg : '#ffffff',
        borderColor: step === item.revealStep
          ? TYPE_CONFIG[item.type].activeBorder
          : (step >= item.revealStep ? TYPE_CONFIG[item.type].border : '#e2e8f0')
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
          <div v-if="step >= item.revealStep" class="qc-a-content">
            <div class="qc-a">
              <span class="qc-a-bold">Explanation:</span> {{ item.a }}
            </div>
            <div v-if="item.pinpoint" class="qc-pinpoint">
              <span class="pinpoint-tag">Rule:</span> {{ item.pinpoint }}
            </div>
          </div>
          <div v-else class="qc-a-hidden">
            <span class="qc-lock">🔒</span> Advance click to reveal architectural answer
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<style scoped>
.qc-root {
  display: flex;
  flex-direction: column;
  gap: 7px;
  height: 100%;
  justify-content: space-between;
}
.qc-card {
  padding: 7px 11px;
  border-radius: 8px;
  border: 1.5px solid #e2e8f0;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  flex-direction: column;
  gap: 3px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.03);
}
.qc-card--active {
  box-shadow: 0 4px 14px rgba(37, 99, 235, 0.2);
  transform: translateY(-1px);
}
.qc-top {
  display: flex;
  align-items: center;
  gap: 6px;
}
.qc-badge {
  font-size: 8.5px;
  font-weight: 800;
  letter-spacing: 0.08em;
  padding: 1.5px 6px;
  border-radius: 4px;
  font-family: 'JetBrains Mono', monospace;
}
.qc-type-label {
  font-size: 11px;
  font-weight: 700;
  color: #1e293b;
}
.qc-icon {
  margin-left: auto;
  font-size: 11.5px;
}
.qc-q {
  font-size: 11px;
  font-weight: 700;
  color: #0f172a;
  line-height: 1.35;
}
.qc-answer-box {
  min-height: 26px;
  display: flex;
  align-items: center;
}
.qc-a-content {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.qc-a {
  font-size: 10.5px;
  color: #1e293b;
  line-height: 1.35;
  background: rgba(255, 255, 255, 0.85);
  border: 1px solid rgba(0, 0, 0, 0.06);
  padding: 3px 7px;
  border-radius: 4px;
}
.qc-a-bold {
  font-weight: 800;
  color: #0f172a;
}
.qc-pinpoint {
  font-size: 9.5px;
  color: #1d4ed8;
  font-family: 'JetBrains Mono', monospace;
  display: flex;
  align-items: center;
  gap: 4px;
}
.pinpoint-tag {
  font-weight: 800;
  background: #dbeafe;
  padding: 1px 4px;
  border-radius: 3px;
  text-transform: uppercase;
}
.qc-a-hidden {
  font-size: 10px;
  color: #94a3b8;
  font-style: italic;
  display: flex;
  align-items: center;
  gap: 5px;
}
.qc-lock {
  font-size: 10px;
}
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.18s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(3px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-3px);
}
</style>
