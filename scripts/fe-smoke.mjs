#!/usr/bin/env node

import fetch from "node-fetch";

const BASE = process.env.VITE_API_BASE_URL || "https://vitan-task-production.up.railway.app";
const FRONTEND = process.env.FRONTEND_URL || "https://vitan-task-frontend.up.railway.app";

const checks = [
  // Backend endpoints
  ["modules", `${BASE}/api/modules`],
  ["events stats", `${BASE}/api/events/stats`],
  ["whatsapp health", `${BASE}/api/modules/whatsapp/health`],
  ["tasks", `${BASE}/api/tasks`],
  
  // Frontend pages
  ["frontend root", `${FRONTEND}/`],
  ["frontend login", `${FRONTEND}/login`],
  
  // Frontend public assets
  ["favicon", `${FRONTEND}/favicon.ico`],
  ["apple touch icon", `${FRONTEND}/apple-touch-icon.png`],
  ["vite svg", `${FRONTEND}/vite.svg`],
  ["robots.txt", `${FRONTEND}/robots.txt`],
  ["site.webmanifest", `${FRONTEND}/site.webmanifest`],
  ["health.json", `${FRONTEND}/health.json`],
];

async function checkAssetDiscovery() {
  try {
    console.log("\n🔍 Discovering frontend assets...");
    const rootResponse = await fetch(`${FRONTEND}/`);
    if (!rootResponse.ok) throw new Error(`Root page returned ${rootResponse.status}`);
    
    const html = await rootResponse.text();
    const assetMatches = html.match(/\/assets\/[A-Za-z0-9._-]+\.(?:js|css)/g) || [];
    const uniqueAssets = [...new Set(assetMatches)];
    
    console.log(`Found ${uniqueAssets.length} assets to verify`);
    
    // Verify each asset
    let assetFailures = 0;
    for (const asset of uniqueAssets) {
      try {
        const assetUrl = `${FRONTEND}${asset}`;
        const assetResponse = await fetch(assetUrl, { method: 'HEAD' });
        if (!assetResponse.ok) {
          console.error(`❌ Asset ${asset}: ${assetResponse.status} ${assetResponse.statusText}`);
          assetFailures++;
        } else {
          console.log(`✅ Asset ${asset}: ${assetResponse.status}`);
        }
      } catch (e) {
        console.error(`❌ Asset ${asset}: ${e.message}`);
        assetFailures++;
      }
    }
    
    if (assetFailures > 0) {
      console.error(`\n❌ ${assetFailures} assets failed verification`);
      return false;
    }
    
    console.log("✅ All assets verified successfully");
    return true;
  } catch (e) {
    console.error(`❌ Asset discovery failed: ${e.message}`);
    return false;
  }
}

async function checkHeaders(url, name) {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
    
    // Check caching headers for assets
    if (url.includes('/assets/')) {
      const cacheControl = response.headers.get('cache-control');
      if (!cacheControl || !cacheControl.includes('immutable')) {
        console.warn(`⚠️  ${name}: Missing immutable cache header`);
      }
    }
    
    // Check compression
    const encoding = response.headers.get('content-encoding');
    if (encoding) {
      console.log(`✅ ${name}: Compressed with ${encoding}`);
    }
    
    return true;
  } catch (e) {
    console.error(`❌ ${name}: ${e.message}`);
    return false;
  }
}

(async () => {
  console.log("🧪 Frontend Smoke Test");
  console.log("=" * 50);
  
  let failed = 0;
  let total = 0;
  
  // Check basic endpoints
  for (const [name, url] of checks) {
    total++;
    try {
      const res = await fetch(url, { timeout: 10000 });
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      process.stdout.write(`✅ ${name.padEnd(20)} ${url}\n`);
    } catch (e) {
      failed++;
      process.stderr.write(`❌ ${name.padEnd(20)} ${url}  ${e.message}\n`);
    }
  }
  
  // Check asset discovery and verification
  const assetsOk = await checkAssetDiscovery();
  if (!assetsOk) failed++;
  
  // Check specific headers
  console.log("\n🔍 Checking response headers...");
  const headerChecks = [
    [`${FRONTEND}/assets/index-22a85fb5.js`, "Main JS Bundle"],
    [`${FRONTEND}/assets/index-2dd81c48.css`, "Main CSS Bundle"],
    [`${FRONTEND}/`, "Root Page"],
  ];
  
  for (const [url, name] of headerChecks) {
    total++;
    if (!(await checkHeaders(url, name))) failed++;
  }
  
  console.log("\n" + "=" * 50);
  console.log(`📊 Results: ${total - failed}/${total} checks passed`);
  
  if (failed > 0) {
    console.error(`❌ ${failed} checks failed`);
    process.exit(1);
  } else {
    console.log("🎉 All checks passed! Frontend is healthy.");
  }
})();
