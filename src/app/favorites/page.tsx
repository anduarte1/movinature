"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Heart } from "lucide-react";
import { Id } from "@convex/_generated/dataModel";

export default function FavoritesPage() {
  const { user, isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  // Redirect if not signed in
  if (isLoaded && !isSignedIn) {
    router.push("/sign-in");
    return null;
  }

  // Get current user from Convex
  const currentUser = useQuery(api.users.getCurrentUser);

  // Fetch user's favorites
  const favorites = useQuery(
    api.favorites.getByUser,
    isSignedIn && currentUser?._id ? { userId: currentUser._id } : "skip"
  );

  if (!isLoaded || favorites === undefined) {
    return (
      <div className="relative flex min-h-screen w-full">
        <DashboardSidebar />
        <main className="flex-1 p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando seus favoritos...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen w-full bg-gray-50 dark:bg-background-dark">
      <DashboardSidebar />
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumbs */}
          <div className="flex flex-wrap gap-2 mb-6">
            <Link
              href="/"
              className="text-gray-600 dark:text-gray-400 text-base font-medium leading-normal hover:underline"
            >
              Painel
            </Link>
            <span className="text-gray-600 dark:text-gray-400 text-base font-medium leading-normal">
              /
            </span>
            <span className="text-gray-900 dark:text-white text-base font-medium leading-normal">
              Atividades Favoritas
            </span>
          </div>

          {/* Page Heading */}
          <div className="flex flex-wrap justify-between gap-3 mb-8">
            <div className="flex flex-col gap-2">
              <h1 className="text-gray-900 dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">
                Atividades Favoritas
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-base font-normal leading-normal">
                Atividades que você salvou para aventuras futuras
              </p>
            </div>
          </div>

          {/* Favorites List */}
          {favorites && favorites.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {favorites.map((favorite) => (
                <Link
                  key={favorite.favoriteId}
                  href={`/activities/${favorite._id}`}
                  className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-surface-dark shadow-sm transition-shadow hover:shadow-lg"
                >
                  <div className="relative aspect-video">
                    <div
                      className="w-full h-full bg-cover bg-center"
                      style={{
                        backgroundImage: `url('${favorite.images?.[0] || "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&h=600&fit=crop"}')`,
                      }}
                    />
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        // TODO: Implement remove from favorites
                      }}
                      className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/70 backdrop-blur-sm transition-colors hover:bg-white"
                    >
                      <Heart className="h-5 w-5 text-red-500 fill-red-500" />
                    </button>
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {favorite.location}
                    </p>
                    <h3 className="mt-1 text-lg font-bold text-gray-900 dark:text-white">
                      {favorite.title}
                    </h3>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {favorite.rating || 0}{" "}
                          <span className="font-normal text-gray-600 dark:text-gray-400">
                            ({favorite.reviewCount || 0})
                          </span>
                        </span>
                      </div>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-400">
                          A partir de
                        </span>{" "}
                        ${favorite.price}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="flex flex-col items-center justify-center gap-6 rounded-xl bg-white dark:bg-surface-dark p-12 text-center shadow-sm border border-gray-100 dark:border-gray-800">
              <Heart className="h-16 w-16 text-primary" />
              <div className="flex flex-col gap-2">
                <p className="text-gray-900 dark:text-white text-xl font-bold">
                  Nenhum favorito ainda
                </p>
                <p className="text-gray-600 dark:text-gray-400 max-w-sm">
                  Comece a explorar e salve atividades que você gostaria de experimentar!
                </p>
              </div>
              <Button
                asChild
                className="bg-primary text-white hover:bg-primary/90"
              >
                <Link href="/activities">Explorar Atividades</Link>
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
