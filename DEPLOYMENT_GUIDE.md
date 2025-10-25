# Deployment Guide - Vercel

Complete step-by-step guide to deploy movinature to production on Vercel.

---

## Pre-Deployment Checklist

### ✅ Database
- [x] Supabase database configured
- [x] Database schema migrated
- [x] Seed data loaded
- [x] Connection pooler enabled (for IPv4 compatibility)

### ✅ Authentication
- [ ] Google OAuth configured for production domain
- [ ] NEXTAUTH_SECRET generated
- [ ] NEXTAUTH_URL updated for production

### ✅ Payment Processing
- [ ] Stripe webhook endpoint created for production
- [ ] Stripe production API keys obtained
- [ ] Webhook secret configured

### ✅ Email & Notifications
- [x] Resend API key configured
- [ ] Production email domain verified (optional)

### ✅ File Uploads
- [x] UploadThing configured

### ✅ Analytics
- [ ] Google Analytics ID added

---

## Step 1: Prepare Your Code

### 1.1 Commit All Changes

```bash
# Add all files
git add .

# Commit
git commit -m "chore: prepare for deployment - webhook integration and bug fixes"

# Push to GitHub
git push origin main
```

### 1.2 Verify .gitignore

Ensure these are in `.gitignore`:
```
.env
.env.local
.env.production.local
node_modules/
.next/
```

---

## Step 2: Deploy to Vercel

### 2.1 Sign Up / Log In to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub (recommended)
3. Authorize Vercel to access your repositories

### 2.2 Import Project
1. Click "Add New..." → "Project"
2. Import your `movinature` repository
3. Vercel will auto-detect it's a Next.js project

### 2.3 Configure Build Settings
- **Framework Preset:** Next.js (auto-detected)
- **Root Directory:** `./`
- **Build Command:** `npm run build` (default)
- **Output Directory:** `.next` (default)
- **Install Command:** `npm install` (default)

---

## Step 3: Environment Variables

Add these in Vercel dashboard under "Settings" → "Environment Variables":

### Database
```
DATABASE_URL=postgresql://postgres.vnealghwegadhvkaehsp:bisc8fino94032700@aws-1-sa-east-1.pooler.supabase.com:5432/postgres
```

### Authentication
```
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=nf97wmXxJgq2j1VxBmbN7iwEKj22RMaXW1IjTJs33v8=
```

### Google OAuth
```
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### Stripe (⚠️ IMPORTANT: Use LIVE keys for production)
```
STRIPE_SECRET_KEY=sk_live_XXXXX
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_XXXXX
STRIPE_WEBHOOK_SECRET=whsec_XXXXX
```

### UploadThing
```
UPLOADTHING_TOKEN=eyJhcGlLZXkiOiJza19saXZlXzAzYTU4MzRiYWQxMTZhN2IwODk0MjdiMGVmYmQ0NGM4ZTFiZDRiOTllZjI5NTIxNjlhZjQ0YTYwZTNiYWVmM2EiLCJhcHBJZCI6ImV5cWJmNG95dzgiLCJyZWdpb25zIjpbInNlYTEiXX0=
```

### Resend
```
RESEND_API_KEY=re_Nkxe3G6p_FCNcYHtksVR1HA7NWB4kaExM
RESEND_FROM_EMAIL=onboarding@resend.dev
```

### Analytics
```
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### Base URL
```
NEXT_PUBLIC_BASE_URL=https://your-domain.vercel.app
```

---

## Step 4: Post-Deployment Configuration

### 4.1 Update Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Select your OAuth 2.0 Client ID
3. Add Authorized JavaScript origins:
   ```
   https://your-domain.vercel.app
   ```
4. Add Authorized redirect URIs:
   ```
   https://your-domain.vercel.app/api/auth/callback/google
   ```

### 4.2 Configure Stripe Webhook

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/webhooks)
2. Click "Add endpoint"
3. Enter webhook URL:
   ```
   https://your-domain.vercel.app/api/webhooks/stripe
   ```
4. Select events to listen for:
   - ✅ `payment_intent.succeeded`
   - ✅ `payment_intent.payment_failed`
5. Copy the webhook signing secret
6. Update `STRIPE_WEBHOOK_SECRET` in Vercel environment variables
7. Redeploy to apply the new secret

### 4.3 Switch to Stripe Live Mode

⚠️ **CRITICAL:** Your app is currently using Stripe TEST keys.

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
2. Toggle to "Live mode" (top right)
3. Get your live API keys:
   - Secret key: `sk_live_...`
   - Publishable key: `pk_live_...`
4. Update environment variables in Vercel
5. Redeploy

### 4.4 Verify Resend Email Domain (Optional but Recommended)

Currently using `onboarding@resend.dev`. For production:

