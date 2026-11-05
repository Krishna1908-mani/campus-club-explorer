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
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-[10px] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed select-none tracking-tight';

  const sizeClasses = {
    sm: 'text-xs px-3.5 py-1.5 gap-1.5',
    md: 'text-sm px-4.5 py-2.5 gap-2',
    lg: 'text-base px-6 py-3.5 gap-2.5',
  };

  const variantClasses = {
    primary:
      'bg-[#800020] hover:bg-[#5C001A] text-white shadow-sm hover:shadow-glow-burgundy focus:ring-[#800020] active:scale-[0.98]',
    secondary:
      'bg-white dark:bg-[#1C1C1C] border border-[#800020] dark:border-[#C2185B] text-[#800020] dark:text-[#FCE7EF] hover:bg-[#FCE7EF]/40 dark:hover:bg-[#800020]/20 focus:ring-[#800020] active:scale-[0.98]',
    outline:
      'border border-[#E5E5E5] dark:border-[#383838] bg-white dark:bg-[#1C1C1C] hover:bg-[#FAF9F7] dark:hover:bg-[#292929] hover:border-[#800020]/40 text-[#111111] dark:text-[#FAF9F7] focus:ring-[#800020] active:scale-[0.98]',
    ghost:
      'bg-transparent hover:bg-[#FCE7EF]/30 dark:hover:bg-[#800020]/20 text-[#800020] dark:text-[#D9A0AE] hover:text-[#5C001A] dark:hover:text-white focus:ring-[#800020]',
    danger:
      'bg-[#B91C1C] hover:bg-[#991B1B] text-white shadow-sm focus:ring-[#B91C1C] active:scale-[0.98]',
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : (
        leftIcon && <span className="shrink-0">{leftIcon}</span>
      )}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
};
export default Button;

