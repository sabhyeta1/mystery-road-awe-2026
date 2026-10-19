# Exercise 4 — React UI & Component Design

This is the fourth exercise in Advanced Web Engineering Course (CSDC). It builds on Exercise 3. This exercise migrates **two more views — People & Locations, and Timeline** — bringing the running total to 3 of the app's 5 views fully in React. **Evidence Catalogue and Workspace are deliberately not part of this exercise**. They need real interactivity (`useState`, controlled forms, a reducer) to make sense, and that's Exercise 5.

**This exercise is about structure, not behavior.** Migrate these views as presentational-first, e.g.
reusable components, typed props, lists and conditional content, and (for Timeline) filter controls that are visually complete but not required to be functionally wired to `onChange` handlers yet. "No state management beyond what is necessary to render the initial view" is the rule. It's fine (expected, even) for Timeline's filter dropdowns to not filter anything yet when changed by the user.

**Hard rules for every component you write in this exercise:**
- [ ] No `innerHTML`.
- [ ] No manual DOM creation (`document.createElement`, `.appendChild`, etc.).
- [ ] No state beyond what's needed to render the initial view (reading a query param once to decide *what* to show initially is fine.

**Out of scope for this exercise**: Evidence Catalogue, Workspace, `useState` and any interactivity beyond what's needed to render the initial view, forms that actually submit
or validate anything, global/shared state, and accessibility (not covered in this course). 

## Corresponding manuscript reading

This exercise corresponds to the following chapters in the course manuscript:

- **Chapter 15, React Foundations** — “JSX is JavaScript syntax for UI descriptions” through “The component tree,” PDF pp. 104–106
- **Chapter 16, React Component Design and Routing** — all sections, PDF pp. 110–114

## Self-Check

The exercise is organized into 10 individual tasks with corresponding questions, that are presented in class. 

These checkboxes are for self-checking. Don't forget to do the actual checking of tasks you are able to present in the Moodle course. **Before class, tick only what you can genuinely demonstrate or answer on the spot, live.**

| # | Demo | Ready? |
|---|---|---|
| 1 | JSX, function components, typed props, composition & children | ☐ |
| 2 | Conditional rendering | ☐ |
| 3 | Rendering collections | ☐ |
| 4 | Stable keys and list identity | ☐ |
| 5 | Presentational vs. feature components and component boundaries | ☐ |
| 6 | Feature-oriented folder structure | ☐ |
| 7 | Reusable UI elements | ☐ |
| 8 | Routing: People & Locations as real routes | ☐ |
| 9 | Route parameters | ☐ |
| 10 | Query parameters as URL state + migration wrap-up | ☐ |

---

## Demo 1 — JSX, function components, typed props, composition & children

**Tasks**

- [x] Build at least 3 small components for the People & Locations or Timeline views using JSX, each with an explicitly typed props interface/type (no untyped or `any` props).

    I built `PersonCard` (props: `person: Person`, `evidenceCount: number`), `LocationCard` (props: `location: CaseLocation`) and `ViewSection` (props: `title: string`, `children: ReactNode`). Each has its own `interface ...Props` and uses the domain types from `types/domain.ts`, so there is no `any` anywhere.

- [x] Build at least one component that takes `children` (composition) rather than a data prop, and use it in a real place in the app.

    `ViewSection` is the wrapper for a whole page. It renders the `<section>` and the `<h2>` title, and puts whatever is passed between its tags in `{children}`. I use it in `PeoplePage` (for the loading state, the error state and the real content) and in `TimelinePage`.

**Questions** (depend on the tasks above)

- [x] Show one JSX expression in your code that embeds a JavaScript value or expression (not just static markup). What can and can't go inside `{...}` in JSX?

    In `PersonCard` I use `<h3>{person.name}</h3>` for a plain value, and `{evidenceCount === 1 ? "" : "s"}` for a computed one that decides between "item" and "items". I also use `{...}` in attributes, like `src={person.avatar}`.

    Inside `{...}` goes any JavaScript **expression**, meaning anything that produces a value: variables, property access, function calls, arithmetic, ternaries, `&&`, and `.map(...)`, which I use for the list of responsibilities. **Statements** can't go inside, such as `if`, `for` or `switch`, or declaring a variable. For those I compute the value before the `return`, or use a ternary. A plain object can't be rendered either, because React throws "Objects are not valid as a React child". `true`, `false`, `null` and `undefined` are allowed but render nothing.

