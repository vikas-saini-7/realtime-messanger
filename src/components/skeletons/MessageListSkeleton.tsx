import React from "react";

const MessageListSkeleton = () => {
  return (
    <div className="space-y-3">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className={`flex ${i % 2 === 0 ? "justify-end" : "justify-start"}`}
        >
          <div
            className={`max-w-xs px-4 py-3 rounded-2xl animate-pulse ${
              i % 2 === 0
                ? "bg-gray-500/10 text-transparent"
                : "bg-white/50 text-transparent"
            }`}
            style={{ width: 180 + (i % 3) * 40, height: 28 }}
          >
            ...
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageListSkeleton;
