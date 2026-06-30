"use client";

import React, { ReactNode, useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Dynamically import the inner provider containing client-only Asgardeo SDK imports
const AsgardeoProviderInner = dynamic(() => import("./AsgardeoProviderInner"), {
  ssr: false,
});

interface AuthProviderProps {
  children: ReactNode;
}

export default function AsgardeoAuthProvider({ children }: AuthProviderProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Return raw children during SSR/prerender to prevent server parsing errors
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <AsgardeoProviderInner>
      {children}
    </AsgardeoProviderInner>
  );
}
