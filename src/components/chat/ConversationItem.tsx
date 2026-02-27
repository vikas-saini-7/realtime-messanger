import Link from "next/link";
import Avatar from "../common/Avatar";
import UnreadBadge from "./UnreadBadge";
import type { ConversationItemProps } from "../../types/chat";

export default function ConversationItem({
  conversation,
}: ConversationItemProps) {
  return (
    <Link
      href={`/chat/${conversation._id}`}
      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition"
    >
      <Avatar src={conversation.image} />

      <div className="flex-1">
        <div className="flex justify-between">
          <span className="font-medium">{conversation.name}</span>
          <span className="text-xs text-gray-500">
            {conversation.lastMessageAt}
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
