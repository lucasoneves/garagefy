import Image from 'next/image';

const IconOdometer = ({ className }: { className?: string }) => {
  return (
    <Image
      src="/icons/icon-odometer.svg" // Path relative to the /public directory
      alt="Odometer Icon"
      width={15}
      height={15}
      className={className}
    />
  );
};

export default IconOdometer;