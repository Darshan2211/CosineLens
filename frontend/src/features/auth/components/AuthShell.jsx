import Logo from "./common/Logo";
import ProductPanel from "./ProductPanel";

const AuthShell = ({ children }) => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="absolute inset-0 pointer-events-none glow-radial" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col px-6 lg:px-10">
        <header className="py-8">
          <Logo />
        </header>

        <div className="flex flex-1 flex-col items-center justify-center gap-16 lg:flex-row lg:gap-20">
          <div className="relative hidden lg:flex lg:w-1/2">
            <div className="auth-square" />

            <ProductPanel />
          </div>

          <main className="flex w-full justify-center lg:w-1/2">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AuthShell;
