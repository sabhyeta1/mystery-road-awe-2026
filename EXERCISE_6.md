# Exercise 6 — Effects, Data Fetching & a Backend

This is the sixth exercise in Advanced Web Engineering Course (CSDC). It builds on Exercises 3–5. All 5 views should already be fully working in React, reading their data from the static `data/*.json` files. This exercise replaces those static files with a small **Node.js backend**, and uses that to properly teach effects, loading/error/empty states, and request cancellation. Things that are hard to demonstrate convincingly against files that can only ever be "instant" or
"404."

**Scope of the backend, deliberately kept small:** a minimal Node server (Express or equivalent) that serves the same 5 JSON files as **read-only** REST endpoints. No write endpoints, no persistence. Bookmarks, notes, and the hypothesis draft stay in `localStorage` exactly as before. Only *reading* the case data moves to the network. **The backend runs locally in development only, it is not deployed.** Exercise 2's GitHub Pages workflow still builds and deploys the static frontend. Wiring up a real deployed backend is out of scope here.


## Corresponding manuscript reading

The closest corresponding sections in the course manuscript:

- **Chapter 6, Promises, `async`/`await`, and Error Flow** — especially error handling, cleanup, cancellation, and relevance, PDF pp. 47–52
- **Chapter 13, Rendering and Navigation Architectures** — “SPA communication flow” and “State in long-lived applications,” PDF pp. 91–93
- **Chapter 15, React Foundations** — “Function components and purity” and “React owns its root DOM,” PDF pp. 104 and 108
- **Chapter 16, React Component Design and Routing** — “Conditional rendering,” PDF p. 110


## Self-Check

The exercise is organized into 10 individual tasks with corresponding questions, that are
presented in class.
These checkboxes are for self-checking. Don't forget to do the actual checking of tasks you are able to present in the Moodle course. **Before class, tick only what you can genuinely demonstrate or answer on the spot, live.**

| # | Demo | Ready? |
|---|---|---|
| 1 | Render logic vs. effects | ☐ |
| 2 | `useEffect` mental model & dependency arrays | ☐ |
| 3 | Cleanup: timers & subscriptions | ☐ |
| 4 | Build the read-only Node backend | ☐ |
| 5 | Consume the backend from React | ☐ |
| 6 | Loading, error, and empty states | ☐ |
| 7 | Request races & cancellation | ☐ |
| 8 | Extract a reusable custom hook | ☐ |
| 9 | Separate UI, application logic, and API access | ☐ |
| 10 | Data-flow wrap-up & a written UX decision | ☐ |
---

## Demo 1 — Render logic vs. effects

**Tasks**

- [x] Find (or deliberately write, then remove) an example of a **side effect performed directly
during a component's render**. For example, mutating a variable outside the component,
calling `console.log` for debugging on every render, or reading `localStorage` inline in the
function body instead of in an effect, and explain why it's a side effect even though it
"seems to work."

I deliberately wrote a side effect into AppHeader’s render. I added a module-level renderCount variable, incremented it on every call, and logged it. It looks harmless and nothing crashes, but it is a side effect because the function changes something outside itself (a variable and the console) instead of only returning JSX. The visible proof was that the counter went up by about twice what I expected. I then removed it.

- [x] Write, in your own words, a short rule for what belongs in render versus what belongs in an effect.

Render only calculates JSX from props and state, and must be repeatable with no outside changes. Anything that talks to the outside world (requests, timers, storage, document title, logging) goes in an event handler when the user triggers it, or in an effect when it has to stay in sync with the screen

**Questions** (depend on the tasks above)

- [x] Why can React call a component's render function more than once, or at times you don't
expect (e.g. in development with Strict Mode)? What would go wrong with the side-effect
example you found if render ran twice?

React may call render more than once, and I can’t control when. In development, Strict Mode deliberately calls it twice to catch impure components. React also re-renders whenever state, props or context change, or when the parent re-renders, and it may start a render and throw it away. So render must be safe to repeat. In my example the counter was incremented twice per render, so it showed a wrong number. With something worse, like sending analytics or appending to an outside array, I’d get duplicated analytics events or a list that keeps growing.

- [x] Is calculating a derived value (like the filtered evidence list from Exercise 5) a side
effect? Why or why not, and how does that distinction inform the rule you wrote?

