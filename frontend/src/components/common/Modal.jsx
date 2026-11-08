import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'max-w-lg',
  showClose = true,
  description = null,
}) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/65 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div
        className={`relative w-full ${maxWidth} bg-white dark:bg-[#1A1A1A] border border-[#E8E3E5] dark:border-[#2E2E2E] rounded-2xl shadow-xl overflow-hidden z-10 transform transition-all duration-200 max-h-[90vh] flex flex-col`}
      >
        {/* Header */}
        {(title || showClose) && (
          <div className="px-6 py-5 border-b border-[#E8E3E5] dark:border-[#2E2E2E] flex items-start justify-between gap-4 shrink-0">
            <div>
              {title && (
                <h3 id="modal-title" className="font-serif text-lg font-bold text-[#151515] dark:text-[#FAF9F7] tracking-tight">
                  {title}
                </h3>
              )}
              {description && (
                <p className="text-xs text-[#777777] dark:text-[#A3A3A3] mt-1 leading-relaxed">
                  {description}
                </p>
              )}
            </div>
            {showClose && (
              <button
                type="button"
                onClick={onClose}
                className="p-1 rounded-lg text-[#777777] hover:text-[#800020] dark:hover:text-[#D9A0AE] hover:bg-[#F4E7EC]/40 dark:hover:bg-[#800020]/20 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#800020]"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
