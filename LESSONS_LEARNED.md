# Movinature Project - Lessons Learned

**Date:** October 31, 2025
**Tech Stack:** Next.js 15.5.4, Prisma, PostgreSQL (Supabase), NextAuth v5, Stripe, Vercel

---

## Table of Contents
1. [Critical Issues & Solutions](#critical-issues--solutions)
2. [Deployment Checklist](#deployment-checklist)
3. [Database Configuration](#database-configuration)
4. [Authentication Setup](#authentication-setup)
5. [Common Errors & Fixes](#common-errors--fixes)
6. [Best Practices](#best-practices)

---

## Critical Issues & Solutions

### 1. Prisma Relation Naming (MAJOR BLOCKER)

**Problem:** TypeScript compilation errors due to inconsistent Prisma relation names.

**Root Cause:** Prisma generates TypeScript types using exact model names (PascalCase), but code was using lowercase relation names.

**Error Example:**
```
Property 'activity' does not exist on type... Did you mean 'Activity'?
```

**Solution:**
- All Prisma relations MUST use PascalCase matching the model name
- Includes `_count` aggregations

**Correct Pattern:**
```typescript
// ❌ WRONG
booking.activity.title
booking._count.reviews

// ✅ CORRECT
booking.Activity.title
booking._count.Review
```

**Files Affected:**
- `src/app/bookings/[id]/page.tsx`
- `src/app/bookings/page.tsx`
- `src/app/favorites/page.tsx`
- `src/app/host/activities/[id]/bookings/page.tsx`
- `src/app/host/page.tsx`
- `src/app/profile/page.tsx`
- `src/app/activities/[id]/page.tsx`

**Lesson:** Run local build (`npm run build`) before deploying to catch these errors early.

---

### 2. Supabase Connection Pooler Issues (CRITICAL)

**Problem:** Database connections closing unexpectedly with error:
```
prisma:error Error in PostgreSQL connection: Error { kind: Closed, cause: None }
```

**Root Cause:** Supabase connection pooler (pgBouncer) requires specific configuration.

**Solution:**

1. **Update DATABASE_URL** with pgBouncer parameters:
```env
DATABASE_URL="postgresql://user:pass@aws-1-sa-east-1.pooler.supabase.com:5432/postgres?pgbouncer=true&connection_limit=1"
```

2. **Add DIRECT_DATABASE_URL** for migrations:
```env
DIRECT_DATABASE_URL="postgresql://user:pass@aws-1-sa-east-1.connect.supabase.com:5432/postgres"
```

3. **Update Prisma schema:**
```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_DATABASE_URL")
}
```

**Key Differences:**
- `DATABASE_URL`: Uses `.pooler.supabase.com` for connection pooling
- `DIRECT_DATABASE_URL`: Uses `.connect.supabase.com` for direct connection

**Vercel Environment Variables Required:**
- Both variables must be added to Vercel
- Apply to Production, Preview, and Development environments

---

### 3. NextAuth Prisma Adapter ID Defaults

**Problem:** NextAuth couldn't create database records without explicit IDs.

**Solution:** Add default ID generation to Prisma models:

```prisma
model Account {
  id                String  @id @default(cuid())  // ← Added @default(cuid())
  // ... other fields
}

model Session {
  id           String   @id @default(cuid())  // ← Added @default(cuid())
  // ... other fields
}

model User {
  id            String     @id @default(cuid())  // ← Added @default(cuid())
  // ... other fields
}
```

---

### 4. Google OAuth Production Issues (UNRESOLVED)

**Problem:** Google blocks sign-in with "This browser or app may not be secure"

**Attempted Solutions:**
1. ✅ Added production JavaScript origin: `https://movinature.vercel.app`
2. ✅ Added redirect URI: `https://movinature.vercel.app/api/auth/callback/google`
3. ✅ Published OAuth app to production
4. ✅ Updated Vercel NEXTAUTH_URL to `https://movinature.vercel.app`
5. ❌ Still rejected by Google

**Possible Causes:**
- Google requires app verification for production use
- Missing OAuth consent screen configuration
- Need to add authorized domain `vercel.app`
- Scopes not properly configured

**OAuth Consent Screen Requirements:**
- App name
- User support email
- Developer contact email
- App logo (optional but recommended)
- Authorized domains: `vercel.app`
- Scopes: `openid`, `email`, `profile`

**Workaround:**
- Keep app in "Testing" mode
- Add specific test users in Google Cloud Console
- Submit for Google verification (3-7 days)

**Status:** Works locally, blocked in production

---

### 5. ESLint React/No-Unescaped-Entities

**Problem:** Build fails with apostrophe errors in JSX

**Error:**
```
Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`
```

**Solution:** Replace all apostrophes in JSX text with `&apos;`

```tsx
// ❌ WRONG
<p>We're building something great</p>

// ✅ CORRECT
<p>We&apos;re building something great</p>
```

**Lesson:** Run `npm run build` locally before committing.

---

### 6. Stripe API Version Mismatch

**Problem:** TypeScript error about incompatible Stripe API versions

**Error:**
```
Type '"2024-12-18.acacia"' is not assignable to type '"2025-09-30.clover"'
```

**Solution:** Update to latest Stripe API version in `src/lib/stripe.ts`:

```typescript
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-09-30.clover",  // ← Updated
  typescript: true,
})
```

---

### 7. GitHub Push Protection (Secrets Exposed)

**Problem:** Push blocked due to exposed API keys in documentation files

**Files:**
- `DEPLOYMENT_GUIDE.md`
- `PRODUCTION-READY.md`
- `TESTING_SUMMARY.md`

**Solution:** Replace real API keys with placeholders:
```
GOOGLE_CLIENT_ID="your-google-client-id"
STRIPE_SECRET_KEY="sk_test_your_stripe_key"
```

**Lesson:** Never commit real API keys, even in documentation.

---

## Deployment Checklist

### Pre-Deployment (Local)

- [ ] Run `npm run build` locally
- [ ] Fix all TypeScript errors
- [ ] Fix all ESLint warnings
- [ ] Test authentication flow locally
- [ ] Test payment flow with Stripe test cards
- [ ] Verify database migrations with `npx prisma db push`
- [ ] Check `.env` file is in `.gitignore`
- [ ] Remove exposed secrets from code/docs

### Vercel Environment Variables

Required variables for production:

```env
# Database
DATABASE_URL=postgresql://...pooler.supabase.com:5432/postgres?pgbouncer=true&connection_limit=1
DIRECT_DATABASE_URL=postgresql://...connect.supabase.com:5432/postgres

# NextAuth
NEXTAUTH_URL=https://movinature.vercel.app
NEXTAUTH_SECRET=your-secret-here

# Google OAuth
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret

# Stripe
STRIPE_SECRET_KEY=sk_live_your_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_production_webhook

# Optional
UPLOADTHING_TOKEN=your-token
RESEND_API_KEY=your-api-key
RESEND_FROM_EMAIL=noreply@yourdomain.com
```

### Google Cloud Console Setup

1. **OAuth Credentials:**
   - Authorized JavaScript origins:
     - `http://localhost:3000` (development)
     - `https://movinature.vercel.app` (production)
   - Authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google`
     - `https://movinature.vercel.app/api/auth/callback/google`

2. **OAuth Consent Screen:**
   - Publishing status: "In production" OR "Testing" with test users
   - User type: External
   - App name: movinature
   - User support email: your@email.com
   - Developer contact: your@email.com
   - Authorized domains: `vercel.app`
   - Scopes: `openid`, `email`, `profile`

### Stripe Setup

1. **Create Production Webhook:**
   ```
   Endpoint: https://movinature.vercel.app/api/webhooks/stripe
   Events: payment_intent.succeeded, payment_intent.payment_failed
   ```

2. **Get webhook secret** and add to Vercel environment variables

### Database Setup

1. **Run migrations:**
   ```bash
   npx prisma db push
   ```

2. **Seed database:**
   ```bash
   npx prisma db seed
   ```

3. **Verify connection** from Vercel logs

---

## Database Configuration

### Prisma Schema Best Practices

```prisma
// Always add @default() for ID fields used by NextAuth
model User {
  id String @id @default(cuid())  // ← Essential
  // ...
}

// Use PascalCase for all relation names
model Booking {
  Activity Activity @relation(fields: [activityId], references: [id])
  User     User     @relation(fields: [userId], references: [id])
  // NOT: activity, user (lowercase)
}

// Configure connection pooling for Supabase
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_DATABASE_URL")  // ← Required for Supabase
}
```

### Seed Script Performance

**Use `createMany` for bulk inserts:**

```typescript
// ❌ SLOW (times out)
for (const item of items) {
  await prisma.model.create({ data: item })
}

// ✅ FAST
await prisma.model.createMany({
  data: items,
  skipDuplicates: true,
})
```

**Created:**
- 8 activities
- 630 availability slots (30 days × 8 activities × 2-3 time slots)
- 10 categories

---

## Authentication Setup

### NextAuth v5 Configuration

**File:** `src/auth.ts`

```typescript
import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import Google from "next-auth/providers/google"
import { prisma } from "@/lib/prisma"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id
        session.user.role = user.role
      }
      return session
    },
  },
})
```

### Type Definitions

**File:** `src/types/next-auth.d.ts`

```typescript
import { UserRole } from "@prisma/client"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: UserRole
    } & DefaultSession["user"]
  }

  interface User {
    role: UserRole
  }
}
```

---

## Common Errors & Fixes

### Error: "Property 'X' does not exist"

**Cause:** Lowercase Prisma relation name

**Fix:** Use PascalCase matching model name

### Error: "PostgreSQL connection closed"

**Cause:** Missing pgBouncer configuration

**Fix:** Add `?pgbouncer=true` to DATABASE_URL

### Error: "Build failed" (ESLint)

**Cause:** Unescaped apostrophes in JSX

**Fix:** Replace `'` with `&apos;`

### Error: "Unused @ts-expect-error"

**Cause:** Fixed TypeScript error but directive remains

**Fix:** Remove the `// @ts-expect-error` comment

### Error: "ENOENT: no such file or directory"

**Cause:** Next.js build cache corruption

**Fix:** Delete `.next` folder and rebuild
```bash
rm -rf .next
npm run build
```

### Error: "401 Unauthorized" on booking

**Cause:** User not authenticated

**Fix:** This is expected behavior - sign in required

---

## Best Practices

### 1. Iterative vs Batch Fixes

**Lesson from user feedback:**

> "can't you fix them all as you already know what the inconsistency is?"

**Before (Iterative):**
- Fix one file at a time
- Commit after each fix
- Multiple deployment attempts

**After (Batch):**
- Use `grep` to find all instances
- Fix all files in one go
- Single commit
- Single deployment

**Implementation:**
```bash
# Find all files with issue
grep -r "lowercase_relation" src/

# Use Task agent to batch fix
# OR fix manually in one session
```

### 2. Local Build Before Deploy

**Always run before pushing:**
```bash
npm run build
```

This catches:
- TypeScript errors
- ESLint warnings
- Import issues
- Type mismatches

### 3. Environment Variable Management

**Local (.env):**
- Add to `.gitignore`
- Use development values
- Never commit

**Vercel:**
- Set for all environments
- Use production values
- Update when changing locally

### 4. Database Seeding

**Use realistic UUIDs:**
```typescript
// ❌ WRONG
id: 'temp-activity-name'

// ✅ CORRECT
id: randomUUID()
```

**Include `updatedAt`:**
```typescript
create: {
  // ...
  updatedAt: new Date(),  // ← Required for Prisma
}
```

### 5. Testing Flow

1. **Local development:**
   - Test full flow locally
   - Verify database operations
   - Check authentication
   - Test payments with Stripe CLI

2. **Staging/Preview:**
   - Test on Vercel preview deployment
   - Verify environment variables
   - Check OAuth callbacks

3. **Production:**
   - Monitor logs after deployment
   - Test critical paths
   - Verify webhooks

---

## Project Structure

```
movinature/
├── prisma/
│   ├── schema.prisma          # Database schema with PascalCase relations
│   └── seed.ts                # Seed script with 8 activities + availability
├── src/
│   ├── app/
│   │   ├── about/             # About page (with &apos; escapes)
│   │   ├── activities/        # Activity listing and detail pages
│   │   ├── api/
│   │   │   ├── auth/          # NextAuth routes
│   │   │   ├── create-payment-intent/  # Stripe payment
│   │   │   └── webhooks/stripe/        # Stripe webhook handler
│   │   ├── bookings/          # User bookings
│   │   ├── favorites/         # User favorites
│   │   ├── host/              # Host dashboard
│   │   └── profile/           # User profile
│   ├── auth.ts                # NextAuth configuration
│   ├── lib/
│   │   ├── prisma.ts          # Prisma client singleton
│   │   └── stripe.ts          # Stripe client (API version 2025-09-30.clover)
│   └── types/
│       └── next-auth.d.ts     # NextAuth type extensions
├── .env                       # Local environment variables (gitignored)
└── .env.example               # Template for environment variables
```

---

## Timeline Summary

**Total Time:** ~4 hours of debugging and deployment

**Major Milestones:**
1. ✅ Fixed Stripe CLI authentication
2. ✅ Resolved TypeScript Prisma relation errors (batch fix after user feedback)
3. ✅ Fixed Supabase connection pooler configuration
4. ✅ Added default IDs to Prisma models
5. ✅ Created comprehensive seed script
6. ✅ Fixed ESLint errors in About page
7. ✅ Created About page
8. ❌ Google OAuth production (still blocked - requires manual resolution)

**Deployment Attempts:** 4
- Attempt 1: Secrets exposed (blocked by GitHub)
- Attempt 2: Prisma relation errors
- Attempt 3: ESLint errors
- Attempt 4: Successful (OAuth still blocked)

---

## Outstanding Issues

### 1. Google OAuth Production Access

**Status:** Blocked
**Impact:** Users cannot sign in on production
**Workaround:** Works on localhost:3000
**Next Steps:**
- Verify OAuth consent screen configuration
- Add authorized domain `vercel.app`
- Consider submitting for Google verification
- OR keep in testing mode with specific test users

### 2. Production Testing

**Status:** Incomplete
**Blocked By:** OAuth issue
**Remaining Tests:**
- [ ] Full booking flow
- [ ] Stripe payment in production
- [ ] Webhook handling
- [ ] Email notifications (Resend)
- [ ] Image uploads (UploadThing)

---

## Key Takeaways

1. **Run local builds** before deploying to catch TypeScript/ESLint errors
2. **Batch fix issues** when you know the pattern (don't iterate)
3. **Supabase requires** pgBouncer configuration for connection pooling
4. **Prisma relations** must be PascalCase matching model names
5. **NextAuth models** need `@default(cuid())` for ID fields
6. **Google OAuth** in production is complex - plan for verification time
7. **Never commit secrets** even in documentation files
8. **Escape apostrophes** in JSX with `&apos;`
9. **Use `createMany`** for bulk database operations
10. **Test locally first** - OAuth works on localhost even if production fails

---

## Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [NextAuth v5 Docs](https://authjs.dev)
- [Supabase Connection Pooling](https://supabase.com/docs/guides/database/connecting-to-postgres#connection-pooler)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)
- [Google OAuth Setup](https://console.cloud.google.com)
- [Vercel Deployment](https://vercel.com/docs)

---

**Document Version:** 1.0
**Last Updated:** October 31, 2025
**Author:** Claude (Sonnet 4.5) + André Duarte
