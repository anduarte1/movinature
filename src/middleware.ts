import { NextResponse } from "next/server"

// Simplified middleware that doesn't use database
// Auth protection can be handled in page components instead
export function middleware() {
  // For now, allow all routes
  // TODO: Add proper edge-compatible auth protection when needed
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
