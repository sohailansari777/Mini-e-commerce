import React from 'react'

const InputField = ({
  id,
  name,
  type = 'text',
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  leftIcon: LeftIcon,
  rightElement,
  autoComplete,
  disabled = false,
  required = false
}) => {
  const isInvalid = Boolean(error);
  const errorId = `${id}-error`;

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {/* Input Label */}
      <label
        htmlFor={id}
        className="text-sm font-semibold tracking-tight"
        style={{ color: 'var(--color-text-primary)' }}
      >
        {label}
      </label>

      {/* Input Container */}
      <div className="relative flex items-center w-full">
        {/* Left Icon */}
        {LeftIcon && (
          <div 
            className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center text-gray-400"
            style={{ color: isInvalid ? 'var(--color-error)' : 'var(--color-text-muted)' }}
          >
            <LeftIcon className="w-5 h-5 stroke-[1.8]" aria-hidden="true" />
          </div>
        )}

        {/* Form Input */}
        <input
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          required={required}
          autoComplete={autoComplete}
          aria-invalid={isInvalid}
          aria-describedby={isInvalid ? errorId : undefined}
          className={`w-full h-[52px] text-sm rounded-xl transition-all duration-150 outline-none
            ${LeftIcon ? 'pl-11' : 'pl-4'}
            ${rightElement ? 'pr-11' : 'pr-4'}
            disabled:opacity-60 disabled:cursor-not-allowed`}
          style={{
            backgroundColor: 'var(--color-surface-soft)',
            color: 'var(--color-text-primary)',
            border: `1.5px solid ${isInvalid ? 'var(--color-error)' : 'var(--color-border)'}`,
          }}
          onFocus={(e) => {
            if (!isInvalid) {
              e.currentTarget.style.borderColor = 'var(--color-primary)';
              e.currentTarget.style.boxShadow = '0 0 0 3.5px rgba(111, 53, 201, 0.12)';
            } else {
              e.currentTarget.style.boxShadow = '0 0 0 3.5px rgba(214, 69, 69, 0.12)';
            }
          }}
          onBlurCapture={(e) => {
            e.currentTarget.style.boxShadow = 'none';
            if (!isInvalid) {
              e.currentTarget.style.borderColor = 'var(--color-border)';
            }
          }}
        />

        {/* Right Element (e.g. Password Toggle Button) */}
        {rightElement && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center">
            {rightElement}
          </div>
        )}
      </div>

      {/* Field Level Error Message */}
      {isInvalid && (
        <p
          id={errorId}
          role="alert"
          aria-live="polite"
          className="text-xs font-medium mt-0.5 flex items-center gap-1"
          style={{ color: 'var(--color-error)' }}
        >
          {error}
        </p>
      )}
    </div>
  )
}

export default InputField
