import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import productService from '../../../services/product.service';
import ProductCard from '../../components/ProductCard/ProductCard';
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog';
import Navbar from '../../components/Navbar/Navbar';
import { Plus, Search, Filter, Loader2, PackageOpen, AlertCircle, RefreshCw } from 'lucide-react';

const ProductsPage = () => {
  const { isAuthenticated } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [toastMessage, setToastMessage] = useState(null);

  // Modal delete state
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const showToast = (msg, type = 'success') => {
    setToastMessage({ msg, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await productService.getProducts();
      if (data && data.products) {
        setProducts(data.products);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleDeleteConfirm = async () => {
    if (!deletingProduct) return;
    setIsDeleting(true);
    try {
      await productService.deleteProduct(deletingProduct._id);
      setProducts((prev) => prev.filter((p) => p._id !== deletingProduct._id));
      showToast('Product deleted successfully', 'success');
      setDeletingProduct(null);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete product', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  // Derive unique categories
  const categories = ['All', ...new Set(products.map((p) => p.category).filter(Boolean))];

  // Filter products by search & category
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--color-background)' }}>
      <Navbar />

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div
          className={`fixed bottom-5 right-5 z-50 px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-sm font-semibold text-white animate-in slide-in-from-bottom duration-200 ${
            toastMessage.type === 'error' ? 'bg-red-600' : 'bg-emerald-600'
          }`}
        >
          <span>{toastMessage.msg}</span>
        </div>
      )}

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1
              className="text-2xl sm:text-3xl font-extrabold tracking-tight"
              style={{ color: 'var(--color-text-primary)' }}
            >
              Explore Products
            </h1>
            <p className="mt-1 text-sm sm:text-base" style={{ color: 'var(--color-text-secondary)' }}>
              Browse our catalog of premium products and offerings
            </p>
          </div>

          {isAuthenticated && (
            <Link
              to="/products/add"
              className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-white rounded-xl shadow-md transition-all hover:shadow-lg active:scale-98 self-start md:self-auto"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              <Plus className="w-5 h-5 stroke-[2.5]" />
              <span>Add New Product</span>
            </Link>
          )}
        </div>

        {/* Controls: Search Bar & Category Filter */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
          {/* Search Input */}
          <div className="relative w-full sm:flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products by title or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl outline-none transition-all"
              style={{
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text-primary)'
              }}
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            <Filter className="w-4 h-4 text-gray-400 hidden sm:block" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'text-white shadow-xs'
                    : 'hover:bg-purple-50'
                }`}
                style={{
                  backgroundColor:
                    selectedCategory === cat
                      ? 'var(--color-primary)'
                      : 'var(--color-surface)',
                  color:
                    selectedCategory === cat
                      ? '#FFFFFF'
                      : 'var(--color-text-secondary)',
                  border:
                    selectedCategory === cat
                      ? 'none'
                      : '1px solid var(--color-border)'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Content States */}
        {loading ? (
          <div className="min-h-[300px] flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--color-primary)' }} />
            <p className="text-sm font-semibold" style={{ color: 'var(--color-text-secondary)' }}>
              Loading products...
            </p>
          </div>
        ) : error ? (
          <div
            className="p-8 rounded-2xl text-center flex flex-col items-center justify-center gap-3 border"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)'
            }}
          >
            <AlertCircle className="w-10 h-10 text-red-500" />
            <h3 className="text-lg font-bold text-gray-900">Something went wrong</h3>
            <p className="text-sm text-gray-600 max-w-md">{error}</p>
            <button
              onClick={fetchProducts}
              className="mt-2 inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-purple-700 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Please try again</span>
            </button>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div
            className="p-12 rounded-2xl text-center flex flex-col items-center justify-center gap-3 border"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)'
            }}
          >
            <div className="w-16 h-16 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
              <PackageOpen className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">No products available</h3>
            <p className="text-sm text-gray-500 max-w-sm">
              {searchQuery || selectedCategory !== 'All'
                ? 'No products match your search or filter criteria.'
                : 'There are currently no products in the inventory.'}
            </p>

            {isAuthenticated && (
              <Link
                to="/products/add"
                className="mt-3 inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white rounded-xl shadow-xs"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                <Plus className="w-4 h-4" />
                <span>Add First Product</span>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                isAuthenticated={isAuthenticated}
                onDelete={(prod) => setDeletingProduct(prod)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Delete Product Confirmation Modal */}
      <ConfirmDialog
        isOpen={Boolean(deletingProduct)}
        title="Delete Product"
        message={`Are you sure you want to delete "${deletingProduct?.name}"? This action cannot be undone.`}
        confirmText="Delete Product"
        isDanger={true}
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingProduct(null)}
      />
    </div>
  );
};

export default ProductsPage;
