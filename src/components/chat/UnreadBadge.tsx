export default function UnreadBadge({ count }: { count: number }) {
  if (!count) return null;

  return (
    <span className="bg-gray-500/10 text-gray-900 text-xs px-2 py-1 rounded-full border border-gray-300">
      {count}
    </span>
  );
}
