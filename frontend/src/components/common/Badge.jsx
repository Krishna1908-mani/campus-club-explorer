import React from 'react';

export const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  icon = null,
}) => {
  const variantClasses = {
    default:
      'bg-[#F8F7F8] dark:bg-[#242424] text-[#777777] dark:text-[#E5E5E5] border border-[#E8E3E5] dark:border-[#2E2E2E]',
    primary:
      'bg-[#F4E7EC] dark:bg-[#800020]/40 text-[#800020] dark:text-[#F4E7EC] border border-[#D9A0AE]/50 dark:border-[#800020]',
    burgundy:
      'bg-[#800020] text-white border border-[#5C001A] shadow-2xs',
    rose:
      'bg-[#F4E7EC] text-[#800020] border border-[#E8E3E5] dark:bg-[#800020]/25 dark:text-[#F4E7EC] dark:border-[#800020]/50',
    success:
      'bg-emerald-50 dark:bg-emerald-950/60 text-[#15803D] dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/80',
    warning:
      'bg-amber-50 dark:bg-amber-950/60 text-[#D97706] dark:text-amber-300 border border-amber-200 dark:border-amber-800/80',
    danger:
      'bg-rose-50 dark:bg-rose-950/60 text-[#B91C1C] dark:text-rose-300 border border-rose-200 dark:border-rose-800/80',
    featured:
      'bg-[#FAF5EC] dark:bg-[#C5A46D]/20 text-[#8F6B2A] dark:text-[#E6D3B1] border border-[#C5A46D]/50 shadow-2xs',
    outline:
      'bg-transparent border border-[#E8E3E5] dark:border-[#2E2E2E] text-[#151515] dark:text-[#FAF9F7]',
  };

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 gap-1 font-medium tracking-tight',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium tracking-tight',
    lg: 'text-sm px-3 py-1.5 gap-1.5 font-semibold tracking-tight',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full leading-none shrink-0 ${sizeClasses[size] || sizeClasses.md} ${variantClasses[variant] || variantClasses.default} ${className}`}
    >
      {icon && <span className="shrink-0" aria-hidden="true">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};

export default Badge;
