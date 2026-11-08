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
  const inputId = id || name || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-semibold text-[#151515] dark:text-[#FAF9F7] uppercase tracking-wider mb-1.5"
        >
          {label} {required && <span className="text-[#800020] dark:text-[#D9A0AE]">*</span>}
        </label>
      )}

      <div className="relative rounded-[10px] shadow-2xs">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#777777] dark:text-[#A3A3A3]" aria-hidden="true">
            {leftIcon}
          </div>
        )}

        <input
          id={inputId}
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          className={`block w-full h-11 rounded-[10px] text-sm transition-colors duration-150
            ${leftIcon ? 'pl-10' : 'pl-3.5'}
            ${isPassword || rightIcon ? 'pr-10' : 'pr-3.5'}
            py-2.5 bg-white dark:bg-[#1A1A1A] border
            ${
              error
                ? 'border-[#B91C1C] focus:ring-2 focus:ring-[#B91C1C] focus:border-[#B91C1C] text-[#B91C1C] dark:text-rose-200'
                : 'border-[#E8E3E5] dark:border-[#2E2E2E] focus:ring-2 focus:ring-[#800020] focus:border-[#800020] text-[#151515] dark:text-[#FAF9F7]'
            }
            placeholder-[#777777]/60 dark:placeholder-[#A3A3A3]/60 focus:outline-none disabled:bg-[#F8F7F8] dark:disabled:bg-[#242424] disabled:cursor-not-allowed`}
          {...props}
        />

        {isPassword ? (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#777777] hover:text-[#151515] dark:hover:text-[#FAF9F7] focus:outline-none focus-visible:ring-1 focus-visible:ring-[#800020]"
            tabIndex={-1}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        ) : rightIcon ? (
          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-[#777777] dark:text-[#A3A3A3]" aria-hidden="true">
            {rightIcon}
          </div>
        ) : null}
      </div>

      {error ? (
        <p id={`${inputId}-error`} role="alert" className="mt-1.5 text-xs text-[#B91C1C] dark:text-rose-400 font-medium">
          {error}
        </p>
      ) : helperText ? (
        <p id={`${inputId}-helper`} className="mt-1.5 text-xs text-[#777777] dark:text-[#A3A3A3]">
          {helperText}
        </p>
      ) : null}
    </div>
  );
};

export default Input;
