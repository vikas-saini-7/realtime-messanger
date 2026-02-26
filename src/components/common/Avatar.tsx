export default function Avatar({ src }: { src: string }) {
  return (
    <img
      src={src}
      className="w-10 h-10 rounded-full object-cover"
      alt="avatar"
    />
  );
}