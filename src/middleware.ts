import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const { pathname } = req.nextUrl

  // Protect host routes
  if (pathname.startsWith('/host') && !isLoggedIn) {
    return NextResponse.redirect(new URL('/auth/signin', req.url))
  }

  // Protect booking routes
  if (pathname.startsWith('/bookings') && !isLoggedIn) {
    return NextResponse.redirect(new URL('/auth/signin', req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
