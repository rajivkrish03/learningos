/* ============================================================
   ask.js — Tab A answer engine.
   Pilot (static GitHub Pages, no server): call Gemini directly from
   the browser using the user's BYO key. If no key, degrade gracefully
   with a helpful message so the app still works for a demo.

   Later (Vercel): replace the fetch with a call to a serverless
   function that holds the key server-side and does real RAG retrieval
   over module_chunks. Same return shape {html}, so app.js is untouched.
   ============================================================ */

const GEMINI_URL = model =>
  `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

const SYSTEM = `You are a concise tutor for "Process Content in Data Cloud" (Salesforce unstructured-data / RAG).
Answer the user's question directly and practically in 3-6 sentences. Prefer plain language.
If the question is outside Process Content, say so briefly. Do not invent product names or numbers you are unsure of.`;

function fmt(text) {
  // minimal, safe formatting: escape, then bold **x** and line breaks
  const esc = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return esc.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br>');
}

export async function askLLM(question, apiKey) {
  if (!apiKey) {
    return {
      html: `<b>No API key set yet.</b><br>Add a Google Gemini key in ⚙ Settings to get live answers here.
      <br><br>In the meantime, head to <b>Learn from path</b> to practice — that tab needs no key.
      <br><br><span class="muted">(For the pilot the key is stored only in this browser. On the hosted version a key can be pre-filled so testers skip this step.)</span>`,
      noKey: true,
    };
  }
  try {
    const model = 'gemini-1.5-flash';
    const resp = await fetch(`${GEMINI_URL(model)}?key=${encodeURIComponent(apiKey)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM }] },
        contents: [{ role: 'user', parts: [{ text: question }] }],
        generationConfig: { temperature: 0.3, maxOutputTokens: 500 },
      }),
    });
    if (!resp.ok) {
      const t = await resp.text();
      return { html: `<b>Couldn't reach the model.</b><br><span class="muted">${resp.status}: ${fmt(t.slice(0, 200))}</span><br>Check your key in ⚙ Settings.` };
    }
    const data = await resp.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '(no answer returned)';
    return { html: fmt(text) };
  } catch (e) {
    return { html: `<b>Network error.</b> <span class="muted">${fmt(String(e.message || e))}</span>` };
  }
}
