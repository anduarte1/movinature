"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser, useClerk } from "@clerk/nextjs";
import {
  Calendar,
  CheckCircle,
  Heart,
  Settings,
  LogOut,
  TreePine,
} from "lucide-react";

const navigation = [
  { name: "Próximas Reservas", href: "/bookings", icon: Calendar },
  { name: "Reservas Anteriores", href: "/bookings/past", icon: CheckCircle },
  { name: "Atividades Favoritas", href: "/favorites", icon: Heart },
  { name: "Configurações do Perfil", href: "/profile", icon: Settings },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const { user } = useUser();
  const { signOut } = useClerk();

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-gray-200/50 dark:border-gray-700/50 bg-white dark:bg-surface-dark p-4 sticky top-0">
      <div className="flex flex-col gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 px-2 py-2">
          <TreePine className="text-primary text-3xl h-8 w-8" />
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            GoWild
          </h1>
        </Link>

        {/* User Profile */}
        <div className="flex items-center gap-3 p-3 mt-4">
          <div
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-12 w-12"
            style={{
              backgroundImage: user?.imageUrl
                ? `url('${user.imageUrl}')`
                : 'url("https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop")',
            }}
          />
          <div className="flex flex-col min-w-0">
            <h1 className="text-gray-900 dark:text-white text-base font-semibold leading-normal truncate">
              {user?.fullName || "User"}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm font-normal leading-normal truncate">
              {user?.primaryEmailAddress?.emailAddress}
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2 mt-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? "bg-primary/20"
                    : "hover:bg-primary/10 dark:hover:bg-primary/20"
                }`}
              >
                <Icon
                  className={`h-5 w-5 ${
                    isActive
                      ? "text-gray-900 dark:text-white"
                      : "text-gray-600 dark:text-gray-400"
                  }`}
                />
                <p className="text-gray-900 dark:text-white text-sm font-medium leading-normal">
                  {item.name}
                </p>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout */}
      <div className="mt-auto flex flex-col gap-1">
        <button
          onClick={() => signOut()}
          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors"
        >
          <LogOut className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          <p className="text-gray-900 dark:text-white text-sm font-medium leading-normal">
            Sair
          </p>
        </button>
      </div>
    </aside>
  );
}
