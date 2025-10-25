import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Users, Clock, Mail, ArrowLeft } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default async function ActivityBookingsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/api/auth/signin")
  }

  // Get activity with bookings
  const activity = await prisma.activity.findUnique({
    where: { id },
    include: {
      category: true,
      bookings: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
        orderBy: {
          date: 'asc',
        },
      },
    },
  })

  if (!activity) {
    redirect("/host")
  }

  // Check if user is the host
  if (activity.hostId !== session.user.id) {
    redirect("/host")
  }

  // Group bookings by status
  const bookingsByStatus = {
    pending: activity.bookings.filter((b) => b.status === "PENDING"),
    confirmed: activity.bookings.filter((b) => b.status === "CONFIRMED"),
    completed: activity.bookings.filter((b) => b.status === "COMPLETED"),
    cancelled: activity.bookings.filter((b) => b.status === "CANCELLED"),
  }

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

  const totalRevenue = activity.bookings
    .filter((b) => b.status !== "CANCELLED")
    .reduce((sum, booking) => sum + booking.totalPrice, 0)

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50/30 via-white to-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/host">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>

          <div className="flex items-start gap-6">
            {/* Activity Image */}
            <div className="relative h-32 w-48 rounded-xl overflow-hidden flex-shrink-0">
              <Image
                src={activity.images[0] || "/placeholder.jpg"}
                alt={activity.title}
                fill
                className="object-cover"
              />
            </div>

            {/* Activity Info */}
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-2">{activity.title}</h1>
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="outline">{activity.category.name}</Badge>
                <Badge variant={activity.active ? "default" : "secondary"}>
                  {activity.active ? "Active" : "Inactive"}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>{activity.location}</span>
              </div>
            </div>

            {/* Revenue */}
            <div className="text-right">
              <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
              <p className="text-3xl font-bold text-green-600">${totalRevenue.toFixed(2)}</p>
              <p className="text-sm text-gray-500 mt-1">
                {activity.bookings.filter((b) => b.status !== "CANCELLED").length} bookings
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="border-2 border-yellow-100">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">
                {bookingsByStatus.pending.length}
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-100">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Confirmed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {bookingsByStatus.confirmed.length}
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-blue-100">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {bookingsByStatus.completed.length}
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-red-100">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Cancelled</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">
                {bookingsByStatus.cancelled.length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bookings List */}
        <Card className="border-2 border-green-100">
          <CardHeader className="border-b border-green-50">
            <CardTitle className="text-2xl">All Bookings</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {activity.bookings.length > 0 ? (
              <div className="space-y-4">
                {activity.bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="border-2 border-gray-100 rounded-xl p-5 hover:border-green-200 transition-colors"
                  >
                    <div className="flex gap-6">
                      {/* Guest Info */}
                      <div className="flex items-start gap-4 flex-1">
                        <div className="relative h-12 w-12 rounded-full overflow-hidden bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
                          {booking.user.image ? (
                            <Image
                              src={booking.user.image}
                              alt={booking.user.name || "Guest"}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <span className="text-lg font-bold text-white">
                              {booking.user.name?.charAt(0) || "G"}
                            </span>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="font-semibold text-lg">{booking.user.name}</h3>
                              <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                                <Mail className="h-3 w-3" />
                                {booking.user.email}
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge className={getStatusColor(booking.status)}>
                                {booking.status}
                              </Badge>
                              <p className="text-sm text-gray-500 mt-1">
                                Ref: {booking.id.slice(0, 8)}
                              </p>
                            </div>
                          </div>

                          <div className="grid md:grid-cols-3 gap-4 mb-4">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Calendar className="h-4 w-4 text-green-600" />
                              <span className="font-medium">
                                {new Date(booking.date).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                })}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Clock className="h-4 w-4 text-green-600" />
                              <span>{booking.startTime} - {booking.endTime}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Users className="h-4 w-4 text-green-600" />
                              <span>
                                {booking.participants} {booking.participants === 1 ? 'person' : 'people'}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                            <div className="flex gap-2">
                              {booking.status === "PENDING" && (
                                <>
                                  <Button size="sm" variant="default">
                                    Confirm
                                  </Button>
                                  <Button size="sm" variant="outline">
                                    Decline
                                  </Button>
                                </>
                              )}
                              {booking.status === "CONFIRMED" && (
                                <Button size="sm" variant="outline">
                                  Mark Complete
                                </Button>
                              )}
                              <Button size="sm" variant="ghost">
                                Contact Guest
                              </Button>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-green-600">
                                ${booking.totalPrice}
                              </p>
                              <p className="text-xs text-gray-500">Total</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No bookings yet for this activity</p>
                <p className="text-gray-400 text-sm mt-2">
                  Bookings will appear here once guests start booking
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
