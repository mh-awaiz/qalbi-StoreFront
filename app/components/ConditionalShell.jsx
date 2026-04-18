"use client";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import CartDrawer from "./CartDrawer";

export default function ConditionalShell({ children }) {
  const pathname = usePathname();
  const isAdmin  = pathname?.startsWith("/admin");

  if (isAdmin) {
    // Admin routes: no navbar, no footer, no cart drawer, no announcement bar
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <CartDrawer />
      <main className="pt-0">{children}</main>
      <Footer />
    </>
  );
}
