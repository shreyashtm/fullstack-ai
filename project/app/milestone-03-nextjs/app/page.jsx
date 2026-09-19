import Link from "next/link";

export default function Home() {
  return (
    <main>
      <h1>Expense Tracker</h1>
      <p>
        <Link href="/expenses">Expenses</Link> · <Link href="/categories">Categories</Link>
      </p>
    </main>
  );
}
