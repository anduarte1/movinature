import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Users, Clock } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default async function BookingsPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/api/auth/signin")
  }

  const bookings = await prisma.booking.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      Activity: {
        include: {
          Category: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-500"
      case "PENDING":
        return "bg-yellow-500"
      case "CANCELLED":
        return "bg-red-500"
      case "COMPLETED":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">My Bookings</h1>
          <p className="text-muted-foreground">
            View and manage all your activity bookings
          </p>
        </div>

        {bookings.length > 0 ? (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <Card key={booking.id}>
                <CardContent className="p-6">
                  <div className="flex gap-6">
                    {/* Activity Image */}
                    <div className="relative h-32 w-48 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={booking.Activity.images[0] || "/placeholder.jpg"}
                        alt={booking.Activity.title}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Booking Details */}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <Link
                            href={`/activities/${booking.Activity.id}`}
                            className="text-xl font-semibold hover:underline"
                          >
                            {booking.Activity.title}
                          </Link>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline">
                              {booking.Activity.Category.name}
                            </Badge>
                            <Badge className={getStatusColor(booking.status)}>
                              {booking.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold">
                            ${booking.totalPrice}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Total
                          </div>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(booking.date).toLocaleDateString()}</span>
                          <span>at {booking.startTime}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Users className="h-4 w-4" />
                          <span>{booking.participants} {booking.participants === 1 ? 'participant' : 'participants'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span>{booking.Activity.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>Booked {new Date(booking.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/activities/${booking.Activity.id}`}>
                            View Activity
                          </Link>
                        </Button>
                        {booking.status === "CONFIRMED" && (
                          <Button variant="outline" size="sm">
                            Contact Host
                          </Button>
                        )}
                        {booking.status === "PENDING" && (
                          <Button variant="destructive" size="sm">
                            Cancel Booking
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>No Bookings Yet</CardTitle>
            </CardHeader>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                You haven&apos;t booked any activities yet. Start exploring!
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
