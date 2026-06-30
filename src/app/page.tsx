"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useAuthContext } from "@asgardeo/auth-react";
import AsgardeoAuthProvider from "@/components/AuthProvider";

// Dynamically import heavy UI / 3D modules with SSR disabled to prevent hydration cracks
const Header = dynamic(() => import("@/components/Header"), { ssr: false });
const ConfigPanel = dynamic(() => import("@/components/ConfigPanel"), { ssr: false });
const ConfiguratorCanvas = dynamic(() => import("@/components/ConfiguratorCanvas"), { ssr: false });

/**
 * Inner Application Workspace
 * Consumes the active WSO2 Asgardeo context to enforce strict routing protections.
 */
function AuthenticatedApp() {
  const { state, signIn } = useAuthContext();

  // 1. Production Diagnostics: Prints client environment variables safely to your browser console
  useEffect(() => {
    console.log("=== WSO2 Asgardeo Build Verification ===");
    console.log("Configured Client ID:", process.env.NEXT_PUBLIC_ASGARDEO_CLIENT_ID);
    console.log("Configured Org Name:", process.env.NEXT_PUBLIC_ASGARDEO_ORG_NAME);
    console.log("Configured Redirect URL:", process.env.NEXT_PUBLIC_ASGARDEO_REDIRECT_URL);
    console.log("Active Session State:", state);
  }, [state]);

  // 2. Strict Authentication Wall: If checked and unauthenticated, kick out to identity provider
  useEffect(() => {
    if (!state.isLoading && !state.isAuthenticated) {
      signIn().catch((err) => console.error("Asgardeo security interception failed:", err));
    }
  }, [state.isLoading, state.isAuthenticated, signIn]);

  // 3. Loading State: Display while verifying security cookies or handshake keys
  if (state.isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-zinc-950 text-zinc-100 items-center justify-center font-mono select-none">
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-500 flex items-center justify-center text-zinc-950 font-bold text-lg">
            Æ
          </div>
          <div className="text-[10px] text-zinc-500 uppercase tracking-widest">
            Securing Gateway via Asgardeo...
          </div>
        </div>
      </div>
    );
  }

  // 4. Prevention Barrier: Keeps layout completely blank while browser initializes the external route redirection
  if (!state.isAuthenticated) {
    return (
      <div className="flex flex-col min-h-screen bg-zinc-950 text-zinc-100 items-center justify-center font-mono select-none">
        <div className="text-[10px] text-zinc-500 uppercase tracking-widest animate-pulse">
          Redirecting to Authorization Portal...
        </div>
      </div>
    );
  }

  // 5. Secure Core Application Layout (Only mounts post-authentication verification)
  return (
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
  );
}

/**
 * Root Landing Entrypoint
 * Handles physical client mounting to eliminate core Next.js hydration anomalies.
 */
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
      <AuthenticatedApp />
    </AsgardeoAuthProvider>
  );
}