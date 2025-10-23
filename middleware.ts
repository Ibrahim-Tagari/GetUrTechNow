import { type NextRequest, NextResponse } from "next/server"

export function middleware(request: NextRequest) {
  const url = request.nextUrl
  const pathname = url.pathname

  // ✅ Apply CSRF prevention only for API routes
  if (pathname.startsWith("/api")) {
    const origin = request.headers.get("origin") || ""

    // ✅ If no origin (e.g., non-browser request), allow it
    if (!origin) return NextResponse.next()

    try {
      const originUrl = new URL(origin)

      const isSameHost = originUrl.hostname === url.hostname
      const isLocalhost =
        originUrl.hostname === "localhost" || originUrl.hostname === "127.0.0.1"
      const isLocalNetwork =
        originUrl.hostname.startsWith("10.") || // common for LAN
        originUrl.hostname.startsWith("192.168.") // other LAN ranges

      if (isSameHost || isLocalhost || isLocalNetwork) {
        return NextResponse.next()
      }
    } catch {
      // silently continue to block below
    }

    return new NextResponse("CSRF token validation failed", { status: 403 })
  }

  return NextResponse.next()
}
