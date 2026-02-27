"use client";

import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import TypingIndicator from "./TypingIndicator";
import ChatHeader from "./ChatHeader";

export default function ChatWindow({
  conversationId,
}: {
  conversationId: string;
}) {
  return (
    <div className="flex flex-col h-full">
      <ChatHeader conversationId={conversationId} />
      <div className="flex-1 overflow-y-auto p-4">
        <MessageList conversationId={conversationId} />
        <TypingIndicator />
      </div>
      <div className="border-t p-3">
        <MessageInput conversationId={conversationId} />
      </div>
    </div>
  );
}
