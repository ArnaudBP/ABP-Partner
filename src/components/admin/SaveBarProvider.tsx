"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { CheckCircle, XCircle, ExternalLink, X } from "lucide-react";

interface Toast {
  id: number;
  type: "success" | "error";
  message: string;
  linkUrl?: string;
  linkLabel?: string;
}

interface SaveBarContextType {
  showSaving: () => void;
  showSaved: (message?: string, link?: { url: string; label: string }) => void;
  showError: (message?: string) => void;
}

const SaveBarContext = createContext<SaveBarContextType | null>(null);

export function useSaveBar() {
  const ctx = useContext(SaveBarContext);
  if (!ctx) throw new Error("useSaveBar must be used within SaveBarProvider");
  return ctx;
}

export function SaveBarProvider({ children }: { children: React.ReactNode }) {
  const [saving, setSaving] = useState(false);
  const [progress, setProgress] = useState(0);
  const [toasts, setToasts] = useState<Toast[]>([]);
  let toastId = 0;

  // Animate progress bar
  useEffect(() => {
    if (!saving) {
      if (progress > 0) {
        setProgress(100);
        const t = setTimeout(() => setProgress(0), 400);
        return () => clearTimeout(t);
      }
      return;
    }

    setProgress(10);
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 90) return 90;
        return p + Math.random() * 15;
      });
    }, 300);
    return () => clearInterval(interval);
  }, [saving]);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (toast: Omit<Toast, "id">) => {
      const id = ++toastId;
      setToasts((prev) => [...prev, { ...toast, id }]);
      // Auto-dismiss après 6s
      setTimeout(() => removeToast(id), 6000);
    },
    [removeToast]
  );

  const showSaving = useCallback(() => {
    setSaving(true);
  }, []);

  const showSaved = useCallback(
    (message?: string, link?: { url: string; label: string }) => {
      setSaving(false);
      addToast({
        type: "success",
        message: message || "Modifications enregistrées !",
        linkUrl: link?.url,
        linkLabel: link?.label,
      });
    },
    [addToast]
  );

  const showError = useCallback(
    (message?: string) => {
      setSaving(false);
      addToast({
        type: "error",
        message: message || "Erreur lors de la sauvegarde",
      });
    },
    [addToast]
  );

  return (
    <SaveBarContext.Provider value={{ showSaving, showSaved, showError }}>
      {/* Progress bar fixe en haut */}
      {(saving || progress > 0) && (
        <div className="fixed top-0 left-0 right-0 z-[9999] h-1 bg-gray-200/50">
          <div
            className="h-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
          {saving && (
            <div className="absolute top-1 right-4 bg-black/80 text-white text-xs px-3 py-1 rounded-full flex items-center gap-2 shadow-lg">
              <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
              Sauvegarde en cours...
            </div>
          )}
        </div>
      )}

      {children}

      {/* Toasts */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 max-w-sm">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-start gap-3 p-4 rounded-xl shadow-2xl border backdrop-blur-sm animate-slide-up ${
              toast.type === "success"
                ? "bg-white/95 border-green-200 text-gray-800"
                : "bg-white/95 border-red-200 text-gray-800"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle className="text-green-500 flex-shrink-0 mt-0.5" size={20} />
            ) : (
              <XCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{toast.message}</p>
              {toast.linkUrl && (
                <a
                  href={toast.linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 mt-2 text-xs font-medium text-amber-700 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <ExternalLink size={12} />
                  {toast.linkLabel || "Voir les changements"}
                </a>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-gray-400 hover:text-gray-600 flex-shrink-0"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </SaveBarContext.Provider>
  );
}
