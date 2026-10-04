<script setup lang="ts">
defineProps<{ frames: string[] }>()
</script>

<template>
  <div class="cs-wrap">
    <div class="cs-label">Call Stack <span class="cs-sub">(LIFO)</span></div>
    <div class="cs-box">
      <div v-if="!frames.length" class="cs-empty">— empty —</div>
      <TransitionGroup name="sf" tag="div" class="cs-list">
        <div
          v-for="(f, i) in frames"
          :key="f + i"
          :class="['cs-frame', { 'cs-frame--top': i === frames.length - 1 }]"
        >
          {{ f }}
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<style scoped>
.cs-wrap { display: flex; flex-direction: column; height: 100%; }
.cs-label {
  font-size: 9px; font-weight: 700; letter-spacing: .12em;
  text-transform: uppercase; color: #3b82f6;
  margin-bottom: 5px; font-family: 'JetBrains Mono', monospace;
}
.cs-sub { color: #93c5fd; font-weight: 400; }
.cs-box {
  flex: 1;
  border: 2px solid #bfdbfe;
  border-radius: 10px;
  background: #f0f9ff;
  padding: 6px;
  display: flex;
  flex-direction: column-reverse;
  gap: 3px;
  overflow: hidden;
  min-height: 80px;
}
.cs-empty {
  font-size: 11px; color: #93c5fd;
  font-family: 'JetBrains Mono', monospace;
  text-align: center; margin: auto;
}
.cs-list { display: flex; flex-direction: column-reverse; gap: 3px; }
.cs-frame {
  padding: 4px 10px; border-radius: 5px;
  font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 600;
  background: #dbeafe; color: #1d4ed8; border: 1.5px solid #93c5fd;
  transition: all .3s;
}
.cs-frame--top {
  background: #2563eb; color: #fff;
  border-color: #1d4ed8;
  box-shadow: 0 2px 8px #2563eb35;
}
.sf-enter-active { transition: all .3s ease; }
.sf-leave-active { transition: all .2s ease; }
.sf-enter-from   { opacity: 0; transform: translateY(-10px) scale(.95); }
.sf-leave-to     { opacity: 0; transform: translateY(-10px) scale(.95); }
</style>
