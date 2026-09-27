import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, Loader2, Check, AlertCircle } from 'lucide-react'
import InputField from './InputField'
import { useAuth } from '../../../../context/AuthContext'

const LoginForm = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // Form values
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  })

  // Touched states for deferred validation display
  const [touched, setTouched] = useState({
    email: false,
    password: false
  })

  // Errors state
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState(null)

  // Password visibility state
  const [showPassword, setShowPassword] = useState(false)

  // Loading state
  const [isLoading, setIsLoading] = useState(false)

  // Validate single field or whole form
  const validateField = (name, value) => {
    let errorMsg = ''
    
    if (name === 'email') {
      const emailTrimmed = value.trim()
      if (!emailTrimmed) {
        errorMsg = 'Please enter your email address'
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(emailTrimmed)) {
          errorMsg = 'Please enter a valid email address'
        }
      }
    }

    if (name === 'password') {
      if (!value) {
        errorMsg = 'Please enter your password'
      } else if (value.length < 8) {
        errorMsg = 'Password must be at least 8 characters'
      }
    }

    return errorMsg
  }

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    const newValue = type === 'checkbox' ? checked : value

    setFormData((prev) => ({
      ...prev,
      [name]: newValue
    }))

    // Real-time error clearing/validation if touched
    if (touched[name]) {
      const fieldError = validateField(name, newValue)
      setErrors((prev) => ({
        ...prev,
        [name]: fieldError
      }))
    }
  }

  // Handle Blur
  const handleBlur = (e) => {
    const { name, value } = e.target
    setTouched((prev) => ({
      ...prev,
      [name]: true
    }))

    const fieldError = validateField(name, value)
    setErrors((prev) => ({
      ...prev,
      [name]: fieldError
    }))
  }

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault()
    setServerError(null)

    // Touch all fields on submit
    setTouched({
      email: true,
      password: true
    })

    const emailErr = validateField('email', formData.email)
    const passwordErr = validateField('password', formData.password)

    const newErrors = {
      email: emailErr,
      password: passwordErr
    }

    setErrors(newErrors)

    // Stop submit if any errors exist
    if (emailErr || passwordErr) {
      return
    }

    setIsLoading(true)

    try {
      await login({
        email: formData.email.trim(),
        password: formData.password
      })

      const destination = location.state?.from?.pathname || '/products'
      navigate(destination, { replace: true })
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Invalid email or password'
      setServerError(msg)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5 w-full">
      {/* Global Server Error Banner */}
      {serverError && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2.5 text-xs font-semibold text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

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

      {/* Password Input */}
      <InputField
        id="password"
        name="password"
        type={showPassword ? 'text' : 'password'}
        label="Password"
        placeholder="Enter your password"
        value={formData.password}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.password ? errors.password : ''}
        leftIcon={Lock}
        autoComplete="current-password"
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

      {/* Form Options Row: Remember Me & Forgot Password */}
      <div className="flex items-center justify-between text-xs sm:text-sm mt-0.5">
        {/* Remember Me Checkbox */}
        <label className="flex items-center gap-2.5 cursor-pointer select-none group">
          <div className="relative flex items-center justify-center">
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              disabled={isLoading}
              className="peer sr-only"
            />
            <div 
              className="w-4 h-4 sm:w-4.5 sm:h-4.5 rounded-md border transition-all duration-150 flex items-center justify-center peer-focus-visible:ring-2 peer-focus-visible:ring-purple-400"
              style={{
                borderColor: formData.rememberMe ? 'var(--color-primary)' : 'var(--color-border)',
                backgroundColor: formData.rememberMe ? 'var(--color-primary)' : 'var(--color-surface)'
              }}
            >
              {formData.rememberMe && (
                <Check className="w-3 h-3 text-white stroke-[3]" />
              )}
            </div>
          </div>
          <span 
            className="font-medium transition-colors group-hover:text-gray-900"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Remember me
          </span>
        </label>

        {/* Forgot Password Link */}
        <a
          href="#forgot-password"
          onClick={(e) => e.preventDefault()}
          className="font-semibold transition-opacity hover:opacity-85 focus:outline-none focus:underline"
          style={{ color: 'var(--color-primary)' }}
        >
          Forgot password?
        </a>
      </div>

      {/* Submit Button */}
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
            <span>Signing in...</span>
          </>
        ) : (
          <span>Login</span>
        )}
      </button>

      {/* Register Navigation Footer */}
      <div className="mt-4 text-center text-xs sm:text-sm">
        <span 
          className="font-normal mr-1.5"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          Don't have an account?
        </span>
        <Link
          to="/register"
          className="font-semibold hover:underline focus:outline-none focus:underline transition-opacity hover:opacity-85"
          style={{ color: 'var(--color-primary)' }}
        >
          Create an account
        </Link>
      </div>
    </form>
  )
}

export default LoginForm
