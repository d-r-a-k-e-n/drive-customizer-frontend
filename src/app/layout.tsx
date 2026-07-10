import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { ROUTS } from "@/consts/routs.const";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Drive customizer",
  description: "Customize car models and share them",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <header className="m-5">
          <nav className="flex gap-4 items-center justify-center">
            <Link href={ROUTS.MAIN_ROUTE}>Main</Link>
            <Link href={ROUTS.CUSTOMIZER_ROUTE}>Customizer</Link>
            <Link href={ROUTS.VIEWER_ROUTE}>Viewer</Link>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