No. Calculating the filtered evidence list only reads props and state and returns a new value. It changes nothing outside the function, and the same inputs always give the same output, so running it twice is harmless. That is the test behind my rule: if it only computes a result from inputs, it stays in render. If it changes or reads something outside the function in a way that matters, it is a side effect and needs an event handler or an effect

---

## Demo 2 — `useEffect` mental model & dependency arrays

**Tasks**

- [x] Write a small `useEffect` example (can be a throwaway one first) with an empty dependency
array, one with a populated dependency array, and one with no array at all, and observe how
often each one actually runs.

I wrote EffectLab with three effects: one with no array (A), one with [] (B) and one with [count] (C). On load, all three ran, twice each because of Strict Mode in development. Clicking ‘other’ only re-ran A. Clicking ‘count’ re-ran A and C. B never ran again.

- [x] Find a real, justified use for `useEffect` you'll need in this app (loading data is coming in Demo 5, so pick something else — e.g. syncing the document title to the current view).


I keep the browser tab title in sync with the current view, e.g. ‘Evidence – Project ReMotion’. This is justified because document.title lives outside what React renders, in the page’s <head>, and it has to follow the route as it changes, so it needs an effect

**Questions** (depend on the tasks above)

- [x] What does React actually compare, between renders, to decide whether to re-run an effect with a populated dependency array? What happens if you omit a value your effect actually uses from that array?

After each render, React compares every value in the dependency array to its value from the previous render, using Object.is. Primitives like strings are compared by value, while objects and arrays are compared by reference. If any value differs, React runs the previous effect’s cleanup and then the effect again. If I omit a value the effect uses, the effect doesn’t re-run when it changes and keeps working with the old value. I showed this by changing [title] to []: the tab title got stuck on the first page.

- [x] What's the difference, in practice, between `useEffect(fn, [])` and just writing `fn()` directly in the component body? Why doesn't the second one work the way you'd expect for "run once"?

A call in the component body runs on every render, so it can’t mean ‘once.’ It also runs during render, which makes it a side effect in the wrong place: it’s repeated, and it runs before the screen is updated. useEffect(fn, []) is run by React after the render has been committed to the screen, and only on mount. In development Strict Mode adds one extra check run. It can also return a cleanup function, which a plain call can’t


---

## Demo 3 — Cleanup: timers & subscriptions

**Tasks**

- [x] Implement at least one effect that sets up something needing cleanup (a `setTimeout`/
`setInterval`, a `window` event listener, or similar) and returns a proper cleanup function.

My real effect adds a keydown listener on window in EvidenceDetail so that Escape closes the detail, and it returns a cleanup that calls removeEventListener. In CleanupLab I also wrote a setInterval ticker whose cleanup calls clearInterval

- [x] Demonstrate what happens (e.g. via a console log in both the effect and its cleanup) when the component unmounts or the dependencies change, with and without the cleanup function present.

With cleanup, hiding the ticker logged CLEANUP: timer stopped and the ticks stopped. Changing the speed logged CLEANUP and then EFFECT, so the old timer was stopped before the new one started. Without cleanup, there was no CLEANUP log. The counter went up by 2 per second right after mounting, because Strict Mode ran the effect twice and the first timer was never stopped. After hiding the ticker, tick kept appearing in the console, and after showing it again the ticks piled up.

**Questions** (depend on the tasks above)

- [x] What actually calls your cleanup function, and when? Name at least two distinct situations that trigger it.

React calls the cleanup function, not me. There are at least two situations. First, when the component unmounts, for example when it is hidden, I navigate away, or its key changes. Second, right before the effect re-runs because a dependency changed. The cleanup of the previous run happens first, so you saw CLEANUP followed by EFFECT when I changed the speed. In development Strict Mode also triggers it once as a simulated unmount


- [x] What real, observable bug would you get in this app if you set up a subscription/timer in an effect but forgot the cleanup function? Be specific, not just "a memory leak."

In the lab, the specific bug is that a timer keeps running after the component is gone, and timers pile up: each remount adds another one. Applied to this app, if I forgot to remove the Escape listener, every evidence item I opened would leave another keydown listener on window. After closing or leaving the Evidence page, they would all still fire on every Escape press, each holding old props in memory. Pressing Escape would run all of them, and I can prove it by adding a console.log to the handler, which would print once per item I ever opened


