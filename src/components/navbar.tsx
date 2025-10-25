import Link from "next/link"
import { auth } from "@/auth"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Menu, User } from "lucide-react"

export async function Navbar() {
  const session = await auth()

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-green-100/50 shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="text-2xl font-bold bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent hover:from-emerald-700 hover:via-green-700 hover:to-teal-700 transition-all"
        >
          movinature
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/activities"
            className="text-gray-700 hover:text-green-600 font-medium transition-colors relative group"
          >
            Activities
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-green-600 to-emerald-600 group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link
            href="/about"
            className="text-gray-700 hover:text-green-600 font-medium transition-colors relative group"
          >
            About
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-green-600 to-emerald-600 group-hover:w-full transition-all duration-300"></span>
          </Link>
          {session?.user?.role === "HOST" || session?.user?.role === "ADMIN" ? (
            <Link
              href="/host"
              className="text-gray-700 hover:text-green-600 font-medium transition-colors relative group"
            >
              Host Dashboard
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-green-600 to-emerald-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
          ) : null}
        </div>

        <div className="flex items-center gap-4">
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-11 w-11 rounded-full hover:ring-2 hover:ring-green-500/20 transition-all">
                  <Avatar className="h-10 w-10 ring-2 ring-green-100">
                    <AvatarImage src={session.user?.image || ""} />
                    <AvatarFallback className="bg-gradient-to-br from-green-500 to-emerald-600 text-white font-semibold">
                      {session.user?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-white/95 backdrop-blur-lg border-green-100">
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href="/profile" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href="/bookings">My Bookings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href="/favorites">Favorites</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <form action="/api/auth/signout" method="POST">
                    <button type="submit" className="w-full text-left text-red-600 font-medium">
                      Sign Out
                    </button>
                  </form>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              asChild
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-md hover:shadow-lg transition-all"
            >
              <Link href="/api/auth/signin">Sign In</Link>
            </Button>
          )}
          <Button variant="ghost" size="icon" className="md:hidden hover:bg-green-50">
            <Menu className="h-6 w-6 text-gray-700" />
          </Button>
        </div>
      </div>
    </nav>
  )
}
