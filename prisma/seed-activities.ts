import { PrismaClient } from '@prisma/client'
import { randomUUID } from 'crypto'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding activities...')

  // Get categories
  const categories = await prisma.category.findMany()
  const hiking = categories.find(c => c.slug === 'hiking')
  const camping = categories.find(c => c.slug === 'camping')
  const waterSports = categories.find(c => c.slug === 'water-sports')
  const climbing = categories.find(c => c.slug === 'climbing')
  const cycling = categories.find(c => c.slug === 'cycling')
  const natureWalks = categories.find(c => c.slug === 'nature-walks')
  const wildlife = categories.find(c => c.slug === 'wildlife')

  // Create a demo host user first
  let demoHost = await prisma.user.findFirst({
    where: { email: 'demo@movinature.com' }
  })

  if (!demoHost) {
    demoHost = await prisma.user.create({
      data: {
        id: randomUUID(),
        email: 'demo@movinature.com',
        name: 'Demo Host',
        role: 'HOST',
        updatedAt: new Date(),
      }
    })
  }

  const activities = [
    {
      title: 'Family Mountain Hike Adventure',
      description: 'Join us for an exciting family-friendly mountain hike! This moderate trail offers stunning views, perfect for kids aged 6-14. We\'ll explore local flora and fauna, take breaks for snacks, and enjoy nature together. Our experienced guides ensure safety while making it fun and educational.',
      location: 'Portland, OR',
      address: 'Trailhead Park, 1234 Mountain Rd',
      latitude: 45.5152,
      longitude: -122.6784,
      price: 45.00,
      duration: 180,
      minAge: 6,
      maxAge: 14,
      capacity: 15,
      categoryId: hiking?.id || categories[0].id,
      hostId: demoHost.id,
      images: ['https://images.unsplash.com/photo-1551632811-561732d1e306?w=800'],
      featured: true,
      active: true,
    },
    {
      title: 'Weekend Family Camping Experience',
      description: 'Spend an unforgettable weekend camping with your family! Learn essential camping skills, roast marshmallows, tell stories around the campfire, and sleep under the stars. All equipment provided. Perfect introduction to outdoor camping for families.',
      location: 'Seattle, WA',
      address: 'Forest Campground, Lake Road',
      latitude: 47.6062,
      longitude: -122.3321,
      price: 120.00,
      duration: 1440,
      minAge: 5,
      maxAge: 16,
      capacity: 8,
      categoryId: camping?.id || categories[1].id,
      hostId: demoHost.id,
      images: ['https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800'],
      featured: true,
      active: true,
    },
    {
      title: 'Kayaking for Kids',
      description: 'Introduction to kayaking in a safe, calm lake environment. Kids will learn basic paddling techniques, water safety, and have tons of fun! Life jackets and all equipment included. Great for building confidence on the water.',
      location: 'San Francisco, CA',
      address: 'Lakeside Park, Bay Area',
      latitude: 37.7749,
      longitude: -122.4194,
      price: 55.00,
      duration: 120,
      minAge: 8,
      maxAge: 15,
      capacity: 10,
      categoryId: waterSports?.id || categories[2].id,
      hostId: demoHost.id,
      images: ['https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800'],
      featured: true,
      active: true,
    },
    {
      title: 'Rock Climbing Basics for Youth',
      description: 'Indoor rock climbing session designed specifically for young climbers. Learn proper techniques, safety protocols, and challenge yourself in a fun, supportive environment. All equipment and instruction included.',
      location: 'Denver, CO',
      address: 'Adventure Climbing Gym, 567 Rock St',
      latitude: 39.7392,
      longitude: -104.9903,
      price: 40.00,
      duration: 90,
      minAge: 7,
      maxAge: 16,
      capacity: 12,
      categoryId: climbing?.id || categories[3].id,
      hostId: demoHost.id,
      images: ['https://images.unsplash.com/photo-1522163182402-834f871fd851?w=800'],
      featured: true,
      active: true,
    },
    {
      title: 'Family Bike Trail Adventure',
      description: 'Explore beautiful bike trails perfect for families! This guided tour takes you through scenic routes with plenty of stops for photos and snacks. Bikes and helmets provided for all ages. A fun way to stay active together!',
      location: 'Austin, TX',
      address: 'Green Trail Start, Park Blvd',
      latitude: 30.2672,
      longitude: -97.7431,
      price: 35.00,
      duration: 150,
      minAge: 6,
      maxAge: 14,
      capacity: 20,
      categoryId: cycling?.id || categories[4].id,
      hostId: demoHost.id,
      images: ['https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=800'],
      featured: false,
      active: true,
    },
    {
      title: 'Bird Watching Discovery Walk',
      description: 'Discover local bird species on this gentle nature walk. Kids will learn to identify birds, use binoculars, and understand bird behaviors. A peaceful, educational experience in nature.',
      location: 'Boston, MA',
      address: 'Nature Reserve, Meadow Lane',
      latitude: 42.3601,
      longitude: -71.0589,
      price: 25.00,
      duration: 90,
      minAge: 5,
      maxAge: 12,
      capacity: 15,
      categoryId: wildlife?.id || categories[5].id,
      hostId: demoHost.id,
      images: ['https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=800'],
      featured: false,
      active: true,
    },
    {
      title: 'Nature Scavenger Hunt',
      description: 'An exciting scavenger hunt through the forest! Kids will search for natural treasures, learn about plants and animals, and work together as a team. Educational and super fun!',
      location: 'Portland, OR',
      address: 'Forest Park Entrance',
      latitude: 45.5428,
      longitude: -122.7413,
      price: 30.00,
      duration: 120,
      minAge: 5,
      maxAge: 11,
      capacity: 20,
      categoryId: natureWalks?.id || categories[6].id,
      hostId: demoHost.id,
      images: ['https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=800'],
      featured: true,
      active: true,
    },
    {
      title: 'Sunset Beach Walk & Tide Pools',
      description: 'Explore tide pools at sunset and discover marine life! This gentle beach walk is perfect for curious kids. Learn about sea creatures, collect shells, and enjoy the beautiful coastal scenery.',
      location: 'San Diego, CA',
      address: 'Coastal Beach Access, Ocean Blvd',
      latitude: 32.7157,
      longitude: -117.1611,
      price: 28.00,
      duration: 90,
      minAge: 4,
      maxAge: 12,
      capacity: 18,
      categoryId: natureWalks?.id || categories[6].id,
      hostId: demoHost.id,
      images: ['https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800'],
      featured: true,
      active: true,
    },
  ]

  for (const activity of activities) {
    const activityId = 'temp-' + activity.title.toLowerCase().replace(/ /g, '-')
    await prisma.activity.upsert({
      where: { id: activityId },
      update: {},
      create: {
        ...activity,
        id: activityId,
        updatedAt: new Date(),
      },
    })
  }

  console.log(`✅ Seeded ${activities.length} activities`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
