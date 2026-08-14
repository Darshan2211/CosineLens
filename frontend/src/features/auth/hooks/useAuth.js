import { useContext } from "react";
import { AuthContext } from "../auth.context";
import { register, login } from "../services/auth.api";
import { useNavigate } from "react-router";
import { useToast } from "../../../context/ToastContext";

export const useAuth = () => {
  const navigate = useNavigate();
  const context = useContext(AuthContext);
  const { user, setUser, loading, setLoading } = context;
  const { showToast } = useToast();

  const handleRegister = async ({ username, email, password }) => {
    try {
      const data = await register({ username, email, password });
      showToast({
        type: "SUCCESS",
        title: "Workspace created",
        message: "Semantic search is now live for your catalog...",
      });

      setUser(data.user);
      navigate("/login");
    } catch (error) {
      showToast({
        type: "Error",
        title: "Workspace creation failed",
        message:
          error.response?.data?.message ||
          "Unable to create workspace. Please try again.",
      });
      console.error(error);
    }
  };

  const handleLogin = async ({ email, password }) => {
    try {
      const data = await login({ email, password });

      showToast({
        type: "success",
        title: "Welcome back",
        message: "Your search pipeline is running.",
      });

      setUser(data.user);
      navigate("/");
    } catch (error) {
      showToast({
        type: "error",
        title: "Sign in failed",
        message:
          error.response?.data?.message ||
          "Unable to sign in. Please try again.",
      });
      console.error(error);
    }
  };

  return { user, handleRegister, handleLogin };
};
