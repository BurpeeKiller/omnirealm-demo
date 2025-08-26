import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/useToast";

export function ToastContainer() {
  const { toasts, dismissToast } = useToast();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {toasts.map(toast => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 300, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
            className={`
              p-4 rounded-lg shadow-lg max-w-sm relative
              ${
                toast.variant === "destructive"
                  ? "bg-red-50 border border-red-200"
                  : "bg-green-50 border border-green-200"
              }
            `}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                {toast.variant === "destructive" ? (
                  <XCircle className="w-5 h-5 text-red-500" />
                ) : (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                )}
              </div>

              <div className="flex-1">
                <h4
                  className={`
                  font-semibold text-sm
                  ${toast.variant === "destructive" ? "text-red-800" : "text-green-800"}
                `}
                >
                  {toast.title}
                </h4>

                {toast.description && (
                  <p
                    className={`
                    text-xs mt-1
                    ${toast.variant === "destructive" ? "text-red-600" : "text-green-600"}
                  `}
                  >
                    {toast.description}
                  </p>
                )}
              </div>

              <button
                onClick={() => dismissToast(toast.id)}
                className={`
                  flex-shrink-0 p-1 rounded-full hover:opacity-70 transition-opacity
                  ${
                    toast.variant === "destructive"
                      ? "text-red-400 hover:text-red-600"
                      : "text-green-400 hover:text-green-600"
                  }
                `}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
