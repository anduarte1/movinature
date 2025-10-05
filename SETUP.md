# movinature - Complete Setup Guide

This guide will walk you through setting up the movinature application from scratch.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.x or higher ([Download](https://nodejs.org/))
- **PostgreSQL** 14.x or higher ([Download](https://www.postgresql.org/download/))
- **Git** (optional, for version control)
- A **Google Cloud** account (for OAuth authentication)

## Step 1: Database Setup

### Option A: Local PostgreSQL

1. Install PostgreSQL on your machine
2. Create a new database:

```sql
CREATE DATABASE movinature;
```

3. Note your connection string (you'll need this for the .env file):
   ```
   postgresql://username:password@localhost:5432/movinature
   ```

### Option B: Cloud Database (Recommended for Production)

Use a managed PostgreSQL service like:
- **Vercel Postgres** (easiest for Next.js apps)
- **Supabase** (free tier available)
- **Railway** (free tier available)
- **Neon** (serverless Postgres)

## Step 2: Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select an existing one)
3. Enable the Google+ API:
   - Navigate to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it
4. Create OAuth credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Choose "Web application"
   - Add authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google` (development)
     - `https://yourdomain.com/api/auth/callback/google` (production)
   - Save and copy your Client ID and Client Secret

## Step 3: Environment Variables

1. In the project root, update the `.env` file with your credentials:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/movinature"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-a-random-secret-here"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

2. Generate a secure NEXTAUTH_SECRET:

```bash
# On macOS/Linux:
openssl rand -base64 32

# On Windows (PowerShell):
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }) -as [byte[]])
```

## Step 4: Install Dependencies

```bash
npm install
```

## Step 5: Initialize Database

1. Generate Prisma Client:

```bash
npx prisma generate
```

2. Run database migrations:

```bash
npx prisma migrate dev --name init
```

This will create all the necessary tables in your database.

3. Seed the database with initial categories:

```bash
npx prisma db seed
```

## Step 6: Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your application!

## Step 7: Create Your First User

1. Click "Sign In" in the navbar
2. Sign in with Google
3. You'll be redirected to the home page as a logged-in user

## Step 8: Become a Host

To create activities, you need to update your user role to "HOST":

1. Open Prisma Studio:

```bash
npx prisma studio
```

2. Navigate to the "User" model
3. Find your user and change the `role` field from `GUEST` to `HOST`
4. Save the changes
5. Refresh your application - you should now see the "Host Dashboard" link in the navbar

## Step 9: Create Your First Activity

1. Go to Host Dashboard
2. Click "Create Activity"
3. Fill in the activity details
4. Submit the form

Your activity is now live!

## Troubleshooting

### Database Connection Issues

- Verify your DATABASE_URL is correct
- Check that PostgreSQL is running: `psql -U username -d movinature`
- Ensure the database exists: `CREATE DATABASE movinature;`

### Authentication Issues

- Verify Google OAuth credentials are correct
- Check that redirect URIs match exactly (including http vs https)
- Ensure NEXTAUTH_SECRET is set
- Clear browser cookies and try again

### Build Errors

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Regenerate Prisma Client
npx prisma generate
```

## Development Tips

### Prisma Studio

View and edit your database visually:

```bash
npx prisma studio
```

### Database Migrations

After changing the schema:

```bash
npx prisma migrate dev --name description-of-change
```

### Reset Database

⚠️ This will delete all data:

```bash
npx prisma migrate reset
```

### Check Database Schema

```bash
npx prisma db pull  # Pull from database
npx prisma db push  # Push to database without migration
```

## Production Deployment

### Recommended: Vercel

1. Push your code to GitHub
2. Import project to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production

Don't forget to set these in your hosting platform:

- `DATABASE_URL` - Your production database URL
- `NEXTAUTH_URL` - Your production domain (e.g., https://movinature.com)
- `NEXTAUTH_SECRET` - Same secret from development (or generate a new one)
- `GOOGLE_CLIENT_ID` - Your Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Your Google OAuth client secret

### Build Command

```bash
npm run build
```

### Start Command

```bash
npm run start
```

## Next Steps

- Configure email notifications
- Add payment processing (Stripe)
- Upload activity images
- Set up analytics
- Configure domain and SSL

## Support

If you encounter issues:

1. Check the console for error messages
2. Verify all environment variables are set correctly
3. Ensure database is accessible
4. Check that all dependencies are installed

## Useful Commands

```bash
# Development
npm run dev                    # Start dev server
npm run build                  # Build for production
npm run start                  # Start production server
npm run lint                   # Run linter

# Database
npx prisma studio              # Open database GUI
npx prisma migrate dev         # Create and apply migration
npx prisma db seed             # Seed database
npx prisma generate            # Generate Prisma Client
npx prisma format              # Format schema file

# Debugging
npx next info                  # Show Next.js info
npx prisma validate            # Validate Prisma schema
```

---

Happy coding! 🌲
