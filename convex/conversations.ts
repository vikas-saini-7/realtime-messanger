import { query } from "./_generated/server";
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const getConversation = query({
  args: {
    conversationId: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.conversationId);
  },
});

export const getConversations = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!currentUser) return [];

    // 1️⃣ Get memberships
    const memberships = await ctx.db
      .query("conversationMembers")
      .withIndex("by_user", (q) => q.eq("userId", currentUser._id))
      .collect();

    const results = [];

    for (const membership of memberships) {
      const conversation = await ctx.db.get(membership.conversationId);
      if (!conversation) continue;

      // 2️⃣ Get other member
      const members = await ctx.db
        .query("conversationMembers")
        .withIndex("by_conversation", (q) =>
          q.eq("conversationId", conversation._id),
        )
        .collect();

      const otherMember = members.find((m) => m.userId !== currentUser._id);

      const otherUser = otherMember
        ? await ctx.db.get(otherMember.userId)
        : null;

      // 3️⃣ Calculate unread count
      const unreadMessages = await ctx.db
        .query("messages")
        .withIndex("by_conversation", (q) =>
          q.eq("conversationId", conversation._id),
        )
        .filter((q) => q.gt(q.field("createdAt"), membership.lastReadAt))
        .collect();

      results.push({
        _id: conversation._id,
        name: conversation.isGroup
          ? conversation.name
          : (otherUser?.name ?? "Unknown"),
        image: conversation.isGroup ? "" : (otherUser?.image ?? ""),
        lastMessage: conversation.lastMessage ?? "",
        lastMessageAt: conversation.lastMessageAt ?? 0,
        unreadCount: unreadMessages.length,
      });
    }

    // 4️⃣ Sort by latest message
    return results.sort((a, b) => b.lastMessageAt - a.lastMessageAt);
  },
});

export const createOrGetConversation = mutation({
  args: {
    otherUserId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    console.log("[DEBUG] Identity:", identity);
    if (!identity) {
      console.error("[DEBUG] Unauthorized: No identity");
      throw new Error("Unauthorized");
    }

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();
    console.log("[DEBUG] currentUser:", currentUser);

    if (!currentUser) {
      console.error("[DEBUG] User not found for clerkId:", identity.subject);
      throw new Error("User not found");
    }

    // Check if conversation already exists
    const memberships = await ctx.db
      .query("conversationMembers")
      .withIndex("by_user", (q) => q.eq("userId", currentUser._id))
      .collect();
    console.log("[DEBUG] memberships:", memberships);

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
        console.log(
          "[DEBUG] Existing conversation found:",
          membership.conversationId,
        );
        return membership.conversationId;
      }
    }

    // Validate other user exists
    const otherUser = await ctx.db.get(args.otherUserId);
    console.log("[DEBUG] otherUser:", otherUser);
    if (!otherUser) {
      console.error("[DEBUG] Other user not found:", args.otherUserId);
      throw new Error("Other user not found");
    }

    // Create new conversation
    const conversationId = await ctx.db.insert("conversations", {
      isGroup: false,
      createdAt: Date.now(),
      createdBy: currentUser._id,
    });
    console.log("[DEBUG] Created conversationId:", conversationId);

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
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!currentUser) {
      throw new Error("User not found");
    }

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

    // Validate other user exists
    const otherUser = await ctx.db.get(args.otherUserId);
    if (!otherUser) {
      throw new Error("Other user not found");
    }

    // Create new conversation
    const conversationId = await ctx.db.insert("conversations", {
      isGroup: false,
      createdAt: Date.now(),
      createdBy: currentUser._id,
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
