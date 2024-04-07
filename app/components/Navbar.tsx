"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import LogoutForm from "./LogoutForm";
import { FaRegCalendarAlt } from "react-icons/fa";
import { FaDog } from "react-icons/fa6";
import { TbFiles } from "react-icons/tb";
import { FaSuitcase } from "react-icons/fa";
import { GoBellFill } from "react-icons/go";
import { FaBookOpen } from "react-icons/fa";
import { FaUserCircle } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoClose } from "react-icons/io5";

const Navbar = () => {
  const currentPath: string | null = usePathname();
  const [hamburgerOpen, setHamburgerOpen] = useState<boolean>(false);
  const showNavbar = [
    "/addevent",
    "/editevent",
    "/board",
    "/calloutgroup",
    "/contacts",
    "/groups",
    "/instructions",
    "/main",
    "/userinfo",
  ];

  // Open/close the hamburger menu when small/medium screen
  const toggleHamburger = () => {
    setHamburgerOpen(!hamburgerOpen);
  };

  return showNavbar.includes(currentPath) ? (
    <>
      {/*--- Big screen navbar on the side ---*/}
      <nav className="hidden md:grid grid-rows-10 min-h-screen bg-grey text-background font-sans text-lg p-4">
        <div className="row-span-3 flex justify-between">
          <img src="/images/logo300.png" className="h-28"></img>
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
        </div>
        <div className="row-span-3 flex flex-col justify-evenly">
          <LogoutForm
            showText={true}
            addClassName="flex gap-4 items-center cursor-pointer rounded-full pl-4 pr-6 py-1 hover:bg-orange"
          />
        </div>
      </nav>

      {/*--- Medium and small screen navbar at the top ---*/}
      <nav className="flex flex-1 md:hidden justify-between items-center bg-grey text-background font-sans text-lg p-4">
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

        <LogoutForm
          showText={false}
          addClassName="items-center cursor-pointer rounded-full px-2 py-2 hover:bg-orange"
        />
      </nav>

      {/*--- Show all routes on the side if hamburger open  ---*/}
      {hamburgerOpen && (
        <nav className="grid fixed left-0 h-screen p-4 bg-grey text-background md:hidden">
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
          <LogoutForm
            showText={true}
            addClassName="flex gap-4 items-center cursor-pointer rounded-full pl-4 pr-6 py-1 hover:bg-orange"
          />
        </nav>
      )}
    </>
  ) : null;
};
export default Navbar;
