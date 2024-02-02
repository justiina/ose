"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/firebase/firebaseConfig";
import { logout } from "@/app/components/AuthFunctions";

const Navbar = () => {
  const router = useRouter();
  const user = getCurrentUser();

  const handleSignOut = () => {
    logout();
    router.replace("/");
  };

  return (
    <div>
      <ul className="flex border-b-2 border-grey">
        <li className="p-2 cursor-pointer">
          {user !== null ? (
            <button onClick={handleSignOut}>Logout</button>
          ) : (
            <Link href={"/login"}>Login</Link>
          )}
        </li>
        <li className="p-2 cursor-pointer">
          <Link href={"/main/calendar"}>Calendar</Link>
        </li>
      </ul>
    </div>
  );
};

export default Navbar;
