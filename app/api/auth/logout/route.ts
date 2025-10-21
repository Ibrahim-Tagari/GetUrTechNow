import { NextResponse } from "next/server"

// Server-side logout endpoint
export async function POST() {
  const response = NextResponse.json({ message: "Logged out successfully" })

  // Clear HttpOnly cookies
  response.cookies.set("sb-access-token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 0,
    path: "/",
  })

  response.cookies.set("sb-refresh-token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 0,
    path: "/",
  })

  return response
}
