## 2024-05-23 - O(N) Lookups on Static Data
**Learning:** The codebase relies on repeated O(N) array scans (`Array.prototype.find`) for querying static country data (`getCountry`, `getCode`). For a library whose primary purpose is data lookup, this is a significant anti-pattern that slows down repetitive queries.
**Action:** Always prefer caching array data into hash maps (dictionaries) for O(1) lookups when querying a static or rarely-changing dataset by a specific key.
