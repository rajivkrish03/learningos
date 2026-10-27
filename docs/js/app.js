/* ============================================================
   app.js — Learning OS controller.
   Login gate (name/code) → two tabs: Ask freely (A) + Learn from path (B).
   Talks ONLY to `store` (store.js). No framework, no build step.
   ============================================================ */
import { store, STUDY_MODE, ARM } from './store.js';
import { askLLM } from './ask.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => (s || '').toString().replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

let USER = null;          // current profile
let currentTab = 'ask';

/* ---------- toast ---------- */
let toastT;
function toast(msg) {
  const t = $('#toast'); t.textContent = msg; t.classList.add('show');
  clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 2200);
}

/* ============================================================
   LOGIN GATE
   ============================================================ */
async function startSession(name) {
  if (!name.trim()) { toast('Enter a name or code'); return; }
  USER = await store.getOrCreateProfile(name.trim());
  localStorage.setItem('learning-os.lastUser', USER.id);
  $('#gate').classList.add('hidden');
  $('#app').classList.remove('hidden');
  $('#whoami').textContent = USER.display_name;
  switchTab(STUDY_MODE ? 'path' : 'ask');
}
$('#startBtn').onclick = () => startSession($('#nameInput').value);
$('#nameInput').addEventListener('keydown', e => { if (e.key === 'Enter') startSession($('#nameInput').value); });

/* In study mode, hide Tab A so learners only see "Learn from path" */
if (STUDY_MODE) {
  const askTab = document.querySelector('.tab[data-tab="ask"]');
  if (askTab) askTab.style.display = 'none';
}

/* resume last session if present */
(async function resume() {
  const last = localStorage.getItem('learning-os.lastUser');
  if (last) {
    const p = await store.getProfile(last);
    if (p) {
      USER = p;
      $('#gate').classList.add('hidden'); $('#app').classList.remove('hidden');
      $('#whoami').textContent = p.display_name;
      switchTab(STUDY_MODE ? 'path' : 'ask');
    }
  }
})();

/* ============================================================
   TAB ROUTING
   ============================================================ */
$$('.tab').forEach(btn => btn.onclick = () => switchTab(btn.dataset.tab));
function switchTab(tab) {
  if (USER && tab !== currentTab) store.saveBehavior(USER.id, 'tab_switch', { to: tab });
  currentTab = tab;
  $$('.tab').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
  if (tab === 'ask') renderAsk();
  else renderPath();
}

/* ============================================================
   TAB A — ASK FREELY
   ============================================================ */
function renderAsk(prefill = '') {
  const stage = $('#stage');
  stage.innerHTML = `
    <div class="card">
      <div class="eyebrow">Ask freely</div>
      <h1 class="title">What do you want to know about Process Content?</h1>
      <p class="muted">Ask anything in your own words. You'll get an answer — then a few related things worth learning next.</p>
      <div class="ask-box">
        <input id="askInput" class="input" placeholder="e.g. how do I read a table inside a PDF?" value="${esc(prefill)}" />
        <button id="askBtn" class="btn btn-primary btn-sm" style="width:auto;margin-top:0">Ask</button>
      </div>
      <div id="answer"></div>
    </div>`;
  $('#askBtn').onclick = () => doAsk($('#askInput').value);
  $('#askInput').addEventListener('keydown', e => { if (e.key === 'Enter') doAsk($('#askInput').value); });
  if (prefill) doAsk(prefill);
}

async function doAsk(q) {
  q = q.trim(); if (!q) return;
  const out = $('#answer');
  out.innerHTML = `<p class="muted"><span class="spinner"></span> Thinking…</p>`;
  store.saveBehavior(USER.id, 'ask_freely_question', { q });

  const keyRow = await store.getKey(USER.id);
  const res = await askLLM(q, keyRow && keyRow.key_value);

  // adjacency: match the question to the nearest authored concept for "Related"
  const related = pickRelated(q);
  out.innerHTML = `
    <div class="answer card" style="box-shadow:none;border:1px solid var(--line)">${res.html}</div>
    ${related.length ? `<div class="related">
      <h4>Others found these useful next · <span class="muted">related concepts</span></h4>
      ${related.map(r => `<button class="related-item" data-concept="${r.concept}">${esc(r.label)} →</button>`).join('')}
    </div>` : ''}`;
  $$('.related-item', out).forEach(b => b.onclick = () => {
    store.saveBehavior(USER.id, 'tab_switch', { to: 'path', via: 'related', concept: b.dataset.concept });
    switchTab('path');
  });
}

