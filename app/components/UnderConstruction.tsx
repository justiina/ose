import Link from "next/link";
import { IoConstructOutline } from "react-icons/io5";
import { FilledLink } from "./Buttons";

const UnderConstruction = () => {
  return (
    <div className="mt-40 ml-16">
      <div className="flex mb-8 gap-4 items-center">
        <IoConstructOutline className="text-9xl" />
        <p className="text-3xl font-bold">Sivua valmistellaan</p>
      </div>
      <FilledLink href="/main" title="Palaa takaisin" color="orange" />
    </div>
  );
};

export default UnderConstruction;
