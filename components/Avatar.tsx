import Image from "next/image";

export default function Avatar({ src, alt, username }: { src: string; alt: string; username: string }) {
  return (
    <div className="user-avatar relative w-full flex items-center gap-2">
      <Image
        src={src}
        alt={alt}
        width={48}
        height={48}
        className="rounded-lg"
        priority
      />
      <span className="text-white text-sm">{username}</span>
    </div>
  );
}
