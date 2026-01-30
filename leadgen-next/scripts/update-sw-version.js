const fs = require('fs');
const path = require('path');

const pkgPath = path.resolve(__dirname, '..', 'package.json');
const swPath = path.resolve(__dirname, '..', 'public', 'sw.js');

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function generateCacheName(version) {
  const ts = Date.now();
  return `leadgen-${version}-${ts}`;
}

function main() {
  if (!fs.existsSync(swPath)) {
    console.error('sw.js not found at', swPath);
    process.exit(1);
  }

  const pkg = readJson(pkgPath);
  const version = pkg.version || '0.0.0';
  const cacheName = generateCacheName(version);

  let sw = fs.readFileSync(swPath, 'utf8');
  if (!sw.includes('__SW_CACHE_NAME__')) {
    console.warn('Placeholder __SW_CACHE_NAME__ not found in sw.js — skipping injection');
    return;
  }

  sw = sw.replace('__SW_CACHE_NAME__', cacheName);
  fs.writeFileSync(swPath, sw, 'utf8');
  console.log('Injected SW cache name:', cacheName);
}

main();
