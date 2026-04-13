import type { ReactNode } from "react";
import Navbar from "./Navbar";

type AppShellProps = {
  children: ReactNode;
};

export default function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-7xl px-3 py-5 sm:px-4 sm:py-6 lg:px-8 lg:py-8">
        {children}
      </main>
    </div>
  );
}
