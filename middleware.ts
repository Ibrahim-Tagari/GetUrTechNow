import { type NextRequest, NextResponse } from "next/server"

// Secure middleware: set headers, redirect to HTTPS in production, and allow same-origin API POSTs.
export function middleware(request: NextRequest) {
  // Allow same-origin API calls to proceed (safer than unconditional bypass).
  const url = request.nextUrl
  const pathname = url.pathname
  if (pathname.startsWith("/api")) {
    const origin = request.headers.get("origin") || request.headers.get("referer") || ""
    // Allow if no origin (some tools) or if origin matches the server origin (same-origin)
    if (!origin || origin.startsWith(url.origin)) {
      return NextResponse.next()
    }
    // If origin exists but doesn't match, block the request
    return new NextResponse("CSRF token validation failed", { status: 403 })
  }

  const response = NextResponse.next()

  // Security response headers
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("X-XSS-Protection", "1; mode=block")
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
  response.headers.set("Permissions-Policy", "geolocation=(), microphone=(), camera=()")
  response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload")
  response.headers.set("Cross-Origin-Opener-Policy", "same-origin")
  response.headers.set("Cross-Origin-Embedder-Policy", "credentialless")

  // Redirect to HTTPS in production
  if (process.env.NODE_ENV === "production" && request.nextUrl.protocol === "http:") {
    return NextResponse.redirect(`https://${request.nextUrl.host}${request.nextUrl.pathname}`, 301)
  }

  return response
}

export const config = {
  matcher: [
    // Match all paths except Next's static and image optimization files and favicon
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
}
