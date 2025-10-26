// Download an image for a single product based on name+category and update products.json
// Usage: node download-and-set-single.js <products.json> <out-dir> <productId>

const fs = require('fs');
const path = require('path');
const https = require('https');

function ensureDir(p) { if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true }); }

function keywordsFor(p) {
  const cat = String(p.category || 'product').toLowerCase().replace(/\s+/g, ',');
  const name = String(p.name || '').toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).slice(0, 4).join(',');
  const kw = [cat, name].filter(Boolean).join(',').replace(/,+/g, ',').replace(/^,|,$/g, '');
  return kw || 'product';
}

function buildUrl(p) {
  const kw = encodeURIComponent(keywordsFor(p));
  const lock = encodeURIComponent(String(p.id));
  return `https://loremflickr.com/600/600/${kw}?lock=${lock}`;
}

function download(url, dest, maxRedirects = 5) {
  return new Promise((resolve, reject) => {
    const doReq = (u, redirectsLeft) => {
      https.get(u, (res) => {
        const status = res.statusCode || 0;
        if (status >= 300 && status < 400 && res.headers.location && redirectsLeft > 0) {
          const next = res.headers.location.startsWith('http') ? res.headers.location : new URL(res.headers.location, u).toString();
          res.resume();
          return doReq(next, redirectsLeft - 1);
        }
        if (status !== 200) { res.resume(); return reject(new Error(`HTTP ${status} for ${u}`)); }
        const tmp = dest + '.tmp';
        const file = fs.createWriteStream(tmp);
        res.pipe(file);
        file.on('finish', () => file.close(() => { fs.renameSync(tmp, dest); resolve(); }));
        file.on('error', (err) => { try { fs.unlinkSync(tmp); } catch {} reject(err); });
      }).on('error', reject);
    };
    doReq(url, maxRedirects);
  });
}

async function main() {
  const productsPath = process.argv[2];
  const outDir = process.argv[3];
  const productId = process.argv[4];
  if (!productsPath || !outDir || !productId) {
    console.error('Usage: node download-and-set-single.js <products.json> <out-dir> <productId>');
    process.exit(1);
  }
  const raw = fs.readFileSync(productsPath, 'utf8');
  const data = JSON.parse(raw);
  const arr = Array.isArray(data) ? data : [data];
  const prod = arr.find(p => String(p.id) === String(productId));
  if (!prod) { console.error('Product not found:', productId); process.exit(1); }

  ensureDir(outDir);
  const dest = path.join(outDir, `${prod.id}.jpg`);
  const url = buildUrl(prod);
  console.log('Downloading', prod.id, '->', url);
  let attempts = 0; let success = false; let lastErr = null;
  while (attempts < 3 && !success) {
    attempts++;
    try { await download(url, dest); success = true; } catch (e) { lastErr = e; await new Promise(r=>setTimeout(r, 700*attempts)); }
  }
  if (!success) { console.error('Failed to download:', lastErr?.message || 'unknown'); process.exit(1); }

  // Update products.json image path
  prod.images = [ `/images/products/${prod.id}.jpg` ];
  const out = Array.isArray(data) ? arr : arr[0];
  fs.writeFileSync(productsPath, JSON.stringify(out, null, 2));
  console.log('Updated products.json for', prod.id);
}

main().catch((e)=>{ console.error('Fatal:', e.message); process.exit(1); });
