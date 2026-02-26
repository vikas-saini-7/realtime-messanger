export default function UnreadBadge({ count }: { count: number }) {
  if (!count) return null;

  return (
    <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
      {count}
    </span>
  );
}