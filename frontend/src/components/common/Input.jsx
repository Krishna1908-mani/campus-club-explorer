import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export const Input = ({
  label,
  error,
  helperText,
  type = 'text',
  id,
  name,
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  leftIcon = null,
  rightIcon = null,
  className = '',
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label
          htmlFor={id || name}
          className="block text-xs font-semibold text-[#111111] dark:text-[#FAF9F7] uppercase tracking-wider mb-1.5"
        >
          {label} {required && <span className="text-[#800020] dark:text-[#D9A0AE]">*</span>}
        </label>
      )}

      <div className="relative rounded-xl shadow-sm">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
            {leftIcon}
          </div>
        )}

        <input
          id={id || name}
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={`block w-full rounded-[10px] text-sm transition-colors duration-150
            ${leftIcon ? 'pl-10' : 'pl-3.5'}
            ${isPassword || rightIcon ? 'pr-10' : 'pr-3.5'}
            py-2.5 bg-[#FFFFFF] dark:bg-[#1C1C1C] border
            ${
              error
                ? 'border-[#B91C1C] focus:ring-[#B91C1C] focus:border-[#B91C1C] text-[#B91C1C] dark:text-rose-200'
                : 'border-[#E5E5E5] dark:border-[#383838] focus:ring-[#800020] focus:border-[#800020] text-[#111111] dark:text-[#FAF9F7]'
            }
            placeholder-[#737373]/60 dark:placeholder-[#A3A3A3]/60 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:bg-[#FAF9F7] dark:disabled:bg-[#292929] disabled:cursor-not-allowed`}
          {...props}
        />

        {isPassword ? (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none"
            tabIndex={-1}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        ) : rightIcon ? (
          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-gray-400">
            {rightIcon}
          </div>
        ) : null}
      </div>

      {error ? (
        <p className="mt-1.5 text-xs text-rose-500 dark:text-rose-400 font-medium">{error}</p>
      ) : helperText ? (
        <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">{helperText}</p>
      ) : null}
    </div>
  );
};
export default Input;

