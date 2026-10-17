## 2024-06-25 - [getCode missing type validation]
**Learning:** `getCode` does not validate that `name` is a string (unlike `getCountry` which safely checks for string type and length). This causes a `TypeError` to be thrown directly when non-string inputs (like `null`, `undefined`, or object) are passed, due to calling `.toLowerCase()` on the argument.
**Action:** Always test methods for both valid and invalid types in JavaScript, as different methods in the same file might have inconsistent validation behaviour (some fail gracefully by returning `null`, others throw).
