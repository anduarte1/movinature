import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Users table - stores user profile information from Clerk
  users: defineTable({
    clerkId: v.string(), // Clerk user ID
    email: v.string(),
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    bio: v.optional(v.string()),
    phone: v.optional(v.string()),
    role: v.union(
      v.literal("GUEST"),
      v.literal("HOST"),
      v.literal("ADMIN")
    ),
  })
    .index("by_clerk_id", ["clerkId"])
    .index("by_email", ["email"]),

  // Categories for activities
  categories: defineTable({
    name: v.string(),
    slug: v.string(),
    icon: v.optional(v.string()),
  })
    .index("by_slug", ["slug"])
    .index("by_name", ["name"]),

  // Activities/listings
  activities: defineTable({
    title: v.string(),
    description: v.string(),
    location: v.string(),
    address: v.optional(v.string()),
    latitude: v.optional(v.number()),
    longitude: v.optional(v.number()),
    price: v.number(),
    duration: v.number(), // in minutes
    minAge: v.number(),
    maxAge: v.number(),
    capacity: v.number(),
    images: v.array(v.string()), // Array of image URLs
    featured: v.boolean(),
    active: v.boolean(),
    hostId: v.id("users"), // Reference to users table
    categoryId: v.id("categories"), // Reference to categories table
  })
    .index("by_host", ["hostId"])
    .index("by_category", ["categoryId"])
    .index("by_featured", ["featured"])
    .index("by_active", ["active"]),

  // Activity availability slots
  availability: defineTable({
    activityId: v.id("activities"),
    date: v.number(), // Unix timestamp
    startTime: v.string(), // e.g., "09:00"
    endTime: v.string(), // e.g., "17:00"
    capacity: v.number(),
    booked: v.number(),
  })
    .index("by_activity", ["activityId"])
    .index("by_activity_and_date", ["activityId", "date"]),

  // Bookings
  bookings: defineTable({
    activityId: v.id("activities"),
    userId: v.id("users"),
    date: v.number(), // Unix timestamp
    startTime: v.string(),
    endTime: v.string(),
    participants: v.number(),
    totalPrice: v.number(),
    status: v.union(
      v.literal("PENDING"),
      v.literal("CONFIRMED"),
      v.literal("CANCELLED"),
      v.literal("COMPLETED")
    ),
    paymentIntentId: v.optional(v.string()), // Stripe payment intent ID
  })
    .index("by_user", ["userId"])
    .index("by_activity", ["activityId"])
    .index("by_status", ["status"]),

  // User favorites/wishlist
  favorites: defineTable({
    userId: v.id("users"),
    activityId: v.id("activities"),
  })
    .index("by_user", ["userId"])
    .index("by_activity", ["activityId"])
    .index("by_user_and_activity", ["userId", "activityId"]),

  // Reviews and ratings
  reviews: defineTable({
    activityId: v.id("activities"),
    userId: v.id("users"),
    rating: v.number(), // 1-5
    comment: v.optional(v.string()),
  })
    .index("by_activity", ["activityId"])
    .index("by_user", ["userId"])
    .index("by_user_and_activity", ["userId", "activityId"]),
});
