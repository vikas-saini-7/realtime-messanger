import AppShell from "@/components/layout/AppShell";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <AppShell>{children}</AppShell>
    </div>
  );
};

export default layout;
