import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import productService from '../../../services/product.service';
import ProductForm from '../../components/ProductForm/ProductForm';
import Navbar from '../../components/Navbar/Navbar';
import { ArrowLeft, Edit3, Loader2, AlertCircle } from 'lucide-react';

const EditProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setFetchError(null);
      try {
        const data = await productService.getProductById(id);
        if (data && data.product) {
          setProduct(data.product);
        } else {
          setFetchError('Product not found');
        }
      } catch (err) {
        setFetchError(err.response?.data?.message || err.message || 'Failed to fetch product details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await productService.updateProduct(id, formData);
      navigate('/products', { state: { message: 'Product updated successfully!' } });
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to update product';
      setError(msg);
    } finally {
      setIsSubmitting(false);
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

        {loading ? (
          <div className="min-h-[300px] flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--color-primary)' }} />
            <p className="text-sm font-semibold text-gray-600">Loading product details...</p>
          </div>
        ) : fetchError ? (
          <div
            className="p-8 rounded-[24px] text-center flex flex-col items-center justify-center gap-3 border shadow-md"
            style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
          >
            <AlertCircle className="w-10 h-10 text-red-500" />
            <h2 className="text-xl font-bold text-gray-900">Product Not Found</h2>
            <p className="text-sm text-gray-500 max-w-sm">{fetchError}</p>
            <Link
              to="/products"
              className="mt-2 px-5 py-2.5 text-sm font-semibold text-white rounded-xl shadow-xs"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              Return to Products List
            </Link>
          </div>
        ) : (
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
                <Edit3 className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
                  Edit Product
                </h1>
                <p className="text-xs sm:text-sm text-gray-500">
                  Update details for "{product?.name}"
                </p>
              </div>
            </div>

            {/* Global Error Banner */}
            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* Product Form */}
            <ProductForm
              initialValues={product}
              onSubmit={handleSubmit}
              isLoading={isSubmitting}
              submitText="Update Product"
              onCancel={() => navigate('/products')}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default EditProductPage;
