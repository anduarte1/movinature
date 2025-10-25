import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { ImageGallery } from "@/components/activity/image-gallery"
import { BookingCard } from "@/components/booking/booking-card"
import { prisma } from "@/lib/prisma"
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
import type { Metadata } from "next"

interface ActivityPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: ActivityPageProps): Promise<Metadata> {
  const { id } = await params

  const activity = await prisma.activity.findUnique({
    where: { id },
    include: {
      Category: true,
    },
  })

  if (!activity) {
    return {
      title: "Activity Not Found",
    }
  }

  return {
    title: activity.title,
    description: activity.description.slice(0, 160),
    keywords: [activity.Category.name, activity.location, "outdoor activity", "kids activity", "family activity"],
    openGraph: {
      title: `${activity.title} | movinature`,
      description: activity.description.slice(0, 200),
      url: `https://movinature.com/activities/${id}`,
      type: "article",
      images: [
        {
          url: activity.images[0] || 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800',
          width: 1200,
          height: 630,
          alt: activity.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: activity.title,
      description: activity.description.slice(0, 200),
      images: [activity.images[0] || 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800'],
    },
  }
}

export default async function ActivityPage({ params }: ActivityPageProps) {
  const { id} = await params

  // Fetch activity from database
  const activityData = await prisma.activity.findUnique({
    where: { id },
    include: {
      Category: true,
      User: {
        select: {
          id: true,
          name: true,
          image: true,
          createdAt: true,
        },
      },
      Review: {
        include: {
          User: {
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
    },
  })

  if (!activityData) {
    notFound()
  }

  // Transform to match component expectations
  const activity = {
    id: activityData.id,
    title: activityData.title,
    description: activityData.description,
    location: activityData.location,
    address: activityData.address || activityData.location,
    price: activityData.price,
    duration: activityData.duration,
    minAge: activityData.minAge,
    maxAge: activityData.maxAge,
    capacity: activityData.capacity,
    images: activityData.images,
    category: {
      id: activityData.Category.id,
      name: activityData.Category.name,
      slug: activityData.Category.slug,
    },
    host: {
      id: activityData.User.id,
      name: activityData.User.name || 'Host',
      image: activityData.User.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${activityData.User.id}`,
      createdAt: activityData.User.createdAt,
    },
    reviews: activityData.Review.map(review => ({
      id: review.id,
      rating: review.rating,
      comment: review.comment || '',
      user: {
        name: review.User.name || 'Anonymous',
        image: review.User.image,
      },
      createdAt: review.createdAt,
    })),
    _count: { Review: activityData.Review.length },
  }

  // Calculate average rating
  const totalRating = activity.reviews.reduce((sum, review) => sum + review.rating, 0)
  const avgRating = activity.reviews.length > 0 ? totalRating / activity.reviews.length : 0

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Image Gallery */}
        <ImageGallery images={activity.images} title={activity.title} />

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title and Actions */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    {activity.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                    {avgRating > 0 && (
                      <div className="flex items-center gap-1.5">
                        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                        <span className="font-bold text-foreground text-lg">
                          {avgRating.toFixed(1)}
                        </span>
                        <span className="text-gray-600">({activity._count.Review} reviews)</span>
                      </div>
                    )}
                    <Separator orientation="vertical" className="h-5" />
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-5 w-5 text-green-600" />
                      <span className="font-medium text-gray-700">{activity.location}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" className="rounded-full hover:bg-green-50 hover:border-green-500">
                    <Share2 className="h-5 w-5" />
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-full hover:bg-red-50 hover:border-red-500">
                    <Heart className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-1.5 text-sm">
                {activity.category.name}
              </Badge>
            </div>

            <Separator className="my-6" />

            {/* Host Info */}
            <Card className="shadow-lg hover:shadow-xl transition-shadow border-2">
              <CardContent className="flex items-center gap-4 pt-6">
                <Avatar className="h-20 w-20 border-4 border-green-100">
                  <AvatarImage src={activity.host.image || ""} />
                  <AvatarFallback className="bg-gradient-to-br from-green-500 to-emerald-600 text-white text-2xl">
                    {activity.host.name?.charAt(0) || "H"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-bold text-xl mb-1">Hosted by {activity.host.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Member since {new Date(activity.host.createdAt).getFullYear()}
                  </p>
                </div>
                <Button variant="outline" className="border-2 hover:border-green-500 hover:bg-green-50">
                  Contact Host
                </Button>
              </CardContent>
            </Card>

            {/* Activity Details */}
            <Card className="shadow-lg hover:shadow-xl transition-shadow border-2">
              <CardHeader>
                <CardTitle className="text-2xl">Activity Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                      <Clock className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">Duration</p>
                      <p className="text-sm text-gray-600">{activity.duration} minutes</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">Group Size</p>
                      <p className="text-sm text-gray-600">Up to {activity.capacity} people</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                      <Info className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">Age Range</p>
                      <p className="text-sm text-gray-600">
                        {activity.minAge} - {activity.maxAge} years
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-br from-orange-50 to-yellow-50 border border-orange-100">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-orange-500 to-yellow-600 flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">Availability</p>
                      <p className="text-sm text-gray-600">Check calendar</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card className="shadow-lg hover:shadow-xl transition-shadow border-2">
              <CardHeader>
                <CardTitle className="text-2xl">About This Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line text-lg">
                  {activity.description}
                </p>
              </CardContent>
            </Card>

            {/* Reviews */}
            {activity.reviews.length > 0 && (
              <Card className="shadow-lg hover:shadow-xl transition-shadow border-2">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    Reviews
                    <span className="text-lg font-normal text-muted-foreground">({activity._count.Review})</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {activity.reviews.map((review) => (
                    <div key={review.id} className="border-b last:border-0 pb-6 last:pb-0">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-12 w-12 border-2 border-gray-100">
                          <AvatarImage src={review.user.image || ""} />
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                            {review.user.name?.charAt(0) || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-bold text-lg">{review.user.name}</p>
                            <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1 rounded-full border border-yellow-200">
                              {Array.from({ length: review.rating }).map((_, i) => (
                                <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            {new Date(review.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                          {review.comment && (
                            <p className="text-gray-700 leading-relaxed">{review.comment}</p>
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
            <BookingCard
              activityId={activity.id}
              price={activity.price}
              capacity={activity.capacity}
              duration={activity.duration}
              avgRating={avgRating}
              reviewCount={activity._count.Review}
              address={activity.address}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
