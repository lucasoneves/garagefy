import Avatar from "@/components/Avatar";
import { IoSettingsOutline } from "react-icons/io5";

export default function MainHeader() {
  return (
    <header className="flex gap-10 mb-10 items-center justify-between w-full m-auto">
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
  );
}
