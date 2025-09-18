import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for static files and API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next()
  }

  // Mock authentication check - in real app, verify JWT token
  const isAuthenticated = true // This would check actual auth state
  const isAdmin = false // This would check user role

  // Redirect unauthenticated users to login
  if (!isAuthenticated && pathname !== "/login" && pathname !== "/onboarding") {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Redirect authenticated users away from login page
  if (isAuthenticated && pathname === "/login") {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // Protect admin routes
  if (pathname.startsWith("/admin") && !isAdmin) {
    // In development, allow access for testing
    if (process.env.NODE_ENV !== "development") {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
  }

  // Redirect root to dashboard for authenticated users
  if (pathname === "/" && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
