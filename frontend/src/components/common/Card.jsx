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
      className={`bg-[#FFFFFF] dark:bg-[#1C1C1C] border border-[#E5E5E5] dark:border-[#383838] rounded-2xl shadow-sm overflow-hidden transition-all duration-300
        ${hoverEffect ? 'hover:border-[#800020]/35 dark:hover:border-[#C2185B]/40 hover:shadow-[0_12px_32px_rgba(17,17,17,0.06)] dark:hover:shadow-[0_12px_32px_rgba(0,0,0,0.5)] hover:-translate-y-1' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
export default Card;

