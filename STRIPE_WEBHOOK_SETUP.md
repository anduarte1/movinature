# Stripe Webhook Setup Guide

## Current Status
✅ Webhook endpoint exists: `/api/webhooks/stripe`
✅ Handles: `payment_intent.succeeded` and `payment_intent.payment_failed`
⚠️ Booking update logic is commented out (TODOs in code)
❌ Missing: `STRIPE_WEBHOOK_SECRET` in `.env`

## Local Development Setup

### 1. Install Stripe CLI
```bash
# macOS
brew install stripe/stripe-cli/stripe

# Or download from: https://stripe.com/docs/stripe-cli
```

### 2. Login to Stripe CLI
```bash
stripe login
```
This will open your browser to authenticate with your Stripe account.

### 3. Forward Webhooks to Local Server
```bash
# Make sure your dev server is running on localhost:3000
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

### 4. Copy the Webhook Secret
The CLI will display a webhook signing secret like:
```
> Ready! Your webhook signing secret is whsec_xxxxxxxxxxxxx
```

Add this to your `.env` file:
```env
STRIPE_WEBHOOK_SECRET="whsec_xxxxxxxxxxxxx"
```

### 5. Test the Webhook
In another terminal, trigger a test event:
```bash
stripe trigger payment_intent.succeeded
```

Check your dev server logs to see the webhook being processed.

## Production Setup

### 1. Create a Webhook in Stripe Dashboard

1. Go to: https://dashboard.stripe.com/webhooks
2. Click **"Add endpoint"**
3. Enter your webhook URL:
   ```
   https://yourdomain.com/api/webhooks/stripe
   ```
4. Select events to listen for:
   - ✅ `payment_intent.succeeded`
   - ✅ `payment_intent.payment_failed`
5. Click **"Add endpoint"**

### 2. Get the Webhook Signing Secret

1. Click on your newly created webhook
2. Click **"Reveal"** under **"Signing secret"**
3. Copy the secret (starts with `whsec_`)
4. Add to your **production** environment variables:
   ```env
   STRIPE_WEBHOOK_SECRET="whsec_production_secret_here"
   ```

### 3. Update Environment Variables

For your hosting platform (Vercel, Netlify, etc.), add:
- `STRIPE_WEBHOOK_SECRET` = your production webhook secret
- `STRIPE_SECRET_KEY` = your **live** secret key (starts with `sk_live_`)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` = your **live** publishable key (starts with `pk_live_`)

⚠️ **Important:** Currently using **test** keys. Switch to **live** keys for production!

## Code Improvements Needed

The webhook currently logs events but doesn't update bookings. You need to:

### 1. Add `paymentIntentId` to Booking Model

Edit `prisma/schema.prisma`:
```prisma
model Booking {
  id              String        @id
  activityId      String
  userId          String
  date            DateTime
  startTime       String
  endTime         String
  participants    Int
  totalPrice      Float
  status          BookingStatus @default(PENDING)
  paymentIntentId String?       // Add this line
  createdAt       DateTime      @default(now())
  updatedAt       DateTime
  Activity        Activity      @relation(fields: [activityId], references: [id], onDelete: Cascade)
  User            User          @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

### 2. Run Migration
```bash
npx prisma migrate dev --name add_payment_intent_id
```

### 3. Uncomment Webhook Logic

In `src/app/api/webhooks/stripe/route.ts`, uncomment the booking update code (lines 35-46 and 56-67).

### 4. Update Booking Creation

Make sure when creating a booking, you save the `paymentIntentId` from Stripe.

## Testing Checklist

- [ ] Webhook endpoint responds with 200 OK
- [ ] Signature verification works
- [ ] `payment_intent.succeeded` updates booking to CONFIRMED
- [ ] `payment_intent.payment_failed` updates booking to CANCELLED
- [ ] Email notifications are sent after successful payment
- [ ] Webhook logs don't expose sensitive data

## Troubleshooting

### Webhook Returns 401/403
- Check that `STRIPE_WEBHOOK_SECRET` is set correctly
- Verify the secret matches the one from Stripe dashboard

### Events Not Received
- Confirm webhook URL is publicly accessible (for production)
- Check firewall/security settings
- Verify Stripe webhook endpoint status in dashboard

### Payment Intent ID Not Found
- Ensure booking was created with `paymentIntentId`
- Check that the ID matches between booking and webhook event

## Security Notes

1. **Always verify webhook signatures** - Already implemented ✅
2. **Use HTTPS in production** - Required for webhooks
3. **Keep webhook secrets secure** - Never commit to git
4. **Set up proper error logging** - Monitor webhook failures
5. **Implement idempotency** - Webhooks can be sent multiple times

## Next Steps

1. ✅ Install Stripe CLI locally
2. ✅ Test webhook with `stripe listen`
3. ✅ Add `paymentIntentId` to schema
4. ✅ Uncomment webhook update logic
5. ✅ Test end-to-end booking with payment
6. ✅ Set up production webhook in Stripe dashboard
7. ✅ Add production webhook secret to environment variables
