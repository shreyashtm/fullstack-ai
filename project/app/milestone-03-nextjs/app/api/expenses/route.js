// Concept: next.data-fetching — stands in as "the backend" until Milestone 4/5
// replace it with a real separate server. In-memory or a local JSON file — your choice.

let expenses = [];

export async function GET() {
  // TODO: return Response.json(expenses)
}

export async function POST(request) {
  // TODO: read body via request.json(), push a new expense, return 201
}
