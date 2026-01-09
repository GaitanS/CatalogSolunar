---
description: Best practices for Next.js apps deployed to Hostinger with GitHub integration
---

# Next.js + Hostinger + GitHub Deployment Guide

## Project Setup

### 1. Initialize Next.js Project
```bash
npx create-next-app@latest ./ --typescript --tailwind --eslint --app --src-dir --no-turbopack
```

### 2. Required package.json Scripts
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

### 3. next.config.js - Production Ready
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',  // Required for Hostinger
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: false },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' }
    ]
  }
}
module.exports = nextConfig
```

---

## Hostinger Deployment

### Common Error: "package.json file not found"
**Cause**: Wrong root directory in Git Repository settings
**Fix**: 
1. Go to Hostinger > Git Repository settings
2. Set branch: `main`
3. Set root directory: `/` (not subfolder)
4. Click "Force Redeploy"

### Hostinger Git Settings Checklist
- [ ] Repository connected correctly
- [ ] Branch: `main`
- [ ] Root directory: `/`
- [ ] Auto-deploy enabled
- [ ] Build command: `npm run build`
- [ ] Start command: `npm run start`

---

## Version Compatibility

### Tested Working Combinations
| Next.js | React | Node | Tailwind |
|---------|-------|------|----------|
| 14.2.x | 18.x | 18.x | 3.4.x |
| 15.x | 19.x | 20.x | 3.4.x |

### Avoid Issues
- Don't mix React 18 with Next.js 15 (use React 19)
- Lock versions in package.json (no `^` for major deps)

---

## Architecture Best Practices

### File Structure
```
src/
├── app/
│   ├── layout.tsx       # Global layout + schemas
│   ├── page.tsx         # Homepage
│   ├── sitemap.ts       # Auto-generated sitemap
│   └── [feature]/
│       └── page.tsx
├── components/
│   ├── [Component].tsx
│   └── ui/              # Reusable UI components
├── lib/
│   ├── utils.ts
│   └── [feature].ts     # Business logic
└── types/
    └── index.ts
```

### Server vs Client Components
- Default: Server Components (no 'use client')
- Use 'use client' only for: useState, useEffect, event handlers
- Keep client components small and at leaf level

---

## SEO & AdSense

### Required for AdSense Approval
1. `public/ads.txt` with publisher ID
2. Meta tag in layout: `<meta name="google-adsense-account" content="ca-pub-xxx" />`
3. Minimum 10+ quality articles (1000+ words each)
4. Privacy Policy, Terms, Contact pages
5. Site must be live and indexed

### JSON-LD Schemas (add to layout.tsx)
```typescript
const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'SiteName',
  url: 'https://example.com',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://example.com/search?q={search_term_string}',
    'query-input': 'required name=search_term_string'
  }
};
```

### Sitemap.ts Template
```typescript
import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://example.com', lastModified: new Date(), priority: 1 },
    // Add all pages
  ];
}
```

---

## Security

### Environment Variables
- Never commit `.env` files
- Use `.env.local` for local development
- Set in Hostinger dashboard for production

### Headers (next.config.js)
```javascript
async headers() {
  return [{
    source: '/(.*)',
    headers: [
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    ]
  }]
}
```

---

## GitHub Workflow

### Recommended .gitignore
```
node_modules/
.next/
.env*.local
.vercel
*.tsbuildinfo
```

### Pre-commit Checklist
1. `npx tsc --noEmit` - Check TypeScript
2. `npm run lint` - Check ESLint
3. `npm run build` - Verify build works

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Build fails on Hostinger | Check Node version compatibility |
| CSS not loading | Verify Tailwind config imports |
| 404 on routes | Check `output: 'standalone'` in next.config |
| Images not loading | Add domain to `remotePatterns` |
| Prisma file lock | Stop dev server before running migrate |
