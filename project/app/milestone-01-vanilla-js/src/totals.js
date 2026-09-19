// Concept: js.scope-and-closures (Reason), js.functions
//
// Category totals MUST be computed through a closure factory, not a plain
// object recomputed from scratch on every call. See Reasoning Question 2:
// what does the closure keep private that a plain object wouldn't?

/**
 * Factory: returns an object of functions that share private state via
 * closure — the private state itself must not be reachable from outside
 * except through the returned functions.
 *
 * Suggested shape (feel free to adjust names, keep the closure discipline):
 *   const tracker = createCategoryTotalTracker();
 *   tracker.recompute(expenses);      // rebuild totals from the full list
 *   tracker.getTotals();              // -> { food: 42.50, rent: 1200 }
 *   tracker.getTotalFor("food");      // -> 42.50
 */
export function createCategoryTotalTracker() {
  // TODO: private state lives in this closure, not on the returned object
  return {
    recompute(expenses) {
      // TODO
    },
    getTotals() {
      // TODO
    },
    getTotalFor(category) {
      // TODO
    },
  };
}
