<script setup lang="ts">
import { computed } from 'vue'
import { useSimulator, type SimulatorStep } from '../composables/useSimulator'
import CodePanel from './CodePanel.vue'
import CallStackView from './CallStackView.vue'
import WebApiView from './WebApiView.vue'
import QueueView from './QueueView.vue'
import EventLoopRing from './EventLoopRing.vue'
import ConsolePanel from './ConsolePanel.vue'
import CaptionBar from './CaptionBar.vue'
import PredictOutput from './PredictOutput.vue'
import PersistentLegend from './PersistentLegend.vue'
import ProgressBar from './ProgressBar.vue'

const props = defineProps<{
  steps: SimulatorStep[]
  code: string | string[]
  step?: number
  slideNumber?: number
  totalSlides?: number
  title?: string
  takeaway?: string
  annotations?: Record<number, string>
}>()

const { state, stepIndex, totalSteps } = useSimulator(
  props.steps,
  () => (props.step !== undefined ? props.step : 0)
)

const isLastStep = computed(() => stepIndex.value >= totalSteps - 1)
</script>

<template>
  <div class="h-full w-full flex flex-col justify-between select-none relative font-sans text-slate-900 overflow-hidden">
    <PersistentLegend />
    <ProgressBar :step="stepIndex" :total-steps="totalSteps" :slide-number="slideNumber" :total-slides="totalSlides" />

    <!-- Moving Token Animation Overlay (Compact) -->
    <div
      v-if="state.tokenMovement"
      class="absolute top-11 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
    >
      <div class="bg-amber-400 text-slate-950 font-black px-3 py-1 rounded-xl shadow-xl border-2 border-amber-600 flex items-center gap-1.5 animate-bounce text-xs">
        <span>🚀</span>
        <span class="font-mono bg-white px-1.5 py-0.5 rounded border border-amber-500 font-bold">{{ state.tokenMovement.label }}</span>
        <span>[{{ state.tokenMovement.from }} ➔ {{ state.tokenMovement.to }}]</span>
      </div>
    </div>

    <!-- Active Caption Bar -->
    <CaptionBar
      :caption="state.caption"
      :phase="state.phase"
      :is-last="isLastStep"
      :takeaway="takeaway"
    />

    <!-- Classroom Predict Output Pause Point (Compact) -->
    <PredictOutput
      v-if="state.predictPrompt"
      :prompt="state.predictPrompt"
      :revealed="!!state.predictReveal"
      :answer="state.predictReveal"
      :common-mistake="state.commonMistake"
      :what-if="state.whatIf"
    />

    <!-- Main Grid Layout (Strictly fits available height, no overflow) -->
    <div class="flex-1 grid grid-cols-12 gap-2 min-h-0 overflow-hidden items-stretch mb-2">
      <!-- Left Column: Code Panel (5 cols) -->
      <div class="col-span-5 h-full min-h-0">
        <CodePanel
          :code="code"
          :active-line="state.line"
          :annotations="annotations"
          :title="title || 'Live Execution Trace'"
        />
      </div>

      <!-- Center Column: Call Stack & Event Loop Ring (4 cols) -->
      <div class="col-span-4 flex flex-col gap-1.5 h-full min-h-0">
        <div class="flex-1 min-h-0">
          <CallStackView
            :frames="state.callStack"
            :is-blocked="state.phase === 'blocked'"
          />
        </div>
        <div class="shrink-0 h-[64px]">
          <EventLoopRing
            :is-stack-empty="state.loopQuestion?.isStackEmpty ?? (state.callStack?.length === 0)"
            :has-microtasks="state.loopQuestion?.hasMicrotasks ?? (state.microtasks?.length > 0)"
            :has-macrotasks="state.loopQuestion?.hasMacrotasks ?? (state.macrotasks?.length > 0)"
            :decision="state.loopQuestion?.decision"
            :question="state.loopQuestion?.question"
            :is-spinning="state.phase === 'macrotasks' || state.phase === 'microtasks'"
          />
        </div>
      </div>

      <!-- Right Column: Host Web APIs, Microtasks, Macrotasks, Console (3 cols) -->
      <div class="col-span-3 flex flex-col gap-1.5 h-full min-h-0">
        <!-- Web APIs -->
        <div class="h-[76px] shrink-0">
          <WebApiView :items="state.webApis" />
        </div>

        <!-- Microtask Queue -->
        <div class="shrink-0">
          <QueueView
            title="Microtask Queue"
            type="micro"
            :items="state.microtasks"
            :active-drain="state.phase === 'microtasks'"
          />
        </div>

        <!-- Macrotask Queue -->
        <div class="shrink-0">
          <QueueView
            title="Macrotask Queue"
            type="macro"
            :items="state.macrotasks"
            :active-drain="state.phase === 'macrotasks'"
          />
        </div>

        <!-- Console stdout -->
        <div class="flex-1 min-h-0">
          <ConsolePanel :logs="state.console" />
        </div>
      </div>
    </div>
  </div>
</template>
