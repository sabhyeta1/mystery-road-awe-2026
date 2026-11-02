import { useEffect } from "react";
import { useLocation } from "react-router";
import { VIEWS } from "./views";

const APP_NAME = "Project ReMotion";

// Keeps the browser tab title in sync with the current view.
export function useDocumentTitle(): void {
  const { pathname } = useLocation();

  // Pure calculation: stays in render (see the rule from Demo 1).
  const view = VIEWS.find((item) => pathname === item.path || pathname.startsWith(item.path + "/"));
  const title = view ? view.label + " – " + APP_NAME : "Page not found – " + APP_NAME;

  // Side effect: changing something outside React, so it goes in an effect.
  useEffect(() => {
    document.title = title;
  }, [title]);
}
