<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    step?: number
    title?: string
  }>(),
  {
    step: 0,
    title: 'Execution Context Lifecycle: Creation vs Execution Phase'
  }
)

interface EcStep {
  phase: 'creation' | 'execution'
  codeLine: number
  varEnv: { name: string; val: string; status: 'allocated' | 'assigned' }[]
  lexEnv: { name: string; val: string; status: 'tdz' | 'initialized' | 'assigned' }[]
  callStack: string[]
  action: string
  note: string
}

const ecSteps: EcStep[] = [
  { phase: 'creation', codeLine: 0, varEnv: [], lexEnv: [], callStack: ['Global EC'], action: 'Engine initializes Global Execution Context (GEC)', note: 'Step 1: Base Global Execution Context pushed to Call Stack.' },
  { phase: 'creation', codeLine: 0, varEnv: [{ name: 'window / global', val: 'GlobalObject', status: 'allocated' }], lexEnv: [], callStack: ['Global EC'], action: 'Global Object and "this" binding created', note: 'Step 2: "this" bound to window / global.' },
  { phase: 'creation', codeLine: 1, varEnv: [{ name: 'window', val: 'Global', status: 'allocated' }, { name: 'userVar', val: 'undefined', status: 'allocated' }], lexEnv: [], callStack: ['Global EC'], action: 'Hoisting var: userVar memory allocated with undefined', note: 'Step 3: "var" declarations hoisted and initialized to undefined.' },
  { phase: 'creation', codeLine: 2, varEnv: [{ name: 'window', val: 'Global', status: 'allocated' }, { name: 'userVar', val: 'undefined', status: 'allocated' }], lexEnv: [{ name: 'userLet', val: '<uninitialized>', status: 'tdz' }], callStack: ['Global EC'], action: 'Hoisting let: userLet allocated in Lexical Environment (TDZ!)', note: 'Step 4: "let" is hoisted BUT placed in Temporal Dead Zone.' },
  { phase: 'creation', codeLine: 3, varEnv: [{ name: 'window', val: 'Global', status: 'allocated' }, { name: 'userVar', val: 'undefined', status: 'allocated' }], lexEnv: [{ name: 'userLet', val: '<uninitialized>', status: 'tdz' }, { name: 'userConst', val: '<uninitialized>', status: 'tdz' }], callStack: ['Global EC'], action: 'Hoisting const: userConst in TDZ (cannot access before declaration)', note: 'Step 5: "const" also bound in TDZ.' },
  { phase: 'creation', codeLine: 4, varEnv: [{ name: 'window', val: 'Global', status: 'allocated' }, { name: 'userVar', val: 'undefined', status: 'allocated' }, { name: 'greet()', val: 'function { ... }', status: 'allocated' }], lexEnv: [{ name: 'userLet', val: '<uninitialized>', status: 'tdz' }, { name: 'userConst', val: '<uninitialized>', status: 'tdz' }], callStack: ['Global EC'], action: 'Function Declaration greet() fully hoisted with body', note: 'Step 6: Entire function body hoisted into memory during creation phase!' },
  { phase: 'creation', codeLine: 0, varEnv: [{ name: 'window', val: 'Global', status: 'allocated' }, { name: 'userVar', val: 'undefined', status: 'allocated' }, { name: 'greet()', val: 'function { ... }', status: 'allocated' }], lexEnv: [{ name: 'userLet', val: '<uninitialized>', status: 'tdz' }, { name: 'userConst', val: '<uninitialized>', status: 'tdz' }], callStack: ['Global EC'], action: 'Creation Phase complete! Transitioning to Execution Phase...', note: 'Step 7: Memory allocated. Engine begins line-by-line execution.' },
  { phase: 'execution', codeLine: 1, varEnv: [{ name: 'window', val: 'Global', status: 'allocated' }, { name: 'userVar', val: '"Alice"', status: 'assigned' }, { name: 'greet()', val: 'function { ... }', status: 'allocated' }], lexEnv: [{ name: 'userLet', val: '<uninitialized>', status: 'tdz' }, { name: 'userConst', val: '<uninitialized>', status: 'tdz' }], callStack: ['Global EC'], action: 'Line 1 executes: userVar = "Alice"', note: 'Step 8: "undefined" overwritten with value "Alice".' },
  { phase: 'execution', codeLine: 2, varEnv: [{ name: 'window', val: 'Global', status: 'allocated' }, { name: 'userVar', val: '"Alice"', status: 'assigned' }, { name: 'greet()', val: 'function { ... }', status: 'allocated' }], lexEnv: [{ name: 'userLet', val: '"Bob"', status: 'assigned' }, { name: 'userConst', val: '<uninitialized>', status: 'tdz' }], callStack: ['Global EC'], action: 'Line 2 executes: userLet = "Bob" (TDZ Cleared!)', note: 'Step 9: TDZ ends for userLet. Variable is now accessible.' },
  { phase: 'execution', codeLine: 3, varEnv: [{ name: 'window', val: 'Global', status: 'allocated' }, { name: 'userVar', val: '"Alice"', status: 'assigned' }, { name: 'greet()', val: 'function { ... }', status: 'allocated' }], lexEnv: [{ name: 'userLet', val: '"Bob"', status: 'assigned' }, { name: 'userConst', val: '42', status: 'assigned' }], callStack: ['Global EC'], action: 'Line 3 executes: userConst = 42 (TDZ Cleared!)', note: 'Step 10: Immutable binding established.' },
  { phase: 'execution', codeLine: 8, varEnv: [{ name: 'window', val: 'Global', status: 'allocated' }, { name: 'userVar', val: '"Alice"', status: 'assigned' }, { name: 'greet()', val: 'function { ... }', status: 'allocated' }], lexEnv: [{ name: 'userLet', val: '"Bob"', status: 'assigned' }, { name: 'userConst', val: '42', status: 'assigned' }], callStack: ['Global EC', 'greet() EC'], action: 'Line 8 executes: greet() invoked -> Pushes new Function EC', note: 'Step 11: Call Stack pushes brand new Function Execution Context!' },
  { phase: 'execution', codeLine: 5, varEnv: [{ name: 'window', val: 'Global', status: 'allocated' }, { name: 'userVar', val: '"Alice"', status: 'assigned' }, { name: 'greet()', val: 'function { ... }', status: 'allocated' }], lexEnv: [{ name: 'userLet', val: '"Bob"', status: 'assigned' }, { name: 'userConst', val: '42', status: 'assigned' }], callStack: ['Global EC', 'greet() EC'], action: 'Inside greet(): Scope chain resolves userLet from parent scope', note: 'Step 12: Scope resolution traverses outer lexical environment.' },
  { phase: 'execution', codeLine: 6, varEnv: [{ name: 'window', val: 'Global', status: 'allocated' }, { name: 'userVar', val: '"Alice"', status: 'assigned' }, { name: 'greet()', val: 'function { ... }', status: 'allocated' }], lexEnv: [{ name: 'userLet', val: '"Bob"', status: 'assigned' }, { name: 'userConst', val: '42', status: 'assigned' }], callStack: ['Global EC'], action: 'greet() returns -> Function EC popped and destroyed!', note: 'Step 13: Local memory cleaned up by Garbage Collector.' },
  { phase: 'execution', codeLine: 9, varEnv: [{ name: 'window', val: 'Global', status: 'allocated' }, { name: 'userVar', val: '"Alice"', status: 'assigned' }, { name: 'greet()', val: 'function { ... }', status: 'allocated' }], lexEnv: [{ name: 'userLet', val: '"Bob"', status: 'assigned' }, { name: 'userConst', val: '42', status: 'assigned' }], callStack: [], action: 'Script completes! Global Execution Context pops off stack', note: 'Step 14: Execution finished cleanly!' }
]

