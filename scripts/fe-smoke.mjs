#!/usr/bin/env node

import fetch from "node-fetch";

const BASE = process.env.VITE_API_BASE_URL || "https://vitan-task-production.up.railway.app";
const checks = [
  ["modules", "/api/modules"],
  ["events stats", "/api/events/stats"],
  ["whatsapp health", "/api/modules/whatsapp/health"],
  ["tasks", "/api/tasks"]
];

(async () => {
  let failed = 0;
  for (const [name, path] of checks) {
    const url = `${BASE}${path}`;
    try {
      const res = await fetch(url, { timeout: 10000 });
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      process.stdout.write(`OK  ${name}  ${url}\n`);
    } catch (e) {
      failed++;
      process.stderr.write(`ERR ${name}  ${url}  ${e.message}\n`);
    }
  }
  process.exit(failed ? 1 : 0);
})();
