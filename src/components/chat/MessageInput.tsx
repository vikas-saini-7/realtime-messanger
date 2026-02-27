"use client";

import { useState, useRef, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { MessageInputProps } from "../../types/chat";
import type { Id } from "../../../convex/_generated/dataModel";

export default function MessageInput({ conversationId }: MessageInputProps) {
  const [text, setText] = useState("");
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);
  const sendMessage = useMutation(api.messages.sendMessage);
  const setTyping = useMutation(api.typing.setTyping);
  const currentUser = useQuery(api.users.getCurrentUser);

  // Helper to set typing state
  const triggerTyping = (isTyping: boolean) => {
    if (!currentUser || !currentUser._id) return;
    setTyping({
      conversationId: conversationId as Id<"conversations">,
      userId: currentUser._id as Id<"users">,
      isTyping,
    });
  };

  // On input change, set typing true and debounce to false
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
    triggerTyping(true);
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      triggerTyping(false);
    }, 2000);
  };

  // On send, set typing false
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
      triggerTyping(false);
      if (typingTimeout.current) clearTimeout(typingTimeout.current);
    } catch (err) {
      alert("Failed to send message.");
    }
  };

  // On unmount, clear typing
  useEffect(() => {
    return () => {
      triggerTyping(false);
      if (typingTimeout.current) clearTimeout(typingTimeout.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex gap-2">
      <input
        value={text}
        onChange={handleInputChange}
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