- [x] For one component's typed props: what would TypeScript catch if you passed the wrong shape of data to it? Demonstrate a real type error by passing something wrong on purpose.

    For `PersonCard` I passed `evidenceCount="three"` from `PeoplePage`. VS Code underlined it straight away and `npm run typecheck` failed with "Type 'string' is not assignable to type 'number'". When I left out `evidenceCount`, I got "Property 'evidenceCount' is missing … but required in type 'PersonCardProps'". Passing a `CaseLocation` as `person` would also fail, because it lacks fields like `role` and `statement`. TypeScript catches this while I write the code, before anything runs, because the `interface` is the contract of the component. The types are erased in the browser, so without TypeScript the mistake would show up as a blank or wrong UI. I reverted the error afterwards.

- [x] What's the difference between passing data as a named prop versus passing it as `children`? Why did you choose `children` for the component you built with it?

    A named prop is a specific, typed piece of data that the component uses itself, and the component decides where and how to show it. In `ViewSection`, `title` is a named prop: it is a string and always ends up in the `<h2>`. `children` is arbitrary JSX that the caller nests between the tags. The component only provides the frame around it and doesn't know what is inside.

    I chose `children` because the frame (the section and the heading) is the same on every page, but the content differs. In `PeoplePage` it is "Loading…", an error message, or lists of cards, and in `TimelinePage` it is a placeholder. If I had passed the content as props, `ViewSection` would need a prop for every kind of content. With `children` it stays generic, and the page decides what goes inside. Its type is `ReactNode`, which covers anything React can render.

- [x] Why does direct DOM manipulation (as the old vanilla `app.js` did constantly) conflict with React's rendering model? What assumption does React make about who "owns" the DOM that direct manipulation breaks?

    In React the UI is a function of props and state. I describe what the screen should look like, and React keeps a virtual copy of that. On every change it compares the new description with the previous one and only updates the real DOM nodes that differ. React assumes **it is the only one that writes to the DOM nodes it renders**, so its virtual copy always matches the real DOM.

    My vanilla code broke that assumption all the time. `renderPeople()` did `container.innerHTML = html` and rebuilt everything, and `switchPeopleTab()` used `classList.add/remove("hidden")` to flip panels by hand. If I did that to a React-rendered element, the real DOM would no longer match React's copy. React wouldn't know about my change. It could overwrite it on the next render, or fail when it tries to update or remove a node that no longer exists. I would also have two sources of truth. Building HTML by string concatenation is also unsafe, because values like `person.statement` are inserted unescaped. JSX escapes values automatically.

---

## Demo 2 — Conditional rendering

**Tasks**

- [x] Implement at least two real conditional-rendering cases in the views you're migrating.

    1. **Empty state in `PeoplePage`:** if `people.length === 0` the page shows "No people on file for this case." instead of an empty grid, and the same for locations.
    2. **State-dependent label in `PersonCard`:** the evidence line shows "No related evidence" when the count is 0, and otherwise "N related evidence item(s)" with the correct singular or plural.
    3. **Optional sections in the cards:** the responsibilities list in `PersonCard` and the "Contains:" list in `LocationCard` only render if the array has entries.
    4. **Loading and error states:** `PeoplePage` shows "Loading case file…" or an error message instead of the content, depending on `loadState.status`.

    I checked each branch by temporarily emptying `people.json`, `evidence.json`, and one `contains` array, and then restored the files with `git restore`.

- [x] Use at least two different conditional-rendering techniques and be ready to justify which you used where.

    - **Early return** for the loading and error states in `PeoplePage`. The whole page is different in those cases, so it's cleaner to return early than to wrap the entire normal layout in a condition.
    - **Ternary (`? :`)** for the empty states and the evidence label. There are exactly two outcomes and one of them always has to be shown, so a ternary fits.
    - **`&&`** for the optional lists in `PersonCard` and `LocationCard`. There is one outcome (show the list) and no "else" case, so `&&` is shorter than a ternary with `null`.

**Questions** (depend on the tasks above)

- [x] Show one place where you used `condition && <Component />` instead of a ternary. What would go wrong if `condition` were a number like `0` instead of a boolean and does that risk apply to your actual code?

    In `LocationCard` I wrote `{location.contains.length > 0 && (<>…the "Contains:" paragraph and the list…</>)}`. I used `&&` because there is nothing to show in the else case, so a ternary would need a pointless `: null`.

    If the condition were the number `0`, `0 && <X />` evaluates to `0`, not to `false`. React skips `false`, `null` and `undefined`, but it **renders the number 0 as visible text**. So a stray "0" would appear on the page. This does not apply to my code, because I compare with `> 0`, which is always a real boolean. If I had written `{location.contains.length && (...)}`, any location with an empty list would have displayed a "0". Ways to avoid it are to compare explicitly (`> 0`), convert with `Boolean(...)`, or use a ternary with `null`.

