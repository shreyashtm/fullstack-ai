// Concepts: js.functions, js.destructuring, js.arrays (map/forEach), plus
// the js.scope-and-closures Debugging Challenge below — read the milestone
// doc before touching renderExpenseList.

/**
 * Render the totals section from a totals object like { food: 42.5 }.
 * @param {object} totals
 */
export function renderTotals(totals) {
  // TODO
}

/**
 * Render the expense list. Each row needs an edit control and a delete
 * button wired to `onDelete(id)`.
 *
 * INTENTIONALLY IMPLEMENTED WITH A BUG — see the milestone's Debugging
 * Challenge section before fixing this. Reason about it first.
 *
 * @param {Array} expenses
 * @param {(id: string) => void} onDelete
 */
export function renderExpenseList(expenses, onDelete) {
  const list = document.getElementById("expense-list");
  list.innerHTML = "";

  for (var i = 0; i < expenses.length; i++) {
    const row = document.createElement("li");
    row.textContent = `${expenses[i].category} — ${expenses[i].amount}`;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => {
      onDelete(expenses[i].id);
    });

    row.appendChild(deleteButton);
    list.appendChild(row);
  }
}

/**
 * Wire the add-expense form's submit event to `onAdd`.
 * @param {(input: {amount: number, category: string, note: string, date: string}) => void} onAdd
 */
export function bindExpenseForm(onAdd) {
  // TODO: preventDefault, read + destructure form fields, call onAdd, reset the form
}
