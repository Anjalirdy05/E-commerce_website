import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, Filter, X } from 'lucide-react';
import { loadProducts, getCategories } from '@/services/data';
import ProductCard from '@/components/ProductCard';
import { toast } from 'sonner';

const inr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' });

const Products = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const search = params.get('search') || '';
    const category = params.get('category') || 'All';
    setSearchQuery(search);
    setSelectedCategory(category);
    fetchData(category, search);
  }, [location.search]);

  // ✅ Frontend-only data load and filter
  const fetchData = async (category = 'All', search = '') => {
    try {
      setLoading(true);
      const [all, cats] = await Promise.all([loadProducts(), getCategories()]);
      let list = all;
      if (category && category !== 'All') {
        list = list.filter((p) => p.category === category);
      }
      if (search) {
        const q = search.toLowerCase();
        list = list.filter(
          (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
        );
      }
      setProducts(list);
      setCategories(cats);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fix category selection + navigation
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    const params = new URLSearchParams();
    if (category && category !== 'All') params.set('category', category);
    if (searchQuery) params.set('search', searchQuery);
    navigate(`/products?${params.toString()}`);
  };

  const filteredProducts = products.filter(
    (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
  );

  return (
    <div className="min-h-screen" data-testid="products-page">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-bold luxury-text"
            style={{ fontFamily: 'Playfair Display' }}
            data-testid="products-title"
          >
            Our Collection
          </h1>
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className="md:hidden btn-luxury flex items-center gap-2"
            data-testid="filter-toggle-btn"
          >
            <Filter size={20} /> Filters
          </button>
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <div
            className={`${
              filterOpen ? 'fixed inset-0 z-50 bg-black/50' : 'hidden'
            } md:block md:relative md:w-64 md:flex-shrink-0`}
            data-testid="filters-sidebar"
          >
            <div
              className={`${
                filterOpen ? 'absolute right-0 top-0 h-full w-80 bg-white' : ''
              } md:sticky md:top-24`}
            >
              <div className="glass-effect p-6 rounded-2xl relative">
                {filterOpen && (
                  <button
                    onClick={() => setFilterOpen(false)}
                    className="md:hidden absolute top-4 right-4"
                    data-testid="filter-close-btn"
                  >
                    <X size={24} />
                  </button>
                )}
                <h3
                  className="text-xl font-semibold mb-4"
                  style={{ fontFamily: 'Playfair Display' }}
                >
                  Filters
                </h3>

                {/* ✅ Fixed Category Filter */}
                <div className="mb-6">
                  <h4 className="font-semibold mb-3">Category</h4>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        value="All"
                        checked={selectedCategory === 'All'}
                        onChange={() => handleCategoryChange('All')}
                        className="accent-[#8b4513]"
                        data-testid="category-all"
                      />
                      <span>All Categories</span>
                    </label>
                    {categories.map((cat, idx) => (
                      <label
                        key={idx}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="category"
                          value={cat}
                          checked={selectedCategory === cat}
                          onChange={() => handleCategoryChange(cat)}
                          className="accent-[#8b4513]"
                          data-testid={`category-${idx}`}
                        />
                        <span>{cat}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range Filter */}
                <div>
                  <h4 className="font-semibold mb-3">Price Range</h4>
                  <div className="space-y-3">
                    <input
                      type="range"
                      min="0"
                      max="10000"
                      value={priceRange[1]}
                      onChange={(e) =>
                        setPriceRange([0, parseInt(e.target.value)])
                      }
                      className="w-full accent-[#8b4513]"
                      data-testid="price-range-slider"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{inr.format(priceRange[0])}</span>
                      <span>{inr.format(priceRange[1])}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="text-center py-12" data-testid="products-loading">
                <div className="w-12 h-12 border-4 border-[#8b4513] border-t-transparent rounded-full animate-spin mx-auto"></div>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12" data-testid="no-products">
                <p className="text-xl text-gray-500">No products found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product, idx) => (
                  <ProductCard key={product.id} product={product} index={idx} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
