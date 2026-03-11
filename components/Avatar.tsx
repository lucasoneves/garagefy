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
      <span className="is-online absolute bottom-0 bg-[#121212] p-1 rounded-full translate-x-8 translate-y-1">
        <span className="dot rounded-full w-2 h-2 bg-green-500 block" />
      </span>
      <span className="text-white text-sm">{username}</span>
    </div>
  );
}
