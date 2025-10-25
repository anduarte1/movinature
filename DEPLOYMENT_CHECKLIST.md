# Deployment Checklist

Use this checklist to ensure a smooth deployment to production.

---

## Before Deployment

### Code Preparation
- [ ] All features tested locally
- [ ] No console errors in browser
- [ ] All TypeScript errors resolved
- [ ] Database migrations applied
- [ ] Seed data loaded (if needed)
- [ ] All changes committed to git
- [ ] Code pushed to GitHub

### Configuration Files
- [ ] `.gitignore` includes `.env` files
- [ ] `package.json` has all dependencies
- [ ] `next.config.ts` configured correctly
- [ ] `prisma/schema.prisma` is up to date

### Environment Variables
- [ ] Prepare production environment variables (see `.env.production.example`)
- [ ] Get Stripe LIVE API keys
- [ ] Create Google Analytics property
- [ ] Verify all API keys are valid

---

## Deployment Steps

### 1. Vercel Setup
- [ ] Create Vercel account (if needed)
- [ ] Connect GitHub repository
- [ ] Import project to Vercel
- [ ] Configure build settings (auto-detected for Next.js)

### 2. Add Environment Variables
Copy from `.env.production.example` and add to Vercel:

- [ ] `DATABASE_URL`
- [ ] `NEXTAUTH_URL` (use Vercel URL)
- [ ] `NEXTAUTH_SECRET`
- [ ] `GOOGLE_CLIENT_ID`
- [ ] `GOOGLE_CLIENT_SECRET`
- [ ] `STRIPE_SECRET_KEY` (⚠️ use LIVE key)
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (⚠️ use LIVE key)
- [ ] `STRIPE_WEBHOOK_SECRET` (create production webhook first)
- [ ] `UPLOADTHING_TOKEN`
- [ ] `RESEND_API_KEY`
- [ ] `RESEND_FROM_EMAIL`
- [ ] `NEXT_PUBLIC_GA_MEASUREMENT_ID`
- [ ] `NEXT_PUBLIC_BASE_URL` (use Vercel URL)

### 3. Deploy
- [ ] Click "Deploy" in Vercel
- [ ] Wait for build to complete
- [ ] Verify deployment succeeded

---

## Post-Deployment Configuration

### Google OAuth
- [ ] Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
- [ ] Add production URL to authorized JavaScript origins
- [ ] Add callback URL: `https://your-domain.vercel.app/api/auth/callback/google`
- [ ] Save changes

### Stripe Webhooks
- [ ] Switch Stripe dashboard to **Live mode** (top right toggle)
- [ ] Go to [Webhooks](https://dashboard.stripe.com/webhooks)
- [ ] Click "Add endpoint"
- [ ] URL: `https://your-domain.vercel.app/api/webhooks/stripe`
- [ ] Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`
- [ ] Copy signing secret
- [ ] Update `STRIPE_WEBHOOK_SECRET` in Vercel
- [ ] Redeploy to apply new secret

### Google Analytics
- [ ] Create GA4 property
- [ ] Copy Measurement ID
- [ ] Update `NEXT_PUBLIC_GA_MEASUREMENT_ID` in Vercel
- [ ] Redeploy

### Optional: Custom Email Domain
- [ ] Add domain to [Resend](https://resend.com/domains)
- [ ] Configure DNS records
- [ ] Update `RESEND_FROM_EMAIL` to use custom domain
- [ ] Redeploy

---

## Testing in Production

### Basic Functionality
- [ ] Homepage loads without errors
- [ ] All images load correctly
- [ ] Navigation works
- [ ] Search and filters work
- [ ] Activity detail pages load

### Authentication
- [ ] Can sign in with Google
- [ ] Profile page loads
- [ ] Session persists after page refresh
- [ ] Can sign out

### Booking Flow
- [ ] Can select date and participants
- [ ] Payment form appears
- [ ] Can complete test payment (use Stripe test card: 4242 4242 4242 4242)
- [ ] Booking appears in user's bookings
- [ ] Confirmation email received

### Webhooks
- [ ] Go to Stripe Dashboard → Webhooks
- [ ] Trigger test event: `payment_intent.succeeded`
- [ ] Check webhook logs show 200 response
- [ ] Verify booking status updated to CONFIRMED

### Performance
- [ ] Run Lighthouse audit (target: >90 score)
- [ ] Check mobile responsiveness
- [ ] Test page load speed

---

## Monitoring Setup

### Vercel Dashboard
- [ ] Enable deployment notifications (Slack/email)
- [ ] Set up error alerts
- [ ] Monitor function execution times

### Stripe Dashboard
- [ ] Monitor live payments
- [ ] Check webhook delivery status
- [ ] Set up payment notifications

### Database
- [ ] Monitor Supabase database performance
- [ ] Check connection pool usage
- [ ] Set up automatic backups

### Optional: Error Tracking
- [ ] Set up Sentry or similar service
- [ ] Configure error notifications

---

## Launch Day

### Pre-Launch
- [ ] Final test of all critical flows
- [ ] Check all environment variables
- [ ] Verify custom domain (if applicable)
- [ ] Prepare rollback plan

### Launch
- [ ] Announce on social media
- [ ] Monitor error logs closely
- [ ] Watch database performance
- [ ] Check webhook delivery

### Post-Launch (First 24 Hours)
- [ ] Monitor application logs
- [ ] Check for any error spikes
- [ ] Verify payments are processing
- [ ] Ensure emails are sending
- [ ] Monitor user feedback

---

## Rollback Plan

If critical issues occur:

1. **Instant rollback:**
   - Go to Vercel dashboard
   - Deployments → Previous deployment
   - Click "Promote to Production"

2. **Database issues:**
   - Restore from Supabase backup
   - Or rollback migrations

3. **Environment variable issues:**
   - Update in Vercel dashboard
   - Redeploy

---

## Common Issues & Solutions

### Build Fails
- Check build logs in Vercel
- Verify all dependencies in package.json
- Fix TypeScript errors

### "Invalid Client" Error (Google OAuth)
- Verify authorized redirect URIs in Google Console
- Ensure URLs match exactly (including https://)

### Stripe Webhook Not Working
- Verify webhook URL is correct
- Check signing secret matches
- Ensure endpoint returns 200

### Database Connection Error
- Verify DATABASE_URL is correct
- Check Supabase allows Vercel connections
- Use connection pooler URL

### Email Not Sending
- Verify RESEND_API_KEY is correct
- Check from email is authorized
- View logs in Resend dashboard

---

## Cost Monitoring

### Initial Month (Free Tier)
- Vercel: Free
- Supabase: Free (up to limits)
- UploadThing: Free (2GB)
- Resend: Free (100 emails/day)
- Stripe: 2.9% + 30¢ per transaction

### When to Upgrade
- Vercel: Upgrade when you need more than 100GB bandwidth
- Supabase: Upgrade when database exceeds 500MB
- UploadThing: Upgrade when storage exceeds 2GB
- Resend: Upgrade when sending >100 emails/day

---

## Success Criteria

Deployment is successful when:

- [ ] All pages load without errors
- [ ] Users can sign in with Google
- [ ] Users can book activities
- [ ] Payments process successfully
- [ ] Webhooks update booking status
- [ ] Confirmation emails are sent
- [ ] Lighthouse score > 90
- [ ] No console errors
- [ ] Mobile experience is smooth

---

**Estimated Time to Deploy:** 30-60 minutes

**Last Updated:** 2025-10-25
