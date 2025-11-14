import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Get all active activities with filters
export const list = query({
  args: {
    categoryId: v.optional(v.id("categories")),
    featured: v.optional(v.boolean()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let activitiesQuery = ctx.db
      .query("activities")
      .filter((q) => q.eq(q.field("active"), true));

    if (args.categoryId) {
      activitiesQuery = activitiesQuery.filter((q) =>
        q.eq(q.field("categoryId"), args.categoryId)
      );
    }

    if (args.featured !== undefined) {
      activitiesQuery = activitiesQuery.filter((q) =>
        q.eq(q.field("featured"), args.featured)
      );
    }

    const activities = await activitiesQuery.collect();

    // Get category and host info for each activity
    const activitiesWithDetails = await Promise.all(
      activities.map(async (activity) => {
        const category = await ctx.db.get(activity.categoryId);
        const host = await ctx.db.get(activity.hostId);

        // Get average rating
        const reviews = await ctx.db
          .query("reviews")
          .withIndex("by_activity", (q) => q.eq("activityId", activity._id))
          .collect();

        const avgRating = reviews.length > 0
          ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
          : 0;

        return {
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

    if (args.limit) {
      return activitiesWithDetails.slice(0, args.limit);
    }

    return activitiesWithDetails;
  },
});

// Get a single activity by ID
export const getById = query({
  args: { id: v.id("activities") },
  handler: async (ctx, args) => {
    const activity = await ctx.db.get(args.id);
    if (!activity) return null;

    const category = await ctx.db.get(activity.categoryId);
    const host = await ctx.db.get(activity.hostId);

    // Get reviews
    const reviews = await ctx.db
      .query("reviews")
      .withIndex("by_activity", (q) => q.eq("activityId", args.id))
      .collect();

    // Get reviewer details
    const reviewsWithUsers = await Promise.all(
      reviews.map(async (review) => {
        const user = await ctx.db.get(review.userId);
        return {
          id: review._id,
          rating: review.rating,
          comment: review.comment || "",
          user: {
            name: user?.name || "Anonymous",
            image: user?.image || "",
          },
          createdAt: review._creationTime,
        };
      })
    );

    const avgRating = reviews.length > 0
      ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
      : 0;

    return {
      ...activity,
      category: category?.name || "Unknown",
      categorySlug: category?.slug || "unknown",
      host: {
        name: host?.name || "Unknown Host",
        image: host?.image || "",
        bio: host?.bio || "",
      },
      rating: Math.round(avgRating * 10) / 10,
      reviewCount: reviews.length,
      reviews: reviewsWithUsers,
    };
  },
});

// Get featured activities for homepage
export const getFeatured = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const activities = await ctx.db
      .query("activities")
      .withIndex("by_featured", (q) => q.eq("featured", true))
      .filter((q) => q.eq(q.field("active"), true))
      .collect();

    const activitiesWithDetails = await Promise.all(
      activities.map(async (activity) => {
        const category = await ctx.db.get(activity.categoryId);
        const host = await ctx.db.get(activity.hostId);

        const reviews = await ctx.db
          .query("reviews")
          .withIndex("by_activity", (q) => q.eq("activityId", activity._id))
          .collect();

        const avgRating = reviews.length > 0
          ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
          : 0;

        return {
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

    if (args.limit) {
      return activitiesWithDetails.slice(0, args.limit);
    }

    return activitiesWithDetails;
  },
});

// Get activities by host
export const getByHost = query({
  args: { hostId: v.id("users") },
  handler: async (ctx, args) => {
    const activities = await ctx.db
      .query("activities")
      .withIndex("by_host", (q) => q.eq("hostId", args.hostId))
      .collect();

    return activities;
  },
});

// Search activities (simple text search)
export const search = query({
  args: {
    query: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const allActivities = await ctx.db
      .query("activities")
      .filter((q) => q.eq(q.field("active"), true))
      .collect();

    const searchLower = args.query.toLowerCase();
    const filtered = allActivities.filter(
      (activity) =>
        activity.title.toLowerCase().includes(searchLower) ||
        activity.description.toLowerCase().includes(searchLower) ||
        activity.location.toLowerCase().includes(searchLower)
    );

    const activitiesWithDetails = await Promise.all(
      filtered.map(async (activity) => {
        const category = await ctx.db.get(activity.categoryId);
        const host = await ctx.db.get(activity.hostId);

        const reviews = await ctx.db
          .query("reviews")
          .withIndex("by_activity", (q) => q.eq("activityId", activity._id))
          .collect();

        const avgRating = reviews.length > 0
          ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
          : 0;

        return {
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

    if (args.limit) {
      return activitiesWithDetails.slice(0, args.limit);
    }

    return activitiesWithDetails;
  },
});
