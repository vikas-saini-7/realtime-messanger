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
      : "skip",
  );

  const currentUser = useQuery(api.users.getCurrentUser);

  useEffect(() => {
    if (messages) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (!conversationId) return <div>No conversation selected.</div>;
  if (!messages || !currentUser)
    return (
      <div className="space-y-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className={`flex ${i % 2 === 0 ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xs px-4 py-3 rounded-2xl animate-pulse ${
                i % 2 === 0
                  ? "bg-gray-500/10 text-transparent"
                  : "bg-white/50 text-transparent"
              }`}
              style={{ width: 180 + (i % 3) * 40, height: 28 }}
            >
              ...
            </div>
          </div>
        ))}
      </div>
    );

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
