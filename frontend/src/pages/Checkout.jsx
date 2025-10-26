import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { CreditCard, Smartphone } from 'lucide-react';
import { loadProducts } from '@/services/data';

const inr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' });
const Checkout = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('razorpay');

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const items = JSON.parse(localStorage.getItem('cart') || '[]');
      if (items.length === 0) {
        navigate('/cart');
        return;
      }
      setCartItems(items);
      const all = await loadProducts();
      const productsMap = {};
      all.forEach(p => { productsMap[p.id] = p; });
      setProducts(productsMap);
    } catch (error) {
      console.error('Error fetching cart:', error);
      toast.error('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  const getTotal = () => {
    return cartItems.reduce((sum, item) => {
      const product = products[item.product_id];
      return sum + (product ? product.price * item.quantity : 0);
    }, 0);
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setProcessing(true);

    try {
      const orderItems = cartItems.map(item => ({
        product_id: item.product_id,
        product_name: products[item.product_id]?.name,
        quantity: item.quantity,
        price: products[item.product_id]?.price
      }));

      const orderData = {
        id: `o_${Date.now()}`,
        items: orderItems,
        total_amount: getTotal(),
        payment_method: paymentMethod,
        shipping_address: shippingInfo,
        tracking_status: 'Order Placed',
        created_at: new Date().toISOString()
      };

      // Persist order locally and clear cart
      const prev = JSON.parse(localStorage.getItem('orders') || '[]');
      localStorage.setItem('orders', JSON.stringify([orderData, ...prev]));
      localStorage.removeItem('cart');
      toast.success('Order placed successfully!');
      navigate('/orders');
    } catch (error) {
      console.error('Order error:', error);
      toast.error('Failed to place order');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" data-testid="checkout-loading">
        <div className="w-12 h-12 border-4 border-[#8b4513] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" data-testid="checkout-page">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold luxury-text mb-8" style={{fontFamily: 'Playfair Display'}} data-testid="checkout-title">
          Checkout
        </h1>

        <form onSubmit={handlePlaceOrder} className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Information */}
            <div className="glass-effect p-6 rounded-2xl" data-testid="shipping-form">
              <h2 className="text-2xl font-bold mb-6" style={{fontFamily: 'Playfair Display'}}>Shipping Information</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={shippingInfo.fullName}
                  onChange={(e) => setShippingInfo({ ...shippingInfo, fullName: e.target.value })}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#8b4513]"
                  required
                  data-testid="shipping-name"
                />
                <input
                  type="tel"
                  placeholder="Phone"
                  value={shippingInfo.phone}
                  onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#8b4513]"
                  required
                  data-testid="shipping-phone"
                />
                <input
                  type="text"
                  placeholder="Address"
                  value={shippingInfo.address}
                  onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                  className="md:col-span-2 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#8b4513]"
                  required
                  data-testid="shipping-address"
                />
                <input
                  type="text"
                  placeholder="City"
                  value={shippingInfo.city}
                  onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#8b4513]"
                  required
                  data-testid="shipping-city"
                />
                <input
                  type="text"
                  placeholder="State"
                  value={shippingInfo.state}
                  onChange={(e) => setShippingInfo({ ...shippingInfo, state: e.target.value })}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#8b4513]"
                  required
                  data-testid="shipping-state"
                />
                <input
                  type="text"
                  placeholder="ZIP Code"
                  value={shippingInfo.zipCode}
                  onChange={(e) => setShippingInfo({ ...shippingInfo, zipCode: e.target.value })}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#8b4513]"
                  required
                  data-testid="shipping-zip"
                />
              </div>
            </div>

            {/* Payment Method */}
            <div className="glass-effect p-6 rounded-2xl" data-testid="payment-method">
              <h2 className="text-2xl font-bold mb-6" style={{fontFamily: 'Playfair Display'}}>Payment Method</h2>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-[#8b4513] transition-colors">
                  <input
                    type="radio"
                    name="payment"
                    value="razorpay"
                    checked={paymentMethod === 'razorpay'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="accent-[#8b4513]"
                    data-testid="payment-razorpay"
                  />
                  <CreditCard size={24} className="text-[#8b4513]" />
                  <span className="font-medium">Razorpay (Cards, UPI, Net Banking)</span>
                </label>
                <label className="flex items-center gap-3 p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-[#8b4513] transition-colors">
                  <input
                    type="radio"
                    name="payment"
                    value="upi"
                    checked={paymentMethod === 'upi'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="accent-[#8b4513]"
                    data-testid="payment-upi"
                  />
                  <Smartphone size={24} className="text-[#8b4513]" />
                  <span className="font-medium">UPI</span>
                </label>
              </div>
              <p className="text-sm text-gray-500 mt-4">* Demo payment - Your order will be placed without actual payment</p>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="glass-effect p-6 rounded-2xl sticky top-24" data-testid="order-summary">
              <h3 className="text-2xl font-bold mb-6" style={{fontFamily: 'Playfair Display'}}>Order Summary</h3>

              <div className="space-y-3 mb-6">
                {cartItems.map((item, idx) => {
                  const product = products[item.product_id];
                  if (!product) return null;
                  return (
                    <div key={item.product_id} className="flex justify-between text-sm" data-testid={`summary-item-${idx}`}>
                      <span>{product.name} x {item.quantity}</span>
                      <span className="font-semibold">{inr.format(product.price * item.quantity)}</span>
                    </div>
                  );
                })}
              </div>

              <div className="border-t pt-4 space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold" data-testid="summary-subtotal">{inr.format(getTotal())}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold text-green-600">Free</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-lg">
                  <span className="font-bold">Total</span>
                  <span className="font-bold luxury-text text-2xl" data-testid="summary-total">{inr.format(getTotal())}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={processing}
                className="w-full btn-luxury py-3 disabled:opacity-50"
                data-testid="place-order-btn"
              >
                {processing ? 'Processing...' : 'Place Order'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;