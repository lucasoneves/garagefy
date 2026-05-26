import { SaveIcon } from "lucide-react";

const SaveButton = ({
  title,
  handleSave,
}: {
  title: string;
  handleSave: () => void;
}) => {
  return (
    <div className="pt-6">
      <button
        onClick={handleSave}
        type="submit"
        className="cursor-pointer w-full bg-[#007BFF] hover:bg-blue-600 text-white font-bold py-5 rounded-[2rem] flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-blue-500/20"
      >
        <SaveIcon size={20} />
        {title}
      </button>
    </div>
  );
};

export default SaveButton;
