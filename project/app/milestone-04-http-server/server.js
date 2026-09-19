// Concepts: backend.http-basics, backend.request-response-lifecycle
//
// Raw http.createServer — no framework. Composes the middleware chain
// from src/middleware.js (which has a seeded bug, see the milestone doc)
// and dispatches to src/router.js.

import { createServer } from "node:http";
import { middlewareChain } from "./src/middleware.js";
import { handleRequest } from "./src/router.js";

const server = createServer((req, res) => {
  // TODO: run req/res through middlewareChain, then handleRequest
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Milestone 4 server listening on :${PORT}`));
