// Concepts: react.reusable-components, react.rerender-optimization
//
// Wrapped in React.memo on purpose — this row should only re-render when
// ITS OWN props change, not whenever any unrelated expense changes.
// Whether that actually holds depends entirely on the identity of the
// `onDelete` prop it's given — see ExpenseList.jsx and the milestone's
// Debugging Challenge. Don't edit this file to fix the bug — the bug
// lives in how ExpenseList calls this component, not in here.

import { memo } from "react";

function ExpenseRowImpl({ expense, onDelete }) {
  return (
    <li>
      {expense.category} — {expense.amount}
      <button onClick={() => onDelete(expense.id)}>Delete</button>
    </li>
  );
}

export const ExpenseRow = memo(ExpenseRowImpl);