1. Go to [Resend Dashboard](https://resend.com/domains)
2. Add your custom domain
3. Add DNS records as instructed
4. Update `RESEND_FROM_EMAIL` to use your domain
5. Redeploy

### 4.5 Add Google Analytics

1. Create a GA4 property at [Google Analytics](https://analytics.google.com)
2. Get your Measurement ID (format: `G-XXXXXXXXXX`)
3. Update `NEXT_PUBLIC_GA_MEASUREMENT_ID` in Vercel
4. Redeploy

---

## Step 5: Database Migrations

Your database is already migrated, but for future schema changes:

```bash
# Generate migration
npx prisma migrate deploy

# Or connect to production database locally
DATABASE_URL="your-production-url" npx prisma migrate deploy
```

---

## Step 6: Custom Domain (Optional)

### 6.1 Add Custom Domain in Vercel
1. Go to Project Settings → Domains
2. Enter your domain (e.g., `movinature.com`)
3. Follow DNS configuration instructions

### 6.2 Update Environment Variables
Update these to use your custom domain:
- `NEXTAUTH_URL`
- `NEXT_PUBLIC_BASE_URL`

### 6.3 Update OAuth & Webhook URLs
Update Google OAuth and Stripe webhook URLs to use your custom domain.

---

## Step 7: Verification Checklist

After deployment, test these features:

### Frontend
- [ ] Homepage loads correctly
- [ ] Activity search and filters work
- [ ] Activity detail pages load
- [ ] Images load from UploadThing
- [ ] Google Analytics tracking works

### Authentication
- [ ] Google sign-in works
- [ ] User profile loads
- [ ] Session persists across page reloads

### Booking Flow
- [ ] User can select dates and participants
- [ ] Payment intent is created
- [ ] Booking is saved to database
- [ ] Confirmation email is sent

### Webhooks
- [ ] Payment success updates booking to CONFIRMED
- [ ] Payment failure updates booking to CANCELLED
- [ ] Check Stripe webhook logs for 200 responses

### Performance
- [ ] Lighthouse score > 90
- [ ] First contentful paint < 2s
- [ ] Time to interactive < 3s

---

## Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Verify all dependencies are in `package.json`
- Ensure TypeScript errors are resolved

### Environment Variables Not Working
- Ensure no trailing spaces in values
- Redeploy after adding/updating variables
- Check variable names match exactly (case-sensitive)

### Database Connection Issues
- Verify `DATABASE_URL` is correct
- Ensure Supabase allows connections from Vercel IPs
- Use connection pooler URL (not direct connection)

### OAuth Redirect Errors
- Verify authorized redirect URIs in Google Console
- Ensure `NEXTAUTH_URL` matches your production URL exactly
- Check for typos in callback URL

### Webhook Not Receiving Events
- Verify webhook endpoint URL in Stripe dashboard
- Check webhook signing secret matches
- View webhook logs in Stripe dashboard
- Ensure endpoint returns 200 status

### Email Not Sending
- Verify `RESEND_API_KEY` is correct
- Check Resend dashboard for error logs
- Ensure from email is authorized

---

## Monitoring & Maintenance

### Vercel Dashboard
- Monitor deployments
- View function logs
- Check bandwidth usage
- Set up deployment notifications

### Supabase Dashboard
- Monitor database performance
- Check connection pooling stats
- Set up database backups

### Stripe Dashboard
- Monitor payment events
- Check webhook delivery status
- Review failed payments

### Error Tracking (Recommended)
Consider adding Sentry for error tracking:
```bash
npm install @sentry/nextjs
```

---

## Rollback Strategy

If something goes wrong:

1. **Instant Rollback:** Vercel → Deployments → Previous deployment → Promote to Production
2. **Database Rollback:** Use Supabase backup or migration rollback
3. **DNS Rollback:** Point domain back to previous hosting

---

## Cost Estimates

### Free Tier (Getting Started)
- Vercel: Free
- Supabase: Free (500MB database, 2GB bandwidth)
- UploadThing: Free (2GB storage)
- Resend: Free (100 emails/day)
- Stripe: Pay-as-you-go (2.9% + 30¢ per transaction)

### Expected Monthly Costs at Scale
- Vercel Pro: $20/month (if needed)
- Supabase Pro: $25/month (8GB database, 250GB bandwidth)
- UploadThing: $10/month (25GB storage)
- Resend: $20/month (50k emails)
- Google Analytics: Free
- **Total: ~$75/month** (at moderate scale)

---

## Next Steps After Deployment

1. Monitor application for 24-48 hours
2. Test all critical user flows
3. Set up monitoring alerts
4. Create backup strategy
5. Document any production issues
6. Consider adding:
   - Rate limiting
   - CDN caching
   - Image optimization
   - SEO improvements

---

## Support Resources

- **Vercel Docs:** https://vercel.com/docs
- **Next.js Docs:** https://nextjs.org/docs
- **Supabase Docs:** https://supabase.com/docs
- **Stripe Docs:** https://stripe.com/docs
- **Resend Docs:** https://resend.com/docs

---

**Last Updated:** 2025-10-25
**Deployment Status:** Ready for production ✅
