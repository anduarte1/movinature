import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ActivityCard } from "@/components/activity-card"
import { Search, Sparkles, TreePine, Heart } from "lucide-react"
import { prisma } from "@/lib/prisma"

export default async function Home() {
  // Fetch featured activities
  const activities = await prisma.activity.findMany({
    where: { active: true, featured: true },
    include: {
      category: true,
      reviews: {
        select: {
          rating: true,
        },
      },
    },
    take: 6,
  })

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
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 to-blue-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Discover Nature's Playground
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Book amazing outdoor activities and physical experiences for kids and families
            </p>
            <div className="flex gap-4 max-w-2xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                  placeholder="Search activities, locations..."
                  className="pl-10 h-12"
                />
              </div>
              <Button size="lg" className="h-12">
                Search
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 border-b">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <TreePine className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Nature Activities</h3>
              <p className="text-muted-foreground">
                Hiking, camping, nature walks and outdoor adventures
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <Sparkles className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Physical Activities</h3>
              <p className="text-muted-foreground">
                Sports, climbing, swimming and active play for all ages
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="h-16 w-16 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                <Heart className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Family Friendly</h3>
              <p className="text-muted-foreground">
                Safe, vetted activities perfect for kids and families
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Activities */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Featured Activities</h2>
            <Button variant="outline" asChild>
              <Link href="/activities">View All</Link>
            </Button>
          </div>
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
              <p className="text-muted-foreground">
                No featured activities yet. Check back soon!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Adventure?</h2>
          <p className="text-lg mb-8 opacity-90">
            Join thousands of families discovering nature together
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/activities">Browse Activities</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
