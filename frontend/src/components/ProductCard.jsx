import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star } from 'lucide-react';
import { AuthContext } from '@/App';
import { toast } from 'sonner';

const categoryQueryMap = {
  Accessories: 'accessories,handbag,watch,belt,wallet',
  Automobile: 'automobile,car,gadget',
  Beauty: 'beauty,makeup,cosmetics',
  Clothing: 'fashion,clothing,apparel',
  Electronics: 'electronics,gadgets,tech',
  Fitness: 'fitness,gym,workout',
  Footwear: 'footwear,shoes,sneakers',
  Furniture: 'furniture,home,sofa,table',
  'Home Decor': 'home decor,interior,decor',
  Jewelry: 'jewelry,necklace,earrings,bracelet',
  Kitchen: 'kitchen,appliance,cookware',
  Toys: 'toys,children,kids',
  Watches: 'watch,luxury,chronograph'
};

const textFallback = (p) => {
  const name = (p?.name || 'Product').slice(0, 28);
  const cat = (p?.category || 'Category').slice(0, 28);
  const svg = `
    <svg xmlns='http://www.w3.org/2000/svg' width='600' height='600'>
      <defs>
        <linearGradient id='g' x1='0' x2='1' y1='0' y2='1'>
          <stop offset='0%' stop-color='#f3efe7'/>
          <stop offset='100%' stop-color='#e7dcc7'/>
        </linearGradient>
      </defs>
      <rect width='600' height='600' fill='url(#g)'/>
      <text x='50%' y='45%' dominant-baseline='middle' text-anchor='middle' fill='#6b5b45' font-family='Inter, Arial' font-size='28' font-weight='700'>${name}</text>
      <text x='50%' y='58%' dominant-baseline='middle' text-anchor='middle' fill='#8b6b3f' font-family='Inter, Arial' font-size='22' font-weight='600'>${cat}</text>
    </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

// No external fallbacks in frontend-only mode
const inr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' });
const ProductCard = ({ product, index }) => {
  const { token } = useContext(AuthContext);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('wishlist') || '[]';
      const list = JSON.parse(raw);
      setIsWishlisted(list.includes(product.id));
    } catch {}
  }, [product.id]);

  const handleWishlist = async (e) => {
    e.preventDefault();
    try {
      const raw = localStorage.getItem('wishlist') || '[]';
      const list = new Set(JSON.parse(raw));
      if (list.has(product.id)) {
        list.delete(product.id);
        setIsWishlisted(false);
        toast.success('Removed from wishlist');
      } else {
        list.add(product.id);
        setIsWishlisted(true);
        toast.success('Added to wishlist');
      }
      localStorage.setItem('wishlist', JSON.stringify(Array.from(list)));
    } catch (error) {
      console.error('Wishlist error:', error);
      toast.error('Failed to update wishlist');
    }
  };


  return (
    <Link
      to={`/product/${product.id}`}
      className="product-card hover-lift p-6 relative"
      data-testid={`product-card-${index}`}
    >
      <button
        onClick={handleWishlist}
        className="wishlist-btn"
        data-testid={`wishlist-btn-${index}`}
      >
        <Heart
          size={20}
          className={isWishlisted ? 'fill-red-500 text-red-500' : ''}
        />
      </button>

      {/* Image with resilient fallback */}
      <div className="aspect-square mb-4 overflow-hidden rounded-lg bg-gray-100">
        <img
          src={(function(){
            const slug = String(product?.category || 'product').trim().toLowerCase().replace(/\s+/g,'_');
            const prodJpg = `/images/products/${product.id}.jpg`;
            const catJpg = `/images/categories/${slug}.jpg`;
            const svg = `/images/${slug}_0.svg`;
            const first = product?.images?.[0];
            // Prefer explicit local images
            if (typeof first === 'string' && (first.startsWith('/images/') || /^data:image\//i.test(first))) return first;
            // Try product JPG, then category JPG, then category SVG
            return prodJpg || catJpg || svg;
          })()}
          alt={product.name}
          loading="lazy"
          onError={(e) => {
            const slug = String(product?.category || 'product').trim().toLowerCase().replace(/\s+/g,'_');
            const catJpg = `/images/categories/${slug}.jpg`;
            const svg = `/images/${slug}_0.svg`;
            if (!e.currentTarget.dataset.step) {
              e.currentTarget.dataset.step = 'cat';
              e.currentTarget.src = catJpg;
              return;
            }
            if (e.currentTarget.dataset.step === 'cat') {
              e.currentTarget.dataset.step = 'svg';
              e.currentTarget.src = svg;
              return;
            }
            e.currentTarget.onerror = null;
            e.currentTarget.src = textFallback(product);
          }}
          className="w-full h-full object-cover hover:scale-110 transition-transform duration-500 rounded-lg"
        />
      </div>

      <h3
        className="text-xl font-semibold mb-2"
        style={{ fontFamily: 'Playfair Display' }}
        data-testid={`product-name-${index}`}
      >
        {product.name}
      </h3>

      <div className="flex items-center gap-2 mb-2">
        <div className="flex items-center gap-1">
          <Star size={16} className="fill-[#d4af37] text-[#d4af37]" />
          <span className="text-sm font-medium" data-testid={`product-rating-${index}`}>
            {product.rating?.toFixed(1) ?? "4.5"}
          </span>
        </div>
        <span className="text-sm text-gray-500">
          ({product.review_count ?? 0} reviews)
        </span>
      </div>

      <div className="flex items-center justify-between">
        <p
          className="text-2xl font-bold luxury-text"
          data-testid={`product-price-${index}`}
        >
          {inr.format(product.price ?? 0)}
        </p>
        {product.stock > 0 ? (
          <span className="text-sm text-green-600 font-medium">In Stock</span>
        ) : (
          <span className="text-sm text-red-600 font-medium">Out of Stock</span>
        )}
      </div>
    </Link>
  );
};

export default ProductCard;
