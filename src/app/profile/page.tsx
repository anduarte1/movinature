"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

export default function ProfilePage() {
  const { user, isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  // Redirect if not signed in
  if (isLoaded && !isSignedIn) {
    router.push("/sign-in");
    return null;
  }

  if (!isLoaded) {
    return (
      <div className="relative flex min-h-screen w-full">
        <DashboardSidebar />
        <main className="flex-1 p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando seu perfil...</p>
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
              Configurações do Perfil
            </span>
          </div>

          {/* Page Heading */}
          <div className="flex flex-wrap justify-between gap-3 mb-8">
            <div className="flex flex-col gap-2">
              <h1 className="text-gray-900 dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">
                Configurações do Perfil
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-base font-normal leading-normal">
                Gerencie as informações e preferências da sua conta
              </p>
            </div>
          </div>

          {/* Profile Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações da Conta</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <div
                    className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-24 w-24"
                    style={{
                      backgroundImage: user?.imageUrl
                        ? `url('${user.imageUrl}')`
                        : 'url("https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop")',
                    }}
                  />
                  <div className="flex flex-col gap-2">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {user?.fullName || "Usuário"}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {user?.primaryEmailAddress?.emailAddress}
                    </p>
                  </div>
                </div>

                <div className="pt-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Gerencie as configurações da sua conta usando o perfil de usuário do Clerk:
                  </p>
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox: "w-12 h-12",
                        userButtonPopoverCard: "shadow-xl",
                      },
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Preferências</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">
                  Configurações de preferências em breve! Você poderá personalizar
                  sua experiência, configurações de notificações e muito mais.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
