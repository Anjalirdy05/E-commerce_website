import React, { useState, useEffect } from 'react';
import { Package, MapPin, Truck, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

const inr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' });

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = JSON.parse(localStorage.getItem('orders') || '[]');
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Order Placed':
        return <Package className="text-blue-600" />;
      case 'Shipped':
        return <Truck className="text-orange-600" />;
      case 'Delivered':
        return <CheckCircle className="text-green-600" />;
      default:
        return <MapPin className="text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" data-testid="orders-loading">
        <div className="w-12 h-12 border-4 border-[#8b4513] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" data-testid="orders-page">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold luxury-text mb-8" style={{fontFamily: 'Playfair Display'}} data-testid="orders-title">
          My Orders
        </h1>

        {orders.length === 0 ? (
          <div className="text-center py-16 glass-effect rounded-2xl" data-testid="no-orders">
            <Package size={64} className="mx-auto mb-4 text-gray-400" />
            <p className="text-xl text-gray-500">No orders yet</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order, idx) => (
              <div key={order.id} className="glass-effect p-6 rounded-2xl" data-testid={`order-${idx}`}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-1" data-testid={`order-id-${idx}`}>Order #{order.id.slice(0, 8)}</h3>
                    <p className="text-sm text-gray-600">
                      {new Date(order.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-gray-200">
                    {getStatusIcon(order.tracking_status)}
                    <span className="font-medium" data-testid={`order-status-${idx}`}>{order.tracking_status}</span>
                  </div>
                </div>

                <div className="border-t pt-4 space-y-3 mb-4">
                  {order.items.map((item, itemIdx) => (
                    <div key={itemIdx} className="flex justify-between" data-testid={`order-item-${idx}-${itemIdx}`}>
                      <span>{item.product_name} x {item.quantity}</span>
                      <span className="font-semibold">{inr.format(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600">Shipping Address:</p>
                    <p className="font-medium">
                      {order.shipping_address.address}, {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zipCode}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Total Amount</p>
                    <p className="text-2xl font-bold luxury-text" data-testid={`order-total-${idx}`}>{inr.format(order.total_amount)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;