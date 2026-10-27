/* ============================================================
   graph.js — the concept-map layer for "Learn from path".
   Nodes = the real teaching modules (window.MODULES from modules.js).
   Edges = prerequisites: a node unlocks once its prereqs are "done".
   Each node may link to a practice item (window.ITEMS) by concept.

   This is authored (not derived) — the prerequisite order is a
   teaching judgement, traceable to the module sequence in the lab.
   ============================================================ */

/* prerequisite graph over module ids (see modules.js for the ids).
   Kept as a shallow DAG: foundations first, then the pipeline in order,
   then the specialised/mastery modules that depend on the pipeline. */
window.CONCEPT_GRAPH = {
  // --- foundations (no prereqs) ---
  why:        { prereqs: [], tier: 'Foundations' },
  vocab:      { prereqs: ['why'], tier: 'Foundations' },
  journey:    { prereqs: ['vocab'], tier: 'Foundations' },
  quickwin:   { prereqs: ['journey'], tier: 'Foundations' },

  // --- the pipeline, in order; each builds on the last ---
  parsing:    { prereqs: ['journey'], tier: 'Pipeline', item: 'parse-01' },
  chunking:   { prereqs: ['parsing'], tier: 'Pipeline', item: 'chunk-01' },
  vector:     { prereqs: ['chunking'], tier: 'Pipeline', item: 'vector-01' },
  hybrid:     { prereqs: ['vector'], tier: 'Pipeline', item: 'hybrid-01' },
  enriched:   { prereqs: ['hybrid'], tier: 'Pipeline', item: 'enrich-01' },
  retrievers: { prereqs: ['vector'], tier: 'Pipeline' },

  // --- specialised / mastery (depend on the pipeline being understood) ---
  docai:      { prereqs: ['parsing'], tier: 'Specialised', item: 'docai-01' },
  intctx:     { prereqs: ['parsing', 'chunking'], tier: 'Specialised' },
  decisions:  { prereqs: ['hybrid', 'enriched'], tier: 'Mastery' },
  cost:       { prereqs: ['enriched'], tier: 'Mastery' },
  troubleshoot:{ prereqs: ['retrievers', 'hybrid'], tier: 'Mastery' },
  optimize:   { prereqs: ['decisions'], tier: 'Mastery' },
  capstone:   { prereqs: ['decisions', 'docai', 'optimize'], tier: 'Mastery' },
};

window.TIER_ORDER = ['Foundations', 'Pipeline', 'Specialised', 'Mastery'];

/* A node is "done" when its practice item was answered unaided, OR
   (for teaching-only nodes with no item) when it has been opened/read.
   A node is "available" when all prereqs are done. Else "locked". */
window.nodeStatus = function (modId, events, readSet) {
  const g = window.CONCEPT_GRAPH[modId];
  if (!g) return 'available';
  const done = window.nodeDone(modId, events, readSet);
  if (done) return 'done';
  const ready = g.prereqs.every(p => window.nodeDone(p, events, readSet));
  return ready ? 'available' : 'locked';
};

window.nodeDone = function (modId, events, readSet) {
  const g = window.CONCEPT_GRAPH[modId];
  if (!g) return false;
  if (g.item) {
    // done = answered its practice item unaided at least once
    return events.some(e => e.item_id === g.item &&
      e.first_submit_correct && e.hints_opened === 0 && !e.revealed_answer);
  }
  // teaching-only node: done once read
  return readSet.has(modId);
};
