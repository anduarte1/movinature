import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { randomUUID } from "crypto"

const activitySchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  location: z.string().min(1),
  address: z.string().optional(),
  price: z.number().min(0),
  duration: z.number().min(1),
  minAge: z.number().min(0),
  maxAge: z.number().min(0),
  capacity: z.number().min(1),
  categoryId: z.string(),
  images: z.array(z.string()).default([]),
  hostId: z.string(),
})

export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized. Please sign in to create activities." },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = activitySchema.parse(body)

    // Ensure user can only create activities for themselves
    if (validatedData.hostId !== session.user.id) {
      return NextResponse.json(
        { message: "You can only create activities for yourself" },
        { status: 403 }
      )
    }

    const activity = await prisma.activity.create({
      data: {
        ...validatedData,
        id: randomUUID(),
        active: true,
        featured: false,
        updatedAt: new Date(),
      },
      include: {
        Category: true,
      },
    })

    return NextResponse.json(activity, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid activity data", errors: error.issues },
        { status: 400 }
      )
    }

    console.error("Activity creation error:", error)
    return NextResponse.json(
      { message: "Failed to create activity" },
      { status: 500 }
    )
  }
}
