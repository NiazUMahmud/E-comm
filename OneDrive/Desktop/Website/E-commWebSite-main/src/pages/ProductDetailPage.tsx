import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Heart, ShoppingCart, Truck, Shield, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { useProduct } from '../hooks/useProducts';
import { useCart } from '../contexts/CartContext';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { product, loading, error } = useProduct(id ?? '');
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="lg:grid lg:grid-cols-2 lg:gap-16 animate-pulse">
          <div className="bg-gray-200 aspect-square rounded-lg mb-8 lg:mb-0" />
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="h-6 bg-gray-200 rounded w-1/2" />
            <div className="h-24 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h1>
        <Link to="/products" className="text-blue-600 hover:text-blue-800">Back to Products</Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart({ id: product.id, name: product.name, price: product.price, image: product.images[0], stock: product.stock });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
        <Link to="/" className="hover:text-blue-600">Home</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-blue-600">Products</Link>
        <span>/</span>
        <span className="text-blue-600">{product.name}</span>
      </nav>

      <div className="lg:grid lg:grid-cols-2 lg:gap-16">
        <div className="mb-8 lg:mb-0">
          <div className="aspect-square mb-4 bg-gray-100 rounded-lg overflow-hidden">
            <img src={product.images[selectedImage]} alt={product.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex space-x-2">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                  selectedImage === index ? 'border-blue-600' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <img src={image} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm text-blue-600 font-medium mb-2">{product.brand}</p>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>

          <div className="flex items-center space-x-4 mb-6">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
              ))}
            </div>
            <span className="text-sm text-gray-600">{product.rating} ({product.reviewCount} reviews)</span>
          </div>

          <div className="mb-6">
            <div className="flex items-center space-x-3 mb-2">
              <span className="text-3xl font-bold text-gray-900">${product.price}</span>
              {product.originalPrice && (
                <>
                  <span className="text-xl text-gray-500 line-through">${product.originalPrice}</span>
                  <span className="bg-red-100 text-red-800 text-sm font-medium px-2 py-1 rounded-md">
                    Save ${product.originalPrice - product.price}
                  </span>
                </>
              )}
            </div>
          </div>

          <p className="text-gray-700 leading-relaxed mb-8">{product.description}</p>

          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 hover:bg-gray-50 transition-colors">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="px-4 py-2 text-sm font-medium min-w-[3rem] text-center">{quantity}</span>
                <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="p-2 hover:bg-gray-50 transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <span className="text-sm text-gray-600">{product.stock} available</span>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart
              </button>
              <button className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Heart className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="flex items-center space-x-2 text-sm">
              <Truck className="w-5 h-5 text-green-600" />
              <span>Free shipping</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <RotateCcw className="w-5 h-5 text-blue-600" />
              <span>30-day returns</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Shield className="w-5 h-5 text-purple-600" />
              <span>2-year warranty</span>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Specifications</h3>
            <div className="space-y-3">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="text-gray-600">{key}</span>
                  <span className="font-medium text-gray-900">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
