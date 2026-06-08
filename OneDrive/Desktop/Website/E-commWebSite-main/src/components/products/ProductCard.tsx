import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Heart, ShoppingCart } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../contexts/CartContext';

interface ProductCardProps {
  product: Product;
  showDiscount?: boolean;
}

export default function ProductCard({ product, showDiscount = false }: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      stock: product.stock
    });
  };

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <Link to={`/products/${product.id}`} className="group block">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1">
        {/* Image container */}
        <div className="relative aspect-square overflow-hidden">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Discount badge */}
          {showDiscount && discountPercentage > 0 && (
            <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">
              {discountPercentage}% OFF
            </div>
          )}

          {/* Wishlist button */}
          <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
            <Heart className="w-4 h-4 text-gray-600 hover:text-red-500" />
          </button>

          {/* Quick add to cart */}
          <button
            onClick={handleAddToCart}
            className="absolute bottom-3 right-3 bg-blue-600 text-white p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all hover:bg-blue-700"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="mb-2">
            <p className="text-xs text-gray-500 uppercase tracking-wide">{product.brand}</p>
            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
              {product.name}
            </h3>
          </div>

          {/* Rating */}
          <div className="flex items-center space-x-1 mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product.rating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">
              {product.rating} ({product.reviewCount})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center space-x-2 mb-3">
            <span className="text-xl font-bold text-gray-900">
              ${product.price}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>

          {/* Stock status */}
          <div className="flex items-center justify-between">
            <span className={`text-xs px-2 py-1 rounded-full ${
              product.stock > 10
                ? 'bg-green-100 text-green-800'
                : product.stock > 0
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {product.stock > 10 ? 'In Stock' : product.stock > 0 ? 'Low Stock' : 'Out of Stock'}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}