---

## Demo 4 — Build the read-only Node backend

**Tasks**

- [x] Set up a minimal Node.js server (Express or equivalent) with one GET endpoint per data
resource (case, evidence, people, locations, timeline), each returning the same shape of data

I built an Express server in server/index.js with five GET endpoints: /api/case, /api/evidence, /api/people, /api/locations and /api/timeline. Each reads the matching file from public/data and sends it back, so the shape of the data is identical to the JSON files.

as the corresponding `data/*.json` file does today.
- [x] Add a way to deliberately simulate real-world conditions for testing later demos: an artificial delay (configurable, e.g. via a query param or env var) on at least one endpoint, and a way to make one endpoint return an error response (e.g. a 500) on demand.

For delay, I can open /dev/settings?delay=3000 to slow every response down while the server is running, or add ?delay=2000 to a single request, or set API_DELAY_MS when starting the server. For errors, /dev/settings?fail=evidence makes /api/evidence return an HTTP 500 with a JSON error message, and ?fail=1 does it for one request. fail=none switches it off.

- [x] Confirm the server runs locally alongside `vite dev` and is documented (a README section is enough) as dev-only (not part of the Exercise 2 deploy pipeline).

I run npm run dev in one terminal and npm run server in a second one. The README has a ‘Backend (development only)’ section explaining this. I did not touch the deploy workflow. It still only runs the build and publishes the static frontend, and Express is only a dev dependency


**Questions** (depend on the tasks above)

- [x] Why does this exercise ask for artificial delay/error controls on the backend, instead of just pointing the frontend at the static JSON files directly (as it already could)? What could you *not* teach convincingly without them?

Static JSON files are always instant and either exist or return a 404, so I could not show a loading state because it would be over in milliseconds, and I could only show an error by breaking a file. I also couldn’t create a request race, because that needs one request to be slower than another one. The delay and error controls let me create slow responses and failures on demand and reproduce them every time. That is what makes the loading state, error state, race conditions and cancellation demonstrable.

- [x] What is CORS, and did you have to deal with it running your frontend (from Vite's dev server) against this separate backend server? If yes, what did you configure and why? If no, why not?

CORS stands for Cross-Origin Resource Sharing. Browsers apply the same-origin policy: JavaScript on one origin (scheme, host and port) may not read responses from another origin unless that server allows it with headers like Access-Control-Allow-Origin. My frontend runs on localhost:5173 and my backend on 127.0.0.1:3001, which are different origins. I didn’t have to configure CORS, because Vite’s dev server proxies every /api request. The browser only talks to localhost:5173, and Vite forwards the request to the backend itself. CORS is a rule enforced by browsers, so a server-to-server request isn’t affected. The alternative would have been to call port 3001 directly and add the CORS header to the server. The proxy only exists in the dev server, which is one more reason this setup isn’t deployable


---

## Demo 5 — Consume the backend from React

**Tasks**

- [x] Replace at least one view's data source (previously the static `data/*.json` fetch/import) with a real `fetch()` call to your new backend, wired up inside a `useEffect`.
- [x] Do the same for the rest of the app's data sources, so the whole app now reads from your backend rather than static files.

**Questions** (depend on the tasks above)

- [x] Walk through exactly what happens, in order, from the component mounting to the data actually being available to render: what does the effect do, when does it run, and what causes the component to re-render once the data arrives?

First, the component renders for the first time with the initial state { status: 'loading' }, so the views show their loading text. Then React puts that on the screen. After that, React runs the effect, once, because the dependency array is empty. The effect starts five fetch() calls with Promise.all, and the page keeps working while they are in flight. When all five answers have arrived, the .then callback runs and calls setLoadState with status: 'ready' and the data. Calling a state setter is what makes React render again, so App re-renders with the data and passes it down to the views, which now show the real content. In development, Strict Mode runs the effect twice, which is why the server log shows ten requests. The first run is cleaned up and its result is ignored through the cancelled flag

- [x] What's different about your component now compared to before (when data came from a static
import/fetch of a local file). Specifically in terms of what state it needs to track that it
didn't need before?

