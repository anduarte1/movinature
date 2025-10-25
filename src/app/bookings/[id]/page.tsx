import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Users, Clock, CheckCircle, DollarSign, Home } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default async function BookingConfirmationPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/api/auth/signin")
  }

  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      Activity: {
        include: {
          Category: true,
          User: {
            select: {
              name: true,
              email: true,
              image: true,
            },
          },
        },
      },
    },
  })

  if (!booking) {
    redirect("/bookings")
  }

  // Check if user is authorized to view this booking
  if (booking.userId !== session.user.id) {
    redirect("/bookings")
  }

  const getStatusDetails = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return {
          color: "bg-green-500",
          icon: CheckCircle,
          message: "Your booking has been confirmed!",
        }
      case "PENDING":
        return {
          color: "bg-yellow-500",
          icon: Clock,
          message: "Your booking is pending confirmation",
        }
      case "CANCELLED":
        return {
          color: "bg-red-500",
          icon: Clock,
          message: "This booking has been cancelled",
        }
      case "COMPLETED":
        return {
          color: "bg-blue-500",
          icon: CheckCircle,
          message: "This activity has been completed",
        }
      default:
        return {
          color: "bg-gray-500",
          icon: Clock,
          message: "Booking status unknown",
        }
    }
  }

  const statusDetails = getStatusDetails(booking.status)
  const StatusIcon = statusDetails.icon

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50/30 via-white to-gray-50">
      <div className="container mx-auto px-4 py-12">
        {/* Success Header */}
        <div className="max-w-4xl mx-auto mb-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            <span className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent">
              Booking Confirmed!
            </span>
          </h1>
          <p className="text-xl text-gray-600">
            Your adventure awaits. We&apos;ve sent confirmation details to your email.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {/* Booking Status */}
          <Card className="border-2 border-green-100">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <StatusIcon className={`h-8 w-8 text-white p-1.5 rounded-full ${statusDetails.color}`} />
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <p className="text-lg font-semibold">{statusDetails.message}</p>
                </div>
                <Badge className={`ml-auto ${statusDetails.color}`}>
                  {booking.status}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Activity Details */}
          <Card className="border-2 border-green-100">
            <CardHeader className="border-b border-green-50">
              <CardTitle className="text-2xl">Activity Details</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex gap-6">
                {/* Activity Image */}
                <div className="relative h-48 w-64 rounded-xl overflow-hidden flex-shrink-0">
                  <Image
                    src={booking.Activity.images[0] || "/placeholder.jpg"}
                    alt={booking.Activity.title}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Activity Info */}
                <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{booking.Activity.title}</h3>
                    <Badge variant="outline" className="mb-3">
                      {booking.Activity.Category.name}
                    </Badge>
                    <p className="text-gray-600 line-clamp-3">
                      {booking.Activity.description}
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-3 pt-2">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="h-4 w-4 text-green-600" />
                      <span className="font-medium">
                        {new Date(booking.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="h-4 w-4 text-green-600" />
                      <span>{booking.startTime} - {booking.endTime}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="h-4 w-4 text-green-600" />
                      <span>{booking.activity.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Users className="h-4 w-4 text-green-600" />
                      <span>{booking.participants} {booking.participants === 1 ? 'participant' : 'participants'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card className="border-2 border-green-100">
            <CardHeader className="border-b border-green-50">
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                Pricing Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>
                    ${booking.activity.price} × {booking.participants} {booking.participants === 1 ? 'person' : 'people'}
                  </span>
                  <span className="font-medium">${booking.totalPrice}</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span className="text-green-600">${booking.totalPrice}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Host Information */}
          <Card className="border-2 border-green-100">
            <CardHeader className="border-b border-green-50">
              <CardTitle>Your Host</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="relative h-16 w-16 rounded-full overflow-hidden bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                  {booking.activity.host.image ? (
                    <Image
                      src={booking.activity.host.image}
                      alt={booking.activity.host.name || "Host"}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <span className="text-2xl font-bold text-white">
                      {booking.activity.host.name?.charAt(0) || "H"}
                    </span>
                  )}
                </div>
                <div>
                  <p className="font-semibold text-lg">{booking.activity.host.name}</p>
                  <p className="text-sm text-gray-600">{booking.activity.host.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button
              size="lg"
              className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              asChild
            >
              <Link href="/bookings">
                <Home className="h-5 w-5 mr-2" />
                View All Bookings
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="flex-1 border-2 border-green-200 hover:border-green-400"
              asChild
            >
              <Link href="/activities">
                Browse More Activities
              </Link>
            </Button>
          </div>

          {/* Booking ID Reference */}
          <div className="text-center text-sm text-gray-500 pt-4">
            Booking Reference: <span className="font-mono font-medium">{booking.id}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
