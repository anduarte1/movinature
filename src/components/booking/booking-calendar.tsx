"use client"

import { useState } from "react"
import { DayPicker } from "react-day-picker"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Users } from "lucide-react"
import "react-day-picker/dist/style.css"

interface BookingCalendarProps {
  activityId: string
  price: number
  capacity: number
  onBook?: (date: Date, participants: number) => void
}

export function BookingCalendar({ activityId, price, capacity, onBook }: BookingCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  const [participants, setParticipants] = useState<string>("1")
  const [isBooking, setIsBooking] = useState(false)

  // Mock unavailable dates (in real app, fetch from API)
  const unavailableDates = [
    new Date(2025, 9, 25), // October 25, 2025
    new Date(2025, 9, 26), // October 26, 2025
    new Date(2025, 10, 1), // November 1, 2025
  ]

  const disabledDays = [
    { before: new Date() }, // Disable past dates
    ...unavailableDates.map(date => ({ from: date, to: date })),
  ]

  const handleBooking = async () => {
    if (!selectedDate) return

    setIsBooking(true)
    try {
      // Create payment intent
      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          activityId,
          date: selectedDate.toISOString(),
          participants: parseInt(participants),
          amount: totalPrice,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create payment intent")
      }

      const { clientSecret, paymentIntentId } = await response.json()

      // For demo purposes, simulate successful payment
      // In production, redirect to Stripe Checkout or use Stripe Elements
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Create booking with confirmed status
      const bookingResponse = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          activityId,
          date: selectedDate.toISOString(),
          participants: parseInt(participants),
          totalPrice,
          paymentIntentId,
        }),
      })

      if (!bookingResponse.ok) {
        throw new Error("Failed to create booking")
      }

      onBook?.(selectedDate, parseInt(participants))
      alert(`Booking confirmed for ${format(selectedDate, "PPP")} with ${participants} participants!\n\nTotal: $${totalPrice}\n\nYou will receive a confirmation email shortly.`)
    } catch (error) {
      console.error("Booking error:", error)
      alert("Booking failed. Please try again.")
    } finally {
      setIsBooking(false)
    }
  }

  const totalPrice = price * parseInt(participants || "1")

  return (
    <Card className="shadow-xl border-2">
      <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b-2">
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Calendar className="h-6 w-6 text-green-600" />
          Book Your Spot
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        {/* Date Selection */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">Select Date</Label>
          <div className="flex justify-center">
            <DayPicker
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={disabledDays}
              modifiersClassNames={{
                selected: "bg-green-600 text-white hover:bg-green-700",
                today: "border-2 border-green-600 font-bold",
                disabled: "text-gray-300 line-through",
              }}
              className="border-2 border-gray-100 rounded-xl p-4"
            />
          </div>
          {selectedDate && (
            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
              <p className="text-center font-semibold text-green-900">
                Selected: {format(selectedDate, "PPPP")}
              </p>
            </div>
          )}
        </div>

        {/* Participants Selection */}
        <div className="space-y-3">
          <Label htmlFor="participants" className="text-base font-semibold flex items-center gap-2">
            <Users className="h-4 w-4 text-green-600" />
            Number of Participants
          </Label>
          <Select value={participants} onValueChange={setParticipants}>
            <SelectTrigger className="h-12 border-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: capacity }, (_, i) => i + 1).map((num) => (
                <SelectItem key={num} value={num.toString()}>
                  {num} {num === 1 ? "participant" : "participants"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Price Breakdown */}
        <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-4 space-y-2">
          <div className="flex justify-between text-gray-700">
            <span>${price} × {participants} participants</span>
            <span className="font-semibold">${price * parseInt(participants)}</span>
          </div>
          <div className="border-t-2 border-gray-300 pt-2 flex justify-between items-center">
            <span className="text-lg font-bold">Total</span>
            <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              ${totalPrice}
            </span>
          </div>
        </div>

        {/* Book Button */}
        <Button
          onClick={handleBooking}
          disabled={!selectedDate || isBooking}
          className="w-full h-14 text-lg rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {isBooking ? "Processing..." : "Confirm Booking"}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          You won&apos;t be charged yet. Final confirmation required.
        </p>
      </CardContent>
    </Card>
  )
}
