import ConversationItem from "./ConversationItem";
import EmptyState from "../common/EmptyState";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

export default function ConversationList() {
  const conversations = useQuery(api.conversations.getConversations);

  if (conversations === undefined) {
    return <div className="p-2">Loading...</div>;
  }

  if (conversations.length === 0) {
    return <EmptyState message="No conversations yet" />;
  }

  return (
    <div className="space-y-1 p-2">
      {conversations.map((conv) => (
        <ConversationItem key={conv?._id} conversation={conv} />
      ))}
    </div>
  );
}
