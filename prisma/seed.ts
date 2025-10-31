import { PrismaClient } from '@prisma/client'
import { randomUUID } from 'crypto'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create demo host user
  const demoHostId = randomUUID()
  const demoHost = await prisma.user.upsert({
    where: { email: 'demo-host@movinature.com' },
    update: {},
    create: {
      id: demoHostId,
      email: 'demo-host@movinature.com',
      name: 'Demo Host',
      role: 'HOST',
      bio: 'Passionate outdoor educator and nature enthusiast',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DemoHost',
      updatedAt: new Date(),
    },
  })

  console.log(`✅ Created demo host user`)

  // Seed categories
  const categories = [
    { name: 'Hiking', slug: 'hiking', icon: '🥾', id: randomUUID() },
    { name: 'Camping', slug: 'camping', icon: '⛺', id: randomUUID() },
    { name: 'Water Sports', slug: 'water-sports', icon: '🏄', id: randomUUID() },
    { name: 'Climbing', slug: 'climbing', icon: '🧗', id: randomUUID() },
    { name: 'Cycling', slug: 'cycling', icon: '🚴', id: randomUUID() },
    { name: 'Wildlife Watching', slug: 'wildlife', icon: '🦅', id: randomUUID() },
    { name: 'Nature Walks', slug: 'nature-walks', icon: '🌳', id: randomUUID() },
    { name: 'Adventure Sports', slug: 'adventure', icon: '🪂', id: randomUUID() },
    { name: 'Team Sports', slug: 'team-sports', icon: '⚽', id: randomUUID() },
    { name: 'Yoga & Wellness', slug: 'yoga-wellness', icon: '🧘', id: randomUUID() },
  ]

  const createdCategories: Record<string, string> = {}

  for (const category of categories) {
    const created = await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    })
    createdCategories[category.slug] = created.id
  }

  console.log(`✅ Seeded ${categories.length} categories`)

  // Sample activities
  const activities = [
    {
      id: randomUUID(),
      title: 'Sunset Beach Walk & Tide Pools',
      description: 'Explore the beautiful coastline during golden hour and discover amazing marine life in tide pools. Perfect for families with young children who love the ocean!',
      location: 'San Diego, CA',
      address: '123 Ocean Blvd, San Diego, CA 92101',
      latitude: 32.7157,
      longitude: -117.1611,
      price: 28,
      duration: 90,
      minAge: 5,
      maxAge: 99,
      capacity: 18,
      images: [
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
        'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
      ],
      featured: true,
      active: true,
      hostId: demoHost.id,
      categoryId: createdCategories['nature-walks'],
      updatedAt: new Date(),
    },
    {
      id: randomUUID(),
      title: 'Nature Scavenger Hunt',
      description: 'An interactive adventure where kids search for natural treasures! Learn about local flora and fauna while having fun.',
      location: 'Portland, OR',
      address: '456 Forest Ave, Portland, OR 97201',
      latitude: 45.5152,
      longitude: -122.6784,
      price: 30,
      duration: 120,
      minAge: 6,
      maxAge: 12,
      capacity: 20,
      images: [
        'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800',
        'https://images.unsplash.com/photo-1511497584788-876760111969?w=800',
      ],
      featured: true,
      active: true,
      hostId: demoHost.id,
      categoryId: createdCategories['nature-walks'],
      updatedAt: new Date(),
    },
    {
      id: randomUUID(),
      title: 'Family Mountain Hike Adventure',
      description: 'Moderate hiking trail with stunning views. Learn trail safety, wildlife spotting, and enjoy nature photography opportunities.',
      location: 'Portland, OR',
      address: '789 Mountain Trail, Portland, OR 97202',
      latitude: 45.5231,
      longitude: -122.6765,
      price: 45,
      duration: 180,
      minAge: 8,
      maxAge: 99,
      capacity: 15,
      images: [
        'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800',
        'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800',
      ],
      featured: true,
      active: true,
      hostId: demoHost.id,
      categoryId: createdCategories['hiking'],
      updatedAt: new Date(),
    },
    {
      id: randomUUID(),
      title: 'Rock Climbing Basics for Youth',
      description: 'Introduction to rock climbing with certified instructors. Learn proper technique, safety, and build confidence on the wall!',
      location: 'Denver, CO',
      address: '321 Climb St, Denver, CO 80201',
      latitude: 39.7392,
      longitude: -104.9903,
      price: 40,
      duration: 90,
      minAge: 10,
      maxAge: 16,
      capacity: 12,
      images: [
        'https://images.unsplash.com/photo-1522163182402-834f871fd851?w=800',
        'https://images.unsplash.com/photo-1564415315949-7a0c4c73aab4?w=800',
      ],
      featured: true,
      active: true,
      hostId: demoHost.id,
      categoryId: createdCategories['climbing'],
      updatedAt: new Date(),
    },
    {
      id: randomUUID(),
      title: 'Kayaking for Kids',
      description: 'Learn to paddle in calm waters with experienced guides. Life jackets provided, no experience necessary!',
      location: 'San Francisco, CA',
      address: '555 Bay Rd, San Francisco, CA 94102',
      latitude: 37.7749,
      longitude: -122.4194,
      price: 55,
      duration: 120,
      minAge: 8,
      maxAge: 14,
      capacity: 10,
      images: [
        'https://images.unsplash.com/photo-1474524955719-b9f87c50ce47?w=800',
        'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800',
      ],
      featured: true,
      active: true,
      hostId: demoHost.id,
      categoryId: createdCategories['water-sports'],
      updatedAt: new Date(),
    },
    {
      id: randomUUID(),
      title: 'Weekend Family Camping Experience',
      description: 'Full weekend camping adventure! Learn tent setup, campfire cooking, stargazing, and outdoor survival skills. Family bonding at its best!',
      location: 'Seattle, WA',
      address: '888 Camp Rd, Seattle, WA 98101',
      latitude: 47.6062,
      longitude: -122.3321,
      price: 120,
      duration: 1440, // 24 hours
      minAge: 5,
      maxAge: 99,
      capacity: 8,
      images: [
        'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800',
        'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800',
      ],
      featured: true,
      active: true,
      hostId: demoHost.id,
      categoryId: createdCategories['camping'],
      updatedAt: new Date(),
    },
    {
      id: randomUUID(),
      title: 'Bird Watching Discovery Walk',
      description: 'Explore local bird species with binoculars and field guides. Perfect introduction to ornithology for curious minds!',
      location: 'Boston, MA',
      address: '222 Park Way, Boston, MA 02101',
      latitude: 42.3601,
      longitude: -71.0589,
      price: 25,
      duration: 90,
      minAge: 7,
      maxAge: 99,
      capacity: 15,
      images: [
        'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=800',
        'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800',
      ],
      featured: false,
      active: true,
      hostId: demoHost.id,
      categoryId: createdCategories['wildlife'],
      updatedAt: new Date(),
    },
    {
      id: randomUUID(),
      title: 'Family Bike Trail Adventure',
      description: 'Scenic bike trail through parks and nature paths. Bikes and helmets included. Great for active families!',
      location: 'Austin, TX',
      address: '777 Trail Rd, Austin, TX 78701',
      latitude: 30.2672,
      longitude: -97.7431,
      price: 35,
      duration: 150,
      minAge: 9,
      maxAge: 99,
      capacity: 20,
      images: [
        'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800',
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
      ],
      featured: false,
      active: true,
      hostId: demoHost.id,
      categoryId: createdCategories['cycling'],
      updatedAt: new Date(),
    },
  ]

  for (const activity of activities) {
    await prisma.activity.upsert({
      where: { id: activity.id },
      update: {},
      create: activity,
    })
  }

  console.log(`✅ Seeded ${activities.length} activities`)
  console.log('\n🎉 Database seeding completed successfully!')
  console.log(`\nDemo credentials:`)
  console.log(`Email: demo-host@movinature.com`)
  console.log(`Note: Use Google OAuth to sign in with any account\n`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
