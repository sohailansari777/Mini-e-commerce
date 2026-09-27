import React from 'react'
import { Link } from 'react-router-dom'
import { User, Mail, Lock, Eye, EyeOff, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react'
import InputField from './InputField'
import PasswordStrengthMeter from './PasswordStrengthMeter'
import { useRegister } from '../../state/useRegister'

const RegisterForm = () => {
  const {
    formData,
    handleChange,
    handleBlur,
    handleSubmit,
    errors,
    serverError,
    successMessage,
    touched,
    isLoading,
    showPassword,
    showConfirmPassword,
    setShowPassword,
    setShowConfirmPassword
  } = useRegister()

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4.5 w-full">
      {/* Global Server Error Banner */}
      {serverError && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2.5 text-xs font-semibold text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      {/* Global Success Banner */}
      {successMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2.5 text-xs font-semibold text-emerald-700">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Full Name Input */}
      <InputField
        id="fullName"
        name="fullName"
        type="text"
        label="Full Name"
        placeholder="Enter your full name"
        value={formData.fullName}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.fullName ? errors.fullName : ''}
        leftIcon={User}
        autoComplete="name"
        disabled={isLoading}
        required
      />

      {/* Email Input */}
      <InputField
        id="email"
        name="email"
        type="email"
        label="Email"
        placeholder="Enter your email"
        value={formData.email}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.email ? errors.email : ''}
        leftIcon={Mail}
        autoComplete="email"
        disabled={isLoading}
        required
      />

      {/* Password Input + Strength Meter */}
      <div className="flex flex-col gap-1 w-full">
        <InputField
          id="password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          label="Password"
          placeholder="Create a password"
          value={formData.password}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.password ? errors.password : ''}
          leftIcon={Lock}
          autoComplete="new-password"
          disabled={isLoading}
          required
          rightElement={
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              disabled={isLoading}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="p-1 rounded-lg transition-colors hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-400"
              style={{ color: 'var(--color-text-muted)' }}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5 stroke-[1.8]" />
              ) : (
                <Eye className="w-5 h-5 stroke-[1.8]" />
              )}
            </button>
          }
        />
        {/* Password Strength Indicator */}
        <PasswordStrengthMeter password={formData.password} />
      </div>

      {/* Confirm Password Input */}
      <InputField
        id="confirmPassword"
        name="confirmPassword"
        type={showConfirmPassword ? 'text' : 'password'}
        label="Confirm Password"
        placeholder="Confirm your password"
        value={formData.confirmPassword}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.confirmPassword ? errors.confirmPassword : ''}
        leftIcon={Lock}
        autoComplete="new-password"
        disabled={isLoading}
        required
        rightElement={
          <button
            type="button"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            disabled={isLoading}
            aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
            className="p-1 rounded-lg transition-colors hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-400"
            style={{ color: 'var(--color-text-muted)' }}
          >
            {showConfirmPassword ? (
              <EyeOff className="w-5 h-5 stroke-[1.8]" />
            ) : (
              <Eye className="w-5 h-5 stroke-[1.8]" />
            )}
          </button>
        }
      />

      {/* Create Account Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full h-[52px] mt-2 text-base font-semibold text-white rounded-xl transition-all duration-200 flex items-center justify-center gap-2 select-none outline-none focus-visible:ring-4 focus-visible:ring-purple-300 disabled:opacity-75 disabled:cursor-not-allowed shadow-sm hover:shadow-md active:scale-[0.99]"
        style={{
          backgroundColor: isLoading ? 'var(--color-primary-hover)' : 'var(--color-primary)',
          borderRadius: 'var(--radius-md)'
        }}
        onMouseEnter={(e) => {
          if (!isLoading) {
            e.currentTarget.style.backgroundColor = 'var(--color-primary-hover)'
          }
        }}
        onMouseLeave={(e) => {
          if (!isLoading) {
            e.currentTarget.style.backgroundColor = 'var(--color-primary)'
          }
        }}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Creating account...</span>
          </>
        ) : (
          <span>Create Account</span>
        )}
      </button>

      {/* Terms & Privacy Statement */}
      <p
        className="text-[11px] sm:text-xs text-center leading-relaxed px-2"
        style={{ color: 'var(--color-text-muted)' }}
      >
        By creating an account, you agree to our{' '}
        <span className="underline cursor-pointer hover:text-gray-700">Terms</span> &{' '}
        <span className="underline cursor-pointer hover:text-gray-700">Privacy Policy</span>.
      </p>

      {/* Login Navigation Footer */}
      <div className="mt-2 text-center text-xs sm:text-sm border-t pt-4" style={{ borderColor: 'var(--color-border)' }}>
        <span
          className="font-normal mr-1.5"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          Already have an account?
        </span>
        <Link
          to="/login"
          className="font-semibold hover:underline focus:outline-none focus:underline transition-opacity hover:opacity-85"
          style={{ color: 'var(--color-primary)' }}
        >
          Login
        </Link>
      </div>
    </form>
  )
}

export default RegisterForm
