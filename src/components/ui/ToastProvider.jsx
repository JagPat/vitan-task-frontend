import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

const ToastContext = createContext(null);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};

let nextId = 1;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const show = useCallback(({ title, description = '', type = 'info', duration = 3500 }) => {
    const id = nextId++;
    setToasts((prev) => [...prev, { id, title, description, type }]);
    if (duration > 0) {
      setTimeout(() => remove(id), duration);
    }
    return id;
  }, [remove]);

  const value = useMemo(() => ({ show, remove }), [show, remove]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* Toast list */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`w-80 rounded-md shadow-lg border px-4 py-3 bg-white ${
              t.type === 'success' ? 'border-green-200' : t.type === 'error' ? 'border-red-200' : 'border-gray-200'
            }`}
            role="status"
            aria-live="polite"
          >
            <div className="flex items-start gap-2">
              <span className={`mt-0.5 h-2 w-2 rounded-full ${
                t.type === 'success' ? 'bg-green-500' : t.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
              }`} />
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">{t.title}</div>
                {t.description ? (
                  <div className="text-xs text-gray-600 mt-0.5">{t.description}</div>
                ) : null}
              </div>
              <button
                onClick={() => remove(t.id)}
                className="text-gray-400 hover:text-gray-600"
                aria-label="Close toast"
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};




