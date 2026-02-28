"use client";

import { useQuery, useMutation } from "convex/react";
import { useEffect, useRef } from "react";
import MessageItem from "./MessageItem";
import { api } from "../../../convex/_generated/api";
import type { MessageListProps } from "../../types/chat";
import type { Id } from "../../../convex/_generated/dataModel";
import MessageListSkeleton from "../skeletons/MessageListSkeleton";

export default function MessageList({ conversationId }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  const messages = useQuery(
    api.messages.getMessages,
    conversationId
      ? { conversationId: conversationId as Id<"conversations"> }
      : "skip",
  );

  const currentUser = useQuery(api.users.getCurrentUser);
  const markAsRead = useMutation(api.conversations.markAsRead);

  useEffect(() => {
    if (!messages || !conversationId || !currentUser) return;

    // Scroll to bottom
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });

    // 🔥 Only mark as read if last message is NOT from current user
    const lastMessage = messages[messages.length - 1];

    if (lastMessage && lastMessage.senderId !== currentUser._id) {
      markAsRead({
        conversationId: conversationId as Id<"conversations">,
      });
    }
  }, [messages, conversationId, currentUser, markAsRead]);

  if (!conversationId) return <div>No conversation selected.</div>;

  if (!messages || !currentUser)
    return (
      <MessageListSkeleton />
    );
  console.log("messages", messages);

  return (
    <div className="space-y-3">
      {messages.map((msg) => (
        <MessageItem
          key={msg._id}
          message={{
            ...msg,
            isOwn: msg.senderId === currentUser._id,
          }}
          currentUserId={currentUser._id}
        />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
