# Week 11 Lab — Software Quality

A static web application for a university lab activity on Software Quality. Students complete three parts: MCQ, a sort activity, and a scenario analysis. All submissions are saved to Supabase and viewable in a lecturer dashboard.

---

## Project Structure

```
week11-lab/
├── index.html          ← Student-facing lab
├── dashboard.html      ← Lecturer dashboard (password protected)
├── css/
│   └── style.css
├── js/
│   ├── app.js          ← Lab logic
│   ├── dashboard.js    ← Dashboard logic
│   └── supabase.js     ← Supabase client (URL + key live here)
├── data/
│   └── questions.js    ← All question data and model answers
└── README.md
```

---

## Supabase Setup

### Step 1 — Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and sign in.
2. Click **New project**, give it a name (e.g. `week11-sq-lab`), choose a region, and create it.
3. Wait for the project to initialize (~1 minute).

### Step 2 — Create the submissions table

1. In your Supabase project, go to **SQL Editor**.
2. Paste and run the following SQL:

```sql
CREATE TABLE submissions (
  id              uuid primary key default gen_random_uuid(),
  submitted_at    timestamp with time zone default now(),
  student_name    text not null,
  student_matrix  text not null,
  mcq_answers     jsonb,
  mcq_score       integer,
  sort_answers    jsonb,
  sort_score      integer,
  scenario_c1     text,
  scenario_c2     text,
  scenario_c3     text,
  scenario_c4     text
);

alter table submissions enable row level security;

create policy "allow_anon_insert" on submissions
  for insert to anon with check (true);

create policy "allow_anon_select" on submissions
  for select to anon using (true);
```

### Step 3 — Copy your API credentials

1. In your Supabase project, go to **Project Settings → API**.
2. Copy the **Project URL** and the **anon / public key**.
3. Open `js/supabase.js` and update these two lines:

```js
const SUPABASE_URL = 'YOUR_PROJECT_URL_HERE';
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY_HERE';
```

> **Security note:** The anon key is safe to include in client-side code. Row Level Security (RLS) is enabled on the table — the policies above allow anonymous INSERT (students submit) and SELECT (dashboard reads). No sensitive data is exposed.

---

## Deploying to GitHub Pages

1. Create a new GitHub repository (public or private).
2. Push the `week11-lab/` folder contents to the repository root (or a subfolder).
3. Go to **Settings → Pages**.
4. Under **Source**, select **Deploy from a branch**, choose `main` (or `master`), root `/`, and save.
5. GitHub will provide a URL like `https://yourusername.github.io/repo-name/`.
6. Share `index.html` with students and `dashboard.html` with lecturers.

> If you deploy to a subfolder, make sure the relative paths (`css/style.css`, `js/app.js`, etc.) still resolve correctly — they will as long as `index.html` stays at the same level as the `css/`, `js/`, and `data/` folders.

---

## Dashboard Access

- URL: `dashboard.html` (relative to wherever you deploy)
- Password: **`sq2026`**

### Changing the dashboard password

Open `js/dashboard.js` and update the first line:

```js
const DASH_PASSWORD = 'sq2026'; // ← change this
```

The password check is client-side only, which is sufficient for a university lab context where the goal is simple access control, not hardened security.

---

## Lab Overview

| Part | Activity | Max Score |
|------|----------|-----------|
| A | 20 MCQ questions with instant feedback | 20 |
| B | Sort 8 items into 4 quality model buckets | 8 |
| C | 4 short-answer scenario questions (MySihat case study) | Marked by lecturer |

Parts A and B are auto-scored. Part C answers are stored and viewable in the dashboard alongside model answers for quick comparison.

---

## Technology

- Vanilla HTML, CSS, JavaScript — no build tools, no npm
- [Supabase JS v2](https://supabase.com/docs/reference/javascript) via CDN
- Google Fonts (DM Sans + DM Mono) via CDN
- Works as static files — GitHub Pages compatible
