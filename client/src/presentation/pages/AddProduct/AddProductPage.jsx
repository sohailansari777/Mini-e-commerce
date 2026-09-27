import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import productService from '../../../services/product.service';
import ProductForm from '../../components/ProductForm/ProductForm';
import Navbar from '../../components/Navbar/Navbar';
import { ArrowLeft, PackagePlus } from 'lucide-react';

const AddProductPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (formData) => {
    setIsLoading(true);
    setError(null);
    try {
      await productService.createProduct(formData);
      navigate('/products', { state: { message: 'Product created successfully!' } });
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to create product';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--color-background)' }}>
      <Navbar />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-8">
        {/* Back Link */}
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-sm font-semibold mb-6 transition-colors hover:opacity-80"
          style={{ color: 'var(--color-primary)' }}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Products</span>
        </Link>

        {/* Card Container */}
        <div
          className="p-6 sm:p-8 rounded-[24px] shadow-lg"
          style={{
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)'
          }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 mb-6 pb-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
            <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600">
              <PackagePlus className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
                Add New Product
              </h1>
              <p className="text-xs sm:text-sm text-gray-500">
                Enter details to list a new item in the catalog
              </p>
            </div>
          </div>

          {/* Global Error Banner */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <ProductForm
            onSubmit={handleSubmit}
            isLoading={isLoading}
            submitText="Create Product"
            onCancel={() => navigate('/products')}
          />
        </div>
      </main>
    </div>
  );
};

export default AddProductPage;
