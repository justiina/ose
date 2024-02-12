"use client";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/firebase/firebaseConfig";
import { logout } from "@/app/components/AuthFunctions";
import { FaRegCalendarAlt } from "react-icons/fa";
import { FaDog } from "react-icons/fa6";
import { TbFiles } from "react-icons/tb";
import { FaSuitcase } from "react-icons/fa";
import { GoBellFill } from "react-icons/go";
import { FaUserCircle } from "react-icons/fa";
import { MdLogout } from "react-icons/md";

const Navbar = () => {
  const currentPathname = usePathname();
  const router = useRouter();
  const user = getCurrentUser();

  const navList = [
    {
      icon: <FaRegCalendarAlt className="text-2xl" />,
      title: "Kalenteri",
      route: "/main",
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
        <nav className="hidden md:grid grid-rows-10 min-h-screen bg-grey text-background font-sans text-lg p-4">
          <div className="row-span-3 flex justify-between">
            <img src="/images/logo300.png" className="h-40"></img>
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
          <div className="row-span-4 flex flex-col justify-evenly">
            <button
              className="flex gap-4 items-center cursor-pointer rounded-full px-4 py-2 hover:bg-orange"
              onClick={handleSignOut}
            >
              <MdLogout className="text-2xl" />
              Kirjaudu ulos
            </button>
          </div>
        </nav>
      )}
    </div>
  );
};
export default Navbar;
