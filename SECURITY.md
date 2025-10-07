# Security Configuration Guide

This document outlines the security measures implemented in FragranceFind and deployment requirements for production.

## Implemented Security Features ✅

### 1. Environment Configuration
- **Environment Variables**: API URL configured via `VITE_API_BASE_URL`
- **Secure Defaults**: Production warning if using localhost
- **Configuration Template**: `.env.example` provided for setup

### 2. Input Validation & Sanitization
- **Search Input**: 100-character limit, dangerous character filtering
- **Category Validation**: Whitelist-based validation
- **ID Validation**: Alphanumeric validation for perfume IDs
- **Utility Functions**: Centralized in `src/lib/validation.ts`

### 3. Error Handling
- **Message Sanitization**: Stack traces and paths removed
- **User-Friendly Messages**: Generic error messages prevent information disclosure
- **Security Warnings**: Production alerts for misconfigurations

### 4. Code Quality
- **No Debug Logging**: All `console.log()` removed from production code
- **TypeScript**: Strict type checking enabled
- **Linting**: ESLint configured for security best practices

## Required Security Headers (Backend/Deployment)

These headers must be configured at the **backend API** or **deployment platform** level.

### Content Security Policy (CSP)
Add to backend responses or hosting platform:

```
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https://*.amazonaws.com;
  font-src 'self' data:;
  connect-src 'self' https://your-api-domain.com;
  frame-ancestors 'none';
```

**Vite Note**: Vite dev server uses `eval()` for hot module replacement, so `'unsafe-eval'` is needed in development. Production builds should remove this.

### HTTP Security Headers
Configure these headers on your hosting platform:

```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

### HTTPS Configuration
- **Production Requirement**: All API calls must use HTTPS
- **HSTS Header**: Add `Strict-Transport-Security: max-age=31536000; includeSubDomains`
- **TLS Version**: Minimum TLS 1.2 required

## Deployment Platform Configuration

### Vercel
Add to `vercel.json`:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    }
  ]
}
```

### Netlify
Add to `netlify.toml`:

```toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

### AWS S3 + CloudFront
Configure Lambda@Edge function for headers:

```javascript
exports.handler = async (event) => {
  const response = event.Records[0].cf.response;
  response.headers['x-frame-options'] = [{key: 'X-Frame-Options', value: 'DENY'}];
  response.headers['x-content-type-options'] = [{key: 'X-Content-Type-Options', value: 'nosniff'}];
  response.headers['x-xss-protection'] = [{key: 'X-XSS-Protection', value: '1; mode=block'}];
  return response;
};
```

## Environment Variables

### Development (.env.local)
```bash
VITE_API_BASE_URL=http://localhost:3000
```

### Production
```bash
VITE_API_BASE_URL=https://api.yourdomain.com
```

**Important**: Never commit `.env.local` to git. Use platform-specific environment variable configuration.

## Security Checklist for Production

### Pre-Deployment
- [ ] Set `VITE_API_BASE_URL` to production HTTPS endpoint
- [ ] Verify no hardcoded credentials or API keys
- [ ] Run `npm audit` to check for vulnerabilities
- [ ] Test with production environment variables
- [ ] Verify CSP doesn't block required resources

### Deployment Configuration
- [ ] Configure security headers on hosting platform
- [ ] Enable HTTPS/TLS for all endpoints
- [ ] Set up CORS properly on backend API
- [ ] Configure rate limiting on API endpoints
- [ ] Enable logging and monitoring

### Post-Deployment
- [ ] Test CSP with browser console (no violations)
- [ ] Verify security headers with browser DevTools
- [ ] Check SSL/TLS configuration (SSL Labs)
- [ ] Test error handling (no sensitive info leaked)
- [ ] Monitor for security warnings in logs

## Vulnerability Reporting

If you discover a security vulnerability, please:
1. **Do not** open a public GitHub issue
2. Email security concerns to: [your-security-email]
3. Include detailed reproduction steps
4. Allow reasonable time for response

## Security Updates

Run these commands regularly:

```bash
# Check for vulnerabilities
npm audit

# Update dependencies
npm update

# Check for outdated packages
npm outdated
```

## Additional Recommendations

### Rate Limiting
Implement at API level:
- 100 requests per minute per IP for search
- 10 requests per minute for authentication endpoints
- Exponential backoff for failed attempts

### Authentication (Phase 2)
- Use HTTPOnly cookies for session tokens
- Implement CSRF protection
- Use bcrypt for password hashing (min 12 rounds)
- Enforce password complexity requirements
- Add 2FA support

### Monitoring
- Log authentication attempts
- Monitor for unusual API patterns
- Set up alerts for security events
- Regular security audits

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Content Security Policy Guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [Web Security Guidelines](https://infosec.mozilla.org/guidelines/web_security)
- [Vite Security](https://vitejs.dev/guide/env-and-mode.html#env-files)

## Status

**Current Security Level**: Production-Ready (Frontend)

- ✅ Input validation implemented
- ✅ Error sanitization active
- ✅ Environment configuration secure
- ✅ Debug logging removed
- ⚠️ Backend headers required for deployment
- ⚠️ HTTPS enforcement needed on production API

Last Updated: 2025-10-07
