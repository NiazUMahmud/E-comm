import React, { createContext, useContext, useState } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface ToasterContextType {
  addToast: (toast: Omit<Toast, 'id'>) => void;
}

const ToasterContext = createContext<ToasterContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToasterContext);
  if (!context) {
    throw new Error('useToast must be used within a ToasterProvider');
  }
  return context;
}

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = Date.now().toString();
    const newToast = { ...toast, id };
    setToasts(prev => [...prev, newToast]);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <ToasterContext.Provider value={{ addToast }}>
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`
              flex items-center space-x-3 p-4 rounded-lg shadow-lg border max-w-sm
              ${toast.type === 'success' ? 'bg-green-50 border-green-200' : ''}
              ${toast.type === 'error' ? 'bg-red-50 border-red-200' : ''}
              ${toast.type === 'info' ? 'bg-blue-50 border-blue-200' : ''}
            `}
          >
            {toast.type === 'success' && <CheckCircle className="w-5 h-5 text-green-600" />}
            {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-red-600" />}
            {toast.type === 'info' && <AlertCircle className="w-5 h-5 text-blue-600" />}
            
            <span className={`
              text-sm flex-1
              ${toast.type === 'success' ? 'text-green-800' : ''}
              ${toast.type === 'error' ? 'text-red-800' : ''}
              ${toast.type === 'info' ? 'text-blue-800' : ''}
            `}>
              {toast.message}
            </span>
            
            <button
              onClick={() => removeToast(toast.id)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToasterContext.Provider>
  );
}