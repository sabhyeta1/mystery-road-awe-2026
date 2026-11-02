import { useEffect, useState } from "react";

export type FetchState<T> =
  { status: "loading" } | { status: "error"; message: string } | { status: "ready"; data: T };

export interface FetchResult<T> {
  state: FetchState<T>;
  // Which load produced the data that is currently held: 1 = first load, 2 = after the first
  // reload, and so on. null while there is no data.
  loadNumber: number | null;
  // Fetches the URL again.
  reload: () => void;
}

// DEMO SWITCH (Exercise 6, Demo 7): true = obsolete requests are cancelled and their results
// are ignored. Set it to false ONLY to demonstrate the request race, then set it back to true.
const CANCEL_OBSOLETE_REQUESTS = true;

// A reusable custom hook: fetches JSON from a URL and keeps track of loading, error and result.
// "Empty" is not a separate status: it is a ready state whose data happens to be empty (for
// example a list with length 0), so the component that knows what "empty" means decides.
export function useFetch<T>(url: string): FetchResult<T> {
  const [state, setState] = useState<FetchState<T>>({ status: "loading" });
  const [loadNumber, setLoadNumber] = useState<number | null>(null);
  const [reloadCount, setReloadCount] = useState(0);

  // Runs on mount, and again whenever the url changes or a reload is requested.
  useEffect(() => {
    // This run's "cancel button". Its signal is handed to fetch.
    const controller = new AbortController();
    const isObsolete = () => CANCEL_OBSOLETE_REQUESTS && controller.signal.aborted;

    async function load(): Promise<void> {
      try {
        // cache: "no-store" = always ask the server. A reload must really reload, and the
        // browser must not make a second identical request wait for the first one.
        const response = await fetch(url, {
          signal: CANCEL_OBSOLETE_REQUESTS ? controller.signal : undefined,
          cache: "no-store",
        });
        if (!response.ok) {
          throw new Error("Could not load " + url + " (status " + response.status + ")");
        }
        const data = (await response.json()) as T;
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

    // React calls this when the effect is replaced (new url, reload) or the component unmounts.
    return () => {
      controller.abort();
    };
  }, [url, reloadCount]);

  function reload(): void {
    setReloadCount((previous) => previous + 1);
  }

  return { state, loadNumber, reload };
}
