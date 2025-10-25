import { prisma } from "@/lib/prisma"
import { ActivityCard } from "@/components/activity-card"
import { ActivityFilters } from "@/components/activity-filters"
import { Search } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Browse Activities",
  description: "Explore our collection of outdoor activities for kids and families. Filter by category, location, price, and age range to find the perfect adventure.",
  openGraph: {
    title: "Browse Activities | movinature",
    description: "Explore outdoor activities for kids and families - hiking, camping, water sports, climbing and more.",
    url: "https://movinature.com/activities",
  },
}

interface SearchParams {
  search?: string
  category?: string
  minPrice?: string
  maxPrice?: string
  minAge?: string
  maxAge?: string
  location?: string
}

export default async function ActivitiesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams

  // Build where clause based on filters
  const where: Record<string, unknown> = { active: true }

  // Search filter (searches in title, description, and location)
  if (params.search) {
    where.OR = [
      { title: { contains: params.search, mode: 'insensitive' } },
      { description: { contains: params.search, mode: 'insensitive' } },
      { location: { contains: params.search, mode: 'insensitive' } },
    ]
  }

  // Category filter
  if (params.category && params.category !== 'all') {
    where.Category = {
      slug: params.category,
    }
  }

  // Price range filter
  if (params.minPrice || params.maxPrice) {
    const priceFilter: Record<string, number> = {}
    if (params.minPrice) {
      priceFilter.gte = parseFloat(params.minPrice)
    }
    if (params.maxPrice) {
      priceFilter.lte = parseFloat(params.maxPrice)
    }
    where.price = priceFilter
  }

  // Age range filter
  if (params.minAge || params.maxAge) {
    if (params.minAge) {
      where.maxAge = { gte: parseInt(params.minAge) }
    }
    if (params.maxAge) {
      where.minAge = { lte: parseInt(params.maxAge) }
    }
  }

  // Location filter
  if (params.location) {
    where.location = { contains: params.location, mode: 'insensitive' }
  }

  const [activities, categories] = await Promise.all([
    prisma.activity.findMany({
      where,
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
    }),
    prisma.category.findMany({
      orderBy: {
        name: 'asc',
      },
    }),
  ])

  // Calculate average rating for each activity
  const activitiesWithRating = activities.map((activity) => {
    const totalRating = activity.Review.reduce((sum, review) => sum + review.rating, 0)
    const avgRating = activity.Review.length > 0 ? totalRating / activity.Review.length : 0
    return {
      ...activity,
      rating: avgRating,
      reviewCount: activity.Review.length,
    }
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50/30 via-white to-gray-50">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4">
            <span className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent">
              Explore Activities
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find the perfect outdoor adventure for your family
          </p>
        </div>

        {/* Search and Filters */}
        <ActivityFilters categories={categories} />

        {/* Results Count */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 px-4 py-2 rounded-full">
            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
            <p className="text-green-900 font-semibold">
              {activitiesWithRating.length} {activitiesWithRating.length === 1 ? 'activity' : 'activities'} available
            </p>
          </div>
        </div>

        {/* Activities Grid */}
        {activitiesWithRating.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activitiesWithRating.map((activity, index) => (
              <div
                key={activity.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <ActivityCard
                  id={activity.id}
                  title={activity.title}
                  location={activity.location}
                  price={activity.price}
                  duration={activity.duration}
                  capacity={activity.capacity}
                  images={activity.images}
                  category={activity.Category}
                  rating={activity.rating}
                  reviewCount={activity.reviewCount}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
            <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg font-medium">
              No activities found. Try adjusting your filters.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
