import React from 'react';

export const Card = ({
  children,
  variant = 'default',
  hover = false,
  className = '',
  onClick,
  ...props
}) => {
  const variantClasses = {
    default:
      'bg-white dark:bg-[#1A1A1A] border border-[#E8E3E5] dark:border-[#2E2E2E] shadow-xs',
    elevated:
      'bg-white dark:bg-[#1A1A1A] border border-[#E8E3E5] dark:border-[#2E2E2E] shadow-sm',
    flat:
      'bg-[#F8F7F8] dark:bg-[#202020] border border-transparent',
    burgundy:
      'bg-gradient-to-br from-[#800020] to-[#5C001A] text-white border border-[#5C001A] shadow-md',
  };

  const hoverClass = hover
    ? 'transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-[#800020]/40 dark:hover:border-[#C2185B]/40 cursor-pointer'
    : '';

  return (
    <div
      onClick={onClick}
      className={`rounded-2xl overflow-hidden transition-colors ${variantClasses[variant] || variantClasses.default} ${hoverClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '', ...props }) => (
  <div className={`p-6 pb-3 space-y-1 ${className}`} {...props}>
    {children}
  </div>
);

export const CardTitle = ({ children, className = '', as: Component = 'h3', ...props }) => (
  <Component
    className={`font-serif text-lg font-bold text-[#151515] dark:text-[#FAF9F7] tracking-tight ${className}`}
    {...props}
  >
    {children}
  </Component>
);

export const CardDescription = ({ children, className = '', ...props }) => (
  <p className={`text-xs text-[#777777] dark:text-[#A3A3A3] leading-relaxed ${className}`} {...props}>
    {children}
  </p>
);

export const CardContent = ({ children, className = '', ...props }) => (
  <div className={`p-6 pt-0 ${className}`} {...props}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = '', ...props }) => (
  <div
    className={`p-6 pt-3 border-t border-[#E8E3E5] dark:border-[#2E2E2E] flex items-center justify-between ${className}`}
    {...props}
  >
    {children}
  </div>
);

Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Description = CardDescription;
Card.Content = CardContent;
Card.Footer = CardFooter;

export default Card;
