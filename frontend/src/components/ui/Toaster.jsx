import { useToast } from "../../context/ToastContext";
import Toast from "./Toast";

const Toaster = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="pointer-events-none fixed inset-0 z-9999">
      <div className="absolute bottom-6 right-6 flex flex-col gap-3">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast toast={toast} onClose={() => removeToast(toast.id)} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Toaster;
