# Learning OS: Assisted Independence
### A tutor that builds skill instead of borrowing it — and proves the difference

*100xEngineers · C7 Capstone · @100xEngineers · #0to100xEngineer*

---

> **Publishing checklist before you go live:**
> - [ ] Replace the `[[FILL AFTER STUDY]]` block in §5 (Results) with your real numbers
> - [ ] Add your GitHub repo link and live app link in §3
> - [ ] Add your demo video link in §3
> - [ ] Word count check: `wc -w CASE_STUDY.md` — aim for 800–1,200 words of published text (this draft is ~1,050 excluding headers, meta-notes, and placeholders)
> - [ ] Remove this checklist block before publishing

---

## 1. TL;DR

AI tutors have a dirty secret: they make you look smarter today and worse tomorrow. In a study of 1,000 students, a GPT assistant lifted practice scores 48% — then, once removed, those students scored 17% *below* peers who'd never used it at all. I built **Learning OS**, a tutor for Salesforce Process Content (RAG configuration) that does the opposite: it withholds the answer at the edge of your ability and makes you commit your own reasoning first. I tested it against a real answer-giving chatbot with 9 outside learners, on held-out questions with every tool switched off.

---

## 2. The Problem

Watch a learner use a chatbot to answer a technical question — say, *"which parser should I use for PDFs full of nested tables?"* They paste the scenario, get "Use Docling" in four seconds, move on. Six weeks later, same kind of question, blank screen: they can't start. The task completed; the capability never formed.

This isn't anecdote. Bastani et al. (PNAS 2025) ran it as a controlled experiment: an ordinary GPT assistant raised practice performance 48%, but when removed, those students fell 17% *below* students who'd never had one. A hint-giving version erased most of the damage. The lesson is sharp: **the harm came from the interface, not the model.** Both arms ran on the same GPT. What differed was what it did when asked.

The insight I built on: whether a learner is *building* capability or *borrowing* it is invisible in the moment — the task finishes either way and the learner feels equally satisfied either way. The difference only becomes measurable once the assistant is gone. So any honest claim about learning has to be proven by *removing* the tool and testing on unseen questions. That test, not the tool's polish, is the real deliverable.

---

## 3. The Solution

**Learning OS** teaches Process Content config decisions (parser / chunking / search type / enrichment / Document AI) — a skill where there is always a defensibly correct answer, so correctness is scorable by a script, not an opinion. Three ideas carry the whole thing:

**1. Predict before you decide.** Every question opens with a confidence slider and a one-line "why do you lean this way?" — *before* any option or hint appears. You must retrieve your own reasoning before help can shortcut it. This is the retrieval moment the whole thesis depends on: a learner who has to produce reasoning before a hint is available cannot simply read the hint and move on.

**2. A help ladder that names the axis, not the answer.** When you ask for help, the system gives the least that still forces retrieval. Nudge 1 names the dimension that matters ("this hinges on table fidelity") without naming the answer. Nudge 2 eliminates one wrong option with the reason. Nudge 3 walks the decision recipe — but asks the learner to state the final choice. "Just show me the answer" is always available, but it's labeled: *this won't count as unaided.*

**3. An independence meter.** Your unaided streak per concept is visible on the concept map. Withholding feels like leveling up, not denial.

The product is two tabs: **Ask Freely** (real RAG-grounded answer to any question, never withheld — competes head-on with the chatbot one tab away) and **Learn from Path** (the metered-help practice track). Answering freely keeps the learner engaged; the metered practice path on the adjacent concept is where durable skill gets built rather than borrowed.

**Stack:** vanilla JS, GitHub Pages (static), Supabase-ready data layer (currently mocked to localStorage, one flag from live), BYO Gemini API key. No framework, no build step.

> **[[ADD: GitHub repo link]] · [[ADD: live app link]] · [[ADD: demo video link]]**

---

## 4. The Build

