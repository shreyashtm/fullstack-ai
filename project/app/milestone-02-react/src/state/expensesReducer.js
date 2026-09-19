// Concepts: react.use-reducer, js.spread-rest, js.objects
//
// Actions: { type: "add", payload: {...} } | { type: "update", payload: { id, changes } }
// | { type: "remove", payload: { id } } | { type: "load", payload: [...] }
//
// Every branch must return a NEW array — same immutability discipline as
// Milestone 1's state.js, now load-bearing: React decides whether to
// re-render by comparing the reducer's return value.

export const initialExpenses = [];

export function expensesReducer(state, action) {
  switch (action.type) {
    case "load":
      // TODO
      return state;
    case "add":
      // TODO
      return state;
    case "update":
      // TODO
      return state;
    case "remove":
      // TODO
      return state;
    default:
      return state;
  }
}
