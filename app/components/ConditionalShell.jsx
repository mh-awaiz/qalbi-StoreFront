"use client";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import CartDrawer from "./CartDrawer";

export default function ConditionalShell({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  const isHome = pathname === "/";

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar transparent={isHome} />
      <CartDrawer />
      {/* On homepage: no top padding so hero video sits behind the navbar */}
      <main className={isHome ? "pt-0" : "pt-0"}>{children}</main>
      <Footer />
    </>
  );
}
