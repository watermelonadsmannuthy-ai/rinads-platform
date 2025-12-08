"use client";

import { useEffect } from "react";
import { Check, X, AlertCircle } from "lucide-react";

interface ToastProps {
  message: string;
  type: "success" | "error" | "info";
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export default function Toast({
  message,
  type,
  isVisible,
  onClose,
  duration = 5000,
}: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const icons = {
    success: <Check size={20} className="text-green-500" />,
    error: <X size={20} className="text-red-500" />,
    info: <AlertCircle size={20} className="text-blue-500" />,
  };

  const bgColors = {
    success: "bg-green-500/10 border-green-500/30",
    error: "bg-red-500/10 border-red-500/30",
    info: "bg-blue-500/10 border-blue-500/30",
  };

  return (
    <div className="fixed top-20 right-4 z-50 animate-slide-in">
      <div
        className={`flex items-center gap-3 px-6 py-4 rounded-lg border backdrop-blur-md ${bgColors[type]} shadow-lg min-w-[300px] max-w-md`}
      >
        {icons[type]}
        <p className="text-white font-medium flex-1">{message}</p>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}





