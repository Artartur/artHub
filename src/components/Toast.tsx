import { useEffect } from "react";
import type { ToastProps } from "../interfaces/ToastProps";

export default function Toast({
  message,
  show,
  onClose,
  duration = 4000,
}: ToastProps) {
  useEffect(() => {
    if (!show) return;

    const timer = setTimeout(onClose, duration);

    return () => clearTimeout(timer);
  }, [show, duration, onClose]);

  return (
    <div className="toast-container position-fixed bottom-0 end-0 p-3">
      <div
        className={`toast align-items-center text-bg-danger border-0 ${show ? "show" : ""}`}
        role="alert"
        aria-live="assertive"
      >
        <div className="d-flex">
          <div className="toast-body">{message}</div>
          <button
            type="button"
            className="btn-close btn-close-white me-2 m-auto"
            onClick={onClose}
            aria-label="Fechar"
          />
        </div>
      </div>
    </div>
  );
}
