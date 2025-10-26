// Download per-product JPGs based on category keywords
// Usage: node download-product-images.js <path-to-products.json> <dest-dir>

const fs = require('fs');
const path = require('path');
const https = require('https');

function ensureDir(p) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

function getUrlFor(product) {
  // Use picsum with a stable seed to get a consistent image without API keys
  const seed = encodeURIComponent(`${product.id}-${product.category || 'product'}-${product.name || ''}`);
  return `https://picsum.photos/seed/${seed}/600/600`;
}

function downloadFollow(url, dest, maxRedirects = 5) {
  return new Promise((resolve, reject) => {
    const doReq = (u, redirectsLeft) => {
      https
        .get(u, (res) => {
          const status = res.statusCode || 0;
          if (status >= 300 && status < 400 && res.headers.location && redirectsLeft > 0) {
            const next = res.headers.location.startsWith('http')
              ? res.headers.location
              : new URL(res.headers.location, u).toString();
            res.resume();
            return doReq(next, redirectsLeft - 1);
          }
          if (status !== 200) {
            res.resume();
            return reject(new Error(`HTTP ${status} for ${u}`));
          }
          const tmp = dest + '.tmp';
          const file = fs.createWriteStream(tmp);
          res.pipe(file);
          file.on('finish', () => {
            file.close(() => {
              fs.renameSync(tmp, dest);
              resolve();
            });
          });
          file.on('error', (err) => {
            try { fs.unlinkSync(tmp); } catch {}
            reject(err);
          });
        })
        .on('error', reject);
    };
    doReq(url, maxRedirects);
  });
}

async function main() {
  const productsPath = process.argv[2];
  const outDir = process.argv[3];
  if (!productsPath || !outDir) {
    console.error('Usage: node download-product-images.js <path-to-products.json> <dest-dir>');
    process.exit(1);
  }
  const raw = fs.readFileSync(productsPath, 'utf8');
  const data = JSON.parse(raw);
  const arr = Array.isArray(data) ? data : [data];
  ensureDir(outDir);

  let ok = 0, fail = 0;
  for (const p of arr) {
    const dest = path.join(outDir, `${p.id}.jpg`);
    // skip if already exists
    if (fs.existsSync(dest)) { ok++; continue; }
    const url = getUrlFor(p);
    process.stdout.write(`Downloading ${p.id} -> ${url}\n`);
    let attempts = 0; let success = false; let lastErr = null;
    while (attempts < 3 && !success) {
      attempts++;
      try {
        await downloadFollow(url, dest);
        success = true;
      } catch (e) {
        lastErr = e;
        await new Promise(r => setTimeout(r, 500 * attempts));
      }
    }
    if (success) ok++; else { fail++; process.stderr.write(`Failed ${p.id}: ${lastErr?.message || 'unknown'}\n`); }
  }
  console.log(`Done. Success: ${ok}, Failed: ${fail}`);
}

main().catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
