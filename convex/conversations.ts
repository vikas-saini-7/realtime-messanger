import { query } from "./_generated/server";

import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const getConversations = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) return [];

    const memberships = await ctx.db
      .query("conversationMembers")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    const conversations = await Promise.all(
      memberships.map((m) => ctx.db.get(m.conversationId)),
    );

    return conversations;
  },
});

export const createOrGetConversation = mutation({
  args: {
    otherUserId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    console.log("Identity:", identity);
    if (!identity) throw new Error("Unauthorized");

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!currentUser) throw new Error("User not found");

    // Check if conversation already exists
    const memberships = await ctx.db
      .query("conversationMembers")
      .withIndex("by_user", (q) => q.eq("userId", currentUser._id))
      .collect();

    for (const membership of memberships) {
      const otherMembership = await ctx.db
        .query("conversationMembers")
        .withIndex("by_user_conversation", (q) =>
          q
            .eq("userId", args.otherUserId)
            .eq("conversationId", membership.conversationId),
        )
        .unique();

      if (otherMembership) {
        return membership.conversationId;
      }
    }

    // Create new conversation
    const conversationId = await ctx.db.insert("conversations", {
      isGroup: false,
      createdAt: Date.now(),
    });

    await ctx.db.insert("conversationMembers", {
      conversationId,
      userId: currentUser._id,
      lastReadAt: Date.now(),
    });

    await ctx.db.insert("conversationMembers", {
      conversationId,
      userId: args.otherUserId,
      lastReadAt: Date.now(),
    });

    return conversationId;
  },
});
