"use client";

import { useState } from "react";

export default function UserSearch() {
  const [query, setQuery] = useState("");

  return (
    <input
      type="text"
      placeholder="Search users..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
}