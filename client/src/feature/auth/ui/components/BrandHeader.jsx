import React from 'react';
import BrandLogo from '../../../../presentation/components/BrandLogo/BrandLogo';

const BrandHeader = ({
  title = 'Welcome Back 👋',
  subtitle = 'Sign in to continue shopping'
}) => {
  return (
    <div className="flex flex-col items-center text-center mb-8">
      {/* Pickella Brand Logo */}
      <div className="mb-6">
        <BrandLogo variant="full" theme="light" size="lg" />
      </div>

      {/* Headings */}
      <h1
        className="text-2xl sm:text-[28px] font-bold tracking-tight mb-2"
        style={{ color: 'var(--color-text-primary)' }}
      >
        {title}
      </h1>
      <p
        className="text-sm font-normal"
        style={{ color: 'var(--color-text-secondary)' }}
      >
        {subtitle}
      </p>
    </div>
  );
};

export default BrandHeader;
