export default function TypingIndicator() {
  const isTyping = false;

  if (!isTyping) return null;

  return <p className="text-sm text-gray-500 mt-2">Someone is typing...</p>;
}