/* author-curated adjacency: find items whose keywords match the question,
   return their related_concepts. Keyword match keeps it deterministic (no model). */
function pickRelated(q) {
  const ql = q.toLowerCase();
  const kw = {
    parser: ['pdf', 'table', 'parse', 'docling', 'image', 'diagram', 'ocr'],
    chunking: ['chunk', 'transcript', 'chat', 'split', 'passage', 'token', 'overlap'],
    vector: ['vector', 'semantic', 'embedding', 'meaning', 'similar'],
    hybrid: ['hybrid', 'keyword', 'fusion', 'rrf', 'lfr', 'part number', 'rank'],
    enriched: ['enrich', 'metadata', 'question chunk', 'q&a', 'cost'],
    docai_vs_index: ['extract', 'field', 'invoice', 'contract', 'document ai', 'report', 'aggregate'],
  };
  let best = null, bestScore = 0;
  for (const [concept, words] of Object.entries(kw)) {
    const score = words.reduce((n, w) => n + (ql.includes(w) ? 1 : 0), 0);
    if (score > bestScore) { bestScore = score; best = concept; }
  }
  if (!best) return [];
  const item = (window.ITEMS || []).find(i => i.concept === best);
  return item ? item.related_concepts : [];
}

/* ============================================================
   TAB B — LEARN FROM PATH
   ============================================================ */
let pathState = null;

/* ---- concept map: nodes = real teaching modules, edges = prerequisites ---- */
async function renderPath() {
  const stage = $('#stage');
  const events = await store.getEventsForUser(USER.id);
  const readSet = await store.getReadSet(USER.id);
  const G = window.CONCEPT_GRAPH, MODS = window.MODULES || [];
  const modById = Object.fromEntries(MODS.map(m => [m.id, m]));

  const done = MODS.filter(m => G[m.id] && window.nodeDone(m.id, events, readSet)).length;
  const total = Object.keys(G).length;

  let tiersHtml = '';
  window.TIER_ORDER.forEach(tier => {
    const ids = Object.keys(G).filter(id => G[id].tier === tier);
    if (!ids.length) return;
    tiersHtml += `<div class="tier"><h4 class="tier-h">${tier}</h4><div class="nodes">` +
      ids.map(id => {
        const mod = modById[id]; if (!mod) return '';
        const status = window.nodeStatus(id, events, readSet);
        const hasItem = !!G[id].item;
        const icon = status === 'done' ? '✓' : status === 'locked' ? '🔒' : (hasItem ? '◆' : '▸');
        const sub = G[id].prereqs.length
          ? `needs: ${G[id].prereqs.map(p => (modById[p]||{}).title || p).join(', ')}`
          : 'start here';
        return `<button class="node ${status}" data-mod="${id}" ${status === 'locked' ? 'disabled' : ''}>
          <span class="node-ic">${icon}</span>
          <span class="node-body"><b>${esc(mod.title)}</b><span class="node-sub">${hasItem ? 'teach + practice' : 'teaching'} · ${esc(sub)}</span></span>
        </button>`;
      }).join('') + `</div></div>`;
  });

  stage.innerHTML = `
    <div class="card">
      <div class="eyebrow">Learn from path</div>
      <h1 class="title">Your concept map</h1>
      <p class="muted">Work the map in order. Each concept unlocks the next once you've learned it.
        Diamonds (◆) end in a practice question — answer it <b>unaided</b> to master the concept.</p>
      <div class="pathbar"><div class="pathbar-fill" style="width:${total ? Math.round(done/total*100) : 0}%"></div></div>
      <p class="fine">${done} of ${total} concepts mastered</p>
      ${tiersHtml}
    </div>`;

  $$('.node:not(.locked)', stage).forEach(b => b.onclick = () => openNode(b.dataset.mod));
}

/* ---- open a concept-map node: show its real teaching steps, then practice ---- */
function openNode(modId) {
  const mod = (window.MODULES || []).find(m => m.id === modId);
  if (!mod) return;
  store.saveBehavior(USER.id, 'node_opened', { mod_id: modId });
  renderTeaching(mod, modId);
}

