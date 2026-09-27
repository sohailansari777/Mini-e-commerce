import React from 'react'
import BrandHeader from '../components/BrandHeader'
import LoginForm from '../components/LoginForm'

const LoginPage = () => {
  return (
    <div 
      className="min-h-screen w-full flex items-center justify-center px-5 py-8 sm:py-12"
      style={{ backgroundColor: 'var(--color-background)' }}
    >
      {/* Login Card */}
      <main 
        className="w-full max-w-[420px] p-7 sm:p-9 rounded-[24px] transition-all"
        style={{
          backgroundColor: 'var(--color-surface)',
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid var(--color-border)'
        }}
      >
        {/* Brand Header */}
        <BrandHeader />

        {/* Login Form */}
        <LoginForm />
      </main>
    </div>
  )
}

export default LoginPage
