"use client";

import ConversationList from "@/components/chat/ConversationList";
import UserSearch from "@/components/users/UserSearch";
import { useSidebar } from "@/providers/SidebarContext";

export default function Sidebar() {
  const { isSidebarOpen, setSidebarOpen } = useSidebar();
  // You can use isSidebarOpen and setSidebarOpen as needed here
  return (
    <aside
      className={`w-full md:w-80 bg-white/50 backdrop-blur-2xl flex flex-col border-r z-100 md:relative fixed h-full ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out`}
    >
      <div className="p-4 border-b " style={{ height: 72 }}>
        <UserSearch />
      </div>

      <div className="flex-1 overflow-y-auto">
        <ConversationList />
      </div>
    </aside>
  );
}
