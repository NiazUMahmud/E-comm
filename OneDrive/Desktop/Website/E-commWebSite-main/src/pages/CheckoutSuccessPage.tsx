import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';

export default function CheckoutSuccessPage() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order');

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="w-12 h-12 text-green-600" />
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Confirmed!</h1>
      <p className="text-lg text-gray-600 mb-2">
        Thank you for your purchase. Your order has been placed successfully.
      </p>

      {orderId && (
        <p className="text-sm text-gray-500 mb-8">
          Order ID: <span className="font-mono font-medium text-gray-700">{orderId}</span>
        </p>
      )}

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 mb-8 text-left">
        <div className="flex items-center gap-3 mb-3">
          <Package className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-900">What happens next?</h3>
        </div>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>• You will receive a confirmation email shortly</li>
          <li>• Your order will be processed within 1 business day</li>
          <li>• You can track your order in your profile page</li>
        </ul>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          to="/profile"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          View My Orders
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          to="/products"
          className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
