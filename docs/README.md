# Learning OS — Assisted Independence (app)

A static, no-build web app for the 100xEngineers capstone. Two tabs:

- **Ask freely** — ask any Process Content question, get an answer, then author-curated *related concepts* to learn next.
- **Learn from path** — practice config/decision questions with *predict-before-decide*, a calibrated *help ladder* (nudge → rule-out → worked), *explain-back*, and a per-concept *independence meter*.

No framework, no build step, no server. All data goes through one data layer (`js/store.js`) that currently mocks the database in `localStorage` using the exact shapes in `../SCHEMA.md`.

## Run locally

ES modules need HTTP (not `file://`). From this `docs/` folder:

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Deploy to GitHub Pages

1. Push this repo to GitHub.
2. Repo → **Settings → Pages**.
3. **Source:** Deploy from a branch. **Branch:** `main`, **Folder:** `/docs`.
4. Save. Your live link appears at `https://<username>.github.io/<repo>/`.

## The "Ask freely" key (pilot)

Tab A calls Google Gemini **from the browser** using a key you paste in ⚙ Settings (stored only in this browser for the pilot; removable). With no key, Tab A shows a setup hint and the rest of the app still works. Get a free key at Google AI Studio.

## Collecting study data

`localStorage` is per-browser, so each tester's data stays on their machine. Use the **Export** button (top bar) — it downloads that tester's events as JSON in the `SCHEMA.md` shape. Collect the files and merge for analysis. This export is also the "JSON workflow" capstone deliverable.

## Connecting the real database later (one flag)

The app never touches a database directly — only `store.js`. To go live:

1. Paste `../SCHEMA.md` SQL into the Supabase SQL editor.
2. Add a `supabaseStore` object in `store.js` with the **same function signatures** as `mockStore`.
3. Set `USE_MOCK = false`.

Nothing in the UI or logic changes. (Note: a server-side key and real auth mean moving the host from GitHub Pages to Vercel at that point — see `../DESIGN.md` §12.)

## Files

| File | Role |
|---|---|
| `index.html` | shell: login gate, tabs, modals |
| `css/styles.css` | all styling (light mode) |
| `js/items.js` | authored question bank (keys vetted against the modules) |
| `js/store.js` | the one data layer (mock now, Supabase later) |
| `js/ask.js` | Tab A answer engine (client-side Gemini; swap for serverless later) |
| `js/app.js` | controller: login, tabs, path flow, logging, export |
