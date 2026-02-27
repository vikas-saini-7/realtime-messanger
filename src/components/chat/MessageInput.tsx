"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { MessageInputProps } from "../../types/chat";
import type { Id } from "../../../convex/_generated/dataModel";

export default function MessageInput({ conversationId }: MessageInputProps) {
  const [text, setText] = useState("");

  const sendMessage = useMutation(api.messages.sendMessage);

  const handleSend = async () => {
    if (!text.trim()) return;
    if (!conversationId) {
      alert("No conversation selected.");
      return;
    }
    try {
      await sendMessage({
        conversationId: conversationId as Id<"conversations">,
        content: text,
      });
      setText("");
    } catch (err) {
      alert("Failed to send message.");
    }
  };

  return (
    <div className="flex gap-2">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSend();
        }}
        placeholder="Type a message..."
        className="flex-1 px-3 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={handleSend}
        className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
      >
        Send
      </button>
    </div>
  );
}
