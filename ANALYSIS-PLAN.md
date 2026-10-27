# Analysis Plan — Learning OS Removal Study

**Pre-registered: 2026-10-27. DO NOT EDIT after this date.**
**This file is the pre-registration record. Append notes to EXPERIMENT-LOG.md instead.**

---

## 0. Purpose of this document

This plan fixes every scoring decision before any learner data exists. Nothing here can be adjusted after the study starts — that's the whole point. A result that requires changing the scoring definition to look good is not a result.

---

## 1. Research question

Does a withholding-style help ladder (Arm A) produce better unaided performance on held-out questions than an answer-giving baseline (Arm B), when tested 5–7 days after practice?

---

## 2. Arms

| Arm | What the learner receives during practice |
|---|---|
| **A — Withholding (treatment)** | Full two-step flow: predict-before-decide → MCQ → help ladder (3 rungs). Answer not revealed unless learner explicitly clicks "Just show me the answer." |
| **B — Baseline** | MCQ only. Correct answer + explanation shown immediately after any submission, right or wrong. No predict step, no rungs. |

**Both arms use identical held-out questions during the removal test.** The removal test is unassisted for all learners — no app, no hints, plain question + four options on a static form.

---

## 3. Participants

- Minimum: 6 learners total (≥3 per arm), none from the project team.
- Assignment: alternating assignment by sign-up order (1→A, 2→B, 3→A, …), not random (sample too small for randomisation to balance).
- Exclusion: any learner who completes fewer than 4 practice items is excluded from analysis. Pre-registered threshold — not adjustable.

---

## 4. Question bank split

- Practice items (shown with help): ~16 questions, drawn from modules M5–M11.
- Held-out items (removal test only, never seen with help): ~12 questions, drawn from the same modules but different scenarios.
- The split is fixed before recruiting begins. Held-out items are locked in a separate file and not loaded into the app during practice sessions.

---

## 5. Primary outcome

**Unaided-correct rate on held-out items at removal test.**

Definition: a response is "correct" if the learner selects the keyed answer on the static removal-test form. No partial credit. No time component.

Unit of analysis: **per person, per item** (binary correct/incorrect). Summary statistic: mean correct rate per arm.

---

## 6. Pre-registered checks (must be reported regardless of outcome)

These checks determine whether any difference between arms can be credited to the mechanism. If any check fails, the result must be reported as "uninterpretable" for that dimension — not as a win.

| Check | What it tests | Pass condition |
|---|---|---|
| **Ceiling check** | Were held-out items too easy (floor effect ruins the test)? | Mean unaided-correct rate on held-out items < 85% for both arms combined |
| **Floor check** | Were held-out items too hard (no signal either way)? | Mean unaided-correct rate > 15% for both arms combined |
| **Completion check** | Did learners finish enough practice to have been exposed? | ≥4 practice items completed per learner (exclusion threshold above) |
| **First-try parity** | Were arms equivalent during practice (same first-try rate)? | |A first-try correct − B first-try correct| < 20 percentage points |

---

## 7. Secondary outcomes (exploratory, not confirmatory)

These are reported honestly as correlational — not as evidence of mechanism.

- Within Arm A: correlation between hints_opened during practice and unaided-correct rate at removal test.
- Within Arm A: correlation between revealed_answer=true rate and removal test score.
- Comparison of explain_back quality (subjective, rated by author) between arms.

---

## 8. What each outcome means (pre-registered interpretations)

| Result | Interpretation |
|---|---|
| Arm A mean > Arm B mean, checks pass | Consistent with the hypothesis. Describe as: "direction favours withholding; underpowered pilot, no significance claim." |
| Arm A mean > Arm B mean, ceiling check fails | Uninterpretable — items too easy, no headroom. Must be stated plainly. |
| Arm A mean ≈ Arm B mean | Null result. Report as: "no detectable difference at this sample size." Do not soften. |
| Arm A mean < Arm B mean | Negative result. Report as: "direction disfavours withholding." Do not soften. |

---

## 9. Reporting requirements

- Report the actual n per arm, including any exclusions and why.
- Report the actual numbers (mean correct rate per arm, difference, 95% CI via Wilson interval or bootstrap).
- Label the CI as appropriate for n < 20 — it will be wide. That's honest, not a failure.
- Name every confound the author can see before a judge does. This is the highest-scoring move.

---

## 10. What is NOT in scope

- Statistical significance testing (underpowered; n too small to interpret a p-value).
- Self-report satisfaction or perceived learning.
- Comparison across modules (sample too small to stratify).

---

*Signed and dated: 2026-10-27. This file is append-locked from this point.*
