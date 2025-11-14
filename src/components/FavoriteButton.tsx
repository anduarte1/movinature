"use client";

import { Heart } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";
import { useState } from "react";

interface FavoriteButtonProps {
  activityId: Id<"activities">;
  className?: string;
  showToast?: boolean;
}

export function FavoriteButton({ activityId, className = "", showToast = false }: FavoriteButtonProps) {
  const { isSignedIn } = useUser();
  const [isAnimating, setIsAnimating] = useState(false);

  // Get current user from Convex
  const currentUser = useQuery(api.users.getCurrentUser);

  // Check if activity is favorited
  const isFavorited = useQuery(
    api.favorites.isFavorited,
    isSignedIn && currentUser?._id
      ? { userId: currentUser._id, activityId }
      : "skip"
  );

  // Toggle favorite mutation
  const toggleFavorite = useMutation(api.favorites.toggle);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isSignedIn) {
      // Redirect to sign in if not authenticated
      window.location.href = "/sign-in?redirect=" + window.location.pathname;
      return;
    }

    if (!currentUser?._id) {
      return;
    }

    // Animate heart
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);

    try {
      await toggleFavorite({
        userId: currentUser._id,
        activityId,
      });

      if (showToast) {
        // Optional: Add toast notification
        console.log(isFavorited ? "Removed from favorites" : "Added to favorites");
      }
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
    }
  };

  return (
    <button
      onClick={handleToggle}
      className={`flex items-center justify-center rounded-full bg-white/70 backdrop-blur-sm transition-all hover:bg-white hover:scale-110 ${
        isAnimating ? "scale-125" : ""
      } ${className}`}
      aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart
        className={`h-5 w-5 transition-all ${
          isFavorited
            ? "fill-red-500 text-red-500"
            : "text-gray-700 hover:text-red-500"
        }`}
      />
    </button>
  );
}
