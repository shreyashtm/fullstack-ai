// Concepts: react.use-context, react.context-api, react.use-reducer
//
// Wraps useReducer(expensesReducer) and exposes { expenses, dispatch }
// through context, so components read/update expenses without prop
// drilling past one level (see the milestone's Constraints).

import { createContext, useContext, useReducer } from "react";
import { expensesReducer, initialExpenses } from "./expensesReducer.js";

const ExpensesContext = createContext(null);

export function ExpensesProvider({ children }) {
  const [expenses, dispatch] = useReducer(expensesReducer, initialExpenses);

  // TODO: provide { expenses, dispatch } via ExpensesContext.Provider
  return <ExpensesContext.Provider value={null}>{children}</ExpensesContext.Provider>;
}

export function useExpenses() {
  const ctx = useContext(ExpensesContext);
  // TODO: throw if ctx is null (used outside the provider) — a real bug class worth guarding
  return ctx;
}
