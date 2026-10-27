# Learning OS: Assisted Independence — Design & Plan

**100xEngineers · C7 Capstone · Module 3**
**Skill domain:** Process Content in Data Cloud (Salesforce unstructured-data / RAG)
**Starting point:** the existing `process-content-lab` interactive course
**Status:** design doc — written before building. Decisions here are provisional and expected to change as the removal test produces evidence.
**Last consolidated:** 2026-10-14 (folds in the two-tab product, answer-then-expand bet, hybrid removal test, and the free/BYO-key RAG stack worked out in design discussion).

---

## 0. One-paragraph summary

The capstone brief uses "writing SQL against a schema" as its running *example* of a skill. Our actual skill is **Process Content in Data Cloud** — the material the author wrote, in the `process-content-lab` app. The job is not to teach that material better; the lab already teaches it well. The job is to make a learner **measurably able to answer Process Content questions after the tool is taken away**, and to *prove* it with a removal test against a plain answer-giving chatbot. The mechanism: **answer the learner's question freely, then expand into a short retrieval path on the adjacent skill, with help metered to what the learner can already do unaided.** Answering freely keeps the learner engaged (and competes with the chatbot head-on); the metered-help path is where durable skill is built instead of borrowed.

---

## 0.5 Product model (current)

The product is **two tabs**, so the "satisfy the need now" job and the "build durable skill" job each get a surface that does them well:

