import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // ==============================
  // USERS
  // ==============================
  users: defineTable({
    clerkId: v.string(),
    name: v.string(),
    email: v.string(),
    image: v.string(),

    // Presence
    isOnline: v.boolean(),
    lastSeen: v.number(),
  })
    .index("by_clerkId", ["clerkId"])
    .index("by_email", ["email"])
    .index("by_isOnline", ["isOnline"]),

  // ==============================
  // CONVERSATIONS
  // ==============================
  conversations: defineTable({
    isGroup: v.boolean(),
    name: v.optional(v.string()),
    createdAt: v.number(),
    createdBy: v.id("users"),

    // Cached sidebar preview (optimization)
    lastMessage: v.optional(v.string()),
    lastMessageAt: v.optional(v.number()),
  }).index("by_lastMessageAt", ["lastMessageAt"]),

  // ==============================
  // CONVERSATION MEMBERS
  // (Normalized structure — supports unread & groups)
  // ==============================
  conversationMembers: defineTable({
    conversationId: v.id("conversations"),
    userId: v.id("users"),

    // For unread badge
    lastReadAt: v.number(),
  })
    .index("by_conversation", ["conversationId"])
    .index("by_user", ["userId"])
    .index("by_user_conversation", ["userId", "conversationId"]),

  // ==============================
  // MESSAGES
  // ==============================
  messages: defineTable({
    conversationId: v.id("conversations"),
    senderId: v.id("users"),

    content: v.string(),

    createdAt: v.number(),
    updatedAt: v.optional(v.number()),

    // Soft delete
    isDeleted: v.boolean(),
  })
    .index("by_conversation", ["conversationId"])
    .index("by_sender", ["senderId"]),

  // ==============================
  // TYPING INDICATOR
  // ==============================
  typing: defineTable({
    conversationId: v.id("conversations"),
    userId: v.id("users"),
    isTyping: v.boolean(),
    updatedAt: v.number(),
  })
    .index("by_conversation", ["conversationId"])
    .index("by_user_conversation", ["userId", "conversationId"]),

  // ==============================
  // MESSAGE REACTIONS (Optional Feature 12)
  // ==============================
  reactions: defineTable({
    messageId: v.id("messages"),
    userId: v.id("users"),
    emoji: v.string(),
  })
    .index("by_message", ["messageId"])
    .index("by_user_message", ["userId", "messageId"]),
});
