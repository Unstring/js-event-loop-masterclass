<script setup lang="ts">
defineProps<{
  scopes: {
    name: string
    type?: 'global' | 'block' | 'closure'
    vars: Record<string, any>
  }[]
}>()
</script>

<template>
  <div class="h-full flex flex-col bg-amber-50/50 border-3 border-amber-500 rounded-2xl p-3 shadow-sm overflow-y-auto">
    <div class="flex items-center gap-1.5 font-bold text-xs uppercase text-amber-900 tracking-wider mb-2">
      <span>📦</span>
      <span>Lexical Scope & Environment Records</span>
    </div>

    <div class="flex flex-col gap-2">
      <div
        v-for="(scope, idx) in scopes"
        :key="idx"
        class="rounded-xl border-2 p-2.5 shadow-sm transition-all"
        :class="{
          'bg-amber-100 border-amber-600': scope.type === 'global',
          'bg-emerald-100 border-emerald-600': scope.type === 'closure',
          'bg-blue-100 border-blue-600': scope.type === 'block' || !scope.type
        }"
      >
        <div class="flex items-center justify-between text-xs font-black uppercase tracking-wider mb-1.5"
          :class="{
            'text-amber-950': scope.type === 'global',
            'text-emerald-950': scope.type === 'closure',
            'text-blue-950': scope.type === 'block' || !scope.type
          }"
        >
          <span>{{ scope.name }}</span>
          <span class="text-[10px] px-2 py-0.5 rounded-full font-bold bg-white/80 border">
            {{ scope.type || 'local' }}
          </span>
        </div>

        <div class="flex flex-wrap gap-2">
          <div
            v-for="(val, key) in scope.vars"
            :key="key"
            class="bg-white/95 px-2.5 py-1 rounded-lg border shadow-sm font-mono text-xs flex items-center gap-1.5"
          >
            <span class="text-slate-600 font-semibold">{{ key }}:</span>
            <span class="font-bold text-slate-950">{{ val }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
