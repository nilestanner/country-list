## 2024-10-15 - Array.prototype.find() vs Map lookups
**Learning:** Using Array.find() for lookups in a static list of 250+ countries causes O(n) performance hits on every call, leading to significant slowdowns in large loops.
**Action:** Precompute Map data structures to allow O(1) lookups for static data, boosting performance by ~100x without changing APIs.
