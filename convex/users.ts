import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Store or update user from Clerk in Convex database
export const store = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Check if user already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (existingUser) {
      // Update existing user
      await ctx.db.patch(existingUser._id, {
        name: identity.name,
        email: identity.email,
        image: identity.pictureUrl,
      });
      return existingUser._id;
    }

    // Create new user
    const userId = await ctx.db.insert("users", {
      clerkId: identity.subject,
      email: identity.email!,
      name: identity.name,
      image: identity.pictureUrl,
      role: "GUEST", // Default role
    });

    return userId;
  },
});

// Get current user
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      return null;
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    return user;
  },
});

// Get user by ID
export const getById = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    return await ctx.db.get(userId);
  },
});

// Update user profile
export const updateProfile = mutation({
  args: {
    bio: v.optional(v.string()),
    phone: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    await ctx.db.patch(user._id, args);

    return user._id;
  },
});

// Update user role (admin only)
export const updateRole = mutation({
  args: {
    userId: v.id("users"),
    role: v.union(v.literal("GUEST"), v.literal("HOST"), v.literal("ADMIN")),
  },
  handler: async (ctx, { userId, role }) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Get current user to check if they're admin
    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!currentUser || currentUser.role !== "ADMIN") {
      throw new Error("Not authorized");
    }

    await ctx.db.patch(userId, { role });

    return userId;
  },
});