- [x] Why might returning `null` from a component be preferable to returning an empty `<div>` in some cases? Did you use either, and why?

    Returning `null` renders nothing, so there is no element in the DOM. An empty `<div>` is a real element that stays in the page, and CSS can still give it margin, padding, a border, or a slot in a grid or flex layout. It also shows up in the DOM and for selectors like `:empty`. So `null` is the right way to say "show nothing here".

    I did not return an empty `<div>` anywhere. I also didn't write `return null` directly. My `&&` expressions evaluate to `false` when the condition fails, and React renders `false` exactly like `null`, which is nothing. In `LocationCard` I wrapped the two elements in a Fragment (`<>…</>`) so no extra wrapper `<div>` is added. In `PeoplePage`, when a list is empty I render a short message in a `<p>` instead of an empty `.people-grid` container.

---

## Demo 3 — Rendering collections

**Tasks**

- [x] Render the people list, the locations list, and the timeline events list, each as a mapped collection of components, each with a proper `key` prop.

    - **People:** in `PeoplePage`, `people.map((person) => <PersonCard key={person.id} ... />)`.
    - **Locations:** in `PeoplePage`, `locations.map((location) => <LocationCard key={location.id} ... />)`.
    - **Timeline events:** in `TimelinePage`, `timeline.map((event) => <TimelineEventCard key={event.id} ... />)`.

    Each `key` is the stable `id` from the data, not the array index. The small lists inside the cards (responsibilities and contains) use the item text as the key, because those items have no id.

**Questions** (depend on the tasks above)

- [x] What does React actually use `key` for internally?

    React uses `key` for **reconciliation**, the step where it compares the list it rendered last time with the new one to work out the smallest set of DOM changes. The `key` is the identity of each item, so React can tell which new element corresponds to which old one:

    - **Same key, same type** as before: React reuses the existing component and its DOM node and only updates the props that changed. Any state inside that component stays with it.
    - **New key:** React creates and mounts a new component.
    - **Key no longer in the list:** React unmounts that component and removes its DOM node.
    - **Same keys in a different order:** React moves the existing DOM nodes instead of rebuilding them.

    Without keys, React falls back to matching by position, which goes wrong as soon as the list is reordered or filtered. Keys only need to be unique among siblings in the same list, not across the whole app. `key` is also not passed down as a prop, so the component can't read it as `props.key`. It exists only for React's bookkeeping. In my app, using the data's own ids means that if the Timeline is later filtered or sorted, React can still tell which card is which event.

---

## Demo 4 — Stable keys and list identity

**Tasks**

- [x] Deliberately use `key={index}` in one throwaway example, then demonstrate a case where it produces a visibly wrong result, before replacing it with a real stable id.

    I made a temporary `KeyDemo` component with three rows (Signal Scholar, Kernel Colt, Nova Byte). Each row has a text box and the list is keyed with `key={index}`. A "Remove first" button drops the first item from the array.

    **With `key={index}`:** I typed `hello` into the box next to Signal Scholar and clicked "Remove first". Signal Scholar disappeared, but `hello` was now sitting next to **Kernel Colt**. React thought the row at position 0 was still the same row and only changed its label.

    **With `key={item.id}`:** I repeated the test. The whole Signal Scholar row disappeared together with its `hello`, and Kernel Colt's box stayed empty.

    The demo uses `useState`, so it breaks this exercise's no-state rule. That's why it was only a throwaway. I deleted it afterwards, and the code is kept here for reference:

    <details>
    <summary>KeyDemo.tsx (the buggy version; the fix is <code>key={item.id}</code> and <code>items.map((item) =&gt; …)</code>)</summary>

```tsx
    import { useState } from "react";

    const INITIAL_ITEMS = [
      { id: "signal-scholar", name: "Signal Scholar" },
      { id: "kernel-colt", name: "Kernel Colt" },
      { id: "nova-byte", name: "Nova Byte" },
    ];

    export function KeyDemo() {
      const [items, setItems] = useState(INITIAL_ITEMS);

      return (
        <section>
          <h2>Key demo (throwaway)</h2>
          <button type="button" onClick={() => setItems(items.slice(1))}>
            Remove first
          </button>
          <ul>
            {items.map((item, index) => (
              <li key={index}>
                {item.name} <input placeholder="type a note" />
              </li>
            ))}
          </ul>
        </section>
      );
    }
```

    </details>

