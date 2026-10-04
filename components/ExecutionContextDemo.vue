<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  step?: number
}>()

const s = computed(() => props.step ?? 0)

const phase = computed(() => (s.value <= 1 ? 'Creation Phase (Hoisting)' : 'Execution Phase (Line-by-Line)'))
</script>

<template>
  <div class="h-full flex flex-col justify-between py-1 select-none overflow-hidden">
    <!-- Header status -->
    <div class="bg-slate-900 text-white px-3 py-1.5 rounded-lg flex items-center justify-between border border-slate-700 shrink-0">
      <div class="flex items-center gap-1.5">
        <span class="text-[9px] uppercase font-extrabold px-1.5 py-0.2 rounded bg-blue-600">Lifecycle</span>
        <span class="font-bold text-xs">{{ phase }}</span>
      </div>
      <span class="text-[10px] font-mono text-slate-300">Snippet 4: Closures & Scopes</span>
    </div>

    <!-- 2 Column comparison: Creation vs Execution -->
    <div class="grid grid-cols-12 gap-2 my-auto flex-1 items-stretch min-h-0">
      <!-- Left: Code snippet & Scope view -->
      <div class="col-span-6 bg-slate-50 border-2 border-slate-300 rounded-xl p-2.5 flex flex-col justify-between shadow-xs">
        <div>
          <div class="font-bold text-[11px] uppercase tracking-wider text-slate-700 mb-1">Snippet 4: var vs let loop</div>
          <pre class="bg-white p-2 rounded-lg border border-slate-200 font-mono text-[11px] leading-relaxed text-slate-900 font-bold">
// Case 1: var (single function/global binding)
for (var i = 0; i &lt; 3; i++) {
  setTimeout(() => console.log(i), 0);
}
// Case 2: let (new block-scoped binding per iteration)
for (let j = 0; j &lt; 3; j++) {
  setTimeout(() => console.log(j), 0);
}
          </pre>
        </div>

        <div class="bg-amber-100 border border-amber-400 p-2 rounded-lg text-[10px] font-bold text-amber-950">
          <span v-if="s <= 1">⚡ <strong>Hoisting:</strong> `var i` is hoisted to top of function and initialized to `undefined`. `let j` is hoisted into Temporal Dead Zone (TDZ).</span>
          <span v-else>🔄 <strong>Closure Binding:</strong> `var i` shares ONE memory address (ends at 3). Each iteration of `let j` creates a distinct lexical environment binding (0, 1, 2)!</span>
        </div>
      </div>

      <!-- Right: Memory Environment Records -->
      <div class="col-span-6 bg-blue-50/50 border-2 border-blue-400 rounded-xl p-2.5 flex flex-col justify-between shadow-xs">
        <div class="font-bold text-[11px] uppercase tracking-wider text-blue-900 mb-1">Environment Records in Memory</div>

        <div class="space-y-1.5 flex-1">
          <!-- Global Environment Record -->
          <div class="bg-white border border-blue-300 rounded-lg p-2 shadow-xs">
            <div class="flex items-center justify-between text-[11px] font-black text-blue-950 mb-0.5">
              <span>Global VariableEnvironment (`var`)</span>
              <span class="text-[9px] bg-blue-100 text-blue-800 px-1 py-0.2 rounded">Single Slot</span>
            </div>
            <div class="font-mono text-[11px] bg-blue-50 p-1 rounded border border-blue-200 text-blue-900">
              i = <strong class="text-rose-600">{{ s >= 3 ? '3' : (s >= 2 ? '0 -> 1 -> 2' : 'undefined') }}</strong>
              (all 3 timer callbacks point to this exact memory address!)
            </div>
          </div>

          <!-- Iteration Lexical Environments (let) -->
          <div class="bg-white border border-green-300 rounded-lg p-2 shadow-xs">
            <div class="flex items-center justify-between text-[11px] font-black text-green-950 mb-0.5">
              <span>LexicalEnvironment Scope (`let`)</span>
              <span class="text-[9px] bg-green-100 text-green-800 px-1 py-0.2 rounded">Block Scope</span>
            </div>
            <div class="grid grid-cols-3 gap-1 font-mono text-[10px]">
              <div class="bg-green-50 p-1 rounded border border-green-300 text-center">
                Block 0: <strong>j = 0</strong>
              </div>
              <div class="bg-green-50 p-1 rounded border border-green-300 text-center">
                Block 1: <strong>j = 1</strong>
              </div>
              <div class="bg-green-50 p-1 rounded border border-green-300 text-center">
                Block 2: <strong>j = 2</strong>
              </div>
            </div>
          </div>
        </div>

        <div class="text-[10px] bg-blue-200/90 text-blue-950 p-1.5 rounded-lg font-bold shrink-0">
          Output: <span class="font-mono text-rose-700 font-bold">var -> 3 3 3</span> | <span class="font-mono text-green-700 font-bold">let -> 0 1 2</span>
        </div>
      </div>
    </div>
  </div>
</template>
