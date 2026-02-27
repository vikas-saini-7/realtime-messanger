"use client";

import { useState, useRef, useEffect } from "react";
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
  return (
    <div className="relative w-full max-w-md">
      <div className="flex items-center gap-2">
        {/* ✅ Input always visible */}
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 150)}
          className="w-full px-4 py-2 border border-gray-100 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-200 bg-white text-gray-900 placeholder-gray-400 transition"
          autoComplete="off"
        />
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

      {/* ✅ Dropdown only on focus */}
      {isFocused && (
        <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-xl max-h-72 overflow-y-auto z-40 py-2">
          {!users ? (
            <div className="px-4 py-3 text-xs text-gray-400">
              Loading users...
            </div>
          ) : users.length === 0 ? (
            <div className="px-4 py-3 text-xs text-gray-400">
              No users found
            </div>
          ) : (
            users.map((user) => (
              <div
                key={user._id}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-3 transition rounded-lg group"
                onMouseDown={async () => {
                  const conversationId = await createOrGetConversation({
                    otherUserId: user._id,
                  });
                  router.push(`/chat/${conversationId}`);
                  setSearch("");
                }}
              >
                <img
                  src={user.image}
                  alt={user.name}
                  className="w-10 h-10 rounded-xl border border-gray-200 object-cover shadow-sm group-hover:scale-105 transition-transform"
                />
                <div className="flex flex-col justify-center">
                  <span className="font-semibold text-gray-900 leading-tight text-sm">
                    {user.name}
                  </span>
                  <span className="text-xs text-gray-400">{user.email}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
