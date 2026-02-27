"use client";
import ChatWindow from "@/components/chat/ChatWindow";
import { useParams } from "next/navigation";
import { Id } from "../../../../convex/_generated/dataModel";

export default function ChatPage() {
  const params = useParams();
  let conversationId = params?.conversationId;
  if (Array.isArray(conversationId)) conversationId = conversationId[0];

  if (!conversationId) return <div>No conversation selected.</div>;

  return <ChatWindow conversationId={conversationId as Id<"conversations">} />;
}
