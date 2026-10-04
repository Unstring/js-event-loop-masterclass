---
clicks: 25
layout: default
---

<script setup lang="ts">
import PromiseChainingDemo from '../components/PromiseChainingDemo.vue'
import CaptionBar from '../components/CaptionBar.vue'
import PersistentLegend from '../components/PersistentLegend.vue'
import ProgressBar from '../components/ProgressBar.vue'

const captions = [
  "Promise Chaining Internals & Static Combinators.",
  "Fundamental Rule 1: Every call to `.then()` returns a BRAND NEW Promise instance!",
  "It does NOT mutate the original Promise.",
  "If `p1.then(fn)` is called, `p2` is constructed and returned synchronously.",
  "When `fn` executes later and returns a value `x`: `p2` is resolved with `x`.",
  "What if `fn` returns another Promise `p3`? `p2` ADOPTS the state and result of `p3`!",
  "This is called 'Promise Unwrapping' in the ECMAScript specification.",
  "Fundamental Rule 2: Error propagation and skipping intermediate handlers.",
  "If an error is thrown inside any `.then()` handler, the returned Promise rejects.",
  "The engine skips all subsequent `.then()` fulfillment handlers until it finds a `.catch()` (or rejection handler).",
  "`.finally(callback)` runs regardless of fulfillment or rejection.",
  "`.finally()` passes through the existing result or error to the next link without altering it.",
  "Now look at the Static Combinators in the right panel.",
  "`Promise.all([p1, p2])`: Concurrently monitors multiple promises.",
  "Fulfills with an array of results ONLY when ALL input promises fulfill.",
  "Fail-fast: Rejects immediately as soon as ANY promise rejects, discarding pending results.",
  "`Promise.allSettled([p1, p2])`: Introduced in ES2020.",
  "Waits for every single promise to settle (either fulfilled or rejected).",
  "NEVER rejects! Returns an array of `{ status, value | reason }` descriptor objects.",
  "`Promise.race([p1, p2])`: First-past-the-post race.",
  "Resolves or rejects as soon as the FASTEST promise settles. Perfect for network timeouts!",
  "`Promise.any([p1, p2])`: Introduced in ES2021.",
  "Waits for the FIRST FULFILLED promise. Ignores rejections unless ALL promises reject.",
  "If all reject: Throws an `AggregateError` collecting all failure reasons.",
  "Slide 17 Complete: You now master promise transformation and concurrency combinators!"
]
</script>

<div class="h-full flex flex-col justify-between py-1 select-none">
  <PersistentLegend />
  <ProgressBar :step="$clicks" :total-steps="25" :slide-number="17" :total-slides="20" />

  <CaptionBar
    :caption="captions[Math.min($clicks, captions.length - 1)]"
    phase="microtasks"
    :is-last="$clicks >= 24"
    takeaway="Every .then() returns a new Promise; .catch() catches upstream throws; combinators coordinate sets."
  />

  <div class="flex-1 my-1">
    <PromiseChainingDemo :step="Math.floor($clicks / 5)" />
  </div>
</div>

<!--
SPEAKER NOTES:
[Click 0-6]: Explain that .then() returns a new promise and promise unwrapping.
[Click 7-11]: Trace error skipping down the chain to .catch() and .finally() behavior.
[Click 12-24]: Compare the 4 combinators: all (fail-fast), allSettled (never fails), race (fastest), any (first success).
-->