/* render the module's teaching steps (concept/quiz/custom/intro) from the real data.js */
function renderTeaching(mod, modId) {
  const g = window.CONCEPT_GRAPH[modId] || {};
  const stage = $('#stage');
  // reading = every non-quiz step; quizzes now run through the full practice flow
  const readingSteps = (mod.steps || []).filter(s => s.t !== 'quiz');
  const quizSteps = (mod.steps || []).filter(s => s.t === 'quiz');
  const steps = readingSteps.map(stepHTML).join('');

  const hasQuizzes = quizSteps.length > 0;
  const hasItem = !!g.item;
  const label = hasQuizzes ? `Practise this concept (${quizSteps.length}) →`
    : hasItem ? 'Continue to practice →' : 'Mark as learned →';

  stage.innerHTML = `
    <div class="card">
      <button class="btn btn-ghost btn-sm" id="backMap">← Concept map</button>
      <div class="eyebrow" style="margin-top:8px">${esc(mod.title)}</div>
      <div class="teaching">${steps}</div>
      <button id="teachDone" class="btn btn-primary btn-sm" style="width:auto;margin-top:8px">${label}</button>
    </div>`;
  $('#backMap').onclick = () => renderPath();
  $('#teachDone').onclick = async () => {
    await store.markRead(USER.id, modId);
    // build a queue: the module's own quizzes (converted to practice items), then its pre-authored item
    const queue = quizSteps.map((q, i) => quizToItem(q, modId, i));
    if (g.item) {
      const it = (window.ITEMS || []).find(i => i.item_id === g.item);
      if (it) queue.push(it);
    }
    if (queue.length) { runItemQueue(queue, modId); }
    else { renderPath(); }
  };
}

/* convert a teaching quiz step into the practice-item shape, with nudge rungs
   derived from the quiz's OWN feedback text (real, content-grounded — not faked). */
function quizToItem(step, modId, idx) {
  const opts = (step.options || []).map((o, i) => ({ key: String.fromCharCode(65 + i), label: o.label, _correct: !!o.correct, _fb: o.fb || '' }));
  const correct = opts.find(o => o._correct) || opts[0];
  const wrong = opts.filter(o => !o._correct && o._fb);
  return {
    item_id: `${modId}-q${idx + 1}`,
    concept: modId,
    scenario: (step.prompt || '') + (step.scn ? ` — ${step.scn}` : ''),
    options: opts.map(o => ({ key: o.key, label: o.label })),
    correct_choice: correct.key,
    rungs: {
      r1_axis: 'Re-read the question and commit to the distinction it turns on before looking at the options again.',
      r2_ruleout: wrong.length ? `Rule one out: ${wrong[0]._fb}` : 'Eliminate the option that contradicts what you just read.',
      r3_worked: correct._fb || `The answer is "${correct.label}". State why in your own words.`,
    },
  };
}

/* run a list of items one after another, returning to the map at the end */
let itemQueue = [], itemQueueMod = null;
function runItemQueue(queue, modId) {
  itemQueue = queue.slice(); itemQueueMod = modId;
  nextInQueue();
}
function nextInQueue() {
  if (!itemQueue.length) { renderPath(); return; }
  const item = itemQueue.shift();
  openItem(item, itemQueueMod);
}

/* convert one teaching step to safe HTML. Teaching copy is authored (trusted),
   so we render its rich text; quiz options become clickable self-checks. */
function stepHTML(step) {
  const t = step.t;
  if (t === 'intro') {
    return `<section class="t-step"><h2 class="t-title">${(step.title||'').replace(/\n/g,'<br>')}</h2>
      ${step.subtitle?`<p class="t-sub">${step.subtitle}</p>`:''}${step.body?`<div class="t-body">${step.body}</div>`:''}</section>`;
  }
  if (t === 'quiz') {
    const opts = (step.options||[]).map(o =>
      `<button class="t-opt" data-correct="${o.correct?1:0}" data-fb="${esc(o.fb||'')}">${esc(o.label)}</button>`).join('');
    return `<section class="t-step t-quiz">
      <div class="t-eyebrow">${step.eyebrow||'Quick check'}</div>
      <p class="t-q">${step.prompt||''}</p>${step.scn?`<p class="t-sub">${step.scn}</p>`:''}
      <div class="t-opts">${opts}</div><div class="t-fb hidden"></div></section>`;
  }
  // concept / custom / er / demo — render the authored body + any ask/art
  return `<section class="t-step">
    ${step.eyebrow?`<div class="t-eyebrow">${step.eyebrow}</div>`:''}
    ${step.title?`<h2 class="t-title">${step.title}</h2>`:''}
    ${step.subtitle?`<p class="t-sub">${step.subtitle}</p>`:''}
    ${step.ask?`<div class="t-ask"><b>Pause &amp; think:</b> ${step.ask}</div>`:''}
    ${step.body?`<div class="t-body">${step.body}</div>`:''}
    ${step.html?`<div class="t-custom">${step.html}</div>`:''}</section>`;
}

