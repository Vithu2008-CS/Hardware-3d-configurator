"use client";

import React, { useEffect, useState } from "react";
import { useAuthContext } from "@asgardeo/auth-react";
import { LogIn, LogOut, User, ShieldCheck, Loader2 } from "lucide-react";

export default function Header() {
  const { state: authState, signIn, signOut, getBasicUserInfo } = useAuthContext();
  const [profile, setProfile] = useState<{
    displayName?: string;
    username?: string;
    email?: string;
    givenName?: string;
  } | null>(null);

  // Retrieve user details from token claims once authenticated
  useEffect(() => {
    if (authState.isAuthenticated) {
      getBasicUserInfo()
        .then((info) => {
          setProfile(info);
        })
        .catch((err) => {
          console.error("Failed to read OIDC claims:", err);
        });
    } else {
      setProfile(null);
    }
  }, [authState.isAuthenticated, getBasicUserInfo]);

  // Derive display name for greeting
  const getGreetingName = () => {
    if (profile?.givenName) return profile.givenName;
    if (profile?.displayName) return profile.displayName;
    if (profile?.username) return profile.username.split("@")[0];
    return "Operator";
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-900 bg-zinc-950/70 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* ================= BRANDING LOGO ================= */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-cyan-950/20">
            <span className="text-zinc-950 font-bold font-mono text-sm tracking-tighter">Æ</span>
          </div>
          <div>
            <h1 className="text-sm font-mono font-bold tracking-widest text-zinc-100 flex items-center gap-1.5 leading-none">
              AETHER-3D
              <span className="text-[9px] font-semibold text-cyan-400 border border-cyan-500/20 px-1 py-0.2 rounded bg-cyan-950/15">
                v2.0
              </span>
            </h1>
            <p className="text-[9px] font-mono text-zinc-500 tracking-wider mt-0.5 uppercase">
              Quantum Hardware Configurator
            </p>
          </div>
        </div>

        {/* ================= AUTHENTICATION ACTIONS ================= */}
        <div className="flex items-center gap-4">
          {authState.isLoading ? (
            /* Auth Loading State */
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
              <span>SYNCING SESSION...</span>
            </div>
          ) : authState.isAuthenticated ? (
            /* Authenticated State */
            <div className="flex items-center gap-4 animate-fade-in">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-2xs font-mono text-cyan-400 uppercase tracking-widest flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> SECURE SESSION
                </span>
                <span className="text-xs font-semibold text-zinc-200">
                  Welcome, {getGreetingName()}!
                </span>
                <span className="text-[10px] text-zinc-500 font-mono">
                  {profile?.email || authState.username}
                </span>
              </div>
              
              {/* User Avatar Circle */}
              <div className="w-9 h-9 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-cyan-400 hover:border-cyan-500 transition-colors duration-300">
                <User className="w-4 h-4" />
              </div>

              {/* Logout Trigger */}
              <button
                onClick={() => signOut()}
                className="inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg border border-zinc-800 hover:border-red-500/50 bg-zinc-900/40 text-zinc-400 hover:text-red-400 font-mono text-xs transition-all duration-300"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden md:inline">DISCONNECT</span>
              </button>
            </div>
          ) : (
            /* Unauthenticated State */
            <button
              onClick={() => signIn()}
              className="inline-flex items-center justify-center gap-1.5 py-2 px-4 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold font-mono text-xs tracking-wider transition-all duration-300 shadow-md shadow-cyan-950/20 hover:scale-102 hover:shadow-cyan-400/10 cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>CONNECT PROFILE</span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
}
