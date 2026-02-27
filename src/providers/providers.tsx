"use client";

import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { useAuth } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import React, { useEffect } from "react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function PresenceProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  // Get Convex user record by Clerk userId
  const convexUser = useQuery(api.users.getCurrentUser);
  const setUserOnline = useMutation(api.users.setUserOnline);
  const setUserOffline = useMutation(api.users.setUserOffline);
  const prevUserIdRef = React.useRef<string | undefined>(undefined);
  const heartbeatRef = React.useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (
      convexUser &&
      convexUser._id &&
      prevUserIdRef.current !== convexUser._id
    ) {
      setUserOnline({ userId: convexUser._id });
      prevUserIdRef.current = convexUser._id;

      // Heartbeat: update online status every 10 seconds
      heartbeatRef.current = setInterval(() => {
        setUserOnline({ userId: convexUser._id });
      }, 10000);

      const handleUnload = () => setUserOffline({ userId: convexUser._id });
      window.addEventListener("beforeunload", handleUnload);

      return () => {
        setUserOffline({ userId: convexUser._id });
        window.removeEventListener("beforeunload", handleUnload);
        if (heartbeatRef.current) clearInterval(heartbeatRef.current);
      };
    }
    // Cleanup on unmount or user change
    return () => {
      if (heartbeatRef.current) clearInterval(heartbeatRef.current);
    };
  }, [convexUser && convexUser._id]);

  return children;
}

// Wrap Providers with PresenceProvider
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      <PresenceProvider>{children}</PresenceProvider>
    </ConvexProviderWithClerk>
  );
}
