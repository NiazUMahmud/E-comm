import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Package, Heart, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useMyOrders } from '../hooks/useOrders';

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const { orders, loading: ordersLoading } = useMyOrders(user?.id);
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'orders', label: 'My Orders', icon: Package },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Account</h1>

      <div className="lg:grid lg:grid-cols-4 lg:gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1 mb-8 lg:mb-0">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{user?.name}</h3>
                <p className="text-sm text-gray-600">{user?.email}</p>
              </div>
            </div>

            <nav className="space-y-1">
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === tab.id ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
              <button
                onClick={logout}
                className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Main */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {/* Profile */}
            {activeTab === 'profile' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Profile Information</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                      <input
                        type="text"
                        defaultValue={user?.name ?? ''}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        defaultValue={user?.email ?? ''}
                        disabled
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      user?.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user?.role === 'admin' ? 'Administrator' : 'Customer'}
                    </span>
                  </div>
                  <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {/* Orders */}
            {activeTab === 'orders' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Order History</h2>
                {ordersLoading ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => <div key={i} className="h-24 bg-gray-100 rounded-lg animate-pulse" />)}
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">No orders yet</p>
                    <Link to="/products" className="text-blue-600 hover:text-blue-800 font-medium">Start shopping</Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map(order => (
                      <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p className="font-medium text-gray-900">Order #{order.id.slice(0, 8)}</p>
                            <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                          </div>
                          <div className="text-right">
                            <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${STATUS_COLORS[order.status] ?? ''}`}>
                              {order.status}
                            </span>
                            <p className="text-sm font-bold text-gray-900 mt-1">${order.total.toFixed(2)}</p>
                          </div>
                        </div>
                        <div className="flex gap-3 flex-wrap">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                              <img src={item.image} alt={item.name} className="w-8 h-8 rounded object-cover" />
                              <span>{item.name} × {item.quantity}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Wishlist placeholder */}
            {activeTab === 'wishlist' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">My Wishlist</h2>
                <div className="text-center py-12">
                  <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">Your wishlist is empty</p>
                  <Link to="/products" className="text-blue-600 hover:text-blue-800 font-medium">Discover products</Link>
                </div>
              </div>
            )}

            {/* Settings */}
            {activeTab === 'settings' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Account Settings</h2>
                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-1">Change Password</h3>
                    <p className="text-sm text-gray-600 mb-3">Update your password to keep your account secure.</p>
                    <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">Change password</button>
                  </div>
                  <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                    <h3 className="font-medium text-red-900 mb-1">Delete Account</h3>
                    <p className="text-sm text-red-700 mb-3">Permanently delete your account and all associated data.</p>
                    <button className="text-sm text-red-600 hover:text-red-800 font-medium">Delete account</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