**Questions** (depend on the tasks above)

- [x] What goes wrong, concretely, when keys are missing, duplicated, or based on array index for a list that can reorder or filter?

    React uses the key as the identity of each item. If the key is wrong, it matches new items to the wrong old ones.

    - **Index keys:** the identity is the position, not the item. When I removed the first person, React saw "position 0 is still there, position 2 is gone". It reused the first row's DOM node for Kernel Colt, so the typed text stayed behind, and it removed the last row instead of the first. This hits anything that lives in the DOM or in the component rather than in the data: typed text, focus, scroll position, open/closed state, and the internal state of the component.
    - **Missing keys:** React logs a warning and falls back to matching by position, so it behaves like index keys.
    - **Duplicated keys:** React logs a warning, and two items can't be told apart. On updates, rows can be duplicated, skipped, or given the wrong state.

- [x] The *original* vanilla version of this app had a real bug where one feature used an array index as an identifier instead of a stable id. Would that same mistake, ported directly into React as `key={index}`, have caused a symptom a user could notice, or only a console warning? Explain why.

---

## Demo 5 — Presentational vs. feature components and component boundaries

**Tasks**

- [x] Classify every component you've built so far as either "presentational" or "feature/container". Explain why.

    | Kind | Components | Why |
    |---|---|---|
    | Presentational | `AppHeader`, `MainNav`, `AppFooter`, `IntroCard`, `HowToItem`, `CaseSummaryCard`, `StatCard`, `ReviewProgress`, `RecentEvidenceList`, `RecentTimelineList`, `StatusBadge`, `ViewSection`, `PersonCard`, `LocationCard`, `TimelineEventCard`, `PeopleList`, `LocationList` | Everything they render comes from their props. They don't fetch, read storage, or work out which data to show, so I could render any of them with hand-made props. |
    | Feature / container | `App`, `DashboardPage`, `PeoplePage`, `TimelinePage` | They know where the data comes from and decide what to show. `App` runs `useHashView` and `useCaseData` and picks the page. `DashboardPage` filters evidence, counts reviewed items, computes the percentage, takes the 5 most recent items and reads the bookmark count from `localStorage`. `PeoplePage` and `TimelinePage` handle the loading and error states and derive values such as evidence counts per person and the location labels. |
    | Placeholders | `EvidencePage`, `WorkspacePage` | Empty shells until Exercise 5. |

- [x] Find at least one component that's currently doing more than one job, and split it into two components with a clear boundary between them.

    `PeoplePage` was doing three jobs at once: handling the loading and error states, calculating how much evidence each person has, and laying out the people and location lists with their empty states. I split the layout part out into two new presentational components, `PeopleList` and `LocationList`. `PeoplePage` stays the feature component. It handles the load state, computes an `evidenceCounts` object (person id to number), and passes plain data down: `<PeopleList people={people} evidenceCounts={evidenceCounts} />` and `<LocationList locations={locations} />`. The page looks exactly the same as before, so this was a pure refactor.

**Questions** (depend on the tasks above)

- [x] For the component you split: what was the single responsibility of each half after the split? If an implementation detail in one half changed, would that change affect the other half? Why or why not?

    - **`PeoplePage` (feature):** get the data. It checks the load state and works out the evidence count for each person.
    - **`PeopleList` and `LocationList` (presentational):** show the data. Given a list of people (and the counts) or locations, they render the cards in a grid, and show the empty-state message if the list is empty.

    A change inside one half would not affect the other, as long as the props stay the same. If I changed how the counts are calculated (a different source, or a different way of counting), `PeopleList` wouldn't notice, because it still just receives `Record<PersonId, number>`. If I changed the grid, the empty-state text, or the `key`, `PeoplePage` wouldn't notice either. The only thing that couples them is the props interface (`PeopleListProps`). If I changed it, TypeScript would immediately show me every place I need to update.

- [x] Give one concrete rule you used to decide "this belongs in a presentational component" versus "this belongs in a feature component."

    My rule: **if the component could be rendered with hand-made props, and it doesn't need to know where the data came from, it is presentational.** As soon as a component has to look at `loadState`, join or filter several datasets (like counting evidence per person), call a hook, or read `localStorage`, that logic belongs in a feature component. It then hands the finished result down through props. For example, counting evidence stays in `PeoplePage`, while `PeopleList` just displays the number it receives.

---

## Demo 6 — Feature-oriented folder structure

