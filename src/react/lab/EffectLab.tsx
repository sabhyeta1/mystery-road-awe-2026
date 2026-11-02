import { useEffect, useState } from "react";

// EXPERIMENT (Exercise 6, Demo 2): shows how often each kind of effect runs.
// To run it live: render <EffectLab /> inside AppHeader and open the browser console.
export function EffectLab() {
  const [count, setCount] = useState(0);
  const [other, setOther] = useState(0);

  // A) No dependency array: runs after EVERY render.
  useEffect(() => {
    console.log("A (no array): ran");
  });

  // B) Empty array: runs after the first render only.
  useEffect(() => {
    console.log("B (empty array): ran");
  }, []);

  // C) Populated array: runs after the first render and whenever `count` changes.
  useEffect(() => {
    console.log("C ([count]): ran, count is " + count);
  }, [count]);

  return (
    <div>
      <button type="button" onClick={() => setCount(count + 1)}>
        count: {count}
      </button>{" "}
      <button type="button" onClick={() => setOther(other + 1)}>
        other: {other}
      </button>
    </div>
  );
}
