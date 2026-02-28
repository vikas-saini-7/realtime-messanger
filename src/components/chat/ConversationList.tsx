import ConversationItem from "./ConversationItem";
import EmptyState from "../common/EmptyState";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import ConversationsSkeleton from "../skeletons/ConversationsSkeleton";

export default function ConversationList() {
  const conversations = useQuery(api.conversations.getConversations);

  // loading state: displaying skeletons
  if (conversations === undefined) {
    return <ConversationsSkeleton />;
  }

  if (conversations.length === 0) {
    return <EmptyState message="No conversations yet" />;
  }
  if (conversations) {
    console.log("Conversations:", conversations);
  }

  return (
    <div className="space-y-1 p-2 rounded-xl bg-white ">
      {conversations.map((conv) => (
        <ConversationItem key={conv?._id} conversation={conv} />
      ))}
    </div>
  );
}
