// Concepts: js.arrays, js.objects, js.destructuring, js.spread-rest
//
// In-memory expense list + CRUD. Every function here must return a NEW
// array/object, never mutate the existing one in place (see the
// milestone's Constraints section for why).
//
// Shape of one expense object:
//   { id: string, amount: number, category: string, note: string, date: string }

let expenses = [];

/** Replace the current in-memory list wholesale (used by storage.js on load). */
export function setExpenses(loaded) {
  // TODO
}

/** @returns {Array} the current expense list (read-only view). */
export function getExpenses() {
  // TODO
}

/**
 * Add a new expense. Generate an id however you like (timestamp, random,
 * whatever) — just make it unique.
 * @param {{amount: number, category: string, note: string, date: string}} input
 * @returns {Array} the new full expense list
 */
export function addExpense(input) {
  // TODO: build the new expense object, produce a new array, store it, return it
}

/**
 * Update an existing expense by id. `changes` is a partial object —
 * only the fields being changed.
 * @param {string} id
 * @param {object} changes
 * @returns {Array} the new full expense list
 */
export function updateExpense(id, changes) {
  // TODO
}

/**
 * Remove an expense by id.
 * @param {string} id
 * @returns {Array} the new full expense list
 */
export function removeExpense(id) {
  // TODO
}
