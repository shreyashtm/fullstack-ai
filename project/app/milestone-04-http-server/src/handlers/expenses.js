// Concepts: backend.json (manual body parsing), backend.http-methods-status-codes
//
// In-memory store is fine here — persistence is Milestone 6's job.

let expenses = [];

/** Collect and JSON.parse a request body — no body-parser. */
function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    // TODO: collect 'data' chunks, JSON.parse on 'end', reject on parse error
  });
}

export async function list(req, res) {
  // TODO: 200 + JSON array
}

export async function create(req, res) {
  // TODO: readJsonBody, push, 201 + created expense
}

export async function update(req, res, id) {
  // TODO: readJsonBody, patch matching expense, 200, or 404 if not found
}

export async function remove(req, res, id) {
  // TODO: filter out matching id, 204, or 404 if not found
}
