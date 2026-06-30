import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AsgardeoAuthProvider from "@/components/AuthProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AETHER-3D // Quantum Hardware Configurator",
  description: "Configure premium futuristic computer hardware in real-time 3D with integrated WSO2 Asgardeo SSO authentication.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-full flex flex-col bg-zinc-950 text-zinc-100 selection:bg-cyan-500/30 selection:text-cyan-200 overflow-x-hidden`}
      >
        <AsgardeoAuthProvider>
          {children}
        </AsgardeoAuthProvider>
      </body>
    </html>
  );
}
