import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';

const categories = [
  { label: 'Electronics', href: '/products?category=electronics' },
  { label: 'Clothing', href: '/products?category=fashion' },
  { label: 'Home & Garden', href: '/products?category=home-garden' },
  { label: 'Sports', href: '/products?category=sports-outdoors' },
  { label: 'Books', href: '/products?category=books' },
  { label: 'Beauty', href: '/products?category=beauty' },
  { label: 'Toys', href: '/products?category=toys' },
  { label: 'Health', href: '/products?category=health' },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get('search') as string;
    if (query.trim()) {
      navigate(`/products?search=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* Main header row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 h-16">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">E</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Ecomm</span>
          </Link>

          {/* Search — desktop */}
          <div className="hidden md:flex flex-1">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="search"
                  placeholder="Search products, brands, categories..."
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-full text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </form>
          </div>

          {/* Right icons */}
          <div className="flex items-center space-x-1 ml-auto md:ml-0">
            {/* Admin shortcut */}
            {user?.role === 'admin' && (
              <Link
                to="/admin"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-[#1c3557] text-white text-sm font-medium rounded-lg hover:bg-[#162843] transition-colors mr-1"
              >
                Admin
              </Link>
            )}

            {/* Account */}
            <div className="relative group">
              <button className="flex items-center space-x-1.5 px-2 py-2 text-gray-600 hover:text-blue-600 transition-colors">
                <User className="w-6 h-6" />
                <span className="hidden sm:block text-sm font-medium">
                  {user ? user.name : 'Account'}
                </span>
              </button>
              <div className="absolute top-full right-0 mt-1 w-48 bg-white rounded-xl shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <div className="py-2">
                  {user ? (
                    <>
                      <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg mx-1">My Profile</Link>
                      <Link to="/profile#orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg mx-1">Order History</Link>
                      {user.role === 'admin' && (
                        <Link to="/admin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg mx-1">Admin Dashboard</Link>
                      )}
                      <hr className="my-1 mx-2" />
                      <button onClick={logout} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 rounded-lg mx-1">Sign Out</button>
                    </>
                  ) : (
                    <>
                      <Link to="/login" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg mx-1">Sign In</Link>
                      <Link to="/register" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg mx-1">Create Account</Link>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Cart */}
            <Link to="/cart" className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors">
              <ShoppingCart className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Mobile hamburger */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-blue-600"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile panel */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 border-t border-gray-100 pt-4 space-y-4">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="search"
                  placeholder="Search products, brands, categories..."
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-full text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </form>
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <Link
                  key={cat.label}
                  to={cat.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-sm text-gray-600 hover:text-blue-600 px-3 py-1.5 bg-gray-100 hover:bg-blue-50 rounded-full transition-colors"
                >
                  {cat.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Category nav — desktop */}
      <div className="hidden md:block border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-8 py-2.5" aria-label="Product categories">
            {categories.map(cat => (
              <Link
                key={cat.label}
                to={cat.href}
                className="text-sm text-gray-600 hover:text-blue-600 transition-colors whitespace-nowrap"
              >
                {cat.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
