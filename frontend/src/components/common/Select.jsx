import React from 'react';
import { ChevronDown } from 'lucide-react';

export const Select = ({
  label,
  error,
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
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label
          htmlFor={id || name}
          className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5"
        >
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}

      <div className="relative rounded-xl shadow-sm">
        <select
          id={id || name}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          className={`block w-full appearance-none rounded-xl text-sm transition-colors duration-150 pl-3.5 pr-10 py-2.5 bg-white dark:bg-dark-card border
            ${
              error
                ? 'border-rose-400 dark:border-rose-600 focus:ring-rose-500 text-rose-900'
                : 'border-gray-300 dark:border-gray-700 focus:ring-brand-500 text-gray-900 dark:text-gray-100'
            }
            focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed cursor-pointer`}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-gray-400">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>

      {error && <p className="mt-1.5 text-xs text-rose-500 font-medium">{error}</p>}
    </div>
  );
};
export default Select;
