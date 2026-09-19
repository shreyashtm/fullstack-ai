// Concepts: next.app-router (dynamic segment), next.server-client-components,
// next.data-fetching
//
// Server Component: fetch this one expense, then render an interactive
// edit form (a separate "use client" component) as a child.

export default async function ExpenseDetailPage({ params }) {
  // TODO: fetch(`/api/expenses/${params.id}`), render details + <EditExpenseForm />
  return <p>TODO: expense {params.id}</p>;
}
