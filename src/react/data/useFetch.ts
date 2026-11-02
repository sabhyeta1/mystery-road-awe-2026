import { useEffect, useState } from "react";

export type FetchState<T> =
  { status: "loading" } | { status: "error"; message: string } | { status: "ready"; data: T };

export interface FetchResult<T> {
  state: FetchState<T>;
  // Which load produced the data that is currently held: 1 = first load, 2 = after the first
  // reload, and so on. null while there is no data.
  loadNumber: number | null;
  // Fetches the data again.
  reload: () => void;
}

// DEMO SWITCH (Exercise 6, Demo 7): true = obsolete requests are cancelled and their results
// are ignored. Set it to false ONLY to demonstrate the request race, then set it back to true.
const CANCEL_OBSOLETE_REQUESTS = true;

// Application-logic layer: a reusable custom hook that runs a fetch function and keeps track of
// loading, error and result. It does not know any URL and never calls fetch itself; it only
// calls the function it is given (one of the functions from src/react/api/).
//
// The fetcher must be a stable function (declared once at module level), not an inline arrow
// function: it is a dependency of the effect, and a new function on every render would start a
// new request on every render.
//
// "Empty" is not a separate status: it is a ready state whose data happens to be empty (for
// example a list with length 0), so the component that knows what "empty" means decides.
export function useFetch<T>(fetcher: (signal?: AbortSignal) => Promise<T>): FetchResult<T> {
  const [state, setState] = useState<FetchState<T>>({ status: "loading" });
  const [loadNumber, setLoadNumber] = useState<number | null>(null);
  const [reloadCount, setReloadCount] = useState(0);

  // Runs on mount, and again whenever the fetcher changes or a reload is requested.
  useEffect(() => {
    // This run's "cancel button". Its signal is handed to the fetcher.
    const controller = new AbortController();
    const isObsolete = () => CANCEL_OBSOLETE_REQUESTS && controller.signal.aborted;

    async function load(): Promise<void> {
      try {
        const data = await fetcher(CANCEL_OBSOLETE_REQUESTS ? controller.signal : undefined);
        if (isObsolete()) return;
        setState({ status: "ready", data });
        setLoadNumber(reloadCount + 1);
      } catch (err) {
        // An aborted request is not an error, it is simply no longer wanted.
        if (isObsolete()) return;
        const message = err instanceof Error ? err.message : String(err);
        setState({ status: "error", message });
        setLoadNumber(null);
      }
    }

    void load();

    // React calls this when the effect is replaced (new fetcher, reload) or the component unmounts.
    return () => {
      controller.abort();
    };
  }, [fetcher, reloadCount]);

  function reload(): void {
    setReloadCount((previous) => previous + 1);
  }

  return { state, loadNumber, reload };
}
