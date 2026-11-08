import React from 'react';
import { Check } from 'lucide-react';

export const Checkbox = ({
  label,
  id,
  name,
  checked,
  onChange,
  disabled = false,
  className = '',
  description,
  ...props
}) => {
  const checkboxId = id || name || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <label
      htmlFor={checkboxId}
      className={`inline-flex items-start gap-2.5 cursor-pointer select-none ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      <div className="relative flex items-center justify-center shrink-0 mt-0.5">
        <input
          id={checkboxId}
          name={name}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="peer sr-only"
          {...props}
        />
        <div className="w-4 h-4 rounded border border-[#E8E3E5] dark:border-[#2E2E2E] bg-white dark:bg-[#1A1A1A] peer-checked:bg-[#800020] peer-checked:border-[#800020] peer-focus-visible:ring-2 peer-focus-visible:ring-[#800020] peer-focus-visible:ring-offset-2 transition-all flex items-center justify-center">
          <Check className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity" strokeWidth={3} />
        </div>
      </div>
      {(label || description) && (
        <div className="text-xs">
          {label && (
            <span className="font-medium text-[#151515] dark:text-[#FAF9F7] block leading-tight">
              {label}
            </span>
          )}
          {description && (
            <span className="text-[#777777] dark:text-[#A3A3A3] block mt-0.5 leading-snug">
              {description}
            </span>
          )}
        </div>
      )}
    </label>
  );
};

export default Checkbox;
