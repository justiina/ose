import Link from "next/link";
import { IoConstructOutline } from "react-icons/io5";

const UnderConstruction = () => {
  return (
    <div className="mt-40 ml-16">
      <div className="flex mb-8 gap-4 items-center">
        <IoConstructOutline className="text-9xl" />
        <p className="text-3xl font-bold">Sivua valmistellaan</p>
      </div>
      <Link
        href="/main"
        className="px-4 py-2 bg-orange text-white rounded-full hover:bg-orangehover active:bg-grey"
      >
        Palaa takaisin
      </Link>
    </div>
  );
};

export default UnderConstruction;
