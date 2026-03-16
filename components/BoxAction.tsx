import Link from "next/link"

export default function BoxAction({children, text, path}: {children: React.ReactNode, text: string, path: string}) {
  return (
    <Link href={path} className="bg-[#121212] text-white px-6 py-10 flex-1 rounded-2xl flex flex-col gap-2 items-center justify-center">
      {children}
      <span className="text-sm">{text}</span>
    </Link>
  )
}