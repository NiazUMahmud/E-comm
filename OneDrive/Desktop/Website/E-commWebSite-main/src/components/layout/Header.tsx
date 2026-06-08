import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, X, Heart } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import CategoryMenu from './CategoryMenu';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
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
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      {/* Top bar */}
      <div className="bg-gray-900 text-white text-xs py-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          Free shipping on orders over $50 • 30-day returns
        </div>
      </div>

      {/* Main header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">E</span>
            </div>
            <span className="text-xl font-bold text-gray-900">EComm</span>
          </Link>

          {/* Search bar - desktop */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <form onSubmit={handleSearch} className="w-full relative">
              <div className="relative">
                <input
                  type="text"
                  name="search"
                  placeholder="Search for products..."
                  className="w-full pl-4 pr-12 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 text-gray-400 hover:text-blue-600 transition-colors"
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </form>
          </div>

          {/* Navigation icons */}
          <div className="flex items-center space-x-4">
            {/* Wishlist */}
            <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors relative group">
              <Heart className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                2
              </span>
            </button>

            {/* Cart */}
            <Link to="/cart" className="p-2 text-gray-600 hover:text-blue-600 transition-colors relative group">
              <ShoppingCart className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* User menu */}
            <div className="relative group">
              {user ? (
                <div className="flex items-center space-x-2">
                  <button className="flex items-center space-x-2 p-2 text-gray-600 hover:text-blue-600 transition-colors">
                    <User className="w-6 h-6" />
                    <span className="hidden sm:block text-sm font-medium">{user.name}</span>
                  </button>
                  <div className="absolute top-full right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <div className="py-2">
                      <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        My Profile
                      </Link>
                      <Link to="/profile#orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        Order History
                      </Link>
                      {user.role === 'admin' && (
                        <Link to="/admin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                          Admin Dashboard
                        </Link>
                      )}
                      <hr className="my-1" />
                      <button
                        onClick={logout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link to="/login" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                    Sign In
                  </Link>
                  <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-600"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Categories bar */}
        <div className="hidden lg:flex items-center space-x-8 py-3 border-t border-gray-200">
          <button
            onMouseEnter={() => setShowCategories(true)}
            onMouseLeave={() => setShowCategories(false)}
            className="flex items-center space-x-1 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors relative"
          >
            <Menu className="w-4 h-4" />
            <span>All Categories</span>
            {showCategories && <CategoryMenu />}
          </button>
          
          <Link to="/products?featured=true" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
            Featured
          </Link>
          <Link to="/products?category=electronics" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
            Electronics
          </Link>
          <Link to="/products?category=fashion" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
            Fashion
          </Link>
          <Link to="/products?category=home-garden" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
            Home
          </Link>
          <Link to="/products?category=sports-outdoors" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
            Sports
          </Link>
          <span className="text-sm font-medium text-red-600">Today's Deals</span>
        </div>

        {/* Mobile search */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <input
                  type="text"
                  name="search"
                  placeholder="Search for products..."
                  className="w-full pl-4 pr-12 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 text-gray-400 hover:text-blue-600"
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </header>
  );
}