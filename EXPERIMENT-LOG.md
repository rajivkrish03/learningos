# Experiment Log — Learning OS

**Append-only. Never edit or delete an entry. Add new entries at the bottom.**
**Each entry: run number, date, what ran, what was observed.**

---

## Run 0 — 2026-10-27 (pre-study: internal smoke test)

**What ran:** Headless logic test of the full app flow — login, item loading, event logging, unaided-detection logic (`first_submit_correct=true AND hints_opened=0 AND revealed=false`), key store/delete, JSON export.

**Observed:** All paths passed. No browser test yet (no browser in build environment). Visual rendering and live Gemini call unconfirmed.

**Arm assignment:** N/A — single-user internal test only.

**Items used:** The 6 practice items from ITEM_BANK.md batch 1.

**Outcome:** Build confirmed structurally sound. Neither a win nor a loss for the hypothesis — no learner data.

**Open questions going in:**
- Item difficulty not yet calibrated (no observed unaided-correct rate).
- Question bank needs expansion to ~16 practice + ~12 held-out before recruiting.
- Arm B (answer-giving baseline) not yet implemented — study-mode flag pending.

---

*(Add Run 1, Run 2, … as study sessions happen. Include arm, n, completion rate, and first-try correct rate per arm before reporting removal-test results.)*
