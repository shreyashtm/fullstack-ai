// DEBUGGING CHALLENGE — see the milestone doc. This file is marked
// "use client" AND tries to read a server-only env var + do a fetch
// directly in the component body. Both are wrong for a Client Component.
// Reason about why before restructuring it into a Server Component
// (doing the fetch + reading EXPENSE_API_SECRET) rendering a small
// Client Component child for whatever actually needs interactivity.
"use client";

export default async function ExpensesPage() {
  const secret = process.env.EXPENSE_API_SECRET; // will read as undefined in the browser
  const res = await fetch("/api/expenses", {
    headers: { Authorization: `Bearer ${secret}` },
  });
  const expenses = await res.json();

  return (
    <ul>
      {expenses.map((e) => (
        <li key={e.id}>
          {e.category} — {e.amount}
        </li>
      ))}
    </ul>
  );
}
