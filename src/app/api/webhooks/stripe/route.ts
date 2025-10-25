import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { stripe } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"
import Stripe from "stripe"

export async function POST(req: NextRequest) {
  const body = await req.text()
  const headersList = await headers()
  const signature = headersList.get("stripe-signature")

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error("Webhook signature verification failed:", err)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  // Handle the event
  switch (event.type) {
    case "payment_intent.succeeded":
      const paymentIntent = event.data.object as Stripe.PaymentIntent

      try {
        await prisma.booking.updateMany({
          where: {
            paymentIntentId: paymentIntent.id,
          },
          data: {
            status: "CONFIRMED",
          },
        })
      } catch (error) {
        console.error("Error updating booking:", error)
      }

      console.log(`Payment succeeded for intent: ${paymentIntent.id}`)
      break

    case "payment_intent.payment_failed":
      const failedIntent = event.data.object as Stripe.PaymentIntent

      try {
        await prisma.booking.updateMany({
          where: {
            paymentIntentId: failedIntent.id,
          },
          data: {
            status: "CANCELLED",
          },
        })
      } catch (error) {
        console.error("Error updating booking:", error)
      }

      console.log(`Payment failed for intent: ${failedIntent.id}`)
      break

    default:
      console.log(`Unhandled event type: ${event.type}`)
  }

  return NextResponse.json({ received: true })
}
