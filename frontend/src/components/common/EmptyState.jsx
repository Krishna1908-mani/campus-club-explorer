import React from 'react';
import Button from './Button.jsx';
import { Compass } from 'lucide-react';

export const EmptyState = ({
  icon = <Compass className="w-12 h-12 text-[#800020] dark:text-[#D9A0AE]" />,
  title = 'No records found',
  description = 'Try adjusting your search criteria or filters to explore other campus clubs.',
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-12 bg-[#FFFFFF] dark:bg-[#1C1C1C] border border-[#E5E5E5] dark:border-[#383838] rounded-2xl ${className}`}
    >
      <div className="w-20 h-20 rounded-2xl bg-[#FCE7EF] dark:bg-[#800020]/30 flex items-center justify-center mb-4 text-[#800020] dark:text-[#D9A0AE]">
        {icon}
      </div>
      <h3 className="font-serif text-xl font-bold text-[#111111] dark:text-[#FAF9F7] mb-2">{title}</h3>
      <p className="text-sm text-[#737373] dark:text-[#A3A3A3] max-w-md leading-relaxed mb-6">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button variant="primary" size="md" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
export default EmptyState;

