# Analytics Setup Guide

## Google Analytics 4 (GA4) Setup

### 1. Create a Google Analytics Account

1. Go to [Google Analytics](https://analytics.google.com)
2. Sign in with your Google account
3. Click "Start measuring" or "Admin" (gear icon)
4. Click "Create Account"
5. Fill in your account details and click "Next"

### 2. Create a Property

1. Enter a property name (e.g., "movinature")
2. Select your timezone and currency
3. Click "Next"
4. Fill in business details
5. Click "Create"
6. Accept the Terms of Service

### 3. Set Up a Data Stream

1. Select "Web" as the platform
2. Enter your website URL (e.g., `https://movinature.com`)
3. Enter a stream name (e.g., "movinature website")
4. Click "Create stream"

### 4. Get Your Measurement ID

After creating the stream, you'll see a **Measurement ID** that looks like:
```
G-XXXXXXXXXX
```

Copy this ID!

### 5. Add to Your .env File

Add your Measurement ID to the `.env` file:

```env
NEXT_PUBLIC_GA_MEASUREMENT_ID="G-XXXXXXXXXX"
```

Replace `G-XXXXXXXXXX` with your actual Measurement ID.

### 6. Restart Your Dev Server

After adding the environment variable, restart your development server:

```bash
npm run dev
```

---

## Event Tracking

The application includes predefined tracking functions for common user actions:

### Available Tracking Functions

Import from `@/lib/analytics`:

```typescript
import {
  trackActivityView,
  trackBookingStart,
  trackBookingComplete,
  trackSearch,
  trackSignUp,
  trackSignIn,
  trackShare,
  trackFilterUsage,
} from '@/lib/analytics'
```

### Usage Examples

#### Track Activity Views
```typescript
trackActivityView(activityId, activityTitle)
```

#### Track Booking Flow
```typescript
// When user clicks "Check Availability"
trackBookingStart(activityId, activityTitle)

// When booking is completed
trackBookingComplete(activityId, activityTitle, totalAmount)
```

#### Track Search
```typescript
trackSearch(searchQuery)
```

#### Track User Authentication
```typescript
// On successful sign up
trackSignUp('google') // or 'email', 'facebook', etc.

// On successful sign in
trackSignIn('google')
```

#### Track Sharing
```typescript
trackShare('activity', activityId)
```

#### Track Filter Usage
```typescript
trackFilterUsage('category', 'hiking')
trackFilterUsage('price', '0-50')
```

### Custom Events

For custom events not covered by the predefined functions:

```typescript
import { event } from '@/lib/analytics'

event({
  action: 'custom_action',
  category: 'custom_category',
  label: 'custom_label',
  value: 100, // optional
})
```

---

## Viewing Analytics Data

1. Go to [Google Analytics](https://analytics.google.com)
2. Select your property
3. View real-time data in **Reports > Realtime**
4. View historical data in **Reports > Engagement > Events**

### Key Metrics to Monitor

- **Page views**: Which pages are most popular
- **Events**: User interactions (bookings, searches, etc.)
- **Conversions**: Set up goals for bookings completed
- **User demographics**: Age, location, interests
- **Acquisition**: How users find your site
- **Retention**: How often users return

---

## Production Deployment

### Vercel / Netlify / Other Platforms

Add the environment variable to your deployment platform:

1. Go to your project settings
2. Find "Environment Variables" section
3. Add: `NEXT_PUBLIC_GA_MEASUREMENT_ID` = `G-XXXXXXXXXX`
4. Redeploy your application

### Testing

To verify analytics is working:

1. Visit your website
2. Open Google Analytics
3. Go to **Reports > Realtime**
4. You should see your visit appear within 30 seconds

---

## Privacy & GDPR Compliance

### Cookie Consent

For EU users, you should implement a cookie consent banner. Consider using:

- [react-cookie-consent](https://www.npmjs.com/package/react-cookie-consent)
- [CookieYes](https://www.cookieyes.com/)
- [OneTrust](https://www.onetrust.com/)

### Privacy Policy

Update your privacy policy to mention:
- What data you collect
- How you use Google Analytics
- User rights regarding their data
- How to opt-out of tracking

### IP Anonymization

Google Analytics 4 anonymizes IP addresses by default, which helps with GDPR compliance.

---

## Troubleshooting

### Analytics Not Showing Data

1. **Check Measurement ID**: Ensure it's correct in `.env`
2. **Check Browser Console**: Look for errors
3. **Ad Blockers**: They may block analytics scripts
4. **Wait**: Real-time data can take 30-60 seconds to appear

### Events Not Tracking

1. **Check Function Calls**: Ensure tracking functions are being called
2. **Check Browser Console**: Look for errors
3. **Test in Incognito**: Some extensions block tracking
4. **Check GA4 DebugView**: Go to Admin > DebugView in GA4

---

## Additional Resources

- [Google Analytics 4 Documentation](https://support.google.com/analytics/answer/9304153)
- [GA4 Events Reference](https://developers.google.com/analytics/devguides/collection/ga4/events)
- [Next.js Analytics Guide](https://nextjs.org/docs/app/building-your-application/optimizing/analytics)