- **Tab A — "Ask freely."** A free-form box. The learner asks any Process Content question in their own words and gets a **real answer** (RAG grounded in the author's 17 modules — §12). No withholding; this is the surface that competes with the chatbot one tab away. After the answer, the system shows **author-curated "Related concepts"** — honestly labeled as *related*, not a fabricated "X% of learners" number — which is the doorway into Tab B.
- **Tab B — "Learn from path."** A short practice path of config/decision items (§2) on the concept the learner just touched and its neighbors. This is where the **help ladder (§4), predict-before-decide (§2.2), explain-back (§2.3), and independence meter (§5.1)** live. The answer in Tab A buys the right to make the learner *work* on the adjacent retrieval here.

**Why both, not one:** pure withholding wins the experiment but feels stingy and loses the learner (brief cites Wu et al. on lost motivation). Pure answer-giving keeps the learner but is the borrowing the research shows rots retention. Answering freely then routing into metered-help practice gets both: continuation fixes withholding's motivation problem; metered help on the *neighbor* fixes continuation's borrowing problem. The **measured mechanism stays simple** — metered help beats full answers on unseen items — so "complexity is not credit" still holds; the second tab is the delivery vehicle, not a second thing to prove.

**Adjacency is author-curated (anti-slop).** The "others found this useful" map is the author's expert judgment of what sits next to what (e.g. "read tables in PDF" → "process images in PDF," both M5 Docling), traceable to modules — not a model free-associating and not a faked social-proof statistic. It can become data-driven later (log what learners actually ask next), but for the pilot it's curated and labeled "Related," not "87% of learners."

---

## 1. What the lab is today, precisely

`process-content-lab` is a single-page interactive course. Reading the code (`js/data.js`, `js/app.js`, `js/grader.js`):

- **17 modules**, each a list of linear "steps." Step types in the engine: `intro`, `concept`, `demo`, `quiz`, `er`, `custom`, `arena`, `build`.
- The teaching steps (`concept`) use a **"Pause & think" prompt shown before a reveal** — a Socratic beat already baked into the UI (`askHTML` in `app.js`).
- Assessment today is **3-option multiple-choice quizzes** (`renderQuiz`). A quiz blocks "Continue" until answered; a wrong pick shows feedback but lets you retry; a right pick unlocks progress.
- There is an **Arena + schema-builder + rubric grader** (`grader.js`, `renderArena`, `makeBuilder`) — but it was built for a *data-modeling* course. For Process Content, `CHALLENGES = []` is **empty**. So the grade-a-produced-artifact machinery exists but is unused in this domain.
- Progress, answered-state, and built schemas persist in `localStorage` under `modeling-lab.v2`.

**Implication.** The lab is a *teaching + recognition-quiz* app. It has no notion of (a) measuring what a learner can do *unaided*, (b) deciding how much help to give based on that, or (c) a removal test. Those three are the capstone.

---

## 2. The gradable task (decided)

Equivalent of the brief's "correct rows": **config/decision answers.** A learner is given a scenario and must choose the correct Process Content configuration — e.g. *"Product manuals, heavy nested tables, customers search by part number"* → the right **parser / chunking strategy / search type / enrichment** decision. Correctness is checkable against a defined key, exactly like a result set: there is a right answer and a script can score it, no opinion required.

This is a strong fit because the lab's own **Decision Framework (M13)** and **Capstone (M17)** already treat Process Content expertise as *"choose the right combination for your content, and defend it."* That is the skill worth retaining — and the thing a chatbot will happily hand over, destroying the retention we care about.

**Why not the other options:**

- *Schema-builder Arena* — it's data-modeling, off-domain for Process Content; reusing it would test the wrong skill.
- *Short written answers* — can't be scored deterministically by a script, which the brief explicitly requires ("precisely enough for a script to decide").

### 2.1 What "answered unaided" means (the brief demands precision here)

A decision item is **answered unaided** when the learner selects the correct configuration **without having opened a hint/scaffold on that item, on the first submit, within the attempt.** Concretely, per item we record: `hintsOpened` (count), `revealedAnswer` (bool), `firstSubmitCorrect` (bool), `timeToFirstSubmit`. "Unaided correct" = `firstSubmitCorrect && hintsOpened===0 && !revealedAnswer`. This definition is what both the live policy and the removal-test scorer use, so they agree.

### 2.2 Predict-before-decide (the single most important experience change)

Before any help can exist, the learner must **commit their own reasoning**. Each decision item opens with: *"Before you choose — how confident are you (slider), and in one line, why?"* Only after they commit do the options and the help affordance appear.

This is small to build and does three things no other feature does:

- **It creates the retrieval moment the whole thesis depends on.** The learner has to produce their reasoning *before* a hint can shortcut it — this is the "retrieve rather than read" the brief is built around.
- **It gives the help ladder a real signal to key off.** A learner who is *confidently wrong* needs a different intervention than one who is *unsure but right*. Without this step the help policy is guessing; with it, it's responding to data collected one second earlier.
- **It operationalizes the brief's CHI-2025 constraint directly.** That research found confidence in the AI predicts *less* effort and confidence in one's own expertise predicts *more*. Predict-before-decide lets us *measure* self-confidence per item and correlate it with unaided outcomes — turning a cited finding into our own instrument.

Recorded per item: `preConfidence` (0–100), `preReason` (text), later joined to `firstSubmitCorrect`.

### 2.3 Explain-back (self-explanation after answering)

After an item resolves (aided or not), the learner states **why** the answer is right in one line, then sees the reference reasoning. Self-explanation is one of the most robust retention mechanisms in the learning literature, and it is the direct counter to the "slower chatbot" trap: a chatbot gives the answer and the learner moves on; here the learner must articulate the rule, which is what survives removal. Recorded: `explainBack` (text) — also a qualitative read on whether understanding is real or borrowed.

---

## 3. The core design question, answered concretely

> What must the system *learn, decide, or demonstrate* to tell a learner who needs a nudge from one who needs the answer — without becoming a slower chatbot?

**It must estimate, per concept, whether this learner can currently produce the answer unaided — and give the least help that still lets them retrieve it.** The smallest honest version of this:

1. **Learn:** a per-learner, per-concept read of whether the learner can currently produce the answer unaided, updated from unaided outcomes only. (If help was given, that attempt does *not* count as evidence of mastery — it counts as evidence help was needed.) **Early, keep this crude and honest** (see §7): "has this learner gotten *any* same-concept item unaided yet," combined with the just-collected `preConfidence`. A probabilistic estimate is too noisy with ~10 items/learner to trust for gating.
2. **Decide:** a **help ladder** gated by that read plus the predicted-confidence signal. Confidently-wrong → go to the distinction they're missing. Unsure → narrow the space, don't give it away. Repeatedly stuck → worked reasoning, never the raw letter choice by default.
3. **Demonstrate:** that unaided performance on **held-out** items, **tool off**, beats the chatbot baseline — the removal test.

The anti-pattern to avoid ("slower chatbot") is making the learner click through friction to reach the same answer the chatbot gives instantly. The nudge must change *what the learner does* (force retrieval of the Parser/Chunking/Search distinctions), not just *delay* the answer.

**Where this applies in the two-tab model (§0.5):** we do **not** withhold the answer to the learner's *own* free-form question — Tab A answers it directly. The help ladder operates in Tab B, on the **adjacent practice items**. So "give the least help that still lets them retrieve" governs the *path*, not the thing they came in asking. This is the reconciliation of "never refuse the learner" with "don't let them borrow the skill."

---

## 4. The help ladder (the one lever that matters)

Per the brief's constraint #1 ("the harm came from the interface, not the model"), the whole bet is the wording of help. Four rungs, each a strictly smaller gift than the next:

| Rung | What the learner sees | When |
|---|---|---|
| 0 — Pause & think | The existing Socratic prompt. No new information. | Default on every decision item. |
| 1 — Narrow the space | "This hinges on one axis: *table fidelity*. Which rung of the parser choice protects table structure?" Names the *dimension*, not the value. | First hint request, or low-confidence mastery. |
| 2 — Rule out | Eliminates one wrong option *with the reason* ("Default parser flattens tables — rule it out and say why"). | Second hint, or after a wrong first submit. |
| 3 — Worked reasoning | Walks the decision *recipe* to the answer, but asks the learner to state the final choice themselves. | Explicit "I'm stuck," or deadline-mode (see §6). |

The chatbot baseline is effectively "jump straight to the answer + explanation." Our bet is that rungs 1–2 produce retrieval the baseline skips.

**Smallest change that could flip the removal result (brief's open question):** whether rung 1 names the *axis* ("table fidelity") versus names the *answer* ("use Docling"). That single wording difference is the hypothesis in miniature, and is the first thing to A/B if the removal test is flat.

---

## 5. What we measure, and what we steer by between removal tests

The brief is blunt that the real signal (unaided performance after removal) is slow and expensive. So we separate two layers:

- **Ground truth (slow, rare):** the removal test. Run it at defined milestones, not continuously.
- **Proxy (cheap, live):** per learner, the **unaided-first-try rate on new items of an already-seen concept** — i.e. does the learner get the *next* item of the same type right without opening help? Rising unaided-first-try rate is our bet-correlate of retention. We explicitly log it as a *proxy* and treat divergence from removal-test results as a finding, not a bug.

**Guardrail against proxy-gaming:** because help withheld could just lower completion, we also track **completion rate** and an **in-session persistence signal**. (Note: the brief cites Wu et al. that *removed* learners report lower motivation, but "did they come back tomorrow" is not measurable in a single recruited-stranger study session — so we do **not** claim it. Instead we measure persistence we can actually observe: items abandoned before submit, early quits, and whether the learner keeps engaging after a withheld-help moment.) The product still has to feel worth continuing, or the retention win is moot.

### 5.1 The independence meter (makes withholding feel like winning)

A tool that withholds can feel stingy — which is the motivation risk above. The fix is to make the thing we *measure* also the thing that *feels rewarding*: a visible per-concept **independence meter** ("You've answered 3 chunking questions unaided in a row"). Now withholding reads as **leveling up**, not denial. This aligns the learner's felt experience with the retention metric — they *want* to need less help — which is a cleaner solution to the motivation problem than any external reward, and worth calling out explicitly in the write-up.

---

## 6. The 11pm problem (brief's open question, answered)

*A learner wants the answer at 11pm before a deadline. Withholding is right by our measure, wrong by theirs.* Decision: **the learner can always override to rung 3**, but the override is **explicit, visible, and logged** ("Show me the reasoning — this one won't count toward your unaided streak"). We don't silently refuse. Legitimacy comes from making the trade legible: the learner sees that taking the answer trades their retention signal, and that choice is theirs. This also keeps motivation intact — nobody is trapped.

---

## 7. Architecture — deterministic / probabilistic / human, each where it belongs

The brief grades on putting these three in the right places. "Complexity is not credit," so this is deliberately small.

**The central architectural rule: the LLM never decides *whether* to help.**

Plain code decides whether to give a hint and which rung to show — based on `hintsOpened`, `firstSubmitCorrect`, and the pre-confidence value. The LLM's role is limited to one thing: the *wording* of the hint content. This is not a subtle distinction — it is what makes the logs *prove* what each learner received. If the LLM gated help, we couldn't show a judge what Arm A got versus Arm B, because the decision would be inside a model call. Because plain code gates it, the arm assignment is deterministic and auditable. This rule is implemented in `app.js`: the rung-display logic is a series of `if` conditions on recorded state, not a model call.

- **Deterministic:**
  - Answer scoring (config decision vs. key) — pure comparison, no model.
  - "Unaided" bookkeeping (§2.1) — pure state machine.
  - Removal-test scorer — pure comparison.
  - The help-ladder *gating rules* — plain thresholds on the mastery estimate. **Not a model call.**
  - Arm assignment (Arm A vs Arm B) — config flag, set at deploy time, never at runtime by a model.
- **Probabilistic (model, used narrowly — wording only):**
  - Generating the *wording* of rungs 1–3 for a given item, in the "name the axis, not the value" style. **Start pre-authored** per item — a model is not required to prove the effect, pre-authored rungs are more controllable, and the brief rewards proving over cleverness. Only reach for a model if authoring ~15 items × 3 rungs becomes the bottleneck.
  - The per-concept mastery read. **Early, this is deliberately NOT probabilistic** — it's a crude deterministic rule (§3: "any same-concept item unaided yet?" + current `preConfidence`), because a Bayesian/decay estimate is too noisy at ~10 items/learner and would make early gating effectively random, mis-calibrating help exactly when first impressions set motivation. A probabilistic estimate is a later refinement, not a dependency.
- **Human-in-the-loop:**
  - The six+ real learners in the removal test.
  - Author review of each item's key and each rung's wording (the thing most likely to make or break the result).

**Deliberately NOT built:** multi-agent orchestration, a live "is this learner learning?" classifier (the brief says that signal doesn't exist in the moment), or anything that needs a better base model to work.

---

## 8. The removal test (the core deliverable, specified)

This is not a feature; it's the proof. The brief requires a comparison *against a baseline* ("held-out questions, your system switched off, scored by result set, against learners who used an ordinary answer-giving assistant"). The design below is **hybrid**: it keeps the brief-required baseline anchor while also capturing rich, naturalistic behavior — because the real product (§0.5) lets learners roam two tabs freely, and we want to study that, not cage it.

- **Hybrid design.** Most learners are **treatment**: they use the real two-tab product freely (Ask freely + Learn from path) and we log their behavior richly (below). A **small plain-chatbot baseline (2–3 learners)** uses only a general answer-giving LLM chat — the actual competitor "one tab away." This satisfies the brief's required *against-a-baseline* comparison while the larger treatment group feeds the correlational analysis.
- **Why hybrid, not pure within-subject or pure observational.** A pure observational "everyone roams free" design has **no baseline to compare against** — it fails the brief's explicit requirement. A rigid within-subject split throws away the naturalistic two-tab behavior that is the product's whole point. Hybrid keeps the required anchor *and* the behavior.
- **Item bank:** matched sets of Process Content config/decision items — a **practice set** (tool on) and a **held-out set** (never assisted). Matched **on observed difficulty, not author intuition** (§8.1) and on concept coverage.
- **Procedure:** treatment learners use the product freely across concepts; baseline learners use the chatbot. Both then take the **held-out set with all tools switched off.**
- **Scoring:** by result — correct config choice on held-out items — using the deterministic scorer.
  - **Required comparison (causal anchor):** treatment vs. plain-chatbot baseline, unaided held-out accuracy.
  - **Richest finding (within treatment, correlational):** does path-engagement predict retention? Using the behavioral logs — **tab switches, questions-asked-in-Ask-freely vs. path-items-completed (a reliance ratio), rungs opened** — do learners who leaned into the metered-help path score higher on held-out items than learners who mostly asked-and-left? This is the larger-n analysis and the most interesting, but it is **correlational, not causal** (path-leaners may be more motivated to begin with) and **must be labeled as such** in the write-up. Reporting it as cause would be exactly the overclaim the brief punishes.
- **Participants:** **≥ 6 learners, none on the team** (≈3–4 treatment, 2–3 baseline).
- **Reporting (honest about power):** report the number obtained — including null or negative — with **effect direction, effect size, and a confidence interval**, and explicitly frame ≥6 learners as an **underpowered pilot**, not a significance claim. State what the pilot *suggests* and what sample a confirmatory study would need.

### 8.1 Calibrating item difficulty (closes the biggest validity hole)

"Matched difficulty" cannot be eyeballed — a config-decision question that feels easy to the author can be a coin-flip for a learner, and if the held-out set is even slightly harder/easier than practice, the result is an artifact either way. So difficulty is **measured, not assumed**: before the real study, **pilot every item on 2–3 people** and record the **observed unaided-correct rate**. Use that rate as the difficulty measure, then build the matched practice/held-out and treatment/baseline sets so their difficulty distributions line up. Items that pilot as near-0 or near-100% unaided are dropped — they can't show an effect in either direction.

**If the test shows no difference (brief's open question), check in this order:**
1. **Were we simply underpowered?** With ≥6 learners, a true small effect can easily hide in the noise. Look at effect *direction and size* with its confidence interval before concluding "no effect" — a positive-but-not-significant trend in an underpowered pilot is a different finding than a flat zero.
2. Did treatment learners actually engage the help ladder, or coast on rung 0 / predict-before-decide and never reach a hint? (Instrumentation — we logged every rung open for exactly this.)
3. Was rung 1 secretly leaking the answer (naming the value, not the axis)? (The §4 wording bet — the most load-bearing assumption in the design.)
4. Did the difficulty calibration (§8.1) actually hold — were treatment-trained and baseline-trained concepts equally hard?
5. Was the baseline a real chatbot or a strawman? (A too-weak baseline manufactures an effect; a too-strong one hides it.)

**What would convince us the mechanism is wrong:** if treatment learners who *did* engage the metered-help path (not just coast on Tab A's free answers) still show no held-out advantage over the plain-chatbot baseline, across a difficulty-matched item bank, with adequate n — then "answer-then-expand with metered help" is not carrying its weight for this skill, and we'd pivot (e.g. worked-example fading, or heavier self-explanation). The behavioral logs are what let us distinguish "mechanism failed" from "learners never engaged the mechanism."

---

## 9. Build plan (phased, smallest-first)

1. **Author the item bank + adjacency map.** 12–20 config/decision items (parser, chunking, search type, enrichment, Doc AI vs. index), each with a deterministic key and **pre-authored help rungs** (§4), split into matched practice/held-out sets. Plus the **author-curated "Related concepts" adjacency map** (§0.5). *(No code; content work. Highest-leverage step. Author vets every key — anti-slop.)*
2. **Index the modules for RAG (§12).** Chunk the 17 modules in JS; embed with a pinned local model **at build time**; store vectors in Supabase `pgvector`.
3. **Build Tab A "Ask freely":** free-form box → retrieve top-K chunks → generate answer via the **BYO/pre-filled key** → show author-curated Related concepts.
4. **Build Tab B "Learn from path":** the `decision` step type with **predict-before-decide** (§2.2) and **explain-back** (§2.3); records all §2.1 fields plus `preConfidence`, `preReason`, `explainBack`.
5. **Add the help ladder** (Tab B) — four rungs + explicit §6 override. Log every rung open.
6. **Add the crude per-concept read + gating** (§3/§7). No probabilistic estimate yet.
7. **Add the independence meter** (§5.1) — per-concept unaided streak, visible.
8. **Add name/code login + Supabase logging** — `profiles`, `events`, `items`, `api_keys` tables (§12.1); events + behavioral signals (tab switches, questions-vs-path ratio) written from the browser.
9. **Add removal-test mode:** serves held-out items with all help disabled, writes a clean per-learner result record.
10. **Build the baseline arm (§8):** a plain general LLM chat for the 2–3 baseline learners.
11. **Pilot for difficulty (§8.1):** run items past 2–3 people, record observed unaided-correct rate, drop floor/ceiling items, build difficulty-matched sets.
12. **Run the test** (hybrid, §8) with ≥6 outside learners; export events; compute the baseline comparison + the within-treatment behavior→retention correlation, with effect size + CI.
13. **Write up** the number and what the evidence did to the hypothesis (brief's "Learning" criterion → the case study's Results section).

---

## 10. How this maps to the evaluation criteria

| Criterion | Where it's addressed |
|---|---|
| Problem understanding | §1–§3 + §2.2: modeled on *how a learner gets stuck and borrows* (and made to commit reasoning before help), not how the tool answers. |
| The removal test | §8 + §8.1: real outside learners, hybrid design (free-roam treatment + small plain-chatbot baseline anchor), difficulty-calibrated held-out items, deterministic scoring vs. a *real* chatbot, behavioral logging analyzed correlationally and labeled as such, honest about power. |
| Architecture | §7 + §12: deterministic scoring/bookkeeping, narrow (pre-authored-first) probabilistic use, humans in test + authoring, minimal static+Supabase stack. |
| Product quality | §9 phases 2–8: an end-to-end slice (predict → decide → help → explain → meter) an outside learner can actually use. |
| Learning | §8 "what would convince us it's wrong" + §11 + the write-up step: evidence is allowed to change the hypothesis. |

---

## 11. Open questions to carry forward

- Which concepts are most *borrow-prone* (chatbot-trivial but retention-fragile)? Those should be over-represented in the held-out set — they're where our mechanism can show its effect.
- Is a model even needed for rung wording, or do pre-authored rungs prove the effect just as well and more controllably?
- Does predicted self-confidence (§2.2) actually predict unaided success well enough to gate help on? (We'll know from the pilot.)

---

## 12. Tech stack & hosting (solo, Vercel + Supabase)

Deliberately minimal — "complexity is not credit." Scope the auth to *just enough to tie events to a learner and assign their condition order*; the account system is not the project.

- **Learner app:** extend the existing `process-content-lab` vanilla-JS engine (`app.js`, `grader.js`, `data.js`). No heavy framework, no build step required. The new `decision` step, help ladder, predict-before-decide, explain-back, and independence meter are all plain JS additions.
- **Hosting (the live link):** **GitHub Pages (personal) for the MVP** — see §12.3. The MVP has no server and no live DB, so a fully-static host is correct and gives the live link straight from the repo (deliverable #2). *When* real infra is added (shared DB and/or server-side key), move to **Vercel** (static + serverless, auto-deploys from the same repo) — Pages is static-only and can't hide a server-side key. For the MVP, Tab A's LLM call runs client-side with a pre-filled/pasted key (an accepted pilot shortcut; hardened on the Vercel move).
- **Login (name/code entry — no passwords):** a simple start screen where a learner enters a display name or a code handed out for the study. On submit, look up or create their `profiles` row and start a session (store the id in `localStorage`). This is intentionally *not* full Supabase Auth with passwords — for a ≥6-learner study that would be scope creep. The one thing it must do reliably: give every learner a stable `user_id` so their events join cleanly and their condition order is fixed across the session.
- **Answer engine (Tab A) — RAG over the author's modules.** Pipeline, and where each step's cost lands (end-to-end free to the builder):
  - *Chunk* the 17 modules — plain JS, free.
  - *Embed* with a **pinned local model** (transformers.js, e.g. `all-MiniLM-L6-v2`; upgrade to `bge-base`/`gte-base` if pilot retrieval is weak). Free, no key. **Embed modules at build time**, embed the question at query time — same model both sides (mismatched models = silent retrieval garbage).
  - *Store/retrieve* vectors in **Supabase `pgvector`** — free tier; retrieval is one SQL query.
  - *Generate* the answer with an LLM via a **BYO API key** (§12.2) behind a Vercel serverless function. The only step that could cost money — delegated to the key-holder, who can use a free tier (Gemini).
- **BYO key, pre-filled for the study.** Settings screen lets a user paste their own LLM key (real product feature). For the 6-learner study, pre-fill the author's own free-tier (Gemini) key so testers face no key step and the experience stays smooth.
- **Data (Supabase / Postgres):** four tables (schema below). The app writes events + behavioral signals from the browser via the Supabase JS client. Because every event carries a `user_id`, the §8 analyses are joins: the baseline comparison and the within-treatment behavior→retention correlation.
- **Baseline chatbot arm:** a real general LLM chat (the actual competitor) for the 2–3 baseline learners.
- **Removal-test analysis:** SQL in Supabase or a ~30-line Python/pandas script producing effect direction, size, and CI.

### 12.1 Data model

> Build-ready version (markdown column tables + copy-paste `CREATE TABLE` SQL + RLS) is in **`SCHEMA.md`**. Six tables total: the five below plus `module_chunks` (the RAG retrieval store — `module`, `chunk_text`, `embedding vector(384)`), populated once at build time.

```
profiles                                    -- the learner (name/code login writes here)
  id              uuid    PK  (generated)
  display_name    text        (or study code)
  condition_order text        -- which concepts are treatment vs baseline, for counterbalancing
  is_tester       bool        -- exclude team/pilot rows from final analysis
  created_at      timestamptz

items                                        -- the authored question bank (phase 1)
  item_id         text    PK
  concept         text        -- parser | chunking | search_type | enrichment | docai_vs_index
  scenario        text
  correct_choice  text        -- the deterministic key
  rungs           jsonb       -- pre-authored help ladder (rung1 axis, rung2 rule-out, rung3 worked)
  difficulty      numeric     -- observed unaided-correct rate from the §8.1 pilot
  set_role        text        -- practice | heldout

events                                       -- one row per decision attempt (the raw data)
  id              bigint  PK  (generated)
  user_id         uuid    FK → profiles.id
  item_id         text    FK → items.item_id
  concept         text
  condition       text        -- treatment | baseline | removal_test
  pre_confidence  int         -- 0–100, from predict-before-decide (§2.2)
  pre_reason      text
  hints_opened    int
  revealed_answer bool
  first_submit_correct bool    -- the core "unaided correct" input (§2.1)
  explain_back    text         -- self-explanation (§2.3)
  time_to_first_submit int     -- ms
  created_at      timestamptz

behavior_events                              -- Tab A/B usage, for the §8 correlational analysis
  id              bigint  PK  (generated)
  user_id         uuid    FK → profiles.id
  kind            text        -- tab_switch | ask_freely_question | path_item_started | path_item_completed
  payload         jsonb       -- e.g. the question text, which tab, which concept
  created_at      timestamptz
  -- the "questions-asked vs path-progress" reliance ratio is derived from counts here

api_keys                                     -- BYO generation key (§12.2); pilot-stage storage
  user_id     uuid  PK/FK → profiles.id      -- one row per user
  provider    text        -- e.g. 'gemini'
  key_value   text        -- PLAIN TEXT for pilot; RLS-protected; user-deletable (see §12.2)
  created_at  timestamptz
  -- RLS: a user may select/insert/update/delete ONLY their own row
```

Foreign keys: `profiles.id` ← `events.user_id`, `behavior_events.user_id`, `api_keys.user_id`; `items.item_id` ← `events.item_id`. A learner is 1:many with events/behavior; 1:1 with their api_key row. If real Supabase Auth is ever added, `profiles.id` becomes a 1:1 FK to `auth.users.id` — the rest is unchanged, so name/code login costs nothing later.

### 12.2 API-key storage (pilot decision — loosen now, harden later)

**Decision:** for the pilot, store the BYO generation key in Supabase (`api_keys` table) with a user-facing delete control. Not the maximally-secure choice, but acceptable for a 6-learner pilot whose study runs on the author's own *free-tier* key (small blast radius). Guardrails that make this the *safe* version of itself, all cheap:

- **Dedicated `api_keys` table** — never put a key in `events`/`profiles`. Keeps credentials out of any data you export, screenshot, or share for analysis/the case study.
- **Row Level Security on** — a user can read/update/delete only their own key row. This (not "stored in Supabase") is the real safeguard against leakage.
- **Real delete** — a "Remove my key" button hard-deletes the row. Default UX offers "use for this session only" (don't persist unless the user ticks "remember").
- **Honest labeling** — the key is stored **plain text** for the pilot; the README/case study says so plainly rather than implying encryption. Later-hardening path: Supabase Vault for encrypted secrets.

### 12.3 MVP posture — mock the DB behind a data layer (ship now, connect later)

The first shippable version has **no server and no live database**, but is written so connecting the real DB is a **one-flag change**. Both tabs are live.

- **One data-access module (`store.js`).** The entire app talks only to functions like `getProfile()`, `saveEvent()`, `saveBehavior()`, `getItems()`, `getKey()`. Nothing in the UI/logic touches a database directly.
- **Mock implementation = the real schema in `localStorage`.** The mock reads/writes using the **exact table names, columns, JSON shapes, and FK relationships from `SCHEMA.md`**. So the schema is the *contract* the mock honors; the only difference from production is where the bytes live (browser vs. Postgres).
- **The one-flag switch.** `const store = USE_MOCK ? mockStore : supabaseStore;`. To go live later: paste the `SCHEMA.md` SQL into Supabase, add the Supabase client as `supabaseStore` (same function signatures), set `USE_MOCK = false`. No other code changes.
- **Both tabs work in the MVP.** Tab B (practice, help ladder, logging) is fully functional against the mock. Tab A (Ask freely) calls the LLM **client-side with a pre-filled/pasted key** — fine on static Pages for the pilot; the key moves server-side on the Vercel step.
- **Data collection in the MVP (honest limitation).** `localStorage` is per-browser, so a mock DB does **not** auto-collect six testers' data into one place. Mitigation built into the MVP: a **"Download my results (JSON)"** button that exports a tester's events in the `SCHEMA.md` shape. This doubles as the **"GitHub repo / JSON (Workflow)"** deliverable and as the merge-input for analysis. The *real* 6-learner study either uses these exported JSONs merged by hand, or waits for the Supabase connection — a choice to make before the study, not before the MVP.

| Deliverable (100x template) | How it's satisfied (MVP) |
|---|---|
| Live project link | **GitHub Pages** URL (static, no server) |
| GitHub repo / JSON (Workflow) | The Pages repo; exported results + the `store.js` data contract are the JSON artifact |
| Demo video | Loom/screen recording — script from this design |
| Case study | `CASE_STUDY.md` draft, results filled after the §8 test (via exported JSON or post-Supabase) |
