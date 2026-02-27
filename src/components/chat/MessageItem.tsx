import type { MessageItemProps } from "../../types/chat";
import { formatMessageTime } from "@/lib/format-times";

export default function MessageItem({ message }: MessageItemProps) {
  const { isOwn } = message;

  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-xs px-4 py-2 rounded-2xl text-sm ${
          isOwn ? "bg-gray-500/10 text-gray-900 rounded-tr-sm" : "bg-white text-gray-800 rounded-tl-sm"
        }`}
      >
        {message.isDeleted ? <i>This message was deleted</i> : message.content}

        <div className="text-[10px] mt-1 opacity-70 text-right min-w-[50px]">
          {formatMessageTime(message.createdAt)}
        </div>
      </div>
    </div>
  );
}
