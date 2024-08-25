import Link from "next/link";
import { IoConstructOutline } from "react-icons/io5";
import { FilledLink } from "./Buttons";
import { RiArrowGoBackLine } from "react-icons/ri";

const UnderConstruction = () => {
  return (
    <div className="mt-40 ml-16">
      <div className="flex mb-8 gap-4 items-center">
        <IoConstructOutline className="text-9xl" />
        <p className="text-3xl font-bold">Sivua valmistellaan</p>
      </div>
      <div className="flex justify-start mt-4 gap-2">
        <FilledLink
          href="/main"
          title="Palaa takaisin"
          color="orange"
          icon={<RiArrowGoBackLine className="text-2xl" />}
        />
      </div>
    </div>
  );
};

export default UnderConstruction;
