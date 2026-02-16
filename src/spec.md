# Specification

## Summary
**Goal:** Eliminate the post-deployment infinite “Loading Blue Nile…” state by adding deterministic timeouts, recovery UI, and more resilient auth/profile bootstrapping and routing.

**Planned changes:**
- Add a fixed-duration timeout to the root/global auth bootstrap loading flow; after the threshold, switch from the spinner (“Loading Blue Nile…”) to a recovery screen rather than loading indefinitely.
- Implement recovery actions on the timeout/error screen: “Retry” (re-attempt profile loading) and “Log out / Clear session” (clear Internet Identity session and route to `/login`), ensuring no dead-end state.
- Make authenticated bootstrap routing resilient when authenticated but actor/profile fetch is unavailable: show an actionable error state with retry/logout instead of a blank or endless loading UI.
- Update the current-user profile query plumbing to consistently surface readiness/failure states to the router/bootstrap layer so it can reliably choose between: initializing identity, fetching profile, no profile (redirect to `/onboarding`), profile exists (enter app shell), or profile fetch failed (show recovery/error), without oscillation or loops.

**User-visible outcome:** If loading takes too long or profile fetch fails, users see a clear recovery screen with Retry and Log out/Clear session actions, and can always reach either `/login` or `/onboarding`/the app without getting stuck on an infinite loading screen.
