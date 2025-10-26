import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, TrendingUp, Sparkles } from 'lucide-react';
import { loadProducts, getCategories } from '@/services/data';
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

// No external fallbacks in frontend-only mode

const inr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' });

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

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const products = await loadProducts();
      const cats = await getCategories();
      setFeaturedProducts(products.slice(0, 6));
      setCategories(cats);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in" data-testid="home-page">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden" style={{background: 'linear-gradient(135deg, #f5f1e8 0%, #e8dcc8 100%)'}} data-testid="hero-section">
        <div className="absolute inset-0 opacity-15" style={{backgroundImage: 'url(https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200)', backgroundSize: 'cover', backgroundPosition: 'center'}}></div>
        <div className="absolute inset-0" style={{backgroundColor: 'rgba(212, 175, 55, 0.18)'}}></div>
        {/* Centered vignette to improve title contrast */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(0,0,0,0.28) 0%, rgba(0,0,0,0.18) 35%, rgba(0,0,0,0.08) 60%, rgba(0,0,0,0) 85%)'
          }}
        ></div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <Sparkles size={48} className="text-[#d4af37] animate-pulse" />
          </div>
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6"
            style={{
              fontFamily: 'Playfair Display',
              color: '#b88917',
              textShadow: '0 2px 8px rgba(0,0,0,0.35), 0 1px 0 rgba(0,0,0,0.45)'
            }}
            data-testid="hero-title"
          >
            Experience Luxury Shopping
          </h1>
          <p className="text-base lg:text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
            Discover curated collections of premium products crafted for those who appreciate the finest things in life
          </p>
          <Link to="/products">
            <button className="btn-luxury flex items-center gap-2 mx-auto" data-testid="hero-cta-btn">
              Explore Collection <ArrowRight size={20} />
            </button>
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 px-4" data-testid="categories-section">
        <div className="max-w-7xl mx-auto">
          <h2 className="section-title" data-testid="categories-title">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category, idx) => (
              <Link
                key={idx}
                to={`/products?category=${category}`}
                className="glass-effect p-8 rounded-2xl text-center hover-lift"
                data-testid={`category-card-${idx}`}
              >
                <div className="w-16 h-16 mx-auto mb-4 luxury-gradient rounded-full flex items-center justify-center">
                  <TrendingUp size={32} className="text-white" />
                </div>
                <h3 className="text-xl font-semibold">{category}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 px-4 bg-white/50" data-testid="featured-products-section">
        <div className="max-w-7xl mx-auto">
          <h2 className="section-title" data-testid="featured-title">Featured Products</h2>
          {loading ? (
            <div className="text-center py-12" data-testid="loading-spinner">
              <div className="w-12 h-12 border-4 border-[#8b4513] border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((product, idx) => (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  className="product-card hover-lift p-6"
                  data-testid={`product-card-${idx}`}
                >
                  <div className="aspect-square mb-4 overflow-hidden rounded-lg bg-gray-100">
                    <img
                      src={(function(){
                        const slug = String(product?.category || 'product').trim().toLowerCase().replace(/\s+/g,'_');
                        const prodJpg = `/images/products/${product.id}.jpg`;
                        const catJpg = `/images/categories/${slug}.jpg`;
                        const svg = `/images/${slug}_0.svg`;
                        const first = product?.images?.[0];
                        if (typeof first === 'string' && (first.startsWith('/images/') || /^data:image\//i.test(first))) return first;
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
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <h3 className="text-xl font-semibold mb-2" style={{fontFamily: 'Playfair Display'}}>{product.name}</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1">
                      <Star size={16} className="fill-[#d4af37] text-[#d4af37]" />
                      <span className="text-sm font-medium">{product.rating.toFixed(1)}</span>
                    </div>
                    <span className="text-sm text-gray-500">({product.review_count} reviews)</span>
                  </div>
                  <p className="text-2xl font-bold luxury-text">{inr.format(product.price)}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4" style={{background: 'linear-gradient(135deg, #8b4513 0%, #d4af37 100%)'}} data-testid="cta-section">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6" style={{fontFamily: 'Playfair Display'}} data-testid="cta-title">
            Join Our Exclusive Club
          </h2>
          <p className="text-base lg:text-lg mb-8 opacity-90">
            Get access to exclusive deals, early product launches, and personalized recommendations
          </p>
          <Link to="/auth">
            <button className="bg-white text-[#8b4513] px-8 py-4 rounded-full font-semibold hover:scale-105 transition-transform" data-testid="cta-signup-btn">
              Sign Up Now
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;