**Tasks**

- [x] Reorganize your React source into a feature-oriented structure, including the Dashboard and shell from Exercise 3.

    I moved the flat `components/` and `pages/` folders into one folder per feature inside `src/react/`:

    - `shell/`: `AppHeader`, `MainNav`, `AppFooter`, `useHashView.ts`, `views.ts`
    - `dashboard/`: `DashboardPage` and all the components only the dashboard uses (`IntroCard`, `HowToItem`, `CaseSummaryCard`, `StatCard`, `ReviewProgress`, `RecentEvidenceList`, `RecentTimelineList`, `StatusBadge`, `bookmarks.ts`)
    - `people-locations/`: `PeoplePage`, `PeopleList`, `PersonCard`, `LocationList`, `LocationCard`
    - `timeline/`: `TimelinePage`, `TimelineEventCard`
    - `evidence/` and `workspace/`: the placeholder pages for Exercise 5
    - `data/`: `useCaseData.ts`
    - `components/`: only the shared `ViewSection`

    `App.tsx` and `main.tsx` stay at the top. Only the file locations and import paths changed, no logic, and the three views look and work exactly as before.

- [x] Document the structure you landed on and the rule you used to decide what's "shared" versus "feature-local."

    It is documented in the new `ARCHITECTURE.md` in the project root: the folder tree, the rule for shared versus feature-local, the dependency direction, and the two kinds of components. The rule is: **a file lives inside its feature folder until a second feature needs it. Only then does it move to `components/` (or `data/`).**

**Questions** (depend on the tasks above)

- [x] What's the difference between organizing files "by type" and "by feature"? What made you choose the structure you chose for this app specifically?

    **By type** means one folder per kind of file: all components in `components/`, all hooks in `hooks/`, all pages in `pages/`. **By feature** means one folder per part of the product, and each folder holds everything that part needs: its page, its components and its helpers.

    My app is naturally split into views (Dashboard, People & Locations, Timeline, and later Evidence and Workspace), and almost every component belongs to exactly one of them. Before, my `components/` folder held around 17 files from three different views mixed together. To work on the Timeline I had to pick its files out of `components/` and `pages/`. Now everything for the Timeline is in `timeline/`. Adding, changing or deleting a view touches one folder. The Evidence and Workspace folders also already exist, waiting for Exercise 5. The trade-off is that I have to decide what counts as shared, which is why I wrote down a rule.

- [x] Where did you draw the line between a component that lives inside one feature folder and one that belongs in a shared/common folder? Give one real example of each from your own structure.

    The line is: **feature-local until a second feature needs it.**

    - **Feature-local example:** `people-locations/PersonCard.tsx` is only used by the people list, so it stays in that folder. `dashboard/StatCard.tsx` is only used on the dashboard.
    - **Shared example:** `components/ViewSection.tsx` is the page frame (the section with the `<h2>` title) used by both People & Locations and Timeline, so it lives in `components/`. `data/useCaseData.ts` is shared too, because every page uses its `LoadState` type.

    `StatusBadge` is a borderline case. Only the Dashboard uses it today, so it lives in `dashboard/`. It moves to `components/` as soon as the Evidence page needs it.

---

## Demo 7 — Reusable UI elements

**Tasks**

- [x] Extract at least one presentational component that is genuinely reused in two or more different places in the app, with a typed props API that makes it flexible enough for both uses without becoming a special-cased mess.

    I extracted `Badge` (`components/Badge.tsx`), the small coloured label. It takes `variant: BadgeVariant` (a union type: `"reviewed" | "flagged" | "unreviewed" | "critical" | "relevant"`) and `children: ReactNode` for the text. It is used in three places:

    1. `timeline/TimelineEventCard.tsx`: the certainty of a timeline event (confirmed, reported, contradictory).
    2. `dashboard/RecentEvidenceList.tsx`: the review status of an evidence item.
    3. `dashboard/CaseSummaryCard.tsx`: the status of the case ("OPEN").

    Because the Dashboard and the Timeline both use it, it lives in the shared `components/` folder. The old `StatusBadge` became redundant, so I deleted it.

**Questions** (depend on the tasks above)

