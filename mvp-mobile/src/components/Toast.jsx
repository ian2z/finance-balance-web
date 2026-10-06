import { useEffect } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export default function Toast({ message, type = "success", onClose, duration = 3000 }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  const icon =
    type === "error" ? (
      <AlertCircle className="w-4 h-4 text-[#ef4444]" />
    ) : type === "info" ? (
      <Info className="w-4 h-4 text-[#38bdf8]" />
    ) : (
      <CheckCircle2 className="w-4 h-4 text-[#22c55e]" />
    );

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-[90%] w-[360px] animate-in fade-in slide-in-from-top-3 duration-200">
      <div className="flex items-center justify-between gap-3 px-4 py-3 bg-[#18181b] border border-[#3f3f46] rounded-xl shadow-2xl text-xs text-[#fafafa]">
        <div className="flex items-center gap-2.5">
          {icon}
          <span className="font-medium">{message}</span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-[#a1a1aa] hover:text-[#fafafa] p-1"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
