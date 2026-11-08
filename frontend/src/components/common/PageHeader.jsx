import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const PageHeader = ({
  badge = null,
  badgeIcon = null,
  title,
  description,
  actions = null,
  backTo = null,
  backLabel = 'Back',
  className = '',
}) => {
  return (
    <div className={`space-y-3 ${className}`}>
      {backTo && (
        <div>
          <Link
            to={backTo}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#777777] hover:text-[#800020] dark:text-[#A3A3A3] dark:hover:text-[#D9A0AE] transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[#800020]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{backLabel}</span>
          </Link>
        </div>
      )}

      {badge && (
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#800020] dark:text-[#D9A0AE]">
          {badgeIcon && <span className="w-4 h-4 shrink-0">{badgeIcon}</span>}
          <span>{badge}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-3xl">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#151515] dark:text-[#FAF9F7] tracking-tight">
            {title}
          </h1>
          {description && (
            <p className="text-sm text-[#777777] dark:text-[#A3A3A3] leading-relaxed font-sans">
              {description}
            </p>
          )}
        </div>

        {actions && (
          <div className="shrink-0 flex items-center gap-2.5 flex-wrap">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
