import Image from 'next/image';

const IconOdometer = () => {
  return (
    <Image
      src="/icons/icon-odometer.svg" // Path relative to the /public directory
      alt="Odometer Icon"
      width={15}
      height={15}
    />
  );
};

export default IconOdometer;