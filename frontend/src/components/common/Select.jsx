import React from 'react';
import { ChevronDown } from 'lucide-react';

export const Select = ({
  label,
  error,
  helperText,
  id,
  name,
  value,
  onChange,
  options = [],
  required = false,
  className = '',
  disabled = false,
  placeholder = 'Select an option',
  ...props
}) => {
  const selectId = id || name || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label
          htmlFor={selectId}
          className="block text-xs font-semibold text-[#151515] dark:text-[#FAF9F7] uppercase tracking-wider mb-1.5"
        >
          {label} {required && <span className="text-[#800020] dark:text-[#D9A0AE]">*</span>}
        </label>
      )}

      <div className="relative rounded-[10px] shadow-2xs">
        <select
          id={selectId}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${selectId}-error` : helperText ? `${selectId}-helper` : undefined}
          className={`block w-full h-11 appearance-none rounded-[10px] text-sm transition-colors duration-150 pl-3.5 pr-10 py-2.5 bg-white dark:bg-[#1A1A1A] border
            ${
              error
                ? 'border-[#B91C1C] focus:ring-2 focus:ring-[#B91C1C] text-[#B91C1C]'
                : 'border-[#E8E3E5] dark:border-[#2E2E2E] focus:ring-2 focus:ring-[#800020] focus:border-[#800020] text-[#151515] dark:text-[#FAF9F7]'
            }
            focus:outline-none disabled:bg-[#F8F7F8] dark:disabled:bg-[#242424] disabled:cursor-not-allowed cursor-pointer`}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-[#777777] dark:text-[#A3A3A3]" aria-hidden="true">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>

      {error ? (
        <p id={`${selectId}-error`} role="alert" className="mt-1.5 text-xs text-[#B91C1C] dark:text-rose-400 font-medium">
          {error}
        </p>
      ) : helperText ? (
        <p id={`${selectId}-helper`} className="mt-1.5 text-xs text-[#777777] dark:text-[#A3A3A3]">
          {helperText}
        </p>
      ) : null}
    </div>
  );
};

export default Select;
