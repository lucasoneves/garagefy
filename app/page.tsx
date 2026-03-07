import Avatar from "@/components/Avatar";
import { IoSettingsOutline } from "react-icons/io5";


export default function Home() {
  return (
    <div className="flex min-h-screen bg-zinc-50 font-sans dark:bg-[#121212]">
      <main className="w-full">
        <header className="py-12 px-6 flex gap-10 items-center justify-between w-full max-w-2xl m-auto">
          <div className="flex w-full items-center gap-2">
            <Avatar
              src="https://i.pravatar.cc/150"
              alt="User Avatar"
              username="José da Silva"
            />
          </div>
          <button>
            <IoSettingsOutline size={20} />
          </button>
        </header>
      </main>
    </div>
  );
}