const codeLines = [
  'var userVar = "Alice";',
  'let userLet = "Bob";',
  'const userConst = 42;',
  'function greet() {',
  '  return "Hello " + userLet;',
  '}',
  '',
  'greet();'
]

const currentIdx = computed(() => Math.min(Math.max(0, props.step), ecSteps.length - 1))
const currentStep = computed(() => ecSteps[currentIdx.value])
</script>

<template>
  <div class="ec-visualizer bg-white border-2 border-slate-300 rounded-xl p-3 shadow-md font-mono text-slate-800 text-xs select-none">
    <!-- Header -->
    <div class="flex items-center justify-between pb-2 mb-2 border-b border-slate-200">
      <div class="flex items-center gap-2">
        <span class="w-3 h-3 rounded-full bg-purple-600 animate-pulse"></span>
        <span class="font-extrabold text-xs uppercase tracking-tight text-slate-900">{{ title }}</span>
      </div>
      <div class="flex items-center gap-2">
        <span class="px-2 py-0.5 rounded text-[10px] font-black uppercase"
          :class="currentStep.phase === 'creation'
            ? 'bg-amber-100 text-amber-900 border border-amber-300'
            : 'bg-emerald-100 text-emerald-900 border border-emerald-300'"
        >
          Phase: {{ currentStep.phase }}
        </span>
        <span class="bg-purple-100 text-purple-900 border border-purple-300 px-2 py-0.5 rounded text-[10px] font-black">
          Step {{ currentIdx + 1 }} / {{ ecSteps.length }}
        </span>
      </div>
    </div>

    <!-- Main Grid -->
    <div class="grid grid-cols-12 gap-2.5 min-h-[220px]">
      
      <!-- Code Panel (4 Cols) -->
      <div class="col-span-4 bg-slate-950 rounded-lg p-2.5 text-slate-200 font-mono text-[10px] flex flex-col justify-between border border-slate-800">
        <div>
          <div class="text-[9px] uppercase tracking-wider text-slate-400 font-bold mb-1.5 pb-1 border-b border-slate-800 flex justify-between">
            <span>Source Code</span>
            <span class="text-purple-400">ES6 Engine</span>
          </div>
          <div class="space-y-0.5 leading-relaxed">
            <div
              v-for="(line, idx) in codeLines"
              :key="idx"
              class="px-1.5 py-0.5 rounded transition-all duration-200 flex items-center gap-1.5"
              :class="currentStep.codeLine === idx + 1
                ? 'bg-purple-600 text-white font-bold ring-1 ring-purple-300 translate-x-1 shadow-sm'
                : 'text-slate-400'"
            >
              <span class="w-3 text-[9px] opacity-40 text-right">{{ idx + 1 }}</span>
              <span>{{ line || ' ' }}</span>
            </div>
          </div>
        </div>
        <div class="mt-2 pt-1 border-t border-slate-800 text-[9px] text-purple-300 truncate">
          ▶ {{ currentStep.action }}
        </div>
      </div>

      <!-- Variable Environment (4 Cols) -->
      <div class="col-span-4 bg-amber-50/70 border-2 rounded-lg p-2 flex flex-col justify-between"
        :class="currentStep.phase === 'creation' ? 'border-amber-500 ring-2 ring-amber-300' : 'border-amber-200'"
      >
        <div>
          <div class="flex items-center justify-between text-[10px] font-black text-amber-950 uppercase mb-1">
            <span>📦 Variable Env (var / fn)</span>
            <span class="text-[8px] bg-amber-200 px-1 rounded font-bold">Hoisted</span>
          </div>
          <div class="space-y-1 min-h-[140px] p-1 bg-white/90 rounded border border-amber-200">
            <div
              v-for="v in currentStep.varEnv"
              :key="v.name"
              class="p-1 rounded text-[9.5px] border flex items-center justify-between"
              :class="v.status === 'assigned'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold'
                : 'bg-amber-50 border-amber-200 text-amber-900'"
            >
              <span>{{ v.name }}</span>
              <span class="font-mono text-[9px]">{{ v.val }}</span>
            </div>
            <div v-if="currentStep.varEnv.length === 0" class="text-slate-400 text-center py-6 text-[10px] italic">
              (Empty Environment)
            </div>
          </div>
        </div>
        <div class="text-[8.5px] text-amber-900 text-center font-bold mt-1">
          Hoisted & Initialized to undefined
        </div>
      </div>

      <!-- Lexical Environment & TDZ (4 Cols) -->
      <div class="col-span-4 bg-rose-50/70 border-2 rounded-lg p-2 flex flex-col justify-between"
        :class="currentStep.phase === 'creation' ? 'border-rose-500 ring-2 ring-rose-300' : 'border-rose-200'"
      >
        <div>
          <div class="flex items-center justify-between text-[10px] font-black text-rose-950 uppercase mb-1">
            <span>🛡️ Lexical Env (let / const)</span>
            <span class="text-[8px] bg-rose-200 px-1 rounded font-bold">TDZ Protected</span>
          </div>
          <div class="space-y-1 min-h-[140px] p-1 bg-white/90 rounded border border-rose-200">
            <div
              v-for="l in currentStep.lexEnv"
              :key="l.name"
              class="p-1 rounded text-[9.5px] border flex items-center justify-between"
              :class="l.status === 'tdz'
                ? 'bg-rose-100 border-rose-300 text-rose-950 font-black animate-pulse'
                : 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold'"
            >
              <span>{{ l.name }}</span>
              <span class="font-mono text-[9px]" :class="l.status === 'tdz' ? 'text-rose-700' : 'text-emerald-700'">
                {{ l.val }}
              </span>
            </div>
            <div v-if="currentStep.lexEnv.length === 0" class="text-slate-400 text-center py-6 text-[10px] italic">
              (Empty Environment)
            </div>
          </div>
        </div>
        <div class="text-[8.5px] text-rose-900 text-center font-bold mt-1">
          Accessing in TDZ throws ReferenceError!
        </div>
      </div>

    </div>

    <!-- Bottom Status Note -->
    <div class="mt-2 pt-1.5 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-700 bg-slate-50 px-2 py-1 rounded">
      <div class="flex items-center gap-1.5 font-bold">
        <span class="text-purple-600">⚡ Engine Note:</span>
        <span>{{ currentStep.note }}</span>
      </div>
      <div class="text-[9px] text-slate-400 font-mono">
        Stack: [{{ currentStep.callStack.join(', ') }}]
      </div>
    </div>
  </div>
</template>
