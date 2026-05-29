type PageDescriptionProps = {
  pageTitle: string;
  pageDescription: string;
};

const PageDescription = ({ pageTitle, pageDescription }: PageDescriptionProps) => {
  return (
    <div className="mt-4 px-1">
      <span className="text-xl font-black py-1 rounded-md w-max mb-1 block">
        {pageTitle}
      </span>
      <p className="text-sm text-zinc-400 font-medium">
        {pageDescription}
      </p>
    </div>
  );
};

export default PageDescription;
