# movinature 🌲

An Airbnb-like platform for booking outdoor activities and physical experiences for kids and families.

## ✨ Features

- 🏡 **Browse Activities** - Discover nature activities, outdoor adventures, and physical activities
- 📅 **Easy Booking** - Simple calendar-based booking system
- 👨‍👩‍👧 **Family Friendly** - Activities filtered by age range and group size
- ⭐ **Reviews & Ratings** - Community-driven ratings and reviews
- 🎯 **Host Dashboard** - Create and manage your own activities
- 💰 **Secure Payments** - (Integration ready for Stripe)
- 👤 **User Profiles** - Track bookings, favorites, and reviews

## 🛠️ Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth v5
- **Form Validation**: Zod
- **Icons**: Lucide React

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database
- Google OAuth credentials (optional, for authentication)

### Installation

1. Clone the repository and install dependencies:

```bash
npm install
```

2. Set up your environment variables. Copy the `.env` file and update it:

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/movinature"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here" # Generate with: openssl rand -base64 32

# Google OAuth (get from Google Cloud Console)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

3. Set up the database:

```bash
# Generate Prisma Client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# (Optional) Seed the database with categories
npx prisma db seed
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
movinature/
├── src/
│   ├── app/                    # Next.js app router pages
│   │   ├── activities/         # Activity browsing and details
│   │   ├── api/               # API routes
│   │   ├── auth/              # Authentication pages
│   │   ├── bookings/          # User bookings
│   │   ├── favorites/         # Saved activities
│   │   ├── host/              # Host dashboard
│   │   └── profile/           # User profile
│   ├── components/            # React components
│   │   └── ui/               # Shadcn UI components
│   ├── lib/                   # Utilities and helpers
│   └── types/                 # TypeScript type definitions
├── prisma/
│   └── schema.prisma          # Database schema
└── public/                    # Static assets
```

## 🗄️ Database Models

- **User** - User accounts (guests and hosts)
- **Activity** - Activity listings with details
- **Category** - Activity categories
- **Booking** - Activity bookings
- **Review** - User reviews and ratings
- **Favorite** - Saved activities
- **Availability** - Activity availability slots

## 🎨 Key Features Detail

### For Guests
- Browse activities by category, location, age range
- View detailed activity information with photos
- Book activities with calendar selection
- Save favorite activities
- Leave reviews and ratings
- Track booking history

### For Hosts
- Create and manage activities
- Set pricing and availability
- View booking requests
- Track revenue and performance
- Respond to reviews

## 🔐 Authentication

The app uses NextAuth v5 with:
- Google OAuth provider
- Email verification
- Session management
- Protected routes via middleware

## 🚧 Future Enhancements

- [ ] Payment integration (Stripe)
- [ ] Real-time messaging between hosts and guests
- [ ] Advanced search and filters
- [ ] Map view for activities
- [ ] Image upload functionality
- [ ] Email notifications
- [ ] Mobile app (React Native)
- [ ] Multi-language support

## 📝 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npx prisma studio    # Open Prisma Studio (database GUI)
npx prisma migrate dev # Run database migrations
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org)
- UI components from [Shadcn/ui](https://ui.shadcn.com)
- Icons from [Lucide](https://lucide.dev)

---

Made with ❤️ for families who love the outdoors
