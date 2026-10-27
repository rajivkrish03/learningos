# Learning OS: Assisted Independence

**100xEngineers · C7 Capstone · Module 3**

## What this project is

This project is a capstone build for the 100xEngineers program. The goal is to design and build a learning assistant for writing SQL against a given schema — one that helps a learner answer today's question *and* leaves them measurably more able to answer tomorrow's question alone, without the assistant.

The skill in scope: given a question in plain English (e.g. "which customers ordered more than twice last quarter"), the learner must write a SQL query against a provided schema and return the correct rows. Both the assisted and unassisted tracks run on Supabase. Correctness is judged by result set, not by opinion or style.

The competing product is not another AI tutor — it's the plain, answer-giving chatbot a learner already has open in the next tab. Winning means doing better than that on a specific, falsifiable test described below.

## The observation behind the brief

A learner can get a working query from a chatbot in seconds and move on. Weeks later, facing the same kind of schema with no assistant, she can't start. The task completed; the capability wasn't built.

This is a known, measured effect, not a hunch:

- In a field experiment with ~1,000 students, an ordinary GPT assistant improved practice performance by 48%. Once removed, those same students scored 17% *worse* than students who'd never had an assistant. A version that gave structured hints instead of answers removed most of the damage. (Bastani et al., PNAS 2025)
- A carefully built tutor in a Harvard trial produced more than 2x the median learning gain of an active-learning classroom, in less time — same underlying technology, opposite outcome. (Kestin et al., Scientific Reports 2025)

The variable isn't the model. It's what the assistant does when asked for help. Whether a learner is building capability or borrowing it is invisible in the moment — the task completes either way, the learner feels satisfied either way. The difference only shows up once the assistant is taken away.

## The hypothesis

> If an assistant decides how much to give based on what the learner can already do without it, then unaided performance after removal improves without today's task completion collapsing — because help withheld at the edge of ability forces the learner to retrieve rather than read, and retrieval is what makes a skill available later.

## The central question

What must the system *learn*, *decide*, or *demonstrate* in order to tell the difference between a learner who needs a nudge and one who needs the answer — and to act on that difference without just becoming a slower chatbot?

## What we already know (constraints to design against)

1. **The harm comes from the interface, not the model.** Both arms of the Bastani et al. experiment ran on the same underlying model. Answer-giving vs. structured-hint-giving produced opposite post-removal results. A better model will not rescue a bad help policy.
   - *Open question:* What is the smallest change to what the system says that would flip the removal-test result?

2. **Learning is invisible at the moment you help.** There's no live signal that cleanly separates "building capability" from "borrowing it." The only honest measurement is later, without the system, on unseen questions — and that test is slow and expensive to run.
   - *Open question:* How often can the real removal test realistically be run, and what cheaper proxy guides decisions between runs?

3. **Effort doesn't disappear when AI helps — it relocates.** Across 936 real tasks reported by 319 knowledge workers, confidence in the AI predicted *less* critical-thinking effort; confidence in one's own expertise predicted *more*. The effort that remained shifted toward verification. (CHI 2025)
   - *Open question:* Which part of writing a query should the system deliberately make harder, and which part should it just hand over?

## The required validation: the removal test

This is not optional and is the core deliverable, not a nice-to-have:

- Hold out a set of questions the system has never assisted on.
- Switch the system off.
- Score learners by result set (correct rows), not by self-report or opinion.
- Compare against a baseline group that used an ordinary answer-giving assistant.
- At least **6 learners**, **none from the team**.
- Report the actual number obtained — not the number hoped for.

## Open design questions to keep revisiting

- What counts as "writing this query unaided," precisely enough that a script (not a judgment call) can decide it?
- A learner wants the answer at 11pm before a deadline. Withholding is right by the system's measure, wrong by theirs. Who decides, and how is that decision made legible to the learner?
- If the removal test shows no difference vs. baseline, what gets checked first?
- Retention improves while task completion drops — which gets optimized for, and how is that trade-off defended to a learner who just wants to finish?
- What evidence would be convincing enough to abandon "withholding" as the mechanism entirely?

## Evaluation criteria

| Criterion | What's being assessed |
|---|---|
| Problem understanding | Did the design model how a learner gets stuck, not just how a tool answers? |
| The removal test | Real learners, held-out questions, scored against a baseline — actually run, not theorized. |
| Architecture | Deterministic, probabilistic, and human-in-the-loop parts are each used where they belong. |
| Product quality | The end-to-end slice actually works for someone outside the team. |
| Learning | Evidence changed the hypothesis over time, and that change is shown, not just claimed. |

## Guiding principle

**Complexity is not credit.** More agents, more models, more tools do not strengthen this capstone. A system that gives fewer answers and *proves* the retention effect beats a cleverer system that only asserts it.
