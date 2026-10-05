export function getEl<T extends HTMLElement = HTMLElement>(id: string): T {
  const el = document.querySelector<T>("#" + id);
  if (el === null) {
    throw new Error("Element #" + id + " was not found in the page");
  }
  return el;
}
