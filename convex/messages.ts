import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getMessages = query({
  args: {
    conversationId: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) =>
        q.eq("conversationId", args.conversationId),
      )
      .order("asc")
      .collect();
  },
});

export const sendMessage = mutation({
  args: {
    conversationId: v.id("conversations"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) throw new Error("User not found");

    const now = Date.now();

    await ctx.db.insert("messages", {
      conversationId: args.conversationId,
      senderId: user._id,
      content: args.content,
      createdAt: now,
      isDeleted: false,
    });

    // Update conversation preview
    await ctx.db.patch(args.conversationId, {
      lastMessage: args.content,
      lastMessageAt: now,
    });
  },
});

// Soft delete own message
export const deleteMessage = mutation({
  args: {
    messageId: v.id("messages"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    // Get message
    const message = await ctx.db.get(args.messageId);
    if (!message) throw new Error("Message not found");

    // Get user
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();
    if (!user) throw new Error("User not found");

    // Only sender can delete
    if (message.senderId !== user._id) throw new Error("Forbidden");

    await ctx.db.patch(args.messageId, {
      isDeleted: true,
      updatedAt: Date.now(),
    });
  },
});

// Get reactions for a message
export const getReactions = query({
  args: {
    messageId: v.id("messages"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("reactions")
      .withIndex("by_message", (q) => q.eq("messageId", args.messageId))
      .collect();
  },
});

// Add or remove reaction
export const toggleReaction = mutation({
  args: {
    messageId: v.id("messages"),
    emoji: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();
    if (!user) throw new Error("User not found");

    // Get all reactions for this user on this message
    const allUserReactions = await ctx.db
      .query("reactions")
      .withIndex("by_user_message", (q) =>
        q.eq("userId", user._id).eq("messageId", args.messageId),
      )
      .collect();

    // Check if the user already reacted with this emoji
    const existing = allUserReactions.find((r) => r.emoji === args.emoji);

    if (existing) {
      // Remove only this reaction
      await ctx.db.delete(existing._id);
    } else {
      // Remove all previous reactions for this user on this message
      for (const r of allUserReactions) {
        await ctx.db.delete(r._id);
      }
      // Add new reaction
      await ctx.db.insert("reactions", {
        messageId: args.messageId,
        userId: user._id,
        emoji: args.emoji,
      });
    }
  },
});
