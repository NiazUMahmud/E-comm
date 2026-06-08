import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Shield, Headphones } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/products/ProductCard';

export default function HomePage() {
  const { products, loading } = useProducts();

  const featuredProducts = products.filter(p => p.featured);
  const dealsOfTheDay = products.filter(p => p.originalPrice && p.originalPrice > p.price);

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-r from-blue-900 via-blue-800 to-blue-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Discover Amazing
              <span className="block text-yellow-400">Deals Every Day</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Shop millions of products from trusted sellers worldwide with fast, free shipping and easy returns.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/products"
                className="bg-yellow-500 text-black px-8 py-4 rounded-lg font-semibold text-lg hover:bg-yellow-400 transition-colors inline-flex items-center justify-center"
              >
                Shop Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                to="/products?featured=true"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-900 transition-colors"
              >
                Featured Products
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Free Shipping</h3>
              <p className="text-gray-600">Free shipping on orders over $50.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Shopping</h3>
              <p className="text-gray-600">Your data is protected with industry-standard encryption.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Headphones className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
              <p className="text-gray-600">Get help whenever you need it.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Featured Products</h2>
            <Link to="/products?featured=true" className="text-blue-600 hover:text-blue-800 font-medium flex items-center">
              View All <ArrowRight className="ml-1 w-4 h-4" />
            </Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl h-72 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Deals */}
      {dealsOfTheDay.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Today's Deals</h2>
                <p className="text-gray-600 mt-2">Limited time offers you don't want to miss</p>
              </div>
              <Link to="/products?deals=true" className="text-red-600 hover:text-red-800 font-medium flex items-center">
                View All Deals <ArrowRight className="ml-1 w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {dealsOfTheDay.map(product => (
                <ProductCard key={product.id} product={product} showDiscount />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Stay Updated</h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Get the latest deals, new arrivals, and exclusive offers delivered to your inbox.
          </p>
          <div className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg border border-blue-400 focus:ring-2 focus:ring-white focus:border-white"
            />
            <button className="bg-yellow-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
