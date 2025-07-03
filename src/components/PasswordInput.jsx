import { useState } from 'react';

const PasswordInput = ({ 
  id, 
  name, 
  value, 
  onChange, 
  placeholder, 
  className, 
  error,
  showStrengthIndicator = false,
  autoComplete = "current-password"
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Password strength calculation
  const calculatePasswordStrength = (password) => {
    if (!password) return { score: 0, label: '', color: '' };

    let score = 0;
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    // Calculate score
    Object.values(checks).forEach(check => {
      if (check) score++;
    });

    // Determine strength level
    if (score === 0) return { score: 0, label: '', color: '', checks };
    if (score <= 2) return { score, label: 'Weak', color: 'text-red-600', checks };
    if (score <= 3) return { score, label: 'Fair', color: 'text-yellow-600', checks };
    if (score <= 4) return { score, label: 'Good', color: 'text-blue-600', checks };
    return { score, label: 'Strong', color: 'text-green-600', checks };
  };

  const strength = showStrengthIndicator ? calculatePasswordStrength(value) : null;

  return (
    <div>
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          placeholder={placeholder}
          className={className}
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          {showPassword ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          )}
        </button>
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}

      {showStrengthIndicator && value && (
        <div className="mt-2">
          {/* Strength bar */}
          <div className="flex space-x-1 mb-2">
            {[1, 2, 3, 4, 5].map((level) => (
              <div
                key={level}
                className={`h-1 flex-1 rounded ${
                  level <= strength.score
                    ? strength.score <= 2
                      ? 'bg-red-500'
                      : strength.score <= 3
                      ? 'bg-yellow-500'
                      : strength.score <= 4
                      ? 'bg-blue-500'
                      : 'bg-green-500'
                    : 'bg-gray-200 dark:bg-gray-700'
                }`}
              />
            ))}
          </div>

          {/* Strength label */}
          {strength.label && (
            <p className={`text-sm font-medium ${strength.color}`}>
              Password strength: {strength.label}
            </p>
          )}

          {/* Requirements checklist */}
          <div className="mt-2 space-y-1">
            <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">
              Password requirements:
            </p>
            <div className="grid grid-cols-1 gap-1 text-xs">
              <div className={`flex items-center ${strength.checks.length ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                <span className="mr-1">{strength.checks.length ? '✓' : '○'}</span>
                At least 8 characters
              </div>
              <div className={`flex items-center ${strength.checks.lowercase ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                <span className="mr-1">{strength.checks.lowercase ? '✓' : '○'}</span>
                One lowercase letter
              </div>
              <div className={`flex items-center ${strength.checks.uppercase ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                <span className="mr-1">{strength.checks.uppercase ? '✓' : '○'}</span>
                One uppercase letter
              </div>
              <div className={`flex items-center ${strength.checks.number ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                <span className="mr-1">{strength.checks.number ? '✓' : '○'}</span>
                One number
              </div>
              <div className={`flex items-center ${strength.checks.special ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                <span className="mr-1">{strength.checks.special ? '✓' : '○'}</span>
                One special character
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PasswordInput;
