import { ReactNode } from "react";
import { VercelNavbar } from "../ui/vercel-navbar";
import Footer from "./Footer";
import { ThemeProvider } from "../theme-provider";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <div className="min-h-screen bg-background-primary">
        <VercelNavbar />
        <main>{children}</main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}
