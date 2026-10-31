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


---

## Run 1 — 2026-10-31 (nine-learner comparison; scores supplied for case-study analysis)

**What ran:** Practice and held-out comparison for two conditions. Five learners in Think-First (Arm A) and four learners in Answer-First (Arm B). All nine were reported to have completed practice; no exclusions were reported. Each learner had 12 held-out questions.

**Held-out scores:**
- Arm A: A1 11/12, A2 10/12, A3 10/12, A4 11/12, A5 12/12 = **54/60 (90.0%)**.
- Arm B: B1 9/12, B2 10/12, B3 8/12, B4 8/12 = **35/48 (72.9%)**.
- Descriptive difference: **+17.1 percentage points** for Think-First.

**Study details supplied:** Reported gap between practice and removal test was 1–4 days (the pre-registered plan specified 5–7 days). Questions were not calibrated with 2–3 learners before the study. No exclusions were reported.

**Checks / limitations:**
- Combined held-out accuracy: 89/108 = **82.4%**; below the pre-registered 85% ceiling threshold and above the 15% floor threshold.
- Completion: all nine learners reported as completing practice.
- First-try parity: cannot be evaluated from the supplied held-out scores; first-attempt practice accuracy by arm was not supplied.
- The result is descriptive and exploratory. The gap deviation, absent item calibration, small sample, and alternating (non-random) assignment limit causal interpretation. No statistical-significance claim.

**Data provenance:** Participant-level scores and study details were supplied by the project owner for this log entry. Raw learner JSON exports were not attached to this entry.
