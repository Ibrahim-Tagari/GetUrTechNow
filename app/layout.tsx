import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { AuthProvider } from "@/contexts/AuthContext"
import { CartProvider } from "@/contexts/cart-context"
import { ThemeProvider } from "@/contexts/theme-context"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"

export const metadata: Metadata = {
  title: "GetUrTechNow - Premium Tech Products",
  description: "Shop the latest laptops, smartphones, tablets, and tech accessories at GetUrTechNow.co.za",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <ThemeProvider>
          <AuthProvider>
            <CartProvider>
              <Suspense fallback={null}>{children}</Suspense>
              <Toaster />
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}

