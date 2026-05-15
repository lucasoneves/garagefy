import { AiFillLayout, AiOutlineUser } from "react-icons/ai";
import { BiWalletAlt } from "react-icons/bi";
import { MdOutlineDirectionsCar } from "react-icons/md";

const BottomNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-xl border-t border-zinc-800/50 px-8 py-6 flex justify-between items-center z-30">
      <NavItem icon={<AiFillLayout size={24} />} label="Dashboard" active />
      <NavItem icon={<MdOutlineDirectionsCar size={24} />} label="Garage" />
      <NavItem icon={<BiWalletAlt size={24} />} label="Expenses" />
      <NavItem icon={<AiOutlineUser size={24} />} label="Profile" />
    </nav>
  );
};

{
  /* Bottom Navigation */
}
const NavItem = ({
  icon,
  label,
  active = false,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) => (
  <div
    className={`flex flex-col items-center gap-1 ${active ? "text-blue-500" : "text-zinc-600"}`}
  >
    {icon}
    <span className="text-[10px] font-bold tracking-tight">{label}</span>
  </div>
);


export default BottomNav;