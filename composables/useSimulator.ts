import { computed, ref, onMounted, onUnmounted, type Ref } from 'vue'

export interface StackFrame {
  name: string
  args?: string
  locals?: Record<string, any>
  highlight?: boolean
}

export interface WebApiItem {
  id: string
  label: string
  progress?: number // 0 to 100
  timeLeft?: string
  type?: 'timer' | 'fetch' | 'event'
}

export interface QueueItem {
  id: string
  label: string
  type?: 'micro' | 'macro'
  highlight?: boolean
}

export interface SimulatorStep {
  line?: number | number[]
  caption: string
  note?: string
  callStack?: StackFrame[]
  webApis?: WebApiItem[]
  microtasks?: (QueueItem | string)[]
  macrotasks?: (QueueItem | string)[]
  console?: string[]
  variables?: Record<string, any>
  heap?: string[]
  phase?: 'sync' | 'microtasks' | 'render' | 'macrotasks' | 'idle' | 'blocked'
  loopQuestion?: {
    question?: string
    isStackEmpty?: boolean
    hasMicrotasks?: boolean
    hasMacrotasks?: boolean
    decision?: string
  }
  tokenMovement?: {
    label: string
    from: 'code' | 'callStack' | 'webapi' | 'microtasks' | 'macrotasks' | 'console'
    to: 'callStack' | 'webapi' | 'microtasks' | 'macrotasks' | 'console'
  }
  predictPrompt?: string
  predictReveal?: string
  commonMistake?: string
  whatIf?: string
}

export function useSimulator(
  steps: SimulatorStep[],
  externalStep?: Ref<number> | (() => number) | number
) {
  const localStep = ref(0)

  const activeIndex = computed(() => {
    let raw = 0
    if (typeof externalStep === 'number') {
      raw = externalStep
    } else if (typeof externalStep === 'function') {
      raw = externalStep()
    } else if (externalStep && 'value' in externalStep) {
      raw = externalStep.value
    } else {
      raw = localStep.value
    }

    if (raw < 0) return 0
    if (raw >= steps.length) return steps.length - 1
    return raw
  })

  const currentState = computed<SimulatorStep>(() => {
    const s = steps[activeIndex.value] || steps[0] || { caption: '' }
    return {
      line: s.line ?? 0,
      caption: s.caption || '',
      note: s.note || '',
      callStack: s.callStack || [],
      webApis: s.webApis || [],
      microtasks: (s.microtasks || []).map((item, idx) =>
        typeof item === 'string' ? { id: `m-${idx}`, label: item, type: 'micro' } : item
      ),
      macrotasks: (s.macrotasks || []).map((item, idx) =>
        typeof item === 'string' ? { id: `t-${idx}`, label: item, type: 'macro' } : item
      ),
      console: s.console || [],
      variables: s.variables || {},
      heap: s.heap || [],
      phase: s.phase || 'sync',
      loopQuestion: s.loopQuestion,
      tokenMovement: s.tokenMovement,
      predictPrompt: s.predictPrompt,
      predictReveal: s.predictReveal,
      commonMistake: s.commonMistake,
      whatIf: s.whatIf
    }
  })

  // Keyboard navigation & reset handler
  const handleKeydown = (e: KeyboardEvent) => {
    if (e.key === 'r' || e.key === 'R') {
      localStep.value = 0
    }
  }

  onMounted(() => {
    window.addEventListener('keydown', handleKeydown)
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown)
  })

  return {
    stepIndex: activeIndex,
    totalSteps: steps.length,
    state: currentState,
    reset: () => { localStep.value = 0 }
  }
}
