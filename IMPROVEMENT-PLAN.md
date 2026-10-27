# Improvement Plan — making this submittable

**What this is:** a prioritized plan to get the Learning OS two-tab app (this folder) to a submittable capstone, built from a direct comparison with a strong, already-submitted peer project (`withholding-pilot`). Read top to bottom — it's in priority order, not topic order.

**The one-line verdict from the comparison:** our project is the stronger *product*; the pilot is the stronger *capstone*, because it **ran its removal test and reported the result honestly**. The brief grades the experiment far more than the product. So the single thing that makes ours submittable is not a feature — it's running the study. Everything else below is secondary.

---

## 0. The blocker, stated plainly

**The removal test has not been run. No document can fix that — only real learners can.**

The brief's most-weighted criterion is: *real learners, held-out questions, scored against a baseline, actually run — not theorized.* Right now we have a beautifully specified test and zero data. The pilot beat us on this one axis alone, and it's the axis that decides the grade.

**So what:** until the study runs, the case study's Results section is empty and the project is not submittable at full marks. Treat §1 as the critical path. Everything in §2–§4 is polish that only matters once §1 is done.

---

## 1. Critical path — run the study (do this first, nothing else matters more)

In order. Each step unblocks the next.

1. **Freeze the question bank and split it.** We have 6 items; the study needs more. Author to ~16 practice + ~12 held-out, keys vetted by you (domain author), split so held-out is *never* shown with help. Burn these questions afterward — they can't be reused.
2. **Pre-register the analysis BEFORE collecting data.** Write down, and date, exactly how you'll score and what would count as success/failure — *before* any learner touches it. This is the pilot's biggest discipline win and it costs you nothing but an hour. (See §2.1.)
3. **Pilot the items for difficulty on 2–3 people.** Record observed unaided-correct rate; drop floor/ceiling items. This is how you avoid the pilot's fatal flaw — its Arm A hit 100% and the test had no headroom to measure anything.
4. **Recruit ≥6 learners, none on your team.** Assign to withholding (Arm A) vs. answer-giving baseline (Arm B).
5. **Run practice, then the removal test 5–7 days later, tool off.** Collect each learner's JSON via the Export button.
6. **Analyse by result, report the number you got** — including if it's null or unfavourable. Direction + effect size + confidence interval, labelled an underpowered pilot. (See §2.4.)
7. **Fill the case study's Results section with the real number.** Now it's submittable.

**So what:** this is ~2–3 weeks of calendar time (because of the 5–7 day gap), not code time. If a deadline is close, this is the schedule risk — start recruiting now.

---

## 2. Borrow these from the pilot (each is cheap and raises the grade)

The pilot earned marks on things our docs only *described*. Adopt them directly.

### 2.1 A pre-registered analysis plan, dated, never edited after
The pilot's `ANALYSIS-PLAN.md` fixed every scoring decision before data existed, so no result could be reverse-justified. Create `ANALYSIS-PLAN.md` here: the primary score ("correct on any attempt", per person-question), the arms, the pre-registered checks, and what each outcome would mean. **Date it and don't edit it.** This single file is most of the "rigor" marks.

### 2.2 The architecture rule: "the LLM never decides *whether* to help"
The pilot's sharpest line: plain code decides whether/how much to help; the LLM only writes the hint *wording*. This makes the logs *prove* what each arm received. Our help ladder already works this way (pre-authored rungs) — **say so explicitly** in the design and case study, and keep any future LLM use to wording only. It's a stronger framing than our "deterministic/probabilistic split" and we should adopt the phrasing.

### 2.3 Append-only logs: hypothesis, experiment, learning
The pilot keeps `HYPOTHESIS-LOG.md` (every version of the claim + the evidence that moved it), `EXPERIMENT-LOG.md` (every run), `LEARNING-LOG.md` (every broken assumption). The rubric's "Learning" criterion is literally "evidence changed your hypothesis, show where." Start these three files now, append-only, never rewrite an entry. Even one honest entry ("I assumed X, the pilot showed Y") scores.

### 2.4 Report the result that undermines you, honestly
The pilot's result looked like a win (36/36 vs 25/36) and it spent its whole RESULTS.md explaining why the win *couldn't be credited to the mechanism* (identical first-try scores, failed checks, a ceiling, one learner driving the gap). That honesty is the highest-scoring move in the whole repo. Whatever our number is, report it the same way: lead with it, then name every confound yourself before a judge does.

### 2.5 Move the LLM key server-side before the study
The pilot holds its key in a Supabase edge function so it never reaches the page. We deferred this (client-side key, pilot shortcut). Before real learners use "Ask freely", move the key to a serverless function (this is the Vercel step already noted in `DESIGN.md` §12). A leaked key in a public study is an avoidable embarrassment.

---

## 3. Keep these — they're our genuine edge (do NOT cut them)

Our product is richer than the pilot's, and that's worth keeping **as a product**, carefully.

- **The two-tab "answer freely, then expand into metered practice"** is a better *product* and solves the motivation problem the pilot's bare one-pager has (the pilot admits learners stopped early; ours pulls them forward).
- **Predict-before-decide, explain-back, independence meter** are real learning mechanics the pilot lacks.
- **Author-curated adjacency** ("Related concepts") is the continuation engine.

**So what:** these are our differentiator for the *product* and the demo video — lead with them there. They are the "what a learner would actually return to" story the pilot can't tell.

---

## 4. The trap — do NOT do this

**Do not add our rich features into the *experiment* arm.** This is the pilot's hardest-won lesson and the subtlest point here.

The pilot is deliberately one page, Arm A vs Arm B, *nothing else*, because every extra feature is a variable that confounds a 6-person study. If we run our two-tab product *as the experiment*, predict-before-decide and the adjacency engine become uncontrolled variables, and we won't be able to say the help policy caused any effect — exactly the confound the pilot stripped out.

**The resolution:** run the *experiment* on a stripped-down arm (one page, help ladder only, Arm A vs Arm B — like the pilot). Keep the *full two-tab product* as the thing you demo and ship as the live link. Same codebase, a config flag chooses "study mode" (minimal) vs "product mode" (full). The experiment stays clean; the product stays rich.

**So what:** "complexity is not credit" applies to the *experiment*, not the product. Separate the two and you get both marks.

---

## 5. How this maps to the five rubric criteria

| Criterion | Current state | What closes the gap |
|---|---|---|
| Problem understanding | Strong (docs) | Keep; add the pre-registered prediction (§2.1) |
| **The removal test** | **Not run — the blocker** | **§1 in full. Nothing else substitutes.** |
| Architecture | Clean but unproven | Adopt "LLM never decides whether to help" phrasing (§2.2); move key server-side (§2.5) |
| Product quality | Our strength | Keep the two tabs (§3); demo them; split study-mode vs product-mode (§4) |
| Learning | Aspired, not shown | Start the three append-only logs now (§2.3); report honestly (§2.4) |

---

## 6. The honest bottom line

The fastest path to a submittable capstone is not more building. It is: **author a proper question set, pre-register the analysis, recruit six outside learners, run practice + a delayed removal test, and report whatever number comes out.** The product we built is good and is the demo; the study is the capstone. Start recruiting today — the 5–7 day gap is the only thing here you can't compress.
