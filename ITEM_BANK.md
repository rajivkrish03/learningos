# Learning OS — Item Bank (Batch 1 for vetting)

> **6 config/decision items, one per module (M5, M6, M7, M8, M9, M11).**
> These are the first batch — review the **answer keys** and the **help-rung wording** before I scale to the full bank.
>
> **Why these aren't the lab's quiz questions:** the removal test must measure *transfer* (applying the rule to a new situation), not *recall* of the exact quiz. So each item is a **fresh scenario** that the same module's rule governs. The "Traces to" line cites the module and the rule, so you vet against your own content, not my assertion.
>
> **What to check per item:** (1) is the keyed answer correct? (2) is there exactly one defensible correct answer, or is it ambiguous? (3) does **Rung 1 name the axis without naming the answer** (the core bet) — or does it leak? Mark anything to fix.

Legend: ✅ = keyed correct answer. Rungs escalate: **R1 names the deciding axis**, **R2 rules out one wrong option with a reason**, **R3 walks the reasoning to the answer but asks the learner to state it**.

---

## Item 1 — Parser choice (concept: `parsing`)

**Scenario.** You're indexing a set of equipment maintenance PDFs. Most pages are prose, but the critical content is in **multi-column spec tables and a few wiring diagrams** that technicians rely on. Retrieval has to preserve the table structure. Which parser do you choose?

- A. Default parser
- B. LLM-based parser (no image processing)
- C. ✅ **Docling parser**
- D. Skip parsing; index the raw PDF

**Key: C.** Docling preserves tables as structured markdown and (with image processing) captures diagrams; the default parser flattens tables into unreadable text.

**Traces to:** M5 Parsing — "Docling Parser: Preserves tables (as structured markdown), image captions, layout. Best for visual/complex documents." (Default "struggles with complex tables.")

**Help rungs:**
- R1 (axis): "This hinges on one thing: **does the parser preserve table structure**, or flatten it? Which option is built to keep tables intact?"
- R2 (rule out): "Rule out Default — it flattens multi-column tables into a wall of text, and the tables are exactly the content that matters here. Why does that disqualify it?"
- R3 (worked): "The deciding content is tables + diagrams. One parser is specifically documented to keep tables as markdown and caption images. Name it."

---

## Item 2 — Chunking strategy (concept: `chunking`)

**Scenario.** You're indexing **support webchat logs** — back-and-forth between a customer and an agent, with clear speaker turns and no headings. You want each retrievable chunk to hold a coherent exchange. Which chunking strategy fits best?

- A. Section-aware (uses HTML headings)
- B. ✅ **Conversation-based (segments by speaker turn)**
- C. Window-based passage extraction
- D. Prepend field

**Key: B.** Chat logs have speaker turns and no headings; conversation-based segmentation preserves the exchange. Section-aware has no headings to use; prepend is a modifier, not a standalone strategy.

**Traces to:** M6 Chunking — "Conversation-Based: Segments by speaker turn. Ideal for transcripts and chat logs." Also the M6 quiz feedback: section-aware fails because transcripts "rarely have H1/H2 headings," and prepend "is a modifier, not a standalone strategy."

**Help rungs:**
- R1 (axis): "What's the natural **boundary** in this content — a heading, a paragraph, or a change of speaker? Match the strategy to that boundary."
- R2 (rule out): "Rule out Section-aware: these logs have no headings for it to split on. What boundary *does* exist in a chat?"
- R3 (worked): "The content is turns between two speakers. One strategy segments exactly on speaker turns. State it."

---

## Item 3 — Why vector search matched (concept: `vector`)

**Scenario.** A user types **"how do I cancel my subscription"**. Pure vector search returns a chunk that reads **"to end your plan, go to Billing → Manage"** — which contains none of the user's words. Why did it match?

- A. ✅ **The embedding model placed "cancel my subscription" and "end your plan" close together in vector space because they mean the same thing**
- B. The chunk happens to contain the keyword "cancel"
- C. Data Cloud rewrote the query with synonyms before searching
- D. Hybrid keyword matching found the overlap

**Key: A.** Vector search matches *meaning*, not words; semantically similar phrases produce nearby vectors. B is false (no shared keyword). C is false (the embedding captures similarity directly, no rewriting). D is wrong — this is pure vector, not hybrid.

**Traces to:** M7 Vector Search — "Similar meanings produce vectors that are close together… That's semantic search," and the M7 quiz feedback: "Vector search matches meaning, not keywords… no rewriting is needed."

**Help rungs:**
- R1 (axis): "Pure vector search matches on one thing — **meaning or exact words?** Which one lets a no-shared-words chunk still win?"
- R2 (rule out): "Rule out 'query rewriting with synonyms' — the model doesn't rewrite anything. Where does the similarity actually get captured?"
- R3 (worked): "The query and chunk share no words but the same meaning, and this is pure vector. The embedding encodes meaning as position in space. State what that implies."

---

## Item 4 — Fusion ranking choice (concept: `hybrid`)

**Scenario.** Your hybrid index works, but for your domain you've decided **keyword matches on part numbers should count more** than semantic similarity, and you want to set those weights yourself. Which fusion ranking model do you pick?

