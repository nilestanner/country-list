
## 2026-10-16 - Unreachable code in getCodes default branch
**Learning:** In `index.js`, the `getCodes(codeType)` function has a `switch (codeType)` with a `default: return [];` branch. However, right before the switch, there is logic: `if (codeType !== 2 && codeType !== 3) { codeType = 2; }`. Because of this, the switch will always only see `2` or `3`, making the `default:` branch completely unreachable.
**Action:** Do not attempt to write a test to hit this unreachable line. This highlights why looking closely at uncovered lines is important, as it sometimes reveals dead code.
