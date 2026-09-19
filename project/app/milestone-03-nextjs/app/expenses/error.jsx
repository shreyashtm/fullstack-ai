"use client"; // error.js boundaries are always Client Components — required by Next.js

export default function Error({ error, reset }) {
  return (
    <div>
      <p>Something went wrong loading expenses.</p>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
