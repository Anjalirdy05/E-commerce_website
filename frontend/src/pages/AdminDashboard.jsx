import React, { useState, useEffect } from 'react';
import { Package, DollarSign, Users, ShoppingBag, Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { loadProducts } from '@/services/data';

const inr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' });

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('analytics');
  const [analytics, setAnalytics] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: 0,
    category: '',
    stock: 0,
    images: ['']
  });

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      if (activeTab === 'analytics') {
        const prods = await loadProducts();
        const ords = JSON.parse(localStorage.getItem('orders') || '[]');
        const users = JSON.parse(localStorage.getItem('mock_users') || '[]');
        const revenue = ords.reduce((s, o) => s + (o.total_amount || 0), 0);
        setAnalytics({
          total_revenue: revenue,
          total_orders: ords.length,
          total_products: prods.length,
          total_users: users.length,
        });
      } else if (activeTab === 'products') {
        const prods = await loadProducts();
        setProducts(prods);
      } else if (activeTab === 'orders') {
        const ords = JSON.parse(localStorage.getItem('orders') || '[]');
        setOrders(ords);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    toast.info('Disabled in frontend-only build. Edit products.json to change catalog.');
    setShowProductModal(false);
    setEditingProduct(null);
    setProductForm({ name: '', description: '', price: 0, category: '', stock: 0, images: [''] });
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Frontend-only build: edit products.json manually. Open anyway?')) return;
    toast.info('Open frontend/public/products.json and remove the item.');
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock,
      images: product.images
    });
    setShowProductModal(true);
  };

  return (
    <div className="min-h-screen" data-testid="admin-dashboard">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold luxury-text mb-8" style={{fontFamily: 'Playfair Display'}} data-testid="admin-title">
          Admin Dashboard
        </h1>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 overflow-x-auto" data-testid="admin-tabs">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'analytics' ? 'btn-luxury' : 'bg-white hover:bg-gray-100'
            }`}
            data-testid="tab-analytics"
          >
            Analytics
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'products' ? 'btn-luxury' : 'bg-white hover:bg-gray-100'
            }`}
            data-testid="tab-products"
          >
            Products
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'orders' ? 'btn-luxury' : 'bg-white hover:bg-gray-100'
            }`}
            data-testid="tab-orders"
          >
            Orders
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12" data-testid="admin-loading">
            <div className="w-12 h-12 border-4 border-[#8b4513] border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        ) : (
          <>
            {/* Analytics Tab */}
            {activeTab === 'analytics' && analytics && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" data-testid="analytics-section">
                <div className="glass-effect p-6 rounded-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <DollarSign size={32} className="text-green-600" />
                  </div>
                  <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                  <p className="text-3xl font-bold luxury-text" data-testid="analytics-revenue">{inr.format(analytics.total_revenue)}</p>
                </div>
                <div className="glass-effect p-6 rounded-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <ShoppingBag size={32} className="text-blue-600" />
                  </div>
                  <p className="text-sm text-gray-600 mb-1">Total Orders</p>
                  <p className="text-3xl font-bold" data-testid="analytics-orders">{analytics.total_orders}</p>
                </div>
                <div className="glass-effect p-6 rounded-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <Package size={32} className="text-purple-600" />
                  </div>
                  <p className="text-sm text-gray-600 mb-1">Total Products</p>
                  <p className="text-3xl font-bold" data-testid="analytics-products">{analytics.total_products}</p>
                </div>
                <div className="glass-effect p-6 rounded-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <Users size={32} className="text-orange-600" />
                  </div>
                  <p className="text-sm text-gray-600 mb-1">Total Users</p>
                  <p className="text-3xl font-bold" data-testid="analytics-users">{analytics.total_users}</p>
                </div>
              </div>
            )}

            {/* Products Tab */}
            {activeTab === 'products' && (
              <div data-testid="products-section">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Manage Products</h2>
                  <button
                    onClick={() => {
                      setEditingProduct(null);
                      setProductForm({ name: '', description: '', price: 0, category: '', stock: 0, images: [''] });
                      setShowProductModal(true);
                    }}
                    className="btn-luxury flex items-center gap-2"
                    data-testid="add-product-btn"
                  >
                    <Plus size={20} /> Add Product
                  </button>
                </div>

                <div className="glass-effect rounded-2xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-4 text-left text-sm font-semibold">Product</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold">Price</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold">Stock</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold">Category</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {products.map((product, idx) => (
                          <tr key={product.id} data-testid={`product-row-${idx}`}>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <img src={product.images[0]} alt={product.name} className="w-12 h-12 rounded-lg object-cover" />
                                <span className="font-medium">{product.name}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">{inr.format(product.price)}</td>
                            <td className="px-6 py-4">{product.stock}</td>
                            <td className="px-6 py-4">{product.category}</td>
                            <td className="px-6 py-4">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => openEditModal(product)}
                                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                  data-testid={`edit-product-${idx}`}
                                >
                                  <Edit size={18} className="text-blue-600" />
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(product.id)}
                                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                  data-testid={`delete-product-${idx}`}
                                >
                                  <Trash2 size={18} className="text-red-600" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div data-testid="orders-section">
                <h2 className="text-2xl font-bold mb-6">Manage Orders</h2>
                <div className="space-y-4">
                  {orders.map((order, idx) => (
                    <div key={order.id} className="glass-effect p-6 rounded-2xl" data-testid={`order-row-${idx}`}>
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold">Order #{order.id.slice(0, 8)}</h3>
                          <p className="text-sm text-gray-600">{new Date(order.created_at).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold luxury-text">${order.total_amount.toFixed(2)}</p>
                          <p className="text-sm text-gray-600">{order.tracking_status}</p>
                        </div>
                      </div>
                      <div className="border-t pt-4">
                        <p className="text-sm text-gray-600">Items:</p>
                        {order.items.map((item, itemIdx) => (
                          <p key={itemIdx} className="text-sm">{item.product_name} x {item.quantity}</p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Product Modal */}
      <Dialog open={showProductModal} onOpenChange={setShowProductModal}>
        <DialogContent className="max-w-2xl" data-testid="product-modal">
          <DialogHeader>
            <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateProduct} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Product Name</label>
              <input
                type="text"
                value={productForm.name}
                onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#8b4513]"
                required
                data-testid="product-name-input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                value={productForm.description}
                onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#8b4513] resize-none"
                rows="3"
                required
                data-testid="product-description-input"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Price</label>
                <input
                  type="number"
                  step="0.01"
                  value={productForm.price}
                  onChange={(e) => setProductForm({ ...productForm, price: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#8b4513]"
                  required
                  data-testid="product-price-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Stock</label>
                <input
                  type="number"
                  value={productForm.stock}
                  onChange={(e) => setProductForm({ ...productForm, stock: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#8b4513]"
                  required
                  data-testid="product-stock-input"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <input
                type="text"
                value={productForm.category}
                onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#8b4513]"
                required
                data-testid="product-category-input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Image URL</label>
              <input
                type="url"
                value={productForm.images[0]}
                onChange={(e) => setProductForm({ ...productForm, images: [e.target.value] })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#8b4513]"
                required
                data-testid="product-image-input"
              />
            </div>
            <div className="flex gap-3">
              <button type="submit" className="btn-luxury flex-1" data-testid="product-save-btn">
                {editingProduct ? 'Update Product' : 'Create Product'}
              </button>
              <button
                type="button"
                onClick={() => setShowProductModal(false)}
                className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-full font-semibold hover:bg-gray-100 transition-colors"
                data-testid="product-cancel-btn"
              >
                Cancel
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;