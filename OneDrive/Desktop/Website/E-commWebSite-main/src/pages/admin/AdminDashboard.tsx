import React, { useState, useRef } from 'react';
import { BarChart3, Package, DollarSign, TrendingUp, Plus, Pencil, Trash2, ChevronDown, Upload, X, Image } from 'lucide-react';
import { useProducts } from '../../hooks/useProducts';
import { useAllOrders, updateOrderStatus } from '../../hooks/useOrders';
import { supabase } from '../../lib/supabase';
import type { Product } from '../../types';
import type { Order } from '../../types';

// ─── Product form modal ───────────────────────────────────────────────────────
function ProductModal({
  product,
  onClose,
  onSaved,
}: {
  product: Partial<Product> | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const isEdit = !!product?.id;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    name: product?.name ?? '',
    description: product?.description ?? '',
    price: product?.price?.toString() ?? '',
    original_price: product?.originalPrice?.toString() ?? '',
    category: product?.category ?? '',
    subcategory: product?.subcategory ?? '',
    brand: product?.brand ?? '',
    stock: product?.stock?.toString() ?? '',
    featured: product?.featured ?? false,
    tags: product?.tags?.join(', ') ?? '',
  });
  const [images, setImages] = useState<string[]>(product?.images ?? []);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploading(true);
    setError('');
    const uploaded: string[] = [];
    for (const file of files) {
      const ext = file.name.split('.').pop();
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from('product-images')
        .upload(path, file, { upsert: false });
      if (upErr) { setError(`Upload failed: ${upErr.message}`); break; }
      const { data } = supabase.storage.from('product-images').getPublicUrl(path);
      uploaded.push(data.publicUrl);
    }
    setImages(prev => [...prev, ...uploaded]);
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeImage = (idx: number) =>
    setImages(prev => prev.filter((_, i) => i !== idx));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const payload = {
      name: form.name,
      description: form.description,
      price: parseFloat(form.price),
      original_price: form.original_price ? parseFloat(form.original_price) : null,
      images,
      category: form.category,
      subcategory: form.subcategory || null,
      brand: form.brand,
      stock: parseInt(form.stock),
      featured: form.featured,
      tags: form.tags.split(',').map(s => s.trim()).filter(Boolean),
      specifications: (product?.specifications ?? {}) as Record<string, string>,
    };

    const { error: err } = isEdit
      ? await supabase.from('products').update(payload as any).eq('id', product!.id!)
      : await supabase.from('products').insert(payload as any);

    if (err) {
      setError(err.message);
      setSaving(false);
    } else {
      onSaved();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">{isEdit ? 'Edit Product' : 'Add Product'}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl leading-none">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">

          {/* ── Image upload ── */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Product Images</label>
            {/* Previews */}
            {images.length > 0 && (
              <div className="flex flex-wrap gap-3 mb-3">
                {images.map((url, idx) => (
                  <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200 group">
                    <img src={url} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                    >
                      <X className="w-5 h-5 text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            {/* Upload button */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleImageUpload}
            />
            <button
              type="button"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 border-2 border-dashed border-gray-300 hover:border-blue-400 text-gray-500 hover:text-blue-600 rounded-lg px-4 py-3 w-full justify-center transition-colors disabled:opacity-50"
            >
              {uploading ? (
                <><div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" /> Uploading...</>
              ) : (
                <><Upload className="w-4 h-4" /> Click to upload images (JPG, PNG, WebP)</>
              )}
            </button>
            {images.length === 0 && (
              <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                <Image className="w-3 h-3" /> No images yet — upload at least one
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Brand *</label>
              <input required value={form.brand} onChange={e => setForm(p => ({ ...p, brand: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
            <textarea required rows={3} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price ($) *</label>
              <input required type="number" step="0.01" min="0" value={form.price}
                onChange={e => setForm(p => ({ ...p, price: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Original Price ($)</label>
              <input type="number" step="0.01" min="0" value={form.original_price}
                onChange={e => setForm(p => ({ ...p, original_price: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select required value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500">
                <option value="">Select category</option>
                {['Electronics','Fashion','Home & Garden','Sports & Outdoors','Books','Beauty','Toys','Health'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subcategory</label>
              <input value={form.subcategory} onChange={e => setForm(p => ({ ...p, subcategory: e.target.value }))}
                placeholder="e.g. Laptops, Jackets..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock *</label>
              <input required type="number" min="0" value={form.stock}
                onChange={e => setForm(p => ({ ...p, stock: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.featured}
                  onChange={e => setForm(p => ({ ...p, featured: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 rounded" />
                <span className="text-sm font-medium text-gray-700">Featured product</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
            <input value={form.tags} onChange={e => setForm(p => ({ ...p, tags: e.target.value }))}
              placeholder="laptop, apple, portable"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500" />
          </div>

          {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={saving || uploading}
              className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors">
              {saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const STATUS_COLORS: Record<Order['status'], string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

// ─── Main dashboard ───────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const { products, loading: productsLoading, error: productsError } = useProducts();
  const { orders, loading: ordersLoading, refetch: refetchOrders } = useAllOrders();
  const [modalProduct, setModalProduct] = useState<Partial<Product> | null | undefined>(undefined);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const totalRevenue = orders
    .filter(o => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  const stats = [
    { name: 'Total Revenue', value: `$${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, icon: DollarSign, change: '' },
    { name: 'Total Orders', value: orders.length.toString(), icon: Package, change: '' },
    { name: 'Total Products', value: products.length.toString(), icon: BarChart3, change: '' },
    { name: 'Conversion', value: '3.2%', icon: TrendingUp, change: '' },
  ];

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Delete this product? This cannot be undone.')) return;
    setDeletingId(id);
    await supabase.from('products').delete().eq('id', id);
    setDeletingId(null);
    window.location.reload();
  };

  const handleOrderStatusChange = async (orderId: string, status: Order['status']) => {
    await updateOrderStatus(orderId, status);
    refetchOrders();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {modalProduct !== undefined && (
        <ProductModal
          product={modalProduct}
          onClose={() => setModalProduct(undefined)}
          onSaved={() => { setModalProduct(undefined); window.location.reload(); }}
        />
      )}

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage your e-commerce platform</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map(stat => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Icon className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {['overview', 'products', 'orders'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 text-sm font-medium border-b-2 capitalize transition-colors ${
                  activeTab === tab ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* ── Overview ── */}
          {activeTab === 'overview' && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Orders</h3>
              {ordersLoading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />)}
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.slice(0, 5).map(order => (
                    <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">Order #{order.id.slice(0, 8)}</p>
                        <p className="text-sm text-gray-600">
                          {order.customerName ?? 'Guest'} · ${order.total.toFixed(2)} · {order.items.length} item(s)
                        </p>
                      </div>
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${STATUS_COLORS[order.status]}`}>
                        {order.status}
                      </span>
                    </div>
                  ))}
                  {orders.length === 0 && <p className="text-center text-gray-500 py-8">No orders yet.</p>}
                </div>
              )}
            </div>
          )}

          {/* ── Products ── */}
          {activeTab === 'products' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-gray-900">Products ({products.length})</h3>
                <button
                  onClick={() => setModalProduct({})}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Product
                </button>
              </div>

              {productsLoading ? (
                <div className="space-y-3">
                  {[...Array(4)].map((_, i) => <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />)}
                </div>
              ) : productsError ? (
                <p className="text-red-600">{productsError}</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Product</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Category</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-600">Price</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-600">Stock</th>
                        <th className="text-center py-3 px-4 font-medium text-gray-600">Featured</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map(product => (
                        <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              {product.images[0] && (
                                <img src={product.images[0]} alt={product.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                              )}
                              <div>
                                <p className="font-medium text-gray-900">{product.name}</p>
                                <p className="text-xs text-gray-500">{product.brand}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-gray-600">{product.category}</td>
                          <td className="py-3 px-4 text-right font-medium">${product.price}</td>
                          <td className="py-3 px-4 text-right">
                            <span className={`${product.stock < 10 ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
                              {product.stock}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            {product.featured ? (
                              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">Yes</span>
                            ) : (
                              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">No</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => setModalProduct(product)}
                                className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(product.id)}
                                disabled={deletingId === product.id}
                                className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {products.length === 0 && <p className="text-center text-gray-500 py-8">No products yet. Add your first product!</p>}
                </div>
              )}
            </div>
          )}

          {/* ── Orders ── */}
          {activeTab === 'orders' && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-6">All Orders ({orders.length})</h3>
              {ordersLoading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => <div key={i} className="h-20 bg-gray-100 rounded-lg animate-pulse" />)}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Order</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Customer</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Date</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-600">Total</th>
                        <th className="text-center py-3 px-4 font-medium text-gray-600">Status</th>
                        <th className="text-center py-3 px-4 font-medium text-gray-600">Update</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map(order => (
                        <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <p className="font-mono text-xs text-gray-700">#{order.id.slice(0, 8)}</p>
                            <p className="text-xs text-gray-500">{order.items.length} item(s)</p>
                          </td>
                          <td className="py-3 px-4">
                            <p className="font-medium text-gray-900">{order.customerName ?? 'Guest'}</p>
                            <p className="text-xs text-gray-500">{order.customerEmail}</p>
                          </td>
                          <td className="py-3 px-4 text-gray-600">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4 text-right font-medium">${order.total.toFixed(2)}</td>
                          <td className="py-3 px-4 text-center">
                            <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${STATUS_COLORS[order.status]}`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <div className="relative inline-block">
                              <select
                                value={order.status}
                                onChange={e => handleOrderStatusChange(order.id, e.target.value as Order['status'])}
                                className="text-xs border border-gray-300 rounded-lg px-2 py-1.5 pr-6 focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                              >
                                <option value="pending">Pending</option>
                                <option value="processing">Processing</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                              <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {orders.length === 0 && <p className="text-center text-gray-500 py-8">No orders yet.</p>}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
