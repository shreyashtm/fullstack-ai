// Concepts: backend.rest-apis, backend.http-methods-status-codes
//
// Method + path -> handler dispatch. No framework routing — match req.method
// and req.url yourself.

import * as expenses from "./handlers/expenses.js";

export function handleRequest(req, res) {
  // TODO: route GET/POST /expenses and PATCH/DELETE /expenses/:id to handlers/expenses.js,
  // return 404 for anything else
}
