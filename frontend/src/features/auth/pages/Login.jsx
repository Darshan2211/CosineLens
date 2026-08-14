import { Link } from "react-router";
import AuthShell from "../components/AuthShell.jsx";
import GoogleButton from "../components/common/GoogleButton.jsx";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth.js";

const systemStatus = [
  "MongoDB Connected",
  "Redis Active",
  "Vector Index Ready",
  "Hybrid Search Enabled",
];

const Login = () => {
  const { handleLogin } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleLogin({ email, password });
  };

 

  return (
    <AuthShell>
      <section className="w-full max-w-md">
        <div className="mb-4 text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-primary">
            WORKSPACE LOGIN
          </p>
          <h1 className="mt-4 text-4xl font-bold leading-[1.1] tracking-tight text-foreground">
            Welcome back. Your
            <br />
            search pipeline is
            <br />
            <span className="text-primary">running</span>.
          </h1>
          <p className="mx-auto mt-6 max-w-md text-base leading-7 text-muted">
            Continue where you left off — manage products, monitor the search
            pipeline and review live query
            <br />
            performance.
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label
                htmlFor="email"
                className="mb-2 block font-mono text-[11px] tracking-[0.18em] uppercase text-foreground/70"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                required
                placeholder="you@company.com"
                className="h-10 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none transition-all duration-200 placeholder:text-muted placeholder:tracking-wide focus:border-primary focus:ring-4 focus:ring-primary/10"
              />
            </div>

            <div className="mb-2 flex items-center justify-between">
              <label
                htmlFor="password"
                className="font-mono text-[11px] tracking-[0.18em] uppercase text-foreground/70"
              >
                Password
              </label>
            </div>

            <input
              id="password"
              type={showPassword ? "text" : "password"}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              required
              placeholder="Enter your password"
              className="h-10 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none transition-all duration-200 placeholder:text-muted  focus:border-primary focus:ring-4 focus:ring-primary/10"
            />
            <div className="mt-3 flex items-center justify-between">
              <label
                htmlFor="checkbox"
                className="flex cursor-pointer items-center gap-2 text-sm text-muted"
              >
                <input
                  type="checkbox"
                  id="checkbox"
                  checked={showPassword}
                  onChange={(e) => setShowPassword(e.target.checked)}
                  className="h-4 w-4 cursor-pointer rounded border-border accent-primary"
                />
                <span className="text-xs">show password</span>
              </label>
              <button
                type="button"
                className="text-xs font-medium text-primary transition-colors hover:underline cursor-pointer"
              >
                forgot password?
              </button>
            </div>
            <button
              type="submit"
              className="mt-5 h-10 w-full rounded-xl bg-primary text-sm font-extrabold text-primary-foreground transition-all duration-200 hover:opacity-90 cursor-pointer tracking-wider"
            >
              Sign in →
            </button>
          </form>

          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs tracking-wider text-muted">or</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <GoogleButton />

          <p className="mt-6 text-center tracking-wider text-xs text-muted">
            No account yet?
            <Link
              to="/register"
              className="font-medium tracking-wider text-xs text-primary hover:underline ml-1"
            >
              Create one
            </Link>
          </p>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4">
          {systemStatus.map((status) => (
            <div
              key={status}
              className="flex items-center gap-2 text-xs text-muted"
            >
              <span className="text-primary">✓</span>
              <span>{status}</span>
            </div>
          ))}
        </div>
      </section>
    </AuthShell>
  );
};

export default Login;
