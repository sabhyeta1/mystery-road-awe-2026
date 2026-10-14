# Architecture (React part)

The React code lives in `src/react/` and is organised **by feature**: one folder per view of the app, plus a few folders for things that are shared.

```
src/react/
├── main.tsx                   entry point, mounts <App />
├── App.tsx                    root component, picks the page to show
├── shell/                     app shell: header, navigation, footer, view switching
├── dashboard/                 Dashboard view and everything only it uses
├── people-locations/          People & Locations view
├── timeline/                  Timeline view
├── evidence/                  Evidence Catalogue (placeholder until Exercise 5)
├── workspace/                 Investigator Workspace (placeholder until Exercise 5)
├── components/                shared presentational components (used by 2+ features)
└── data/                      loading the case data (`useCaseData`)
```

## Rule: shared vs. feature-local

A file lives **inside its feature folder** until a **second feature needs it**. Only then does it move to `components/` (or `data/`).

- Shared example: `components/ViewSection.tsx` is the page frame used by both People & Locations and Timeline.
- Shared example: `components/Badge.tsx` is the small coloured label used by both the Dashboard (evidence status and case status) and the Timeline (certainty). It started as three separate copies and moved to `components/` once two features needed it.
- Feature-local example: `people-locations/PersonCard.tsx` is only used by the people list, so it stays in its feature folder.

## Dependency direction

- Feature folders may import from `components/`, `data/` and the navigation types in `shell/views.ts`.
- Feature folders do **not** import from each other. If two features need the same thing, it moves to `components/`.
- Only `App.tsx` imports the pages of all features.

## Component kinds

- **Feature (container) components** are the `*Page` components and `App`. They load or read data, derive values and pass plain props down.
- **Presentational components** (everything else) only render what their props describe.