// Concept: react.rerender-optimization — DEBUGGING CHALLENGE, see the milestone doc.
//
// This file is intentionally written the "obviously fine" way that
// silently defeats ExpenseRow's React.memo: `handleDelete(row.id)` below
// is wrapped in a fresh arrow function on every ExpenseList render, so
// every ExpenseRow receives a "new" onDelete prop every time — even
// though the function does the same thing every time. Reason about why
// that breaks memoization before changing it.

import { useExpenses } from "../state/ExpensesContext.jsx";
import { ExpenseRow } from "./ExpenseRow.jsx";

export function ExpenseList() {
  const { expenses, dispatch } = useExpenses();

  function handleDelete(id) {
    dispatch({ type: "remove", payload: { id } });
  }

  if (expenses.length === 0) {
    return <p>No expenses yet.</p>; // react.conditional-rendering
  }

  return (
    <ul>
      {expenses.map((row) => (
        <ExpenseRow key={row.id} expense={row} onDelete={() => handleDelete(row.id)} />
      ))}
    </ul>
  );
}
