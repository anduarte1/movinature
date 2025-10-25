"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { BookingCalendar } from "./booking-calendar"
import { Clock, Users, Star, MapPin } from "lucide-react"

interface BookingCardProps {
  activityId: string
  price: number
  capacity: number
  duration: number
  avgRating: number
  reviewCount: number
  address?: string | null
}

export function BookingCard({
  activityId,
  price,
  capacity,
  duration,
  avgRating,
  reviewCount,
  address,
}: BookingCardProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleBook = (date: Date, participants: number) => {
    console.log("Booking:", { activityId, date, participants })
    setIsOpen(false)
  }

  return (
    <Card className="sticky top-24 shadow-2xl border-2 hover:shadow-3xl transition-shadow">
      <CardContent className="pt-6 space-y-6">
        {/* Price */}
        <div className="pb-4 border-b-2">
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              ${price}
            </span>
            <span className="text-gray-600 font-medium">per person</span>
          </div>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold text-gray-900">{avgRating.toFixed(1)}</span>
            <span>· {reviewCount} reviews</span>
          </p>
        </div>

        {/* CTA Button with Dialog */}
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              className="w-full h-14 text-lg rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl hover:scale-105 transition-all"
              size="lg"
            >
              Check Availability
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Book Your Activity</DialogTitle>
            </DialogHeader>
            <BookingCalendar
              activityId={activityId}
              price={price}
              capacity={capacity}
              onBook={handleBook}
            />
          </DialogContent>
        </Dialog>

        <div className="text-center text-sm text-muted-foreground font-medium">
          You won&apos;t be charged yet
        </div>

        <Separator />

        {/* Details */}
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 rounded-lg bg-gray-50">
            <span className="text-gray-600 flex items-center gap-2">
              <Clock className="h-4 w-4 text-green-600" />
              Duration
            </span>
            <span className="font-bold text-gray-900">{duration} min</span>
          </div>
          <div className="flex justify-between items-center p-3 rounded-lg bg-gray-50">
            <span className="text-gray-600 flex items-center gap-2">
              <Users className="h-4 w-4 text-green-600" />
              Max capacity
            </span>
            <span className="font-bold text-gray-900">{capacity} people</span>
          </div>
        </div>

        {address && (
          <>
            <Separator />
            <div>
              <h4 className="font-bold mb-3 flex items-center gap-2 text-lg">
                <MapPin className="h-5 w-5 text-green-600" />
                Location
              </h4>
              <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{address}</p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
