"use client";

import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import TypingIndicator from "./TypingIndicator";

export default function ChatWindow() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4">
        <MessageList />
        <TypingIndicator />
      </div>

      <div className="border-t p-3">
        <MessageInput />
      </div>
    </div>
  );
}