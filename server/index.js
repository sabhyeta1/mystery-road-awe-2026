// DEVELOPMENT-ONLY backend for Project ReMotion (Exercise 6, Demo 4).
// It serves the five JSON files in public/data as read-only REST endpoints.
// It is NOT part of the GitHub Pages deployment: only the static frontend is deployed.

import express from "express";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HOST = "127.0.0.1";
const PORT = Number(process.env.PORT) || 3001;
const MAX_DELAY_MS = 15000;
const DATA_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "public", "data");

// One endpoint per resource: GET /api/<name> returns public/data/<name>.json
const RESOURCES = ["case", "evidence", "people", "locations", "timeline"];

// Simulation settings. They can be changed while the server is running (see /dev/settings).
const settings = {
  delayMs: Number(process.env.API_DELAY_MS) || 0, // artificial delay for every API response
  failResource: "none", // "none", "all", or the name of one resource that should answer with a 500
};

function parseDelay(value) {
  const number = Number(value);
  if (!Number.isFinite(number) || number < 0) return 0;
  return Math.min(number, MAX_DELAY_MS);
}

function wait(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

const app = express();

// Log every request, so you can see in the terminal what the frontend asks for.
app.use((request, _response, next) => {
  console.log(new Date().toISOString() + "  " + request.method + " " + request.originalUrl);
  next();
});

for (const resource of RESOURCES) {
  app.get("/api/" + resource, async (request, response) => {
    // ?delay=2000 on a single request wins over the global setting.
    const delayMs =
      request.query.delay !== undefined ? parseDelay(request.query.delay) : settings.delayMs;
    await wait(delayMs);

    // ?fail=1 on a single request, or the global setting, simulates a server error.
    const shouldFail =
      request.query.fail !== undefined ||
      settings.failResource === "all" ||
      settings.failResource === resource;
    if (shouldFail) {
      response.status(500).json({ error: "Simulated server error for " + resource });
      return;
    }

    try {
      const json = await readFile(path.join(DATA_DIR, resource + ".json"), "utf-8");
      response.type("application/json").send(json);
    } catch (error) {
      console.error("Could not read " + resource + ".json", error);
      response.status(500).json({ error: "Could not read " + resource + ".json" });
    }
  });
}

// Simulation controls (not data). Examples, opened directly in the browser on port 3001:
//   /dev/settings                      shows the current settings
//   /dev/settings?delay=3000           every API answer takes 3 seconds
//   /dev/settings?fail=evidence        /api/evidence answers with a 500 error
//   /dev/settings?fail=none&delay=0    back to normal
app.get("/dev/settings", (request, response) => {
  if (request.query.delay !== undefined) {
    settings.delayMs = parseDelay(request.query.delay);
  }
  if (request.query.fail !== undefined) {
    const value = String(request.query.fail);
    if (value !== "none" && value !== "all" && !RESOURCES.includes(value)) {
      response
        .status(400)
        .json({ error: "fail must be none, all or one of: " + RESOURCES.join(", ") });
      return;
    }
    settings.failResource = value;
  }
  response.json(settings);
});

app.listen(PORT, HOST, () => {
  console.log("Dev API running at http://" + HOST + ":" + PORT);
});