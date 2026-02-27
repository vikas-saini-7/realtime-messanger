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
    <div className="flex flex-col h-full  border-l">
      <ChatHeader conversationId={conversationId} />
      <div className="flex-1 overflow-y-auto p-4 bg-gray-500/10">
        <MessageList conversationId={conversationId} />
        <TypingIndicator />
      </div>
      <div className=" p-3 bg-gray-500/10">
        <MessageInput conversationId={conversationId} />
      </div>
    </div>
  );
}
