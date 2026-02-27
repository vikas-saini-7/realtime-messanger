import { query } from "./_generated/server";
import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const createUser = mutation({
  args: {
    clerkId: v.string(),
    name: v.string(),
    email: v.string(),
    image: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    if (!existing) {
      await ctx.db.insert("users", {
        clerkId: args.clerkId,
        name: args.name,
        email: args.email,
        image: args.image,
        isOnline: true,
        lastSeen: Date.now(),
      });
    }
  },
});

export const getCurrentUser = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    return await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();
  },
});

export const searchUsers = query({
  args: {
    search: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    let currentUserId = null;
    if (identity) {
      const currentUser = await ctx.db
        .query("users")
        .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
        .unique();
      currentUserId = currentUser?._id;
    }

    const search = args.search.trim().toLowerCase();
    const users = await ctx.db.query("users").collect();

    // Exclude current user
    const filteredUsers = users.filter((user) => user._id !== currentUserId);

    // If blank → return all users except current
    if (search === "") {
      return filteredUsers;
    }

    // Otherwise filter
    return filteredUsers.filter((user) =>
      user.name.toLowerCase().includes(search),
    );
  },
});

export const getUser = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.userId);
  },
});

// Mutations for online/offline status
export const setUserOnline = mutation({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, { isOnline: true, lastSeen: Date.now() });
  },
});

export const setUserOffline = mutation({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, { isOnline: false, lastSeen: Date.now() });
  },
});
