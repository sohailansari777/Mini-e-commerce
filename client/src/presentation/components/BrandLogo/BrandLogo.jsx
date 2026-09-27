import React from 'react';

const BrandLogo = ({
  variant = 'full', // 'full' | 'icon'
  theme = 'light', // 'light' | 'dark'
  size = 'md', // 'sm' | 'md' | 'lg'
  className = ''
}) => {
  // Size dimensions
  const dimensions = {
    sm: { icon: 'w-7 h-7', text: 'text-lg', gap: 'gap-2' },
    md: { icon: 'w-9 h-9', text: 'text-xl', gap: 'gap-2.5' },
    lg: { icon: 'w-12 h-12', text: 'text-2xl', gap: 'gap-3' }
  }[size] || dimensions.md;

  // Colors
  const isDarkTheme = theme === 'dark';
  const textColor = isDarkTheme ? '#FFFFFF' : 'var(--color-text-primary)';
  const bagBg = isDarkTheme ? '#FFFFFF' : 'var(--color-primary)';
  const arrowColor = isDarkTheme ? '#5B27B0' : '#FFFFFF';

  return (
    <div className={`inline-flex items-center ${dimensions.gap} ${className} select-none`}>
      {/* Shopping Bag Icon with Pick Arrow */}
      <div className={`relative flex items-center justify-center flex-shrink-0 ${dimensions.icon}`}>
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-xs"
        >
          {/* Shopping Bag Handle */}
          <path
            d="M32 38V26C32 16.0589 40.0589 8 50 8C59.9411 8 68 16.0589 68 26V38"
            stroke={bagBg}
            strokeWidth="8"
            strokeLinecap="round"
          />
          {/* Shopping Bag Body */}
          <path
            d="M16 35H84C87.3137 35 90 37.6863 90 41V84C90 89.5228 85.5228 94 80 94H20C14.4772 94 10 89.5228 10 84V41C10 37.6863 12.6863 35 16 35Z"
            fill={bagBg}
          />
          {/* Pick Arrow Inside Bag */}
          <path
            d="M50 48L64 74L50 67L36 74L50 48Z"
            fill={arrowColor}
          />
        </svg>
      </div>

      {/* Pickella Text */}
      {variant === 'full' && (
        <div className="flex items-center">
          <span
            className={`font-black tracking-tight leading-none ${dimensions.text}`}
            style={{ color: textColor, fontFamily: "'Inter', sans-serif" }}
          >
            Pickell<span className="relative inline-block text-purple-500 underline decoration-2 underline-offset-2">a</span>
          </span>
        </div>
      )}
    </div>
  );
};

export default BrandLogo;