function openItem(item, fromMod = null) {
  pathState = {
    item, fromMod, startedAt: Date.now(), hintsOpened: 0, revealed: false,
    committed: false, firstSubmitDone: false, firstSubmitCorrect: null,
  };
  store.saveBehavior(USER.id, 'path_item_started', { item_id: item.item_id });
  renderItem();
}

function renderItem() {
  const { item } = pathState;
  const stage = $('#stage');

  /* Arm B (study baseline): skip predict step, show MCQ directly */
  if (STUDY_MODE && ARM === 'B') {
    stage.innerHTML = `
      <div class="card">
        <button class="btn btn-ghost btn-sm" id="backBtn">← Concept map</button>
        <div class="eyebrow" style="margin-top:8px">${window.CONCEPT_LABELS[item.concept] || item.concept}</div>
        <h2 class="q">${esc(item.scenario)}</h2>
        <div class="options" id="opts"></div>
        <div id="itemFeedback"></div>
      </div>`;
    $('#backBtn').onclick = () => { itemQueue = []; renderPath(); };
    pathState.committed = true;  // no predict step for baseline
    renderOptions();
    return;
  }

  /* Arm A / product mode: full predict-before-decide + help ladder */
  stage.innerHTML = `
    <div class="card">
      <button class="btn btn-ghost btn-sm" id="backBtn">← Concept map</button>
      <div class="eyebrow" style="margin-top:8px">${window.CONCEPT_LABELS[item.concept] || item.concept}</div>
      <h2 class="q">${esc(item.scenario)}</h2>

      <div class="predict" id="predictBox">
        <label>Before you choose — how confident are you, and why?</label>
        <div class="slider-row">
          <span class="fine">not sure</span>
          <input type="range" id="conf" min="0" max="100" value="50" />
          <span class="fine">certain</span>
          <span class="conf-val" id="confVal">50</span>
        </div>
        <input id="reason" class="input" placeholder="one line: why do you lean that way?" />
        <button id="commitBtn" class="btn btn-primary btn-sm" style="width:auto">Commit & see options</button>
      </div>

      <div id="afterCommit" class="hidden">
        <div class="options" id="opts"></div>
        <details class="help" id="help">
          <summary>Need a nudge?</summary>
          <div id="rungs"></div>
        </details>
        <div id="itemFeedback"></div>
      </div>
    </div>`;

  $('#backBtn').onclick = () => { itemQueue = []; renderPath(); };
  $('#conf').oninput = e => $('#confVal').textContent = e.target.value;
  $('#commitBtn').onclick = commitPredict;
}

function commitPredict() {
  pathState.committed = true;
  pathState.preConfidence = +$('#conf').value;
  pathState.preReason = $('#reason').value;
  $('#predictBox').classList.add('hidden');
  $('#afterCommit').classList.remove('hidden');
  renderOptions();
  renderRungs();
}

function renderOptions() {
  const { item } = pathState;
  const opts = $('#opts'); opts.innerHTML = '';
  item.options.forEach(o => {
    const b = document.createElement('button');
    b.className = 'opt'; b.dataset.key = o.key;
    b.innerHTML = `<span class="k">${o.key}</span><span>${esc(o.label)}</span>`;
    b.onclick = () => submitAnswer(o.key, b);
    opts.appendChild(b);
  });
}

function renderRungs() {
  const { item } = pathState;
  const r = item.rungs;
  const rungs = $('#rungs');
  const ladder = [
    { k: 'Nudge 1 — the deciding axis', t: r.r1_axis },
    { k: 'Nudge 2 — rule one out', t: r.r2_ruleout },
    { k: 'Nudge 3 — walk it through', t: r.r3_worked },
  ];
  rungs.innerHTML = ladder.map((x, i) =>
    `<button class="btn btn-ghost btn-sm" data-rung="${i}" style="display:block;margin:6px 0">Show ${x.k.split('—')[0].trim()}</button>
     <div class="rung hidden" data-rungbody="${i}"><span class="rk">${esc(x.k)}</span>${esc(x.t)}</div>`
  ).join('') +
    `<button class="btn btn-ghost btn-sm" id="revealBtn" style="display:block;margin:10px 0 0;color:var(--bad)">Just show me the answer (won't count as unaided)</button>`;

  $$('[data-rung]', rungs).forEach(b => b.onclick = () => {
    const i = b.dataset.rung;
    const body = rungs.querySelector(`[data-rungbody="${i}"]`);
    if (body.classList.contains('hidden')) {
      body.classList.remove('hidden'); b.classList.add('hidden');
      pathState.hintsOpened++;
      store.saveBehavior(USER.id, 'hint_opened', { item_id: pathState.item.item_id, rung: +i + 1 });
    }
  });
  $('#revealBtn', rungs).onclick = () => {
    pathState.revealed = true;
    const correct = pathState.item.correct_choice;
    toast(`Answer: ${correct}. Try to say why.`);
    $$('#opts .opt').forEach(o => { if (o.dataset.key === correct) o.classList.add('correct'); });
  };
}

