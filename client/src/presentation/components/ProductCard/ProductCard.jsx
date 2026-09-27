import React from 'react';
import { Link } from 'react-router-dom';
import { Edit2, Trash2, Tag, Box, DollarSign } from 'lucide-react';

const ProductCard = ({ product, isAuthenticated, onDelete }) => {
  const { _id, name, description, price, stock, category } = product;

  return (
    <div
      className="group relative flex flex-col justify-between p-5 rounded-[20px] transition-all duration-300 hover:-translate-y-1"
      style={{
        backgroundColor: 'var(--color-surface)',
        boxShadow: 'var(--shadow-md)',
        border: '1px solid var(--color-border)'
      }}
    >
      <div>
        {/* Top Header Badge */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase"
            style={{
              backgroundColor: 'var(--color-primary-light)',
              color: 'var(--color-primary-dark)'
            }}
          >
            <Tag className="w-3 h-3" />
            {category || 'General'}
          </span>

          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
              stock > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
            }`}
          >
            <Box className="w-3 h-3" />
            {stock > 0 ? `${stock} in stock` : 'Out of stock'}
          </span>
        </div>

        {/* Product Title */}
        <h3
          className="text-lg font-bold line-clamp-1 group-hover:text-purple-600 transition-colors"
          style={{ color: 'var(--color-text-primary)' }}
        >
          {name}
        </h3>

        {/* Product Description */}
        <p
          className="mt-2 text-sm line-clamp-2 leading-relaxed"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          {description}
        </p>
      </div>

      {/* Bottom Footer Price & Actions */}
      <div
        className="mt-5 pt-4 flex items-center justify-between border-t"
        style={{ borderColor: 'var(--color-border)' }}
      >
        <div>
          <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">
            Price
          </span>
          <span className="text-xl font-black text-purple-700">
            ${Number(price).toFixed(2)}
          </span>
        </div>

        {isAuthenticated && (
          <div className="flex items-center gap-1.5">
            <Link
              to={`/products/edit/${_id}`}
              className="p-2 rounded-xl text-gray-500 hover:text-purple-600 hover:bg-purple-50 transition-colors"
              title="Edit Product"
            >
              <Edit2 className="w-4.5 h-4.5" />
            </Link>

            <button
              onClick={() => onDelete(product)}
              className="p-2 rounded-xl text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
              title="Delete Product"
            >
              <Trash2 className="w-4.5 h-4.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
