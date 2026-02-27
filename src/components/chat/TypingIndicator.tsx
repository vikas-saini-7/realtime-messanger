import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";

function Dots() {
  return (
    <span className="inline-flex gap-1 ml-2">
      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
    </span>
  );
}

export default function TypingIndicator({
  conversationId,
}: {
  conversationId: Id<"conversations">;
}) {
  // Get current user
  const currentUser = useQuery(api.users.getCurrentUser);
  // Only run query if we have both conversationId and currentUser
  const shouldQuery = Boolean(conversationId && currentUser && currentUser._id);
  const typingUsers = useQuery(
    api.typing.getTypingUsers,
    shouldQuery
      ? {
          conversationId: conversationId as Id<"conversations">,
          excludeUserId: currentUser?._id as Id<"users">,
        }
      : "skip",
  );

  // Only show animation if there are typing users
  if (!typingUsers || typingUsers.length === 0) return null;

  return (
    <div className="flex items-center gap-2 bg-white p-4 rounded-tl-sm w-[120px] rounded-xl">
      <Dots />
    </div>
  );
}
