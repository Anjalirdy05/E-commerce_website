import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, ShoppingCart, Heart, Truck, Shield, RotateCcw } from 'lucide-react';
import { AuthContext } from '@/App';
import { getProductById } from '@/services/data';
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

const textFallback = (p, size = 800, seedSuffix = '') => {
  const name = (p?.name || 'Product').slice(0, 28);
  const cat = (p?.category || 'Category').slice(0, 28);
  const svg = `
    <svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}'>
      <defs>
        <linearGradient id='g' x1='0' x2='1' y1='0' y2='1'>
          <stop offset='0%' stop-color='#f3efe7'/>
          <stop offset='100%' stop-color='#e7dcc7'/>
        </linearGradient>
      </defs>
      <rect width='${size}' height='${size}' fill='url(#g)'/>
      <text x='50%' y='45%' dominant-baseline='middle' text-anchor='middle' fill='#6b5b45' font-family='Inter, Arial' font-size='28' font-weight='700'>${name}</text>
      <text x='50%' y='58%' dominant-baseline='middle' text-anchor='middle' fill='#8b6b3f' font-family='Inter, Arial' font-size='22' font-weight='600'>${cat}</text>
    </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    fetchProduct();
    fetchReviews();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const p = await getProductById(id);
      if (!p) {
        toast.error('Product not found');
        navigate('/products');
        return;
      }
      setProduct(p);
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Failed to load product');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const handleBuyNow = async () => {
    try {
      const raw = localStorage.getItem('cart') || '[]';
      const cart = JSON.parse(raw);
      const idx = cart.findIndex((i) => i.product_id === id);
      if (idx >= 0) {
        cart[idx].quantity = Math.min((product?.stock || 1), quantity);
      } else {
        cart.push({ product_id: id, quantity });
      }
      localStorage.setItem('cart', JSON.stringify(cart));
      navigate('/checkout');
    } catch (error) {
      console.error('Buy now error:', error);
      toast.error('Failed to proceed to checkout');
    }
  };

  const fetchReviews = async () => {
    try {
      const raw = localStorage.getItem(`reviews_${id}`);
      setReviews(raw ? JSON.parse(raw) : []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const handleAddToCart = async () => {
    try {
      const raw = localStorage.getItem('cart') || '[]';
      const cart = JSON.parse(raw);
      const idx = cart.findIndex((i) => i.product_id === id);
      if (idx >= 0) {
        cart[idx].quantity = Math.min((product?.stock || 1), cart[idx].quantity + quantity);
      } else {
        cart.push({ product_id: id, quantity });
      }
      localStorage.setItem('cart', JSON.stringify(cart));
      toast.success('Added to cart');
    } catch (error) {
      console.error('Add to cart error:', error);
      toast.error('Failed to add to cart');
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      const raw = localStorage.getItem(`reviews_${id}`) || '[]';
      const next = JSON.parse(raw);
      const review = {
        id: `r_${Date.now()}`,
        user_name: (JSON.parse(localStorage.getItem('user') || '{}').name) || 'Guest',
        rating: reviewForm.rating,
        comment: reviewForm.comment,
        created_at: new Date().toISOString(),
      };
      next.unshift(review);
      localStorage.setItem(`reviews_${id}`, JSON.stringify(next));
      toast.success('Review submitted');
      setReviewForm({ rating: 5, comment: '' });
      fetchReviews();
    } catch (error) {
      console.error('Review error:', error);
      toast.error('Failed to submit review');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" data-testid="product-loading">
        <div className="w-12 h-12 border-4 border-[#8b4513] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="min-h-screen" data-testid="product-detail-page">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {/* Images */}
          <div>
            <div className="aspect-square mb-4 overflow-hidden rounded-2xl bg-gray-100" data-testid="product-main-image">
              <img
                src={(function(){
                  const slug = String(product?.category || 'product').trim().toLowerCase().replace(/\s+/g,'_');
                  const prodJpg = `/images/products/${product.id}.jpg`;
                  const catJpg = `/images/categories/${slug}.jpg`;
                  const svg = `/images/${slug}_0.svg`;
                  const current = product?.images?.[selectedImage];
                  if (typeof current === 'string' && (current.startsWith('/images/') || /^data:image\//i.test(current))) return current;
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
                  e.currentTarget.src = textFallback(product, 800);
                }}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {(product.images || [null, null, null, null]).slice(0, 4).map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === idx ? 'border-[#8b4513]' : 'border-gray-200'
                  }`}
                  data-testid={`product-thumbnail-${idx}`}
                >
                  <img
                    src={(function(){
                      const slug = String(product?.category || 'product').trim().toLowerCase().replace(/\s+/g,'_');
                      const prodJpg = `/images/products/${product.id}.jpg`;
                      const catJpg = `/images/categories/${slug}.jpg`;
                      const svg = `/images/${slug}_0.svg`;
                      if (typeof img === 'string' && (img.startsWith('/images/') || /^data:image\//i.test(img))) return img;
                      return prodJpg || catJpg || svg;
                    })()}
                    alt={`${product.name} ${idx + 1}`}
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
                      e.currentTarget.src = textFallback(product, 200, `-${idx}`);
                    }}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Details */}
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4" style={{fontFamily: 'Playfair Display'}} data-testid="product-title">
              {product.name}
            </h1>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    className={i < Math.floor(product.rating) ? 'fill-[#d4af37] text-[#d4af37]' : 'text-gray-300'}
                  />
                ))}
              </div>
              <span className="text-gray-600" data-testid="product-rating">{product.rating.toFixed(1)} ({product.review_count} reviews)</span>
            </div>

            <p className="text-4xl font-bold luxury-text mb-6" data-testid="product-price">{inr.format(product.price)}</p>

            <p className="text-gray-700 mb-8 leading-relaxed" data-testid="product-description">{product.description}</p>

            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center border-2 border-gray-300 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 hover:bg-gray-100 transition-colors"
                  data-testid="quantity-decrease-btn"
                >
                  -
                </button>
                <span className="px-6 py-2 border-x-2 border-gray-300" data-testid="quantity-display">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-4 py-2 hover:bg-gray-100 transition-colors"
                  data-testid="quantity-increase-btn"
                >
                  +
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="btn-luxury flex-1 flex items-center justify-center gap-2 py-3 disabled:opacity-50"
                data-testid="add-to-cart-btn"
              >
                <ShoppingCart size={20} /> Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                className="btn-luxury flex-1 py-3 disabled:opacity-50"
                data-testid="buy-now-btn"
              >
                Buy Now
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="text-center p-4 glass-effect rounded-lg">
                <Truck size={32} className="mx-auto mb-2 text-[#8b4513]" />
                <p className="text-sm font-medium">Free Shipping</p>
              </div>
              <div className="text-center p-4 glass-effect rounded-lg">
                <Shield size={32} className="mx-auto mb-2 text-[#8b4513]" />
                <p className="text-sm font-medium">Secure Payment</p>
              </div>
              <div className="text-center p-4 glass-effect rounded-lg">
                <RotateCcw size={32} className="mx-auto mb-2 text-[#8b4513]" />
                <p className="text-sm font-medium">Easy Returns</p>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="mt-16" data-testid="reviews-section">
          <h2 className="text-3xl font-bold mb-8" style={{fontFamily: 'Playfair Display'}}>Customer Reviews</h2>

          {token && (
            <form onSubmit={handleSubmitReview} className="glass-effect p-6 rounded-2xl mb-8" data-testid="review-form">
              <h3 className="text-xl font-semibold mb-4">Write a Review</h3>
              <div className="mb-4">
                <label className="block mb-2">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => setReviewForm({ ...reviewForm, rating })}
                      data-testid={`review-rating-${rating}`}
                    >
                      <Star
                        size={32}
                        className={rating <= reviewForm.rating ? 'fill-[#d4af37] text-[#d4af37]' : 'text-gray-300'}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <label className="block mb-2">Comment</label>
                <textarea
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#8b4513] resize-none"
                  rows="4"
                  required
                  data-testid="review-comment-input"
                />
              </div>
              <button type="submit" className="btn-luxury" data-testid="review-submit-btn">
                Submit Review
              </button>
            </form>
          )}

          <div className="space-y-6">
            {reviews.map((review, idx) => (
              <div key={review.id} className="glass-effect p-6 rounded-2xl" data-testid={`review-${idx}`}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-lg">{review.user_name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={i < review.rating ? 'fill-[#d4af37] text-[#d4af37]' : 'text-gray-300'}
                        />
                      ))}
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(review.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-700">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;