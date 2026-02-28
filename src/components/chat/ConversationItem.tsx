"use client";
import Avatar from "../common/Avatar";
import UnreadBadge from "./UnreadBadge";

import type { ConversationItemProps } from "../../types/chat";
import { useParams, useRouter } from "next/navigation";
import { formatMessageTime } from "@/lib/format-times";
import { useSidebar } from "@/providers/SidebarContext";

export default function ConversationItem({
  conversation,
}: ConversationItemProps) {
  const { isSidebarOpen, setSidebarOpen } = useSidebar();

  const router = useRouter();

  const params = useParams();
  const activeId = params?.conversationId;
  const isActive = activeId === conversation._id;
  const handleLinkClick = () => {
    if (isSidebarOpen && window.innerWidth < 768) {
      setSidebarOpen(false);
    }

    router.push(`/chat/${conversation._id}`);
  };
  return (
    <div
      onClick={handleLinkClick}
      className={`flex items-center border border-transparent gap-3 p-3 rounded-lg transition ${
        isActive
          ? "bg-white md:bg-gray-100 border-gray-500/10"
          : "hover:bg-white md:hover:bg-gray-100"
      }`}
    >
      <Avatar
        src={conversation.image}
        className="w-10 h-10 rounded-xl border border-gray-200 object-cover shadow-sm"
      />

      <div className="flex-1">
        <div className="flex justify-between">
          <span className="font-medium">{conversation.name}</span>
          <span className="text-xs text-gray-500">
            {conversation.lastMessageAt
              ? formatMessageTime(conversation.lastMessageAt)
              : ""}
          </span>
        </div>

        <p className="text-sm text-gray-500 truncate">
          {conversation.lastMessage
            ? conversation.lastMessage.length > 30
              ? conversation.lastMessage.slice(0, 30) + "..."
              : conversation.lastMessage
            : "No messages yet"}
        </p>
      </div>

      <UnreadBadge count={conversation.unreadCount} />
    </div>
  );
}
