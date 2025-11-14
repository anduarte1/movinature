"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { BookingCard } from "@/components/dashboard/BookingCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function PastBookingsPage() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  // Redirect if not signed in
  if (isLoaded && !isSignedIn) {
    router.push("/sign-in");
    return null;
  }

  // TODO: Replace with real user ID from Convex once we have user sync
  // For now, skip the query entirely to avoid validation errors
  // const bookings = useQuery(
  //   api.bookings.getByUser,
  //   isSignedIn ? { userId: convexUserId } : "skip"
  // );

  // Mock empty array until we have user sync
  const bookings: any[] = [];

  // Filter for past bookings (date < today)
  const today = Date.now();
  const pastBookings =
    bookings?.filter((booking) => booking.date < today) || [];

  if (!isLoaded) {
    return (
      <div className="relative flex min-h-screen w-full">
        <DashboardSidebar />
        <main className="flex-1 p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando suas reservas passadas...</p>
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
              Reservas Passadas
            </span>
          </div>

          {/* Page Heading */}
          <div className="flex flex-wrap justify-between gap-3 mb-8">
            <div className="flex flex-col gap-2">
              <h1 className="text-gray-900 dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">
                Reservas Passadas
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-base font-normal leading-normal">
                Revise suas aventuras concluídas e compartilhe suas experiências
              </p>
            </div>
          </div>

          {/* Bookings List */}
          {pastBookings.length > 0 ? (
            <div className="flex flex-col gap-6">
              {pastBookings.map((booking) => (
                <BookingCard key={booking._id} booking={booking} />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="flex flex-col items-center justify-center gap-6 rounded-xl bg-white dark:bg-surface-dark p-12 text-center shadow-sm border border-gray-100 dark:border-gray-800">
              <CheckCircle className="h-16 w-16 text-primary" />
              <div className="flex flex-col gap-2">
                <p className="text-gray-900 dark:text-white text-xl font-bold">
                  Nenhuma reserva passada
                </p>
                <p className="text-gray-600 dark:text-gray-400 max-w-sm">
                  Suas aventuras concluídas aparecerão aqui. Comece a explorar!
                </p>
              </div>
              <Button
                asChild
                className="bg-primary text-white hover:bg-primary/90"
              >
                <Link href="/activities">Descobrir Atividades</Link>
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
