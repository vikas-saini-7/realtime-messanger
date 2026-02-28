import { IconMenu3 } from "@tabler/icons-react";

const ChatHeaderSkeleton = () => {
  return (
    <div
      className="flex items-center justify-between p-4 border-b bg-white animate-pulse"
      style={{ height: 72 }}
    >
      <div className="md:hidden w-fit mr-4 text-gray-500 hover:text-gray-700 transition cursor-pointer">
        <IconMenu3 />
      </div>
      <div className="flex items-center gap-3 md:w-fit w-full">
        <div className="w-10 h-10 rounded-xl border border-gray-200 bg-gray-200" />
        <div>
          <div className="w-24 h-4 bg-gray-200 rounded mb-2" />
          <div className="w-16 h-3 bg-gray-200 rounded" />
        </div>
      </div>
      <div className="w-8 h-8 rounded-xl border border-gray-200 bg-gray-200" />
    </div>
  );
};

export default ChatHeaderSkeleton;
