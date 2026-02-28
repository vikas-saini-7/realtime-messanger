import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Set typing state for a user in a conversation
export const setTyping = mutation({
  args: {
    conversationId: v.id("conversations"),
    userId: v.id("users"),
    isTyping: v.boolean(),
  },
  handler: async (ctx, args) => {
    // Upsert typing state
    const existing = await ctx.db
      .query("typing")
      .withIndex("by_user_conversation", (q) =>
        q.eq("userId", args.userId).eq("conversationId", args.conversationId),
      )
      .first();
    if (existing) {
      await ctx.db.patch(existing._id, {
        isTyping: args.isTyping,
        updatedAt: Date.now(),
      });
    } else {
      await ctx.db.insert("typing", {
        conversationId: args.conversationId,
        userId: args.userId,
        isTyping: args.isTyping,
        updatedAt: Date.now(),
      });
    }
  },
});

// Query typing users in a conversation (excluding current user)
export const getTypingUsers = query({
  args: {
    conversationId: v.id("conversations"),
    excludeUserId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const twoSecondsAgo = now - 2000;
    const typingUsers = await ctx.db
      .query("typing")
      .withIndex("by_conversation", (q) =>
        q.eq("conversationId", args.conversationId),
      )
      .collect();
    return typingUsers.filter(
      (t) =>
        t.isTyping &&
        t.updatedAt > twoSecondsAgo &&
        (!args.excludeUserId || t.userId !== args.excludeUserId),
    );
  },
});
