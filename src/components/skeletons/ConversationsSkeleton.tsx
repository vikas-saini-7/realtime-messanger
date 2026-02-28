import React from "react";

const ConversationsSkeleton = () => {
  return (
    <div className="space-y-2 p-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 p-3 rounded-lg bg-gray-100 animate-pulse"
          style={{ minHeight: 56 }}
        >
          <div className="w-10 h-10 rounded-xl border border-gray-200 bg-gray-300" />
          <div className="flex-1">
            <div className="w-24 h-4 bg-gray-300 rounded mb-2" />
            <div className="w-32 h-3 bg-gray-200 rounded" />
          </div>
          <div className="w-6 h-6 rounded-xl border border-gray-200 bg-gray-200" />
        </div>
      ))}
    </div>
  );
};

export default ConversationsSkeleton;
