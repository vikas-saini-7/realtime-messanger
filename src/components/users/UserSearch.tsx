"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useDebounce } from "@/hooks/useDebounce";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";

export default function UserSearch() {
  const [search, setSearch] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const router = useRouter();

  const createOrGetConversation = useMutation(
    api.conversations.createOrGetConversation,
  );

  // Debounce search by 300ms
  const debouncedSearch = useDebounce(search, 300);

  // Backend search
  const users = useQuery(api.users.searchUsers, {
    search: debouncedSearch,
  });

  return (
    <div className="relative w-full max-w-md">
      {/* ✅ Input always visible */}
      <input
        type="text"
        placeholder="Search users..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setTimeout(() => setIsFocused(false), 150)}
        className="w-full p-2 border rounded"
      />

      {/* ✅ Dropdown only on focus */}
      {isFocused && (
        <div className="absolute w-full mt-1 bg-white border border-gray-300 rounded max-h-60 overflow-y-auto z-50">
          {!users ? (
            <div className="p-2 text-sm text-gray-500">Loading users...</div>
          ) : users.length === 0 ? (
            <div className="p-2 text-sm text-gray-500">No users found</div>
          ) : (
            users.map((user) => (
              <div
                key={user._id}
                className="p-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                onMouseDown={async () => {
                  console.log("Clicked:", user._id);

                  const conversationId = await createOrGetConversation({
                    otherUserId: user._id,
                  });

                  console.log("Conversation created:", conversationId);

                  router.push(`/app/chat/${conversationId}`);
                  setSearch("");
                }}
              >
                <img
                  src={user.image}
                  alt={user.name}
                  className="w-8 h-8 rounded-full"
                />
                <span>{user.name}</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
