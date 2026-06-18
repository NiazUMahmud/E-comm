import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Grid, List, SlidersHorizontal } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/products/ProductCard';
import ProductFilters from '../components/products/ProductFilters';

export default function ProductsPage() {
  const [searchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('relevance');
  const { products, loading } = useProducts();

  const availableBrands = useMemo(() => {
    const brands = new Set(products.map(p => p.brand).filter(Boolean));
    return Array.from(brands).sort();
  }, [products]);

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    const search = searchParams.get('search');
    if (search) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase()) ||
        p.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
      );
    }

    const category = searchParams.get('category');
    if (category) {
      filtered = filtered.filter(p =>
        p.category.toLowerCase().replace(' & ', '-').replace(' ', '-') === category
      );
    }

    if (searchParams.get('featured') === 'true') {
      filtered = filtered.filter(p => p.featured);
    }

    if (searchParams.get('deals') === 'true') {
      filtered = filtered.filter(p => p.originalPrice && p.originalPrice > p.price);
    }

    const price = searchParams.get('price');
    if (price === 'under-50')   filtered = filtered.filter(p => p.price < 50);
    else if (price === '50-100')  filtered = filtered.filter(p => p.price >= 50 && p.price <= 100);
    else if (price === '100-500') filtered = filtered.filter(p => p.price > 100 && p.price <= 500);
    else if (price === 'over-500') filtered = filtered.filter(p => p.price > 500);

    const minRating = Number(searchParams.get('minRating'));
    if (minRating >= 1 && minRating <= 5) {
      filtered = filtered.filter(p => p.rating >= minRating);
    }

    const brand = searchParams.get('brand');
    if (brand) {
      filtered = filtered.filter(p => p.brand === brand);
    }

    switch (sortBy) {
      case 'price-low': filtered.sort((a, b) => a.price - b.price); break;
      case 'price-high': filtered.sort((a, b) => b.price - a.price); break;
      case 'rating': filtered.sort((a, b) => b.rating - a.rating); break;
      case 'newest': filtered.sort((a, b) => b.id.localeCompare(a.id)); break;
    }

    return filtered;
  }, [products, searchParams, sortBy]);

  const activeCategory = searchParams.get('category');
  const activeSearch = searchParams.get('search');
  const pageTitle = activeSearch
    ? `Search: "${activeSearch}" — EComm`
    : activeCategory
    ? `${activeCategory.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())} — EComm`
    : 'All Products — EComm';
  const pageDesc = activeSearch
    ? `Shop results for "${activeSearch}" on EComm.`
    : activeCategory
    ? `Browse ${activeCategory.replace(/-/g, ' ')} products on EComm. Fast shipping, easy returns.`
    : 'Shop thousands of products across electronics, clothing, home, sports and more.';

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <link rel="canonical" href="https://ecommnexora.netlify.app/products" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
      </Helmet>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
        <span>Home</span><span>/</span><span>Products</span>
      </nav>

      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {searchParams.get('search') || 'All Products'}
          </h1>
          <p className="text-gray-600">
            {loading ? 'Loading...' : `${filteredProducts.length} products found`}
          </p>
        </div>

        <div className="flex items-center space-x-4 mt-4 lg:mt-0">
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          >
            <option value="relevance">Sort by Relevance</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Customer Rating</option>
            <option value="newest">Newest First</option>
          </select>

          <div className="flex border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden flex items-center space-x-2 border border-gray-300 rounded-lg px-3 py-2 text-gray-600 hover:bg-gray-50"
          >
            <SlidersHorizontal className="w-5 h-5" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      <div className="flex gap-8">
        <aside className={`lg:block lg:w-64 flex-shrink-0 ${showFilters ? 'block' : 'hidden'}`}>
          <ProductFilters availableBrands={availableBrands} />
        </aside>

        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl h-72 animate-pulse" />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No products found matching your criteria.</p>
              <button
                onClick={() => window.location.href = '/products'}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                : 'space-y-6'
            }>
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} showDiscount={!!product.originalPrice} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
}
