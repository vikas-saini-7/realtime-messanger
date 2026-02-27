export function formatLastSeen(lastSeen: number) {
  const now = Date.now();
  const diff = Math.floor((now - lastSeen) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
  const date = new Date(lastSeen);
  return date.toLocaleString();
}


export function formatMessageTime(timestamp: number) {
  const date = new Date(timestamp);
  const now = new Date();
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();
  const isThisYear = date.getFullYear() === now.getFullYear();
  const time = date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
  if (isToday) return time;
  const dateStr = date.toLocaleString([], {
    month: "short",
    day: "numeric",
    ...(isThisYear ? {} : { year: "numeric" }),
  });
  return `${dateStr}, ${time}`;
}