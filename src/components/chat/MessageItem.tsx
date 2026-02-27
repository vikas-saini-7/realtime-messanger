import Avatar from "../common/Avatar";
import type { MessageItemProps } from "../../types/chat";

export default function MessageItem({ message }: MessageItemProps) {
  const { isOwn } = message;

  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-xs px-4 py-2 rounded-2xl text-sm ${
          isOwn ? "bg-gray-500/10 text-gray-900" : "bg-white text-gray-800"
        }`}
      >
        {message.isDeleted ? <i>This message was deleted</i> : message.content}

        <div className="text-xs mt-1 opacity-70 text-right">
          {new Date(message.createdAt).toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit",
          })}
        </div>
      </div>
    </div>
  );
}
