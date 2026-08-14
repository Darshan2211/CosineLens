import { RouterProvider } from "react-router";
import { router } from "./app.routes.jsx";
import { AuthContext, AuthProvider } from "./features/auth/auth.context.jsx";
import { ToastProvider } from "./context/ToastContext.jsx";
import Toaster from "./components/ui/Toaster.jsx";

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <RouterProvider router={router} />;
        <Toaster />
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
