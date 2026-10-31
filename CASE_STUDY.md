# Learning OS: Assisted Independence
### An AI-assisted learning platform designed to help learners build capability, not just complete tasks

*100xEngineers · C7 Capstone · Rajiv Krishnan J · 31 October 2026*

---

## 1. Executive summary

Learning OS explores a practical question about AI-assisted learning: **when an AI tutor helps someone complete a task, can the learner still solve a similar problem independently after the assistance is removed?**

I built Learning OS as an interactive learning platform for Process Content in Salesforce Data Cloud. It combines an open-question experience with a structured concept-based learning path. Within guided practice, I created two assistance conditions: **Think-First**, which asks learners to predict, attempt, and use progressive hints, and **Answer-First**, which gives the correct answer and explanation immediately after submission.

The nine-learner comparison recorded higher held-out accuracy for Think-First: **90.0% (54/60 answers) versus 72.9% (35/48) for Answer-First**, a descriptive difference of **17.1 percentage points**. This is an encouraging directional result, but it is exploratory—not proof that the approach improves learning. The study deviated from its pre-registered protocol: the removal test took place after a reported 1–4 day gap rather than 5–7 days, and the questions had not been calibrated for difficulty. First-attempt practice scores were not supplied, so the pre-registered parity check cannot be evaluated.

## 2. The problem: task completion can hide a learning gap

AI assistants make it easy to get an explanation or a recommended answer to a technical question. For example, a learner working with Salesforce Data Cloud might ask which parser is appropriate for PDFs containing important tables. The assistant can recommend an option and explain why.

That can help the learner finish the immediate task. It does not, by itself, show whether the learner can recognize the same decision in a new scenario later.

This creates a distinction between **performance with assistance** and **independent capability**. A learner may complete a task while supported by an AI system but struggle when the system is unavailable. A product that measures only whether the task was completed risks confusing assistance with learning.

Learning OS was designed around that gap. Its central question is not simply whether AI can answer a question, but whether the way assistance is delivered affects what a learner can later do without it.

The project was motivated by published research on AI assistance and learning, including Bastani and colleagues' 2025 *PNAS* study referenced in the original project deck. That work provided context for exploring interface design as a factor in learning. Learning OS is a separate small pilot and does not reproduce that study.

## 3. The solution: two learning surfaces

Learning OS focuses on Process Content decisions in Salesforce Data Cloud, including parsing, chunking, retrieval, enrichment, and Document AI concepts. The learning experience is organized around 17 authored modules.

### Ask Freely

Ask Freely lets a learner enter a question in their own words. The current prototype sends the question to Google Gemini using a learner-provided API key. After an answer, the app can suggest author-curated related concepts that connect the question to the structured learning path.

**Implementation note:** Ask Freely currently makes a direct client-side Gemini API call. The repository describes a RAG-oriented product direction, but the current code does not implement or verify an end-to-end retrieval pipeline over all 17 modules. This case study therefore describes Ask Freely as Gemini-powered question answering with curated links, not as a validated RAG system.

### Learn from Path

Learn from Path presents a concept map of the learning modules. Learners open a concept, review its teaching content, and complete associated practice questions. Progress is reflected in the concept map, and the application records practice and learning interactions.

The full product supports open exploration and structured learning. The study comparison focuses more narrowly on how assistance is delivered during guided practice.

**Live product:** https://rajivkrish03.github.io/learningos/  
**Think-First:** https://rajivkrish03.github.io/learningos/?arm=A  
**Answer-First:** https://rajivkrish03.github.io/learningos/?arm=B  
**Repository:** https://github.com/rajivkrish03/learningos  
**Presentation:** https://rajivkrish03.github.io/learningos/presentation/

## 4. The two practice conditions

The names Think-First and Answer-First describe two conditions inside Learn from Path; they are not separate product tabs.

| Capability | Think-First (Arm A) | Answer-First (Arm B) |
|---|---|---|
| Concept map and teaching content | Yes | Yes |
| Multiple-choice practice | Yes | Yes |
| Confidence prediction before options | Yes | No |
| One-line reasoning before options | Yes | No |
| Progressive help ladder | Three hint levels | No |
| Correct answer | After a correct choice, or explicit reveal | Immediately after any submission |
| Explanation and explain-back | Yes | Yes |
| Practice events recorded | Yes | Yes |

### Think-First: predict, attempt, then receive help

Before the options appear, the learner records a confidence level and a short reason. The learner then commits to an answer. If they are not correct, they can try another option and use the help ladder:

1. **Name the deciding axis:** identify the dimension that matters without giving away the answer.
2. **Rule one out:** eliminate an incorrect option and explain why it fails.
3. **Walk through the reasoning:** provide a more explicit decision path while still asking the learner to make the final choice.

The learner can explicitly reveal the answer, but the interface marks that the attempt should not count as unaided. After a correct answer, the learner is asked to explain the reasoning in their own words.

### Answer-First: attempt, then receive the answer

The learner sees the multiple-choice question directly, without the prediction step or help ladder. After any submission, the app reveals the correct answer and provides an explanation, then invites the learner to explain the choice.

