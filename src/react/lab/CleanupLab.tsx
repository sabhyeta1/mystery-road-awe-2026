import { useEffect, useState } from "react";

interface TickerProps {
  withCleanup: boolean;
  intervalMs: number;
}

function Ticker({ withCleanup, intervalMs }: TickerProps) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    console.log("EFFECT: timer started, every " + intervalMs + " ms");
    const intervalId = window.setInterval(() => {
      console.log("tick");
      setSeconds((previous) => previous + 1);
    }, intervalMs);

    // Without cleanup, the function returns nothing and the timer is never stopped.
    return withCleanup
      ? () => {
          console.log("CLEANUP: timer stopped");
          window.clearInterval(intervalId);
        }
      : undefined;
  }, [withCleanup, intervalMs]);

  return <p>Ticks counted: {seconds}</p>;
}

// EXPERIMENT (Exercise 6, Demo 3): shows what cleanup does, with and without it.
// To run it live: render <CleanupLab /> inside AppHeader and open the browser console.
export function CleanupLab() {
  const [visible, setVisible] = useState(true);
  const [withCleanup, setWithCleanup] = useState(true);
  const [fast, setFast] = useState(false);

  return (
    <div>
      <button type="button" onClick={() => setVisible(!visible)}>
        {visible ? "Hide ticker (unmount)" : "Show ticker (mount)"}
      </button>{" "}
      <button type="button" onClick={() => setFast(!fast)}>
        Speed: {fast ? "fast" : "slow"}
      </button>{" "}
      <label>
        <input
          type="checkbox"
          checked={withCleanup}
          onChange={(event) => setWithCleanup(event.target.checked)}
        />{" "}
        with cleanup
      </label>
      {visible && (
        <Ticker
          key={String(withCleanup)}
          withCleanup={withCleanup}
          intervalMs={fast ? 250 : 1000}
        />
      )}
    </div>
  );
}
