"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import AsgardeoAuthProvider from "@/components/AuthProvider";

const Header = dynamic(() => import("@/components/Header"), { ssr: false });
const ConfigPanel = dynamic(() => import("@/components/ConfigPanel"), { ssr: false });
const ConfiguratorCanvas = dynamic(() => import("@/components/ConfiguratorCanvas"), { ssr: false });

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex flex-col min-h-screen bg-zinc-950 text-zinc-100 items-center justify-center font-mono select-none">
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-500 flex items-center justify-center text-zinc-950 font-bold text-lg">
            Æ
          </div>
          <div className="text-[10px] text-zinc-500 uppercase tracking-widest">
            Aether Engine Initializing...
          </div>
        </div>
      </div>
    );
  }

  return (
    <AsgardeoAuthProvider>
      <div className="flex flex-col min-h-screen bg-zinc-950 text-zinc-100 overflow-hidden">
        {/* ================= SECURE OIDC HEADER ================= */}
        <Header />

        {/* ================= MAIN INTERACTIVE WORKSPACE ================= */}
        <main className="flex-grow flex flex-col lg:flex-row relative h-[calc(100vh-4rem)]">
          
          {/* Left/Top Section: 3D Real-time Viewport */}
          <div className="flex-grow h-[50vh] lg:h-full relative border-b lg:border-b-0 lg:border-r border-zinc-900 bg-zinc-950">
            <ConfiguratorCanvas />
          </div>

          {/* Right/Bottom Section: Glassmorphic Control Panel */}
          <div className="w-full lg:w-[420px] xl:w-[450px] flex-shrink-0 h-[50vh] lg:h-full p-4 lg:p-6 bg-zinc-950/40">
            <ConfigPanel />
          </div>

        </main>
      </div>
    </AsgardeoAuthProvider>
  );
}
