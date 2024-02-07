"use client";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/firebase/firebaseConfig";
import { logout } from "@/app/components/AuthFunctions";
import { useState } from "react";
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
      showOnSmallScreen: true,
    },
    {
      icon: <FaDog className="text-2xl" />,
      title: "Treeniryhmät",
      route: "/groups",
      showOnSmallScreen: false,
    },
    {
      icon: <TbFiles className="text-2xl" />,
      title: "Ohjeet ja tiedostot",
      route: "/instructions",
      showOnSmallScreen: true,
    },
    {
      icon: <FaSuitcase className="text-2xl" />,
      title: "Hallitus",
      route: "/board",
      showOnSmallScreen: false,
    },
    {
      icon: <GoBellFill className="text-2xl" />,
      title: "Hälytysryhmä",
      route: "/calloutgroup",
      showOnSmallScreen: true,
    },
    {
      icon: <FaUserCircle className="text-2xl" />,
      title: "Omat tiedot",
      route: "/userinfo",
      showOnSmallScreen: false,
    },
  ];

  const smallNavList = navList.filter((item) => item.showOnSmallScreen);

  const handleSignOut = () => {
    logout();
    router.replace("/");
  };

  return (
    <div>
      {currentPathname !== "/" && currentPathname !== "/login" && (
        <>
          {isOpen ? (
            <nav className="hidden md:grid grid-rows-10 min-h-screen bg-grey text-background font-sans text-lg p-4">
              <div className="row-span-3 flex justify-between">
                <img src="/images/logo300.png" className="h-40"></img>
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="cursor-pointer flex items-center justify-center h-8 w-8 rounded-full hover:bg-background hover:text-grey"
                >
                  <IoIosArrowBack className="text-2x" />
                </button>
              </div>
              <ul className="row-span-4 flex flex-col justify-evenly">
                {navList.map(({ icon, title, route }, index) => {
                  const isActive = currentPathname.startsWith(route);
                  return (
                    <li key={index}>
                      <Link
                        href={route}
                        className={
                          isActive
                            ? "flex gap-4 items-center cursor-pointer rounded-full px-4 py-2 bg-background text-grey"
                            : "flex gap-4 items-center cursor-pointer rounded-full px-4 py-2 hover:bg-background hover:text-grey"
                        }
                      >
                        {icon}
                        {title}
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <ul className="row-span-4 flex flex-col justify-evenly">
                <li>
                  <button
                    className="flex gap-4 items-center cursor-pointer rounded-full px-4 py-2 hover:bg-orange"
                    onClick={handleSignOut}
                  >
                    <MdLogout className="text-2xl" />
                    Kirjaudu ulos
                  </button>
                </li>
              </ul>
            </nav>
          ) : (
            <nav className="hidden md:grid grid-rows-10 min-h-screen w-20 bg-grey text-background font-sans text-lg p-4">
              <div className="row-span-3 flex justify-between">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="cursor-pointer flex items-center justify-center h-8 w-8 rounded-full hover:bg-background hover:text-grey"
                >
                  <IoIosArrowForward className="text-2x" />
                </button>
              </div>
              <ul className="row-span-4 flex flex-col justify-evenly">
                {navList.map(({ icon, route }, index) => {
                  const isActive = currentPathname.startsWith(route);
                  return (
                    <li key={index}>
                      <Link
                        className={
                          isActive
                            ? "flex items-center justify-center cursor-pointer w-10 h-10 rounded-full bg-background text-grey"
                            : "flex items-center justify-center cursor-pointer w-10 h-10 rounded-full hover:bg-background hover:text-grey"
                        }
                        href={route}
                      >
                        {icon}
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <ul className="row-span-4 flex flex-col justify-evenly">
                <li>
                  <button
                    className="flex items-center justify-center cursor-pointer w-10 h-10 rounded-full hover:bg-orange"
                    onClick={handleSignOut}
                  >
                    <MdLogout className="text-2xl" />
                  </button>
                </li>
              </ul>
            </nav>
          )}

          <nav className="flex justify-between bg-grey text-background p-4">
            <div className="flex items-center justify-center h-10 w-10 cursor-pointer rounded-full hover:bg-background hover:text-grey">
              <TiThMenu className="text-2xl" />
              <button onClick={() => setShowHamburger(!showHamburger)}></button>
            </div>
            {smallNavList.map(({ icon, route }, index) => {
              const isActive = currentPathname.startsWith(route);
              return (
                <li
                  key={index}
                  className={
                    isActive
                      ? "flex items-center justify-center h-10 w-10 cursor-pointer rounded-full bg-background text-grey"
                      : "flex items-center justify-center h-10 w-10 cursor-pointer rounded-full hover:bg-background hover:text-grey"
                  }
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
