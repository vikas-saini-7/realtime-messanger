export default function Avatar({
  src,
  className,
}: {
  src: string;
  className?: string;
}) {
  return (
    <img
      src={src}
      className={className ? className : "w-10 h-10 rounded-full object-cover"}
      alt="avatar"
    />
  );
}
