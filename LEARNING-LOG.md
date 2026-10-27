# Learning Log — Learning OS

**Append-only. Never edit or delete an entry. Add new entries at the bottom.**
**Each entry: date, what was assumed, what broke that assumption, what changed.**
**This file is the evidence for the rubric's "Learning" criterion.**

---

## L-1 — 2026-10-27 (comparison with peer pilot)

**Assumed:** Our richer product (two tabs, predict step, explain-back, concept map) would be a stronger capstone because it is a stronger product.

**What broke it:** Comparing against the withholding-pilot repo. The brief grades the *experiment* far more than the *product*. A simpler product that ran its removal test and reported the result honestly scored higher on the most-weighted criterion than a richer product with no data.

**What changed:** Separated the experiment from the product. The study runs on a stripped-down arm (help ladder only, no predict step, no concept map) to keep variables controlled. The full product is the demo; the study is the capstone. These are now architecturally separated via a `STUDY_MODE` flag.

**Why this matters for the hypothesis:** The features we're most proud of (predict-before-decide, explain-back) are now *uncontrolled variables* in the experiment unless we strip them out. The study tests the help ladder specifically. Everything else is product.

---

## L-2 — 2026-10-27 (domain clarification)

**Assumed (implicitly in early planning):** The removal test would work like the peer pilot's SQL domain — correctness judged by query result set, no ambiguity.

**What broke it:** Our domain is Process Content MCQ, not SQL. Correctness is simpler (keyed answer A/B/C/D), but the item difficulty calibration problem is the same: if items are too easy (ceiling) or too hard (floor), the removal test can't measure a difference between arms.

**What changed:** Added explicit ceiling/floor checks to ANALYSIS-PLAN.md (pre-registered). Added item difficulty piloting as a required step before recruiting (run past 2–3 people, drop items where unaided-correct rate > 85% or < 15%).

---

*(Add L-3, L-4, … as broken assumptions emerge. The most honest entries are the most valuable.)*
