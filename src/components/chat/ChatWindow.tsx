"use client";

import { useEffect } from "react";
import { useMutation } from "convex/react";

import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import TypingIndicator from "./TypingIndicator";
import ChatHeader from "./ChatHeader";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

export default function ChatWindow({
  conversationId,
}: {
  conversationId: Id<"conversations">;
}) {
  const markAsRead = useMutation(api.conversations.markAsRead);

  useEffect(() => {
    if (!conversationId) return;

    markAsRead({ conversationId });
  }, [conversationId, markAsRead]);

  return (
    <div className="flex flex-col h-full">
      <ChatHeader conversationId={conversationId} />

      <div className="flex-1 overflow-y-auto p-4 bg-gray-500/10">
        <MessageList conversationId={conversationId} />
        <TypingIndicator conversationId={conversationId} />
      </div>

      <div className="p-3 bg-gray-500/10">
        <MessageInput conversationId={conversationId} />
      </div>
    </div>
  );
}
