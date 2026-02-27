import Link from "next/link";
import Avatar from "../common/Avatar";
import UnreadBadge from "./UnreadBadge";

import type { ConversationItemProps } from "../../types/chat";
import { useParams } from "next/navigation";
import { formatMessageTime } from "@/lib/format-times";

export default function ConversationItem({
  conversation,
}: ConversationItemProps) {
  const params = useParams();
  const activeId = params?.conversationId;
  const isActive = activeId === conversation._id;
  return (
    <Link
      href={`/chat/${conversation._id}`}
      className={`flex items-center border border-transparent gap-3 p-3 rounded-lg transition ${
        isActive ? "bg-gray-100 border-gray-500/10" : "hover:bg-gray-100"
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
          {conversation.lastMessage}
        </p>
      </div>

      <UnreadBadge count={conversation.unreadCount} />
    </Link>
  );
}
