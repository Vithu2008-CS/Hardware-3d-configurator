"use client";

import React, { ReactNode } from "react";
import { AuthProvider } from "@asgardeo/auth-react";

interface Props {
  children: ReactNode;
}

export default function AsgardeoProviderInner({ children }: Props) {
  const authConfig = {
    signInRedirectURL: typeof window !== "undefined"
      ? window.location.origin
      : (process.env.NEXT_PUBLIC_ASGARDEO_SIGN_IN_REDIRECT_URL || "http://localhost:3000"),
    signOutRedirectURL: typeof window !== "undefined"
      ? window.location.origin
      : (process.env.NEXT_PUBLIC_ASGARDEO_SIGN_OUT_REDIRECT_URL || "http://localhost:3000"),
    clientID: process.env.NEXT_PUBLIC_ASGARDEO_CLIENT_ID || "g5R6yvW9U5JvjKzGkLwMvPqR_mock",
    baseUrl: process.env.NEXT_PUBLIC_ASGARDEO_BASE_URL || "https://api.asgardeo.io/t/aethercyber",
    scope: ["openid", "profile", "email"]
  };

  return (
    <AuthProvider config={authConfig}>
      {children}
    </AuthProvider>
  );
}
