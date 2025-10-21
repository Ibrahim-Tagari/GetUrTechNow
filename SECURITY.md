# Security Guidelines

## Authentication & Authorization

- All authentication is handled server-side using Supabase Auth
- Passwords are hashed by Supabase using bcrypt
- Sessions are stored in HttpOnly, Secure, SameSite=Strict cookies
- Admin roles are assigned server-side only, never client-side
- User roles are verified on every request via `/api/auth/me`

## Payment Processing

- PayFast transactions are created server-side with verified amounts
- ITN (Instant Transaction Notification) signatures are verified
- All payment data is stored in Supabase with proper encryption
- PII is redacted from logs after verification

## Rate Limiting

- Login: 10 attempts per minute per IP
- Registration: 5 attempts per minute per IP
- Payment endpoints: 5 attempts per minute per user

## CSRF Protection

- All state-changing requests require CSRF token validation
- Tokens are stored in HttpOnly cookies and validated server-side
- PayFast ITN uses signature verification instead of CSRF tokens

## Security Headers

- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
- Strict-Transport-Security: max-age=31536000
- Content-Security-Policy: restrictive defaults

## Deployment Checklist

- [ ] Make repository private
- [ ] Rotate all credentials (Supabase keys, PayFast keys)
- [ ] Enable HTTPS/TLS
- [ ] Set up monitoring and logging
- [ ] Configure rate limiting with Redis for production
- [ ] Implement MFA for admin accounts
- [ ] Schedule security audit/penetration test
- [ ] Set up incident response procedures
- [ ] Document POPIA compliance measures
