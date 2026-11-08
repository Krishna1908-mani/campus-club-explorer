import React from 'react';
import { Loader2 } from 'lucide-react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className = '',
  leftIcon = null,
  rightIcon = null,
  type = 'button',
  onClick,
  'aria-label': ariaLabel,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-medium transition-all duration-150 select-none tracking-tight rounded-[10px] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#800020] dark:focus-visible:ring-offset-[#111111] disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none active:scale-[0.98]';

  const sizeClasses = {
    sm: 'text-xs px-3 py-1.5 gap-1.5 font-semibold',
    md: 'text-sm px-4 py-2.5 gap-2',
    lg: 'text-base px-6 py-3 gap-2.5 font-semibold',
    icon: 'p-2.5 shrink-0 aspect-square',
    'icon-sm': 'p-1.5 shrink-0 aspect-square',
    'icon-lg': 'p-3.5 shrink-0 aspect-square',
  };

  const variantClasses = {
    primary:
      'bg-[#800020] hover:bg-[#5C001A] active:bg-[#3B0010] text-white shadow-xs hover:shadow-md focus-visible:ring-[#800020]',
    secondary:
      'bg-[#F4E7EC] hover:bg-[#ecd8e0] active:bg-[#dfc4cf] text-[#800020] dark:bg-[#800020]/25 dark:text-[#F4E7EC] dark:hover:bg-[#800020]/40 border border-transparent focus-visible:ring-[#800020]',
    outline:
      'border border-[#E8E3E5] dark:border-[#2E2E2E] bg-white dark:bg-[#1A1A1A] hover:bg-[#F8F7F8] dark:hover:bg-[#242424] hover:border-[#800020]/40 text-[#151515] dark:text-[#FAF9F7] shadow-2xs focus-visible:ring-[#800020]',
    ghost:
      'bg-transparent hover:bg-[#F4E7EC]/60 dark:hover:bg-[#800020]/25 text-[#800020] dark:text-[#D9A0AE] hover:text-[#5C001A] dark:hover:text-white border border-transparent focus-visible:ring-[#800020]',
    danger:
      'bg-[#B91C1C] hover:bg-[#991B1B] active:bg-[#7F1D1D] text-white shadow-xs focus-visible:ring-[#B91C1C]',
    subtle:
      'bg-[#F8F7F8] dark:bg-[#242424] text-[#151515] dark:text-[#FAF9F7] hover:bg-[#E8E3E5] dark:hover:bg-[#2E2E2E] border border-[#E8E3E5] dark:border-[#2E2E2E] focus-visible:ring-[#800020]',
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      aria-busy={isLoading ? 'true' : undefined}
      aria-disabled={disabled || isLoading ? 'true' : undefined}
      aria-label={ariaLabel}
      className={`${baseClasses} ${sizeClasses[size] || sizeClasses.md} ${variantClasses[variant] || variantClasses.primary} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current shrink-0" aria-hidden="true" />
      ) : (
        leftIcon && <span className="shrink-0" aria-hidden="true">{leftIcon}</span>
      )}
      {children && <span>{children}</span>}
      {!isLoading && rightIcon && <span className="shrink-0" aria-hidden="true">{rightIcon}</span>}
    </button>
  );
};

export default Button;
