import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { randomUUID } from "crypto"
import { z } from "zod"
import { resend, FROM_EMAIL } from "@/lib/email"
import { BookingConfirmationEmail } from "@/emails/booking-confirmation"
import { format } from "date-fns"

const bookingSchema = z.object({
  activityId: z.string(),
  date: z.string(),
  participants: z.number().min(1),
  totalPrice: z.number().min(0),
  paymentIntentId: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized. Please sign in to book activities." },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = bookingSchema.parse(body)

    const { activityId, date, participants, totalPrice, paymentIntentId } = validatedData

    // Check if activity exists and is active
    const activity = await prisma.activity.findUnique({
      where: { id: activityId },
    })

    if (!activity || !activity.active) {
      return NextResponse.json(
        { message: "Activity not found or not available" },
        { status: 404 }
      )
    }

    // Check capacity
    if (participants > activity.capacity) {
      return NextResponse.json(
        { message: `This activity can only accommodate up to ${activity.capacity} participants` },
        { status: 400 }
      )
    }

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        id: randomUUID(),
        userId: session.user.id,
        activityId,
        date: new Date(date),
        startTime: "09:00", // Default time - can be enhanced later
        endTime: "12:00",
        participants,
        totalPrice,
        paymentIntentId,
        status: paymentIntentId ? "CONFIRMED" : "PENDING",
        updatedAt: new Date(),
      },
      include: {
        Activity: {
          select: {
            title: true,
            location: true,
          },
        },
        User: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    })

    // Send confirmation email (don't block response if it fails)
    if (booking.status === "CONFIRMED" && session.user.email && process.env.RESEND_API_KEY) {
      try {
        await resend.emails.send({
          from: FROM_EMAIL,
          to: session.user.email,
          subject: `Booking Confirmed: ${booking.Activity.title}`,
          react: BookingConfirmationEmail({
            userName: booking.User.name || "Guest",
            activityTitle: booking.Activity.title,
            activityLocation: booking.Activity.location,
            date: format(new Date(booking.date), "PPPP"),
            participants: booking.participants,
            totalPrice: booking.totalPrice,
            bookingId: booking.id,
          }),
        })
        console.log(`Confirmation email sent to ${session.user.email}`)
      } catch (emailError) {
        console.error("Failed to send confirmation email:", emailError)
        // Don't fail the booking if email fails
      }
    }

    return NextResponse.json(booking, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid booking data", errors: error.issues },
        { status: 400 }
      )
    }

    console.error("Booking creation error:", error)
    return NextResponse.json(
      { message: "Failed to create booking" },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    const bookings = await prisma.booking.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        Activity: {
          select: {
            id: true,
            title: true,
            location: true,
            images: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(bookings)
  } catch (error) {
    console.error("Fetch bookings error:", error)
    return NextResponse.json(
      { message: "Failed to fetch bookings" },
      { status: 500 }
    )
  }
}
