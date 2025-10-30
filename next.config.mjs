/** @type {import('next').NextConfig} */
const nextConfig = {
headers: async () => {
  const isDev = process.env.NODE_ENV !== 'production'

  // base CSP (production). Adjust hosts as needed.
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com",
    `connect-src 'self' https://dzoncboyjuaopjjtpflu.supabase.co https://va.vercel-scripts.com ${isDev ? "http://localhost:3000 ws://localhost:3000" : ""}`,
    "img-src 'self' data: https:",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "frame-ancestors 'self'",
  ].join('; ')

  return [
    {
      source: "/:path*",
      headers: [
        { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
        { key: "Content-Security-Policy", value: csp },
      ],
    },
  ]
},

  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
