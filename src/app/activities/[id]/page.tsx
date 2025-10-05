import { notFound } from "next/navigation"
import Image from "next/image"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  MapPin,
  Clock,
  Users,
  Calendar,
  Star,
  Heart,
  Share2,
  Info
} from "lucide-react"
import { auth } from "@/auth"

interface ActivityPageProps {
  params: {
    id: string
  }
}

export default async function ActivityPage({ params }: ActivityPageProps) {
  const session = await auth()

  const activity = await prisma.activity.findUnique({
    where: { id: params.id },
    include: {
      category: true,
      host: {
        select: {
          id: true,
          name: true,
          image: true,
          createdAt: true,
        },
      },
      reviews: {
        include: {
          user: {
            select: {
              name: true,
              image: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
      _count: {
        select: {
          reviews: true,
        },
      },
    },
  })

  if (!activity) {
    notFound()
  }

  // Calculate average rating
  const totalRating = activity.reviews.reduce((sum, review) => sum + review.rating, 0)
  const avgRating = activity.reviews.length > 0 ? totalRating / activity.reviews.length : 0

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Image Gallery */}
        <div className="grid md:grid-cols-2 gap-4 mb-8 rounded-xl overflow-hidden">
          {activity.images.length > 0 ? (
            <>
              <div className="relative h-96 md:row-span-2">
                <Image
                  src={activity.images[0]}
                  alt={activity.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              {activity.images.slice(1, 5).map((image, idx) => (
                <div key={idx} className="relative h-48">
                  <Image
                    src={image}
                    alt={`${activity.title} ${idx + 2}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </>
          ) : (
            <div className="relative h-96 md:col-span-2 bg-muted flex items-center justify-center">
              <p className="text-muted-foreground">No images available</p>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title and Actions */}
            <div>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h1 className="text-4xl font-bold mb-2">{activity.title}</h1>
                  <div className="flex items-center gap-4 text-muted-foreground">
                    <div className="flex items-center gap-1">
                      {avgRating > 0 && (
                        <>
                          <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium text-foreground">
                            {avgRating.toFixed(1)}
                          </span>
                          <span>({activity._count.reviews} reviews)</span>
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-5 w-5" />
                      <span>{activity.location}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon">
                    <Share2 className="h-5 w-5" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Heart className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              <Badge>{activity.category.name}</Badge>
            </div>

            {/* Host Info */}
            <Card>
              <CardContent className="flex items-center gap-4 pt-6">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={activity.host.image || ""} />
                  <AvatarFallback>{activity.host.name?.charAt(0) || "H"}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">Hosted by {activity.host.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Member since {new Date(activity.host.createdAt).getFullYear()}
                  </p>
                </div>
                <Button variant="outline">Contact Host</Button>
              </CardContent>
            </Card>

            {/* Activity Details */}
            <Card>
              <CardHeader>
                <CardTitle>Activity Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Duration</p>
                      <p className="text-sm text-muted-foreground">{activity.duration} minutes</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Group Size</p>
                      <p className="text-sm text-muted-foreground">Up to {activity.capacity} people</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Info className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Age Range</p>
                      <p className="text-sm text-muted-foreground">
                        {activity.minAge} - {activity.maxAge} years
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Availability</p>
                      <p className="text-sm text-muted-foreground">Check calendar</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>About This Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {activity.description}
                </p>
              </CardContent>
            </Card>

            {/* Reviews */}
            {activity.reviews.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Reviews ({activity._count.reviews})</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {activity.reviews.map((review) => (
                    <div key={review.id} className="border-b last:border-0 pb-6 last:pb-0">
                      <div className="flex items-start gap-4">
                        <Avatar>
                          <AvatarImage src={review.user.image || ""} />
                          <AvatarFallback>{review.user.name?.charAt(0) || "U"}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-semibold">{review.user.name}</p>
                            <div className="flex items-center gap-1">
                              {Array.from({ length: review.rating }).map((_, i) => (
                                <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </p>
                          {review.comment && (
                            <p className="text-muted-foreground">{review.comment}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Booking Card - Sticky */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold">${activity.price}</span>
                  <span className="text-muted-foreground">per person</span>
                </div>

                <Button className="w-full" size="lg">
                  Check Availability
                </Button>

                <div className="text-center text-sm text-muted-foreground">
                  You won't be charged yet
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duration</span>
                    <span className="font-medium">{activity.duration} min</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Max capacity</span>
                    <span className="font-medium">{activity.capacity} people</span>
                  </div>
                </div>

                {activity.address && (
                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-2">Location</h4>
                    <p className="text-sm text-muted-foreground">{activity.address}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
