import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Get all favorites for a user
export const getByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const favorites = await ctx.db
      .query("favorites")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    // Get activity details for each favorite
    const favoritesWithDetails = await Promise.all(
      favorites.map(async (favorite) => {
        const activity = await ctx.db.get(favorite.activityId);
        if (!activity || !activity.active) return null;

        const category = await ctx.db.get(activity.categoryId);
        const host = await ctx.db.get(activity.hostId);

        // Get reviews
        const reviews = await ctx.db
          .query("reviews")
          .withIndex("by_activity", (q) => q.eq("activityId", activity._id))
          .collect();

        const avgRating = reviews.length > 0
          ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
          : 0;

        return {
          favoriteId: favorite._id,
          ...activity,
          category: category?.name || "Unknown",
          categorySlug: category?.slug || "unknown",
          host: {
            name: host?.name || "Unknown Host",
            image: host?.image || "",
          },
          rating: Math.round(avgRating * 10) / 10,
          reviewCount: reviews.length,
        };
      })
    );

    return favoritesWithDetails.filter((f) => f !== null);
  },
});

// Check if an activity is favorited by a user
export const isFavorited = query({
  args: {
    userId: v.id("users"),
    activityId: v.id("activities"),
  },
  handler: async (ctx, args) => {
    const favorite = await ctx.db
      .query("favorites")
      .withIndex("by_user_and_activity", (q) =>
        q.eq("userId", args.userId).eq("activityId", args.activityId)
      )
      .first();

    return favorite !== null;
  },
});

// Add an activity to favorites
export const add = mutation({
  args: {
    userId: v.id("users"),
    activityId: v.id("activities"),
  },
  handler: async (ctx, args) => {
    // Check if already favorited
    const existing = await ctx.db
      .query("favorites")
      .withIndex("by_user_and_activity", (q) =>
        q.eq("userId", args.userId).eq("activityId", args.activityId)
      )
      .first();

    if (existing) {
      return existing._id;
    }

    const favoriteId = await ctx.db.insert("favorites", {
      userId: args.userId,
      activityId: args.activityId,
    });

    return favoriteId;
  },
});

// Remove an activity from favorites
export const remove = mutation({
  args: {
    userId: v.id("users"),
    activityId: v.id("activities"),
  },
  handler: async (ctx, args) => {
    const favorite = await ctx.db
      .query("favorites")
      .withIndex("by_user_and_activity", (q) =>
        q.eq("userId", args.userId).eq("activityId", args.activityId)
      )
      .first();

    if (favorite) {
      await ctx.db.delete(favorite._id);
      return true;
    }

    return false;
  },
});

// Toggle favorite status
export const toggle = mutation({
  args: {
    userId: v.id("users"),
    activityId: v.id("activities"),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("favorites")
      .withIndex("by_user_and_activity", (q) =>
        q.eq("userId", args.userId).eq("activityId", args.activityId)
      )
      .first();

    if (existing) {
      await ctx.db.delete(existing._id);
      return { action: "removed", favorited: false };
    } else {
      await ctx.db.insert("favorites", {
        userId: args.userId,
        activityId: args.activityId,
      });
      return { action: "added", favorited: true };
    }
  },
});
