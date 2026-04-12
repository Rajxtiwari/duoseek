"use client";

import { AnimatePresence, motion } from "framer-motion";

export type ToastItem = {
  id: string;
  title: string;
  description?: string;
  variant?: "success" | "error" | "info";
};

type ToastHubProps = {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
};

export default function ToastHub({ toasts, onDismiss }: ToastHubProps) {
  return (
    <div className="fixed top-20 right-4 z-[110] w-[92vw] max-w-sm space-y-3 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 30, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className={`pointer-events-auto rounded-xl border p-4 shadow-xl backdrop-blur-md ${
              toast.variant === "success"
                ? "border-emerald-400/40 bg-emerald-900/25"
                : toast.variant === "error"
                ? "border-rose-400/45 bg-rose-900/25"
                : "border-cyan-400/40 bg-cyan-900/25"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-white">{toast.title}</p>
                {toast.description && <p className="text-xs text-zinc-200 mt-1">{toast.description}</p>}
              </div>
              <button
                type="button"
                onClick={() => onDismiss(toast.id)}
                className="text-xs text-zinc-300 hover:text-white"
              >
                Close
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
