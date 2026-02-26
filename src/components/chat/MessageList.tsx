import MessageItem from "./MessageItem";

export default function MessageList() {
  const messages: any[] = []; // Replace with Convex data

  return (
    <div className="space-y-3">
      {messages.map((msg) => (
        <MessageItem key={msg.id} message={msg} />
      ))}
    </div>
  );
}