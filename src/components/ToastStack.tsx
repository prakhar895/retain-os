import React from 'react';
import { ToastMessage } from '../types';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

interface ToastStackProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastStack: React.FC<ToastStackProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm pointer-events-none select-none">
      {toasts.map((toast) => {
        return (
          <div
            key={toast.id}
            className="pointer-events-auto bg-[#141A24] border border-[#2DD4BF]/40 text-[#d4e4fa] p-3 rounded-xl shadow-2xl flex items-start gap-3 animate-in slide-in-from-bottom-5 duration-300 backdrop-blur-md"
          >
            <div className="mt-0.5 shrink-0">
              {toast.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-[#34D399]" />
              ) : toast.type === 'warning' ? (
                <AlertCircle className="w-4 h-4 text-[#FBBF24]" />
              ) : (
                <Info className="w-4 h-4 text-[#2DD4BF]" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-[#d4e4fa]">
                {toast.title}
              </div>
              {toast.description && (
                <div className="text-[11px] text-[#bacac5] mt-0.5 leading-snug">
                  {toast.description}
                </div>
              )}
            </div>

            <button
              onClick={() => onDismiss(toast.id)}
              className="text-[#859490] hover:text-[#d4e4fa] p-0.5 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
