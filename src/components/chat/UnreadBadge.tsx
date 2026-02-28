export default function UnreadBadge({ count }: { count: number }) {
  if (!count) return null;

  return (
    <span className="bg-gray-400 text-white text-xs px-2 py-1 rounded-lg font-bold">
      {count}
    </span>
  );
}
