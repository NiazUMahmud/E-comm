import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, totalPrice, totalItems } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-8" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Looks like you haven't added anything to your cart yet. Start shopping to fill it up!
          </p>
          <Link
            to="/products"
            className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center mb-8">
        <Link
          to="/products"
          className="flex items-center text-blue-600 hover:text-blue-800 mr-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Continue Shopping
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Shopping Cart ({totalItems} items)</h1>
      </div>

      <div className="lg:grid lg:grid-cols-12 lg:gap-8">
        {/* Cart items */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {items.map((item, index) => (
              <div key={item.id} className={`p-6 ${index !== items.length - 1 ? 'border-b border-gray-200' : ''}`}>
                <div className="flex items-center space-x-4">
                  {/* Product image */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />

                  {/* Product details */}
                  <div className="flex-1 min-w-0">
                    <Link to={`/products/${item.id}`} className="text-lg font-medium text-gray-900 hover:text-blue-600">
                      {item.name}
                    </Link>
                    <p className="text-gray-600 text-sm mt-1">In Stock</p>
                    <div className="flex items-center mt-2">
                      <span className="text-xl font-bold text-gray-900">${item.price}</span>
                    </div>
                  </div>

                  {/* Quantity controls */}
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-2 hover:bg-gray-50 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-4 py-2 text-sm font-medium min-w-[3rem] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                        className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Remove button */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order summary */}
        <div className="lg:col-span-4 mt-8 lg:mt-0">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Order Summary</h3>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal ({totalItems} items)</span>
                <span className="font-medium">${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium text-green-600">Free</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium">${(totalPrice * 0.08).toFixed(2)}</span>
              </div>
              <hr className="border-gray-200" />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${(totalPrice * 1.08).toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => navigate(user ? '/checkout' : '/login?redirect=%2Fcheckout')}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors text-center block"
            >
              {user ? 'Proceed to Checkout' : 'Sign in to Checkout'}
            </button>

            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">
                Secure checkout powered by Stripe
              </p>
            </div>
          </div>

          {/* Recommended products */}
          <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h4 className="font-semibold text-gray-900 mb-4">You might also like</h4>
            <div className="space-y-4">
              {/* Mock recommended items */}
              <div className="flex space-x-3">
                <img
                  src="https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg"
                  alt="Recommended product"
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Wireless Headphones</p>
                  <p className="text-sm text-gray-600">$199</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}