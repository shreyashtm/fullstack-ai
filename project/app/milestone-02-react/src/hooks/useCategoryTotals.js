// Concept: react.use-memo
//
// Must NOT recompute on every render — only when `expenses` actually
// changes. Compare to Milestone 1's closure-based totals.js: same goal
// (avoid redundant recomputation), different mechanism (React's memoization
// instead of a hand-rolled closure).

import { useMemo } from "react";

export function useCategoryTotals(expenses) {
  return useMemo(() => {
    // TODO: reduce expenses into { [category]: totalAmount }
    return {};
  }, [expenses]);
}
