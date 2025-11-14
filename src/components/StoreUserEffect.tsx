"use client";

import { useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useConvexAuth } from "convex/react";

/**
 * Component that automatically stores/updates the Clerk user in Convex database
 * Place this in your layout or a page that renders when users are authenticated
 */
export function StoreUserEffect() {
  const { isAuthenticated } = useConvexAuth();
  const storeUser = useMutation(api.users.store);

  useEffect(() => {
    if (isAuthenticated) {
      // Store/update user in Convex database
      storeUser().catch((error) => {
        console.error("Failed to store user:", error);
      });
    }
  }, [isAuthenticated, storeUser]);

  return null; // This component doesn't render anything
}
