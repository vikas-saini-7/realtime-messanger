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
        className="w-full px-4 py-2 border border-gray-100 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-200 bg-white text-gray-900 placeholder-gray-400 transition"
        autoComplete="off"
      />
      <button
        onClick={handleSend}
        className="px-4 py-2 bg-gray-900 text-white rounded-xl shadow-sm hover:bg-gray-700 disabled:bg-gray-200 disabled:text-gray-400 transition"
      >
        Send
      </button>
    </div>
  );
}
