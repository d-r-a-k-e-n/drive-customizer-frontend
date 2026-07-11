"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import { ROUTS } from "@/consts/routs.const";

const FULLSCREEN_ROUTES = [
  new RegExp(`^${ROUTS.CUSTOMIZER_ROUTE}/[^/]+$`),
  new RegExp(`^${ROUTS.VIEWER_ROUTE}/[^/]+$`),
];

function isFullscreenRoute(pathname: string): boolean {
  return FULLSCREEN_ROUTES.some((pattern) => pattern.test(pathname));
}

export default function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  if (isFullscreenRoute(pathname)) {
    return children;
  }

  return (
    <>
      <Header />
      <div className="flex flex-1 flex-col">{children}</div>
      <Footer />
    </>
  );
}
