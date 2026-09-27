import React, { useState, useEffect } from 'react';
import { Package, DollarSign, Layers, AlignLeft, Hash, Loader2 } from 'lucide-react';
import InputField from '../InputField/InputField';

const DEFAULT_INITIAL_VALUES = {
  name: '',
  description: '',
  price: '',
  stock: '',
  category: ''
};

const ProductForm = ({
  initialValues = DEFAULT_INITIAL_VALUES,
  onSubmit,
  isLoading = false,
  submitText = 'Save Product',
  onCancel
}) => {
  const [formData, setFormData] = useState(() => ({
    name: initialValues?.name || '',
    description: initialValues?.description || '',
    price: initialValues?.price !== undefined && initialValues?.price !== null ? initialValues.price.toString() : '',
    stock: initialValues?.stock !== undefined && initialValues?.stock !== null ? initialValues.stock.toString() : '',
    category: initialValues?.category || ''
  }));

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Sync state if initialValues change from external fetch (e.g. Edit Product)
  useEffect(() => {
    if (initialValues && initialValues._id) {
      setFormData({
        name: initialValues.name || '',
        description: initialValues.description || '',
        price: initialValues.price !== undefined && initialValues.price !== null ? initialValues.price.toString() : '',
        stock: initialValues.stock !== undefined && initialValues.stock !== null ? initialValues.stock.toString() : '',
        category: initialValues.category || ''
      });
    }
  }, [initialValues?._id]);

  const validateField = (name, value) => {
    let errorMsg = '';

    if (name === 'name') {
      const trimmed = value.trim();
      if (!trimmed) {
        errorMsg = 'Product name is required';
      } else if (trimmed.length < 2) {
        errorMsg = 'Product name must be at least 2 characters';
      }
    }

    if (name === 'description') {
      if (!value.trim()) {
        errorMsg = 'Description is required';
      }
    }

    if (name === 'price') {
      if (value === '' || value === null || value === undefined) {
        errorMsg = 'Price is required';
      } else {
        const num = Number(value);
        if (isNaN(num)) {
          errorMsg = 'Price must be a valid number';
        } else if (num < 0) {
          errorMsg = 'Price cannot be negative';
        }
      }
    }

    if (name === 'stock') {
      if (value === '' || value === null || value === undefined) {
        errorMsg = 'Stock quantity is required';
      } else {
        const num = Number(value);
        if (isNaN(num) || !Number.isInteger(num)) {
          errorMsg = 'Stock must be a valid integer';
        } else if (num < 0) {
          errorMsg = 'Stock cannot be negative';
        }
      }
    }

    if (name === 'category') {
      if (!value.trim()) {
        errorMsg = 'Category is required';
      }
    }

    return errorMsg;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setTouched({
      name: true,
      description: true,
      price: true,
      stock: true,
      category: true
    });

    const newErrors = {
      name: validateField('name', formData.name),
      description: validateField('description', formData.description),
      price: validateField('price', formData.price),
      stock: validateField('stock', formData.stock),
      category: validateField('category', formData.category)
    };

    setErrors(newErrors);

    const hasError = Object.values(newErrors).some((err) => Boolean(err));
    if (hasError) return;

    onSubmit({
      name: formData.name.trim(),
      description: formData.description.trim(),
      price: Number(formData.price),
      stock: Number(formData.stock),
      category: formData.category.trim()
    });
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5 w-full">
      {/* Product Name */}
      <InputField
        id="name"
        name="name"
        type="text"
        label="Product Name"
        placeholder="e.g. Wireless Noise-Canceling Headphones"
        value={formData.name}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.name ? errors.name : ''}
        leftIcon={Package}
        disabled={isLoading}
        required
      />

      {/* Category */}
      <InputField
        id="category"
        name="category"
        type="text"
        label="Category"
        placeholder="e.g. Electronics, Clothing, Home"
        value={formData.category}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.category ? errors.category : ''}
        leftIcon={Layers}
        disabled={isLoading}
        required
      />

      {/* Price & Stock Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField
          id="price"
          name="price"
          type="number"
          step="0.01"
          label="Price ($)"
          placeholder="0.00"
          value={formData.price}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.price ? errors.price : ''}
          leftIcon={DollarSign}
          disabled={isLoading}
          required
        />

        <InputField
          id="stock"
          name="stock"
          type="number"
          step="1"
          label="Stock Quantity"
          placeholder="0"
          value={formData.stock}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.stock ? errors.stock : ''}
          leftIcon={Hash}
          disabled={isLoading}
          required
        />
      </div>

      {/* Description */}
      <div className="flex flex-col gap-1.5 w-full">
        <label
          htmlFor="description"
          className="text-xs sm:text-sm font-semibold flex items-center justify-between"
          style={{ color: 'var(--color-text-primary)' }}
        >
          <span>Description</span>
          <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute top-3 left-3.5 pointer-events-none text-gray-400">
            <AlignLeft className="w-5 h-5" />
          </div>
          <textarea
            id="description"
            name="description"
            rows="4"
            placeholder="Detailed description of the product..."
            value={formData.description}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isLoading}
            className={`w-full pl-11 pr-4 py-2.5 text-sm rounded-xl outline-none transition-all resize-y ${
              touched.description && errors.description
                ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                : 'border-gray-200 focus:border-purple-600 focus:ring-2 focus:ring-purple-100'
            }`}
            style={{
              backgroundColor: 'var(--color-surface)',
              border: `1px solid ${
                touched.description && errors.description
                  ? 'var(--color-error)'
                  : 'var(--color-border)'
              }`
            }}
          />
        </div>
        {touched.description && errors.description && (
          <p className="text-xs text-red-500 mt-1">{errors.description}</p>
        )}
      </div>

      {/* Submit and Cancel Actions */}
      <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-5 py-2.5 text-sm font-semibold rounded-xl border transition-colors hover:bg-gray-50"
            style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-secondary)' }}
          >
            Cancel
          </button>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2.5 text-sm font-semibold text-white rounded-xl shadow-sm transition-all flex items-center gap-2 hover:opacity-95 cursor-pointer"
          style={{ backgroundColor: 'var(--color-primary)' }}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <span>{submitText}</span>
          )}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
