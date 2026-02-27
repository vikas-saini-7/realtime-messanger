import Avatar from "../common/Avatar";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

interface ChatHeaderProps {
  conversationId: string;
}

export default function ChatHeader({ conversationId }: ChatHeaderProps) {
  const header = useQuery(api.conversations.getConversationHeader, {
    conversationId: conversationId as any,
  });
  if (!header) return <div className="p-4 border-b bg-white">Loading...</div>;
  const { conversation, partnerUser } = header;
  return (
    <div className="flex items-center justify-between p-4 border-b bg-white">
      <div className="flex items-center gap-3">
        <Avatar src={partnerUser?.image || "/avatar.png"} />
        <div>
          <div className="font-semibold text-lg">
            {partnerUser?.name || conversation.name || "Chat"}
          </div>
          <div className="text-xs text-green-500 flex items-center gap-1">
            <span
              className={`w-2 h-2 rounded-full ${partnerUser?.isOnline ? "bg-green-500" : "bg-gray-400"} inline-block`}
            />
            {partnerUser?.isOnline ? "Active" : "Offline"}
          </div>
        </div>
      </div>
      <button className="p-2 rounded-full hover:bg-gray-100">
        <svg
          width="24"
          height="24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="feather feather-more-vertical"
        >
          <circle cx="12" cy="12" r="1" />
          <circle cx="12" cy="5" r="1" />
          <circle cx="12" cy="19" r="1" />
        </svg>
      </button>
    </div>
  );
}
