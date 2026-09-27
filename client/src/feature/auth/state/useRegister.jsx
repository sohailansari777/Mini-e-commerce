import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'

export const useRegister = () => {
  const { register } = useAuth()
  const navigate = useNavigate()

  // Form fields state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  // Touched states for blur validation
  const [touched, setTouched] = useState({
    fullName: false,
    email: false,
    password: false,
    confirmPassword: false
  })

  // Errors state
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  // Visibility states
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Submission loading state
  const [isLoading, setIsLoading] = useState(false)

  // Single field validation helper
  const validateField = (name, value, currentFormData = formData) => {
    let errorMsg = ''

    if (name === 'fullName' || name === 'name') {
      const trimmed = value.trim()
      if (!trimmed) {
        errorMsg = 'Please enter your name'
      } else if (trimmed.length < 2) {
        errorMsg = 'Name must be at least 2 characters'
      }
    }

    if (name === 'email') {
      const trimmed = value.trim()
      if (!trimmed) {
        errorMsg = 'Please enter your email address'
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(trimmed)) {
          errorMsg = 'Please enter a valid email address'
        }
      }
    }

    if (name === 'password') {
      if (!value) {
        errorMsg = 'Please enter a password'
      } else if (value.length < 8) {
        errorMsg = 'Password must be at least 8 characters'
      }
    }

    if (name === 'confirmPassword') {
      if (!value) {
        errorMsg = 'Please confirm your password'
      } else if (value !== currentFormData.password) {
        errorMsg = 'Passwords do not match'
      }
    }

    return errorMsg
  }

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target
    const updatedForm = { ...formData, [name]: value }
    setFormData(updatedForm)

    // Re-validate field if already touched
    if (touched[name]) {
      const fieldError = validateField(name, value, updatedForm)
      setErrors((prev) => ({
        ...prev,
        [name]: fieldError
      }))
    }

    // Special case: if changing password, re-check confirmPassword if touched
    if (name === 'password' && touched.confirmPassword) {
      const confirmError = validateField('confirmPassword', formData.confirmPassword, updatedForm)
      setErrors((prev) => ({
        ...prev,
        confirmPassword: confirmError
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

    const fieldError = validateField(name, value, formData)
    setErrors((prev) => ({
      ...prev,
      [name]: fieldError
    }))
  }

  // Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault()
    setServerError(null)

    // Touch all fields
    setTouched({
      fullName: true,
      email: true,
      password: true,
      confirmPassword: true
    })

    const nameErr = validateField('fullName', formData.fullName, formData)
    const emailErr = validateField('email', formData.email, formData)
    const passwordErr = validateField('password', formData.password, formData)
    const confirmErr = validateField('confirmPassword', formData.confirmPassword, formData)

    const newErrors = {
      fullName: nameErr,
      email: emailErr,
      password: passwordErr,
      confirmPassword: confirmErr
    }

    setErrors(newErrors)

    if (nameErr || emailErr || passwordErr || confirmErr) {
      return
    }

    setIsLoading(true)

    try {
      await register({
        name: formData.fullName.trim(),
        email: formData.email.trim(),
        password: formData.password,
        confirmPassword: formData.confirmPassword
      })

      setSuccessMessage('Registration successful! Redirecting to login...')
      setTimeout(() => {
        navigate('/login', { state: { registeredEmail: formData.email } })
      }, 1500)
    } catch (err) {
      const fieldErrs = err.response?.data?.errors
      if (fieldErrs && Array.isArray(fieldErrs)) {
        const mappedErrors = {}
        fieldErrs.forEach((item) => {
          if (item.field === 'email' || item.path === 'email') {
            mappedErrors.email = item.message || item.msg
          }
        })
        if (Object.keys(mappedErrors).length > 0) {
          setErrors((prev) => ({ ...prev, ...mappedErrors }))
        }
      }
      const msg = err.response?.data?.message || err.message || 'Registration failed'
      setServerError(msg)
    } finally {
      setIsLoading(false)
    }
  }

  return {
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
  }
}

export default useRegister
