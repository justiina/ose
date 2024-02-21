"use client";
import { useRouter, usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { AllRoutes } from "@/app/components/Routes";
import { MdLogout } from "react-icons/md";

const Navbar = () => {
  const currentPathname: string | null = usePathname();
  const router = useRouter();
  const navList = AllRoutes.filter((item) => item.showOnNavBar);
  const showNavBar = AllRoutes.filter((item) => item.withNavBar);
  const smallNavList = navList.filter((item) => item.showOnSmallScreen);

  const handleSignOut = () => {
    signOut();
    router.replace("/");
  };

  return (
    <div>
      {/*--- Don't show navbar on root, login and forgot password pages */}
      {showNavBar.some((route) => currentPathname?.startsWith(route.route)) && (
        <nav className="hidden md:grid grid-rows-10 min-h-screen bg-grey text-background font-sans text-lg p-4">
          <div className="row-span-3 flex justify-between">
            <img src="/images/logo300.png" className="h-40"></img>
          </div>
          <ul className="row-span-4 flex flex-col justify-evenly">
            {navList.map(({ icon, title, route }, index) => {
              const isActive = currentPathname?.startsWith(route);
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
