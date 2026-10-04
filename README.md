# 🔄 JavaScript Event Loop & Async Programming

> **A 20-slide interactive visual masterclass** — built with [Slidev](https://sli.dev)  
> Designed for bright-classroom delivery with high-contrast light theme.

---

## 🎯 Learning Outcomes

| # | Topic |
|---|-------|
| 1 | Why JavaScript is single-threaded |
| 2 | Call Stack & the Event Loop |
| 3 | How `setTimeout` works internally |
| 4 | Microtasks vs Macrotasks |
| 5 | Promises & `async/await` |

---

## ✨ Features

- **25–40 click-steps per slide** — every click reveals exactly one idea
- **Live runtime simulator** — watch the Call Stack, Web APIs, and Queues animate in real time
- **Predict & Reveal** — students guess output before seeing it
- **Color-coded domains** — blue (stack), orange (APIs), green (microtasks), purple (macrotasks)
- **Light theme** with Inter + JetBrains Mono for classroom projector clarity

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start dev server (opens browser automatically)
npm run dev

# Build static site
npm run build

# Export to PDF
npm run export
```

---

## 📁 Project Structure

```
demo/
├── slides.md               # Root slide manifest
├── slides/                 # Individual slide files (slide-01.md … slide-20.md)
├── components/             # Vue components (RuntimeStage, RuntimeSimulator, …)
├── composables/            # Shared composables (useSimulator.ts)
├── styles/                 # Global CSS (index.css)
└── package.json
```

---

## 🛠 Tech Stack

| Tool | Purpose |
|------|---------|
| [Slidev](https://sli.dev) `^52` | Presentation framework |
| Vue 3 | Component engine |
| TypeScript | Type-safe slide logic |
| UnoCSS | Utility styling |

---

## 📜 License

MIT © 2026
