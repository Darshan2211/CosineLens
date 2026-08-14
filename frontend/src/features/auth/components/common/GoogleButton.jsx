import { FcGoogle } from "react-icons/fc";

const GoogleButton = ({ disabled = false }) => {
  const handleGoogleLogin = () => {
    const apiUrl = `${import.meta.env.VITE_API_URL}/api/auth/google`;
    window.location.href = `${apiUrl}`;
  };

  return (
    <button
      type="button"
      onClick={handleGoogleLogin}
      disabled={disabled}
      className="flex h-12 w-full items-center justify-center gap-5 rounded-xl border border-border bg-background px-4 text-sm font-medium text-foreground transition-all duration-200 hover:bg-muted/20 hover:border-primary/30 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
    >
      <FcGoogle size={22} />
      <span className="tracking-widest">Continue with Google</span>
    </button>
  );
};

export default GoogleButton;
