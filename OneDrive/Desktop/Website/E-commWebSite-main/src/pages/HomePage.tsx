import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight, Truck, Shield, RefreshCw, Headphones,
  Monitor, Shirt, Home, Dumbbell, BookOpen, Sparkles, Smile, Heart, Search, Zap,Tire,Lego,ToyCar,
} from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/products/ProductCard';

const categoryCards = [
  { label: 'Electronics & Other', href: '/products?category=electronics&other', icon: Monitor, bg: 'bg-blue-50', color: 'text-blue-600' },
 // { label: 'Clothing', href: '/products?category=fashion', icon: Shirt, bg: 'bg-purple-50', color: 'text-purple-600' },
  //{ label: 'Home & Garden', href: '/products?category=home-garden', icon: Home, bg: 'bg-green-50', color: 'text-green-600' },
  //{ label: 'Sports', href: '/products?category=sports-outdoors', icon: Dumbbell, bg: 'bg-orange-50', color: 'text-orange-500' },
  { label: 'Hot Wheels', href: '/products?category=how wheels', icon: ToyCar, bg: 'bg-yellow-50', color: 'text-yellow-600' },
  { label: 'Lego', href: '/products?category=lego', icon: Lego, bg: 'bg-pink-50', color: 'text-pink-500' },
  { label: 'Funko Pop', href: '/products?category=toys', icon: Smile, bg: 'bg-teal-50', color: 'text-teal-500' },
  { label: 'Tire', href: '/products?category=health', icon: Tire, bg: 'bg-rose-50', color: 'text-rose-500' },
];

const benefits = [
  { icon: Truck, label: 'Free Shipping', sub: 'On orders over $50', color: 'text-blue-600', bg: 'bg-blue-50' },
  { icon: Shield, label: 'Secure Payment', sub: '100% protected', color: 'text-green-600', bg: 'bg-green-50' },
  { icon: RefreshCw, label: 'Easy Returns', sub: '30-day returns', color: 'text-orange-500', bg: 'bg-orange-50' },
  { icon: Headphones, label: '24/7 Support', sub: 'Always here for you', color: 'text-purple-600', bg: 'bg-purple-50' },
];

