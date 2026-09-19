// Concept: react.fundamentals — composition root

import { useExpenses } from "./state/ExpensesContext.jsx";
import { useCategoryTotals } from "./hooks/useCategoryTotals.js";
import { useCloudSync } from "./hooks/useCloudSync.js";
import { ExpenseForm } from "./components/ExpenseForm.jsx";
import { ExpenseList } from "./components/ExpenseList.jsx";
import { CategoryTotals } from "./components/CategoryTotals.jsx";

export default function App() {
  const { expenses } = useExpenses();
  const totals = useCategoryTotals(expenses);
  useCloudSync(expenses[expenses.length - 1] ?? null);

  return (
    <main>
      <h1>Expense Tracker</h1>
      <ExpenseForm />
      <h2>Totals by category</h2>
      <CategoryTotals totals={totals} />
      <h2>Expenses</h2>
      <ExpenseList />
    </main>
  );
}
