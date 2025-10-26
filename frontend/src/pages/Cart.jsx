import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus } from 'lucide-react';
import { loadProducts } from '@/services/data';
import { toast } from 'sonner';

const inr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' });

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const items = JSON.parse(localStorage.getItem('cart') || '[]');
      setCartItems(items);
      const all = await loadProducts();
      const map = {};
      all.forEach(p => { map[p.id] = p; });
      setProducts(map);
    } catch (error) {
      console.error('Error fetching cart:', error);
      toast.error('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      const next = cartItems.map(item =>
        item.product_id === productId ? { ...item, quantity: newQuantity } : item
      );
      localStorage.setItem('cart', JSON.stringify(next));
      setCartItems(next);
      toast.success('Cart updated');
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Failed to update cart');
    }
  };

  const removeItem = async (productId) => {
    try {
      const next = cartItems.filter(item => item.product_id !== productId);
      localStorage.setItem('cart', JSON.stringify(next));
      setCartItems(next);
      toast.success('Item removed');
    } catch (error) {
      console.error('Remove error:', error);
      toast.error('Failed to remove item');
    }
  };

  const getTotal = () => {
    return cartItems.reduce((sum, item) => {
      const product = products[item.product_id];
      return sum + (product ? product.price * item.quantity : 0);
    }, 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" data-testid="cart-loading">
        <div className="w-12 h-12 border-4 border-[#8b4513] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" data-testid="cart-page">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold luxury-text mb-8" style={{fontFamily: 'Playfair Display'}} data-testid="cart-title">
          Shopping Cart
        </h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-16 glass-effect rounded-2xl" data-testid="empty-cart">
            <p className="text-xl text-gray-500 mb-4">Your cart is empty</p>
            <button onClick={() => navigate('/products')} className="btn-luxury" data-testid="continue-shopping-btn">
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item, idx) => {
                const product = products[item.product_id];
                if (!product) return null;

                return (
                  <div key={item.product_id} className="glass-effect p-6 rounded-2xl flex gap-6" data-testid={`cart-item-${idx}`}>
                    <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <img
                        src={product.images[0] || 'https://via.placeholder.com/100'}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        data-testid={`cart-item-image-${idx}`}
                      />
                    </div>

                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2" style={{fontFamily: 'Playfair Display'}} data-testid={`cart-item-name-${idx}`}>
                        {product.name}
                      </h3>
                      <p className="text-lg font-bold luxury-text mb-4" data-testid={`cart-item-price-${idx}`}>
                        {inr.format(product.price)}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center border-2 border-gray-300 rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                            className="p-2 hover:bg-gray-100 transition-colors"
                            data-testid={`cart-item-decrease-${idx}`}
                          >
                            <Minus size={16} />
                          </button>
                          <span className="px-4" data-testid={`cart-item-quantity-${idx}`}>{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                            className="p-2 hover:bg-gray-100 transition-colors"
                            data-testid={`cart-item-increase-${idx}`}
                          >
                            <Plus size={16} />
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item.product_id)}
                          className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                          data-testid={`cart-item-remove-${idx}`}
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="lg:col-span-1">
              <div className="glass-effect p-6 rounded-2xl sticky top-24" data-testid="cart-summary">
                <h3 className="text-2xl font-bold mb-6" style={{fontFamily: 'Playfair Display'}}>Order Summary</h3>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold" data-testid="cart-subtotal">{inr.format(getTotal())}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-semibold text-green-600">Free</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between text-lg">
                    <span className="font-bold">Total</span>
                    <span className="font-bold luxury-text text-2xl" data-testid="cart-total">{inr.format(getTotal())}</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full btn-luxury py-3"
                  data-testid="checkout-btn"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;