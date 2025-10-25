import { PrismaClient } from '@prisma/client'
import { randomUUID } from 'crypto'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

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

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    })
  }

  console.log(`✅ Seeded ${categories.length} categories`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
