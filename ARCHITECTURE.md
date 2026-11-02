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

- **Feature (container) components** are the `*Page` components, `App`, and the route components of the People & Locations feature (`TeamLayout`, `PeopleTab`, `LocationsTab`). They load or read data, derive values and pass plain props down.
- **Presentational components** (everything else) only render what their props describe.

## Routing

The app uses **React Router** in **hash mode** (`HashRouter` in `main.tsx`). Hash mode is used because the app is hosted on GitHub Pages, which is a static file host: a normal URL like `/team/people` would give a 404 when reloaded, but everything after the `#` is never sent to the server. The route table lives in `App.tsx`:

| URL                | Shows                                             |
| ------------------ | ------------------------------------------------- |
| `#/`               | redirects to `#/dashboard`                        |
| `#/dashboard`      | Dashboard                                         |
| `#/evidence`       | Evidence Catalogue (placeholder until Exercise 5) |
| `#/team`           | redirects to `#/team/people`                      |
| `#/team/people`    | People & Locations, People tab                    |
| `#/team/people/<id>` | Detail page of one person (route parameter `:personId`); unknown ids show a message |
| `#/team/locations` | People & Locations, Locations tab                 |
| `#/timeline`       | Timeline                                          |
| `#/timeline?person=<id>` | Timeline with the person filter pre-selected from the query parameter; unknown ids are ignored |
| `#/workspace`      | Workspace (placeholder until Exercise 5)          |
| anything else      | `NotFoundPage`                                    |

- The path of each main view is stored once in `shell/views.ts` and used by the navigation (`NavLink`) and by the Dashboard links (`Link`).
- `/team` is a **nested route**: `TeamLayout` draws the title and the tab bar and has an `<Outlet />` where the matching child (`PeopleTab` or `LocationsTab`) is shown.

### Route parameters and query parameters

- **Route parameter** (`/team/people/:personId`): identifies one specific thing. Read with `useParams()` in `PersonDetailTab`, which shows a message if no person has that id.
- **Query parameter** (`/timeline?person=<id>`): an optional setting of a page. Read once with `useSearchParams()` in `TimelinePage` to decide the initial list. The page never writes to the URL, and the filter dropdowns in `TimelineFilters` are display-only (`defaultValue`, no state, no `onChange`) until Exercise 5.


## Render vs. effects (Exercise 6)

**Rule:** Render only calculates. It turns props, state and context into JSX and must give the same output for the same inputs, without changing anything outside the function. Anything that reaches out of the component (network requests, timers, subscriptions, writing to `localStorage`, changing `document.title`, logging) does not belong in render. It belongs in an **event handler** if the user caused it, or in an **effect** if it has to stay in sync with what is on screen.

- A **side effect** is anything observable outside the function other than its return value.
- **Derived values** (for example the filtered evidence list) are pure calculations. They stay in render, with no effect and no extra state.


## Data layers (Exercise 6)

Loading data from the backend is split into three layers. Each layer only talks to the one below it:

| Layer             | Where                                       | Responsibility                                                                                                                                                                                            |
| ----------------- | ------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| UI                | components in the feature folders           | Render what the props describe. Never call `fetch`.                                                                                                                                                       |
| Application logic | `data/useFetch.ts`, `data/useCaseData.ts`   | Loading / error / ready state, effects, cancellation of obsolete requests, reload, combining the five results. Knows no URLs.                                                                             |
| API access        | `api/caseApi.ts`                            | The only place that calls `fetch`. Knows the URLs and the shape of the answers (and fixes inconsistent data, e.g. the capital "R" in `Reviewed`). Knows nothing about React.                              |

Direction: components → hooks in `data/` → functions in `api/`.

The rule is enforced by ESLint: `fetch` is forbidden in `src/react/` outside `src/react/api/` (see `eslint.config.js`).

`useFetch` receives its fetch function as an argument and uses it in an effect's dependency array, so that function must be declared once at module level. An inline arrow function would start a new request on every render.