- [x] Show the two (or more) places your reusable component is used. What varies between them via props, and what stays fixed inside the component itself? How did you decide where that line goes?

    - Timeline: `<Badge variant={CERTAINTY_VARIANT[event.certainty]}>{event.certainty}</Badge>`
    - Evidence list: `<Badge variant={item.status}>{item.status}</Badge>`
    - Case summary: `<Badge variant="flagged">{caseInfo.status.toUpperCase()}</Badge>`

    **What varies** (through props): the colour (`variant`) and the text (`children`). **What stays fixed** inside the component: the markup (a `<span>`) and the CSS naming (`badge` plus `badge-<variant>`).

    I drew the line by asking what is the same in every use and what depends on the caller. The look is the same everywhere. The meaning is different. `Badge` knows nothing about timelines, evidence or cases. The translation from a domain value to a colour stays with the caller. For example, `TimelineEventCard` has a lookup table `CERTAINTY_VARIANT` that maps `confirmed` to `reviewed`, `reported` to `flagged` and `contradictory` to `critical`. If I had put that mapping into `Badge`, it would need a special case for every new kind of status. The `variant` union type also means a typo like `variant="reveiwed"` is a compile error.

- [x] The original vanilla app had duplicated HTML-template code. Compare that directly to what you just built. What does a reusable component give you that copy-pasted template strings didn't?

    In the vanilla app, the same badge markup was written out separately in many places: `dashboard.ts` (line 22 for the case status and line 60 for the evidence status), `evidence.ts` (lines 148, 150 and 152 for critical, status and relevance), and `timeline.ts` (line 67 for the certainty). Each was a hand-concatenated string like `'<span class="badge badge-' + … + '">'`, and each worked slightly differently. Some used a helper function (`getStatusBadgeClass`, `certaintyBadgeClass`), and some hard-coded the class.

    A reusable component gives me:

    - **One source of truth:** if the badge markup or class naming changes, I change one file instead of hunting through six strings and hoping I found all of them.
    - **Type safety:** the `variant` prop only accepts the five valid values, whereas a string typo in a template string fails silently and the badge just loses its colour.
    - **No manual string building:** there is no `'<span class="badge ' + … + '">'` to get wrong, and the text is escaped by JSX instead of being pasted into HTML.
    - **Consistency:** every badge in the app is guaranteed to look and be built the same way.

---

## Demo 8 — Routing: People & Locations as real routes

**Tasks**

- [x] Install a routing library (React Router or an equivalent of your choice, justified) and
replace the shell's placeholder navigation from Exercise 3 with real routes for at least Dashboard, People & Locations, and Timeline.

    I installed **React Router** (the `react-router` package, version 8) with `npm install react-router`. I chose it because it is the most widely used router for React, it has good TypeScript types, and it supports everything this exercise and the next ones need: nested routes, route parameters (`useParams`) and query parameters (`useSearchParams`).

    I use `HashRouter` in `main.tsx`. The app is hosted on GitHub Pages, which only serves static files. With a normal `BrowserRouter`, reloading on `/team/people` would ask the server for a file that doesn't exist and give a 404. With `HashRouter` the route is after the `#`, which the browser never sends to the server, so reloads and bookmarks always work. The vanilla app also used `#` URLs.

    The route table is in `App.tsx`: `/dashboard`, `/evidence`, `/team/people`, `/team/locations`, `/timeline`, `/workspace`, plus `/` and `/team`, which redirect. The old placeholder navigation is gone: `MainNav` now uses `NavLink` (which also tells me which link is active), the Dashboard's "Go to…" buttons are `Link`s, the `onNavigate` and `currentView` props were removed, and I deleted `useHashView.ts`. The paths are stored once in `shell/views.ts`.

- [x] Convert the People/Locations tab toggle from local component state into two real,
navigable, bookmarkable routes (e.g. `/team/people` and `/team/locations`) instead of a click handler that only changes what's shown without changing the URL.

    In the vanilla app the toggle was `switchPeopleTab()`, which hid and showed the two panels with a click handler and never touched the URL. Now `/team` is a **nested route**: `TeamLayout` draws the page title and the tab bar and contains an `<Outlet />`, and the child routes `people` (`PeopleTab`) and `locations` (`LocationsTab`) are shown in that outlet. The two tabs in `TeamTabs` are `NavLink`s to `/team/people` and `/team/locations`, and the active tab is highlighted automatically. `/team` on its own redirects to `/team/people`. I checked that reloading on the Locations tab keeps me there and that the back button switches between the tabs.

**Questions** (depend on the tasks above)

- [x] Why does making the People/Locations tab a real route (versus keeping it as internal
component state) matter for the user? Name a concrete capability the user gains.

    The URL becomes part of the app's state, so the user can **bookmark or share a link straight to the Locations tab**. With internal component state, the address stays the same for both tabs. A link could only open the default tab, and after a reload the user would always land on People again.

    The user also gets a working **back button** (going back returns to the previous tab instead of leaving the whole page), the ability to **reload without losing their place**, and the ability to open a tab in a new browser tab. These all come from the browser's own navigation, which I don't have to rebuild. The URL is also a single source of truth: the highlighted tab and the content can't get out of sync, because both are derived from the URL.

