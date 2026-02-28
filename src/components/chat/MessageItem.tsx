import type { Id } from "../../../convex/_generated/dataModel";
import type { MessageItemProps } from "../../types/chat";

interface MessageItemWithUserProps extends MessageItemProps {
  currentUserId: string;
}
import { formatMessageTime } from "@/lib/format-times";
import { toast } from "sonner";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState, useRef, useEffect } from "react";
// ...existing code...

export default function MessageItem({
  message,
  currentUserId,
}: MessageItemWithUserProps) {
  const [showMenu, setShowMenu] = useState(false);
  const { isOwn, isDeleted, _id } = message;
  const deleteMessage = useMutation(api.messages.deleteMessage);
  const toggleReaction = useMutation(api.messages.toggleReaction);
  const reactions = useQuery(api.messages.getReactions, {
    messageId: _id as Id<"messages">,
  });

  // Reaction counts and user reaction
  const reactionCounts: Record<string, number> = {};
  const userReactions: Record<string, boolean> = {};
  if (reactions) {
    reactions.forEach((r: { emoji: string; userId: string }) => {
      reactionCounts[r.emoji] = (reactionCounts[r.emoji] || 0) + 1;
      if (r.userId === currentUserId) {
        userReactions[r.emoji] = true;
      }
    });
  }
  const EMOJIS = ["👍", "❤️", "😂", "😮", "😢"];
  const [showPicker, setShowPicker] = useState(false);
  // Close reaction panel and dropdown when clicking outside
  const messageRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!showPicker && !showMenu) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (
        messageRef.current &&
        !messageRef.current.contains(event.target as Node)
      ) {
        if (showPicker) setShowPicker(false);
        if (showMenu) setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPicker, showMenu]);
  // pickerAnchorRef removed (unused)

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this message?"))
      return;
    try {
      await deleteMessage({ messageId: _id as Id<"messages"> });
      toast.success("Message deleted", { position: "top-right" });
    } catch {
      toast.error("Failed to delete message");
    }
  };

  // Only show emojis that have been reacted to
  const reactedEmojis = Object.keys(reactionCounts).filter(
    (emoji) => reactionCounts[emoji] > 0,
  );

  // Track which emoji the user reacted with
  const userReactionEmoji = Object.keys(userReactions).find(
    (e) => userReactions[e],
  );

  const handleReaction = async (emoji: string) => {
    // If user taps the same emoji, remove reaction
    if (userReactionEmoji === emoji) {
      await toggleReaction({ messageId: _id as Id<"messages">, emoji });
      setShowPicker(false);
      return;
    }
    // Otherwise, set new reaction
    await toggleReaction({ messageId: _id as Id<"messages">, emoji });
    setShowPicker(false);
  };

  // Long press event logic

  // Long press event logic for reaction panel
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);

  const handleLongPressStart = () => {
    longPressTimer.current = setTimeout(() => {
      setShowPicker(true);
    }, 600); // 600ms threshold
  };

  const handleLongPressEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
      <div
        ref={messageRef}
        className={`max-w-xs relative px-4 py-2 rounded-2xl text-sm ${
          isOwn
            ? "bg-gray-500/10 text-gray-900 rounded-tr-sm"
            : "bg-white text-gray-800 rounded-tl-sm"
        } ${!isDeleted && reactedEmojis.length > 0 ? "mb-2" : ""}`}
        onMouseDown={handleLongPressStart}
        onMouseUp={handleLongPressEnd}
        onMouseLeave={handleLongPressEnd}
        onTouchStart={handleLongPressStart}
        onTouchEnd={handleLongPressEnd}
        onTouchCancel={handleLongPressEnd}
      >
        {/* Dropdown menu trigger (three dots) */}
        {!isDeleted && (
          <button
            className={`absolute top-2 ${isOwn ? "right-[calc(100%+4px)]" : "left-[calc(100%+4px)]"} w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-700 bg-transparent`}
            style={{ zIndex: 10 }}
            onClick={() => setShowMenu((v) => !v)}
            aria-label="Open message menu"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="4" cy="9" r="1.5" fill="currentColor" />
              <circle cx="9" cy="9" r="1.5" fill="currentColor" />
              <circle cx="14" cy="9" r="1.5" fill="currentColor" />
            </svg>
          </button>
        )}

        {/* Dropdown menu */}
        {showMenu && !isDeleted && (
          <div
            className={`absolute top-8 ${isOwn ? "right-[calc(100%+4px)]" : "left-[calc(100%+4px)]"} bg-white rounded-xl py-2 px-3 flex flex-col gap-2 min-w-30 text-sm`}
            style={{ zIndex: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
          >
            <button
              className="text-gray-700 hover:bg-gray-100 rounded px-2 py-1 text-left"
              onClick={() => {
                navigator.clipboard.writeText(message.content || "");
                toast.success("Copied to clipboard", { position: "top-right" });
                setShowMenu(false);
              }}
            >
              Copy Text
            </button>
            {isOwn && (
              <button
                className="text-red-500 hover:bg-gray-100 rounded px-2 py-1 text-left"
                onClick={() => {
                  handleDelete();
                  setShowMenu(false);
                }}
              >
                Delete
              </button>
            )}
          </div>
        )}

        {isDeleted ? (
          <i className="text-xs text-gray-500">This message was deleted</i>
        ) : (
          message.content
        )}

        {/* Reaction panel on long press */}
        {!isDeleted && showPicker && (
          <div
            className={`mt-2 absolute top-0 inline-block justify-end ${isOwn ? "right-[calc(100%+6px)]" : "left-[calc(100%+6px)]"}`}
            style={{ minWidth: "max-content" }}
          >
            <div
              className={`flex gap-2 p-2 bg-white rounded-xl absolute z-20 ${isOwn ? "right-0" : "left-0"}`}
              style={{ boxShadow: "none", border: "none" }}
            >
              {EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  className={`text-xl w-7 h-7 flex items-center justify-center rounded-full transition-colors duration-150 hover:bg-gray-200 ${userReactionEmoji === emoji ? "bg-blue-100" : ""}`}
                  style={{ border: "none", boxShadow: "none" }}
                  onClick={() => {
                    handleReaction(emoji);
                    setShowPicker(false);
                  }}
                  aria-label={`React with ${emoji}`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Show reacted emojis at bottom left, clickable to open panel */}
        {!isDeleted && reactedEmojis.length > 0 && (
          <div className="absolute left-3 -bottom-4 flex gap-2">
            {reactedEmojis.map((emoji) => (
              <button
                key={emoji}
                type="button"
                className="text-base w-6 h-6 flex items-center justify-center bg-gray-100 rounded-full focus:outline-none"
                style={{ border: "none", boxShadow: "none", padding: 0 }}
                onClick={() => setShowPicker(true)}
                aria-label={`Open reactions for ${emoji}`}
              >
                {emoji}
                {reactionCounts[emoji] > 1 ? (
                  <span className="ml-1 text-[10px] text-gray-500 font-semibold">
                    {reactionCounts[emoji]}
                  </span>
                ) : null}
              </button>
            ))}
          </div>
        )}

        {/* Time */}
        <div className="flex items-center justify-end gap-2 mt-1">
          <span className="text-[10px] opacity-70 text-right min-w-12">
            {formatMessageTime(message.createdAt)}
          </span>
        </div>
      </div>
    </div>
  );
}
