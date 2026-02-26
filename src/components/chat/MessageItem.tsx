import Avatar from "../common/Avatar";

export default function MessageItem({ message }: any) {
  const isOwn = message.isOwn;

  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-xs px-4 py-2 rounded-2xl text-sm ${
          isOwn
            ? "bg-blue-500 text-white"
            : "bg-gray-200 text-gray-800"
        }`}
      >
        {message.isDeleted ? (
          <i>This message was deleted</i>
        ) : (
          message.content
        )}

        <div className="text-xs mt-1 opacity-70 text-right">
          {message.createdAt}
        </div>
      </div>
    </div>
  );
}