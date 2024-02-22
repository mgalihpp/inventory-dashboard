import { NextRequest, NextResponse } from "next/server";

// Middleware function to check if the user is authenticated
export function middleware(request: NextRequest) {
  loggingMiddleware(request);

  const token = request.cookies.get("token");

  // If token is not present, redirect to the login page
  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // If token is present, continue to the next middleware or handler
  return NextResponse.rewrite(new URL("/dashboard", request.url));
  // return NextResponse.next();
}

// Logging middleware function
function loggingMiddleware(request: NextRequest) {
  console.log(
    `Received ${request.method} request to ${request.url} at ${new Date()}`
  );

  // Continue to the next middleware or handler
  return NextResponse.next();
}

// Configuration for the middleware
export const config = {
  // Define the route pattern to which the middleware should apply
  matcher: "/",
};
