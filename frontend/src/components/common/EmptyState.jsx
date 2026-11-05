import React from 'react';
import Button from './Button.jsx';
import { Compass } from 'lucide-react';

export const EmptyState = ({
  icon = <Compass className="w-12 h-12 text-brand-500/80" />,
  title = 'No records found',
  description = 'Try adjusting your search criteria or filters to explore other campus clubs.',
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-12 bg-white dark:bg-dark-card border border-gray-200/80 dark:border-gray-800 rounded-3xl ${className}`}
    >
      <div className="w-20 h-20 rounded-2xl bg-brand-50 dark:bg-brand-950/50 flex items-center justify-center mb-4 text-brand-600 dark:text-brand-400">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md leading-relaxed mb-6">
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