- A. RRF (Reciprocal Rank Fusion)
- B. ✅ **LFR (Linear Fusion Ranking)**
- C. DFR (Deep Fusion Ranking)
- D. Turn off hybrid; use vector-only

**Key: B.** LFR exposes customizable weights so you can boost keyword vs. vector. RRF is fixed/no-tuning; DFR is a learned neural model (highest accuracy, higher cost, not manual weighting); vector-only drops keyword entirely.

**Traces to:** M8 Hybrid Search — "LFR (Linear Fusion Ranking): Customizable weights. Boost keyword or vector to taste." RRF = "Default. Simple, robust, no tuning." DFR = "A neural model that learns fusion."

**Help rungs:**
- R1 (axis): "The requirement is **setting the weights yourself**. Which fusion model is the one that exposes weights to tune, versus one that's fixed or one that learns them for you?"
- R2 (rule out): "Rule out RRF — it's the fixed, no-tuning default, so it can't honor 'count keyword more.' Which model is explicitly tunable?"
- R3 (worked): "You want manual control of keyword-vs-vector weight. One model is 'customizable weights, boost to taste.' Name it."

---

## Item 5 — When enrichment backfires (concept: `enriched`)

**Scenario.** A team turns on enriched indexing for a **parts-lookup index** where users almost always search by exact part number (e.g. "TX-400-A17"). After launch, retrieval quality is unchanged but cost roughly tripled. What's the best explanation?

- A. Enrichment broke hybrid search
- B. ✅ **Enrichment pays off on natural-language Q&A, not exact-identifier lookup — so they tripled storage + LLM cost for ~no retrieval gain**
- C. The LLM refused to generate metadata for structured data
- D. Part numbers can't be embedded

**Key: B.** Enrichment (plain + metadata + question chunks, ~3x) lifts *natural-language Q&A* retrieval; for exact-identifier lookup, vector/keyword already nails it, so the spend buys nothing. A is false (enrichment composes with hybrid); C/D are false.

**Traces to:** M9 Enriched Indexing — "Skip enrichment when… Users search by exact identifiers (SKUs, part numbers)," and the ~3x chunk/cost math; M9 quiz feedback: "Enrichment shines on natural-language Q&A, not identifier lookup."

**Help rungs:**
- R1 (axis): "Enrichment helps one *kind of query* far more than another. The axis is **natural-language questions vs. exact-identifier lookups** — which kind is this index, and does enrichment help it?"
- R2 (rule out): "Rule out 'it broke hybrid' — enrichment composes cleanly with hybrid. The problem isn't breakage; it's **spend without payoff**. Why no payoff here?"
- R3 (worked): "Users search exact part numbers; vector/keyword already handles that. Enrichment triples cost to help a query type you don't have. State what went wrong."

---

## Item 6 — RAG index vs. Document AI (concept: `docai_vs_index`)

**Scenario.** You have **30,000 vendor contracts** in cloud storage. The business needs to pull each contract's **renewal date and total contract value into fields they can filter, sort, and report on** (e.g. "contracts over $250K renewing this quarter"). What's the right approach?

- A. Build a hybrid search index over the contracts and query it
- B. ✅ **Document AI in Batch mode: define a schema (RenewalDate, TotalValue as typed fields), extract into a DLO, then report/aggregate with SQL**
- C. Enriched indexing so the questions match better
- D. Intelligent Context, then publish as a search index

**Key: B.** The need is *typed, structured fields* for filtering/aggregation/reporting — that's extraction, Document AI's job, not retrieval. A/C/D all produce *passages*, which can't be numerically aggregated ("over $250K"). Batch mode fits the large external-storage volume.

**Traces to:** M11 Document AI — "Document AI… extracts structured fields from documents… into DLOs you can query, report on, and automate against," and the M11 scenario-quiz feedback: "Search indexes return passages, not typed numeric fields. You cannot aggregate… over passages." Batch mode = large volumes from external sources via a UDMO.

**Help rungs:**
- R1 (axis): "The deciding axis is **what shape of output you need — searchable passages, or typed fields you can filter and sum.** Which does 'contracts over $250K renewing this quarter' require?"
- R2 (rule out): "Rule out the search index — it returns passages, and you can't run 'sum/compare > $250K' over a passage. What produces typed numeric fields instead?"
- R3 (worked): "You need renewal date and value as structured, aggregatable fields from 30K docs in storage. One product extracts typed fields into a reportable DLO, in a mode built for large external volumes. Name the product and the mode."

---

## Notes for the full bank (after this batch is vetted)

- Target 12–20 items total; add a second item per module at a *different* difficulty so §8.1 difficulty-matching has range.
- Candidate additional concepts if you want them later: parsing mutual-exclusivity rule (LLM-parse vs LLM-preprocess), chunking token limits for CJK, embedding-model choice for multilingual, Doc AI supported-formats (PDF/PNG/JPEG only).
- Each item will carry: `item_id`, `concept`, `scenario`, `correct_choice`, `rungs` (jsonb), `set_role` (practice/heldout), `difficulty` (filled from pilot) — matching the §12.1 schema.
