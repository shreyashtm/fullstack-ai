// Concepts: react.forms, react.event-handling, react.conditional-rendering

import { useState } from "react";
import { useExpenses } from "../state/ExpensesContext.jsx";

export function ExpenseForm() {
  const { dispatch } = useExpenses();
  const [error, setError] = useState(null);
  // TODO: controlled inputs for amount/category/note/date

  function handleSubmit(e) {
    e.preventDefault();
    // TODO: validate, dispatch({ type: "add", payload: ... }) or setError(...)
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* TODO: inputs */}
      {error && <p role="alert">{error}</p>}
      <button type="submit">Add expense</button>
    </form>
  );
}
