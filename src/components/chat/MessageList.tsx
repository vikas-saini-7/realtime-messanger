"use client";

import { useQuery } from "convex/react";
import { useEffect, useRef } from "react";
import MessageItem from "./MessageItem";
import { api } from "../../../convex/_generated/api";
import type { MessageListProps } from "../../types/chat";
import type { Id } from "../../../convex/_generated/dataModel";

export default function MessageList({ conversationId }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  const messages = useQuery(
    api.messages.getMessages,
    conversationId
      ? { conversationId: conversationId as Id<"conversations"> }
      : "skip"
  );

  const currentUser = useQuery(api.users.getCurrentUser);

  useEffect(() => {
    if (messages) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (!conversationId) return <div>No conversation selected.</div>;
  if (!messages || !currentUser) return <div>Loading...</div>;

  return (
    <div className="space-y-3">
      {messages.map((msg) => (
        <MessageItem
          key={msg._id}
          message={{
            ...msg,
            isOwn: msg.senderId === currentUser._id,
          }}
        />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}