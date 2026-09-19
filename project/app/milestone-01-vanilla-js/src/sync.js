// Concepts: js.promises, js.async-await, js.event-loop, js.error-handling
//
// Simulated "cloud sync" — no real network call. Must behave like a real
// async operation would: takes time, can fail, and must not block the
// caller while pending (see Reasoning Question 3).

/**
 * Simulates syncing one expense to "the cloud." ~500ms delay, ~20% chance
 * of rejecting instead of resolving.
 * @param {object} expense
 * @returns {Promise<object>} resolves with the expense on success
 */
export function syncExpense(expense) {
  // TODO: return a new Promise that setTimeout's ~500ms, then
  // Math.random() < 0.2 ? reject(...) : resolve(expense)
}

/**
 * Called by ui.js after every add. Must log when the sync starts and when
 * it finishes (success or failure), using async/await — and must NOT make
 * the caller wait for it before returning (fire-and-forget from the UI's
 * perspective, but still log the outcome when it lands).
 * @param {object} expense
 */
export async function syncExpenseAndLog(expense) {
  // TODO
}
