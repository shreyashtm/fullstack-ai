// Concepts: js.error-handling, js.arrays/js.objects (via JSON), js.functions
//
// localStorage load/save. Must not crash the app if localStorage is empty,
// missing, or holds corrupted JSON (see Reasoning Question 4).

const STORAGE_KEY = "expense-tracker.expenses";

/**
 * Load expenses from localStorage.
 * @returns {Array} the loaded list, or [] if nothing valid is stored
 */
export function loadExpenses() {
  // TODO: read STORAGE_KEY, JSON.parse it, handle the failure case
}

/**
 * Persist the given expense list to localStorage.
 * @param {Array} expenses
 */
export function saveExpenses(expenses) {
  // TODO
}
