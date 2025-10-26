const fs = require('fs');
const path = require('path');

const productsPath = process.argv[2];
if (!productsPath) {
  console.error('Usage: node set-images-to-product-jpgs.js <path-to-products.json>');
  process.exit(1);
}

try {
  const raw = fs.readFileSync(productsPath, 'utf8');
  const data = JSON.parse(raw);
  const arr = Array.isArray(data) ? data : [data];
  for (const p of arr) {
    p.images = [`/images/products/${p.id}.jpg`];
  }
  const out = Array.isArray(data) ? arr : arr[0];
  fs.writeFileSync(productsPath, JSON.stringify(out, null, 2));
  console.log('Updated products images to per-product JPG paths in', productsPath);
} catch (e) {
  console.error('Failed:', e.message);
  process.exit(1);
}
