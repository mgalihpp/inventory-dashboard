import { NextRequest, NextResponse } from "next/server";

// Middleware function to check if the user is authenticated
export function middleware(req: NextRequest) {
  loggingMiddleware(req);

  const token = req.cookies.has("token");

  // If token is not present, redirect to the login page
  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  // If token is present, continue to the next middleware or handler

  return NextResponse.next();
}

// Logging middleware function
function loggingMiddleware(req: NextRequest) {
  console.log(`Received ${req.method} request to ${req.url} at ${new Date()}`);

  // Continue to the next middleware or handler
  return NextResponse.next();
}

// Configuration for the middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|auth/login|bg-01.jpg).*)",
  ],
};
