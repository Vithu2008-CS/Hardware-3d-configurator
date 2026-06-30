"use client";

import React from "react";
import { AuthProvider } from "@asgardeo/auth-react";

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AsgardeoAuthProvider({ children }: AuthProviderProps) {
  // 1. Pull variables safely. If they are missing during build-time, fall back to safe strings
  const clientID = process.env.NEXT_PUBLIC_ASGARDEO_CLIENT_ID || "";
  const orgName = process.env.NEXT_PUBLIC_ASGARDEO_ORG_NAME || "";

  // 2. CRUCIAL: Never reference 'origin' directly. Fall back to localhost if the variable is blank
  const redirectURL = process.env.NEXT_PUBLIC_ASGARDEO_REDIRECT_URL || "http://localhost:3000";

  const config = {
    signInRedirectURL: redirectURL,
    signOutRedirectURL: redirectURL,
    clientID: clientID,
    baseUrl: orgName.startsWith("http://") || orgName.startsWith("https://")
      ? orgName
      : `https://api.asgardeo.io/t/${orgName}`,
    scope: ["openid", "profile", "email"]
  };

  // 3. Render the provider safely. Because all config values are pure strings, 
  // Next.js can prerender this on the server without encountering undefined browser globals.
  return (
    <AuthProvider config={config}>
      {children}
    </AuthProvider>
  );
}