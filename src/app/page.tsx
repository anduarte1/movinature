import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ActivityCard } from "@/components/activity-card"
import { TreePine } from "lucide-react"
import { HeroSection } from "@/components/home/hero-section"
import { FeaturesSection } from "@/components/home/features-section"
import { CtaSection } from "@/components/home/cta-section"
import { FadeIn } from "@/components/animations/fade-in"
import { prisma } from "@/lib/prisma"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Home",
  description: "Book amazing outdoor activities and physical experiences for kids and families. Browse hiking, camping, water sports, climbing, and more nature-based adventures.",
  openGraph: {
    title: "movinature - Discover Nature's Playground",
    description: "Book amazing outdoor activities and physical experiences for kids and families.",
    url: "https://movinature.com",
  },
}

export default async function Home() {
  // Fetch featured activities from database
  const activities = await prisma.activity.findMany({
    where: {
      active: true,
      featured: true,
    },
    include: {
      Category: true,
      Review: {
        select: {
          rating: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 6,
  })

  // Calculate average rating for each activity
  const activitiesWithRating = activities.map((activity) => {
    const totalRating = activity.Review.reduce((sum, review) => sum + review.rating, 0)
    const avgRating = activity.Review.length > 0 ? totalRating / activity.Review.length : 0
    return {
      id: activity.id,
      title: activity.title,
      description: activity.description,
      location: activity.location,
      price: activity.price,
      duration: activity.duration,
      capacity: activity.capacity,
      images: activity.images,
      category: {
        id: activity.Category.id,
        name: activity.Category.name,
        slug: activity.Category.slug,
        icon: activity.Category.icon,
      },
      rating: avgRating,
      reviewCount: activity.Review.length,
      active: activity.active,
      featured: activity.featured,
    }
  })

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* Featured Activities */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <FadeIn delay={100}>
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Featured Activities
                </h2>
                <p className="text-gray-600">Handpicked adventures for your family</p>
              </div>
              <Button variant="outline" size="lg" className="border-2 hover:border-green-500 hover:text-green-600 hover:scale-105 rounded-xl transition-all" asChild>
                <Link href="/activities">View All</Link>
              </Button>
            </div>
          </FadeIn>

          {activitiesWithRating.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {activitiesWithRating.map((activity, index) => (
                <FadeIn key={activity.id} delay={200 + index * 100} direction="up">
                  <ActivityCard
                    id={activity.id}
                    title={activity.title}
                    location={activity.location}
                    price={activity.price}
                    duration={activity.duration}
                    capacity={activity.capacity}
                    images={activity.images}
                    category={activity.category}
                    rating={activity.rating}
                    reviewCount={activity.reviewCount}
                    featured={activity.featured}
                    isNew={index === 0 || index === 1}
                  />
                </FadeIn>
              ))}
            </div>
          ) : (
            <FadeIn delay={200}>
              <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
                <TreePine className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">
                  No featured activities yet. Check back soon!
                </p>
              </div>
            </FadeIn>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <CtaSection />
    </div>
  )
}
