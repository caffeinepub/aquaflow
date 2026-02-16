# Specification

## Summary
**Goal:** Fix the infinite “Loading AquaFlow…” state after Internet Identity login by making profile-check + onboarding routing deterministic and recoverable, and by ensuring profile lookup for authenticated users without a profile does not trap.

**Planned changes:**
- Update frontend post-login routing logic to always exit the loading state and route based on (a) identity availability and (b) whether a user profile exists.
- Route users without an existing profile to the dedicated onboarding route (`/onboarding`) after login, and route users with a profile directly to their role dashboard (`/dashboard/customer` | `/dashboard/salesman` | `/dashboard/admin`).
- Adjust role selection to immediately attempt to save/create the user profile with the selected role, then navigate to the matching dashboard on success; show clear English errors (including Admin self-assignment rejection) without getting stuck.
- Add clear frontend error states for profile-fetch failures with a recovery path (e.g., retry and/or log out) instead of indefinite spinners.
- Update backend `getCallerUserProfile` behavior so authenticated callers with no saved profile receive `null` (or equivalent) rather than an authorization trap, while keeping anonymous restrictions and Admin self-assignment protections on profile creation.

**User-visible outcome:** After logging in, users no longer get stuck on “Loading AquaFlow…”. New users are sent to Role Selection to pick a role and save a profile immediately, then land on the correct dashboard; existing users go straight to their dashboard, and any profile load/save errors show actionable recovery options.
