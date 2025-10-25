import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { Plus, Calendar, DollarSign, Users, Star } from "lucide-react"

export default async function HostDashboard() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/api/auth/signin")
  }

  // Get user's activities
  const activities = await prisma.activity.findMany({
    where: {
      hostId: session.user.id,
    },
    include: {
      category: true,
      bookings: {
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      },
      reviews: {
        select: {
          rating: true,
        },
      },
      _count: {
        select: {
          bookings: true,
          reviews: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  // Calculate stats
  const totalActivities = activities.length
  const totalBookings = activities.reduce((sum, act) => sum + act._count.bookings, 0)
  const totalRevenue = activities.reduce(
    (sum, act) =>
      sum + act.bookings.reduce((bookingSum, booking) => bookingSum + booking.totalPrice, 0),
    0
  )
  const avgRating =
    activities.reduce((sum, act) => {
      const actRating =
        act.reviews.length > 0
          ? act.reviews.reduce((r, rev) => r + rev.rating, 0) / act.reviews.length
          : 0
      return sum + actRating
    }, 0) / (activities.length || 1)

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Host Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your activities and bookings
            </p>
          </div>
          <Button size="lg" asChild>
            <Link href="/host/new">
              <Plus className="h-5 w-5 mr-2" />
              Create Activity
            </Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Activities</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalActivities}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalBookings}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgRating.toFixed(1)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Activities List */}
        <Card>
          <CardHeader>
            <CardTitle>Your Activities</CardTitle>
          </CardHeader>
          <CardContent>
            {activities.length > 0 ? (
              <div className="space-y-4">
                {activities.map((activity) => {
                  const activityRating =
                    activity.reviews.length > 0
                      ? activity.reviews.reduce((sum, rev) => sum + rev.rating, 0) /
                        activity.reviews.length
                      : 0

                  return (
                    <div
                      key={activity.id}
                      className="flex gap-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div className="relative h-24 w-32 rounded-md overflow-hidden flex-shrink-0">
                        <Image
                          src={activity.images[0] || "/placeholder.jpg"}
                          alt={activity.title}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-lg">{activity.title}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline">{activity.category.name}</Badge>
                              <Badge variant={activity.active ? "default" : "secondary"}>
                                {activity.active ? "Active" : "Inactive"}
                              </Badge>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-xl">${activity.price}</div>
                            <div className="text-xs text-muted-foreground">per person</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-6 text-sm text-muted-foreground mb-3">
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>{activity._count.bookings} bookings</span>
                          </div>
                          {activity.reviews.length > 0 && (
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span>{activityRating.toFixed(1)}</span>
                              <span>({activity._count.reviews})</span>
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/activities/${activity.id}`}>View</Link>
                          </Button>
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/host/activities/${activity.id}/edit`}>Edit</Link>
                          </Button>
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/host/activities/${activity.id}/bookings`}>
                              Manage Bookings
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">
                  You haven&apos;t created any activities yet.
                </p>
                <Button asChild>
                  <Link href="/host/new">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Activity
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
