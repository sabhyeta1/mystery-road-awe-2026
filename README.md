# Project ReMotion – Investigation Portal

Investigate the failure of an AI-assisted rehabilitation robot.

## About

Project ReMotion is a browser-based investigation platform built around a fictional incident.
During a pre-demonstration calibration test, the AI-assisted rehabilitation robot **ReMotion**
loaded the wrong calibration profile and triggered its emergency stop. This application lets an
investigator review the evidence, people, locations, and timeline surrounding the incident, and
build up a working hypothesis about what happened.

This repository contains an existing vanilla-JavaScript (no frameworks used) investigation application. The system is
functional but has accumulated technical debt and inconsistent implementation decisions. Your task
during the course will be to analyse, maintain, refactor, migrate, and extend it.

## Running the application

This application uses `fetch()` to load its case data from local JSON files, so it must be served
over HTTP — opening `index.html` directly from the filesystem (`file://`) will not work in most
browsers.

Any static file server will do. For example, from the project root:

```bash
# Python 3
python -m http.server 8080

# Node.js (no install required)
npx serve .

# VS Code
# Use the "Live Server" extension
```

Then open `http://localhost:8080` (or whatever port your server prints) in your browser.

## Backend (development only)

Since Exercise 6, the React app loads its case data from a small Node.js server (Express) instead
of reading the JSON files directly. **The server is for local development only and is not
deployed.** The GitHub Pages workflow (`.github/workflows/deploy.yaml`) still only builds and
publishes the static frontend.

Run two terminals from the project root:

```bash
npm run dev      # terminal 1: the frontend (Vite)
npm run server   # terminal 2: the backend on http://127.0.0.1:3001
```

The Vite dev server forwards every request starting with `/api` to the backend (see
`vite.config.js`). The browser therefore only talks to one origin, so no CORS configuration is
needed.

Read-only endpoints (each returns the content of the matching file in `public/data/`):

- `GET /api/case`
- `GET /api/evidence`
- `GET /api/people`
- `GET /api/locations`
- `GET /api/timeline`

Simulating real-world conditions (for testing loading, error and race behaviour). Open these
directly in the browser on port 3001:

- `/dev/settings` shows the current settings.
- `/dev/settings?delay=3000` makes every API answer take 3 seconds (maximum 15000).
- `/dev/settings?delayFor=evidence` makes the delay apply to `/api/evidence` only (use `delayFor=all` to undo). This is how to build a request race.
- `/dev/settings?fail=evidence` makes `/api/evidence` answer with HTTP 500. Use `fail=all` for
  every endpoint and `fail=none` to switch it off again.
- `/dev/settings?empty=evidence` makes `/api/evidence` answer successfully, but with an empty list
  (also works for `people`, `locations` and `timeline`; use `empty=none` to switch it off).
  `?empty=1` works on a single request too.
- `?delay=2000` or `?fail=1` can also be added to a single API request, for example
  `/api/people?delay=2000`.
- `API_DELAY_MS=2000 npm run server` sets a default delay when the server starts.

The settings only live in the server's memory and reset when the server restarts.

## Features

- **Dashboard** — case summary and key statistics calculated from the loaded case data.
- **Evidence catalogue** — search, filter (by type, person, location, status, relevance), sort,
  bookmark, and open detailed evidence records.
- **People & Locations** — profile cards for the investigation team and the six key locations.
- **Timeline** — chronological view of case events with filtering and links to related evidence.
- **Investigator workspace** — bookmarked evidence, personal notes, and a hypothesis draft form.
  Workspace data is saved to your browser's local storage and will still be there when you reload
  the page.

## Browser requirements

A recent version of any evergreen desktop browser (Chrome, Firefox, Edge, Safari). JavaScript must
be enabled. The layout targets common desktop and tablet widths.

## Project status

This is an existing brownfield application, not a fresh scaffold. It works for everyday use, but
you should expect to find rough edges, inconsistent patterns, and a handful of bugs as you work
with it — that discovery process is part of the course.