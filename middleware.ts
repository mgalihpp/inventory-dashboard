import { NextRequest, NextResponse } from "next/server";

// Middleware function to check if the user is authenticated
export function middleware(req: NextRequest) {
  const res = NextResponse.next();
  loggingMiddleware(req);

  const token = req.cookies.has("token");

  // If token is not present, redirect to the login page
  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  // If token is present, continue to the next middleware or handler
  return NextResponse.rewrite(new URL("/dashboard", req.url));
  // return NextResponse.next();
}

// Logging middleware function
function loggingMiddleware(req: NextRequest) {
  console.log(`Received ${req.method} request to ${req.url} at ${new Date()}`);

  // Continue to the next middleware or handler
  return NextResponse.next();
}

// Configuration for the middleware
export const config = {
  // Define the route pattern to which the middleware should apply
  matcher: ["/", "/(dashboard)"],
};
