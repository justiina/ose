"use client";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/firebase/firebaseConfig";
import { logout } from "@/app/components/AuthFunctions";
import React, { useEffect, useState } from "react";
import { AiOutlineHome } from "react-icons/ai";
import { GiHamburgerMenu } from "react-icons/gi";
import { BsShare } from "react-icons/bs";
import { FaRegCalendarAlt } from "react-icons/fa";
import { FaDog } from "react-icons/fa6";
import { TbFiles } from "react-icons/tb";
import { FaSuitcase } from "react-icons/fa";
import { GoBellFill } from "react-icons/go";
import { FaUserCircle } from "react-icons/fa";
import { MdLogout } from "react-icons/md";
import Image from "next/image";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const currentPathname = usePathname();
  const router = useRouter();
  const user = getCurrentUser();

  const handleSignOut = () => {
    logout();
    router.replace("/");
  };

  const handleDrawer = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      {currentPathname === "/" || currentPathname === "/login" ? (
        <></>
      ) : (
        <nav className="grid grid-rows-10 min-h-screen bg-grey text-background font-sans text-lg p-4">
          <div className="row-span-3">
            <Image
              src="/images/logo300.png"
              width={0}
              height={0}
              sizes="100vw"
              style={{ width: 60, height: "auto" }}
              alt="logo"
              placeholder="blur"
              blurDataURL={"/images/logo300.png"}
            />
          </div>
    

          <ul className="row-span-4 flex flex-col justify-evenly">
            <li className="flex gap-4 items-center cursor-pointer rounded-full px-4 py-2 hover:bg-background hover:text-grey ">
              <FaRegCalendarAlt className="text-2xl" />
              <Link href={"/calendar"}>Kalenteri</Link>
            </li>

            <li className="flex gap-4 items-center cursor-pointer rounded-full px-4 py-2 hover:bg-background hover:text-grey ">
              <FaDog className="text-2xl" />
              <Link href={"/groups"}>Treeniryhmät</Link>
            </li>

            <li className="flex gap-4 items-center cursor-pointer rounded-full px-4 py-2 hover:bg-background hover:text-grey ">
              <TbFiles className="text-2xl" />
              <Link href={"/instructions"}>Ohjeet ja tiedostot</Link>
            </li>

            <li className="flex gap-4 items-center cursor-pointer rounded-full px-4 py-2 hover:bg-background hover:text-grey ">
              <FaSuitcase className="text-2xl" />
              <Link href={"/board"}>Hallitus</Link>
            </li>

            <li className="flex gap-4 items-center cursor-pointer rounded-full px-4 py-2 hover:bg-background hover:text-grey ">
              <GoBellFill className="text-2xl" />
              <Link href={"/calloutgroup"}>Hälytysryhmä</Link>
            </li>

            <li className="flex gap-4 items-center cursor-pointer rounded-full px-4 py-2 hover:bg-background hover:text-grey ">
              <FaUserCircle className="text-2xl" />
              <Link href={"/userinfo"}>Omat tiedot</Link>
            </li>
          </ul>

          <ul className="row-span-3 flex flex-col justify-evenly">
          <li className="flex gap-4 items-center cursor-pointer rounded-full px-4 py-2 hover:bg-background hover:text-grey ">
              <MdLogout className="text-2xl" />
              <button onClick={handleSignOut}>Kirjaudu ulos</button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};
export default Navbar;
