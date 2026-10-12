import { useEffect, useState } from "react";
import { VIEWS } from "./views";
import type { ViewName } from "./views";

function isViewName(value: string): value is ViewName {
  return VIEWS.some((view) => view.name === value);
}

function readViewFromHash(): ViewName {
  const requested = window.location.hash.replace("#", "");
  return isViewName(requested) ? requested : "dashboard";
}

export function useHashView(): [ViewName, (view: ViewName) => void] {
  const [currentView, setCurrentView] = useState<ViewName>(readViewFromHash);

  useEffect(() => {
    function handleHashChange() {
      setCurrentView(readViewFromHash());
    }
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  function navigateTo(view: ViewName) {
    window.location.hash = view;
  }

  return [currentView, navigateTo];
}
