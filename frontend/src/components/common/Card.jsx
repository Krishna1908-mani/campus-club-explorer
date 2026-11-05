import React from 'react';

export const Card = ({
  children,
  className = '',
  hoverEffect = true,
  onClick,
  ...props
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white dark:bg-dark-card border border-gray-200/90 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden transition-all duration-300
        ${hoverEffect ? 'hover:border-brand-500/40 hover:shadow-lg dark:hover:shadow-glow-indigo/10 hover:-translate-y-0.5' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
export default Card;
