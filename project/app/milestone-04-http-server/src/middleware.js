// Concepts: backend.middleware, backend.authentication-basics, backend.authn-vs-authz
//
// DEBUGGING CHALLENGE — see the milestone doc. This chain is registered
// logging -> route dispatch -> auth. Because auth runs AFTER dispatch,
// it never actually blocks an unauthorized request. Reason about why
// order matters here (nothing but plain function calls enforces it)
// before reordering.

const TOKEN = "dev-token-123";

function logging(req, res, next) {
  console.log(`${req.method} ${req.url}`);
  next();
}

function auth(req, res, next) {
  const header = req.headers["authorization"];
  if (!header) {
    res.writeHead(401, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "missing Authorization header" }));
    return;
  }
  const token = header.replace("Bearer ", "");
  if (token !== TOKEN) {
    res.writeHead(403, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "invalid token" }));
    return;
  }
  next();
}

// Seeded bug: dispatch is registered before auth, so auth never gets a
// chance to reject anything — the route already ran by the time it's called.
export const middlewareChain = [logging, /* dispatch goes here */ auth];
