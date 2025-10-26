import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '@/App';
import { ShoppingCart, Heart, User, LogOut, Search, Menu, X, Shield } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchCounts();
    const onStorage = () => fetchCounts();
    const onShow = () => fetchCounts();
    window.addEventListener('storage', onStorage);
    document.addEventListener('visibilitychange', onShow);
    return () => {
      window.removeEventListener('storage', onStorage);
      document.removeEventListener('visibilitychange', onShow);
    };
  }, [user]);

  const fetchCounts = () => {
    try {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      setCartCount(cart.length || 0);
      setWishlistCount(wishlist.length || 0);
    } catch (error) {
      console.error('Error computing counts:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${searchQuery}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <nav className="sticky top-0 z-50 glass-effect shadow-lg" data-testid="navbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center space-x-2" data-testid="logo-link">
            <div className="w-10 h-10 luxury-gradient rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">A</span>
            </div>
            <span className="text-2xl font-bold luxury-text">AR Shop</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-[#8b4513] font-medium transition-colors" data-testid="home-link">Home</Link>
            <Link to="/products" className="text-gray-700 hover:text-[#8b4513] font-medium transition-colors" data-testid="products-link">Products</Link>
            {user?.is_admin && (
              <Link to="/admin" className="text-gray-700 hover:text-[#8b4513] font-medium transition-colors flex items-center gap-1" data-testid="admin-link">
                <Shield size={18} /> Admin
              </Link>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              data-testid="search-toggle-btn"
            >
              <Search size={22} className="text-gray-700" />
            </button>

            {user ? (
              <>
                <Link to="/wishlist" className="p-2 hover:bg-gray-100 rounded-full transition-colors relative" data-testid="wishlist-link">
                  <Heart size={22} className="text-gray-700" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#8b4513] text-white text-xs w-5 h-5 flex items-center justify-center rounded-full" data-testid="wishlist-count">
                      {wishlistCount}
                    </span>
                  )}
                </Link>

                <Link to="/cart" className="p-2 hover:bg-gray-100 rounded-full transition-colors relative" data-testid="cart-link">
                  <ShoppingCart size={22} className="text-gray-700" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#8b4513] text-white text-xs w-5 h-5 flex items-center justify-center rounded-full" data-testid="cart-count">
                      {cartCount}
                    </span>
                  )}
                </Link>

                <div className="relative group">
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors" data-testid="user-menu-btn">
                    <User size={22} className="text-gray-700" />
                  </button>
                  <div className="absolute right-0 mt-2 w-48 glass-effect rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all" data-testid="user-dropdown">
                    <Link to="/profile" className="block px-4 py-3 hover:bg-gray-100 transition-colors" data-testid="profile-link">
                      Profile
                    </Link>
                    <Link to="/orders" className="block px-4 py-3 hover:bg-gray-100 transition-colors" data-testid="orders-link">
                      Orders
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 hover:bg-gray-100 transition-colors flex items-center gap-2 text-red-600"
                      data-testid="logout-btn"
                    >
                      <LogOut size={18} /> Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <Link to="/auth">
                <button className="btn-luxury" data-testid="login-btn">Login</button>
              </Link>
            )}

            <button
              className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="mobile-menu-toggle"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {searchOpen && (
          <div className="pb-4" data-testid="search-bar">
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="flex-1 px-4 py-2 rounded-full border-2 border-gray-200 focus:border-[#8b4513] outline-none transition-colors"
                data-testid="search-input"
              />
              <button type="submit" className="btn-luxury" data-testid="search-submit-btn">
                Search
              </button>
            </form>
          </div>
        )}

        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2" data-testid="mobile-menu">
            <Link to="/" className="block py-2 text-gray-700 hover:text-[#8b4513] font-medium" data-testid="mobile-home-link">
              Home
            </Link>
            <Link to="/products" className="block py-2 text-gray-700 hover:text-[#8b4513] font-medium" data-testid="mobile-products-link">
              Products
            </Link>
            {user?.is_admin && (
              <Link to="/admin" className="block py-2 text-gray-700 hover:text-[#8b4513] font-medium" data-testid="mobile-admin-link">
                Admin Dashboard
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;