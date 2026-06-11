import { Footer } from "./Footer";
import { Navbar } from "./Navbar";

type PageShellProps = {
  children: React.ReactNode;
  className?: string;
};

export function PageShell({ children, className }: PageShellProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className={className ?? "mx-auto w-full max-w-6xl flex-1 px-4 sm:px-6 lg:px-8"}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
