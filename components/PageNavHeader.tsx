import { HiArrowLeft } from "react-icons/hi";
import Link from "next/link";

const PageNavHeader = ({
  pageTitle,
  cancelable = true,
}: {
  pageTitle: string;
  cancelable?: boolean;
}) => {
  return (
    <header className="flex items-center flex-col justify-between mb-10">
      <div className="flex justify-between w-full">
        <Link
          href={"/"}
          className=" hover:bg-zinc-800 rounded-full transition-colors"
        >
          <HiArrowLeft size={24} />
        </Link>
        {cancelable ? (
          <Link
            href={"/"}
            className="text-blue-500 font-medium hover:text-blue-400"
          >
            Cancel
          </Link>
        ) : (
          <div className="w-20"></div>
        )}
      </div>
      <h1 className="text-lg font-semibold flex-1 -translate-y-6">{pageTitle}</h1>
    </header>
  );
};

export default PageNavHeader;