- [x] What does your router do when the URL doesn't match any route you've defined? Compare this to how the vanilla app's `handleHashChange()` fell back to the dashboard for an invalid hash.

    I added a catch-all route with `path="*"`. React Router uses it only when no other route matches (more specific routes always win, regardless of order), and it shows my `NotFoundPage`: a "Page not found" message with a link back to the Dashboard. It also works for wrong child paths, like `#/team/xyz`. The URL in the address bar stays as the user typed it.

    The vanilla `handleHashChange()` silently treated any invalid hash as the dashboard. That is forgiving, but it hides the problem: the user doesn't learn that the address was wrong, and the app shows content that doesn't belong to the URL they typed. My router version tells the user clearly that the page doesn't exist and offers a way out. The only redirect I kept is the deliberate one: `/` goes to `/dashboard`, and `/team` goes to `/team/people`, using `<Navigate replace />` so the back button doesn't get stuck on the redirecting address.

---

## Demo 9 — Route parameters

**Tasks**

- [x] Add at least one route that takes a parameter (e.g. a person or location id in the URL, such as `/team/people/:personId`), and use that parameter inside the corresponding component to determine what to render.

    I added the route `people/:personId` as a child of the `/team` route in `App.tsx`, so the full path is `/team/people/:personId`. It renders the new `PersonDetailTab` component. Inside it I read the parameter with `const { personId } = useParams();` and look the person up with `people.find((item) => item.id === personId)`. The page then shows the person's `PersonCard` and their `background` text, which no other page displayed before. Because it is a child of `/team`, the page title and the tab bar stay, and the People tab stays highlighted.

- [x] Make at least one place in the app link to that parameterized route (not just typing the URL by hand). For example, a person's name in a related-evidence context, or a "view on team page" link.

    The person's name on every card in the People list is now a `<Link>` to `/team/people/<id>`, for example `/team/people/nova-byte`. `PersonCard` got an optional `profilePath` prop: `PeopleList` passes it, so the name becomes a link there, and `PersonDetailTab` leaves it out, so the name on the detail page is plain text and doesn't link to itself. The detail page also has a "← Back to all people" link.

**Questions** (depend on the tasks above)

- [x] How do you read a route parameter's value inside your component, and what type is it as far as TypeScript is concerned by default? What did you have to do to use it safely (e.g. what if the id in the URL doesn't match any real person)?

    I read it with the `useParams()` hook from React Router: `const { personId } = useParams();`. The name `personId` matches the `:personId` in the route path.

    By default TypeScript types every route parameter as `string | undefined`. It is a string because it comes from the URL text, and it may be `undefined` because TypeScript can't know that the URL really contained that part. If the id were a number, I would have to convert it myself, because it always arrives as text. My ids are strings, so that wasn't needed.

    To use it safely I don't assume that a person exists. `people.find(...)` returns `undefined` when nothing matches, so I check `if (person === undefined)` and show "There is no person with the id “…” in this case." with a link back to the list. Without that check, a URL like `#/team/people/nobody` would crash when the code tries to read `person.name`. Only after that check does TypeScript know that `person` is a real `Person`. I tested it with `#/team/people/nobody`.

- [x] What's the practical difference, for the user, between `/team/people/nova-byte` (a route
param) and `/team/people?person=nova-byte` (a query param)? Why is one more appropriate than
the other for this specific case?

    A route parameter is part of the **path**. It identifies one specific page, "Nova Byte's profile", and every person gets their own readable address that can be bookmarked and shared. It is required: without it the route doesn't match at all, and the router uses it to decide which route to show.

    A query parameter comes after the `?` and is not part of route matching. It describes an **optional variation of the same page**. `/team/people?person=nova-byte` would still be "the People list", only with some option added, and without the parameter it would simply show the full list. Query parameters are meant for things like filters, sorting or a pre-selection.

    For this case the route parameter fits better, because opening a person is not a filter on the list. It is a separate page for one specific thing, with its own content (the background text), and that page can't exist without knowing which person. The URL also reads like a hierarchy (team → people → Nova Byte). I use a query parameter in Demo 10, where `?person=…` only changes which events the Timeline shows initially.

---

## Demo 10 — Query parameters as URL state + migration wrap-up

