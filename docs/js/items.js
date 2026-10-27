/* ============================================================
   items.js — the authored question bank (mirrors items table).
   Keys VETTED by the author against the Process Content modules.
   Each item.rungs: r1_axis (names the deciding axis, NOT the answer),
   r2_ruleout (eliminates one wrong option with a reason),
   r3_worked (walks reasoning to the answer, learner states it).
   related_concepts: author-curated adjacency (Tab A "Related").
   ============================================================ */

window.ITEMS = [
  {
    item_id: 'parse-01', concept: 'parser', set_role: 'practice', difficulty: null,
    traces_to: 'M5 Parsing — Docling preserves tables as structured markdown; Default flattens them.',
    scenario: "You're indexing equipment maintenance PDFs. Most pages are prose, but the critical content is in multi-column spec tables and a few wiring diagrams. Retrieval must preserve the table structure. Which parser do you choose?",
    options: [
      { key: 'A', label: 'Default parser' },
      { key: 'B', label: 'LLM-based parser (no image processing)' },
      { key: 'C', label: 'Docling parser' },
      { key: 'D', label: 'Skip parsing; index the raw PDF' },
    ],
    correct_choice: 'C',
    rungs: {
      r1_axis: "This hinges on one thing: does the parser preserve table structure, or flatten it? Which option is built to keep tables intact?",
      r2_ruleout: "Rule out Default — it flattens multi-column tables into a wall of text, and the tables are exactly the content that matters here. Why does that disqualify it?",
      r3_worked: "The deciding content is tables + diagrams. One parser is documented to keep tables as markdown and caption images. Name it.",
    },
    related_concepts: [
      { concept: 'parser', label: 'Processing images & diagrams in a PDF (Docling image processing)' },
      { concept: 'chunking', label: 'How parsed tables get chunked without breaking rows' },
    ],
  },
  {
    item_id: 'chunk-01', concept: 'chunking', set_role: 'practice', difficulty: null,
    traces_to: 'M6 Chunking — Conversation-based segments by speaker turn; ideal for transcripts/chat logs.',
    scenario: "You're indexing support webchat logs — back-and-forth between a customer and an agent, with clear speaker turns and no headings. You want each chunk to hold a coherent exchange. Which chunking strategy fits best?",
    options: [
      { key: 'A', label: 'Section-aware (uses HTML headings)' },
      { key: 'B', label: 'Conversation-based (segments by speaker turn)' },
      { key: 'C', label: 'Window-based passage extraction' },
      { key: 'D', label: 'Prepend field' },
    ],
    correct_choice: 'B',
    rungs: {
      r1_axis: "What's the natural boundary in this content — a heading, a paragraph, or a change of speaker? Match the strategy to that boundary.",
      r2_ruleout: "Rule out Section-aware: these logs have no headings for it to split on. What boundary does exist in a chat?",
      r3_worked: "The content is turns between two speakers. One strategy segments exactly on speaker turns. State it.",
    },
    related_concepts: [
      { concept: 'chunking', label: 'Token limits & overlap for long transcripts' },
      { concept: 'vector', label: 'Why transcripts often use vector-only search' },
    ],
  },
  {
    item_id: 'vector-01', concept: 'vector', set_role: 'practice', difficulty: null,
    traces_to: 'M7 Vector — semantic match; similar meanings land near each other, no keyword/rewrite needed.',
    scenario: 'A user types "how do I cancel my subscription". Pure vector search returns a chunk reading "to end your plan, go to Billing → Manage" — which shares none of the user\'s words. Why did it match?',
    options: [
      { key: 'A', label: 'The embedding model placed "cancel my subscription" and "end your plan" near each other because they mean the same thing' },
      { key: 'B', label: 'The chunk happens to contain the keyword "cancel"' },
      { key: 'C', label: 'Data Cloud rewrote the query with synonyms before searching' },
      { key: 'D', label: 'Hybrid keyword matching found the overlap' },
    ],
    correct_choice: 'A',
    rungs: {
      r1_axis: "Pure vector search matches on one thing — meaning or exact words? Which one lets a no-shared-words chunk still win?",
      r2_ruleout: "Rule out 'query rewriting with synonyms' — the model doesn't rewrite anything. Where does the similarity actually get captured?",
      r3_worked: "The query and chunk share no words but the same meaning, and this is pure vector. The embedding encodes meaning as position in space. State what that implies.",
    },
    related_concepts: [
      { concept: 'hybrid', label: 'When you also need exact keyword matches (hybrid search)' },
      { concept: 'vector', label: 'Choosing an embedding model for your languages' },
    ],
  },
  {
    item_id: 'hybrid-01', concept: 'hybrid', set_role: 'heldout', difficulty: null,
    traces_to: 'M8 Hybrid — LFR exposes customizable weights; RRF fixed; DFR learned.',
    scenario: "Your hybrid index works, but for your domain you've decided keyword matches on part numbers should count more than semantic similarity, and you want to set those weights yourself. Which fusion ranking model do you pick?",
    options: [
      { key: 'A', label: 'RRF (Reciprocal Rank Fusion)' },
      { key: 'B', label: 'LFR (Linear Fusion Ranking)' },
      { key: 'C', label: 'DFR (Deep Fusion Ranking)' },
      { key: 'D', label: 'Turn off hybrid; use vector-only' },
    ],
    correct_choice: 'B',
    rungs: {
      r1_axis: "The requirement is setting the weights yourself. Which fusion model exposes weights to tune, versus one that's fixed or one that learns them for you?",
      r2_ruleout: "Rule out RRF — it's the fixed, no-tuning default, so it can't honor 'count keyword more.' Which model is explicitly tunable?",
      r3_worked: "You want manual control of keyword-vs-vector weight. One model is 'customizable weights, boost to taste.' Name it.",
    },
    related_concepts: [
      { concept: 'hybrid', label: 'Ranking factors: recency & popularity boosts' },
      { concept: 'vector', label: 'Why hybrid beats vector-only for part numbers' },
    ],
  },
  {
    item_id: 'enrich-01', concept: 'enriched', set_role: 'heldout', difficulty: null,
    traces_to: 'M9 Enriched — pays off on NL Q&A, not exact-identifier lookup; ~3x cost.',
    scenario: 'A team turns on enriched indexing for a parts-lookup index where users almost always search by exact part number (e.g. "TX-400-A17"). After launch, retrieval quality is unchanged but cost roughly tripled. Best explanation?',
    options: [
      { key: 'A', label: 'Enrichment broke hybrid search' },
      { key: 'B', label: 'Enrichment pays off on natural-language Q&A, not exact-identifier lookup — so they tripled cost for ~no gain' },
      { key: 'C', label: 'The LLM refused to generate metadata for structured data' },
      { key: 'D', label: "Part numbers can't be embedded" },
    ],
    correct_choice: 'B',
    rungs: {
      r1_axis: "Enrichment helps one kind of query far more than another. The axis is natural-language questions vs. exact-identifier lookups — which kind is this index, and does enrichment help it?",
      r2_ruleout: "Rule out 'it broke hybrid' — enrichment composes cleanly with hybrid. The problem isn't breakage; it's spend without payoff. Why no payoff here?",
      r3_worked: "Users search exact part numbers; vector/keyword already handles that. Enrichment triples cost to help a query type you don't have. State what went wrong.",
    },
    related_concepts: [
      { concept: 'enriched', label: 'When enrichment IS worth it (Q&A knowledge bases)' },
      { concept: 'hybrid', label: 'Cheaper ways to lift retrieval before enriching' },
    ],
  },
  {
    item_id: 'docai-01', concept: 'docai_vs_index', set_role: 'heldout', difficulty: null,
    traces_to: 'M11 Doc AI — extraction into typed fields/DLOs for filter/aggregate; indexes return passages.',
    scenario: 'You have 30,000 vendor contracts in cloud storage. The business needs each contract\'s renewal date and total value as fields they can filter, sort, and report on ("contracts over $250K renewing this quarter"). What\'s the right approach?',
    options: [
      { key: 'A', label: 'Build a hybrid search index over the contracts and query it' },
      { key: 'B', label: 'Document AI Batch mode: schema with typed fields → extract to a DLO → report/aggregate with SQL' },
      { key: 'C', label: 'Enriched indexing so the questions match better' },
      { key: 'D', label: 'Intelligent Context, then publish as a search index' },
    ],
    correct_choice: 'B',
    rungs: {
      r1_axis: "The deciding axis is what shape of output you need — searchable passages, or typed fields you can filter and sum. Which does 'contracts over $250K renewing this quarter' require?",
      r2_ruleout: "Rule out the search index — it returns passages, and you can't run 'sum/compare > $250K' over a passage. What produces typed numeric fields instead?",
      r3_worked: "You need renewal date and value as structured, aggregatable fields from 30K docs in storage. One product extracts typed fields into a reportable DLO, in a mode built for large external volumes. Name the product and the mode.",
    },
    related_concepts: [
      { concept: 'docai_vs_index', label: 'Doc AI supported formats (PDF/PNG/JPEG only)' },
      { concept: 'docai_vs_index', label: 'Real-time vs. Batch mode (when a UDMO is required)' },
    ],
  },
];

window.CONCEPT_LABELS = {
  parser: 'Parsing', chunking: 'Chunking', vector: 'Vector Search',
  hybrid: 'Hybrid Search', enriched: 'Enriched Indexing', docai_vs_index: 'Document AI vs. Index',
};