The first real decision was what *not* to build. The capstone brief is blunt: more agents, more models, and more tools don't make a stronger project. A system that gives fewer answers and *proves* the effect beats a cleverer one that only asserts it. So I cut model-generated hints (pre-authored rungs are more controllable and don't require a model to prove the effect) and any live "is this learner learning?" classifier — the whole premise is that this signal doesn't exist in the moment.

The sharpest architectural decision: **the LLM never decides whether to help.** Plain code decides — based on hints opened, first-submit result, and pre-confidence — which rung to show. The LLM only writes hint wording. This sounds like a small detail. It isn't: it means the study logs *prove* what each learner received. If a model gated help, I couldn't show a judge the difference between Arm A and Arm B. Because plain code gates it, the assignment is deterministic and auditable.

The hardest pivot came from comparing against a completed peer pilot. Their project was simpler but stronger on the criterion that matters most: they *ran the study* and reported an honest result. Our richer product (two tabs, predict step, concept map) was the stronger product — but a product with no data beats a clever product that only asserts its effect, every time. So I separated the experiment from the product: the study runs on a stripped-down arm (help ladder only, one-line config flag) to keep variables controlled. The full product is the demo; the clean arm is the capstone.

The second fix was calibration. I'd assumed I could eyeball which questions were equally hard for both arms. You can't. A question that feels obvious to the author is a coin-flip for a learner. So I added a required calibration step: pilot every item on 2–3 people first and use the *observed* unaided-correct rate as the difficulty measure. Items where everyone gets it right (ceiling) or everyone fails (floor) are dropped before the main study — because a ceiling means there's no headroom to measure a difference, and the peer pilot's fatal flaw was exactly that: Arm A scored 100% and the test had nothing left to detect.

---

## 5. Results

> **[[FILL AFTER STUDY — paste your numbers here before publishing]]**
>
> The removal test: **N = 9 learners** (5 → Arm A withholding, 4 → Arm B baseline), none from the team, scored on held-out Process Content config questions with every tool switched off, graded by keyed correct answer.
>
> **Headline — unaided held-out accuracy, Arm A vs Arm B:**
> `[e.g. "67% vs 48%, a +19pt difference favouring withholding"]`
>
> **Effect size + CI:**
> `[e.g. "Cohen's h = 0.39, 95% CI [−0.11, 0.89] — wide CI expected at n=9; direction consistent with hypothesis"]`
>
> **Pre-registered checks:**
> - Ceiling check (mean < 85%): `[pass / fail]`
> - Floor check (mean > 15%): `[pass / fail]`
> - First-try parity (< 20pt gap): `[pass / fail]`
>
> **What the result means:**
> `[One honest paragraph — lead with the number, name every confound before a judge does, label as underpowered pilot. See ANALYSIS-PLAN.md §8 for the pre-registered interpretation map.]`
>
> **One learner quote:**
> `["..." — ideally someone noticing they could answer the next one without help]`

---

## 6. What I Learned

The hardest thing wasn't the code — it was measurement. Getting a model to answer a question is easy. Proving that the answer didn't rot the learner is the hard part, and almost nobody building AI tutoring products right now is measuring it.

The insight that will stick: the variable that determines whether an AI assistant builds or destroys skill is not which model it runs on. It is what the assistant does in the moment the learner asks. The same model, the same question, the same answer — one interface builds retention, one destroys it, and both feel identical to the learner while it's happening.

The removal test is the only honest measurement. That's not a feature of this capstone — it's a feature of any claim about learning. If you haven't taken the tool away and tested on unseen questions, you haven't measured learning. You've measured task completion.

**Next steps:** a properly powered confirmatory study (this pilot tells me the n a confirmatory run needs); model-generated rungs only if pre-authored ones prove the effect first; extending the pattern to any skill with a scorable correct answer.

---

## 7. Built By

Solo capstone. Problem framing, experiment design, item authoring, build, study, and write-up by Rajiv Krishnan J.

*Critique and design pressure from the 100xEngineers C7 cohort — the within-subject shift and difficulty-calibration fix both came out of peer review.*

---

*@100xEngineers · #0to100xEngineer*
