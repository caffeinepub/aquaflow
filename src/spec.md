# Specification

## Summary
**Goal:** Roll back the live (production) deployment from Draft Version 8 to Version 6 so end users are served the Version 6 build.

**Planned changes:**
- Revert production deployment to Version 6 for both frontend and backend so behavior matches Version 6.
- Ensure production clients load Version 6 assets on a hard refresh (no references to cached Version 8 assets).

**User-visible outcome:** Users accessing the production site receive the Version 6 experience, and a hard refresh loads Version 6 without pulling any Version 8 assets.
