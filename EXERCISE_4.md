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

- [ ] Render the people list, the locations list, and the timeline events list, each as a mapped collection of components, each with a proper `key` prop.

**Questions** (depend on the tasks above)

- [ ] What does React actually use `key` for internally?

---

## Demo 4 — Stable keys and list identity

**Tasks**

- [ ] Deliberately use `key={index}` in one throwaway example, then demonstrate (e.g. by reordering or filtering the underlying array) a case where it produces a visibly wrong result, before replacing it with a real stable id.

**Questions** (depend on the tasks above)

- [ ] What goes wrong, concretely, when keys are missing, duplicated, or based on array index for a list that can reorder or filter?
- [ ] The *original* vanilla version of this app had a real bug where one feature used an array index as an identifier instead of a stable id. Would that same mistake, ported directly into React as `key={index}`, have caused a symptom a user could notice, or only a console warning? Explain why.
- [ ] All of this app's real data (people, locations, timeline events) already has stable ids. Is there ever a legitimate reason to use `key={index}` anyway? When?

---

## Demo 5 — Presentational vs. feature components and component boundaries

**Tasks**

- [ ] Classify every component you've built so far as either "presentational" or "feature/container". Explain why.
- [ ] Find at least one component that's currently doing more than one job, and split it into two components with a clear boundary between them.

**Questions** (depend on the tasks above)

- [ ] For the component you split: what was the single responsibility of each half after the split? If an implementation detail in one half changed, would that change affect the other half? Why or why not?
- [ ] Give one concrete rule you used to decide "this belongs in a presentational component" versus "this belongs in a feature component."

---

## Demo 6 — Feature-oriented folder structure

**Tasks**

- [ ] Reorganize your React source into a feature-oriented structure (e.g. grouping by
`people-locations/`, `timeline/`, `dashboard/`, shared `components/`, rather than one flat
folder of files). Including the Dashboard and shell from Exercise 3.
- [ ] Document the structure you landed on (a short `ARCHITECTURE.md` section or README snippet is enough) and the rule you used to decide what's "shared" versus "feature-local."

**Questions** (depend on the tasks above)

- [ ] What's the difference between organizing files "by type" (all components in one folder, all hooks in another) and "by feature"? What made you choose the structure you chose for this app specifically?
- [ ] Where did you draw the line between a component that lives inside one feature folder and one that belongs in a shared/common folder? Give one real example of each from your own structure.

---

## Demo 7 — Reusable UI elements

**Tasks**

- [ ] Extract at least one presentational component that is genuinely reused in **two or more different places** in the app (e.g. a badge, a card shell, a button variant), with a typed props API that makes it flexible enough for both uses without becoming a special-cased mess.

**Questions** (depend on the tasks above)

- [ ] Show the two (or more) places your reusable component is used. What varies between them via props, and what stays fixed inside the component itself? How did you decide where that line goes?
- [ ] The original vanilla app had duplicated HTML-template code (the same card markup written out twice, slightly differently, in two functions). Compare that directly to what you just built. What does a reusable component give you that copy-pasted template strings didn't?

---

## Demo 8 — Routing: People & Locations as real routes

**Tasks**

- [ ] Install a routing library (React Router or an equivalent of your choice, justified) and
replace the shell's placeholder navigation from Exercise 3 with real routes for at least Dashboard, People & Locations, and Timeline.
- [ ] Convert the People/Locations tab toggle from local component state into two real,
navigable, bookmarkable routes (e.g. `/team/people` and `/team/locations`) instead of a click handler that only changes what's shown without changing the URL.

**Questions** (depend on the tasks above)

- [ ] Why does making the People/Locations tab a real route (versus keeping it as internal
component state) matter for the user? Name a concrete capability the user gains.
- [ ] What does your router do when the URL doesn't match any route you've defined? Compare this to how the vanilla app's `handleHashChange()` fell back to the dashboard for an invalid hash.

---

## Demo 9 — Route parameters

**Tasks**

- [ ] Add at least one route that takes a parameter (e.g. a person or location id in the URL, such as `/team/people/:personId`), and use that parameter inside the corresponding component to determine what to render.
- [ ] Make at least one place in the app link to that parameterized route (not just typing the URL by hand). For example, a person's name in a related-evidence context, or a "view on team page" link.

**Questions** (depend on the tasks above)

- [ ] How do you read a route parameter's value inside your component, and what type is it as far as TypeScript is concerned by default? What did you have to do to use it safely (e.g. what if the id in the URL doesn't match any real person)?
- [ ] What's the practical difference, for the user, between `/team/people/nova-byte` (a route
param) and `/team/people?person=nova-byte` (a query param)? Why is one more appropriate than
the other for this specific case?

---

## Demo 10 — Query parameters as URL state + migration wrap-up

**Tasks**

- [ ] On the Timeline view, read a query parameter (e.g. `?person=...`) when the page loads, and use it to determine the *initial* rendered list (for example, pre-selecting a person filter if the app is opened via a link that includes one). Remember, the filter controls themselves don't need to be interactive yet. This is about parameterizing the initial render from the URL, not wiring `onChange`.
- [ ] Do a final pass confirming: Dashboard, People & Locations, and Timeline are fully React, none of them use `innerHTML` or manual DOM creation anywhere, and all three are reachable via real, bookmarkable routes.

**Questions** (depend on the tasks above)

- [ ] Why is reading a query parameter once, on initial render, still consistent with this exercise's "no state beyond what's necessary to render the initial view" rule? What would cross the line into "real interactivity" that's out of scope until Exercise 5?
- [ ] What would you need to add to make Timeline's filters *actually* filter the list when a user changes them? (You don't have to build it. Just name the concept you'd need)
- [ ] Across the 3 views you've now fully migrated, what's one piece of duplicated logic or markup you noticed but didn't extract yet? Why didn't you, and would you if you had more time?

---
