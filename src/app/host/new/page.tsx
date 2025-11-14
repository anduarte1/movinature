"use client";

import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { CreateActivityForm } from "@/components/create-activity-form";

export default function NewActivityPage() {
  const router = useRouter();
  const { user, isSignedIn, isLoaded } = useUser();

  // Redirect if not signed in
  if (isLoaded && !isSignedIn) {
    router.push("/sign-in");
    return null;
  }

  // Fetch categories and current user
  const categories = useQuery(api.categories.list);
  const currentUser = useQuery(api.users.getCurrentUser);

  // Loading state
  if (!isLoaded || categories === undefined || currentUser === undefined) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Check if user is properly loaded
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Please sign out and sign back in.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Create New Activity</h1>
          <p className="text-muted-foreground">
            Share your amazing outdoor activity with families
          </p>
        </div>

        <CreateActivityForm categories={categories} userId={currentUser._id} />
      </div>
    </div>
  );
}
