import Avatar from "../common/Avatar";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { formatLastSeen } from "@/lib/format-times";
import ChatHeaderSkeleton from "../skeletons/ChatHeaderSkeleton";
import { useSidebar } from "@/providers/SidebarContext";
import { IconHammer, IconMenu2, IconMenu3 } from "@tabler/icons-react";

interface ChatHeaderProps {
  conversationId: string;
}

export default function ChatHeader({ conversationId }: ChatHeaderProps) {
  const { isSidebarOpen, setSidebarOpen } = useSidebar();
  // You can use isSidebarOpen and setSidebarOpen as needed here

  const header = useQuery(api.conversations.getConversationHeader, {
    conversationId: conversationId as Id<"conversations">,
  });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dotsRef = useRef<HTMLDivElement>(null);

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

  if (!header) return <ChatHeaderSkeleton />;
  const { conversation, partnerUser } = header;
  return (
    <div
      className="flex items-center justify-between p-4 border-b bg-white"
      style={{ height: 72 }}
    >
      <div
        className="md:hidden w-fit mr-4 text-gray-500 hover:text-gray-700 transition cursor-pointer"
        onClick={() => setSidebarOpen(true)}
      >
        <IconMenu3 />
      </div>
      <div className="flex items-center gap-3 md:w-fit w-full">
        <Avatar
          src={partnerUser?.image || "/avatar.png"}
          className="w-10 h-10 rounded-xl border border-gray-200 object-cover shadow-sm"
        />
        <div>
          <div className="font-semibold text-lg">
            {partnerUser?.name || conversation.name || "Chat"}
          </div>
          <div className="text-xs flex items-center gap-1">
            <span
              className={`w-2 h-2 rounded-full ${partnerUser?.isOnline ? "bg-green-500" : "bg-gray-400"} inline-block`}
            />
            {partnerUser?.isOnline ? (
              <span className="text-green-500">Active</span>
            ) : (
              <span className="text-gray-500">
                Last seen{" "}
                {partnerUser?.lastSeen
                  ? formatLastSeen(partnerUser.lastSeen)
                  : "unknown"}
              </span>
            )}
          </div>
        </div>
      </div>
      <div ref={dotsRef} className="relative">
        <button
          type="button"
          className="p-2 rounded-xl hover:bg-gray-100 transition border shadow-sm"
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
          <div className="absolute right-0 top-full mt-2 w-40 bg-white border rounded-xl shadow-xl z-50 py-2">
            <button
              className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-xl transition"
              onClick={() => {
                setDropdownOpen(false);
              }}
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
