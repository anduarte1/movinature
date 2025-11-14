import { v } from "convex/values";
import { query } from "./_generated/server";

// Get all categories
export const list = query({
  handler: async (ctx) => {
    const categories = await ctx.db.query("categories").collect();
    return categories;
  },
});

// Get a single category by ID
export const getById = query({
  args: { id: v.id("categories") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Get a category by slug
export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const category = await ctx.db
      .query("categories")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
    return category;
  },
});

// Get categories with activity counts
export const listWithCounts = query({
  handler: async (ctx) => {
    const categories = await ctx.db.query("categories").collect();

    const categoriesWithCounts = await Promise.all(
      categories.map(async (category) => {
        const activityCount = await ctx.db
          .query("activities")
          .withIndex("by_category", (q) => q.eq("categoryId", category._id))
          .filter((q) => q.eq(q.field("active"), true))
          .collect();

        return {
          ...category,
          activityCount: activityCount.length,
        };
      })
    );

    return categoriesWithCounts;
  },
});
