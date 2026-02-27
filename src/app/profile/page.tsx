"use client";

import { useUser } from "@clerk/nextjs";

export default function Navbar() {
  const { user } = useUser();
  console.log(user);

  if (!user) return null;

  return (
    <div className="flex items-center gap-3">
      <img src={user.imageUrl} alt="avatar" className="w-8 h-8 rounded-full" />
      <span>{user.fullName}</span>
    </div>
  );
}
