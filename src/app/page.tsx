"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Dynamically import the authenticated portion of the app with SSR disabled to prevent server-side execution of client auth libraries.
const AuthenticatedApp = dynamic(() => import("@/components/AuthenticatedApp"), { ssr: false });

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

  return <AuthenticatedApp />;
}