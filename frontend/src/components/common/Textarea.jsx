import React from 'react';

export const Textarea = ({
  label,
  error,
  helperText,
  id,
  name,
  value,
  onChange,
  rows = 3,
  placeholder,
  required = false,
  disabled = false,
  className = '',
  maxLength,
  ...props
}) => {
  const textareaId = id || name || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between mb-1.5">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-xs font-semibold text-[#151515] dark:text-[#FAF9F7] uppercase tracking-wider"
          >
            {label} {required && <span className="text-[#800020] dark:text-[#D9A0AE]">*</span>}
          </label>
        )}
        {maxLength && (
          <span className="text-[11px] text-[#777777] dark:text-[#A3A3A3]">
            {value?.length || 0} / {maxLength}
          </span>
        )}
      </div>

      <textarea
        id={textareaId}
        name={name}
        rows={rows}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        maxLength={maxLength}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${textareaId}-error` : helperText ? `${textareaId}-helper` : undefined}
        className={`block w-full rounded-[10px] text-sm transition-colors duration-150 p-3 bg-white dark:bg-[#1A1A1A] border
          ${
            error
              ? 'border-[#B91C1C] focus:ring-2 focus:ring-[#B91C1C] focus:border-[#B91C1C] text-[#B91C1C] dark:text-rose-200'
              : 'border-[#E8E3E5] dark:border-[#2E2E2E] focus:ring-2 focus:ring-[#800020] focus:border-[#800020] text-[#151515] dark:text-[#FAF9F7]'
          }
          placeholder-[#777777]/60 dark:placeholder-[#A3A3A3]/60 focus:outline-none disabled:bg-[#F8F7F8] dark:disabled:bg-[#242424] disabled:cursor-not-allowed`}
        {...props}
      />

      {error ? (
        <p id={`${textareaId}-error`} role="alert" className="mt-1.5 text-xs text-[#B91C1C] dark:text-rose-400 font-medium">
          {error}
        </p>
      ) : helperText ? (
        <p id={`${textareaId}-helper`} className="mt-1.5 text-xs text-[#777777] dark:text-[#A3A3A3]">
          {helperText}
        </p>
      ) : null}
    </div>
  );
};

export default Textarea;
