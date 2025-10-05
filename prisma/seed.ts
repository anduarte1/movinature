import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Seed categories
  const categories = [
    { name: 'Hiking', slug: 'hiking', icon: '🥾' },
    { name: 'Camping', slug: 'camping', icon: '⛺' },
    { name: 'Water Sports', slug: 'water-sports', icon: '🏄' },
    { name: 'Climbing', slug: 'climbing', icon: '🧗' },
    { name: 'Cycling', slug: 'cycling', icon: '🚴' },
    { name: 'Wildlife Watching', slug: 'wildlife', icon: '🦅' },
    { name: 'Nature Walks', slug: 'nature-walks', icon: '🌳' },
    { name: 'Adventure Sports', slug: 'adventure', icon: '🪂' },
    { name: 'Team Sports', slug: 'team-sports', icon: '⚽' },
    { name: 'Yoga & Wellness', slug: 'yoga-wellness', icon: '🧘' },
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
