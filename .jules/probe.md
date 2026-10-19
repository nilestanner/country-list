## 2024-06-25 - [getCode missing type validation]
**Learning:** `getCode` does not validate that `name` is a string (unlike `getCountry` which safely checks for string type and length). This causes a `TypeError` to be thrown directly when non-string inputs (like `null`, `undefined`, or object) are passed, due to calling `.toLowerCase()` on the argument.
**Action:** Always test methods for both valid and invalid types in JavaScript, as different methods in the same file might have inconsistent validation behaviour (some fail gracefully by returning `null`, others throw).

## 2026-10-16 - Unreachable code in getCodes default branch
**Learning:** In `index.js`, the `getCodes(codeType)` function has a `switch (codeType)` with a `default: return [];` branch. However, right before the switch, there is logic: `if (codeType !== 2 && codeType !== 3) { codeType = 2; }`. Because of this, the switch will always only see `2` or `3`, making the `default:` branch completely unreachable.
**Action:** Do not attempt to write a test to hit this unreachable line. This highlights why looking closely at uncovered lines is important, as it sometimes reveals dead code.
