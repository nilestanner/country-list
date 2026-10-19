## 2024-10-15 - Array.prototype.find() vs Map lookups
**Learning:** Using Array.find() for lookups in a static list of 250+ countries causes O(n) performance hits on every call, leading to significant slowdowns in large loops.
**Action:** Precompute Map data structures to allow O(1) lookups for static data, boosting performance by ~100x without changing APIs.

## 2024-05-24 - Default arguments vs undefined checks with console logging
**Learning:** Checking for `undefined` arguments and assigning a default inside a function body is much slower than using a default argument in the function signature, especially if the check has a side-effect like `console.log`. The `getCodes` function in `country-info-list` was taking ~90ms per 10,000 calls due to `console.log('Invalid code type provided defaulting to 2 character codes');` when invoked with no arguments.
**Action:** Always prefer ES6 default function parameters (`(codeType = 2)`) over `undefined` checks inside the function body, especially to avoid unintended side effects like excessive IO / logging.
