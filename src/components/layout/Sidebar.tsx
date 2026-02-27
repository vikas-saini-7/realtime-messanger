"use client";

import ConversationList from "@/components/chat/ConversationList";
import UserSearch from "@/components/users/UserSearch";

export default function Sidebar() {
  return (
    <aside className="w-full md:w-80 bg-white flex flex-col rounded-xl">
      <div className="p-4 border-b " style={{ height: 72 }}>
        <UserSearch />
      </div>

      <div className="flex-1 overflow-y-auto">
        <ConversationList />
      </div>
    </aside>
  );
}
