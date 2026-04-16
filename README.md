# What Was in the Air

An explorable webapp for public internal tech communications.

## V1

Start narrow:
- **Company:** Apple
- **Corpus:** Epic v. Apple
- **Goal:** turn scattered public exhibits and reporting into a lightweight, explorable interface

The repo is intentionally **manual-first**. Curate the best internal emails/memos first, then automate ingestion later.

## Repo structure

```text
.
├── index.html
├── styles.css
├── app.js
├── data/
│   └── apple-epic-demo.json
└── README.md
```

## Current state

This first commit is a **working interactive scaffold** with demo records so the interface is explorable immediately.

Next real step:
1. Replace demo records with real curated records from public exhibits / reporting
2. Add 30 to 50 high-signal Apple records
3. Keep the UI playful and single-screen

## Record shape

Each item should look like:

```json
{
  "id": "apple-001",
  "company": "Apple",
  "case": "Epic v. Apple",
  "year": 2013,
  "topic": "messaging",
  "title": "iMessage expansion debate",
  "summary": "Internal discussion about expanding iMessage into a broader messaging platform.",
  "people": ["Eddy Cue", "Phil Schiller"],
  "products": ["iMessage"],
  "sourceLabel": "The Verge / Epic v. Apple coverage",
  "sourceUrl": "https://www.theverge.com/2021/5/27/22454959/epic-apple-trial-recap-video-tim-cook-xbox-playstation-business",
  "demo": true
}
```

## Why this structure

The unit is not a PDF. The unit is a **moment**:
- what was being discussed
- by whom
- in what year
- about what product / theme
- with a source back to the public record

## Local dev

This is plain HTML/CSS/JS on purpose.

Run locally with:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

## Design principle

Not a document archive.

A curiosity machine for:
- what Apple was privately obsessed with
- what was in the air in a given year
- which themes kept recurring
