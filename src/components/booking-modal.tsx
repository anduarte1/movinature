"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"

interface BookingModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  activityId: string
  activityTitle: string
  price: number
  duration: number
}

export function BookingModal({
  open,
  onOpenChange,
  activityId,
  activityTitle,
  price,
  duration,
}: BookingModalProps) {
  const router = useRouter()
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [participants, setParticipants] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const totalPrice = price * participants

  const handleSubmit = async () => {
    if (!date) return

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          activityId,
          date: date.toISOString(),
          participants,
          totalPrice,
        }),
      })

      if (response.ok) {
        const booking = await response.json()
        router.push(`/bookings/${booking.id}`)
      } else {
        const error = await response.json()
        alert(error.message || "Failed to create booking")
      }
    } catch (error) {
      console.error("Booking error:", error)
      alert("An error occurred while creating your booking")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Book {activityTitle}</DialogTitle>
          <DialogDescription>
            Select your preferred date and number of participants
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Calendar */}
          <div>
            <Label className="mb-2 block">Select Date</Label>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              disabled={(date) => date < new Date()}
              className="rounded-md border"
            />
          </div>

          {/* Participants */}
          <div>
            <Label htmlFor="participants" className="mb-2 block">
              Number of Participants
            </Label>
            <Input
              id="participants"
              type="number"
              min={1}
              value={participants}
              onChange={(e) => setParticipants(parseInt(e.target.value) || 1)}
            />
          </div>

          {/* Price Summary */}
          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                ${price} × {participants} {participants === 1 ? 'person' : 'people'}
              </span>
              <span className="font-medium">${totalPrice}</span>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>${totalPrice}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!date || isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? "Booking..." : "Confirm Booking"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
