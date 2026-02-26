import AppShell from "@/components/layout/AppShell";
import React from "react";

const ChatLayout = ({ children }: { children: React.ReactNode }) => {
  return <AppShell>{children}</AppShell>;
};

export default ChatLayout;
