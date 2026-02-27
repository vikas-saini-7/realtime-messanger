"use client";

import { useQuery } from "convex/react";
import { useEffect, useRef } from "react";
import MessageItem from "./MessageItem";
import { useUser } from "@clerk/nextjs";
import { api } from "../../../convex/_generated/api";
import type { MessageListProps } from "../../types/chat";
import type { Id } from "../../../convex/_generated/dataModel";

export default function MessageList({ conversationId }: MessageListProps) {
  const { user } = useUser();
  const bottomRef = useRef<HTMLDivElement>(null);
  // Always call hooks at top-level
  const messages = useQuery(api.messages.getMessages, {
    conversationId: conversationId as Id<"conversations">,
  });

  useEffect(() => {
    if (messages) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (!conversationId) return <div>No conversation selected.</div>;
  if (!messages) return <div>Loading...</div>;

  return (
    <div className="space-y-3">
      {messages.map((msg) => (
        <MessageItem
          key={msg._id}
          message={{
            ...msg,
            isOwn: msg.senderId === user?.id,
          }}
        />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
