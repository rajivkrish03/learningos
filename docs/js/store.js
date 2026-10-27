/* ============================================================
   store.js — the ONE data-access layer for Learning OS.
   The whole app talks only to `store`. Swap the implementation
   to Supabase later by flipping USE_MOCK and providing supabaseStore
   with the SAME function signatures. Nothing else changes.

   Mock implementation mirrors SCHEMA.md exactly:
     profiles, api_keys, items, events, behavior_events, module_chunks
   stored under one localStorage key as JSON tables.
   ============================================================ */

const USE_MOCK = true;              // flip to false when Supabase is wired
const LS_KEY = 'learning-os.v1';

/* ============================================================
   STUDY MODE — two lines to change between deploys.

   STUDY_MODE: false  → full product (two tabs, predict step, all features)
   STUDY_MODE: true   → stripped-down experiment arm (Tab A hidden,
                        practice items only, ARM governs help policy)

   ARM: 'A'  → withholding arm   (predict step + help ladder, answer NOT given)
   ARM: 'B'  → baseline arm      (MCQ only, correct answer shown immediately)

   ── Arm A deploy (treatment): STUDY_MODE = true,  ARM = 'A'  ← current
   ── Arm B deploy (baseline):  STUDY_MODE = true,  ARM = 'B'  ← change ARM only
   ── Product / demo:           STUDY_MODE = false, ARM = 'A'  ← flip STUDY_MODE only

   Each arm is a separate GitHub Pages deploy (separate branch or repo).
   The only line that differs between Arm A and Arm B is ARM below.
   ============================================================ */
export const STUDY_MODE = true;     // false = full product/demo mode
export const ARM = 'A';             // 'A' = withholding (treatment), 'B' = baseline

/* ---------- low-level localStorage "database" ---------- */
function _db() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) { /* ignore */ }
  return { profiles: [], api_keys: [], events: [], behavior_events: [], read_nodes: [] };
}
function _save(db) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(db)); } catch (e) { /* ignore */ }
}
function _uuid() {
  if (crypto && crypto.randomUUID) return crypto.randomUUID();
  return 'id-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8);
}
function _now() { return new Date().toISOString(); }

/* ============================================================
   MOCK STORE — same API a Supabase store would expose.
   ============================================================ */
const mockStore = {
  /* ----- profiles (name/code login) ----- */
  async getOrCreateProfile(displayName, conditionOrder = 'treatment', isTester = false) {
    const db = _db();
    let p = db.profiles.find(x => x.display_name === displayName);
    if (!p) {
      p = {
        id: _uuid(),
        display_name: displayName,
        condition_order: conditionOrder,
        is_tester: isTester,
        created_at: _now(),
      };
      db.profiles.push(p);
      _save(db);
    }
    return p;
  },

  async getProfile(userId) {
    return _db().profiles.find(x => x.id === userId) || null;
  },

  /* ----- api_keys (BYO key; pilot: plain text in localStorage) ----- */
  async saveKey(userId, provider, keyValue) {
    const db = _db();
    const existing = db.api_keys.find(k => k.user_id === userId);
    if (existing) { existing.provider = provider; existing.key_value = keyValue; }
    else db.api_keys.push({ user_id: userId, provider, key_value: keyValue, created_at: _now() });
    _save(db);
  },
  async getKey(userId) {
    return _db().api_keys.find(k => k.user_id === userId) || null;
  },
  async deleteKey(userId) {
    const db = _db();
    db.api_keys = db.api_keys.filter(k => k.user_id !== userId);
    _save(db);
  },

  /* ----- items (read-only content; source is items.js) ----- */
  async getItems() {
    return (window.ITEMS || []).slice();
  },
  async getItem(itemId) {
    return (window.ITEMS || []).find(i => i.item_id === itemId) || null;
  },

  /* ----- events (the core theory signal) ----- */
  async saveEvent(ev) {
    const db = _db();
    db.events.push({
      id: db.events.length + 1,
      user_id: ev.user_id,
      item_id: ev.item_id,
      concept: ev.concept,
      condition: ev.condition || 'treatment',
      pre_confidence: ev.pre_confidence ?? null,
      pre_reason: ev.pre_reason ?? '',
      hints_opened: ev.hints_opened ?? 0,
      revealed_answer: ev.revealed_answer ?? false,
      first_submit_correct: ev.first_submit_correct ?? null,
      explain_back: ev.explain_back ?? '',
      time_to_first_submit: ev.time_to_first_submit ?? null,
      created_at: _now(),
    });
    _save(db);
  },
  async getEventsForUser(userId) {
    return _db().events.filter(e => e.user_id === userId);
  },

  /* ----- behavior_events (two-tab engagement) ----- */
  async saveBehavior(userId, kind, payload = {}) {
    const db = _db();
    db.behavior_events.push({
      id: db.behavior_events.length + 1,
      user_id: userId, kind, payload, created_at: _now(),
    });
    _save(db);
  },

  /* ----- export (data collection + JSON-workflow deliverable) ----- */
  async exportJSON(userId) {
    const db = _db();
    return {
      exported_at: _now(),
      profile: db.profiles.find(p => p.id === userId) || null,
      events: db.events.filter(e => e.user_id === userId),
      behavior_events: db.behavior_events.filter(b => b.user_id === userId),
      read_nodes: (db.read_nodes || []).filter(r => r.user_id === userId),
    };
  },

  /* ----- read_nodes (teaching-only concept-map nodes marked read) ----- */
  async markRead(userId, modId) {
    const db = _db();
    db.read_nodes = db.read_nodes || [];
    if (!db.read_nodes.some(r => r.user_id === userId && r.mod_id === modId)) {
      db.read_nodes.push({ user_id: userId, mod_id: modId, created_at: _now() });
      _save(db);
    }
  },
  async getReadSet(userId) {
    const db = _db();
    return new Set((db.read_nodes || []).filter(r => r.user_id === userId).map(r => r.mod_id));
  },

  async resetAll() { _save({ profiles: [], api_keys: [], events: [], behavior_events: [], read_nodes: [] }); },
};

/* ============================================================
   Supabase store would go here (same signatures). Left as a stub
   so the switch is literally one line when infra is added:

   const supabaseStore = { getOrCreateProfile(){...}, saveEvent(){...}, ... };
   ============================================================ */
const supabaseStore = null; // TODO when USE_MOCK = false

export const store = USE_MOCK ? mockStore : supabaseStore;
