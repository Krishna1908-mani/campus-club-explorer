import React from 'react';
import Button from './Button.jsx';
import { Compass } from 'lucide-react';

export const EmptyState = ({
  icon = <Compass className="w-10 h-10 text-[#800020] dark:text-[#D9A0AE]" />,
  title = 'No records found',
  description = 'Try adjusting your search criteria or filters to explore other campus clubs.',
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-10 sm:p-14 bg-white dark:bg-[#1A1A1A] border border-[#E8E3E5] dark:border-[#2E2E2E] rounded-2xl shadow-2xs ${className}`}
    >
      <div className="w-18 h-18 rounded-2xl bg-[#F4E7EC] dark:bg-[#800020]/25 border border-[#E8E3E5] dark:border-[#800020]/40 flex items-center justify-center mb-4 text-[#800020] dark:text-[#D9A0AE] shadow-2xs">
        {icon}
      </div>
      <h3 className="font-serif text-lg sm:text-xl font-bold text-[#151515] dark:text-[#FAF9F7] mb-1.5">
        {title}
      </h3>
      <p className="text-xs sm:text-sm text-[#777777] dark:text-[#A3A3A3] max-w-md leading-relaxed mb-6 font-sans">
        {description}
      </p>
      {(actionLabel || secondaryActionLabel) && (
        <div className="flex items-center gap-3 flex-wrap justify-center">
          {actionLabel && onAction && (
            <Button variant="primary" size="sm" onClick={onAction}>
              {actionLabel}
            </Button>
          )}
          {secondaryActionLabel && onSecondaryAction && (
            <Button variant="outline" size="sm" onClick={onSecondaryAction}>
              {secondaryActionLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default EmptyState;
