"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import LogoutForm from "./LogoutForm";
import { FaRegCalendarAlt } from "react-icons/fa";
import { FaDog } from "react-icons/fa6";
import { TbFiles } from "react-icons/tb";
import { FaSuitcase } from "react-icons/fa";
import { GoBellFill } from "react-icons/go";
import { FaBookOpen } from "react-icons/fa";
import { FaUserCircle } from "react-icons/fa";
import { RiUserSettingsLine } from "react-icons/ri";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoClose } from "react-icons/io5";

const NavbarAdmin = () => {
  const currentPath: string | null = usePathname();
  const [hamburgerOpen, setHamburgerOpen] = useState<boolean>(false);
  const showNavbar = [
    "/addevent",
    "/editevent",
    "/board",
    "/calloutgroup",
    "/calloutgroup/board",
    "/calloutgroup/trainings",
    "/calloutgroup/participation",
    "/contacts",
    "/groups",
    "/instructions",
    "/main",
    "/userinfo",
    "/useradmin",
    "/useradmin/adduser",
    "/useradmin/edituser",
  ];
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Open/close the hamburger menu when small/medium screen
  const toggleHamburger = () => {
    setHamburgerOpen(!hamburgerOpen);
  };

  // Close hamburger menu by clicking outside of the open menu
  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setHamburgerOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return showNavbar.includes(currentPath) ? (
    <>
      {/*--- Big screen navbar on the side ---*/}
      <nav className="fixed top-0  left-0 hidden lg:grid grid-rows-10 min-h-screen w-72 bg-grey text-background font-sans text-lg p-4">
        <div className="row-span-3 flex justify-between">
          <img
            src="https://ldlguzrtadadbymtessv.supabase.co/storage/v1/object/public/images/logo300.png?t=2024-04-08T10%3A03%3A54.657Z"
            className="h-28"
          ></img>
        </div>
        <div className="row-span-5 flex flex-col justify-evenly">
          <Link
            href="/main"
            className={
              currentPath?.startsWith("/main")
                ? "flex gap-4 items-center cursor-pointer rounded-full pl-4 pr-6 py-1 bg-background text-grey"
                : "flex gap-4 items-center cursor-pointer rounded-full pl-4 pr-6 py-1 hover:bg-background hover:text-grey"
            }
          >
            <FaRegCalendarAlt className="text-2xl" />
            Kalenteri
          </Link>

          <Link
            href="/groups"
            className={
              currentPath?.startsWith("/groups")
                ? "flex gap-4 items-center cursor-pointer rounded-full pl-4 pr-6 py-1 bg-background text-grey"
                : "flex gap-4 items-center cursor-pointer rounded-full pl-4 pr-6 py-1 hover:bg-background hover:text-grey"
            }
          >
            <FaDog className="text-2xl" />
            Treeniryhmät
          </Link>
          <Link
            href="/instructions"
            className={
              currentPath?.startsWith("/instructions")
                ? "flex gap-4 items-center cursor-pointer rounded-full pl-4 pr-6 py-1 bg-background text-grey"
                : "flex gap-4 items-center cursor-pointer rounded-full pl-4 pr-6 py-1 hover:bg-background hover:text-grey"
            }
          >
            <TbFiles className="text-2xl" />
            Ohjeet ja tiedostot
          </Link>
          <Link
            href="/board"
            className={
              currentPath?.startsWith("/board")
                ? "flex gap-4 items-center cursor-pointer rounded-full pl-4 pr-6 py-1 bg-background text-grey"
                : "flex gap-4 items-center cursor-pointer rounded-full pl-4 pr-6 py-1 hover:bg-background hover:text-grey"
            }
          >
            <FaSuitcase className="text-2xl" />
            Hallitus
          </Link>
          <Link
            href="/calloutgroup"
            className={
              currentPath?.startsWith("/calloutgroup")
                ? "flex gap-4 items-center cursor-pointer rounded-full pl-4 pr-6 py-1 bg-background text-grey"
                : "flex gap-4 items-center cursor-pointer rounded-full pl-4 pr-6 py-1 hover:bg-background hover:text-grey"
            }
          >
            <GoBellFill className="text-2xl" />
            Hälytysryhmä
          </Link>
          <Link
            href="/contacts"
            className={
              currentPath?.startsWith("/contacts")
                ? "flex gap-4 items-center cursor-pointer rounded-full pl-4 pr-6 py-1 bg-background text-grey"
                : "flex gap-4 items-center cursor-pointer rounded-full pl-4 pr-6 py-1 hover:bg-background hover:text-grey"
            }
          >
            <FaBookOpen className="text-2xl" />
            Yhteystiedot
          </Link>
          <Link
            href="/userinfo"
            className={
              currentPath?.startsWith("/userinfo")
                ? "flex gap-4 items-center cursor-pointer rounded-full pl-4 pr-6 py-1 bg-background text-grey"
                : "flex gap-4 items-center cursor-pointer rounded-full pl-4 pr-6 py-1 hover:bg-background hover:text-grey"
            }
          >
            <FaUserCircle className="text-2xl" />
            Omat tiedot
          </Link>

          <Link
            href="/useradmin"
            className={
              currentPath?.startsWith("/useradmin")
                ? "flex gap-4 items-center cursor-pointer rounded-full pl-4 pr-6 py-1 bg-blue text-background"
                : "flex gap-4 items-center cursor-pointer rounded-full pl-4 pr-6 py-1 text-orange hover:bg-blue hover:text-background"
            }
          >
            <RiUserSettingsLine className="text-2xl" />
            Käyttäjähallinta
          </Link>
        </div>
        <div className="row-span-3 flex flex-col justify-evenly">
          <LogoutForm
            showText={true}
            addClassName="flex gap-4 items-center cursor-pointer rounded-full pl-4 pr-6 py-1 hover:bg-orange"
          />
        </div>
      </nav>

      {/*--- Medium and small screen navbar at the top ---*/}
      <nav className="flex flex-1 lg:hidden fixed top-0 w-screen h-16 justify-between items-center bg-grey text-background font-sans text-lg p-4">
        <button
          onClick={toggleHamburger}
          className="items-center cursor-pointer rounded-full px-2 py-2 hover:bg-background hover:text-grey"
        >
          {hamburgerOpen ? (
            <IoClose className="text-2xl" />
          ) : (
            <GiHamburgerMenu className="text-2xl" />
          )}
        </button>

        <Link
          href="/main"
          className={
            currentPath?.startsWith("/main")
              ? "items-center cursor-pointer rounded-full px-2 py-2 bg-background text-grey"
              : "items-center cursor-pointer rounded-full px-2 py-2 hover:bg-background hover:text-grey"
          }
        >
          <FaRegCalendarAlt className="text-2xl" />
        </Link>

        <Link
          href="/groups"
          className={
            currentPath?.startsWith("/groups")
              ? "items-center cursor-pointer rounded-full px-2 py-2 bg-background text-grey"
              : "items-center cursor-pointer rounded-full px-2 py-2 hover:bg-background hover:text-grey"
          }
        >
          <FaDog className="text-2xl" />
        </Link>

        <Link
          href="/contacts"
          className={
            currentPath?.startsWith("/contacts")
              ? "items-center cursor-pointer rounded-full px-2 py-2 bg-background text-grey"
              : "items-center cursor-pointer rounded-full px-2 py-2 hover:bg-background hover:text-grey"
          }
        >
          <FaBookOpen className="text-2xl" />
        </Link>

        <Link
          href="/userinfo"
          className={
            currentPath?.startsWith("/userinfo")
              ? "items-center cursor-pointer rounded-full px-2 py-2 bg-background text-grey"
              : "items-center cursor-pointer rounded-full px-2 py-2 hover:bg-background hover:text-grey"
          }
        >
          <FaUserCircle className="text-2xl" />
        </Link>

        <Link
          href="/useradmin"
          className={
            currentPath?.startsWith("/useradmin")
              ? "items-center cursor-pointer rounded-full px-2 py-2 bg-blue text-background"
              : "items-center cursor-pointer rounded-full px-2 py-2 text-orange hover:bg-blue hover:text-background"
          }
        >
          <RiUserSettingsLine className="text-2xl" />
        </Link>

        <LogoutForm
          showText={false}
          addClassName="items-center cursor-pointer rounded-full px-2 py-2 hover:bg-orange"
        />
      </nav>

      {/*--- Show all routes on the side if hamburger open  ---*/}
      {hamburgerOpen && (
        <nav
          ref={menuRef}
          className="grid gap-4 fixed left-0 bg-grey text-background lg:hidden p-4 rounded-ee-3xl"
        >
          <div>
            <Link
              href="/main"
              className={
                currentPath?.startsWith("/main")
                  ? "flex gap-4 items-center cursor-pointer rounded-full pl-4 pr-6 py-1 bg-background text-grey"
                  : "flex gap-4 items-center cursor-pointer rounded-full pl-4 pr-6 py-1 hover:bg-background hover:text-grey"
              }
            >
              <FaRegCalendarAlt className="text-2xl" />
              Kalenteri
            </Link>
          </div>
          <div>
            <Link
              href="/groups"
              className={
                currentPath?.startsWith("/groups")
                  ? "flex gap-4 items-center cursor-pointer rounded-full pl-4 pr-6 py-1 bg-background text-grey"
                  : "flex gap-4 items-center cursor-pointer rounded-full pl-4 pr-6 py-1 hover:bg-background hover:text-grey"
              }
            >
              <FaDog className="text-2xl" />
              Treeniryhmät
            </Link>
          </div>
          <div>
            <Link
              href="/instructions"
              className={
                currentPath?.startsWith("/instructions")
                  ? "flex gap-4 items-center cursor-pointer rounded-full pl-4 pr-6 py-1 bg-background text-grey"
                  : "flex gap-4 items-center cursor-pointer rounded-full pl-4 pr-6 py-1 hover:bg-background hover:text-grey"
              }
            >
              <TbFiles className="text-2xl" />
              Ohjeet ja tiedostot
            </Link>
          </div>
          <div>
            <Link
              href="/board"
              className={
                currentPath?.startsWith("/board")
                  ? "flex gap-4 items-center cursor-pointer rounded-full pl-4 pr-6 py-1 bg-background text-grey"
                  : "flex gap-4 items-center cursor-pointer rounded-full pl-4 pr-6 py-1 hover:bg-background hover:text-grey"
              }
            >
              <FaSuitcase className="text-2xl" />
              Hallitus
            </Link>
          </div>
          <div>
            <Link
              href="/calloutgroup"
              className={
                currentPath?.startsWith("/calloutgroup")
                  ? "flex gap-4 items-center cursor-pointer rounded-full pl-4 pr-6 py-1 bg-background text-grey"
                  : "flex gap-4 items-center cursor-pointer rounded-full pl-4 pr-6 py-1 hover:bg-background hover:text-grey"
              }
            >
              <GoBellFill className="text-2xl" />
              Hälytysryhmä
            </Link>
          </div>
          <div>
            <Link
              href="/contacts"
              className={
                currentPath?.startsWith("/contacts")
                  ? "flex gap-4 items-center cursor-pointer rounded-full pl-4 pr-6 py-1 bg-background text-grey"
                  : "flex gap-4 items-center cursor-pointer rounded-full pl-4 pr-6 py-1 hover:bg-background hover:text-grey"
              }
            >
              <FaBookOpen className="text-2xl" />
              Yhteystiedot
            </Link>
          </div>
          <div>
            <Link
              href="/userinfo"
              className={
                currentPath?.startsWith("/userinfo")
                  ? "flex gap-4 items-center cursor-pointer rounded-full pl-4 pr-6 py-1 bg-background text-grey"
                  : "flex gap-4 items-center cursor-pointer rounded-full pl-4 pr-6 py-1 hover:bg-background hover:text-grey"
              }
            >
              <FaUserCircle className="text-2xl" />
              Omat tiedot
            </Link>
          </div>
          <div>
            <Link
              href="/useradmin"
              className={
                currentPath?.startsWith("/userinfo")
                  ? "flex gap-4 items-center cursor-pointer rounded-full pl-4 pr-6 py-1 bg-blue text-background"
                  : "flex gap-4 items-center cursor-pointer rounded-full pl-4 pr-6 py-1 text-orange hover:bg-blue hover:text-background"
              }
            >
              <RiUserSettingsLine className="text-2xl" />
              Käyttäjähallinta
            </Link>
          </div>
          <LogoutForm
            showText={true}
            addClassName="flex gap-4 items-center cursor-pointer rounded-full pl-4 pr-6 py-1 hover:bg-orange"
          />
        </nav>
      )}
    </>
  ) : null;
};
export default NavbarAdmin;
