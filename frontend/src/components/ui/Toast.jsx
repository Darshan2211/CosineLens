import { CheckCircle2, CircleAlert, Info, LoaderCircle, X } from "lucide-react";
import { useEffect, useState } from "react";
import "../../styles/global.css"

const Toast = ({ toast, onClose }) => {
  const [isExisting, setIsExisting] = useState(false);

  const handleClose = () => {
    if (isExisting) return;

    setIsExisting(true);

    setTimeout(() => {
      onClose();
    }, 250);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, toast.duration);
    return () => {
      clearTimeout(timer);
    };
  }, [toast.duration]);

  const getIcon = () => {
    switch (toast.type) {
      case "success":
        return <CheckCircle2 size={18} className="text-success" />;
      case "error":
        return <CircleAlert size={18} className="text-error" />;
      case "info":
        return <Info size={18} className="text-primary" />;
      default:
        return null;
    }
  };

  const getAccentColor = () => {
    switch (toast.type) {
      case "error":
        return "bg-error";
      case "success":
        return "bg-success";
      case "info":
      default:
        return "bg-primary";
    }
  };

  return (
    <div
      className={`flex w-95 overflow-hidden rounded-2xl border border-border bg-card shadow-lg ${isExisting ? "animate-toast-out" : "animate-toast-in"}`}
    >
      <div className={`w-0.75 shrink-0 ${getAccentColor()}`} />
      <div className="flex flex-1 items-start gap-3 p-4">
        <div className="mt-0.5 shrink-0">{getIcon()}</div>

        <div className="min-w-0 flex-1">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
            {toast.type}
          </p>
          <p className="mt-1 text-sm font-semibold text-foreground">
            {toast.title}
          </p>
          <p className="mt-1 text-xs leading-5 text-muted">{toast.message}</p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="shrink-0 text-muted transition-colors hover:text-foreground"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default Toast;
