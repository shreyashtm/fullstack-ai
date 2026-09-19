// Concept: react.props (pure presentational component, receives totals as a prop)

export function CategoryTotals({ totals }) {
  const entries = Object.entries(totals);
  if (entries.length === 0) {
    return <p>No expenses yet.</p>; // react.conditional-rendering
  }
  return (
    <ul>
      {entries.map(([category, amount]) => (
        <li key={category}>
          {category}: {amount}
        </li>
      ))}
    </ul>
  );
}