export default function HomePage() {
  const { products, loading } = useProducts();
  const navigate = useNavigate();
  const [heroSearch, setHeroSearch] = useState('');

  const featuredProducts = products.filter(p => p.featured).slice(0, 4);
  const dealsOfTheDay = products.filter(p => p.originalPrice && p.originalPrice > p.price).slice(0, 4);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      navigate(`/products?search=${encodeURIComponent(heroSearch.trim())}`);
    }
  };

  const jsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'EComm — Online Shopping',
    url: 'https://ecommnexora.netlify.app/',
    description: 'Discover millions of products from trusted sellers worldwide.',
  });

  return (
    <>
      <Helmet>
        <title>EComm — Shop Electronics, Fashion, Home &amp; More</title>
        <meta name="description" content="Discover millions of products from trusted sellers worldwide. Shop electronics, fashion, home & garden, sports and more with fast shipping and easy returns." />
        <link rel="canonical" href="https://ecommnexora.netlify.app/" />
        <meta property="og:title" content="EComm — Shop Electronics, Fashion, Home & More" />
        <meta property="og:description" content="Shop millions of products from trusted sellers. Fast shipping, easy returns, unbeatable prices." />
        <meta property="og:url" content="https://ecommnexora.netlify.app/" />
        <script type="application/ld+json">{jsonLd}</script>
      </Helmet>
      <div className="bg-gray-50">
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="bg-[#1c3557] text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* Left */}
            <div className="space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-[#243f6a] text-blue-200 text-sm font-medium px-4 py-2 rounded-full">
                <Zap className="w-4 h-4 text-yellow-400" />
                Summer Sale — Up to 60% Off
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                Discover What's{' '}
                <span className="text-blue-400">Next</span>
              </h1>

              <p className="text-blue-100 text-lg max-w-md">
                Shop millions of products from trusted sellers worldwide. Fast shipping, easy returns, and unbeatable prices.
              </p>

              {/* Hero search */}
              <form onSubmit={handleHeroSearch} className="flex gap-3 max-w-md">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={heroSearch}
                    onChange={e => setHeroSearch(e.target.value)}
                    placeholder="Search products, brands, categories..."
                    className="w-full pl-10 pr-4 py-3 rounded-full text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-white text-[#1c3557] px-5 py-3 rounded-full font-semibold text-sm hover:bg-gray-100 transition-colors whitespace-nowrap"
                >
                  Search
                </button>
              </form>

              {/* CTA buttons */}
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 bg-white text-[#1c3557] px-6 py-3 rounded-full font-semibold text-sm hover:bg-gray-100 transition-colors"
                >
                  Shop Now <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/products?featured=true"
                  className="inline-flex items-center gap-2 border border-white/40 text-white px-6 py-3 rounded-full font-semibold text-sm hover:bg-white/10 transition-colors"
                >
                  Featured Picks
                </Link>
              </div>
            </div>

            {/* Right — hero image */}
            <div className="relative hidden lg:block">
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3]">
                <img
                  src="https://images.pexels.com/photos/1884581/pexels-photo-1884581.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Fashion store interior"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Stat badges */}
              <div className="absolute top-4 right-4 bg-white text-gray-900 rounded-xl px-4 py-3 shadow-lg text-center">
                <p className="text-xs text-gray-500">Trusted Sellers</p>
                <p className="font-bold text-sm">2K+ Brands</p>
              </div>
              <div className="absolute bottom-4 left-4 bg-white text-gray-900 rounded-xl px-4 py-3 shadow-lg text-center">
                <p className="text-xs text-gray-500">Trending Now</p>
                <p className="font-bold text-sm">50K+ Products</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Benefits ──────────────────────────────────────────────────── */}
      <section className="bg-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {benefits.map(({ icon: Icon, label, sub, color, bg }) => (
              <div key={label} className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 bg-white shadow-sm">
                <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-6 h-6 ${color}`} />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{label}</p>
                  <p className="text-gray-500 text-xs">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Shop by Category ──────────────────────────────────────────── */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Shop by Category</h2>
          <div className="grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {categoryCards.map(({ label, href, icon: Icon, bg, color }) => (
              <Link
                key={label}
                to={href}
                className="flex flex-col items-center gap-3 p-4 rounded-2xl border border-gray-100 bg-white hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
              >
                <div className={`w-14 h-14 ${bg} rounded-2xl flex items-center justify-center`}>
                  <Icon className={`w-7 h-7 ${color}`} />
                </div>
                <span className="text-xs font-medium text-gray-700 text-center leading-tight">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Products ─────────────────────────────────────────── */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
              <p className="text-gray-500 text-sm mt-1">Handpicked by our curators</p>
            </div>
            <Link to="/products?featured=true" className="text-sm font-medium text-gray-600 hover:text-blue-600 flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => <div key={i} className="bg-white rounded-2xl h-80 animate-pulse" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} showDiscount />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Today's Deals ─────────────────────────────────────────────── */}
      {dealsOfTheDay.length > 0 && (
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Today's Deals</h2>
                <p className="text-gray-500 text-sm mt-1">Limited time offers you don't want to miss</p>
              </div>
              <Link to="/products?deals=true" className="text-sm font-medium text-gray-600 hover:text-red-600 flex items-center gap-1">
                View All Deals <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {dealsOfTheDay.map(product => (
                <ProductCard key={product.id} product={product} showDiscount />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Newsletter ────────────────────────────────────────────────── */}
      <section className="py-14 bg-[#1c3557]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Stay Updated</h2>
          <p className="text-blue-200 mb-8 max-w-xl mx-auto text-sm">
            Get the latest deals, new arrivals, and exclusive offers delivered to your inbox.
          </p>
          <div className="max-w-md mx-auto flex gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button className="bg-white text-[#1c3557] px-6 py-3 rounded-full font-semibold text-sm hover:bg-gray-100 transition-colors whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>
      </section>
      </div>
    </>
  );
}
