// Redownload per-product JPGs with category/name-relevant photos via loremflickr
// Usage: node redownload-product-images.js <path-to-products.json> <dest-dir>

const fs = require('fs');
const path = require('path');
const https = require('https');

function ensureDir(p) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

function keywordsFor(p) {
  const cat = String(p.category || 'product').toLowerCase().replace(/\s+/g, ',');
  const name = String(p.name || '').toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).slice(0, 3).join(',');
  const kw = [cat, name].filter(Boolean).join(',').replace(/,+/g, ',').replace(/^,|,$/g, '');
  return kw || 'product';
}

function buildUrl(p) {
  const kw = encodeURIComponent(keywordsFor(p));
  const lock = encodeURIComponent(String(p.id));
  // lock makes the image deterministic for the given id
  return `https://loremflickr.com/600/600/${kw}?lock=${lock}`;
}

function download(url, dest, maxRedirects = 5) {
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
          file.on('finish', () => file.close(() => { fs.renameSync(tmp, dest); resolve(); }));
          file.on('error', (err) => { try { fs.unlinkSync(tmp); } catch {} reject(err); });
        })
        .on('error', reject);
    };
    doReq(url, maxRedirects);
  });
}

async function delay(ms){ return new Promise(r=>setTimeout(r, ms)); }

async function main() {
  const productsPath = process.argv[2];
  const outDir = process.argv[3];
  if (!productsPath || !outDir) {
    console.error('Usage: node redownload-product-images.js <path-to-products.json> <dest-dir>');
    process.exit(1);
  }
  const raw = fs.readFileSync(productsPath, 'utf8');
  const data = JSON.parse(raw);
  const arr = Array.isArray(data) ? data : [data];
  ensureDir(outDir);

  // Clean existing JPGs in destination
  for (const f of fs.readdirSync(outDir)) {
    if (f.toLowerCase().endsWith('.jpg')) {
      try { fs.unlinkSync(path.join(outDir, f)); } catch {}
    }
  }

  let ok = 0, fail = 0;
  for (const p of arr) {
    const dest = path.join(outDir, `${p.id}.jpg`);
    const url = buildUrl(p);
    process.stdout.write(`Downloading ${p.id} -> ${url}\n`);
    let attempts = 0, success = false, lastErr = null;
    while (attempts < 3 && !success) {
      attempts++;
      try {
        await download(url, dest);
        success = true;
      } catch (e) {
        lastErr = e; await delay(700 * attempts);
      }
    }
    if (success) ok++; else { fail++; process.stderr.write(`Failed ${p.id}: ${lastErr?.message || 'unknown'}\n`); }
    await delay(120); // small pacing to avoid rate limits
  }
  console.log(`Done. Success: ${ok}, Failed: ${fail}`);
}

main().catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
