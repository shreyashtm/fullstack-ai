# Minimal entry point — this is Milestone 5's FastAPI app, containerized.
# The actual seeded bug lives in Dockerfile's CMD (hardcoded port), not here.
from fastapi import FastAPI

app = FastAPI()


@app.get("/health")
def health():
    return {"status": "ok"}
