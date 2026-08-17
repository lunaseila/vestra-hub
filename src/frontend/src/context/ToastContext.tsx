import { X } from "lucide-react";
import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";

type ToastType = "success" | "error" | "info";

interface ToastMessage {
  id: number;
  message: string;
  type: ToastType;
  exiting: boolean;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const counterRef = useRef(0);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, exiting: true } : t)),
    );
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 400);
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType = "info") => {
      const id = ++counterRef.current;
      setToasts((prev) => [...prev, { id, message, type, exiting: false }]);
      setTimeout(() => dismiss(id), 3000);
    },
    [dismiss],
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        style={{
          position: "fixed",
          top: "5rem",
          right: "1.5rem",
          zIndex: 200,
          display: "flex",
          flexDirection: "column",
          gap: "0.625rem",
          pointerEvents: "none",
        }}
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            data-ocid="toast"
            style={{
              pointerEvents: "auto",
              minWidth: "280px",
              maxWidth: "360px",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              padding: "0.875rem 1rem",
              borderRadius: "8px",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              background: "rgba(26,26,31,0.95)",
              borderLeft: `3px solid ${
                t.type === "success"
                  ? "var(--vestra-gold)"
                  : t.type === "error"
                    ? "#E05555"
                    : "var(--vestra-grey)"
              }`,
              border: "1px solid var(--vestra-border)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
              animation: t.exiting
                ? "toast-fade-out 400ms ease forwards"
                : "toast-slide-in 350ms var(--ease-reveal) both",
            }}
          >
            <p
              style={{
                flex: 1,
                fontFamily: "DM Sans",
                fontSize: "0.875rem",
                color: "var(--vestra-white)",
                lineHeight: 1.5,
              }}
            >
              {t.message}
            </p>
            <button
              type="button"
              aria-label="Dismiss"
              data-ocid="toast.close_button"
              onClick={() => dismiss(t.id)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--vestra-grey)",
                display: "flex",
                alignItems: "center",
                padding: "2px",
              }}
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
