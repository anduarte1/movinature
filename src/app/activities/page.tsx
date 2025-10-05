import { prisma } from "@/lib/prisma"
import { ActivityCard } from "@/components/activity-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, SlidersHorizontal } from "lucide-react"

export default async function ActivitiesPage() {
  const [activities, categories] = await Promise.all([
    prisma.activity.findMany({
      where: { active: true },
      include: {
        category: true,
        reviews: {
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
    const totalRating = activity.reviews.reduce((sum, review) => sum + review.rating, 0)
    const avgRating = activity.reviews.length > 0 ? totalRating / activity.reviews.length : 0
    return {
      ...activity,
      rating: avgRating,
      reviewCount: activity.reviews.length,
    }
  })

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Explore Activities</h1>
          <p className="text-muted-foreground">
            Find the perfect outdoor adventure for your family
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-card border rounded-lg p-6 mb-8">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                placeholder="Search activities..."
                className="pl-10"
              />
            </div>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.slug}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              More Filters
            </Button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            {activitiesWithRating.length} {activitiesWithRating.length === 1 ? 'activity' : 'activities'} found
          </p>
        </div>

        {/* Activities Grid */}
        {activitiesWithRating.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activitiesWithRating.map((activity) => (
              <ActivityCard
                key={activity.id}
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
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No activities found. Try adjusting your filters.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
