# Learning OS — Database Schema (build-ready)

> Supabase / Postgres. Six tables. Paste the SQL at the bottom into the Supabase **SQL Editor** once.
> Source of truth for the *why* is `DESIGN.md` §12.1; this file is the buildable version.
> Enable the vector extension first (one line, in the SQL block).
>
> **MVP note (no infra yet):** per `DESIGN.md` §12.3, the first shippable version has no live DB — a mock `store.js` holds this exact shape in `localStorage`. **These table/column definitions are the contract the mock honors**, so going live later is: paste this SQL into Supabase, point `store.js` at the Supabase client, flip `USE_MOCK = false`. Treat the shapes below as authoritative whether the data lives in the browser or Postgres.

---

## Table overview

| Table | Job | One row = |
|---|---|---|
| `profiles` | User management / login | one learner |
| `api_keys` | BYO generation key (pilot storage) | one learner's key |
| `items` | Authored question bank | one decision question |
| `events` | Progression + the core theory signal | one attempt at one item |
| `behavior_events` | Two-tab engagement (continuation story) | one UI action |
| `module_chunks` | RAG retrieval store (Tab A answers) | one embedded passage from the 17 modules |

---

## 1. `profiles` — the learner

| Column | Type | Notes |
|---|---|---|
| `id` | uuid | **PK**, generated. The id everything joins on. |
| `display_name` | text | Name or study code from the login screen. |
| `condition_order` | text | treatment / baseline, and which concepts in which condition (counterbalancing). Makes the §8 comparison valid. |
| `is_tester` | bool | Exclude team/pilot rows from final analysis. Default false. |
| `created_at` | timestamptz | Default now(). |

## 2. `api_keys` — BYO key (pilot storage, see DESIGN §12.2)

| Column | Type | Notes |
|---|---|---|
| `user_id` | uuid | **PK / FK → profiles.id**. One row per user. |
| `provider` | text | e.g. 'gemini'. |
| `key_value` | text | **Plain text for pilot.** RLS-protected; user-deletable. Harden later (Supabase Vault). |
| `created_at` | timestamptz | Default now(). |

> **RLS is the real safeguard** — policy below restricts every row to its owner. Never store a key in any other table.

## 3. `items` — the question bank (you author + vet)

| Column | Type | Notes |
|---|---|---|
| `item_id` | text | **PK**. e.g. 'parse-01'. |
| `concept` | text | parser / chunking / vector / hybrid / enriched / docai_vs_index. |
| `scenario` | text | The question prompt. |
| `options` | jsonb | The answer choices. |
| `correct_choice` | text | The deterministic key (what the scorer compares against). |
| `rungs` | jsonb | Pre-authored help ladder: {r1_axis, r2_ruleout, r3_worked}. |
| `related_concepts` | jsonb | Author-curated adjacency map (the "Related concepts" shown in Tab A). |
| `traces_to` | text | Module/rule the key derives from (anti-slop traceability). |
| `difficulty` | numeric | Observed unaided-correct rate from the §8.1 pilot. Null until piloted. |
| `set_role` | text | practice / heldout. |

## 4. `events` — progression + core theory signal (the proof table)

| Column | Type | Notes |
|---|---|---|
| `id` | bigint | **PK**, generated. |
| `user_id` | uuid | **FK → profiles.id**. |
| `item_id` | text | **FK → items.item_id**. |
| `concept` | text | Denormalized for easy grouping. |
| `condition` | text | treatment / baseline / removal_test. |
| `pre_confidence` | int | 0–100, predict-before-decide (§2.2). |
| `pre_reason` | text | The learner's one-line reasoning, pre-answer. |
| `hints_opened` | int | Count of rungs opened. |
| `revealed_answer` | bool | Did they take the full answer / override? |
| `first_submit_correct` | bool | **Core "unaided correct" input** (with hints_opened=0 & !revealed). |
| `explain_back` | text | Self-explanation after answering (§2.3). |
| `time_to_first_submit` | int | Milliseconds. |
| `created_at` | timestamptz | Default now(). |

## 5. `behavior_events` — two-tab engagement (continuation story)

