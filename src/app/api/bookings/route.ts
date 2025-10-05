import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const bookingSchema = z.object({
  activityId: z.string(),
  date: z.string(),
  participants: z.number().min(1),
  totalPrice: z.number().min(0),
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

    const { activityId, date, participants, totalPrice } = validatedData

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
        userId: session.user.id,
        activityId,
        date: new Date(date),
        startTime: "09:00", // Default time - can be enhanced later
        endTime: "12:00",
        participants,
        totalPrice,
        status: "PENDING",
      },
      include: {
        activity: {
          select: {
            title: true,
            location: true,
          },
        },
      },
    })

    return NextResponse.json(booking, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid booking data", errors: error.errors },
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

export async function GET(request: NextRequest) {
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
        activity: {
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
