// Frontend-only data loader and normalizer
export async function loadProducts() {
  const res = await fetch('/products.json', { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to load products.json');
  const products = await res.json();
  return products.map(normalizeProduct);
}

export async function getCategories() {
  const products = await loadProducts();
  const set = new Set(products.map((p) => p.category).filter(Boolean));
  return Array.from(set).sort();
}

export async function getProductById(id) {
  const products = await loadProducts();
  return products.find((p) => String(p.id) === String(id)) || null;
}

function normalizeProduct(p) {
  const np = { ...p };
  const first = Array.isArray(np.images) ? np.images[0] : undefined;
  // Prefer local images to avoid network/CSP issues. Only keep if already local or data URI.
  if (typeof first === 'string' && (first.startsWith('/images/') || first.startsWith('data:image/'))) {
    np.images = [first];
  } else {
    np.images = [localCategoryImage(np.category)];
  }
  return np;
}

function isValidImage(u) {
  if (typeof u !== 'string' || !u.trim()) return false;
  const s = u.trim().toLowerCase();
  return s.startsWith('/images/') || s.startsWith('data:image/');
}

function localCategoryImage(category) {
  const key = String(category || 'product').trim().toLowerCase().replace(/\s+/g, '_');
  return `/images/${key}_0.svg`;
}
