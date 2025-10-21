// Simple in-memory rate limiter (use Redis for production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

export function rateLimit(key: string, limit = 5, windowMs = 60000): boolean {
  const now = Date.now()
  const record = rateLimitStore.get(key)

  if (!record || now > record.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs })
    return true
  }

  if (record.count < limit) {
    record.count++
    return true
  }

  return false
}
