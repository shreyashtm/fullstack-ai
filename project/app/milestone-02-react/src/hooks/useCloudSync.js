// Concepts: react.use-effect, react.use-callback, react.api-calls, react.use-ref
//
// Same simulated "cloud sync" behavior as Milestone 1's sync.js — ~500ms,
// ~20% failure rate — now triggered from an effect instead of called
// directly after a state update.

import { useCallback, useEffect, useRef } from "react";

function simulateSync(expense) {
  // TODO: port Milestone 1's sync.js logic here (Promise + setTimeout + random failure)
  return Promise.resolve(expense);
}

/**
 * @param {object|null} latestExpense - the most recently added expense, or null
 */
export function useCloudSync(latestExpense) {
  const inFlightCount = useRef(0); // react.use-ref: mutable, doesn't trigger re-render

  const sync = useCallback(async (expense) => {
    // TODO: increment/decrement inFlightCount.current around the sync call, log start/finish
  }, []);

  useEffect(() => {
    if (!latestExpense) return;
    // TODO: call sync(latestExpense) — think about what belongs in the dependency array and why
  }, [latestExpense, sync]);

  return { pendingCount: inFlightCount.current };
}