async function submitAnswer(key, btn) {
  if (pathState.locked) return;
  const { item } = pathState;
  const correct = key === item.correct_choice;

  if (!pathState.firstSubmitDone) {
    pathState.firstSubmitDone = true;
    pathState.firstSubmitCorrect = correct;
  }

  /* Arm B (baseline): lock immediately after any submit and reveal the correct answer */
  if (STUDY_MODE && ARM === 'B') {
    pathState.locked = true;
    btn.classList.add(correct ? 'correct' : 'wrong');
    $$('#opts .opt').forEach(o => {
      o.classList.add('locked'); o.onclick = null;
      if (o.dataset.key === item.correct_choice) o.classList.add('correct');
    });
    showFeedbackAndExplain(correct);
    return;
  }

  /* Arm A / product mode: withholding — wrong means try again with a nudge */
  if (correct) {
    pathState.locked = true;
    btn.classList.add('correct');
    $$('#opts .opt').forEach(o => { o.classList.add('locked'); o.onclick = null; });
    showFeedbackAndExplain(true);
  } else {
    btn.classList.add('wrong');
    $('#itemFeedback').innerHTML = `<div class="feedback bad">Not quite. Open a nudge, or try another option.</div>`;
  }
}

function showFeedbackAndExplain(good) {
  const { item } = pathState;
  const unaided = pathState.firstSubmitCorrect && pathState.hintsOpened === 0 && !pathState.revealed;
  $('#itemFeedback').innerHTML = `
    <div class="feedback good">Correct — ${esc(item.options.find(o => o.key === item.correct_choice).label)}.
      ${unaided ? ' You got this <b>unaided</b> — that counts toward your independence meter.' : ' (You used help on this one.)'}</div>
    <div class="explain">
      <label class="label">In one line, why is this the right choice?</label>
      <textarea id="explainBack" placeholder="your reasoning…"></textarea>
      <button id="finishBtn" class="btn btn-primary btn-sm" style="width:auto">Save & continue</button>
    </div>`;
  $('#finishBtn').onclick = finishItem;
}

async function finishItem() {
  const { item } = pathState;
  await store.saveEvent({
    user_id: USER.id,
    item_id: item.item_id,
    concept: item.concept,
    condition: USER.condition_order || 'treatment',
    pre_confidence: pathState.preConfidence,
    pre_reason: pathState.preReason,
    hints_opened: pathState.hintsOpened,
    revealed_answer: pathState.revealed,
    first_submit_correct: pathState.firstSubmitCorrect,
    explain_back: ($('#explainBack') && $('#explainBack').value) || '',
    time_to_first_submit: Date.now() - pathState.startedAt,
  });
  await store.saveBehavior(USER.id, 'path_item_completed', { item_id: item.item_id });
  toast('Saved');
  // if we're working through a module's queue of quizzes/practice, go to the next one
  if (itemQueue.length) { nextInQueue(); }
  else { renderPath(); }
}

/* ============================================================
   SETTINGS (BYO key) + EXPORT
   ============================================================ */
$('#settingsBtn').onclick = async () => {
  $('#settings').classList.remove('hidden');
  const k = await store.getKey(USER.id);
  $('#keyStatus').textContent = k ? 'A key is saved in this browser.' : 'No key saved — Ask freely will show a setup hint.';
  $('#keyInput').value = '';
};
$('#closeSettingsBtn').onclick = () => $('#settings').classList.add('hidden');
$('#saveKeyBtn').onclick = async () => {
  const v = $('#keyInput').value.trim(); if (!v) { toast('Paste a key first'); return; }
  await store.saveKey(USER.id, 'gemini', v);
  $('#keyStatus').textContent = 'Key saved.'; toast('Key saved');
};
$('#deleteKeyBtn').onclick = async () => {
  await store.deleteKey(USER.id);
  $('#keyStatus').textContent = 'Key removed.'; toast('Key removed');
};

$('#exportBtn').onclick = async () => {
  const data = await store.exportJSON(USER.id);
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `learning-os-${USER.display_name}-${Date.now()}.json`;
  document.body.appendChild(a); a.click(); a.remove();
  toast('Results downloaded');
};
