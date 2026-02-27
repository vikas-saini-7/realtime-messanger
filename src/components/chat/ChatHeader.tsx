import Avatar from "../common/Avatar";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
// import { IconUser, IconSettings } from "@tabler/icons-react";

interface ChatHeaderProps {
  conversationId: string;
}

export default function ChatHeader({ conversationId }: ChatHeaderProps) {
  const header = useQuery(api.conversations.getConversationHeader, {
    conversationId: conversationId as Id<"conversations">,
  });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dotsRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  useEffect(() => {
    if (!dropdownOpen) return;
    function handleClick(e: MouseEvent) {
      if (dotsRef.current && !dotsRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [dropdownOpen]);
  if (!header)
    return (
      <div
        className="flex items-center justify-between p-4 border-b bg-white animate-pulse"
        style={{ height: 72 }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl border border-gray-200 bg-gray-200" />
          <div>
            <div className="w-24 h-4 bg-gray-200 rounded mb-2" />
            <div className="w-16 h-3 bg-gray-200 rounded" />
          </div>
        </div>
        <div className="w-8 h-8 rounded-xl border border-gray-200 bg-gray-200" />
      </div>
    );
  const { conversation, partnerUser } = header;
  return (
    <div
      className="flex items-center justify-between p-4 border-b bg-white"
      style={{ height: 72 }}
    >
      <div className="flex items-center gap-3">
        <Avatar
          src={partnerUser?.image || "/avatar.png"}
          className="w-10 h-10 rounded-xl border border-gray-200 object-cover shadow-sm"
        />
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
      <div ref={dotsRef} className="relative">
        <button
          type="button"
          className="p-2 rounded-full hover:bg-gray-100 transition"
          onClick={() => setDropdownOpen((v) => !v)}
          aria-label="Open menu"
        >
          <svg
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="1" />
            <circle cx="12" cy="5" r="1" />
            <circle cx="12" cy="19" r="1" />
          </svg>
        </button>
        {/* 3-dots dropdown */}
        {dropdownOpen && (
          <div className="absolute right-0 top-full mt-2 w-40 bg-white border border-gray-100 rounded-xl shadow-xl z-50 py-2">
            <button
              className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-xl transition"
              onClick={() => {
                setDropdownOpen(false);
                router.push("/profile");
              }}
            >
              Profile
            </button>
            <button
              className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-xl transition"
              onClick={() => {
                setDropdownOpen(false);
                router.push("/settings");
              }}
            >
              Settings
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
