import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 7);
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
    return id;
  }, [removeToast]);

  const success = useCallback((msg, dur) => addToast(msg, 'success', dur), [addToast]);
  const error = useCallback((msg, dur) => addToast(msg, 'error', dur), [addToast]);
  const info = useCallback((msg, dur) => addToast(msg, 'info', dur), [addToast]);
  const warning = useCallback((msg, dur) => addToast(msg, 'warning', dur), [addToast]);

  return (
    <ToastContext.Provider value={{ addToast, removeToast, success, error, info, warning }}>
      {children}
      {/* Toast Notification Container */}
      <div
        className="fixed bottom-5 right-5 z-50 flex flex-col space-y-2.5 max-w-sm w-full pointer-events-none"
        aria-live="polite"
        aria-atomic="true"
      >
        {toasts.map((toast) => {
          let borderAccent = 'border-l-4 border-l-[#800020]';
          let icon = <Info className="w-4 h-4 text-[#800020] dark:text-[#D9A0AE] shrink-0 mt-0.5" />;

          if (toast.type === 'success') {
            borderAccent = 'border-l-4 border-l-emerald-600 dark:border-l-emerald-400';
            icon = <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />;
          } else if (toast.type === 'error') {
            borderAccent = 'border-l-4 border-l-rose-600 dark:border-l-rose-400';
            icon = <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />;
          } else if (toast.type === 'warning') {
            borderAccent = 'border-l-4 border-l-amber-600 dark:border-l-amber-400';
            icon = <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />;
          }

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl bg-white/95 dark:bg-[#1A1A1A]/95 backdrop-blur-md border border-[#E8E3E5] dark:border-[#2E2E2E] shadow-lg transition-all duration-200 transform translate-y-0 ${borderAccent}`}
              role={toast.type === 'error' ? 'alert' : 'status'}
            >
              {icon}
              <div className="flex-1 text-xs font-medium leading-relaxed text-[#151515] dark:text-[#FAF9F7]">
                {toast.message}
              </div>
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="text-[#777777] hover:text-[#151515] dark:text-[#A3A3A3] dark:hover:text-[#FAF9F7] transition-colors p-0.5 rounded-md focus:outline-none focus-visible:ring-1 focus-visible:ring-[#800020]"
                aria-label="Close notification"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
