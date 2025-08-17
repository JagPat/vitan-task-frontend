#!/usr/bin/env node

import { readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';

const root = 'dist';
const assets = join(root, 'assets');

const mustHave = [
  'index',          // main bundle base
  'LoginView',      // seen in logs
  'apiClient',      // seen in logs
  'SystemStatus',   // new system page
  'TasksView',      // tasks view
  'WhatsAppView',   // whatsapp view
  'useQuery',       // react-query
  'useMutation'     // react-query mutations
];

async function verifyDist() {
  try {
    // Check if dist directory exists
    try {
      await stat(root);
    } catch (error) {
      console.error('❌ dist/ directory not found. Run "npm run build" first.');
      process.exit(1);
    }

    // Check if assets directory exists
    try {
      await stat(assets);
    } catch (error) {
      console.error('❌ dist/assets/ directory not found. Build may have failed.');
      process.exit(1);
    }

    // List all files in assets
    const list = await readdir(assets);
    const js = list.filter(f => f.endsWith('.js'));
    const css = list.filter(f => f.endsWith('.css'));
    const other = list.filter(f => !f.endsWith('.js') && !f.endsWith('.css'));

    console.log('📁 Assets found:');
    console.log(`  JavaScript: ${js.length} files`);
    console.log(`  CSS: ${css.length} files`);
    console.log(`  Other: ${other.length} files`);

    // Extract chunk names from JS files
    const found = new Set(js.map(f => f.split('-')[0]));
    console.log('\n🔍 Chunk names found:', [...found].sort());

    // Check for missing required chunks
    const missing = mustHave.filter(n => 
      ![...found].some(f => f.toLowerCase() === n.toLowerCase())
    );

    if (missing.length > 0) {
      console.error('\n❌ Missing expected chunks:');
      missing.forEach(chunk => console.error(`  - ${chunk}`));
      console.error('\nThis likely indicates dynamic imports for icons/pages.');
      process.exit(1);
    }

    // Check public assets
    const publicAssets = [
      'favicon.svg',
      'apple-touch-icon.png', 
      'vite.svg',
      'health.json'
    ];

    console.log('\n📋 Checking public assets...');
    for (const asset of publicAssets) {
      try {
        await stat(join(root, asset));
        console.log(`  ✅ ${asset}`);
      } catch (error) {
        console.log(`  ❌ ${asset} (missing)`);
      }
    }

    // Check index.html
    try {
      await stat(join(root, 'index.html'));
      console.log('  ✅ index.html');
    } catch (error) {
      console.error('  ❌ index.html (missing)');
      process.exit(1);
    }

    console.log('\n🎉 All required chunks and assets found!');
    console.log('✅ Build is ready for deployment.');

  } catch (error) {
    console.error('💥 Verification failed:', error.message);
    process.exit(1);
  }
}

verifyDist();