| Column | Type | Notes |
|---|---|---|
| `id` | bigint | **PK**, generated. |
| `user_id` | uuid | **FK → profiles.id**. |
| `kind` | text | tab_switch / ask_freely_question / path_item_started / path_item_completed. |
| `payload` | jsonb | Question text, which tab, which concept, etc. |
| `created_at` | timestamptz | Default now(). |

> Reliance ratio = count(ask_freely_question) ÷ count(path_item_completed), derived from this table.

## 6. `module_chunks` — RAG retrieval store (Tab A)

| Column | Type | Notes |
|---|---|---|
| `id` | bigint | **PK**, generated. |
| `module` | text | Which of the 17 modules (e.g. 'M6-chunking'). |
| `chunk_text` | text | The passage the LLM answers from. |
| `embedding` | vector(384) | MiniLM = 384 dims. **Change if you swap the embedding model** (bge-base = 768). |
| `created_at` | timestamptz | Default now(). |

> Populated once at build time (chunk + embed the modules). Retrieval = nearest-vector query at question time.

---

## Which columns test the theory

| Theory question | Columns that answer it |
|---|---|
| Does metered help beat a chatbot on retention? (brief's headline) | `events.first_submit_correct` where `condition='removal_test'`, treatment vs. baseline (join via `profiles.condition_order`) |
| Build vs. borrow? | within a learner: `first_submit_correct` rising while `hints_opened` falls on later same-`concept` items |
| Does answer-then-expand keep learners engaged? (correlational) | `behavior_events` reliance ratio vs. that learner's held-out `first_submit_correct` |
| Does self-confidence predict independence? (CHI-2025) | correlate `events.pre_confidence` with `first_submit_correct` |

---

## Runnable SQL (paste into Supabase SQL Editor)

```sql
-- 0. extensions
create extension if not exists vector;

-- 1. profiles
create table profiles (
  id              uuid primary key default gen_random_uuid(),
  display_name    text,
  condition_order text,
  is_tester       boolean default false,
  created_at      timestamptz default now()
);

-- 2. api_keys  (pilot: plain text, RLS-protected, user-deletable)
create table api_keys (
  user_id    uuid primary key references profiles(id) on delete cascade,
  provider   text,
  key_value  text,
  created_at timestamptz default now()
);

-- 3. items
create table items (
  item_id          text primary key,
  concept          text not null,
  scenario         text not null,
  options          jsonb not null,
  correct_choice   text not null,
  rungs            jsonb,
  related_concepts jsonb,
  traces_to        text,
  difficulty       numeric,
  set_role         text check (set_role in ('practice','heldout'))
);

-- 4. events
create table events (
  id                   bigint generated always as identity primary key,
  user_id              uuid references profiles(id) on delete cascade,
  item_id              text references items(item_id),
  concept              text,
  condition            text check (condition in ('treatment','baseline','removal_test')),
  pre_confidence       int,
  pre_reason           text,
  hints_opened         int default 0,
  revealed_answer      boolean default false,
  first_submit_correct boolean,
  explain_back         text,
  time_to_first_submit int,
  created_at           timestamptz default now()
);

-- 5. behavior_events
create table behavior_events (
  id         bigint generated always as identity primary key,
  user_id    uuid references profiles(id) on delete cascade,
  kind       text,
  payload    jsonb,
  created_at timestamptz default now()
);

-- 6. module_chunks  (RAG; 384 dims = all-MiniLM-L6-v2 — change if model changes)
create table module_chunks (
  id         bigint generated always as identity primary key,
  module     text,
  chunk_text text not null,
  embedding  vector(384),
  created_at timestamptz default now()
);

-- Row Level Security: api_keys readable/writable only by its owner.
-- NOTE: this policy assumes Supabase Auth (auth.uid()). With name/code login
-- (no auth session), enforce ownership in the serverless function instead and
-- keep RLS as defense-in-depth. If you later add real auth, this is already correct.
alter table api_keys enable row level security;
create policy api_keys_owner on api_keys
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
```

> **Honest caveat on the RLS policy:** it uses `auth.uid()`, which only exists under real Supabase Auth. Since the pilot uses name/code login (no auth session), that policy won't match any user and would block access. For the pilot, either (a) enforce "a user only touches their own key" in the serverless function and leave RLS off on `api_keys`, or (b) add minimal Supabase Auth so `auth.uid()` works. Decide this before relying on the key store — see the open question below.
