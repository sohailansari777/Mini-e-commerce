import React from 'react'

const getPasswordStrength = (password) => {
  if (!password) return { score: 0, label: '', color: 'transparent' }

  let score = 0
  if (password.length >= 8) score += 1
  if (/[0-9]/.test(password)) score += 1
  if (/[A-Z]/.test(password) && /[^A-Za-z0-9]/.test(password)) score += 1

  if (password.length < 8) {
    return { score: 1, label: 'Weak', color: 'var(--color-error)' }
  }

  if (score === 1) {
    return { score: 1, label: 'Weak', color: 'var(--color-error)' }
  } else if (score === 2) {
    return { score: 2, label: 'Medium', color: 'var(--color-warning)' }
  } else {
    return { score: 3, label: 'Strong', color: 'var(--color-success)' }
  }
}

const PasswordStrengthMeter = ({ password }) => {
  if (!password) return null

  const { score, label, color } = getPasswordStrength(password)

  return (
    <div className="flex flex-col gap-1.5 mt-1 select-none">
      <div className="flex items-center justify-between text-xs">
        <span 
          className="font-medium text-[11px]"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          Password strength:
        </span>
        <span 
          className="font-semibold text-[11px] tracking-wide"
          style={{ color }}
        >
          {label}
        </span>
      </div>

      {/* 3 Progress Bars */}
      <div className="flex items-center gap-1.5 w-full">
        {[1, 2, 3].map((step) => {
          const isActive = step <= score
          return (
            <div
              key={step}
              className="h-1 flex-1 rounded-full transition-all duration-300"
              style={{
                backgroundColor: isActive ? color : 'var(--color-border)'
              }}
            />
          )
        })}
      </div>
    </div>
  )
}

export default PasswordStrengthMeter
