import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { ActivityCard } from "@/components/activity-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Heart } from "lucide-react"

export default async function FavoritesPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/api/auth/signin")
  }

  const favorites = await prisma.favorite.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      activity: {
        include: {
          category: true,
          reviews: {
            select: {
              rating: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  // Calculate ratings
  const favoritesWithRating = favorites.map((fav) => {
    const totalRating = fav.activity.reviews.reduce((sum, review) => sum + review.rating, 0)
    const avgRating = fav.activity.reviews.length > 0 ? totalRating / fav.activity.reviews.length : 0
    return {
      ...fav.activity,
      rating: avgRating,
      reviewCount: fav.activity.reviews.length,
    }
  })

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">My Favorites</h1>
          <p className="text-muted-foreground">
            Activities you&apos;ve saved for later
          </p>
        </div>

        {favoritesWithRating.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoritesWithRating.map((activity) => (
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
          <Card>
            <CardHeader>
              <CardTitle>No Favorites Yet</CardTitle>
            </CardHeader>
            <CardContent className="text-center py-8">
              <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                You haven&apos;t saved any activities yet. Start exploring and save your favorites!
              </p>
              <Button asChild>
                <Link href="/activities">Browse Activities</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
