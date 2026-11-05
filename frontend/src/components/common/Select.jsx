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
          className="block text-xs font-semibold text-[#111111] dark:text-[#FAF9F7] uppercase tracking-wider mb-1.5"
        >
          {label} {required && <span className="text-[#800020] dark:text-[#D9A0AE]">*</span>}
        </label>
      )}

      <div className="relative rounded-[10px] shadow-xs">
        <select
          id={id || name}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          className={`block w-full appearance-none rounded-[10px] text-sm transition-colors duration-150 pl-3.5 pr-10 py-2.5 bg-[#FFFFFF] dark:bg-[#1C1C1C] border
            ${
              error
                ? 'border-[#B91C1C] focus:ring-[#B91C1C] text-[#B91C1C]'
                : 'border-[#E5E5E5] dark:border-[#383838] focus:ring-[#800020] focus:border-[#800020] text-[#111111] dark:text-[#FAF9F7]'
            }
            focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:bg-[#FAF9F7] dark:disabled:bg-[#292929] disabled:cursor-not-allowed cursor-pointer`}
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