With a static import, the data is already there at the first render, so the component just uses a constant and needs no state. With fetch(), the data arrives later, so the first render has no data. The component has to track three things: a status that says whether it is loading, failed or ready, the data itself once it is ready, and an error message if it failed. I keep them together in one LoadState value. My app was already fetching the local files since Exercise 3, so it already had this state. What changed is that these states are now real and visible, because the server can be slow or fail.


---

## Demo 6 — Loading, error, and empty states

**Tasks**

- [ ] For at least one view, implement all three states explicitly: a loading indicator while the fetch is pending, a real error message if it fails (using your backend's on-demand error endpoint from Demo 4 to trigger it live), and a distinct "no data" empty state if the response is successful but contains nothing.
- [ ] Make sure these three states are visually and structurally distinguishable from each other, not all three collapsing into "shows nothing."

**Questions** (depend on the tasks above)

- [ ] Trigger your backend's error endpoint live and show the error state appearing. What state variable(s) are you tracking to distinguish "loading," "error," and "loaded successfully but empty" from each other?
- [ ] The original vanilla app had a bug where a failed fetch could leave a loading spinner stuck forever because the cleanup/hide-loading step was never called on the error path. Explain specifically how your React version's state management makes that particular mistake
harder to make (or show that it doesn't, and fix it).

---

## Demo 7 — Request races & cancellation

**Tasks**

- [ ] Using your backend's artificial-delay control, construct a request race: trigger a request, then trigger another one (for the same data) before the first resolves, and observe
what happens if you do nothing special about it. Does the UI ever show a result from the
*older* request after a newer one already resolved?
- [ ] Fix it using `AbortController` (or a request-id/"ignore stale response" guard, your choice), so the UI can never show a stale result.

**Questions** (depend on the tasks above)

- [ ] Reproduce the race live (with artificial delay dialed up) before your fix, then show the fix preventing it. What exact sequence of events causes the stale result to win without the fix?
- [ ] `AbortController` cancels the *request*. Does the effect's cleanup function run separately, or is aborting the fetch itself what you're doing inside the cleanup? Explain how the two connect in your implementation.

---

## Demo 8 — Extract a reusable custom hook

**Tasks**

- [ ] Extract the data-fetching logic (loading/error/empty state, the effect, cancellation) you've built across Demos 5–7 into at least one reusable custom hook (e.g. `useFetch<T>(url)` or a more specific `useEvidence()`), and use it in at least two different places.

**Questions** (depend on the tasks above)

- [ ] What makes something a legitimate custom hook rather than just a regular helper function? What rule(s) does React enforce about how/where hooks (including your custom one) can be called?
- [ ] Show the two places using your hook. What did extracting it save you from duplicating, and is there anything about the two usages that *couldn't* be shared and had to stay specific to each call site?

---

## Demo 9 — Separate UI, application logic, and API access

**Tasks**

- [ ] Organize your data-fetching code into distinct layers: a thin API-access layer (raw `fetch` calls, knows the backend's URLs/shapes and nothing else), your custom hook(s) from Demo 8 (application logic: loading/error/cancellation), and your components (UI only, no direct `fetch` calls anywhere in a component).
- [ ] Confirm no component in the app calls `fetch` directly anymore.

**Questions** (depend on the tasks above)

- [ ] If your backend's endpoint URLs or response shape changed tomorrow, how many files would you need to touch, and which ones? Would any component need to change?
- [ ] What's the argument *against* this separation for a small app like this one? E.g. when would the extra layering be overkill rather than helpful? Do you think it's justified here?

---

## Demo 10 — Data-flow wrap-up & a written UX decision

**Tasks**

- [ ] Illustrate the full data flow for one piece of data, end to end: the JSON file -> your backend endpoint -> the API-access layer -> your custom hook -> the component -> what's on screen.
- [ ] Explain a short, honest justification for one loading/error/empty-state UX decision you made (e.g. what your loading indicator looks like, how errors are worded, what "empty" looks like) and note one thing you'd do differently with more time.

**Questions** (depend on the tasks above)

- [ ] Walk through your diagram/illustration live, and for one step, explain what would break (and how you'd notice) if that step silently stopped happening.
- [ ] Across Exercises 3–6, this app went from "read static files instantly" to "fetch from a real, sometimes-slow, sometimes-failing server". What did that change force you to add that wasn't needed before and was any of it needed *conceptually* even back when the data source was a static file, just less visible?

---
