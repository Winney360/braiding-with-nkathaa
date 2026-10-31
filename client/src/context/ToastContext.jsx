import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const success = (msg) => addToast(msg, 'success');
  const error = (msg) => addToast(msg, 'error');
  const info = (msg) => addToast(msg, 'info');

  return (
    <ToastContext.Provider value={{ addToast, removeToast, success, error, info }}>
      {children}
      {/* Toast Notification Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl shadow-xl transition-all duration-300 transform translate-y-0 text-sm font-medium border ${
              toast.type === 'success'
                ? 'bg-white text-dark-text border-chartreuse shadow-glow-chartreuse'
                : toast.type === 'error'
                ? 'bg-white text-dark-text border-tomato shadow-glow-tomato'
                : 'bg-white text-dark-text border-lavender shadow-soft'
            }`}
          >
            {toast.type === 'success' && (
              <span className="p-1 rounded-full bg-chartreuse text-dark-text">
                <CheckCircle2 className="w-5 h-5" />
              </span>
            )}
            {toast.type === 'error' && (
              <span className="p-1 rounded-full bg-tomato text-white">
                <AlertCircle className="w-5 h-5" />
              </span>
            )}
            {toast.type === 'info' && (
              <span className="p-1 rounded-full bg-lavender text-dark-text">
                <Info className="w-5 h-5" />
              </span>
            )}
            <div className="flex-1 pt-0.5">{toast.message}</div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-gray-400 hover:text-dark-text transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
