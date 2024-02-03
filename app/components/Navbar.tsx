"use client";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/firebase/firebaseConfig";
import { logout } from "@/app/components/AuthFunctions";
import { useEffect, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import { FaRegCalendarAlt } from "react-icons/fa";
import { FaDog } from "react-icons/fa6";
import { TbFiles } from "react-icons/tb";
import { FaSuitcase } from "react-icons/fa";
import { GoBellFill } from "react-icons/go";
import { FaUserCircle } from "react-icons/fa";
import { MdLogout } from "react-icons/md";
import { TiThMenu } from "react-icons/ti";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [showHamburger, setShowHamburger] = useState(false);
  const currentPathname = usePathname();
  const router = useRouter();
  const user = getCurrentUser();

  const navList = [
    {
      icon: <FaRegCalendarAlt className="text-2xl" />,
      title: "Kalenteri",
      route: "/calendar",
      showSmallScreen: true,
    },
    {
      icon: <FaDog className="text-2xl" />,
      title: "Treeniryhmät",
      route: "/groups",
      showSmallScreen: false,
    },
    {
      icon: <TbFiles className="text-2xl" />,
      title: "Ohjeet ja tiedostot",
      route: "/instructions",
      showSmallScreen: true,
    },
    {
      icon: <FaSuitcase className="text-2xl" />,
      title: "Hallitus",
      route: "/board",
      showSmallScreen: false,
    },
    {
      icon: <GoBellFill className="text-2xl" />,
      title: "Hälytysryhmä",
      route: "/calloutgroup",
      showSmallScreen: true,
    },
    {
      icon: <FaUserCircle className="text-2xl" />,
      title: "Omat tiedot",
      route: "/userinfo",
      showSmallScreen: false,
    },
  ];

  const smallNavList = navList.filter((item) => item.showSmallScreen);

  const handleSignOut = () => {
    logout();
    router.replace("/");
  };

  return (
    <div>
      {currentPathname !== "/" && currentPathname !== "/login" && (
        <>
          <nav className="hidden md:grid grid-rows-10 min-h-screen bg-grey text-background font-sans text-lg p-4">
            <div className="row-span-3 flex justify-between">
              {isOpen && <img src="/images/logo300.png" className="h-40"></img>}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="cursor-pointer flex items-center justify-center h-8 w-8 rounded-full hover:bg-background hover:text-grey"
              >
                {isOpen ? (
                  <IoIosArrowBack className="text-2x" />
                ) : (
                  <IoIosArrowForward className="text-2x" />
                )}
              </button>
            </div>
            <ul className="row-span-4 flex flex-col justify-evenly">
              {navList.map(({ icon, title, route }, index) => {
                return (
                  <li key={index}>
                    {isOpen ? (
                      <Link
                        href={route}
                        className="flex gap-4 items-center cursor-pointer rounded-full px-4 py-2 hover:bg-background hover:text-grey"
                      >
                        {icon}
                        {title}
                      </Link>
                    ) : (
                      <Link className="flex w-10 h-10" href={route}>
                        {icon}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
            <ul className="row-span-3 flex flex-col justify-evenly">
              <li className="flex gap-4 items-center cursor-pointer rounded-full px-4 py-2 hover:bg-orange">
                <MdLogout className="text-2xl" />
                {isOpen ? (
                  <button onClick={handleSignOut}>Kirjaudu ulos</button>
                ) : (
                  <button
                    className="flex h-10 w-10 items-center cursor-pointer rounded-full px-4 py-2 hover:bg-orange"
                    onClick={handleSignOut}
                  ></button>
                )}
              </li>
            </ul>
          </nav>

          <nav className="flex justify-between bg-grey text-background p-4">
            <div className="flex items-center justify-center h-10 w-10 cursor-pointer rounded-full hover:bg-background hover:text-grey">
              <TiThMenu className="text-2xl" />
              <button onClick={() => setShowHamburger(!showHamburger)}></button>
            </div>
            {smallNavList.map(({ icon, route }, index) => {
              return (
                <li
                  key={index}
                  className="flex items-center justify-center h-10 w-10 cursor-pointer rounded-full hover:bg-background hover:text-grey"
                >
                  <Link href={route}>{icon}</Link>
                </li>
              );
            })}
            <div className="flex items-center justify-center h-10 w-10 cursor-pointer rounded-full hover:bg-orange">
              <MdLogout className="text-2xl" />
              <button onClick={handleSignOut}></button>
            </div>
          </nav>
        </>
      )}
    </div>
  );
};
export default Navbar;