**Tasks**

- [x] On the Timeline view, read a query parameter (e.g. `?person=...`) when the page loads, and use it to determine the *initial* rendered list (for example, pre-selecting a person filter if the app is opened via a link that includes one). Remember, the filter controls themselves don't need to be interactive yet. This is about parameterizing the initial render from the URL, not wiring `onChange`.

    `TimelinePage` reads `?person=` with `useSearchParams()` (I only use the read-only first value, not the setter) and `searchParams.get("person")`. If a person with that id exists, the page filters the events with `event.personIds.includes(...)`. An unknown id is ignored and all events are shown. So `#/timeline?person=nova-byte` shows 3 events, and `#/timeline` shows all 15.

    I also built `TimelineFilters`, the toolbar with four dropdowns (order, person, location, event type). It is display-only: it uses `defaultValue` to pre-select the person from the URL and has no state and no `onChange`, so changing a dropdown does nothing yet. The person dropdown has `key={selectedPersonId}` so that it is re-created if the URL changes while the Timeline is open, because `defaultValue` is only read when the element is created. The link "Show this person's timeline events" on each person's detail page opens the Timeline with the person pre-selected.

- [x] Do a final pass confirming: Dashboard, People & Locations, and Timeline are fully React, none of them use `innerHTML` or manual DOM creation anywhere, and all three are reachable via real, bookmarkable routes.

    I searched `src/react` with `grep` for `innerHTML`, `createElement`, `appendChild`, `insertAdjacentHTML`, `document.` and `window.`. The only match is `document.getElementById("root")` in `main.tsx`, which is where React is attached to the page. I also searched for state hooks: the only ones are `useState` and `useEffect` in `useCaseData.ts`, which load the JSON data, so no page or component has state of its own.

    The three views are reachable through real routes: `#/dashboard`, `#/team/people` and `#/team/locations`, and `#/timeline` (also with `?person=…`). I opened each in a fresh tab and reloaded, and each opened directly. `npm run format:check`, `typecheck`, `lint` and `build` all pass.

**Questions** (depend on the tasks above)

- [x] Why is reading a query parameter once, on initial render, still consistent with this exercise's "no state beyond what's necessary to render the initial view" rule? What would cross the line into "real interactivity" that's out of scope until Exercise 5?

    Reading the query parameter doesn't create any state in my component. The URL is an input from outside, just like props: the page reads it, calculates which events to show, and draws them. There is no `useState`, nothing remembers a value between renders, and nothing in my code changes what is shown afterwards. The result is only a function of the URL and the data, which is the same "describe the initial view" idea as for props.

    What would cross the line is anything that reacts to the user: `onChange` handlers on the dropdowns, storing the selected values in `useState`, making the dropdowns controlled (`value` plus `onChange`), or calling `setSearchParams` to write the user's choice back to the URL. Then the list would have to update after interaction, and that is Exercise 5.

- [x] What would you need to add to make Timeline's filters *actually* filter the list when a user changes them? (You don't have to build it. Just name the concept you'd need)

    I would need **state plus event handlers**, which turns the dropdowns into *controlled components*. That means `useState` (or URL state through `setSearchParams`) to hold the selected order, person, location and type; `onChange` handlers on each `<select>` that update that state; and `value={...}` instead of `defaultValue` so React owns the dropdown. Each time the state changes, React re-renders and the list is derived from the data and the current filter values (the same filtering I already do for the person). If I want the filters to stay bookmarkable, I would keep the state in the URL by writing to the query parameters with `setSearchParams`.

- [x] Across the 3 views you've now fully migrated, what's one piece of duplicated logic or markup you noticed but didn't extract yet? Why didn't you, and would you if you had more time?

    The loading and error handling. `DashboardPage`, `PeopleTab`, `LocationsTab`, `PersonDetailTab` and `TimelinePage` all start with the same two `if` blocks: "if `loadState.status` is `loading`, show Loading…" and "if it is `error`, show the message". They differ only slightly in what they wrap the message in (the Dashboard and Timeline use their own section, the tabs only a `<p>`).

    I didn't extract it because the small differences would have needed extra props, and because Exercise 5 introduces shared state, which will probably change how the data reaches the pages anyway. So I would have rewritten the extraction soon. With more time I would make a small component, for example `<LoadGate loadState={loadState}>{(data) => …}</LoadGate>`, that handles the two early states once and passes the loaded data to its children. A smaller duplicate is counting a person's evidence, which is done in both `PeopleTab` and `PersonDetailTab` and could be one helper function.

---
