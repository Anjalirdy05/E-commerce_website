import React, { useState, useEffect } from 'react';
import { Heart, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { loadProducts } from '@/services/data';
import { toast } from 'sonner';

const inr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' });

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const ids = JSON.parse(localStorage.getItem('wishlist') || '[]');
      setWishlist(ids);
      const all = await loadProducts();
      const map = {};
      all.forEach(p => { if (ids.includes(p.id)) map[p.id] = p; });
      setProducts(map);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      toast.error('Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      const ids = new Set(JSON.parse(localStorage.getItem('wishlist') || '[]'));
      ids.delete(productId);
      const next = Array.from(ids);
      localStorage.setItem('wishlist', JSON.stringify(next));
      setWishlist(next);
      const newProducts = { ...products };
      delete newProducts[productId];
      setProducts(newProducts);
      toast.success('Removed from wishlist');
    } catch (error) {
      console.error('Remove error:', error);
      toast.error('Failed to remove from wishlist');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" data-testid="wishlist-loading">
        <div className="w-12 h-12 border-4 border-[#8b4513] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" data-testid="wishlist-page">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold luxury-text mb-8" style={{fontFamily: 'Playfair Display'}} data-testid="wishlist-title">
          My Wishlist
        </h1>

        {wishlist.length === 0 ? (
          <div className="text-center py-16 glass-effect rounded-2xl" data-testid="empty-wishlist">
            <Heart size={64} className="mx-auto mb-4 text-gray-400" />
            <p className="text-xl text-gray-500">Your wishlist is empty</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlist.map((productId, idx) => {
              const product = products[productId];
              if (!product) return null;

              return (
                <div key={productId} className="product-card hover-lift p-6 relative" data-testid={`wishlist-item-${idx}`}>
                  <button
                    onClick={() => removeFromWishlist(productId)}
                    className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg hover:bg-red-50 transition-colors z-10"
                    data-testid={`wishlist-remove-${idx}`}
                  >
                    <Trash2 size={20} className="text-red-600" />
                  </button>

                  <Link to={`/product/${productId}`}>
                    <div className="aspect-square mb-4 overflow-hidden rounded-lg bg-gray-100">
                      <img
                        src={product.images[0] || 'https://via.placeholder.com/400'}
                        alt={product.name}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                        data-testid={`wishlist-image-${idx}`}
                      />
                    </div>

                    <h3 className="text-xl font-semibold mb-2" style={{fontFamily: 'Playfair Display'}} data-testid={`wishlist-name-${idx}`}>
                      {product.name}
                    </h3>

                    <p className="text-2xl font-bold luxury-text" data-testid={`wishlist-price-${idx}`}>{inr.format(product.price)}</p>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;