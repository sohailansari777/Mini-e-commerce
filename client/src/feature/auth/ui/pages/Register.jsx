import React from 'react'
import BrandHeader from '../components/BrandHeader'
import RegisterForm from '../components/RegisterForm'

const Register = () => {
  return (
    <div 
      className="min-h-screen w-full flex items-center justify-center px-5 py-8 sm:py-12"
      style={{ backgroundColor: 'var(--color-background)' }}
    >
      {/* Registration Card */}
      <main 
        className="w-full max-w-[460px] p-7 sm:p-9 rounded-[24px]"
        style={{
          backgroundColor: 'var(--color-surface)',
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid var(--color-border)',
          contain: 'layout style'
        }}
      >
        {/* Brand Header */}
        <BrandHeader 
          title="Create Account" 
          subtitle="Join us and start shopping" 
        />

        {/* Register Form */}
        <RegisterForm />
      </main>
    </div>
  )
}

export default Register
