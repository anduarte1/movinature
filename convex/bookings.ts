import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Get all bookings for a user
export const getByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const bookings = await ctx.db
      .query("bookings")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    // Get activity details for each booking
    const bookingsWithDetails = await Promise.all(
      bookings.map(async (booking) => {
        const activity = await ctx.db.get(booking.activityId);
        if (!activity) return null;

        const host = await ctx.db.get(activity.hostId);

        return {
          ...booking,
          activity: {
            id: activity._id,
            title: activity.title,
            location: activity.location,
            images: activity.images,
            host: {
              name: host?.name || "Unknown Host",
              image: host?.image || "",
            },
          },
        };
      })
    );

    return bookingsWithDetails.filter((b) => b !== null);
  },
});

// Get all bookings for an activity
export const getByActivity = query({
  args: { activityId: v.id("activities") },
  handler: async (ctx, args) => {
    const bookings = await ctx.db
      .query("bookings")
      .withIndex("by_activity", (q) => q.eq("activityId", args.activityId))
      .collect();

    const bookingsWithUsers = await Promise.all(
      bookings.map(async (booking) => {
        const user = await ctx.db.get(booking.userId);
        return {
          ...booking,
          user: {
            name: user?.name || "Unknown",
            email: user?.email || "",
            image: user?.image || "",
          },
        };
      })
    );

    return bookingsWithUsers;
  },
});

// Get a single booking by ID
export const getById = query({
  args: { id: v.id("bookings") },
  handler: async (ctx, args) => {
    const booking = await ctx.db.get(args.id);
    if (!booking) return null;

    const activity = await ctx.db.get(booking.activityId);
    const user = await ctx.db.get(booking.userId);

    if (!activity) return null;

    const host = await ctx.db.get(activity.hostId);

    return {
      ...booking,
      activity: {
        _id: activity._id,
        title: activity.title,
        location: activity.location,
        images: activity.images,
        description: activity.description,
        price: activity.price,
        hostId: activity.hostId,
        host: {
          name: host?.name || "Unknown Host",
          image: host?.image || "",
        },
      },
      user: {
        name: user?.name || "Unknown",
        email: user?.email || "",
      },
    };
  },
});

// Create a new booking
export const create = mutation({
  args: {
    activityId: v.id("activities"),
    userId: v.id("users"),
    date: v.number(),
    startTime: v.string(),
    endTime: v.string(),
    participants: v.number(),
    totalPrice: v.number(),
    paymentIntentId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const bookingId = await ctx.db.insert("bookings", {
      activityId: args.activityId,
      userId: args.userId,
      date: args.date,
      startTime: args.startTime,
      endTime: args.endTime,
      participants: args.participants,
      totalPrice: args.totalPrice,
      status: "PENDING",
      paymentIntentId: args.paymentIntentId,
    });

    return bookingId;
  },
});

// Update booking status
export const updateStatus = mutation({
  args: {
    id: v.id("bookings"),
    status: v.union(
      v.literal("PENDING"),
      v.literal("CONFIRMED"),
      v.literal("CANCELLED"),
      v.literal("COMPLETED")
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      status: args.status,
    });
  },
});

// Cancel a booking
export const cancel = mutation({
  args: { id: v.id("bookings") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      status: "CANCELLED",
    });
  },
});