Both conditions use the same domain and multiple-choice format while changing the assistance policy. That makes the comparison understandable, although the small non-randomized sample and protocol deviations limit causal interpretation.

## 5. Build and technical decisions

The application is a static web app built with vanilla JavaScript, HTML, and CSS. It is hosted on GitHub Pages and does not require a framework or build step.

The main implementation elements are:

- **Learning content:** authored module content, a concept graph, and a question bank with keyed correct answers.
- **Practice flow:** confidence and reasoning capture, multiple-choice submission, progressive help, feedback, and explain-back.
- **Deterministic assistance:** application logic controls which help interactions are available. The LLM does not decide when to reveal help. The current help rungs are authored in the application rather than generated dynamically.
- **Learner records:** a data-access layer stores profiles, API-key settings, practice events, behavior events, and read-node progress.
- **Export:** learners can export their recorded data as JSON for later analysis.
- **Storage:** the current implementation uses browser localStorage. The repository includes a proposed Supabase/Postgres schema, but a live Supabase persistence layer is not connected in this version.
- **Generative answer support:** Ask Freely uses a learner-provided Gemini API key in the browser. This is a prototype arrangement, not a production secret-management design.

Keeping the assistance policy in application logic makes it easier to inspect which help interactions were available and record what the learner used.

## 6. Evaluation: nine learners and the removal test

The comparison involved **nine learners**: five in Think-First (Arm A) and four in Answer-First (Arm B). All nine were reported as completing the practice phase, with no exclusions. Each learner was scored on 12 held-out questions.

### Held-out results

| Learner | Think-First correct | Learner | Answer-First correct |
|---|---:|---|---:|
| A1 | 11 / 12 | B1 | 9 / 12 |
| A2 | 10 / 12 | B2 | 10 / 12 |
| A3 | 10 / 12 | B3 | 8 / 12 |
| A4 | 11 / 12 | B4 | 8 / 12 |
| A5 | 12 / 12 | | |

| Condition | Correct answers | Total answers | Accuracy |
|---|---:|---:|---:|
| **Think-First (n=5)** | **54** | **60** | **90.0%** |
| **Answer-First (n=4)** | **35** | **48** | **72.9%** |
| **Descriptive difference** | | | **+17.1 percentage points** |

The observed scores are higher in Think-First by 17.1 percentage points. This is a descriptive comparison of a very small sample, not a statistically conclusive finding. A simple learner-level Welch interval for the difference is approximately +4.7 to +29.4 percentage points; with only five and four learners, that interval is highly uncertain and should not be interpreted as definitive evidence.

### Protocol deviations and interpretation

The original analysis plan specified a 5–7 day gap between practice and the tool-free removal test. The reported gap for this run was **1–4 days**. The original plan also required question-difficulty calibration with 2–3 people before the main pilot; **that calibration was not performed**.

The combined held-out accuracy was 89/108, or approximately 82.4%. This is below the pre-registered 85% ceiling threshold and above the 15% floor threshold. However, without prior item calibration, the question set's difficulty and coverage remain uncertain. The first-try parity check cannot be evaluated because per-arm first-attempt practice accuracy was not provided.

The results therefore show a directional difference in this small completed comparison, but they do not establish that the help ladder caused the difference or that the effect will persist over the originally specified 5–7 day interval. The gap deviation, lack of calibration, non-random alternating assignment, small sample, and missing first-try parity data all limit interpretation. No statistical-significance claim is made.

## 7. What I learned

The biggest learning from this build was that creating a helpful AI interaction is easier than demonstrating that it creates lasting capability.

Initially, I was inclined to treat a richer product—with more surfaces and interactions—as proof of a stronger learning solution. The experiment requirements changed that perspective. A polished experience is useful, but it cannot replace a clear outcome and a fair test.

A second learning was the importance of item difficulty. Questions that are too easy create a ceiling; questions that are too difficult create a floor. The absence of a calibration step in this run is a limitation I would address before a larger follow-up.

A third learning was to separate the product experience from the experimental comparison. The full product supports exploration and structured learning. The two experimental conditions isolate the assistance difference during practice so that the comparison is easier to interpret.

Finally, I learned to distinguish technical validation from learning evidence. The application can log interactions and produce scores, but the claims we make must still be bounded by the quality of the study design and the data collected.

## 8. Limitations and next steps

This was a small exploratory comparison, not a confirmatory study. The main limitations are the nine-person sample, a reported 1–4 day rather than 5–7 day delay, no prior question calibration, alternating rather than randomized assignment, and missing first-attempt practice accuracy for the parity check.

A stronger follow-up would calibrate the question bank with independent learners, preserve the planned delay, collect complete practice-event exports for both conditions, and recruit a larger sample with a pre-specified assignment and analysis process. It should also verify that all participants receive the intended condition and that held-out items remain unseen during practice.

The present result is worth reporting because it is the observed outcome, but it should be treated as a reason to investigate further—not as proof that Think-First is superior.

## 9. Built by

**Rajiv Krishnan J** — solo capstone. Problem framing, experiment design, learning content, implementation, evaluation, and write-up.

*100xEngineers · C7 Capstone · #0to100xEngineer*
